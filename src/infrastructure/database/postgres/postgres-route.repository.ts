import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { IRouteRepository } from '../../../application/interfaces/route.repository';
import { Route } from '../../../domain/entities/route.entity';

@Injectable()
export class PostgresRouteRepository implements IRouteRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async findByVehicleId(vehicleId: string): Promise<Route | null> {
    const query = `SELECT * FROM routes WHERE "assignedVehicleId" = $1`;
    try {
      const result = await this.pool.query(query, [vehicleId]);
      return result.rows.length > 0 ? this.mapToDomain(result.rows[0]) : null;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch route by vehicle ID', String(error));
    }
  }

  async update(route: Route): Promise<Route> {
    const query = `
      UPDATE routes
      SET "orderedStops" = $2, "totalDistance" = $3, "totalTravelTime" = $4, "estimatedStartTime" = $5
      WHERE id = $1
      RETURNING *;
    `;
    const values = [
      route.id,
      route.orderedStops,
      route.totalDistance,
      route.totalTravelTime,
      route.estimatedStartTime,
    ];
    try {
      const result = await this.pool.query(query, values);
      if (result.rowCount === 0) {
        throw new NotFoundException(`Route with ID "${route.id}" not found.`);
      }
      return this.mapToDomain(result.rows[0]);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update route', String(error));
    }
  }

  private mapToDomain(row: any): Route {
    return new Route(
      row.id,
      row.assignedVehicleId,
      row.orderedStops,
      row.totalDistance,
      row.totalTravelTime,
      new Date(row.estimatedStartTime),
    );
  }
}