import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Route } from '../../domain/entities/route.entity';
import { DiTokens } from '../di.tokens';
import { IRouteCalculationService } from '../interfaces/route-calculation.service';
import { IRouteRepository } from '../interfaces/route.repository';
import { IStopRepository } from '../interfaces/stop.repository';

export interface AssignStopManuallyInput {
  stopId: string;
  vehicleId: string;
  position: number;
}

@Injectable()
export class AssignStopManuallyUseCase {
  constructor(
    @Inject(DiTokens.RouteRepository)
    private readonly routeRepository: IRouteRepository,
    @Inject(DiTokens.StopRepository)
    private readonly stopRepository: IStopRepository,
    @Inject(DiTokens.RouteCalculationService)
    private readonly calculationService: IRouteCalculationService,
  ) {}

  async execute(input: AssignStopManuallyInput): Promise<Route> {
    // 1. Validate that the stop and route exist.
    const stop = await this.stopRepository.findByIds([input.stopId]);
    if (!stop.length) {
      throw new NotFoundException(`Stop with ID "${input.stopId}" not found.`);
    }

    const route = await this.routeRepository.findByVehicleId(input.vehicleId);
    if (!route) {
      throw new NotFoundException(`Route for vehicle ID "${input.vehicleId}" not found.`);
    }

    // 2. Modify the route's stop list.
    route.orderedStops.splice(input.position, 0, input.stopId);

    // 3. Recalculate route properties using the dedicated service.
    const { totalDistance, totalTravelTime } = await this.calculationService.recalculate(route);
    route.totalDistance = totalDistance;
    route.totalTravelTime = totalTravelTime;

    // 4. Persist the changes and return the updated route.
    const updatedRoute = await this.routeRepository.update(route);
    return updatedRoute;
  }
}