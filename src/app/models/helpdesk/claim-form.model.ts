import { Resource } from '../shared/ressource.model';
import { Warehouse } from '../inventory/warehouse.model';
import { Contact } from '../shared/contact.model';
import { ClaimType } from './claim-type.model';
import { ClaimStatus } from './claim-status.model';
import { Claim } from './claim.model';
import { isNullOrUndefined } from 'util';
import { ClaimEnumerator } from '../enumerators/claim.enum';
import { ReducedDocumentLine } from '../sales/reduced-document-line.model';
import { ReducedDocument } from '../sales/reduced-document.model';
import { ReducedItem } from '../inventory/reduced-item.model';
import { ReducedTiers } from '../achat/reduced-tiers.model';

export class ClaimForm extends Resource {
  Code: string;
  DocumentDate: Date;
  ValidationDate: Date;
  Reference: any;
  ClaimTypeReference: any;
  IdClaimStatusReference: any;
  ClaimType: any;
  IdDocument: any;
  IdDocumentLine: any;
  IdPurchaseDocument: any;
  IdPurchaseDocumentReference: any;
  IdSalesDocument: any;
  IdSalesDocumentReference: any;
  IdReceiptDocument: any;
  IdDeliveryDocument: any;
  IdDeliveryDocumentReference: any;
  IdTiers: any;
  IdTiersReference: any;
  IdDocumentStatus: any;
  IdClaimStatus: any;
  IdClaimItem: any;
  ClaimItem: any;
  ClaimContact: string;
  ClaimItemWarehouse: any;
  IdContact: any;
  DocumentTypeCode: any;
  IdDocumentAssociated: any;
  ClaimQty: any;
  ClaimMaxQty: any;
  Description: any;
  Informations: any;
  StockOperation: any;
  IsTreated: boolean;
  IdWarehouse: any;
  IdWarehouseReference: any;
  IdWarehouseNavigation: Warehouse;
  IdItem: number;
  IdItemNavigation: ReducedItem;
  IdDocumentNavigation: ReducedItem;
  IdPurchaseDocumentNavigation: ReducedDocument;
  IdSalesDocumentNavigation: ReducedDocument;
  IdReceiptDocumentNavigation: ReducedDocument;
  IdDeliveryDocumentNavigation: ReducedDocument;
  IdDocumentLineNavigation: ReducedDocumentLine;
  IdClient: number;
  IdClientNavigation: ReducedTiers;
  IdContactNavigation: Contact;
  IdFournisseur: number;
  IdFournisseurNavigation: ReducedTiers;
  IdClaimStatusNavigation: ClaimStatus;
  ClaimTypeNavigation: ClaimType;
  ClaimInteraction: any;
  StockMovement: any;
  IdSalesAssetDocument: number;
  IdSalesAssetDocumentNavigation: ReducedDocument;
  IdPurchaseAssetDocument: number;
  IdPurchaseAssetDocumentNavigation: ReducedDocument;
  IsClaimQtyLocked: boolean;
  IdStockMovementInDocumentNavigation: any;
  IdStockMovementOutDocumentNavigation: any;
  IdMovementIn: number;
  IdMovementOut: number;
  ReferenceOldDocument: string;
  IdMovementInNavigation: ReducedDocument
  IdMovementOutNavigation: ReducedDocument

  public constructor(private translate: any, init?: Partial<Claim>) {
    super();
    {
      if (init) {
        Object.assign(this, init);
      }
      this.Code = isNullOrUndefined(init.Code) ? '' : init.Code;
      this.Id = isNullOrUndefined(init.Id) ? 0 : init.Id;
      this.DocumentDate = new Date(init.DocumentDate);
      this.Reference = isNullOrUndefined(init.Reference) ? '' : init.Reference;
      this.ClaimTypeReference = isNullOrUndefined(init.ClaimType) ? '' : this.translate.instant(init.ClaimTypeNavigation.TranslationCode);
      this.IdClaimStatusReference = isNullOrUndefined(init.IdClaimStatus) ? '' : init.IdClaimStatus;
      this.ClaimType = isNullOrUndefined(init.ClaimType) ? '' : init.ClaimType;
      this.IdContact = isNullOrUndefined(init.IdContact) ? '' : init.IdContact;
      this.IdClaimStatus = isNullOrUndefined(init.IdClaimStatus) ? '' : init.IdClaimStatus;
      this.ClaimContact = isNullOrUndefined(init.IdContactNavigation) ? this.translate.instant('NO_CONTACT') : init.IdContactNavigation.FirstName;
      this.IdWarehouse = isNullOrUndefined(init.IdWarehouseNavigation) ? '' : init.IdWarehouseNavigation.Id;
      this.IdWarehouseReference = isNullOrUndefined(init.IdWarehouseNavigation) ? '' : init.IdWarehouseNavigation.WarehouseName;
      this.IdDocument = isNullOrUndefined(init.IdDocumentNavigation) ? '' : init.IdDocumentNavigation.Id;
      this.IdDocumentLine = isNullOrUndefined(init.IdDocumentLineNavigation) ? '' : init.IdDocumentLineNavigation.Id;
      this.IdPurchaseDocument = isNullOrUndefined(init.IdPurchaseDocumentNavigation) ? '' : init.IdPurchaseDocumentNavigation.Id;
      this.IdPurchaseDocumentReference = isNullOrUndefined(init.IdPurchaseDocumentNavigation) ? '' : init.IdPurchaseDocumentNavigation.Code;
      this.IdSalesDocument = isNullOrUndefined(init.IdSalesDocumentNavigation) ? '' : init.IdSalesDocumentNavigation.Id;
      this.IdSalesDocumentReference = isNullOrUndefined(init.IdSalesDocumentNavigation) ? '' : init.IdSalesDocumentNavigation.Code;
      this.IdReceiptDocument = isNullOrUndefined(init.IdReceiptDocumentNavigation) ? '' : init.IdReceiptDocumentNavigation.Id;
      this.IdDeliveryDocument = isNullOrUndefined(init.IdDeliveryDocumentNavigation) ? '' : init.IdDeliveryDocumentNavigation.Id;
      this.IdDeliveryDocumentReference = isNullOrUndefined(init.IdDeliveryDocumentNavigation) ? '' : init.IdDeliveryDocumentNavigation.Code;
      this.IdTiers = (init.ClaimType === ClaimEnumerator.Deffective) ? init.IdClientNavigation.Id : init.IdFournisseurNavigation.Id;
      this.IdTiersReference = (init.ClaimType === ClaimEnumerator.Deffective) ? init.IdClientNavigation.Name : init.IdFournisseurNavigation.Name;
      this.Description = isNullOrUndefined(init.Description) ? '' : init.Description;
      this.IdDocumentStatus = isNullOrUndefined(init.IdDocumentNavigation) ? '' : init.IdDocumentNavigation.IdDocumentStatus;
      this.IdClaimItem = isNullOrUndefined(init.IdItem) ? -1 : init.IdItem;
      this.IdItem = isNullOrUndefined(init.IdItem) ? -1 : init.IdItem;
      this.ClaimItem = isNullOrUndefined(init.IdItemNavigation) ? '' : init.IdItemNavigation;
      this.IdItemNavigation = isNullOrUndefined(init.IdItemNavigation) ? undefined : init.IdItemNavigation;
      this.DocumentTypeCode = isNullOrUndefined(init.IdDocumentNavigation) ? '' : init.IdDocumentNavigation.DocumentTypeCode;
      this.IdDocumentAssociated = null;
      this.ClaimQty = init.ClaimQty;
      this.ClaimMaxQty = init.ClaimMaxQty;
      this.IdSalesAssetDocument = init.IdSalesAssetDocument;
      this.IdSalesAssetDocumentNavigation = init.IdSalesAssetDocumentNavigation;
      this.IdPurchaseAssetDocument = init.IdPurchaseAssetDocument;
      this.IdPurchaseAssetDocumentNavigation = init.IdPurchaseAssetDocumentNavigation;
      this.IsClaimQtyLocked = init.IsClaimQtyLocked;
      this.IdMovementIn = init.IdMovementIn;
      this.IdMovementOut = init.IdMovementOut;
      this.ReferenceOldDocument = init.ReferenceOldDocument;
      if (!isNullOrUndefined(init.IdClientNavigation))
        this.IdClient = init.IdClientNavigation.Id;
      this.IdMovementInNavigation = init.IdMovementInNavigation;
      this.IdMovementOutNavigation = init.IdMovementOutNavigation;
    }
  }
}


