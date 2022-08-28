import { Resource } from '../shared/ressource.model';

export class StockDocumentType extends Resource {
  CodeType: string;
  Type: string;
  MovementType: string;
  Description: string;
}
