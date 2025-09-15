export class Vehicle {
  constructor(
    public id: string,
    public vehicleType: 'van' | 'motorcycle' | 'truck',
    public cargoCapacity: { weight: number; volume: number },
    public workSchedule: { startTime: string; endTime: string },
    public startLocation: { latitude: number; longitude: number },
    public endLocation: { latitude: number; longitude: number },
    public costPerKilometer: number,
    public availability: boolean,
  ) {}
}
