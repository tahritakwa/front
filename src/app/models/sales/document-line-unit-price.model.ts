import { DocumentLine } from './document-line.model';
import { DocumentEnumerator } from '../enumerators/document.enum';

export class DocumentLineUnitPrice {
  IdCurrency: any;
  DocumentTypeCode: string;
  HtUnitAmount: any;
  DiscountPercentage: any;
  HtAmount: any;
  constructor(IdCurency: any, DocumentTypeCode: string, unitPriceVlues: DocumentLine) {
    this.DocumentTypeCode = DocumentTypeCode;
    this.HtUnitAmount = unitPriceVlues.HtUnitAmountWithCurrency;
    this.DiscountPercentage = unitPriceVlues.DiscountPercentage;
    this.HtAmount = unitPriceVlues.HtUnitAmountWithCurrency;
    this.IdCurrency = IdCurency;
    this.DocumentTypeCode = DocumentTypeCode;
    if (this.DocumentTypeCode === DocumentEnumerator.PurchaseOrder && unitPriceVlues.UnitPriceFromQuotation > 0) {
      this.HtUnitAmount = unitPriceVlues.UnitPriceFromQuotation;
    }
  }
}
