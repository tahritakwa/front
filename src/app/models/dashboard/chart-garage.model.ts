import { Dashboard, Period, PeriodEnumerator } from './dashboard.model';

export class ChartGarage extends Dashboard {
  PeriodEnum: PeriodEnumerator;
  Period: Period;
  StartPeriod: Date;
  EndPeriod: Date;
  IdGarage: number;
  TTCAmount: number;
  GarageName: string;
  TotalIntervention: number;
}
