import { Module } from '@nestjs/common';
import { PlanningModule } from './infrastructure/controllers/planning/planning.module'; // 1. Import your module
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que el ConfigService esté disponible globalmente
    }),
    DatabaseModule,
    PlanningModule,
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
