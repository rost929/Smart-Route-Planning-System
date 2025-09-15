# 🗺️ Smart Route Planning System

This project aims to solve the problem of **inefficiency and lack of optimization** in route planning for small and medium-sized businesses. The system will automate and optimize route creation for a vehicle fleet, minimizing costs and improving overall efficiency.

---

## 🏗️ Business Model: Entities

The following entities represent the core of the business logic. They are pure concepts and are independent of any persistence technology.

### 1. `Client`

This new entity represents the person or company that will receive the delivery or service.

- **ID**: A unique identifier (`Number` or `UUID`).
- **Full Name**: The client's full name (`Text`).
- **Email**: Contact email (`Text`).
- **Phone**: Contact number (`Text`).
- **Saved Addresses**: An array of pre-defined addresses for the client (`Array` of `Objects`).

### 2. `Stop`

The `Stop` entity is now directly associated with a `Client`, allowing us to track who is receiving the delivery.

- **ID**: A unique identifier (`Number` or `UUID`).
- **Delivery Address**: The complete physical location (`Text`).
- **Coordinates**: Precise location (`Object` with `latitude` and `longitude`).
- **Time Window**: Time range for the visit (`Array` of `Objects`).
- **Estimated Service Time**: Expected time the vehicle stays at the location (`Duration in minutes`).
- **Payload**: Volume, weight, or nature of the service (`Object`).
- **Status**: Current status of the visit (`Enumeration`).
- **Associated Client**: Reference to the **`Client`** entity's ID.

### 2. `Vehicle`

Represents a mobile resource that transports the payload.

- **ID**: Unique identifier (`Number` or `UUID`).
- **Vehicle Type**: "van", "motorcycle", "truck" (`Text` or `Enumeration`).
- **Cargo Capacity**: Maximum cargo (`Object` with `weight` and `volume`).
- **Work Schedule**: Available hours (`Object` with `start time` and `end time`).
- **Start Location**: Starting point (`Object` with `latitude` and `longitude`).
- **End Location**: End point (`Object` with `latitude` and `longitude`).
- **Cost per Kilometer**: For calculating operational costs (`Currency`).
- **Availability**: Whether the vehicle is active for planning (`Boolean`).

### 3. `Route`

Represents the optimized sequence of stops for a specific vehicle.

- **ID**: Unique identifier (`Number` or `UUID`).
- **Assigned Vehicle**: Reference to the `Vehicle`'s ID.
- **Ordered Stops**: Ordered list of `Stop` IDs.
- **Total Distance**: Total distance traveled (`Number` in `km` or `miles`).
- **Total Travel Time**: Total time to complete the route (`Duration in minutes`).
- **Estimated Start Time**: Route's start time (`Date and time`).

### 4. `Route Plan`

Represents the complete planning for a day.

- **ID**: Unique identifier (`Number` or `UUID`).
- **Planning Date**: The day the plan was created (`Date`).
- **Status**: Plan status (`Enumeration`: "created", "optimizing", "finalized").
- **Assigned Routes**: Array of `Route` IDs generated for the plan.

---

## ⚙️ Use Cases: The Business Logic

The following use cases define the actions the system can perform.

### 1. Planning and Optimization

- **`Create Route Plan`**: Initiates a new route plan for a given date. This use case receives a list of pending `Stops` and creates a new `Route Plan` entity with a "pending" status. It's the first step before any optimization occurs.

- **`Optimize Route Plan`**: This is the heart of the system. It orchestrates the optimization process by gathering the necessary data (stops, vehicles, constraints), and then invoking the **Route Optimization Adapter**. This adapter communicates with an external optimization engine (e.g., OR-Tools) to calculate the most efficient routes. Once the optimized routes are returned, it persists them as `Route` entities and updates the `Route Plan`'s status.

### 2. Management and Query

- **`Query Route Plan`**: Retrieves a specific `Route Plan` by its ID, including all its associated `Routes` and `Stops`. This use case is designed to provide all the necessary data for viewing the plan on a user interface, such as a map or a dashboard.

- **`Assign Stop Manually`**: Allows a user to override the automated plan. A user can assign a specific `Stop` to a `Vehicle` and a `Route` at a desired position. This action recalculates the route's total distance and travel time to reflect the new assignment.

- **`Update Stop Status`**: Handles updates to a stop's status, typically triggered by a driver's mobile application. It updates the `Stop` entity's state (e.g., from "en route" to "completed" or "canceled"), providing real-time tracking information.

### 3. Reporting

- **`Generate Efficiency Report`**: Analyzes an executed `Route Plan` to provide key performance metrics. It calculates values such as the total distance driven, total cost, and on-time delivery percentage. This use case provides a clear overview of the plan's success and potential areas for improvement.

---

## 🏛️ Architecture: Clean Architecture

This project is built using the principles of **Clean Architecture**, adapted for a NestJS application. The primary goal of this architecture is the separation of concerns, which makes the system independent of frameworks, databases, and user interfaces.

The fundamental principle is the **Dependency Rule**: source code dependencies can only point inwards. The inner layers should know nothing about the outer layers.

Our implementation is structured into three main layers:

### 1. Domain Layer (Innermost)

- **Location:** `src/domain`
- **Content:** Contains the core business logic and rules. This layer is made up of pure **Entities** (like `Route`, `Stop`, `Vehicle`) that have no dependencies on any external framework or library. This is the heart of the application.

### 2. Application Layer

- **Location:** `src/application`
- **Content:** Contains the application-specific business rules. It orchestrates the flow of data to and from the domain entities. This layer is composed of:
  - **Use Cases** (e.g., `GenerateRoutePlanUseCase`): Define and execute a single piece of application functionality.
  - **Interfaces / Ports** (e.g., `IRouteRepository`): Define contracts (abstractions) for external dependencies like databases or services. The use cases depend on these interfaces, not on concrete implementations.

### 3. Infrastructure Layer (Outermost)

- **Location:** `src/infrastructure`
- **Content:** This layer contains all the implementation details and external concerns. It provides the concrete implementations (also known as **Adapters**) for the interfaces defined in the application layer.
  - **Controllers:** Handle HTTP requests (the entry point).
  - **Database Repositories:** Implement the repository interfaces (e.g., `InMemoryRouteRepository`).
  - **External Services:** Implement service interfaces (e.g., `SimpleRouteOptimizerService`).

### What This Solves:

By adhering to this structure, we achieve several key benefits:

- **Framework Independence:** The core business logic (Domain and Application layers) is not tied to NestJS. It could be migrated to another framework with minimal effort.
- **Database Independence:** The application is not tied to a specific database. We can switch from an in-memory store to a real database like PostgreSQL simply by creating a new repository implementation, without changing any business logic.
- **High Testability:** Use cases and domain entities can be tested in isolation, without needing a running database or a web server, making tests fast and reliable.
- **Maintainability:** The clear separation of concerns makes the codebase easier to understand, navigate, and extend over time.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation & Running

1.  **Clone the repository**

    ```bash
    git clone https://github.com/rost929/Smart-Route-Planning-System.git
    ```

2.  **Navigate to the project directory**

    ```bash
    cd smart-route-planning-system
    ```

3.  **Install dependencies**

    ```bash
    npm install
    ```

4.  **Configure Environment Variables:**
    create a .env file in the root of the project and define the following variables:

  ```text
  # Database configuration
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=postgres
  DB_PASSWORD=your_password
  DB_DATABASE=smart_routes

  # Persistence strategy (postgres or in-memory)
  PERSISTENCE_STRATEGY=postgres
  ```

- _PERSISTENCE_STRATEGY_: Defines whether the application will use **_postgres_** or in-**_memory_** as the persistence strategy.

5.  **Run the application in development mode**
    This command starts the application with hot-reloading enabled.
    ```bash
    npm run start:dev
    ```

After running the last command, the server will be running on `http://localhost:3000`.

---

# Using Docker for PostgreSQL

If you prefer to use Docker to set up PostgreSQL, follow these steps:

Start the PostgreSQL Container:

```bash
  npm run db:up
```

This will start a Docker container with PostgreSQL configured according to the environment variables defined in .env.

Stop the Container:

```bash
  npm run db:down
```
This will stop and remove the PostgreSQL container.

# Seeding the Database with Test Data
To create the tables and populate the database with test data, run the following command:

  ```bash
    npm run seed
  ```

This command will execute the seed.ts script, which:

1. Creates the necessary tables (stops, vehicles, routes, route_plans).
2. Inserts test data for stops (stops) and vehicles (vehicles).

---

# Persistence Strategies
The system supports two configurable persistence strategies via the PERSISTENCE_STRATEGY environment variable:

PostgreSQL (postgres):

Data is stored in a PostgreSQL database.
Ideal for production environments or integration testing.
Requires the database to be configured and running (either locally or in Docker).
In-Memory (in-memory):

Data is stored in memory and is lost when the application restarts.
Ideal for quick testing or local development without needing to set up a database.
To switch between these strategies, simply update the PERSISTENCE_STRATEGY value in the .env file and restart the application.

---

## 🚀 API Endpoints

### 1. Generate a Route Plan

Generates a new, optimized route plan for a specific date, using available vehicles and pending stops.

- **Method:** `POST`
- **URL:** `/planning/generate`
- **Body:**
  ```json
  {
    "date": "2024-01-01T00:00:00.000Z"
  }
  ```

```
curl -X POST http://localhost:3000/planning/generate \
-H "Content-Type: application/json" \
-d '{"date": "2024-01-01T00:00:00.000Z"}'
```

### 2. Get a Route Plan

Retrieves the details of an existing route plan by its ID.

**Method**: GET
**URL**: /planning/:id

```
curl http://localhost:3000/planning/plan-to-optimize-01
```

### 3. Re-optimize a Route Plan

Takes an existing route plan and re-runs the optimization process on its stops and vehicles.

**Method**: POST
**URL**: /planning/optimize

```json
{
  "routePlanId": "plan-to-optimize-01"
}
```

```
curl -X POST http://localhost:3000/planning/optimize \
-H "Content-Type: application/json" \
-d '{"routePlanId": "plan-to-optimize-01"}'
```

### 4. Assign a Stop Manually

Inserts a specific stop at a given position within an existing route.

**Method**: POST
**URL**: /planning/assign-stop
**Body**:

```json
{
  "stopId": "stop-04",
  "vehicleId": "vehicle-01",
  "position": 1
}
```

### 5. Update Stop Status

Changes the status of a stop (e.g., from 'pending' to 'completed').

**Method**: PATCH
**URL**: /planning/stop-status
**Body**:

```json
{
  "stopId": "stop-01",
  "status": "completed"
}
```

```
curl -X PATCH http://localhost:3000/planning/stop-status \
-H "Content-Type: application/json" \
-d '{"stopId": "stop-01", "status": "completed"}'
```

### 6. Generate Efficiency Report

Calculates and returns performance metrics for an executed route plan.

**Method**: GET
**URL**: /planning/report/:id

```
curl http://localhost:3000/planning/report/plan-to-optimize-01
```

---
