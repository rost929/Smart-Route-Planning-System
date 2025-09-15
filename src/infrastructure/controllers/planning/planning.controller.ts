import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GenerateRoutePlanUseCase } from '../../../application/use-cases/generate-route-plan.use-case';
import { OptimizeRoutePlanUseCase } from '../../../application/use-cases/optimize-route-plan.use-case';
import { GetRoutePlanUseCase } from '../../../application/use-cases/get-route-plan.use-case';
import { AssignStopManuallyUseCase } from '../../../application/use-cases/assign-stop-manually.use-case';
import { UpdateStopStatusUseCase } from '../../../application/interfaces/update.status.use-case';
import { GenerateEfficiencyReportUseCase } from '../../../application/use-cases/generate-efficiency-report.use-case';
import { GeneratePlanDto } from './dto/generate-plan.dto';
import { OptimizePlanDto } from './dto/optimize-plan.dto';
import { AssignStopDto } from './dto/assign-stop.dto';
import { UpdateStopStatusDto } from './dto/update-stop-status.dto';

@Controller('planning')
export class PlanningController {
  constructor(
    private readonly generateRoutePlanUseCase: GenerateRoutePlanUseCase,
    private readonly optimizeRoutePlanUseCase: OptimizeRoutePlanUseCase,
    private readonly getRoutePlanUseCase: GetRoutePlanUseCase,
    private readonly assignStopManuallyUseCase: AssignStopManuallyUseCase,
    private readonly updateStopStatusUseCase: UpdateStopStatusUseCase,
    private readonly generateEfficiencyReportUseCase: GenerateEfficiencyReportUseCase,
  ) {}

  /**
   * Endpoint to generate a new, optimized route plan for a given date.
   * POST /planning/generate
   */
  @Post('generate')
  async generatePlan(@Body() generatePlanDto: GeneratePlanDto) {
    return this.generateRoutePlanUseCase.execute({
      date: new Date(generatePlanDto.date),
    });
  }

  /**
   * Endpoint to re-optimize an existing route plan.
   * POST /planning/optimize
   */
  @Post('optimize')
  async optimizePlan(@Body() optimizePlanDto: OptimizePlanDto) {
    return this.optimizeRoutePlanUseCase.execute({
      routePlanId: optimizePlanDto.routePlanId,
    });
  }

  /**
   * Endpoint to retrieve a specific route plan by its ID.
   * GET /planning/:id
   */
  @Get(':id')
  async getPlan(@Param('id') id: string) {
    return this.getRoutePlanUseCase.execute({
      routePlanId: id,
    });
  }

  /**
   * Endpoint to manually assign a stop to a specific position in a route.
   * POST /planning/assign-stop
   */
  @Post('assign-stop')
  async assignStop(@Body() assignStopDto: AssignStopDto) {
    return this.assignStopManuallyUseCase.execute(assignStopDto);
  }

  /**
   * Endpoint to update the status of a single stop.
   * PATCH /planning/stop-status
   */
  @Patch('stop-status')
  async updateStopStatus(@Body() updateStopStatusDto: UpdateStopStatusDto) {
    return this.updateStopStatusUseCase.execute(updateStopStatusDto);
  }

  /**
   * Endpoint to generate an efficiency report for a specific route plan.
   * GET /planning/report/:id
   */
  @Get('report/:id')
  async getReport(@Param('id') id: string) {
    return this.generateEfficiencyReportUseCase.execute({
      routePlanId: id,
    });
  }
}
