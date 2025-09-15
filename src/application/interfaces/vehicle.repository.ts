import { Vehicle } from '../../domain/entities/vehicle.entity';

export interface IVehicleRepository {
  findAvailableVehicles(): Promise<Vehicle[]>;
  findByIds(ids: (string | number)[]): Promise<Vehicle[]>;
}
