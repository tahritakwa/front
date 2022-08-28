import { Tiers } from '../achat/tiers.model';
import { Currency } from '../administration/currency.model';
import { Resource } from '../shared/ressource.model';
import { PaymentMethod } from '../payment-method/payment-method.model';

export class OutstandingDocument extends Resource {
    IdDocument: number;
    IdTiers: number;
    OutstandingDocumentType: number;
    Code: string;
    Reference: string;
    DocumentDate: Date;
    CommitmentDate: Date;
    DocumentTtcprice: number;
    DocumentTtcpriceWithCurrency: number;
    DocumentRemainingAmount: number;
    DocumentRemainingAmountWithCurrency: number;
    Bank: string;
    IdCurrency: number;
    ExchangeRate: number;
    IdCurrencyNavigation: Currency;
    IdTiersNavigation: Tiers;
    IdPaymentMethod: number;
    IdPaymentMethodNavigation: PaymentMethod;
}
