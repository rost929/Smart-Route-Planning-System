import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { IRoutePlanRepository } from '../../../application/interfaces/route-plan.repository';
import { Route } from '../../../domain/entities/route.entity';
import { RoutePlan } from '../../../domain/entities/route-plan.entity';

@Injectable()
export class PostgresRoutePlanRepository implements IRoutePlanRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async findById(id: string): Promise<RoutePlan | null> {
    const planQuery = `SELECT * FROM route_plans WHERE id = $1`;
    try {
      const planResult = await this.pool.query(planQuery, [id]);
      if (planResult.rows.length === 0) {
        return null;
      }
      const planRow = planResult.rows[0];
      const routeIds: string[] = planRow.routes || [];

      let routes: Route[] = [];
      if (routeIds.length > 0) {
        const routePlaceholders = routeIds.map((_, i) => `$${i + 1}`).join(',');
        const routesQuery = `SELECT * FROM routes WHERE id IN (${routePlaceholders})`;
        const routesResult = await this.pool.query(routesQuery, routeIds);
        routes = routesResult.rows.map(this.mapRowToRoute);
      }

      return new RoutePlan(planRow.id, routes, new Date(planRow.planningDate));
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch route plan by ID', String(error));
    }
  }

  async update(routePlan: RoutePlan): Promise<RoutePlan> {
    const query = `
      UPDATE route_plans
      SET routes = $2, "planningDate" = $3
      WHERE id = $1
      RETURNING *;
    `;
    const routeIds = routePlan.routes.map(route => route.id);
    const values = [routePlan.id, routeIds, routePlan.planningDate];

    try {
        const result = await this.pool.query(query, values);
        if (result.rowCount === 0) {
          throw new NotFoundException(`RoutePlan with ID "${routePlan.id}" not found.`);
        }
        return routePlan;

      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Failed to update route plan', String(error));
      }
  }

  private mapRowToRoute(row: any): Route {
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