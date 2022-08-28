import { DocumentLine } from './document-line.model';

export class ItemPrice {
  DocumentType: string;
  DocumentDate: Date;
  IdTiers: number;
  DocumentLineViewModel: DocumentLine;
  IdCurrency: number;
  hasSalesInvoices: boolean;
  DocumentLines: DocumentLine[];
  InoicingType: number;
  IsRestaurn: boolean;
  RecalculateDiscount: boolean;
  /**
   *constructor
   */
  constructor(DocumentType: string, DocumentDate: Date, IdTiers: number,
    DocumentLineVM: DocumentLine, IdCurrency = 0, hasSalesinvoices = false, IdDocument: number = 0,
    IdDocumentLineStatus: number = 0, DocLines?: DocumentLine[], InoicingType?: number, IsRestaurn?: boolean) {
    this.DocumentType = DocumentType;

    this.DocumentLineViewModel = new DocumentLine();
    if (DocumentLineVM) {
      Object.assign(this.DocumentLineViewModel, DocumentLineVM);
      this.DocumentLineViewModel.HtUnitAmount = DocumentLineVM.HtUnitAmountWithCurrency;
      this.DocumentLineViewModel.HtAmountWithCurrency = DocumentLineVM.HtUnitAmountWithCurrency;
      this.DocumentLineViewModel.DocumentLineTaxe = null;
      this.DocumentLineViewModel.IdWarehouseNavigation = null;
      this.DocumentLineViewModel.IdDocumentNavigation = null;
      this.DocumentLineViewModel.Taxe = null;
      this.DocumentLineViewModel.StockMovement = null;
      this.DocumentLineViewModel.DocumentLineNegotiationOptions = null;
      this.DocumentLineViewModel.IdStorageNavigation = null;
    }
    this.DocumentDate = DocumentDate;
    this.IdTiers = IdTiers;
    this.IdCurrency = IdCurrency;
    this.InoicingType = InoicingType;
    this.hasSalesInvoices = hasSalesinvoices;
    this.DocumentLines = [];
    if (DocLines && DocLines.length > 0) {
      Object.assign(this.DocumentLines, DocLines);
      this.DocumentLines.forEach(x => {
        const line = DocLines.find(y => y.IdItem === x.IdItem);
        if (line) {
          x.HtUnitAmount = line.HtUnitAmountWithCurrency;
          x.HtAmountWithCurrency = line.HtUnitAmountWithCurrency;
          x.DocumentLineTaxe = null;
          x.IdWarehouseNavigation = null;
          x.IdDocumentNavigation = null;
          x.Taxe = null;
          x.StockMovement = null;
          x.IdDocument = IdDocument;
          x.IdDocumentLineStatus = IdDocumentLineStatus;
          x.IdStorageNavigation = null;
        }
      });
    }
    this.IsRestaurn = IsRestaurn;
  }
}
