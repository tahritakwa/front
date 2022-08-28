import { Dashboard, PeriodEnumerator, Period } from './dashboard.model';
export class PurchaseSaleItem extends Dashboard {
    HtTotalPerItem: number;
    QuantityPerItem: number;
    IdItem: number;
    ItemCode: string;
    ItemDescription: string;
    LabelItemFamily: string;
    OperationType: string;
    PeriodEnum: PeriodEnumerator;
    Period: Period;
    StartPeriod: Date;
    EndPeriod: Date;
    RankByAmount: number;
    RankByQuantity: number;
    HtTotalPerItemFamily: number;
    QuantityPerItemFamily: number;
    ItemFamily: string;
    RankByFamilyPerAmount: number;
    RankByFamilyPerQuantity: number;
}
