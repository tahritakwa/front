import { DocumentLine } from './document-line.model';
import { DocumentTotalPrices } from './document-total-prices.model';
import { Document } from './document.model';
import { isNullOrUndefined } from 'util';

export class ReduisDocument {
  CurrentDocumentId: number;
  DocumentType: any;
  DocumentAssociatedType: any;
  IdTiers: number;
  DocumentDate: Date;
  DocumentOtherTaxe = 0;
  DocumentLine: Array<DocumentLine> = new Array<DocumentLine>();
  DocumentTotalPrices: DocumentTotalPrices;
  idItem: number;
  LinesOnlyForSpecificItem: boolean;
  BlOnly: boolean;
  StartDate: Date;
  EndDate: Date;
  serachCode: string;
  IdUser: number;
  public constructor(document?: Document, lines?: DocumentLine[], idItem?: number,
    LinesOnlyForSpecificItem?: boolean, StartDate?: Date,
    EndDate?: Date) {
    if (!isNullOrUndefined(document)) {
      Object.assign(this, document);
      this.DocumentType = document.DocumentTypeCode;
      if (lines && lines.length > 0) {
        // Object.assign(this.DocumentLine, lines);
        lines.forEach(element => {
          // element.Taxe = new Array<Taxe>();
          this.DocumentLine.push(element);
        });
      } else {
        this.DocumentLine = new Array<DocumentLine>();
      }
      if (idItem && LinesOnlyForSpecificItem) {
        this.idItem = idItem;
        this.LinesOnlyForSpecificItem = LinesOnlyForSpecificItem;
      }
    }
    if (StartDate) {
      this.StartDate = new Date(Date.UTC(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate()));
    } if (EndDate) {
      this.EndDate = new Date(Date.UTC(EndDate.getFullYear(), EndDate.getMonth(), EndDate.getDate()));
    }
  }
}
