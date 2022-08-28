import { Resource } from '../shared/ressource.model';
import { SettlementMode } from './settlement-mode.model';
import { SettlementType } from './settlement-type.model';
import { PaymentMethod } from '../payment-method/payment-method.model';

export class DetailsSettlementMode extends Resource {
    IdSettlementMode?: number;
    IdSettlementType?: number;
    IdPaymentMethod?: number;
    Percentage?: number;
    NumberDays?: number;

    SettlementDay?: number;
    LabelSettlementType: string;
    MethodNamePaymentMethod: string;
    CompletePrinting: string;
    IdSettlementModeNavigation: SettlementMode;
    IdSettlementTypeNavigation: SettlementType;
    IdPaymentMethodNavigation: PaymentMethod;
}
