import { Module, OnModuleInit, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DiTokens } from '../../../application/di.tokens';

import { InMemoryRoutePlanRepository } from '../../database/in-memory/in-memory-route-plan.repository';
import { InMemoryRouteRepository } from '../../database/in-memory/in-memory-route.repository';
import { InMemoryStopRepository } from '../../database/in-memory/in-memory-stop.repository';
import { InMemoryVehicleRepository } from '../../database/in-memory/in-memory-vehicle.repository';
import { PostgresRoutePlanRepository } from '../../database/postgres/postgres-route-plan.repository';
import { PostgresRouteRepository } from '../../database/postgres/postgres-route.repository';
import { PostgresStopRepository } from '../../database/postgres/postgres-stop.repository';
import { PostgresVehicleRepository } from '../../database/postgres/postgres-vehicle.repository';

import { SimpleRouteOptimizerService } from '../../services/simple-route-optimizer.service';
import { SimpleRouteCalculationService } from '../../services/simple-route-calculation.service';
import { SimpleReportGenerationService } from '../../services/simple-report-generation.service';

import { GenerateRoutePlanUseCase } from '../../../application/use-cases/generate-route-plan.use-case';
import { OptimizeRoutePlanUseCase } from '../../../application/use-cases/optimize-route-plan.use-case';
import { GetRoutePlanUseCase } from '../../../application/use-cases/get-route-plan.use-case';
import { AssignStopManuallyUseCase } from '../../../application/use-cases/assign-stop-manually.use-case';
import { UpdateStopStatusUseCase } from '../../../application/interfaces/update.status.use-case';
import { GenerateEfficiencyReportUseCase } from '../../../application/use-cases/generate-efficiency-report.use-case';

import { PlanningController } from './planning.controller';

interface RepositoryImplementations {
  postgres: any;
  inMemory: any;
}

const repositoryImplementations: { [token: symbol]: RepositoryImplementations } = {
  [DiTokens.VehicleRepository]: {
    postgres: PostgresVehicleRepository,
    inMemory: InMemoryVehicleRepository,
  },
  [DiTokens.StopRepository]: {
    postgres: PostgresStopRepository,
    inMemory: InMemoryStopRepository,
  },
  [DiTokens.RoutePlanRepository]: {
    postgres: PostgresRoutePlanRepository,
    inMemory: InMemoryRoutePlanRepository,
  },
  [DiTokens.RouteRepository]: {
    postgres: PostgresRouteRepository,
    inMemory: InMemoryRouteRepository,
  },
};

const createRepositoryProvider = (token: symbol): Provider => ({
  provide: token,
  inject: [ConfigService, 'DATABASE_POOL'],
  useFactory: (configService: ConfigService, pool: Pool) => {
    const strategy = planningModulePersistenceStrategy;
    const implementations = repositoryImplementations[token];

    if (!implementations) {
      throw new Error(`No implementations found for token: ${token.toString()}`);
    }

    const RepositoryClass = strategy === 'postgres' ? implementations.postgres : implementations.inMemory;

    return (RepositoryClass === PostgresVehicleRepository ||
            RepositoryClass === PostgresStopRepository ||
            RepositoryClass === PostgresRoutePlanRepository ||
            RepositoryClass === PostgresRouteRepository)
      ? new RepositoryClass(pool)
      : new RepositoryClass();
  },
});

@Module({
  controllers: [PlanningController],
  providers: [
    GenerateRoutePlanUseCase,
    OptimizeRoutePlanUseCase,
    GetRoutePlanUseCase,
    AssignStopManuallyUseCase,
    UpdateStopStatusUseCase,
    GenerateEfficiencyReportUseCase,

    createRepositoryProvider(DiTokens.VehicleRepository),
    createRepositoryProvider(DiTokens.StopRepository),
    createRepositoryProvider(DiTokens.RoutePlanRepository),
    createRepositoryProvider(DiTokens.RouteRepository),

    {
      provide: DiTokens.RouteOptimizerService,
      useClass: SimpleRouteOptimizerService,
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
})
export class PlanningModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    planningModulePersistenceStrategy = this.configService.get<string>('PERSISTENCE_STRATEGY') || 'in-memory';
  }
}

let planningModulePersistenceStrategy: string;