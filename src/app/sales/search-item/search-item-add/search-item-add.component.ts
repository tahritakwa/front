import { Component, ComponentRef, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { SearchItemService } from '../../services/search-item/search-item.service';
import { TiersDetailsViewModel } from '../../../models/sales/tiers-details.model';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { ListDocumentService } from '../../../shared/services/document/list-document.service';
import { TranslateService } from '@ngx-translate/core';
import { FetchProductsComponent } from '../../../inventory/components/fetch-products/fetch-products.component';
import { StyleConstant } from '../../../constant/utility/style.constant';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { Router } from '@angular/router';
import { TiersTypeEnumerator } from '../../../models/enumerators/tiers-type.enum';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { isNumber } from 'lodash';
import { VehicleDropdownComponent } from '../../components/vehicle-dropdown/vehicle-dropdown.component';
import { ActivitySectorsEnum, ActivitySectorsEnumerator } from '../../../models/shared/enum/activitySectors.enum';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';


@Component({
  selector: 'app-search-item-add',
  templateUrl: './search-item-add.component.html',
  styleUrls: ['./search-item-add.component.scss']
})
export class SearchItemAddComponent implements OnInit, IModalDialog, OnDestroy {
  @ViewChild(SupplierDropdownComponent) supplierDropdown;
  @ViewChild(FetchProductsComponent) fetchProductComponent: FetchProductsComponent;
  @ViewChild('vehicleDropDown') vehicleDropDown: VehicleDropdownComponent;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  selectedValue: number;
  isModal: boolean;
  options;
  isSelected: boolean;
  public tiersDetailsViewModel: TiersDetailsViewModel;
  public editMode = false;
  sendToDocument: boolean;
  public predicate: PredicateFormat;
  NotPaidSubModal = false;
  ValidBlSubModal = false;
  isFromAddDocumentLine: boolean;
  isForGarage: boolean;
  hasDefaultWarehouse: boolean;
  showBlDetail = true;
  isPurchase = false;
  idWarehouse: number;
  // used to specify the selected tiesrDropdown in HTML DOM
  selectedTierDropDown: boolean;
  public AddtiersSubModal: boolean;
  public advancedSearchClass = StyleConstant.COL_LG_3_PR_LG_0;
  public gridClass = StyleConstant.COL_LG_9;
  public CUSTOMER_PROFILE_URL = TiersConstants.CUSTOMER_PROFILE_URL;
  public tiersLabel: string;
  public customerTiers = TiersTypeEnumerator.Customer;
  public supplierTiers = TiersTypeEnumerator.Supplier;
  public isFastSalesRouting = false;
  public clientsDropDownDisabled: boolean;
  valueToFind: string;
  public hasCustomerShowPermission = false;
  public hasCustomerUpdatePermission = false;
  public hasBLListPermission = false;
  public hasInvoiceAssetListPermission = false;
  public hasBLShowPermission = false;
  public hasBLUpdatePermission = false;
  public showVehicleDropDown = false;
  public idSelectedTier;
  public allowRelationSupplierItems: boolean;

  /**
   *
   * @param searchItemService
   * @param documentListService
   * @param permissionsService
   * @param rolesService
   * @param translateService
   * @param router
   */
  constructor(public searchItemService: SearchItemService,
    public documentListService: ListDocumentService, public translateService: TranslateService, private router: Router,
    private authService: AuthService, private localStorageService: LocalStorageService) {
    this.showVehicleDropDown = this.localStorageService.getActivityArea() == ActivitySectorsEnum.AUTOMOBILE ? true : false;
  }

  ngOnInit() {
    this.hasCustomerShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_CUSTOMER);
    this.hasCustomerUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.hasBLListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_DELIVERY_SALES);
    this.hasInvoiceAssetListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_INVOICE_ASSET_SALES);
    this.hasBLShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_DELIVERY_SALES);
    this.hasBLUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_DELIVERY_SALES);
    this.searchItemService.setIsFromSearchItem_supplierInetrface(true);
    if (this.selectedValue) {
      this.idSelectedTier = this.selectedValue;
      this.searchItemService.setSearchValues(this.selectedValue);
      this.saveSearch(this.selectedValue);
    }
    this.isFromFastSales();
  }

  isFromFastSales() {
    this.isFastSalesRouting = this.router.url === ItemConstant.FAST_SALES_URL || this.router.url === ItemConstant.FAST_SALES_URL_NEW;
  }

  displayDetails() {
    this.showBlDetail = !this.showBlDetail;
  }

  ngOnDestroy(): void {
    if (!this.sendToDocument) {
      this.searchItemService.isFromSearchItem_supplierInetrface = false;
      this.searchItemService.idSupplier = undefined;
      this.searchItemService.disableFields = true;
    }
    this.searchItemService.isModal = false;
    this.removeAllModal();
    this.searchItemService.destroyModal();
    this.searchItemService.isInDocument = false;
  }

  private removeAllModal() {
    let modal = document.getElementsByClassName('modal-backdrop show');
    if (modal.length > 0) {
      modal[0].className = '';
      this.removeAllModal();
    }
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.searchItemService.isModal = true;
    this.options = options;
    this.sendToDocument = this.options.data.import;
    this.selectedTierDropDown = this.options.data.seleltedTierDropDown;
    this.isFromAddDocumentLine = this.options.data.isFromAddDocumentLine;
    this.isPurchase = this.options.data.isPurchase;
    this.idWarehouse = this.options.data.idWarehouse;
    this.setTiersLabel();
    if (this.sendToDocument) {
      this.searchItemService.disableFields = false;
    }
    if (this.options.data.valueToFind) {
      this.valueToFind = this.options.data.valueToFind;
    }
    if (this.options.data.selectedTiers) {
      this.selectedValue = this.options.data.selectedTiers;
    }
    if (this.options.data.isForGarage) {
      this.isForGarage = this.options.data.isForGarage;
    }
    if (this.options.data.hasDefaultWarehouse) {
      this.hasDefaultWarehouse = this.options.data.hasDefaultWarehouse;
    }
    this.allowRelationSupplierItems = options.data.allowRelationSupplierItems;
  }

  setTiersLabel() {
    this.tiersLabel = this.isPurchase ? TiersConstants.SUPPLIER : TiersConstants.CUSTOMER;
    this.translateService.instant(this.tiersLabel);
  }

  blur() {
    this.editMode = false;
  }

  SelectedValue($event) {
    if ($event && $event.selectedValue) {
      this.searchItemService.closeModalAction();
      if ($event.selectedTiers.IdTypeTiers == TiersTypeEnumerator.Customer) {
        this.idSelectedTier = $event.selectedValue;
        this.fetchProductComponent.idSelectedCustomer = $event.selectedValue;
        this.fetchProductComponent.listProductsComponent.idSelectedCustomer = $event.selectedValue;
        this.fetchProductComponent.idTierType = $event.selectedTiers.IdTypeTiers;
        this.fetchProductComponent.idSelectedVehicle = undefined;
        this.fetchProductComponent.listProductsComponent.ngOnInit();
        if (this.vehicleDropDown) {
          this.vehicleDropDown.idTier = this.idSelectedTier;
          this.fetchProductComponent.idSelectedVehicle = undefined;
          this.fetchProductComponent.listSalesHistory.idSelectedVehicle = undefined;
          this.searchItemService.idSelectedVehicle = undefined;
          this.vehicleDropDown.selectedValue = undefined;
          this.vehicleDropDown.ngOnInit();
        }
        if ($event.selectedTiers && $event.selectedTiers.IdTypeTiers == TiersTypeEnumerator.Customer && $event.selectedTiers.IdSalesPrice) {
          this.searchItemService.idSelectedSalesPrice = $event.selectedTiers.IdSalesPrice;
        } else {
          this.searchItemService.idSelectedSalesPrice = undefined;
        }
        if (this.fetchProductComponent && this.fetchProductComponent.listSalesHistory) {
          this.fetchProductComponent.listSalesHistory.idSelectedCustomer = $event.selectedValue;
          this.fetchProductComponent.listSalesHistory.ngOnInit();
        } else {
          this.fetchProductComponent.listSalesHistory.ngOnInit();
        }
      }

      if (this.editMode) {
        this.editMode = false;
      }
      this.isSelected = true;
      this.selectedValue = $event.selectedValue;
      this.searchItemService.setSearchValues(this.selectedValue);
      if ($event.selectedValue) {
        this.searchItemService.supplierName = this.supplierDropdown.supplierFiltredDataSource.find(x => x.Id === $event.selectedValue).Name;
        this.saveSearch($event.selectedValue);
      } else {
        this.searchItemService.disableFields = true;
      }
    }
    else if (!isNumber($event)) {
      this.selectedValue = undefined;
      this.fetchProductComponent.idSelectedCustomer = undefined;
      this.fetchProductComponent.idTierType = undefined;
      this.fetchProductComponent.idSelectedVehicle = undefined;
      this.searchItemService.setSearchValues(this.selectedValue);
      this.clientsDropDownDisabled = false;
      this.searchItemService.disableFields = true;
      this.searchItemService.idSelectedSalesPrice = undefined;
      this.fetchProductComponent.listProductsComponent.ngOnInit();
    }
  }

  saveSearch(selectedValue) {
    this.tiersDetailsViewModel = new TiersDetailsViewModel();
    this.searchItemService.disableFields = false;

    this.searchItemService.tiersDetails(selectedValue).subscribe(x => {
      x.ImpaidTotal = x.ImpaidTotal.toLocaleString('fr-FR', {
        style: 'currency',
        currency: x.currencyCode,
        minimumFractionDigits: x.currencyPrecision
      });
      x.ValidBlNotInvoiced = x.ValidBlNotInvoiced.toLocaleString('fr-FR', {
        style: 'currency',
        currency: x.currencyCode,
        minimumFractionDigits: x.currencyPrecision
      });
      x.Turnover = x.Turnover.toLocaleString('fr-FR', {
        style: 'currency',
        currency: x.currencyCode,
        minimumFractionDigits: x.currencyPrecision
      });
      x.MaxThreshold = x.MaxThreshold.toLocaleString('fr-FR', {
        style: 'currency',
        currency: x.currencyCode,
        minimumFractionDigits: x.currencyPrecision
      });
      Object.assign(this.tiersDetailsViewModel, x);
      if (document.getElementById('referenceInput')) {
        document.getElementById('referenceInput').focus();
      }
    });
  }


  getDocuemnt() {
    if (this.searchItemService.url && !this.searchItemService.isInDocument) {
      const url = this.searchItemService.url.concat('/edit/' + this.searchItemService.idDocument + '/' + documentStatusCode.Provisional);
      window.open(url, '_blank');
    }
  }

  itemSelectedForGarageEvent($event) {
    this.searchItemService.itemForGarageSubject.next($event);
  }

  getValidAssetsAndInvoice() {
    this.NotPaidSubModal = true;
  }

  CloseSubModal() {
    this.closeBtn.nativeElement.click();
    this.NotPaidSubModal = false;
  }

  ClosedetailsModal() {
    this.AddtiersSubModal = false;
  }

  CloseValidBlSubModal() {
    this.ValidBlSubModal = false;
  }

  GetValidBl() {
    this.documentListService.idClient = this.selectedValue;
    this.ValidBlSubModal = true;
  }
  isBLGenerated() {
    this.clientsDropDownDisabled = true;
  }
  public vehicleSelected($event) {
    if ($event) {
      this.fetchProductComponent.idSelectedVehicle = $event.Id;
      this.fetchProductComponent.listSalesHistory.idSelectedVehicle = $event.Id;
      this.searchItemService.idSelectedVehicle = $event.Id;
    } else {
      this.fetchProductComponent.idSelectedVehicle = undefined;
      this.fetchProductComponent.listSalesHistory.idSelectedVehicle = undefined;
      this.searchItemService.idSelectedVehicle = undefined;
    }
    this.fetchProductComponent.listSalesHistory.ngOnInit();

  }
}
