import { Route } from './route.entity';

export class RoutePlan {
  constructor(
    public id: string,
    public routes: Route[],
    public planningDate: Date,
  ) {}
}
