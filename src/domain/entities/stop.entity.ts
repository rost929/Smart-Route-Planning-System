export class Stop {
  constructor(
    public id: string,
    public address: string,
    public coordinates: { latitude: number; longitude: number },
    public timeWindow: { start: string; end: string }[], // Array of time ranges
    public estimatedServiceTime: number, // in minutes
    public payload: { weight: number; volume: number; nature: string },
    public status: 'pending' | 'completed' | 'skipped', // Enumeration
    public associatedClientId: string | number // Reference to Client ID
  ) {}
}