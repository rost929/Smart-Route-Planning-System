import { Injectable, NotFoundException } from '@nestjs/common';
import { IStopRepository } from '../../../application/interfaces/stop.repository';
import { Stop } from '../../../domain/entities/stop.entity';
import { StopStatus } from '../../../domain/entities/stop.entity';

@Injectable()
export class InMemoryStopRepository implements IStopRepository {
  private readonly stops: Stop[] = [
    new Stop(
      'stop-01',
      '123 Main St, Anytown, USA',
      { latitude: 40.7129, longitude: -74.0061 },
      [{ start: '09:00', end: '12:00' }],
      20, // service time in minutes
      { weight: 100, volume: 2, nature: 'electronics' },
      StopStatus.PENDING,
      'client-01',
    ),
    new Stop(
      'stop-02',
      '456 Oak Ave, Sometown, USA',
      { latitude: 40.7135, longitude: -74.007 },
      [{ start: '10:00', end: '13:00' }],
      15,
      { weight: 50, volume: 1, nature: 'documents' },
      StopStatus.PENDING,
      'client-02',
    ),
    new Stop(
      'stop-03',
      '789 Pine Ln, Othertown, USA',
      { latitude: 34.0525, longitude: -118.244 },
      [{ start: '14:00', end: '17:00' }],
      30,
      { weight: 300, volume: 5, nature: 'furniture' },
      StopStatus.PENDING,
      'client-03',
    ),
    new Stop(
      'stop-04',
      '101 Maple Dr, Anothertown, USA',
      { latitude: 34.053, longitude: -118.245 },
      [{ start: '09:00', end: '11:00' }],
      25,
      { weight: 200, volume: 3, nature: 'groceries' },
      StopStatus.PENDING,
      'client-04',
    ),
  ];

  /**
   * Finds all stops that are pending for a specific date.
   * NOTE: For this in-memory version, we ignore the date and return all pending stops.
   * A real implementation would filter by date.
   * @param date - The date for which to find pending stops (ignored in this implementation).
   * @returns A promise that resolves to an array of pending Stop entities.
   */
  async findPendingStopsByDate(date: Date): Promise<Stop[]> {
    console.log(`Finding stops for date: ${date.toISOString()}`); // To show it's being called
    return this.stops.filter((stop) => stop.status === StopStatus.PENDING);
  }

  /**
   * Finds multiple Stop entities by their IDs.
   * @param ids - An array of stop IDs.
   * @returns A promise that resolves to an array of matching Stop entities.
   */
  async findByIds(ids: (string | number)[]): Promise<Stop[]> {
    const idSet = new Set(ids);
    return this.stops.filter((stop) => idSet.has(stop.id));
  }

  /**
   * Finds a single Stop entity by its ID.
   * @param id - The ID of the stop to find.
   * @returns A promise that resolves to the Stop entity or null if not found.
   */
  async findById(id: string): Promise<Stop | null> {
    const stop = this.stops.find((s) => s.id === id);
    return stop || null;
  }

  /**
   * Updates an existing stop in the in-memory store.
   * @param stop - The stop entity with updated data.
   * @returns A promise that resolves to the updated Stop entity.
   * @throws {NotFoundException} if the stop does not exist in the store.
   */
  async update(stop: Stop): Promise<Stop> {
    const stopIndex = this.stops.findIndex((s) => s.id === stop.id);
    if (stopIndex === -1) {
      throw new NotFoundException(
        `Stop with ID "${stop.id}" not found for update.`,
      );
    }
    this.stops[stopIndex] = stop;
    return stop;
  }
}
