import { Dashboard, Period, PeriodEnumerator } from './dashboard.model';

export class EmployeeTurnoverModel extends Dashboard {

  Label: string;
  Gender: string[];
  OfficeName: string[];
  ContractTypeCode: string[];
  TotalTurnover: number;
  Month: number;
  Year: number;
  PeriodEnum: PeriodEnumerator;
  Period: Period;
  StartPeriod: Date;
  EndPeriod: Date;
  CreationDate: Date;
}
