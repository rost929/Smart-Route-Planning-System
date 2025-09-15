import { IsNotEmpty, IsString } from 'class-validator';

export class OptimizePlanDto {
  @IsNotEmpty()
  @IsString()
  routePlanId!: string;
}
