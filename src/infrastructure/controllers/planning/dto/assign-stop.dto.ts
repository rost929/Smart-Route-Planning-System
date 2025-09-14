import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AssignStopDto {
  @IsString()
  @IsNotEmpty()
  stopId!: string;

  @IsString()
  @IsNotEmpty()
  vehicleId!: string;

  @IsNumber()
  @Min(0)
  position!: number;
}