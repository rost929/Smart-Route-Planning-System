import { Route } from './route.entity';

export class RoutePlan {
    constructor(
      public id: string,
      public routes: Route[], // List of Route objects
      public date: Date // Planning date
    ) {}
  }