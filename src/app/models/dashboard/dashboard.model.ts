import { Resource } from '../shared/ressource.model';

export class Dashboard extends Resource {
  PeriodEnum: number;
  Period: Period;
}
export class Period {
  StartDate: Date;
  EndDate: Date;
}
export enum PeriodEnumerator {
  CurrentMonth = 1,
  LastMonth = 2,
  LastSixMonth = 3,
  CurrentYear = 4,
  LastYear = 5
}
