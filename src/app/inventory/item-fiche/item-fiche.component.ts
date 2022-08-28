import { VehicleBrand } from './../../models/inventory/vehicleBrand.model';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Warehouse } from '../../models/inventory/warehouse.model';
import { ItemConstant } from '../../constant/inventory/item.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { ItemService } from '../services/item/item.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormModalDialogService } from '../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { DetailsProductComponent } from '../../shared/components/item/details-product/details-product.component';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../stark-permissions/utils/utils';
import { MediaConstant } from '../../constant/utility/Media.constant';
import { SalePolicy } from '../../constant/inventory/item.enum';
import { DocumentService } from '../../sales/services/document/document.service';
import { Item } from '../../models/inventory/item.model';
import { NumberConstant } from '../../constant/utility/number.constant';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';
import { StarkRolesService } from '../../stark-permissions/service/roles.service';
import { RoleConfigConstant } from '../../Structure/_roleConfigConstant';
import { LocalStorageService } from '../../login/Authentification/services/local-storage-service';
import { ActivityAreaEnumerator } from '../../models/enumerators/activity-area.enum';

@Component({
  selector: 'app-item-fiche',
  templateUrl: './item-fiche.component.html',
  styleUrls: ['./item-fiche.component.scss']
})
export class ItemFicheComponent implements OnInit {

  /**
   * Item to show its details
   */
  @Input() item;

  /**
   * Informations about children components
   */
  @Input() isCollapsed: boolean;
  @Input() isModal: boolean;
  @Input() options: any;
  @Input() sendToDocument: any;
  @Input() openedFromGarageAddCar: any;
  @Input() associatedWarehouseData: GridDataResult;
  @Input() replacementGridData: GridDataResult;
  @Input() numberDaysOutOfStock: number;
  firstImageUrl: string;
  imageBrandUrl: string;

  public advancedListGridState = {
    skip: 0,
    take: 5,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  /**
   * child components Tabs Ids
   */
  itemsTabId = 'items-tab-equ';
  fichesTabId = 'fiche-tab-equ';
  depotTabId = 'tab-associated-depot-equ';

  /**
   * child components Tabs href
   */
  itemsTabHref = 'items-equ';
  fichesTabHref = 'fiches-equ';
  depotTabHref = 'associated-depot-equ';
  public policyValorisation;
  public salesFormatOption;
  /**
  * permissions
  */
  public hasUpdatePermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowPermission: boolean;
  public hasHistoryPermission: boolean;
  public showPurchasePrices = false;
  public showSalesPrice = false;
  public OemTree;
  public isAutoVersion;

  constructor(private swalWarrings: SwalWarring, private itemService: ItemService, private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef, private router: Router, private formBuilder: FormBuilder, private documentService: DocumentService, private authService: AuthService,
    private rolesService: StarkRolesService, private localStorageService : LocalStorageService) {
      this.isAutoVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Auto;
  }

  ngOnInit() {
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ITEM_STOCK);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_ITEM_STOCK);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ITEM_STOCK);
    this.hasHistoryPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.HISTORY_ITEM);
    if (this.item) {
      this.salesFormatOption = this.itemService.formatSaleOptions;
      this.itemService.getItemSheetData(this.item.Id).subscribe((result) => {
        Object.assign(this.item, result);
        this.policyValorisation = this.item ? SalePolicy[this.item.IdPolicyValorization] : NumberConstant.ZERO;
        this.getFirstImage();
        this.OemTree = this.groupOems(this.item);
      });
      this.documentService.getNumberDaysOutStockCurrentYear(this.item.Id).subscribe((daysOutStock) => {
        this.item.numberDaysOutOfStock = daysOutStock;

      });
    }
    this.showSalesPrice = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_SALES_PRICE);
    this.showPurchasePrices = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_PURCHASE_PRICE);

  }

  get warehouseData(): Warehouse[] {
    if (this.associatedWarehouseData) {
      return this.associatedWarehouseData.data;
    }
  }

  goToAdvancedEdit() {
    const path = this.itemService.isPurchase ? ItemConstant.URI_ADVANCED_EDIT_PURCHASE : ItemConstant.URI_ADVANCED_EDIT;
    this.router.navigateByUrl(path + this.item.Id, { queryParams: this.item, skipLocationChange: true });
  }

  delete() {
    this.swalWarrings.CreateDeleteSwal(ItemConstant.ITEM, SharedConstant.CET).then((result) => {
      if (result.value) {
        this.itemService.remove(this.item).subscribe(() => {
          const path = this.itemService.isPurchase ? ItemConstant.LIST_ITEMS_PURCHASE_URL : ItemConstant.LIST_ITEMS_INVENTORY_URL;
          this.router.navigateByUrl(path);
        });
      }
    });
  }


  createPurchasePriceFormGroup(): FormGroup {
    return this.formBuilder.group({
      IdUnitStock: [this.item.IdUnitStock],
      TaxeItem: [this.item.TaxeItem],
      IdPolicyValorization: [this.item.IdPolicyValorization],
      IsForPurchase: [this.item.IsForPurchase],
      IsForSales: [this.item.IsForSales],
      CoeffConversion: [this.item.CoeffConversion],
    });
  }

  isItemStockManaged(): boolean {
    if (this.item && this.item.IdNatureNavigation) {
      return this.item.IdNatureNavigation.IsStockManaged;
    }
  }

  getReplacementItem() {
    if (this.replacementGridData && isNotNullOrUndefinedAndNotEmptyValue(this.replacementGridData.data)) {
      return this.replacementGridData.data[0];
    }
  }

  /**
   * Go to item details to see movement history
   */
  onClickGoToDetails() {
    this.formModalDialogService.openDialog(null, DetailsProductComponent, this.viewRef, null, this.item.Id,
      true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  getFirstImage(): any {
    this.firstImageUrl = MediaConstant.PLACEHOLDER_PICTURE;
    this.imageBrandUrl = MediaConstant.PLACEHOLDER_PICTURE;




    var itemsPicturesUrls = [];
    if (this.item.UrlPicture) {
      itemsPicturesUrls.push(this.item.UrlPicture);
    }
    if (this.item.UrlBrandPicture) {
      itemsPicturesUrls.push(this.item.UrlBrandPicture);
    }
    if (this.item.TiersPurchasePrice) {
      this.item.TiersPurchasePrice.forEach(supplier => {
        itemsPicturesUrls.push(supplier.UrlPicture);
        supplier.FileData = MediaConstant.PLACEHOLDER_PICTURE;
      });
    }


    this.itemService.getPictures(itemsPicturesUrls, false).subscribe((itemsPictures: any) => {
      if (this.item.UrlPicture) {
        let dataPicture = itemsPictures.objectData.find(value => value.FulPath === this.item.UrlPicture);
        if (dataPicture) {
          this.firstImageUrl = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
      if (this.item.UrlBrandPicture) {
        let dataPictureBrand = itemsPictures.objectData.find(value => value.FulPath === this.item.UrlBrandPicture);
        if (dataPictureBrand) {
          this.imageBrandUrl = `${SharedConstant.PICTURE_BASE}${dataPictureBrand.Data}`;
        }
      }
      if (this.item.TiersPurchasePrice) {
        this.item.TiersPurchasePrice.forEach(supplier => {
          let dataPictureSupplier = itemsPictures.objectData.find(value => value.FulPath === supplier.UrlPicture);
          if (dataPictureSupplier) {
            supplier.FileData = `${SharedConstant.PICTURE_BASE}${dataPictureSupplier.Data}`;
          }
        });
      }


    });

  }

  groupOems(item: Item) {
    let OemTree = [];
    if(item && item.OemItem){
    let brandList = Array.from(new Set(item.OemItem.map(x => x.IdBrandNavigation.Id))) as Array<number>;
    brandList.forEach(x => {
      let OemGroup = {
        key: item.OemItem.filter(y => y.IdBrand === x).map(z => z.IdBrandNavigation.Label)[0],
        OemList: item.OemItem.filter(y => y.IdBrand === x).map(z => z.OemNumber)
      };
      OemTree.push(OemGroup)
    });
  }
    return OemTree;
  }

}
