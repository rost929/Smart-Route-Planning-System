import { RoutePlan } from '../../domain/entities/route-plan.entity';

export interface IRoutePlanRepository {
  findById(id: string | number): Promise<RoutePlan | null>;
  update(routePlan: RoutePlan): Promise<RoutePlan>;
}
