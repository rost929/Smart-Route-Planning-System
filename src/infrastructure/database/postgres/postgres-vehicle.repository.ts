import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { IVehicleRepository } from '../../../application/interfaces/vehicle.repository';
import { Vehicle } from '../../../domain/entities/vehicle.entity';

@Injectable()
export class PostgresVehicleRepository implements IVehicleRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async findAvailableVehicles(): Promise<Vehicle[]> {
    const query = `SELECT * FROM vehicles`;
    try {
      const result = await this.pool.query(query);
      return result.rows.map(this.mapToDomain);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch available vehicles',
        String(error),
      );
    }
  }

  async findByIds(ids: (string | number)[]): Promise<Vehicle[]> {
    if (ids.length === 0) {
      return [];
    }
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    const query = `SELECT * FROM vehicles WHERE id IN (${placeholders})`;
    try {
      // El array de IDs se pasa directamente como valores.
      const result = await this.pool.query(query, ids);
      return result.rows.map(this.mapToDomain);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch vehicles by IDs',
        String(error),
      );
    }
  }

  private mapToDomain(row: any): Vehicle {
    return new Vehicle(
      row.id,
      row.model,
      row.capacity,
      row.workSchedule,
      row.startLocation,
      row.currentLocation,
      row.speed,
      row.availability,
    );
  }
}
