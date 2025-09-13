import { Route } from '../../domain/entities/route.entity';
import { Stop } from '../../domain/entities/stop.entity';
import { Vehicle } from '../../domain/entities/vehicle.entity';

export interface IRouteOptimizerService {
  optimize(vehicles: Vehicle[], stops: Stop[]): Route[];
}