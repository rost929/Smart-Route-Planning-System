import { Inject, Injectable } from '@nestjs/common';
import { RoutePlan } from '../../domain/entities/route-plan.entity';
import { DiTokens } from '../di.tokens';
import { IRouteOptimizerService } from '../interfaces/route-optimizer.service';
import { IStopRepository } from '../interfaces/stop.repository';
import { IVehicleRepository } from '../interfaces/vehicle.repository';

/**
 * Defines the input data structure for the GenerateRoutePlanUseCase.
 */
export interface GenerateRoutePlanInput {
  date: Date;
}

@Injectable()
export class GenerateRoutePlanUseCase {
  // Dependencies are injected by the NestJS IoC container using runtime-safe tokens.
  // This upholds the Dependency Inversion Principle while leveraging the framework's power.
  constructor(
    @Inject(DiTokens.VehicleRepository)
    private readonly vehicleRepository: IVehicleRepository,
    @Inject(DiTokens.StopRepository)
    private readonly stopRepository: IStopRepository,
    @Inject(DiTokens.RouteOptimizerService)
    private readonly routeOptimizer: IRouteOptimizerService,
  ) {}

  /**
   * Executes the use case to generate an optimized route plan.
   * @param input - The data required for planning, such as the date.
   * @returns A promise that resolves to a new RoutePlan entity.
   */
  async execute(input: GenerateRoutePlanInput): Promise<RoutePlan> {
    // 1. Fetch the necessary data using the repository interfaces.
    const availableVehicles =
      await this.vehicleRepository.findAvailableVehicles();
    const pendingStops = await this.stopRepository.findPendingStopsByDate(
      input.date,
    );

    if (availableVehicles.length === 0 || pendingStops.length === 0) {
      console.warn(
        'No available vehicles or pending stops to generate a route plan.',
      );
      // In a real-world scenario, you might throw a specific exception.
      return new RoutePlan(Date.now().toString(), [], input.date);
    }

    // 2. Delegate the complex optimization logic to a specialized domain service.
    const optimizedRoutes = this.routeOptimizer.optimize(
      availableVehicles,
      pendingStops,
    );

    // 3. Create and return the final route plan entity.
    const routePlanId = `plan-${Date.now()}`; // A UUID would be better here.
    const newRoutePlan = new RoutePlan(
      routePlanId,
      optimizedRoutes,
      input.date,
    );

    return newRoutePlan;
  }
}
