import { Dashboard, Period, PeriodEnumerator } from './dashboard.model';

export class Candidacy extends Dashboard {

  Label: string;
  Gender: string[];
  OfficeName: string[];
  ContractTypeCode: string[];
  TotalNumber: number;
  Month: number;
  PeriodEnum: PeriodEnumerator;
  Period: Period;
  StartPeriod: Date;
  EndPeriod: Date;
  CreationDate: Date;
  RecruitmentDuration: number;
  DelayBeforeRecruitment: number;
}
