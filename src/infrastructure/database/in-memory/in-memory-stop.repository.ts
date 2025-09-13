import { Injectable } from '@nestjs/common';
import { IStopRepository } from '../../../application/interfaces/stop.repository';
import { Stop } from '../../../domain/entities/stop.entity';

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
      'pending',
      'client-01',
    ),
    new Stop(
      'stop-02',
      '456 Oak Ave, Sometown, USA',
      { latitude: 40.7135, longitude: -74.0070 },
      [{ start: '10:00', end: '13:00' }],
      15,
      { weight: 50, volume: 1, nature: 'documents' },
      'pending',
      'client-02',
    ),
    new Stop(
      'stop-03',
      '789 Pine Ln, Othertown, USA',
      { latitude: 34.0525, longitude: -118.2440 },
      [{ start: '14:00', end: '17:00' }],
      30,
      { weight: 300, volume: 5, nature: 'furniture' },
      'pending',
      'client-03',
    ),
    new Stop(
      'stop-04',
      '101 Maple Dr, Anothertown, USA',
      { latitude: 34.0530, longitude: -118.2450 },
      [{ start: '09:00', end: '11:00' }],
      25,
      { weight: 200, volume: 3, nature: 'groceries' },
      'pending',
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
    return this.stops.filter(stop => stop.status === 'pending');
  }

  /**
   * Finds multiple Stop entities by their IDs.
   * @param ids - An array of stop IDs.
   * @returns A promise that resolves to an array of matching Stop entities.
   */
  async findByIds(ids: (string | number)[]): Promise<Stop[]> {
    const idSet = new Set(ids);
    return this.stops.filter(stop => idSet.has(stop.id));
  }
}