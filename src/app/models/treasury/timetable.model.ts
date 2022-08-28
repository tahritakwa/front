import { Tiers } from '../achat/tiers.model';
import { Resource } from '../shared/ressource.model';
import { PaymentType } from '../payment/payement-type.model';
import { DetailTimetable } from './detail-timetable.model';

export class Timetable extends Resource {
    IdTiers?: number;
    IdPaymentType?: number;
    IdBankAccount?: number;
    IdCaisse?: number;
    Titre: string;
    TotalPrice?: number;
    DateFirstTimetable?: Date;
    PriceTimetable?: number;
    Frequence: string;
    NumberOfTimetable?: number;

    IdPaymentTypeNavigation: PaymentType;
    IdTiersNavigation: Tiers;
    DetailTimetable: Array<DetailTimetable>;
}
