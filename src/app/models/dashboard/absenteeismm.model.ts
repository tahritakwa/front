import { Dashboard, Period, PeriodEnumerator } from './dashboard.model';

export class Absenteeism extends Dashboard {

  Label: string;
  SeniorityRange: string[];
  AgeRange: string[];
  Gender: string[];
  Office: string[];
  TeamName: string[];
  ContractTypeCode: string[];
  TotalWorkDays: number;
  TotalDayOff: number;
  PeriodEnum: PeriodEnumerator;
  Period: Period;
  StartPeriod: Date;
  EndPeriod: Date;
  FamilyDayOff: string;
  TypeDayOff: string;
  NameEmployee: string;

}
