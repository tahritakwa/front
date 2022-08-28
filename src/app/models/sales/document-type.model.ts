import { Document } from './document.model';
import { Resource } from '../shared/ressource.model';

export class DocumentType extends Resource {
  Code: string;
  label: string;
  Description: string;
  DefaultCodeDocumentTypeAssociated: string;
  IsStockAffected: boolean;
  CreateAssociatedDocument: boolean;
  IsSaleDocumentType: boolean;
  IsFinancialCommitmentAffected: boolean;
  FinancialCommitmentDirection?: number;
  IsActiveGeneration: boolean;
  Document: Array<Document>;
}
