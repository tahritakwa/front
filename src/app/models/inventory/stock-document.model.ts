import { Resource } from '../shared/ressource.model';
import { StockDocumentLine } from './stock-document-line.model';
import { DocumentStatus } from '../sales/document-status.model';
import { Warehouse } from './warehouse.model';
import { StockDocumentType } from './stock-document-type.model';
import { isNullOrUndefined } from 'util';
import { User } from '../administration/user.model';

export class StockDocument extends Resource {
  Code: string;
  TypeStockDocument: string;
  IdWarehouseSource?: number;
  IdWarehouseDestination?: number;
  IdDocumentStatus?: number;
  DocumentDate?: Date;
  ValidationDate?: Date;
  IsPlannedInventory?: boolean;
  Reference: string;
  Informations: string;
  StockDocumentLine: Array<StockDocumentLine> = new Array<StockDocumentLine>();
  IdDocumentStatusNavigation: DocumentStatus;
  IdWarehouseDestinationNavigation: Warehouse;
  IdWarehouseSourceNavigation: Warehouse;
  TypeSockDocumentNavigation: StockDocumentType;
  Shelf: string;
  IdTiers: number;
  IdInputUser1: number;
  IdInputUser2: number;
  IdInputUser1Navigation: User;
  IdInputUser2Navigation: User;
  isDefaultValue: boolean;
  isOnlyAvailableQuantity: boolean;
  IdStorageSource?: number;
  IdStorageDestination?: number;
  TransferType?: 'ASSOCIATION' | 'TRANSFERT';
  FromUserDropdown : boolean;

  constructor(line: Array<StockDocumentLine>, typeStockDocument: string, documentDate: Date,
    isPlannedInventory: boolean, idWarehouseSource: number,
    idWarehouseDestination?: number, idDocumentStatus?: number, idStockDocument?: number, Code?: string,
    Shelf?: string, IdTiers?: number,
    currentStockDocument?: StockDocument, IdInputUser1?: number, IdInputUser2?: number, Default?: boolean,
    AvailableQuantity?: boolean, FromUserDropdown? : boolean) {
    super();
    Object.assign(this, currentStockDocument);
    if (idStockDocument) {
      this.Id = idStockDocument;
      this.Code = Code;
    }
    this.IdWarehouseSource = idWarehouseSource;
    this.StockDocumentLine = line;
    this.IdDocumentStatus = idDocumentStatus;
    this.TypeStockDocument = typeStockDocument;
    this.DocumentDate = documentDate;
    this.IsPlannedInventory = isNullOrUndefined(isPlannedInventory) ? false : isPlannedInventory;
    this.IdWarehouseDestination = idWarehouseDestination;
    this.Shelf = Shelf;
    this.IdTiers = IdTiers;
    this.IdInputUser1 = IdInputUser1;
    this.IdInputUser2 = IdInputUser2;
    this.isDefaultValue = Default;
    this.isOnlyAvailableQuantity = AvailableQuantity;
    this.FromUserDropdown = FromUserDropdown;
  }

}
