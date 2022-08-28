import { StorageService } from './../../services/storage.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Shelf } from '../../../models/inventory/shelf.model';
import { WarehouseService } from '../../services/warehouse/warehouse.service';
import { Storage } from '../../../models/inventory/storage.model';
import { WarehouseConstant } from '../../../constant/inventory/warehouse.constant';
import { PopupAddWarehouseComponent } from '../popup-add-warehouse/popup-add-warehouse.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { Router } from '@angular/router';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ShelfService } from '../../services/shelf/shelf.service';
import { TranslateService } from '@ngx-translate/core';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-warehouse-item',
  templateUrl: './warehouse-item.component.html',
  styleUrls: ['./warehouse-item.component.scss']
})
export class WarehouseItemComponent implements OnInit {
  @Input() public listWarehouse;
  @Output() initGridDataSource = new EventEmitter<any>();
  @Output() closeShelfDeatil = new EventEmitter<any>();
  public listShelfsAndStorages: any[][] = [];
  public isVisibleWarehouse = {};
  public isVisbleShelfAndStorage = {};
  public isVisibleAllShelf = false;
  public warehouseDepotIcon = WarehouseConstant.FA_BUILDING;
  public warehouseZoneIcon = WarehouseConstant.FA_MAP_MARKER;
  public angelDoubleRightIcon = WarehouseConstant.FA_ANGLE_DOUBLE_RIGHT;
  public angelDoubleLeftIcon = WarehouseConstant.FA_ANGLE_DOUBLE_LEFT;
  private title: string;
  /**
   * permissions
   */
   public hasShowPermission: boolean;
   public hasDeletePermission: boolean;
   public hasUpdatePermission: boolean;
   public hasDeleteShelfPermission: boolean;
   public hasUpdateShelfPermission: boolean;
   public hasUpdateZonePermission: boolean;
   public hasDeleteZonePermission: boolean;
   public hasShowDetailsPermission: boolean;
   public hasShowListItemPermission: boolean;

  /**
   *
   * @param warehouseService
   * @param formModalDialogService
   * @param swalWarring
   * @param shelfService
   * @param viewRef
   * @param router
   * @param translateService
   */
  constructor(private warehouseService: WarehouseService, private formModalDialogService: FormModalDialogService,
    private swalWarring: SwalWarring, private shelfService: ShelfService, private viewRef: ViewContainerRef,
    private router: Router, private translateService: TranslateService, private storageService: StorageService, private authService: AuthService) {
  }

  private loadListShelfAndStorage(shelf: Shelf, IdWarehouse) {
    shelf.Storage.forEach((storage: Storage) => {
      const shelfAndStorage = {
        [WarehouseConstant.ID_WAREHOUSE]: IdWarehouse,
        [WarehouseConstant.LABEL]: `${shelf.Label}${storage.Label}`,
        [WarehouseConstant.ID]: storage.Id
      };
      this.listShelfsAndStorages[IdWarehouse].push(shelfAndStorage);
    });
  }

  getListShelfAndStorage(IdWarehouse) {
    if (this.listShelfsAndStorages[IdWarehouse]) {
      return this.listShelfsAndStorages[IdWarehouse].filter((shelf: Shelf) => shelf.IdWarehouse === IdWarehouse);
    } else {
      return [];
    }
  }

  isHiddenShelfAndStorage(IdWarehouse) {
    if (this.listShelfsAndStorages[IdWarehouse]) {
      return !this.listShelfsAndStorages[IdWarehouse].find((shelf: Shelf) => shelf.IdWarehouse === IdWarehouse);
    }
    return true;
  }

  showAllShelfAndStorage(event) {
    this.isVisibleAllShelf = !this.isVisibleAllShelf;
  }

  editWarhouse(warehouse, event) {
    this.closeShelfDeatil.emit();
    const type = warehouse.IsWarehouse ? WarehouseConstant.IS_WAREHOUSE : WarehouseConstant.IS_NOT_WAREHOUSE;
    this.prepareEditViewTitle(type);
    const data = { [WarehouseConstant.VIEW_TYPE]: type, [WarehouseConstant.IS_UPDATE_MODE]: true, [WarehouseConstant.ITEM]: warehouse };
    this.formModalDialogService.openDialog(this.title, PopupAddWarehouseComponent,
      this.viewRef, null, data);
    event.stopPropagation();
  }

  editShelf(shelfAndStroage, event) {
    if(this.hasUpdateShelfPermission){
    this.prepareEditViewTitle(WarehouseConstant.IS_SHELF_AND_STORAGE);
    const data = {
      [WarehouseConstant.VIEW_TYPE]: WarehouseConstant.IS_SHELF_AND_STORAGE,
      [WarehouseConstant.IS_UPDATE_MODE]: true,
      [WarehouseConstant.ITEM]: shelfAndStroage
    };
    this.formModalDialogService.openDialog(this.title, PopupAddWarehouseComponent,
      this.viewRef, null, data);
    event.stopPropagation();
  }
}

  private prepareEditViewTitle(typeView) {
    switch (typeView) {
      case WarehouseConstant.IS_NOT_WAREHOUSE:
        this.title = WarehouseConstant.EDIT_ZONE;
        break;
      case WarehouseConstant.IS_WAREHOUSE:
        this.title = WarehouseConstant.EDIT_DEPOT;
        break;
      case WarehouseConstant.IS_SHELF_AND_STORAGE:
        this.title = WarehouseConstant.EDIT_SHELF_STORAG;
        break;
      default:
        break;
    }
  }

  redirectToWarehouseItems(warehouse) {
    if(this.hasShowPermission || this.hasUpdatePermission || this.hasShowDetailsPermission && this.hasShowListItemPermission){
      const url = this.router.serializeUrl(this.router.createUrlTree([`${WarehouseConstant.DETAIL_WAREHOUSE_URL}${warehouse.Id}`]));
     window.open(url, '_blank');
    }
  }

  onWarehouseTypeZoneClick(warehouse, event) {
    this.isVisibleWarehouse[warehouse.Id] = !this.isVisibleWarehouse[warehouse.Id];
    event.stopPropagation();
  }

  onWarehouseTypeDepotClick(IdWarehouse, event) {
    this.isVisibleAllShelf = false;
    this.listShelfsAndStorages[IdWarehouse] = [];
    this.isVisbleShelfAndStorage[IdWarehouse] = !this.isVisbleShelfAndStorage[IdWarehouse];
    if (this.isVisbleShelfAndStorage[IdWarehouse]) {
      this.warehouseService.getShelfByWarehouse(IdWarehouse).subscribe((shelfs: Shelf[]) => {
        shelfs.forEach(shelf => {
          if (shelf.Storage) {
            this.loadListShelfAndStorage(shelf, IdWarehouse);
          } else {
            this.listShelfsAndStorages[IdWarehouse].push([]);
          }
        });
      });
    }
    event.stopPropagation();
  }

  deleteWarhouse(warehouseCentral, event) {
    this.closeShelfDeatil.emit();
    let message;
    const title = warehouseCentral.IsWarehouse ? WarehouseConstant.WAREHOUSE_DELETE_TITLE_MESSAGE : WarehouseConstant.ZONE_DELETE_TITLE_MESSAGE;
    if (warehouseCentral.IsWarehouse) {
      message = this.translateService.instant(WarehouseConstant.WAREHOUSE_DELETE_TEXT_MESSAGE)
        .replace(WarehouseConstant.NAME_PARAMETER, warehouseCentral.WarehouseName);
    } else {
      message = this.translateService.instant(WarehouseConstant.ZONE_DELETE_TEXT_MESSAGE)
        .replace(WarehouseConstant.NAME_PARAMETER, warehouseCentral.WarehouseName);
    }
    this.swalWarring.CreateSwal(message, title)
      .then(result => {
        if (result.value) {
          this.warehouseService.remove(warehouseCentral).subscribe(() => {
            this.initGridDataSource.emit(true);
          });
        }
      });
    event.stopPropagation();
  }


  deleteShefAndStorage(shelfAndStroage, event) {
    const message = this.translateService.instant(WarehouseConstant.SHELF_STORAGE_DELETE_TEXT_MESSAGE)
      .replace(WarehouseConstant.NAME_PARAMETER, shelfAndStroage.Label);
    this.swalWarring.CreateSwal(message, WarehouseConstant.SHELF_STORAGE_DELETE_TITLE_MESSAGE)
      .then(result => {
        if (result.value) {
          this.storageService.remove(shelfAndStroage).subscribe(() => {
            this.initGridDataSource.emit(true);
            setTimeout(function() { window.location.reload(); }, NumberConstant.FIVE_HUNDRED);
          });
        }
      });
    event.stopPropagation();
  }

  ngOnInit() {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_WAREHOUSE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_WAREHOUSE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_WAREHOUSE);
    this.hasDeleteShelfPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_SHELF_STORAGE);
    this.hasUpdateShelfPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SHELF_STORAGE);
    this.hasUpdateZonePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ZONE);
    this.hasDeleteZonePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_ZONE);
    this.hasShowDetailsPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_WAREHOUSE_DETAILS);
    this.hasShowListItemPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ITEM_STOCK);
  }

}
