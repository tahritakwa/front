import { Resource } from '../shared/ressource.model';
import { DocumentLine } from '../sales/document-line.model';

export class PurchaseRequest extends Resource {
  Code: string;
  AskedByRequest: string;
  DocumentDate: Date;
  CreationDate: Date;
  DocumentMonthDate: number;
  DocumentTtcpriceWithCurrency: number;
  ApprovedByRequest: string;
  IdDocumentStatusNavigation;
  IdDocumentStatus: number;
  DocumentLine: Array<DocumentLine>;
}
