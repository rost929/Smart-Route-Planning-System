import { Module } from '@nestjs/common';
import { PlanningModule } from './infrastructure/controllers/planning/planning.module'; // 1. Import your module

@Module({
  imports: [PlanningModule],
  controllers: [],
  providers: [],
})
export class AppModule {}