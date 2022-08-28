import { Taxe } from "../administration/taxe.model";
import { Resource } from "../shared/ressource.model";
import { Document } from "./document.model";


export class DocumentTaxsResume extends Resource {
    IdTax? : number;
    HtAmount ? : number;
    HtAmountWithCurrency ? : number;
    TaxAmount ? : number;
    TaxAmountWithCurrency ? : number;
    IdDocument : number;
    DiscountAmount ? : number;
    DiscountAmountWithCurrency ? : number;
    ExcVatTaxAmount ? : number;
    ExcVatTaxAmountWithCurrency ? : number;
    IdDocumentNavigation : Document;
    IdTaxNavigation : Taxe;
}
