import { Dashboard, Period, PeriodEnumerator } from './dashboard.model';

export class OrderState extends Dashboard {
    HtAmount: number;
    Month: number;
    Year: number;
    Type: string;
    PeriodEnum: PeriodEnumerator;
    Period: Period;
    StartPeriod: Date;
    EndPeriod: Date;

}