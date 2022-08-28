import { Dashboard, PeriodEnumerator, Period } from './dashboard.model';

export class SaleState extends Dashboard {
  InvoiceRemainingAmount: number;
  InvoiceAmountTTC: number;
  InvoiceAmountHT: number;
  Month: number;
  Year: number;
  Type: string;
  PeriodEnum: PeriodEnumerator;
  Period: Period;
  StartPeriod: Date;
  EndPeriod: Date;

}
