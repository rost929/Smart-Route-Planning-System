import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GenerateRoutePlanUseCase } from '../../../application/use-cases/generate-route-plan.use-case';
import { OptimizeRoutePlanUseCase } from '../../../application/use-cases/optimize-route-plan.use-case';
import { GetRoutePlanUseCase } from '../../../application/use-cases/get-route-plan.use-case';
import { AssignStopManuallyUseCase } from '../../../application/use-cases/assign-stop-manually.use-case';
import { GeneratePlanDto } from './dto/generate-plan.dto';
import { OptimizePlanDto } from './dto/optimize-plan.dto';
import { AssignStopDto } from './dto/assign-stop.dto';

@Controller('planning')
export class PlanningController {
  constructor(
    private readonly generateRoutePlanUseCase: GenerateRoutePlanUseCase,
    private readonly optimizeRoutePlanUseCase: OptimizeRoutePlanUseCase,
    private readonly getRoutePlanUseCase: GetRoutePlanUseCase,
    private readonly assignStopManuallyUseCase: AssignStopManuallyUseCase,
  ) {}

  /**
   * Endpoint to generate a new, optimized route plan for a given date.
   * POST /planning/generate
   */
  @Post('generate')
  async generatePlan(@Body() generatePlanDto: GeneratePlanDto) {
    // The controller's job is to orchestrate:
    // 1. Receive and validate the HTTP request (done by NestJS + DTO).
    // 2. Map the DTO to the use case input.
    // 3. Execute the use case.
    // 4. Return the result.
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

  @Post('assign-stop')
  async assignStop(@Body() assignStopDto: AssignStopDto) {
    return this.assignStopManuallyUseCase.execute(assignStopDto);
  }
}