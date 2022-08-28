import { DocumentLine } from '../sales/document-line.model';

export class DocumentLineWithSupplier {
  IdTiers: number;
  IdCurrency: number;
  IdDocumentAssocieted: number;
  DocumentLine: DocumentLine;
  IdPriceRequest: number;
}
