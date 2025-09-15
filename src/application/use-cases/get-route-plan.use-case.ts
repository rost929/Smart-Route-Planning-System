import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RoutePlan } from '../../domain/entities/route-plan.entity';
import { DiTokens } from '../di.tokens';
import { IRoutePlanRepository } from '../interfaces/route-plan.repository';

export interface GetRoutePlanInput {
  routePlanId: string;
}

@Injectable()
export class GetRoutePlanUseCase {
  constructor(
    @Inject(DiTokens.RoutePlanRepository)
    private readonly routePlanRepository: IRoutePlanRepository,
  ) {}

  /**
   * Executes the use case to retrieve a specific route plan by its ID.
   * @param input - The ID of the route plan to retrieve.
   * @returns A promise that resolves to the found RoutePlan entity.
   * @throws {NotFoundException} if the route plan does not exist.
   */
  async execute(input: GetRoutePlanInput): Promise<RoutePlan> {
    const routePlan = await this.routePlanRepository.findById(
      input.routePlanId,
    );

    if (!routePlan) {
      throw new NotFoundException(
        `RoutePlan with ID "${input.routePlanId}" not found.`,
      );
    }

    return routePlan;
  }
}
