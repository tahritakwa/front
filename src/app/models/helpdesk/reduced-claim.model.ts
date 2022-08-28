import { Resource } from '../shared/ressource.model';

export class ReducedReclamation extends Resource {
  Code: string;
  ClaimType: string;
  Description: string;
  Informations: string;
  Reference: string;
  IsTreated: boolean;
  IdWarehouse: number;
  IdItem: number;
  IdDocument: number;
  IdDocumentLine: number;
  IdClient: number;
  IdFournisseur: number;
  DocumentDate: Date;
  ValidationDate: Date;
  IdClaimStatus:  number;
  IdClaimType: number;
  ClaimQty: number;
  ClaimMaxQty: number;
  IdSalesAssetDocument: number;
  IdPurchaseAssetDocument: number;
}
