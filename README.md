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