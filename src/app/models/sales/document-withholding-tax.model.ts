import { Resource } from '../shared/ressource.model';
import { WithholdingTax } from '../payment/withholding-tax.model';

export class DocumentWithholdingTax extends Resource {
    IdDocument: number;
    IdWithholdingTax: number;
    AmountWithCurrency: number;
    Amount: number;
    WithholdingTaxWithCurrency: number;
    WithholdingTax: number;
    IdDocumentNavigation: Document;
    IdWithholdingTaxNavigation: WithholdingTax;
    IsChecked: boolean;
    AmountToBePaid: number;
    editAmount: boolean;
}
