import { Dashboard, PeriodEnumerator, Period } from './dashboard.model';

export class PurchasesSalesVolume extends Dashboard {
  InvoiceAmountHT: number;
  InvoiceAmountTTC: number;
  Month: number;
  Year: number;
  Type: string;
  PeriodEnum: PeriodEnumerator;
  Period: Period;
  StartPeriod: Date;
  EndPeriod: Date;
}
