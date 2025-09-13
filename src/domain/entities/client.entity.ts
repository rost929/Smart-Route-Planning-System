export class Client {
  constructor(
    public id: string,
    public fullName: string,
    public email: string,
    public phone: string,
    public savedAddresses: { address: string; coordinates: { latitude: number; longitude: number } }[]
  ) {}
}