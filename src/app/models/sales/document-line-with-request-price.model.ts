
import { DocumentLine } from './document-line.model';
import { DocumentEnumerator } from '../enumerators/document.enum';
export class DocumentLineWithPriceRequest {
    DocumentDate?: Date;
    IdTier: number;
    documentLines: Array<DocumentLine>;
    DocumnetType: string;
    IdDocumentAssociated: number;
    constructor(Suppliers: number, DocumentDate, PriceRequestDetail, DocumnetType, IdDocumentAssociated?) {
        this.DocumentDate = DocumentDate;
        this.IdTier = Suppliers;
        this.documentLines = PriceRequestDetail;
        this.DocumnetType = DocumnetType;
        this.IdDocumentAssociated = IdDocumentAssociated;
        if (DocumnetType === DocumentEnumerator.PurchaseOrder) {
            this.documentLines.forEach(element => {
                element.UnitPriceFromQuotation = element.HtUnitAmountWithCurrency;
            });
        }
    }
}
