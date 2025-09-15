import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DiTokens } from '../di.tokens';
import { IReportGenerationService } from '../interfaces/report-generation.service';
import { IRoutePlanRepository } from '../interfaces/route-plan.repository';
import { EfficiencyReportDto } from '../reports/efficiency-report.dto';

export interface GenerateEfficiencyReportInput {
  routePlanId: string;
}

@Injectable()
export class GenerateEfficiencyReportUseCase {
  constructor(
    @Inject(DiTokens.RoutePlanRepository)
    private readonly routePlanRepository: IRoutePlanRepository,
    @Inject(DiTokens.ReportGenerationService)
    private readonly reportService: IReportGenerationService,
  ) {}

  async execute(input: GenerateEfficiencyReportInput): Promise<EfficiencyReportDto> {
    // 1. Fetch the route plan.
    const routePlan = await this.routePlanRepository.findById(input.routePlanId);
    if (!routePlan) {
      throw new NotFoundException(`RoutePlan with ID "${input.routePlanId}" not found.`);
    }

    // 2. Delegate the complex calculation logic to the specialized service.
    const report = await this.reportService.generate(routePlan);

    return report;
  }
}