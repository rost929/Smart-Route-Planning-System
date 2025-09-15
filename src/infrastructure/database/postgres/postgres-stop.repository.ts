import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Pool } from 'pg';
import { IStopRepository } from '../../../application/interfaces/stop.repository';
import { Stop, StopStatus } from '../../../domain/entities/stop.entity';

@Injectable()
export class PostgresStopRepository implements IStopRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async findPendingStopsByDate(date: Date): Promise<Stop[]> {
    const query = `SELECT * FROM stops WHERE status = $1`;
    try {
      const result = await this.pool.query(query, [StopStatus.PENDING]);
      return result.rows.map(this.mapToDomain);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch pending stops', String(error));
    }
  }

  async findByIds(ids: string[]): Promise<Stop[]> {
    if (ids.length === 0) return [];
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    const query = `SELECT * FROM stops WHERE id IN (${placeholders})`;
    try {
      const result = await this.pool.query(query, ids);
      return result.rows.map(this.mapToDomain);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch stops by IDs', String(error));
    }
  }

  async findById(id: string): Promise<Stop | null> {
    const query = `SELECT * FROM stops WHERE id = $1`;
    try {
      const result = await this.pool.query(query, [id]);
      return result.rows.length > 0 ? this.mapToDomain(result.rows[0]) : null;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch stop by ID', String(error));
    }
  }

  async update(stop: Stop): Promise<Stop> {
    const query = `
      UPDATE stops
      SET address = $2, coordinates = $3, "timeWindow" = $4, "estimatedServiceTime" = $5, payload = $6, status = $7, "associatedClientId" = $8
      WHERE id = $1
      RETURNING *;
    `;
    const values = [
      stop.id,
      stop.address,
      stop.coordinates,
      stop.timeWindow,
      stop.estimatedServiceTime,
      stop.payload,
      stop.status,
      stop.associatedClientId,
    ];
    try {
      const result = await this.pool.query(query, values);
      if (result.rows.length === 0) {
        throw new Error(`Stop with ID ${stop.id} not found for update.`);
      }
      return this.mapToDomain(result.rows[0]);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update stop', String(error));
    }
  }

  private mapToDomain(row: any): Stop {
    return new Stop(
      row.id,
      row.address,
      row.coordinates,
      row.timeWindow,
      row.estimatedServiceTime,
      row.payload,
      row.status,
      row.associatedClientId,
    );
  }
}