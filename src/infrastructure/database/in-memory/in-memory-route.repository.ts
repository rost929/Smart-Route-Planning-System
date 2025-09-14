import { Injectable, NotFoundException } from '@nestjs/common';
import { IRouteRepository } from '../../../application/interfaces/route.repository';
import { Route } from '../../../domain/entities/route.entity';

@Injectable()
export class InMemoryRouteRepository implements IRouteRepository {
  private readonly routes: Route[] = [
    new Route('route-01', 'vehicle-01', ['stop-01', 'stop-02'], 10, 30, new Date()),
    new Route('route-02', 'vehicle-02', ['stop-03', 'stop-04'], 15, 45, new Date()),
  ];

  async findByVehicleId(vehicleId: string): Promise<Route | null> {
    const route = this.routes.find(r => r.assignedVehicleId === vehicleId);
    return route || null;
  }

  async update(route: Route): Promise<Route> {
    const routeIndex = this.routes.findIndex(r => r.id === route.id);
    if (routeIndex === -1) {
      throw new NotFoundException(`Route with ID "${route.id}" not found for update.`);
    }
    this.routes[routeIndex] = route;
    return route;
  }
}