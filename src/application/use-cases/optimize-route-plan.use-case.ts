import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RoutePlan } from '../../domain/entities/route-plan.entity';
import { DiTokens } from '../di.tokens';
import { IRouteOptimizerService } from '../interfaces/route-optimizer.service';
import { IRoutePlanRepository } from '../interfaces/route-plan.repository';
import { IStopRepository } from '../interfaces/stop.repository';
import { IVehicleRepository } from '../interfaces/vehicle.repository';

export interface OptimizeRoutePlanInput {
  routePlanId: string | number;
}

@Injectable()
export class OptimizeRoutePlanUseCase {
  constructor(
    @Inject(DiTokens.RoutePlanRepository)
    private readonly routePlanRepository: IRoutePlanRepository,
    @Inject(DiTokens.StopRepository)
    private readonly stopRepository: IStopRepository,
    @Inject(DiTokens.VehicleRepository)
    private readonly vehicleRepository: IVehicleRepository,
    @Inject(DiTokens.RouteOptimizerService)
    private readonly routeOptimizer: IRouteOptimizerService,
  ) {}

  /**
   * Executes the use case to re-optimize an existing route plan.
   * @param input - The ID of the route plan to optimize.
   * @returns A promise that resolves to the updated RoutePlan entity.
   */
  async execute(input: OptimizeRoutePlanInput): Promise<RoutePlan> {
    // 1. Fetch the existing route plan.
    const routePlan = await this.routePlanRepository.findById(
      input.routePlanId,
    );
    if (!routePlan) {
      throw new NotFoundException(
        `RoutePlan with ID "${input.routePlanId}" not found.`,
      );
    }

    // 2. Gather all unique vehicle and stop IDs from the existing routes.
    const vehicleIds = [
      ...new Set(routePlan.routes.map((route) => route.assignedVehicleId)),
    ];
    const stopIds = [
      ...new Set(routePlan.routes.flatMap((route) => route.orderedStops)),
    ];

    // 3. Fetch the full entity objects for the vehicles and stops.
    const vehicles = await this.vehicleRepository.findByIds(vehicleIds);
    const stops = await this.stopRepository.findByIds(stopIds);

    if (vehicles.length === 0 || stops.length === 0) {
      console.warn(
        'No vehicles or stops associated with this plan to optimize.',
      );
      return routePlan; // Return the original plan if there's nothing to optimize.
    }

    // 4. Delegate the re-optimization logic to the specialized service.
    const reOptimizedRoutes = this.routeOptimizer.optimize(vehicles, stops);

    // 5. Update the route plan with the new set of optimized routes.
    routePlan.routes = reOptimizedRoutes;

    // 6. Persist the changes and return the updated plan.
    const updatedRoutePlan = await this.routePlanRepository.update(routePlan);

    return updatedRoutePlan;
  }
}
