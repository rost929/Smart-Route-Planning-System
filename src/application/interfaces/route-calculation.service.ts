import { Route } from '../../domain/entities/route.entity';

export interface IRouteCalculationService {
  recalculate(
    route: Route,
  ): Promise<{ totalDistance: number; totalTravelTime: number }>;
}
