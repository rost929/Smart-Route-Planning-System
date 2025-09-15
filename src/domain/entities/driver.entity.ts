export class Driver {
  constructor(
    public id: string,
    public name: string,
    public licenseNumber: string,
    public phoneNumber: string,
    public email: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
