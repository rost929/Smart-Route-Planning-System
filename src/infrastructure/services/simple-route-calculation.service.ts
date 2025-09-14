import { Injectable } from '@nestjs/common';
import { IRouteCalculationService } from '../../application/interfaces/route-calculation.service';
import { Route } from '../../domain/entities/route.entity';

@Injectable()
export class SimpleRouteCalculationService implements IRouteCalculationService {
  async recalculate(route: Route): Promise<{ totalDistance: number; totalTravelTime: number; }> {
    const totalDistance = route.orderedStops.length * 10;
    const totalTravelTime = route.orderedStops.length * 15;
    return { totalDistance, totalTravelTime };
  }
}