import { Resource } from '../shared/ressource.model';
import { PaymentType } from '../payment/payement-type.model';
import { Timetable } from './timetable.model';

export class DetailReconciliation extends Resource {
    IdTimetable?: number;
    IdPaymentType?: number;
    IdBankAccount?: number;
    IdCaisse: number;
    DateTimetable?: Date;
    PriceTimetable?: number;
    IsPaid?: boolean;
    PostponedDate?: Date;
    RemainingPrice?: number;
    Meaning?: string;
    Activity: string;
    IdPaymentTypeNavigation: PaymentType;
    IdTimetableNavigation: Timetable;
    DetailReconciliation: Array<DetailReconciliation>;
}
