import { IsDateString, IsNotEmpty } from 'class-validator';

export class GeneratePlanDto {
  @IsNotEmpty()
  @IsDateString()
  date!: string;
}
