import { Stop } from '../../domain/entities/stop.entity';

export interface IStopRepository {
  findPendingStopsByDate(date: Date): Promise<Stop[]>;
  findByIds(ids: (string | number)[]): Promise<Stop[]>;
}