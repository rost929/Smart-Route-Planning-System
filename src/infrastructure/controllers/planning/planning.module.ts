import { Module } from '@nestjs/common';
import { DiTokens } from '../../../application/di.tokens';
import { GenerateRoutePlanUseCase } from '../../../application/use-cases/generate-route-plan.use-case';
import { OptimizeRoutePlanUseCase } from '../../../application/use-cases/optimize-route-plan.use-case';
import { GetRoutePlanUseCase } from '../../../application/use-cases/get-route-plan.use-case';
import { AssignStopManuallyUseCase } from '../../../application/use-cases/assign-stop-manually.use-case';
import { UpdateStopStatusUseCase } from '../../../application/interfaces/update.status.use-case';
import { GenerateEfficiencyReportUseCase } from '../../../application/use-cases/generate-efficiency-report.use-case';
import { InMemoryRoutePlanRepository } from '../../database/in-memory/in-memory-route-plan.repository';
import { InMemoryStopRepository } from '../../database/in-memory/in-memory-stop.repository';
import { InMemoryVehicleRepository } from '../../database/in-memory/in-memory-vehicle.repository';
import { InMemoryRouteRepository } from '../../database/in-memory/in-memory-route.repository';
import { SimpleRouteOptimizerService } from '../../services/simple-route-optimizer.service';
import { SimpleRouteCalculationService } from '../../services/simple-route-calculation.service';
import { SimpleReportGenerationService } from '../../services/simple-report-generation.service';
import { PlanningController } from './planning.controller';

@Module({
  providers: [
    GenerateRoutePlanUseCase,
    OptimizeRoutePlanUseCase,
    GetRoutePlanUseCase,
    AssignStopManuallyUseCase,
    UpdateStopStatusUseCase,
    GenerateEfficiencyReportUseCase,
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
    {
      provide: DiTokens.RouteRepository,
      useClass: InMemoryRouteRepository,
    },
    {
      provide: DiTokens.RouteCalculationService,
      useClass: SimpleRouteCalculationService,
    },
    {
      provide: DiTokens.ReportGenerationService,
      useClass: SimpleReportGenerationService,
    },
  ],
  controllers: [PlanningController],
  exports: [
    GenerateRoutePlanUseCase,
    OptimizeRoutePlanUseCase,
    GetRoutePlanUseCase,
    AssignStopManuallyUseCase,
    UpdateStopStatusUseCase,
    GenerateEfficiencyReportUseCase,
  ],
})
export class PlanningModule {}
