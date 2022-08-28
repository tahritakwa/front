import { Dashboard, Period, PeriodEnumerator } from './dashboard.model';

export class TopTiers extends Dashboard {
  DocumentDate: Date;
  PeriodEnum: PeriodEnumerator;
  Period: Period;
  StartPeriod: Date;
  EndPeriod: Date;
  TTCAmount: number;
  DocumentMonth: number;
  DocumentYear: number;
  IdTiers: number;
  Quantity: number;
  RankByTTCAmount: number;
  RankByQuantity: number;
  TiersCode: number;
  TiersName: string;
  Type: string;

}
