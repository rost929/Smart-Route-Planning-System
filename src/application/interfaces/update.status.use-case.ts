import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Stop, StopStatus } from '../../domain/entities/stop.entity';
import { DiTokens } from '../di.tokens';
import { IStopRepository } from '../interfaces/stop.repository';

export interface UpdateStopStatusInput {
  stopId: string;
  status: StopStatus;
}

@Injectable()
export class UpdateStopStatusUseCase {
  constructor(
    @Inject(DiTokens.StopRepository)
    private readonly stopRepository: IStopRepository,
  ) {}

  /**
   * Executes the use case to update the status of a specific stop.
   * @param input - The ID of the stop and its new status.
   * @returns A promise that resolves to the updated Stop entity.
   */
  async execute(input: UpdateStopStatusInput): Promise<Stop> {
    // 1. Find the stop.
    const stop = await this.stopRepository.findById(input.stopId);
    if (!stop) {
      throw new NotFoundException(`Stop with ID "${input.stopId}" not found.`);
    }

    // 2. Update the status.
    // In a real app, you might have more complex logic here (e.g., state machine validation).
    stop.status = input.status;

    // 3. Persist the change and return the updated entity.
    const updatedStop = await this.stopRepository.update(stop);
    return updatedStop;
  }
}