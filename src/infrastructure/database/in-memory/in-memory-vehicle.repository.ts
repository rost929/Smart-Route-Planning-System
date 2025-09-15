import { Injectable } from '@nestjs/common';
import { IVehicleRepository } from '../../../application/interfaces/vehicle.repository';
import { Vehicle } from '../../../domain/entities/vehicle.entity';

@Injectable()
export class InMemoryVehicleRepository implements IVehicleRepository {
  private readonly vehicles: Vehicle[] = [
    new Vehicle(
      'vehicle-01',
      'truck',
      { weight: 5000, volume: 30 },
      { startTime: '08:00', endTime: '18:00' },
      { latitude: 40.7128, longitude: -74.006 }, // NYC
      { latitude: 40.7128, longitude: -74.006 },
      1.5,
      true,
    ),
    new Vehicle(
      'vehicle-02',
      'van',
      { weight: 1000, volume: 10 },
      { startTime: '09:00', endTime: '17:00' },
      { latitude: 34.0522, longitude: -118.2437 }, // LA
      { latitude: 34.0522, longitude: -118.2437 },
      1.2,
      true,
    ),
    new Vehicle(
      'vehicle-03',
      'motorcycle',
      { weight: 50, volume: 1 },
      { startTime: '10:00', endTime: '16:00' },
      { latitude: 41.8781, longitude: -87.6298 }, // Chicago
      { latitude: 41.8781, longitude: -87.6298 },
      0.8,
      false, // This one is not available
    ),
  ];

  /**
   * Finds all vehicles that are marked as available.
   * @returns A promise that resolves to an array of available Vehicle entities.
   */
  async findAvailableVehicles(): Promise<Vehicle[]> {
    return this.vehicles.filter((vehicle) => vehicle.availability);
  }

  /**
   * Finds multiple Vehicle entities by their IDs.
   * @param ids - An array of vehicle IDs.
   * @returns A promise that resolves to an array of matching Vehicle entities.
   */
  async findByIds(ids: (string | number)[]): Promise<Vehicle[]> {
    const idSet = new Set(ids);
    return this.vehicles.filter((vehicle) => idSet.has(vehicle.id));
  }
}
