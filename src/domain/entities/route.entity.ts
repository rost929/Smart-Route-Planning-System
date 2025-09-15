export class Route {
  constructor(
    public id: string,
    public assignedVehicleId: string | number,
    public orderedStops: string[], // List of Stop IDs
    public totalDistance: number, // in km or miles
    public totalTravelTime: number, // in minutes
    public estimatedStartTime: Date,
  ) {}
}
