export interface EfficiencyReportDto {
    routePlanId: string;
    planningDate: Date;
    totalRoutes: number;
    totalStops: number;
    totalDistance: number; // e.g., in kilometers
    totalCost: number; // e.g., in USD
    onTimeDeliveryPercentage: number; // A value between 0 and 100
    costPerDistanceUnit: number;
  }