import { Injectable, NotFoundException } from '@nestjs/common';
import { IRoutePlanRepository } from '../../../application/interfaces/route-plan.repository';
import { Route } from '../../../domain/entities/route.entity';
import { RoutePlan } from '../../../domain/entities/route-plan.entity';

@Injectable()
export class InMemoryRoutePlanRepository implements IRoutePlanRepository {
  private readonly routePlans: RoutePlan[] = [
    new RoutePlan(
      'plan-to-optimize-01',
      [
        new Route(
          'route-01',
          'vehicle-01',
          ['stop-01', 'stop-02'],
          10,
          30,
          new Date(),
        ),
        new Route(
          'route-02',
          'vehicle-02',
          ['stop-03', 'stop-04'],
          15,
          45,
          new Date(),
        ),
      ],
      new Date(),
    ),
  ];

  /**
   * Finds a RoutePlan by its unique ID.
   * @param id - The ID of the route plan.
   * @returns A promise that resolves to the RoutePlan entity or null if not found.
   */
  async findById(id: string | number): Promise<RoutePlan | null> {
    const plan = this.routePlans.find((p) => p.id === id);
    return plan || null;
  }

  /**
   * Updates an existing route plan.
   * In a real DB, this would be an UPDATE operation. Here, we find and replace.
   * @param routePlan - The route plan entity with updated data.
   * @returns A promise that resolves to the updated RoutePlan entity.
   */
  async update(routePlan: RoutePlan): Promise<RoutePlan> {
    const planIndex = this.routePlans.findIndex((p) => p.id === routePlan.id);

    if (planIndex === -1) {
      throw new NotFoundException(
        `RoutePlan with ID "${routePlan.id}" not found for update.`,
      );
    }

    // Replace the old plan with the updated one.
    this.routePlans[planIndex] = routePlan;

    return routePlan;
  }
}
