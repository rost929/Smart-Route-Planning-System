import { Injectable } from '@nestjs/common';
import { IReportGenerationService } from '../../application/interfaces/report-generation.service';
import { EfficiencyReportDto } from '../../application/reports/efficiency-report.dto';
import { RoutePlan } from '../../domain/entities/route-plan.entity';

@Injectable()
export class SimpleReportGenerationService implements IReportGenerationService {
  // A fixed cost per distance unit for dummy calculations (e.g., $1.5 per km).
  private readonly COST_PER_DISTANCE_UNIT = 1.5;

  async generate(routePlan: RoutePlan): Promise<EfficiencyReportDto> {
    const totalDistance = routePlan.routes.reduce(
      (sum, route) => sum + route.totalDistance,
      0,
    );
    const totalStops = routePlan.routes.reduce(
      (sum, route) => sum + route.orderedStops.length,
      0,
    );
    const totalCost = totalDistance * this.COST_PER_DISTANCE_UNIT;

    const report: EfficiencyReportDto = {
      routePlanId: routePlan.id,
      planningDate: routePlan.planningDate,
      totalRoutes: routePlan.routes.length,
      totalStops: totalStops,
      totalDistance: totalDistance,
      totalCost: totalCost,
      onTimeDeliveryPercentage: 95.5,
      costPerDistanceUnit: totalDistance > 0 ? totalCost / totalDistance : 0,
    };

    return report;
  }
}
