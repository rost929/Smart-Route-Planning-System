import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { StopStatus } from '../../../../domain/entities/stop.entity';

export class UpdateStopStatusDto {
  @IsString()
  @IsNotEmpty()
  stopId!: string;

  @IsEnum(StopStatus)
  @IsNotEmpty()
  status!: StopStatus;
}
