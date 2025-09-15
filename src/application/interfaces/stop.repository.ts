import { Stop } from '../../domain/entities/stop.entity';

export interface IStopRepository {
  findPendingStopsByDate(date: Date): Promise<Stop[]>;
  findByIds(ids: (string | number)[]): Promise<Stop[]>;
  findById(id: string): Promise<Stop | null>;
  update(stop: Stop): Promise<Stop>;
}