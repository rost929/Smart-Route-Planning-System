import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const createTablesQuery = `
  -- Elimina las tablas si ya existen para empezar desde cero
  DROP TABLE IF EXISTS stops, routes, route_plans, vehicles;

  -- Tabla para las Paradas (Stops)
  CREATE TABLE stops (
    id VARCHAR(255) PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    coordinates JSONB NOT NULL,
    "timeWindow" JSONB NOT NULL,
    "estimatedServiceTime" INTEGER NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL,
    "associatedClientId" VARCHAR(255) NOT NULL
  );

  -- Tabla para los Vehículos (Vehicles)
  CREATE TABLE vehicles (
    id VARCHAR(255) PRIMARY KEY,
    model VARCHAR(255) NOT NULL,
    capacity JSONB NOT NULL,
    "workSchedule" JSONB NOT NULL,
    "startLocation" JSONB NOT NULL,
    "currentLocation" JSONB NOT NULL,
    speed INTEGER NOT NULL,
    availability BOOLEAN NOT NULL
  );

  -- Tabla para las Rutas (Routes)
  CREATE TABLE routes (
    id VARCHAR(255) PRIMARY KEY,
    "assignedVehicleId" VARCHAR(255) NOT NULL,
    "orderedStops" VARCHAR(255)[] NOT NULL,
    "totalDistance" INTEGER NOT NULL,
    "totalTravelTime" INTEGER NOT NULL,
    "estimatedStartTime" TIMESTAMP WITH TIME ZONE NOT NULL
  );

  -- Tabla para los Planes de Ruta (RoutePlans)
  CREATE TABLE route_plans (
    id VARCHAR(255) PRIMARY KEY,
    routes VARCHAR(255)[] NOT NULL,
    "planningDate" TIMESTAMP NOT NULL
  );
`;

const insertDataQuery = `
  -- Insertar datos de prueba para Stops
  INSERT INTO stops (id, address, coordinates, "timeWindow", "estimatedServiceTime", payload, status, "associatedClientId") VALUES
  ('stop-001', '123 Main St, New York, NY', '{"latitude": 40.7128, "longitude": -74.0060}', '[{"start": "09:00", "end": "12:00"}]', 15, '{"weight": 50, "volume": 1, "nature": "general"}', 'pending', 'client-abc'),
  ('stop-002', '456 Oak Ave, Brooklyn, NY', '{"latitude": 40.6782, "longitude": -73.9442}', '[{"start": "10:00", "end": "13:00"}]', 20, '{"weight": 75, "volume": 1.5, "nature": "fragile"}', 'pending', 'client-def'),
  ('stop-003', '789 Pine Ln, Queens, NY', '{"latitude": 40.7282, "longitude": -73.7949}', '[{"start": "11:00", "end": "14:00"}]', 10, '{"weight": 25, "volume": 0.5, "nature": "refrigerated"}', 'pending', 'client-ghi');

  -- Insertar datos de prueba para Vehicles
  INSERT INTO vehicles (id, model, capacity, "workSchedule", "startLocation", "currentLocation", speed, availability) VALUES
  ('vehicle-01', 'Ford Transit', '{"maxWeight": 1000, "maxVolume": 10}', '{"start": "08:00", "end": "18:00"}', '{"latitude": 40.7128, "longitude": -74.0060}', '{"latitude": 40.7128, "longitude": -74.0060}', 60, true),
  ('vehicle-02', 'Mercedes Sprinter', '{"maxWeight": 1500, "maxVolume": 15}', '{"start": "08:00", "end": "18:00"}', '{"latitude": 40.6782, "longitude": -73.9442}', '{"latitude": 40.6782, "longitude": -73.9442}', 65, true);
`;

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    console.log('-> Dropping and creating tables...');
    await pool.query(createTablesQuery);
    console.log('✅ Tables created successfully.');

    console.log('-> Inserting seed data...');
    await pool.query(insertDataQuery);
    console.log('✅ Seed data inserted successfully.');

    console.log('🎉 Database seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await pool.end();
    console.log('-> Database connection closed.');
  }
}

seed();