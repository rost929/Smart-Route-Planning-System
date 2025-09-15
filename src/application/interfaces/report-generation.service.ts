import { RoutePlan } from '../../domain/entities/route-plan.entity';
import { EfficiencyReportDto } from '../reports/efficiency-report.dto';

export interface IReportGenerationService {
  generate(routePlan: RoutePlan): Promise<EfficiencyReportDto>;
}
