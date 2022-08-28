import {LocalStorageService} from '../../login/Authentification/services/local-storage-service';
import { FilterSearchItem } from './filter-search-item-model';

export class TeckDockWithWarehouseFilter {

  idPC: number;
  idProduct: number;
  idWarehouse: number;
  isAvailableInStack: boolean;
  isCentralOnly: boolean;
  idSupplier: number;
  TecDocReferance: string;
  oem: string;
  UserMail: string;
  GlobalSearch: string;
  isExactSearch: boolean;
  filterSearchItem: FilterSearchItem;

  constructor(idPC: number, idProduct: number, private localStorageService : LocalStorageService, idWarehouse?: number, availableQuanittyFilter?:
    boolean, idSupplier?: number, TecDocReferance?: string, isCentralOnly?: boolean, oem?: string,GlobalSearch?: string, isExactSearch?:boolean, filterSearchItem?:FilterSearchItem) {
    this.idPC = idPC;
    this.idProduct = idProduct;
    this.idWarehouse = idWarehouse;
    this.isAvailableInStack = availableQuanittyFilter;
    this.idSupplier = idSupplier;
    this.TecDocReferance = TecDocReferance;
    this.isCentralOnly = isCentralOnly;
    this.oem = oem;
    this.UserMail = this.localStorageService.getEmail();
    this.GlobalSearch = GlobalSearch;
    this.isExactSearch = isExactSearch;
    this.filterSearchItem = filterSearchItem
  }

}
