import { Module } from '@nestjs/common';
import { DiTokens } from '../../../application/di.tokens';
import { GenerateRoutePlanUseCase } from '../../../application/use-cases/generate-route-plan.use-case';
import { OptimizeRoutePlanUseCase } from '../../../application/use-cases/optimize-route-plan.use-case';
import { InMemoryRoutePlanRepository } from '../../database/in-memory/in-memory-route-plan.repository';
import { InMemoryStopRepository } from '../../database/in-memory/in-memory-stop.repository';
import { InMemoryVehicleRepository } from '../../database/in-memory/in-memory-vehicle.repository';
import { SimpleRouteOptimizerService } from '../../services/simple-route-optimizer.service';
import { PlanningController } from './planning.controller'; // Import the controller


@Module({
  providers: [
    GenerateRoutePlanUseCase,
    OptimizeRoutePlanUseCase,
    {
      provide: DiTokens.VehicleRepository,
      useClass: InMemoryVehicleRepository,
    },
    {
      provide: DiTokens.StopRepository,
      useClass: InMemoryStopRepository,
    },
    {
      provide: DiTokens.RoutePlanRepository,
      useClass: InMemoryRoutePlanRepository,
    },
    {
      provide: DiTokens.RouteOptimizerService,
      useClass: SimpleRouteOptimizerService,
    },
  ],
  controllers: [PlanningController],
  exports: [GenerateRoutePlanUseCase, OptimizeRoutePlanUseCase],
})
export class PlanningModule {}