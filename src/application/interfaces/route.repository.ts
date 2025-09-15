import { Route } from '../../domain/entities/route.entity';

export interface IRouteRepository {
  findByVehicleId(vehicleId: string): Promise<Route | null>;
  update(route: Route): Promise<Route>;
}
