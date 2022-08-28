import { Component, EventEmitter, Input, OnInit, AfterViewInit, Output, ViewContainerRef } from '@angular/core';
import { WarehouseConstant } from '../../../constant/inventory/warehouse.constant';
import { PopupAddWarehouseComponent } from '../popup-add-warehouse/popup-add-warehouse.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { Router } from '@angular/router';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { WarehouseService } from '../../services/warehouse/warehouse.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { Shelf } from '../../../models/inventory/shelf.model';
import { Storage } from '../../../models/inventory/storage.model';
import { StorageService } from '../../services/storage.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';


@Component({
  selector: 'app-warehouse-central',
  templateUrl: './warehouse-central.component.html',
  styleUrls: ['./warehouse-central.component.scss']
})
export class WarehouseCentralComponent implements OnInit, AfterViewInit {
  @Input() warehouseCentral;
  @Input() itemWarehouseSearched;
  //public itemWarehouseSearched = SharedConstant.EMPTY;
  @Output() initGridDataSource = new EventEmitter<any>();
  public searchPlaceHolder = WarehouseConstant.SEARCH_WAREHOUSE;
  public warehouseCentralIcon = WarehouseConstant.FA_UNIVERSITY;
  public isWarehouse = WarehouseConstant.IS_WAREHOUSE;
  public isNotWarehouse = WarehouseConstant.IS_NOT_WAREHOUSE;
  public isCentral = WarehouseConstant.IS_CENTRAL;
  public isShelfAndStorage = WarehouseConstant.IS_SHELF_AND_STORAGE;
  private title: string;
  public listShelfsAndStorages: any[] = [];
  isVisibleAllShelf = false;
  /**
   * permissions
   */
   public hasShowPermission: boolean;
   public hasDeletePermission: boolean;
   public hasAddPermission: boolean;
   public hasUpdatePermission: boolean;
   public hasAddZonePermission: boolean;
   public hasAddShelfPermission: boolean;
   public hasShowDetailsPermission: boolean;
   public hasDeleteShelfPermission: boolean;
   public hasUpdateShelfPermission: boolean;
   public hasShowListItemPermission: boolean;
   
  /**
   *
   * @param formModalDialogService
   * @param router
   * @param warehouseService
   * @param translateService
   * @param swalWarring
   * @param viewRef
   */
  constructor(private formModalDialogService: FormModalDialogService, private router: Router,
    private warehouseService: WarehouseService, private translateService: TranslateService,
    private swalWarring: SwalWarring, private viewRef: ViewContainerRef, private storageService: StorageService, private authService: AuthService) {
  }
  ngAfterViewInit(): void {
    this.getAllStorage();
  }

  addNewWarehouse(type) {
    this.prepareAddViewTitle(type);
    const addType = { [WarehouseConstant.VIEW_TYPE]: type, [WarehouseConstant.IS_UPDATE_MODE]: false };
    this.formModalDialogService.openDialog(this.title, PopupAddWarehouseComponent,
      this.viewRef, null, addType);
  }

  redirectToWarehouseCentralItems(warehouseCentral) {
    if(this.hasShowPermission || this.hasUpdatePermission && this.hasShowListItemPermission){
      const url = this.router.serializeUrl(this.router.createUrlTree([`${WarehouseConstant.DETAIL_WAREHOUSE_URL}${warehouseCentral.Id}`]));
      window.open(url, '_blank');
    }
  }

  editWarehouseTypeCentral(warehouseCentral, event) {
    this.closeShelfDetail();
    this.title = WarehouseConstant.EDIT_CENTRAL;
    const data = {
      [WarehouseConstant.VIEW_TYPE]: WarehouseConstant.IS_CENTRAL,
      [WarehouseConstant.IS_UPDATE_MODE]: true,
      [WarehouseConstant.ITEM]: warehouseCentral
    };
    this.formModalDialogService.openDialog(this.title, PopupAddWarehouseComponent,
      this.viewRef, null, data);
    event.stopPropagation();
  }

  deleteWarehouseTypeCentral(warehouseCentral, event) {
    this.closeShelfDetail();
    const message = this.translateService.instant(WarehouseConstant.CENTRAL_DELETE_TEXT_MESSAGE)
      .replace(WarehouseConstant.NAME_PARAMETER, warehouseCentral.WarehouseName);
    this.swalWarring.CreateSwal(message, WarehouseConstant.CENTRAL_DELETE_TITLE_MESSAGE)
      .then(result => {
        if (result.value) {
          this.warehouseService.remove(warehouseCentral).subscribe(() => {
            this.initGridDataSource.emit(true);
          });
        }
      });
    event.stopPropagation();
  }

  private prepareAddViewTitle(typeView) {
    switch (typeView) {
      case WarehouseConstant.IS_NOT_WAREHOUSE:
        this.title = WarehouseConstant.ADD_ZONE;
        break;
      case WarehouseConstant.IS_WAREHOUSE:
        this.title = WarehouseConstant.ADD_DEPOT;
        break;
      case WarehouseConstant.IS_SHELF_AND_STORAGE:
        this.title = WarehouseConstant.ADD_SHELF_STORAGE;
        break;
      default:
        break;
    }
  }

  ngOnInit() {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_WAREHOUSE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_WAREHOUSE);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_WAREHOUSE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_WAREHOUSE);
    this.hasAddShelfPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SHELF_STORAGE);
    this.hasAddZonePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ZONE);
    this.hasShowDetailsPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_WAREHOUSE_DETAILS);
    this.hasDeleteShelfPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_SHELF_STORAGE);
    this.hasUpdateShelfPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SHELF_STORAGE);
    this.hasShowListItemPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ITEM_STOCK);
  }

  getAllStorage() {
    this.listShelfsAndStorages = [];
    this.warehouseService.getShelfByWarehouse(this.warehouseCentral.Id).subscribe((shelfs: Shelf[]) => {
      shelfs.forEach(shelf => {
        if (shelf.Storage) {
          this.loadListShelfAndStorage(shelf, this.warehouseCentral.Id);
        }
      });
    });
  }


  private loadListShelfAndStorage(shelf: Shelf, IdWarehouse) {
    shelf.Storage.forEach((storage: Storage) => {
      const shelfAndStorage = {
        [WarehouseConstant.ID_WAREHOUSE]: IdWarehouse,
        [WarehouseConstant.LABEL]: `${shelf.Label}${storage.Label}`,
        [WarehouseConstant.ID]: storage.Id
      };
      this.listShelfsAndStorages.push(shelfAndStorage);

    });
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
        this.isVisibleAllShelf = false;
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
  showAllShelfAndStorage(event) {
    this.isVisibleAllShelf = !this.isVisibleAllShelf;
    event.stopPropagation();
  }
  closeShelfDetail(){
    this.isVisibleAllShelf = false;
  }
  filter(){
    this.initGridDataSource.emit(this.itemWarehouseSearched);
  }
}
