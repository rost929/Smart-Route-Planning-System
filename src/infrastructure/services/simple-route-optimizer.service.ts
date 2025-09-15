import { Injectable } from '@nestjs/common';
import { IRouteOptimizerService } from '../../application/interfaces/route-optimizer.service';
import { Route } from '../../domain/entities/route.entity';
import { Stop } from '../../domain/entities/stop.entity';
import { Vehicle } from '../../domain/entities/vehicle.entity';

/**
 * A simple, placeholder implementation of the IRouteOptimizerService.
 * In a real-world application, this service would contain complex logic
 * to solve the Vehicle Routing Problem (VRP), possibly by calling an
 * external API (e.g., Google OR-Tools, Mapbox Optimization API) or
 * using a specialized library.
 */
@Injectable()
export class SimpleRouteOptimizerService implements IRouteOptimizerService {
  /**
   * "Optimizes" routes by simply distributing stops evenly among available vehicles.
   * This is a naive implementation for demonstration purposes.
   * @param vehicles - The available vehicles.
   * @param stops - The stops that need to be routed.
   * @returns An array of Route entities.
   */
  optimize(vehicles: Vehicle[], stops: Stop[]): Route[] {
    if (vehicles.length === 0 || stops.length === 0) {
      return [];
    }

    const routes: Route[] = [];
    const stopsPerVehicle = Math.ceil(stops.length / vehicles.length);

    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];
      const assignedStops = stops.slice(
        i * stopsPerVehicle,
        (i + 1) * stopsPerVehicle,
      );

      if (assignedStops.length > 0) {
        // In a real implementation, we would calculate distance and time
        // based on the coordinates of the stops and the vehicle's start/end location.
        const dummyDistance = assignedStops.length * 10; // e.g., 10 km per stop
        const dummyTravelTime = assignedStops.length * 15; // e.g., 15 minutes per stop

        const route = new Route(
          `route-${Date.now()}-${i}`,
          vehicle.id,
          assignedStops.map((stop) => stop.id),
          dummyDistance,
          dummyTravelTime,
          new Date(), // Should be based on the planning date
        );
        routes.push(route);
      }
    }

    return routes;
  }
}
