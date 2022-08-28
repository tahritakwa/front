import { Labels } from './../../../../constant/shared/services.constant';
import { BrandComboBoxComponent } from './../../brand-combo-box/brand-combo-box.component';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaxeMultiselectComponent } from '../../taxe-multiselect/taxe-multiselect.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { digitsAfterComma, strictSup, unique, ValidationService } from '../../../services/validation/validation.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../utils/predicate';
import { ItemService } from '../../../../inventory/services/item/item.service';
import { DialogService } from '../../../services/dialog/confirm-dialog/dialog.service';
import { Item } from '../../../../models/inventory/item.model';
import { TaxeItem } from '../../../../models/administration/taxe-item.model';
import { NatureService } from '../../../services/nature/nature.service';
import { ItemConstant } from '../../../../constant/inventory/item.constant';

import { TranslateService } from '@ngx-translate/core';
import { ReducedEquivalentItem } from '../../../../models/inventory/reduced-equivalent-item';
import { ModelOfItemComboBoxComponent } from '../../model-of-item-combo-box/model-of-item-combo-box.component';
import { SubModelComboBoxComponent } from '../../sub-model-combo-box/sub-model-combo-box.component';
import { SubFamilyComboBoxComponent } from '../../sub-family-combo-box/sub-family-combo-box.component';
import { AssignEquivalenceGroupComponent } from '../../../../inventory/components/assign-equivalence-group/assign-equivalence-group.component';
import { SupplierDropdownComponent } from '../../supplier-dropdown/supplier-dropdown.component';
import { ProductDropdownComponent } from '../../product-dropdown/product-dropdown.component';
import { KitItemComponent } from '../../../../inventory/components/kit-item/kit-item.component';
import { ItemBrandComponent } from '../../../../inventory/components/item-brand/item-brand.component';
import { TiersConstants } from '../../../../constant/purchase/tiers.constant'; 
import { TecDocArticleModel } from '../../../../models/inventory/tec-doc-article.model';
import { FormModalDialogService } from '../../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { WarehouseService } from '../../../../inventory/services/warehouse/warehouse.service';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { TecdocService } from '../../../../inventory/services/tecdoc/tecdoc.service';
import { CurrencyService } from '../../../../administration/services/currency/currency.service';
import { MeasureUnitService } from '../../../services/mesure-unit/measure-unit.service';
import { StarkPermissionsService, StarkRolesService } from '../../../../stark-permissions/stark-permissions.module';
import { SwalWarring } from '../../swal/swal-popup';
import { RoleConfigConstant } from '../../../../Structure/_roleConfigConstant';
import { Currency } from '../../../../models/administration/currency.model';
import { ItemWarehouse } from '../../../../models/inventory/item-warehouse.model';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { TecDocSyncStepperComponent } from '../../../../inventory/components/tec-doc-sync-stepper/tec-doc-sync-stepper.component';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { GrowlService } from '../../../../../COM/Growl/growl.service';
import { FileInfo, MediaInfo } from '../../../../models/shared/objectToSend';
import { ActivityAreaEnumerator } from '../../../../models/enumerators/activity-area.enum';
import { NatureDropdownComponent } from '../../nature-dropdown/nature-dropdown.component';
import * as jsPDF from 'jspdf';
import { MediaConstant } from '../../../../constant/utility/Media.constant';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../utils/column-settings.interface';
import { GridSettings } from '../../../utils/grid-settings.interface';
import { TaxeService } from '../../../../administration/services/taxe/taxe.service';
import { IntlService } from '@progress/kendo-angular-intl';
import { GalleryCardComponent } from '../../gallery-card/gallery-card.component';
import { isNullOrUndefined } from 'util';
import { ItemTiers } from '../../../../models/inventory/item-tiers.model';
import { ComponentsConstant } from '../../../../constant/shared/components.constant';
import { c } from '@angular/core/src/render3';
import { NatureCodeEnum } from '../../../../models/enumerators/nature-code.enum';
import { FamilyComboBoxComponent } from '../../family-combo-box/family-combo-box.component';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { ReducedCurrency } from '../../../../models/administration/reduced-currency.model';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { UserCurrentInformationsService } from '../../../services/utility/user-current-informations.service';
import { LocalStorageService } from '../../../../login/Authentification/services/local-storage-service';
import { OemItem } from '../../../../models/inventory/oem-item.model';
import { KeyboardConst } from '../../../../constant/keyboard/keyboard.constant';
import { exists } from 'fs';
import { BrandService } from '../../../../inventory/services/brand/brand.service';
import { ItemSalesPrice } from '../../../../models/inventory/item-sales-price.model';
import { ItemSalesPriceService } from '../../../../sales/services/item-sales-price/item-sales-price.service';
import { SalesPrice } from '../../../../models/sales/sales-price.model';
import { SalesPriceConstant } from '../../../../constant/sales/sales-price.constant';
import { SalesPriceDropdownComponent } from '../../sales-price-dropdown/sales-price-dropdown.component';

const DEFAULT_TAXE_CODE = 'TVA19%';

@Component({
  selector: 'app-addproduct',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddproductComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('taxMultiSelect') taxMultiSelect: TaxeMultiselectComponent;
  @ViewChild(ModelOfItemComboBoxComponent) modelOfItemChild;
  @ViewChild(SubModelComboBoxComponent) subModelChild;
  @ViewChild(SubFamilyComboBoxComponent) subFamilyChild: SubFamilyComboBoxComponent;
  @ViewChild(AssignEquivalenceGroupComponent) assignEquivalenceChild;
  @ViewChild(SupplierDropdownComponent) SupplierDropdownComponent;
  @ViewChild(ProductDropdownComponent) productDropdownComponent;
  @ViewChild(KitItemComponent) kitItemComponent;
  @ViewChild(ItemBrandComponent) itemBrandComponent;
  @ViewChild(NatureDropdownComponent) natureDropDown;
  @ViewChild(FamilyComboBoxComponent) FamilyChild: FamilyComboBoxComponent;
  @ViewChild('OemBrandComboBox') OemBrandComboBox: BrandComboBoxComponent;
  @ViewChild(SalesPriceDropdownComponent) SalesPriceDropDown;
  itemForm: FormGroup;
  itemSaved: boolean;
  IsSupplierRequired: boolean;
  TecDocSupp = '';
  public gridData: any[];
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  /*
  * Id Entity
  */
  public id: number;
  public idItemToDuplicate: number;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  /*
   * Item to update
   */
  public itemToUpdate: Item;
  /*
   * Data Subscriptions
   */
  array: FormGroup;

  arrayOfItemBrand: FormGroup;
  arrayOfOemItem: FormGroup;

  private idSubscription: Subscription;
  private itemSubscription: Subscription;

  public isStockManged = false;
  public tiersType = TiersConstants.SUPPLIER_TYPE;
  // number format
  formatPurchaseOptions: any;
  formatSaleOptions: any;
  /**verify if item will be deplicated */
  public isDuplicated: boolean = false;
  public TecDoc: TecDocArticleModel;
  isSuperAdminRole: boolean;
  caracteristics: { marque: string; seriesModel: string; passangerCar: string; category: string; product: string; };
  public data: Item;
  routerListLink: string;
  isAutoVersion: boolean;
  private productNatuerId: number;
  public updatePriceRole: boolean;
  public percentageSalesPrice: number;
  public valueSalesPrice: number;
  public itemSalesPrices: ItemSalesPrice[] = [];
  public cantAddPrice = true;
  /**
   * Component ctor
   * @param fb
   * @param itemService
   * @param activatedRoute
   * @param router
   * @param dialogService
   */
  public attachmentFilesToUpload: Array<FileInfo>;
  public emptyAttachmentFilesToUpload: Array<string> = ['assets/image/placeholder-logo.png'];
  files: Array<FileInfo> = [];
  public selectValorisationConditionTab = false;
  public hideExpenseInNature = true;
  public pictureFileInfo: FileInfo;


  public steps = [
    {
      value: ItemConstant.GENERAL,
      tag: ItemConstant.GENERAL.toLowerCase(),
      selected: true,
      isValidate: false,
      isVisible: true
    },
    {
      value: ItemConstant.CHARACTERISTICS,
      tag: ItemConstant.CHARACTERISTICS.toLowerCase(),
      selected: false,
      isValidate: false,
      isVisible: true
    },
    {
      value: ItemConstant.STOCKMANEGEMNT,
      tag: ItemConstant.STOCKMANEGEMNT.toLowerCase(),
      selected: false,
      isValidate: false,
      isVisible: true
    },
    {
      value: ItemConstant.FINANCIAL_INFOS,
      tag: ItemConstant.FINANCIAL_INFOS.toLowerCase(),
      selected: false,
      isValidate: false,
      isVisible: true
    },
    {
      value: ItemConstant.EQUIVALENCEGROUP,
      tag: ItemConstant.EQUIVALENCEGROUP.toLowerCase(),
      selected: false,
      isValidate: false,
      isVisible: true
    }
  ];
  public mediaInfos: MediaInfo[] = [];
  public defaultTaxeCode = DEFAULT_TAXE_CODE;
  public openBrandCollapse = false;
  public urlFileVideo;
  @ViewChild('closebutton') closebutton;
  public disableUrVideo = true;
  public placeHolderPic = MediaConstant.PLACEHOLDER_PICTURE;
  public placeHolderUrl = MediaConstant.PLACEHOLDER_URL;

  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: { // Initial filter descriptor
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: TiersConstants.NAME,
      title: this.translate.instant(TiersConstants.SUPPLIER),
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED_FIFTY_SIXE
    },
    {
      field: ItemConstant.PURCHASING_PRICE_ITEM_FIELD,
      title: ItemConstant.PURCHASING_PRICE_ITEM,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED
    },
    {
      field: ItemConstant.COST_FIELD,
      title: ItemConstant.COST,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED
    },
    {
      field: ItemConstant.EXCHANGERATE_FIELD,
      title: ItemConstant.EXCHANGERATE,
      filterable: false,
      _width: NumberConstant.NINETY
    },
    {
      field: ItemConstant.MARGIN_FIELD,
      title: ItemConstant.MARGIN,
      filterable: false,
      _width: NumberConstant.NINETY
    }
  ];
  public itemSalesPriceColumnsConfig: ColumnSettings[] = [
    {
      field: 'IdSalesPriceNavigation.Label',
      title: 'OBJECTIVES',
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED_FIFTY_SIXE
    },
    {
      field: 'IdSalesPriceNavigation.Value',
      title: 'PROPORTION',
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED
    },
    {
      field: 'Price',
      title: 'PRICE',
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public ItemSalesPriceGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.itemSalesPriceColumnsConfig
  };
  suppliersSelected = [];
  private editedRowIndex: number;
  public PriceformGroup: FormGroup;
  public OemBrandGroup: FormGroup;
  public finalStep = NumberConstant.FOUR;
  public natureCode;
  public salesEditRowIndex: number;
  public salesPriceFormGroup: FormGroup;
  public idSelectedSalesPrice: number;
  public selectedSalesPrice: SalesPrice;
  /**
   * permissions
   */
  public hasShowPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasAddPermission: boolean;
  public hasUpdatePurchasePricePermission: boolean;
  public hasUpdateSalePricePermission: boolean;
  public hasSynchronizePermission: boolean;
  public hasAddMesureUnitPermission: boolean;
  public lockedWarehouseList;
  public isExpenseNature = false;
  public openOemCollapse = false;
  public OemValue = '';
  public OemList = [];
  public FilteredOemList = [];
  public showFinancialInfos = true;
  public showSupplierDropdown = true;
  public showPriceCategory = true;
  public disableTaxe  = false;

  constructor(public viewRef: ViewContainerRef, public intl: IntlService, private fb: FormBuilder,
    public modalService: ModalDialogInstanceService,
    public itemService: ItemService, private activatedRoute: ActivatedRoute,
    private formModalDialogService: FormModalDialogService,
    private router: Router, private validationService: ValidationService,
    private natureService: NatureService, private companyService: CompanyService,
    private warehouseService: WarehouseService, private tecdocService: TecdocService,
    private unitService: MeasureUnitService, private currencyService: CurrencyService,
    private localStorageService: LocalStorageService, private rolesService: StarkRolesService,
    private swalWarrings: SwalWarring, private translate: TranslateService,
    private growlService: GrowlService, private el: ElementRef,
    private permissionsService: StarkPermissionsService, private brandService: BrandService,
    private activatedroute: ActivatedRoute,
    private taxeService: TaxeService, private authService: AuthService, private itemSalesPriceService: ItemSalesPriceService) {
    this.isAutoVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Auto;

    /**verify if the route is update item or deplicate item */
    this.checkRoutes();
    if (this.itemService.isPurchase || (this.router.url && this.router.url.toUpperCase().includes('PURCHASE'))) {
      this.routerListLink = ItemConstant.LIST_ITEMS_PURCHASE_URL;
    } else {
      this.routerListLink = ItemConstant.LIST_ITEMS_INVENTORY_URL;
    }

    this.attachmentFilesToUpload = new Array<FileInfo>();
  }
  ngAfterViewInit(): void {
    if (this.TecDoc) {
      this.TecDocSupp = this.TecDoc.Supplier;
      this.productDropdownComponent.TecDocSupplier = this.TecDoc.Supplier;
      this.getTecDocData();
      this.addTecDocMissingVehicleBrands();
      this.tecdocService.SelectedArticle = null;
      this.caracteristics = this.tecdocService.caracteristics;
      this.productDropdownComponent.CreateAndinitDataSource(this.TecDoc.Supplier);
    }
  }

  /** check route (update or depilcate item) */
  private checkRoutes() {
    if (this.router.url.indexOf(ItemConstant.DUPLICATE_ITEM) < 0) {
      this.idSubscription = this.activatedRoute.params.subscribe(params => {
        this.id = +params[ItemConstant.ID] || 0;
        this.isUpdateMode = true;
        this.itemService.show(this.isUpdateMode);
      });
    } else {
      this.idSubscription = this.activatedRoute.params.subscribe(params => {
        this.id = +params[ItemConstant.CLONE_ID] || 0;
        this.idItemToDuplicate = +params[ItemConstant.CLONE_ID] || 0;
        this.isDuplicated = true;
      });
    }
  }

  /**
   * On
   * */
  ngOnInit(): void {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ITEM_STOCK);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ITEM_STOCK);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ITEM_STOCK);
    this.hasUpdatePurchasePricePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ITEMPRICE_PURCHASE);
    this.hasUpdateSalePricePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ITEMPRICE_SA);
    this.hasSynchronizePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SYNCHRONIZE_TECDOC);
    this.hasAddMesureUnitPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_MEASUREUNIT);
    this.TecDoc = this.tecdocService.SelectedArticle;
    this.itemToUpdate = new Item();
    this.isUpdateMode = this.id > 0 && this.isUpdateMode;
    this.isDuplicated = this.id > 0 && this.isDuplicated;
    this.createAddForm();
    if (this.isUpdateMode || this.isDuplicated) {
      this.getDataToUpdate();
    } else {
      this.typeSelected(this.itemForm.controls['IdNature'].value, true);
      if (this.TecDoc) {
        this.TecDocSupp = this.TecDoc.Supplier;
        this.getTecDocData();
        this.tecdocService.SelectedArticle = null;
        this.caracteristics = this.tecdocService.caracteristics;
      }
    }
    this.formatSaleOptions = {
      style: 'currency',
      currency: this.localStorageService.getCurrencyCode(),
      currencyDisplay: 'symbol',
      minimumFractionDigits: this.localStorageService.getCurrencyPrecision()
    };
    if (this.itemForm && this.itemForm.controls['UnitHtsalePrice']) {
      this.itemForm.controls['UnitHtsalePrice'].setValidators([Validators.min(0), digitsAfterComma(this.localStorageService.getCurrencyPrecision())]);
    }
    this.itemService.syncItem = undefined;
    this.getGallery();
    if (!this.isUpdateMode && !this.isDuplicated) {
      this.addItemWarehouse();
    }
  }

  public updateItemPrice() {
    this.rolesService.ListRoleConfigsAsObservable().subscribe((roledata: Array<any>) => {
      this.rolesService.hasOnlyRoles(RoleConfigConstant.ItemPrice_Update)
        .then(x => {
          this.updatePriceRole = x;
          if (this.updatePriceRole) {
            this.itemForm.controls['UnitHtsalePrice'].enable();
          }
        });

    });
  }


  /**
   * On destroy
   * */
  ngOnDestroy(): void {
    if (this.idSubscription !== undefined) {
      this.idSubscription.unsubscribe();
    }
    if (this.itemSubscription !== undefined) {
      this.itemSubscription.unsubscribe();
    }
  }

  getTecDocData() {
    this.itemToUpdate.Code = this.TecDoc.Reference;
    this.itemToUpdate.TecDocId = this.TecDoc.Id;
    this.itemToUpdate.Description = this.TecDoc.Description;
    this.itemToUpdate.TecDocRef = this.TecDoc.Reference;
    this.itemToUpdate.BarCode1D = this.TecDoc.BarCode;
    this.itemToUpdate.TecDocIdSupplier = this.TecDoc.IdSupplier;
    this.itemToUpdate.TecDocImageUrl = this.TecDoc.ImagesUrl;
    this.itemToUpdate.TecDocImageList = this.TecDoc.TecDocImageList;
    this.itemToUpdate.TecDocBrandName = this.TecDoc.Supplier;

    this.isStockManged = true;
    this.initItemWarehousesForm();
    this.initItemsBrandsForm();
    this.initOemItemForm();
    this.unitService.getModelByCondition(this.unitPredicate()).subscribe(x => {
      this.itemToUpdate.IdUnitStock = x.Id;
      this.itemToUpdate.IdUnitSales = x.Id;
      this.itemForm.patchValue(this.itemToUpdate);
    });
  }

  /**
   * Get Item to update
   * */
  private getDataToUpdate() {
    this.itemSubscription = this.itemService.getModelByCondition(this.preparePredicateItemToUpdate()).subscribe(data => {
      this.itemToUpdate = data;
      if(this.itemToUpdate && this.itemToUpdate.ItemKitIdKitNavigation && this.itemToUpdate.ItemKitIdKitNavigation.length > 0){
        this.openBrandCollapse = true;
      }
      if (this.itemToUpdate && this.itemToUpdate.OemItem && this.itemToUpdate.OemItem.length > 0 && this.itemToUpdate.OemItem.find(x => x.IdBrandNavigation == null)) {
        this.growlService.warningNotification(this.translate.instant(ItemConstant.OEM_CONTAINS_ITEM_WITHOUT_BRAND));
      }
      this.itemSalesPrices = data.ItemSalesPrice;
      if (data.ItemTiers !== null) {
        this.suppliersSelected = data.ItemTiers;
      } else {
        this.suppliersSelected = [];
      }
      if (this.itemToUpdate.IdNatureNavigation && this.itemToUpdate.IdNatureNavigation.Code == 'Expense') {
        this.hideExpenseInNature = false;
        this.isExpenseNature = true;
        this.natureDropDown.initDataSource();
        this.itemForm.controls['Code'].clearValidators();
        this.itemForm.controls['Code'].reset();
        this.itemForm.controls['Code'].disable();
        this.itemForm.controls['Description'].clearValidators();
        this.itemForm.controls['Description'].reset();
        this.itemForm.controls['Description'].disable();
        this.itemForm.controls['ListTiers'].disable();
        this.itemForm.controls['IdNature'].disable();
        this.itemForm.controls['TaxeItem'].disable();
      }
      if (this.isDuplicated) {
        this.itemToUpdate.HaveClaims = false;
      }
      if (this.suppliersSelected) {
        this.suppliersSelected.forEach(supplier => {
          this.currencyService.getById(supplier.IdTiersNavigation.IdCurrency).subscribe(x => {
            supplier.PurchasePriceCurrency = this.setTierCurrency(x);
          });
        });
      }
      if (this.itemToUpdate.IdTiersNavigation) {
        this.currencyService.getById(data.IdTiersNavigation.IdCurrency).subscribe(x => {
          this.setSelectedCurrency(x);
        });
      } else {
        this.setSelectedCurrency();
      }

      this.receiveFamily(data[ItemConstant.IdFamily]);
      this.itemToUpdate.TaxeItem = this.buildTaxes(this.itemToUpdate.TaxeItem);
      this.isStockManged = this.itemToUpdate.IdNatureNavigation.IsStockManaged;
      this.initOemItemForm();
      if (this.isUpdateMode) {
        this.initItemWarehousesForm();
        this.initItemsBrandsForm();
        if (this.isDuplicated) {
          this.itemToUpdate.Id = 0;
        }
        if (this.itemToUpdate.OemItem == null) {
          this.itemToUpdate.OemItem = [];
        }
        if (this.itemToUpdate.TecDocImageList == null) {
          this.itemToUpdate.TecDocImageList = [];
        }
        this.itemForm.patchValue(this.itemToUpdate);
      }
      /**remove code and id item when the item is deplicated */
      if (this.isDuplicated) {
        if (this.itemToUpdate.OemItem == null) {
          this.itemToUpdate.OemItem = [];
        }
        if (this.itemToUpdate.TecDocImageList == null) {
          this.itemToUpdate.TecDocImageList = [];
        }
        this.initDuplicatedItem();
      }

      this.typeSelected(this.itemForm.controls['IdNature'].value, true);
      if (data.IsUsed) {
        this.itemForm.controls['IdNature'].disable();
      }
      if (!this.isDuplicated) {
        if (data.FilesInfos && data.FilesInfos.length > 0) {
          data.FilesInfos.forEach(element => {
            this.mediaInfos.push(new MediaInfo(element, element.FileData));
          });
          this.attachmentFilesToUpload = data.FilesInfos;
          this.files = this.attachmentFilesToUpload;
        }
      }
    });
  }

  private setSelectedCurrency(currency?: ReducedCurrency) {
    if (currency) {
      this.formatPurchaseOptions = {
        style: 'currency',
        currency: currency.Code,
        currencyDisplay: 'symbol',
        minimumFractionDigits: currency.Precision
      };
    } else {
      this.formatPurchaseOptions = {
        style: 'currency',
        currency: this.localStorageService.getCurrencyCode(),
        currencyDisplay: 'symbol',
        minimumFractionDigits: this.localStorageService.getCurrencyPrecision()
      };
    }
  }

  private setTierCurrency(currency: Currency) {
    return {
      style: 'currency',
      currency: currency.Code,
      currencyDisplay: 'symbol',
      minimumFractionDigits: currency.Precision
    };
  }

  private initDuplicatedItem() {
    if (this.isStockManged) {
      this.warehouseService.getCentralWarehouse().subscribe(warehouse => {
        let itemWarehouse = new ItemWarehouse();
        itemWarehouse.IdWarehouse = warehouse.Id;
        itemWarehouse.MaxQuantity = NumberConstant.ONE_THOUSAND;
        itemWarehouse.MinQuantity = NumberConstant.FIVE;
        this.itemToUpdate.ItemWarehouse = [];
        this.itemToUpdate.ItemWarehouse.push(itemWarehouse);
        this.itemToUpdate.ItemWarehouse.forEach(element => {
          this.addItemWarehouse();
        });
        this.itemToUpdate.ItemVehicleBrandModelSubModel.forEach(element => {
          this.addItemBrand();
        });
        if (this.itemToUpdate.OemItem && this.itemToUpdate.OemItem.length > NumberConstant.ZERO) {
          this.itemToUpdate.OemItem.filter(x => { x.Id = NumberConstant.ZERO; x.IdItem = NumberConstant.ZERO; });
        }
        this.itemToUpdate.BarCode1D = '';
        this.itemToUpdate.BarCode2D = '';
        this.itemToUpdate.IdPolicyValorization = 0;
        this.itemToUpdate.CoeffConversion = 0;
        this.initCommonDuplicatedItem();
      });
    } else {
      this.initCommonDuplicatedItem();
    }
  }

  initCommonDuplicatedItem() {
    this.itemToUpdate.Id = 0;
    this.itemToUpdate.ItemTiers = [];
    this.suppliersSelected = [];
    this.itemToUpdate.ListTiers = [];
    this.itemToUpdate.UrlPicture = '';
    this.itemForm.patchValue(this.itemToUpdate);
    this.itemForm.controls[ItemConstant.ID_ITEM].setValue(0);
    this.itemForm.controls[ItemConstant.PURCHASING_PRICE].setValue(0);
    this.itemForm.controls[ItemConstant.SELLING_PRICE].setValue(0);
    this.itemForm.controls[ItemConstant.CODE].setValue('');
  }
  /**
   * Build taxeItem values to set in multiselect
   * @param taxeItem
   * @returns ids
   */
  buildTaxes(taxeItem: TaxeItem[]): number[] {
    const result = new Array<number>();
    if (taxeItem) {
      taxeItem.forEach(x => {
        result.push(x.IdTaxe);
      });
    }
    return result;
  }
  public showListProductItem() {
    this.productDropdownComponent.initDataSource(false);

    this.createAddForm();
  }
  /**
   * Itim itemwarehouse form
   * */
  initItemWarehousesForm() {
    if (this.itemToUpdate.ItemWarehouse) {
      this.itemToUpdate.ItemWarehouse.forEach(element => {
        this.ItemWarehouse.push(this.buildStorageForm());
      });
    }
  }

  /**
   * Itim itemBrand form
   * */
  initItemsBrandsForm() {
    if (this.itemToUpdate.ItemVehicleBrandModelSubModel) {
      this.itemToUpdate.ItemVehicleBrandModelSubModel.forEach(element => {
        this.addItemBrand();
      });
    }
  }

  /**
   * Create main form
   * */
  private createAddForm() {
    this.itemForm = this.fb.group({
      Id: [0],
      Code: ['', { validators: [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)] }],
      Description: ['', [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      Note: ['', Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY)],
      IdNature: ['', Validators.required],
      OnOrder: [0, Validators.required],
      IdUnitStock: [''],
      IdUnitSales: [''],
      IdFamily: [''],
      IdSubFamily: [''],
      BarCode1D: [''],
      BarCode2D: [''],
      CoeffConversion: [''],
      FixedMargin: ['', Validators.min(0)],
      VariableMargin: ['', Validators.min(0)],
      UnitHtpurchasePrice: [{ value: '', disabled: true }, Validators.min(0)],
      UnitHtsalePrice: [{ value: '', disabled: true }, Validators.min(0)],
      IdPolicyValorization: [''],
      TaxeItem: ['', Validators.required],
      ListTiers: ['', Validators.required],
      IdDiscountGroupItem: [''],
      TecDocId: [{ value: '', disabled: true }],
      TecDocRef: [''],
      TecDocIdSupplier: [''],
      IsForSales: [true, Validators.required],
      IsForPurchase: [true, Validators.required],
      ItemWarehouse: this.fb.array([]),
      ItemVehicleBrandModelSubModel: this.fb.array([]),
      IsKit: [false],
      ItemKit: [''],
      IdItemReplacement: [undefined],
      IdProductItem: [undefined],
      IsUsed: [false],
      TecDocImageList: this.fb.array([]),
      OemItem: this.fb.array([]),
      CostPrice: ['']
    });
    if ((this.isUpdateMode || this.isDuplicated) && !this.hasUpdatePermission) {
      this.itemForm.controls["Code"].disable();
      this.itemForm.controls["Description"].disable();
      this.itemForm.controls["BarCode1D"].disable();
      this.itemForm.controls["BarCode2D"].disable();
      this.itemForm.controls["CoeffConversion"].disable();
      this.itemForm.controls["UnitHtsalePrice"].disable();
      this.itemForm.controls["OnOrder"].disable();
      this.itemForm.controls["IsKit"].disable();
      this.itemForm.controls["Note"].disable();
    }
    if ((this.isUpdateMode || this.isDuplicated) && !this.hasUpdatePurchasePricePermission) {
      this.itemForm.controls["CoeffConversion"].disable();
    }
    else if (this.hasUpdatePermission) {
      this.itemForm.controls["CoeffConversion"].enable();
    }
    if ((this.isUpdateMode || this.isDuplicated) && !this.hasUpdateSalePricePermission) {
      this.itemForm.controls["UnitHtsalePrice"].disable();
    }
    else if (this.hasUpdatePermission || this.hasAddPermission) {
      this.itemForm.controls["UnitHtsalePrice"].enable();
    }
  }

  /**
   * Build ItemWarehouse Array form item
   * */
  buildStorageForm(): FormGroup {
    this.array = this.fb.group({
      Id: [0],
      IdItem: [0],
      IdWarehouse: [undefined, Validators.required],
      MinQuantity: [NumberConstant.FIVE, Validators.required],
      MaxQuantity: [NumberConstant.ONE_THOUSAND, Validators.required],
      Shelf: [''],
      IdStorage: [''],
      IsDeleted: [false]
    });
    return this.array;
  }

  /**
   * Build ItemBrand Array form item
   * */
  CreateFormGroupBrand(): FormGroup {
    this.arrayOfItemBrand = this.fb.group({
      Id: [0],
      IdItem: [0],
      IdVehicleBrand: [undefined, Validators.required],
      IdModel: [undefined],
      IdSubModel: [undefined],
      IsDeleted: [false]
    });
    return this.arrayOfItemBrand;
  }

  /**
  * Build ItemBrand Array form item
  * */
  CreateOemItemFormGroup(oemToadd?: OemItem): FormGroup {
    this.arrayOfOemItem = this.fb.group({
      Id: [oemToadd ? oemToadd.Id : NumberConstant.ZERO],
      IdItem: [oemToadd ? oemToadd.IdItem : NumberConstant.ZERO],
      Brand: [oemToadd ? oemToadd.Brand : undefined],
      OemNumber: [oemToadd ? oemToadd.OemNumber : undefined, Validators.required],
      IsDeleted: [false]
    });
    return this.arrayOfOemItem;
  }

  get IdStorage(): FormControl {
    return this.array.get('IdStorage') as FormControl;
  }

  get shelf(): FormControl {
    return this.array.get('Shelf') as FormControl;
  }

  /**
   * Add ItemWarehouse Array form item
   * */
  addItemWarehouse(): void {
    if (this.ItemWarehouse.valid) {
      this.ItemWarehouse.push(this.buildStorageForm());
    } else {
      this.validationService.validateAllFormGroups(this.ItemWarehouse);
    }
  }

  /**
   * Delete ItemWarehouse
   * @param i
   */
  deleteItemWarehouse(i: number): void {
    if (this.isUpdateMode || this.isDuplicated) {
      if (this.ItemWarehouse.at(i).get('Id').value === 0) {
        this.ItemWarehouse.removeAt(i);
      } else {
        this.ItemWarehouse.at(i).get(ItemConstant.IS_DELETED).setValue(true);
        this.itemService.checkWarehouseUnicity(this.itemForm.value.ItemWarehouse).subscribe(data => {
          this.lockedWarehouseList = data;
        });
      }
    } else {
      this.ItemWarehouse.removeAt(i);
    }
  }

  /**
   * Add ItembRAND Array form item
   * */
  addItemBrand(): void {
    if (this.isEmptyItemVehicle() || !this.isEmptyItemVehicle() && this.ItemVehicleBrandModelSubModel.valid) {
      this.ItemVehicleBrandModelSubModel.push(this.CreateFormGroupBrand());
    } else {
      this.validationService.validateAllFormGroups(this.ItemVehicleBrandModelSubModel);
    }
  }

  /**
   * Delete itemBrand
   * @param i
   */
  deleteItemBrand(i: number): void {
    this.ItemVehicleBrandModelSubModel.removeAt(i);
  }

  /**
   * Add Oem item
   * */
  addOemItem(oemToadd?: OemItem): void {
    if (this.OemItem.valid) {
      this.OemItem.push(this.CreateOemItemFormGroup(oemToadd));
    } else {
      this.validationService.validateAllFormGroups(this.OemItem);
    }
  }

  /**
   * Delete itemBrand
   * @param i
   */
  deleteOemItem(i: number): void {
    this.OemItem.removeAt(i);
  }
  /**
   * Prepre predicte condition
   * @returns new PredicateFormat
   * */
  preparePredicateItemToUpdate(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter('Id', Operation.eq, Number(this.id)));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ItemConstant.ID_TIERS_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ItemConstant.ITEM_WAREHOUSE)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ItemConstant.TAXE_ITEM)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ItemConstant.ID_NATURE_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ItemConstant.ITEM_KIT_ID_KIT)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ItemConstant.ITEM_KIT_ID_ITEM)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ItemConstant.ITEM_BRAND)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ItemConstant.ITEM_BRAND_PRODUCT)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ItemConstant.ITEM_TIERS)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ItemConstant.ITEM_TIERS_TIERS_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ItemConstant.OEM_ITEM)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ItemConstant.OEM_ITEM_ID_BRAND_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ItemConstant.ITEM_SALES_PRICE)]);
    return predicate;
  }


  naturePredicate(idNature: number): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter('Id', Operation.eq, idNature));
    return predicate;
  }

  unitPredicate(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter('MeasureUnitCode', Operation.eq, 'Pce'));
    return predicate;
  }


  /**
   * Get itemWarehouse row visibility
   * @param i
   * @returns boolean
   */
  isRowVisible(i): boolean {
    return !this.ItemWarehouse.at(i).get(ItemConstant.IS_DELETED).value;
  }

  isRowOfItemBrandVisible(i): boolean {
    return !this.ItemVehicleBrandModelSubModel.at(i).get(ItemConstant.IS_DELETED).value;
  }

  /**Item form Getters**/
  get ItemWarehouse(): FormArray {
    return this.itemForm.get(ItemConstant.ITEM_WAREHOUSE) as FormArray;
  }

  /**Item form Getters**/
  get ItemVehicleBrandModelSubModel(): FormArray {
    return this.itemForm.get(ItemConstant.ITEM_BRAND) as FormArray;
  }

  get OemItem(): FormArray {
    return this.itemForm.get(ItemConstant.OEM_ITEM) as FormArray;
  }

  get Code(): FormControl {
    return this.itemForm.get(ItemConstant.CODE) as FormControl;
  }

  get Description(): FormControl {
    return this.itemForm.get(ItemConstant.DESCRIPTION) as FormControl;
  }

  get CoeffConversion(): FormControl {
    return this.itemForm.get(ItemConstant.COEFFCONVERSION) as FormControl;
  }

  get FixedMargin(): FormControl {
    return this.itemForm.get(ItemConstant.FIXED_MARGIN) as FormControl;
  }

  get VariableMargin(): FormControl {
    return this.itemForm.get(ItemConstant.Variable_Margin) as FormControl;
  }

  get IdPolicyValorization(): FormControl {
    return this.itemForm.get(ItemConstant.Policy_Valorization) as FormControl;
  }

  get TaxeItem(): FormControl {
    return this.itemForm.get(ItemConstant.TAXE_ITEM) as FormControl;
  }

  get TecDocId(): FormControl {
    return this.itemForm.get(ItemConstant.TECDOC_ID) as FormControl;
  }

  get TecDocRef(): FormControl {
    return this.itemForm.get(ItemConstant.TECDOC_REF) as FormControl;
  }

  get BarCode1D(): FormControl {
    return this.itemForm.get(ItemConstant.BARCODE1D) as FormControl;
  }

  get BarCode2D(): FormControl {
    return this.itemForm.get(ItemConstant.BARCODE2D) as FormControl;
  }

  getOnlyFromDataBase(listEquivalenceChild) {
    for (let index = 0; index < listEquivalenceChild.length; index++) {
      const element = listEquivalenceChild[index];
      if (element.Reference) {
        listEquivalenceChild.splice(index, 1);
        index--;
      }

    }
    return listEquivalenceChild;
  }

  /**
   *
   * @param str normalize a string
   */
  normalise(str: string) {
    if (str === null) {
      str = '';
    }
    return str.toUpperCase().replace(/[^\w\s]/gi, '').trim();
  }

  saveProcess() {
    if (isNaN(Number(this.itemForm.controls.IdProductItem.value))) {
      this.itemForm.controls['IdProductItem'].setValue(null);
    }
    const obj: Item = Object.assign({}, this.itemToUpdate, this.itemForm.getRawValue());
    this.OemList = this.OemList.map(x => {
      return { 'IdBrand': x.IdBrand, 'OemNumber': x.OemNumber };
    })
    obj.OemItem = this.OemList;
    obj.TaxeItem = this.taxMultiSelect.selectedTaxeItems.filter(x => x.IdTaxe !== null);
    if (!this.isUpdateMode && this.assignEquivalenceChild && this.assignEquivalenceChild.listEquivalenceChild
      && this.assignEquivalenceChild.listEquivalenceChild.equivalenceGrpList) {
      obj.ListOfEquivalenceItem = this.getOnlyFromDataBase(this.assignEquivalenceChild.listEquivalenceChild.equivalenceGrpList);
    } else {
      obj.ListOfEquivalenceItem = undefined;
    }
    obj.ItemKitIdKitNavigation = this.kitItemComponent ? this.kitItemComponent.gridData : undefined;
    if (this.isDuplicated) {
      obj.IdNatureNavigation = null;
      obj.ItemWarehouse.forEach(element => {
        element.Id = 0;
      });
      obj.ItemVehicleBrandModelSubModel.forEach(element => {
        element.Id = 0;
      });
    }
    obj.ItemTiers = this.suppliersSelected;
    obj.IdTiersNavigation = null;
    obj.IdNatureNavigation = null;
    obj.TecDocImageList = this.itemToUpdate.TecDocImageList;
    this.files.forEach(file => {
      file.FileData = file.Data != undefined ? file.Data.toString() : file.FileData;
    });
    obj.FilesInfos = this.files;
    // clear itemWarehouse, kit, equivalence and replacement item if is not stock managed
    if (!this.isStockManged) {
      obj.ItemKitIdKitNavigation = [];
      obj.EquivalenceItem = null;
      obj.IdItemReplacement = null;
      obj.ItemWarehouse = [];
    }
    // if (obj.OemItem && obj.OemItem.length > NumberConstant.ZERO) {
    //   obj.OemItem.forEach(oemItem => {
    //     oemItem.OemNumber = this.normalise(oemItem.OemNumber);
    //   });
    // }
    obj.ItemSalesPrice = this.itemSalesPrices;
    this.itemService.saveItem(obj, !this.isUpdateMode).subscribe(() => {
      if (this.itemService.isPurchase || (this.router.url && this.router.url.toUpperCase().includes('PURCHASE'))) {
        this.router.navigateByUrl(ItemConstant.LIST_ITEMS_PURCHASE_URL);
      } else {
        this.router.navigateByUrl(ItemConstant.LIST_ITEMS_INVENTORY_URL);
      }

    });
  }

  /**
   * Save item
   * */
  saveItem() {
    if (this.verifTaxes()) {
      this.saveProcess();
    }
  }

  verifTaxes(): boolean {
    let listOfTaxesOutOfTaxTiersConfig: any[] = [];
    if (this.itemForm.controls['ListTiers'].value && this.SupplierDropdownComponent) {
      let selectedTiers = this.SupplierDropdownComponent.supplierDataSource.filter(
        x => x.Id == this.itemForm.controls['ListTiers'].value);
      if (selectedTiers && selectedTiers.length > 0) {
        let selectedTaxes = this.taxMultiSelect.taxeDataSource.filter(x => this.taxMultiSelect.selectedValues.indexOf(x.Id) >= 0);
        if (selectedTaxes && selectedTaxes.length > 0) {
          selectedTaxes.forEach((y: any) => {
            if (y.TaxeGroupTiersConfig && y.TaxeGroupTiersConfig.length > 0) {
              let taxeTiers = y.TaxeGroupTiersConfig.filter(z => z.IdTaxeGroupTiers == selectedTiers[0].IdTaxeGroupTiers);
              if (!taxeTiers || taxeTiers.length == 0) {
                listOfTaxesOutOfTaxTiersConfig.push(y);
              }
            }
            //if (y. == selectedTiers.IdTaxeGroupTiers)
          });
          if (listOfTaxesOutOfTaxTiersConfig.length > 0) {
            let listTaxesName = '';
            listOfTaxesOutOfTaxTiersConfig.forEach(u => listTaxesName += u.CodeTaxe + ", ")
            this.growlService.warningNotification(this.translate.instant('TAXES') + " : " + listTaxesName +
              this.translate.instant('ERROR_TAX_GROUP'));

            return false;

          } else
            return true;
        }
      }
      return true;
    } else {
      return true;
    }

  }


  saveFormTouched() {
    if (this.itemForm.touched) {
      this.saveProcess();
      if (this.itemService.isPurchase) {
        this.router.navigate([ItemConstant.LIST_ITEMS_URL_PURCHASE]);
      } else {
        this.router.navigate([ItemConstant.LIST_ITEMS_URL]);
      }
    } else {
      if (this.itemService.isPurchase) {
        this.router.navigate([ItemConstant.LIST_ITEMS_URL_PURCHASE]);
      } else {
        this.router.navigate([ItemConstant.LIST_ITEMS_URL]);
      }
    }
  }

  save() {
    this.selectValorisationConditionTab = false;
    this.checkBrandCollapseOpening();
    this.checkOemCollapseOpening();
    if (this.SupplierDropdownComponent) {
      this.SupplierDropdownComponent.isMultiSelectTouched = true;
    }
    this.validationService.validateAllFormFields(this.itemForm);
    if (this.FilteredOemList.find(x => x.IdBrandNavigation == null)) {
      this.growlService.ErrorNotification(this.translate.instant(ItemConstant.OEM_CONTAINS_ITEM_WITHOUT_BRAND));
    } else {
      if (this.itemForm.valid) {
        if (!this.itemSaved) {
          this.saveItem();
        } else if (this.itemSaved) {
          this.saveFormTouched();
        }
      } else {
        if (!this.itemForm.controls['IdUnitStock'].valid || !this.itemForm.controls['IdUnitSales'].valid) {
          this.selectValorisationConditionTab = true;
        }
        this.goToInvalidPage();
      }
    }
  }

  /**
   * Check if warhouse is already exit in List
   * @param $event
   */
  public warehouseSelected($event) {
    if (this.itemForm.value.ItemWarehouse.filter(x => x.IdWarehouse !== null).length > NumberConstant.ZERO) {
      this.itemService.checkWarehouseUnicity(this.itemForm.value.ItemWarehouse).subscribe(data => {
        this.lockedWarehouseList = data;
      });
    }
  }

  // check Item is Manged In stock
  public typeSelected($event, isValueSet?: boolean) {
    if ($event) {
      if (!isValueSet) {
        this.itemForm.controls['IdNature'].setValue($event);
      }
      var currentComponent = this;
      this.natureService.getById($event as number).subscribe(data => {
        this.isStockManged = data.IsStockManaged;
        this.steps[NumberConstant.ONE].isVisible = this.isStockManged;
        this.steps[NumberConstant.TWO].isVisible = this.isStockManged;
        this.steps[NumberConstant.FOUR].isVisible = this.isStockManged;
        this.finalStep = this.isStockManged ? NumberConstant.FOUR : NumberConstant.THREE;
        if (this.isUpdateMode && data.IsStockManaged) {
          this.productNatuerId = data.Id;
          this.IsSupplierRequired = true;
        }
        if (this.isStockManged) {
          if (this.itemToUpdate.IdFamily) {
            this.receiveFamily(this.itemToUpdate[ItemConstant.IdFamily], true);
          }

          this.itemForm.controls['ListTiers'].setValidators([Validators.required]);
          this.itemForm.controls['IdUnitStock'].setValidators([Validators.required]);
          if (this.itemForm.value['IsForSales']) {
            this.itemForm.controls['IdUnitSales'].setValidators([Validators.required]);
          }
          this.IsSupplierRequired = true;
          // in update mode if nature will be stockManaged ==> add storageForm
          if ((this.itemToUpdate && this.itemToUpdate.IdNatureNavigation && !this.itemToUpdate.IdNatureNavigation.IsStockManaged)
            || this.ItemWarehouse.length === NumberConstant.ZERO) {
            this.ItemWarehouse.push(this.buildStorageForm());
          }
        } else {
          this.itemForm.controls['IdUnitStock'].clearValidators();
          this.itemForm.controls['IdUnitSales'].clearValidators();
          this.itemForm.controls['ItemWarehouse'].clearValidators();
          this.itemForm.controls['ItemWarehouse'] = this.fb.array([]);
          this.itemForm.controls['ListTiers'].setValidators(null);
          this.itemForm.controls['ListTiers'].setErrors(null);
          this.itemForm.controls['BarCode1D'].reset();
          this.itemForm.controls['BarCode2D'].reset();
          this.itemForm.controls['IdFamily'].reset();
          this.itemForm.controls['IdSubFamily'].reset();
          this.itemForm.controls['IdItemReplacement'].reset();
          this.ItemVehicleBrandModelSubModel.reset();
          this.itemForm.controls['ItemVehicleBrandModelSubModel'] = this.fb.array([]);
          this.itemForm.controls['IdPolicyValorization'].reset();
          this.itemForm.controls['CoeffConversion'].reset();
          this.itemForm.controls['IdProductItem'].reset();
          this.itemForm.controls['IsKit'].setValue(false);
          this.OemItem.reset();
          this.itemForm.controls['OemItem'] = this.fb.array([]);
          if (this.natureCode === NatureCodeEnum.Expense) {
            this.IsSupplierRequired = false;
            this.itemForm.controls['ListTiers'].setValidators([Validators.required]);
          } else {
            var tierValue = this.itemForm.controls['ListTiers'].value;
            this.IsSupplierRequired = false;
            this.itemForm.controls['ListTiers'].clearValidators();
            this.itemForm.controls['ListTiers'].reset();
            this.itemForm.controls['ListTiers'].setValue(tierValue);
          }
          if (data.Code === NatureCodeEnum.AdvancePayment) {
            this.itemForm.controls['IsForPurchase'].setValue(false);
            this.showPriceCategory = false;
            this.disableTaxe = true;
            this.showSupplierDropdown = false;
            if (this.taxMultiSelect) {
              this.taxMultiSelect.selectedValues = [];
              var tva_Avance_String = 'TVA_Avance0%';

              var tax_0 = currentComponent.taxMultiSelect.taxeFiltredDataSource.filter(x => x.TaxeValue != null && x.TaxeType != null && x.TaxeValue == 0 && x.TaxeType == 1 &&
                x.CodeTaxe != null && x.CodeTaxe.toUpperCase() == tva_Avance_String.toUpperCase());
              if (tax_0 && tax_0.length > 0) {
                this.taxMultiSelect.selectedValues.push(tax_0[0].Id);
              }
            }
          }
        }
      });
      if (isValueSet && this.itemToUpdate.IdProductItem) {
        this.itemForm.controls['IdProductItem'].setValue(this.itemToUpdate.IdProductItem);
      }

    }

  }

  /**
   * On change family, receive the selected value
   * */
  receiveFamily($event, isFromEditItem = false) {
    if (this.subFamilyChild) {
      this.subFamilyChild.initDataSource($event, isFromEditItem);
    }
  }

  /** duplicte item from edited item */
  colneItem() {
    const id = this.itemForm.controls[ItemConstant.ID_ITEM].value;
    if (this.itemService.isPurchase) {
      this.router.navigateByUrl(ItemConstant.DUPLICATE_ITEM_URL_PURCHASE.concat(id));
    } else {
      this.router.navigateByUrl(ItemConstant.DUPLICATE_ITEM_URL.concat(id));
    }
  }

  openSyncModal() {
    const TITLE = ItemConstant.SYNCHRONIZE;
    const itemtoSync = this.itemForm.getRawValue();
    this.formModalDialogService.openDialog(TITLE, TecDocSyncStepperComponent,
      this.viewRef, this.close.bind(this),
      itemtoSync, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  public close() {
    if (this.itemService.syncItem) {
      var stepIndex = this.steps.findIndex(x=> x.selected == true)
      if(stepIndex && stepIndex != 0){
        this.steps[stepIndex].selected = false ;
        this.steps[NumberConstant.ZERO].selected =  true;
      }
      this.updateFromSyncTecDoc();
      this.modalService.closeAnyExistingModalDialog();
      this.productDropdownComponent.CreateAndinitDataSource(this.itemService.syncItem.LabelProduct);
      this.itemForm.patchValue(this.itemToUpdate);
      console.log(this.itemForm.value)
    }
  }

  updateFromSyncTecDoc() {
    this.itemToUpdate.Code = this.itemService.syncItem.Code;
    this.itemToUpdate.Description = this.itemService.syncItem.Description;
    this.itemToUpdate.LabelProduct = this.itemService.syncItem.LabelProduct;
    this.itemToUpdate.BarCode1D = this.itemService.syncItem.BarCode1D;
    this.itemToUpdate.TecDocId = this.itemService.syncItem.TecDocId;
    this.itemToUpdate.TecDocRef = this.itemService.syncItem.TecDocRef;
    this.itemToUpdate.TecDocIdSupplier = this.itemService.syncItem.TecDocIdSupplier;
    this.itemToUpdate.TecDocImageUrl = this.itemService.syncItem.TecDocImageUrl;
    this.itemToUpdate.TecDocBrandName = this.itemService.syncItem.TecDocBrandName;
    this.itemToUpdate.TecDocImageList = this.itemService.syncItem.TecDocImageList;
    if (this.itemService.syncItem.OemItem && this.itemService.syncItem.OemItem.length > NumberConstant.ZERO) {
      this.itemToUpdate.OemItem = this.itemService.syncItem.OemItem;
      this.itemService.syncItem.OemItem = [];
      this.OemItem.reset();
      this.itemForm.controls['OemItem'] = this.fb.array([]);
      this.initOemItemForm();
    }
  }

  updateDesignation() {
    if (this.itemForm.controls['Description'].value === '') {
      this.growlService.ErrorNotification(this.translate.instant('UPDATE_DESCRIPTION_ITEM_ERROR'));
    } else {
      this.itemSaved = true;
      const itemToUpdate = new ReducedEquivalentItem();
      const swalWarningMessage = `${this.translate.instant(ItemConstant.EDIT_DESIGNATION_MESSAGE)}`;
      const swalWarningTitle = 'APPLY_CHANGES_EQUIV_PRODUCTS';
      const swalWarningConfirm = `${this.translate.instant(ItemConstant.VALIDATION_CONFIRM)}`;
      itemToUpdate.Description = this.itemForm.controls['Description'].value;
      itemToUpdate.EquivalenceItem = this.itemToUpdate.EquivalenceItem;
        this.swalWarrings.CreateSwal(ItemConstant.EDIT_DESIGNATION_MESSAGE, swalWarningTitle, SharedConstant.YES, SharedConstant.NO)
          .then((result) => {
            if (result.value) {
              if (this.itemToUpdate.EquivalenceItem) {
                this.itemService.updateItemEquivalentDesignation(itemToUpdate).subscribe(() => {
                  this.assignEquivalenceChild.listEquivalenceChild.item.EquivalenceItem = itemToUpdate.EquivalenceItem;
                  this.assignEquivalenceChild.listEquivalenceChild.Assign();
                });
              }
            }
          });
    }
  }

  public selectedFiles($event) {
    this.files = [];
    this.files = $event;
  }

  setUnitSalesValidators() {
    if (this.itemForm.value['IsForSales']) {
      this.itemForm.controls['IdUnitSales'].setValidators([Validators.required]);
    } else {
      this.itemForm.controls['IdUnitSales'].clearValidators();
      this.itemForm.controls['IdUnitSales'].reset();
    }
  }

  public onSelectFiles(event) {
    for (const file of event.target.files) {
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        if (file.type.startsWith("image/")) {
          reader.onload = () => {
            this.pictureFileInfo = new FileInfo();
            this.pictureFileInfo.Name = file.name;
            this.pictureFileInfo.Extension = file.type;
            this.pictureFileInfo.FileData = (<string>reader.result).split(',')[1];
            this.mediaInfos.push(new MediaInfo(this.pictureFileInfo, reader.result));
            this.files.push(this.pictureFileInfo);
          };
        }
      }
    }
  }

  public nextStep() {
    if (this.hasUpdatePermission) {
      let valid = false;
      const currentIndex = this.getCurrentIndex();
      this.validateSteps(currentIndex);
      if (this.isCurrentStep(currentIndex, NumberConstant.ZERO) && this.validateRequiredFirstStep() ||
        this.isCurrentStep(currentIndex, NumberConstant.ONE) && !(this.validateCharacteristicStep()) && this.OemItem.valid ||
        this.isCurrentStep(currentIndex, NumberConstant.TWO) && this.ItemWarehouse.valid ||
        this.isCurrentStep(currentIndex, NumberConstant.THREE) && this.checkValidityUnitStockAndSales()) {
        valid = true;
        this.selectValorisationConditionTab = true;
      }
      if (valid) {
        this.goToChoosenStep(currentIndex, true);
      } else {
        if (currentIndex === NumberConstant.ZERO) {
          this.SupplierDropdownComponent.isMultiSelectTouched = true;
          this.validationService.validateAllFormFields(this.itemForm);
          this.ItemWarehouse.reset();
        }
        if (currentIndex === NumberConstant.ONE) {
          this.validationService.validateAllFormFields(this.itemForm);
          this.ItemWarehouse.reset();
        }
        if (currentIndex === NumberConstant.TWO) {
          this.validationService.validateAllFormGroups(this.ItemWarehouse);
          this.itemForm.controls[ItemConstant.IdUnitStock].reset();
          this.itemForm.controls[ItemConstant.IdUnitSales].reset();
          this.itemForm.controls[ItemConstant.TAXE_ITEM].reset();
        }
        if (currentIndex === NumberConstant.THREE) {
          this.validationService.validateAllFormFields(this.itemForm);
        }
      }
    } else {
      this.goToChoosenStep(this.getCurrentIndex(), true);
    }

  }

  goToInvalidPage() {
    if (!this.validateRequiredFirstStep()) {
      this.goToChoosenStep(NumberConstant.ZERO);
    } else if (this.validateCharacteristicStep() || !this.OemItem.valid) {
      this.goToChoosenStep(NumberConstant.ONE);
    } else if (!this.ItemWarehouse.valid) {
      this.goToChoosenStep(NumberConstant.TWO);
    } else if (!this.checkValidityUnitStockAndSales()) {
      this.goToChoosenStep(NumberConstant.THREE);
      this.selectValorisationConditionTab = true;
    }
  }

  checkBrandCollapseOpening() {
    if (!this.openBrandCollapse && !this.ItemVehicleBrandModelSubModel.valid) {
      const temporaryItemsVehicle = this.ItemVehicleBrandModelSubModel;
      temporaryItemsVehicle.controls.forEach((element, index) => {
        if (element.invalid) {
          this.ItemVehicleBrandModelSubModel.removeAt(index);
        }
      });
    }
  }

  public isActive(index) {
    return this.steps[index].selected;
  }

  public validateRequiredFirstStep() {
    return this.itemForm.controls[ItemConstant.CODE].valid && this.itemForm.controls[ItemConstant.DESCRIPTION].valid
      && this.itemForm.controls[ItemConstant.LIST_TIERS].valid && this.itemForm.controls[ItemConstant.ID_ITEM_BRAND_PRODUCT].valid
      && (this.IdNature.disabled || this.IdNature.valid);
  }

  public checkValidityUnitStockAndSales() {
    return this.itemForm.controls[ItemConstant.IdUnitStock].valid && this.itemForm.controls[ItemConstant.IdUnitSales].valid;
  }

  public goToChoosenStep(index, increment?: boolean) {
    this.validateSteps(index);
    const next = increment ? !this.isStockManged ? NumberConstant.THREE : index + NumberConstant.ONE : index;
    this.steps.forEach(data => data.selected = false);
    this.steps[next].selected = true;
  }

  public isValidCuurentStep(currentIndex: number): boolean {

    return this.validateRequiredFirstStep();

  }

  /**todo
   * get data from the backend
   */
  public getGallery() {
    if (this.isUpdateMode) {
      /**
       *  to do galleryList
       */

    }
  }

  public selectedChange() {
    this.openBrandCollapse = !this.openBrandCollapse;
    if (this.openBrandCollapse) {
      const temporaryItemsVehicle = this.ItemVehicleBrandModelSubModel;
      temporaryItemsVehicle.controls.forEach((element, index) => {
        if (element.invalid) {
          this.ItemVehicleBrandModelSubModel.removeAt(index);
        }
      });
    }
  }

  public isEmptyItemVehicle(): boolean {
    return this.ItemVehicleBrandModelSubModel.length === NumberConstant.ZERO;
  }

  public expandGallery() {
    this.formModalDialogService.openDialog(SharedConstant.GALLERY, GalleryCardComponent
      , this.viewRef, this.updateFiles.bind(this),
      { mediaInfos: this.mediaInfos },
      false, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  public validateUrlVideo(value) {
    if (this.validURL(value)) {
      this.disableUrVideo = false;
    }
  }

  public importUrlVideo() {
    const videoFileInfo = new FileInfo();
    if (this.isExtensionValid(this.urlFileVideo)) {
      videoFileInfo.Extension = MediaConstant.EXTENSION_TYPE_MP4;
    }
    this.mediaInfos.push(new MediaInfo(videoFileInfo, this.urlFileVideo));
    this.closebutton.nativeElement.click();
    this.disableUrVideo = true;
    this.urlFileVideo = SharedConstant.EMPTY;
  }

  public getSrcFile(index: number) {
    if (this.mediaInfos[index] && this.mediaInfos[index].fileInfo &&
      (this.mediaInfos[index].fileInfo.Extension === MediaConstant.EXTENSION_TYPE_MP4 ||
        this.mediaInfos[index].fileInfo.Extension === MediaConstant.DOT_MP4 ||
        isNullOrUndefined(this.mediaInfos[index].fileInfo.Extension))) {
      return MediaConstant.PLACEHOLDER_VIDEO;
    } else {
      return this.mediaInfos[index].src;
    }
  }

  public validURL(str) {
    const pattern = new RegExp(MediaConstant.PATTERN_URL, 'i');
    return !!pattern.test(str);
  }

  public isExtensionValid(str): boolean {
    return str.slice(str.length - NumberConstant.FOUR) === MediaConstant.DOT_MP4;
  }

  public updateFiles(): void {
    this.files = [];
    this.mediaInfos.forEach(file => {
      this.files.push(file.fileInfo);
    });
  }

  /**
   * todo
   * get suppliersSelected informations
   * Buying price,exchange rate, Margin
   */
  public selectedValue($event) {
    const ListSuppliers = ($event);
    for (const tier of ListSuppliers) {
      if (!(this.suppliersSelected.map(x => x.IdTiers).includes(tier.Id))) {
        let tierItem = new ItemTiers();
        tierItem.IdTiers = tier.Id;
        tierItem.IdTiersNavigation = tier;
        this.currencyService.getById(tierItem.IdTiersNavigation.IdCurrency).subscribe(x => {
          tierItem.PurchasePriceCurrency = this.setTierCurrency(x);
          this.suppliersSelected.push(tierItem);

        });
      }
    }
    this.suppliersSelected = this.suppliersSelected.filter(x => ListSuppliers.map(y => y.Id).includes(x.IdTiers));
  }


  public editHandler({ sender, rowIndex, dataItem }) {
    this.PriceformGroup = new FormGroup({
      'PurchasePrice': new FormControl(dataItem.PurchasePrice, { validators: [digitsAfterComma(dataItem.PurchasePriceCurrency ? dataItem.PurchasePriceCurrency.minimumFractionDigits : NumberConstant.THREE), strictSup(0)] }),
      'ExchangeRate': new FormControl(dataItem.ExchangeRate, { validators: [Validators.maxLength(NumberConstant.TWENTY), digitsAfterComma(NumberConstant.FIVE), strictSup(0)] }),
      'Cost': new FormControl(dataItem.Cost, { validators: [digitsAfterComma(this.formatSaleOptions ? this.formatSaleOptions.minimumFractionDigits : NumberConstant.THREE), strictSup(0)] }),
      'Margin': new FormControl(dataItem.Margin, { validators: [Validators.maxLength(NumberConstant.TWENTY), digitsAfterComma(NumberConstant.FIVE), Validators.min(0)] })
    });

    this.editedRowIndex = rowIndex;
    if (!this.hasUpdatePurchasePricePermission) {
      this.PriceformGroup.controls.PurchasePrice.disable();
    }
    this.PriceformGroup.controls.Cost.disable();
    this.PriceformGroup.controls.ExchangeRate.disable();
    this.PriceformGroup.controls.Margin.disable();
    sender.editRow(rowIndex, this.PriceformGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler(event) {
    const product = event.formGroup.value;
    if (event.formGroup.valid) {
      event.dataItem.PurchasePrice = product.PurchasePrice;
      event.dataItem.Cost = event.dataItem.Cost;
      event.dataItem.ExchangeRate = event.dataItem.ExchangeRate;
      event.dataItem.Margin = event.dataItem.Margin;
      event.sender.closeRow(event.rowIndex);
    }
    this.validationService.validateAllFormFields(event.formGroup);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.PriceformGroup = undefined;
  }

  public goToFileProduct() {
    window.open(ItemConstant.URL_SHOW_ITEM_FROM_LIST_PRODUCT.concat(this.itemToUpdate.Id.toString()), '_blank');
  }

  public isTabActive(index: number) {
    return this.steps[index].selected === true;
  }

  get IdNature(): FormControl {
    return this.itemForm.get(ItemConstant.ID_NATURE) as FormControl;
  }

  get IsKit(): FormControl {
    return this.itemForm.get(ItemConstant.ISKIT) as FormControl;
  }

  get ListTiers(): FormControl {
    return this.itemForm.get(ComponentsConstant.LIST_TIERS) as FormControl;
  }

  get errorMessage() {
    if (this.ListTiers && this.SupplierDropdownComponent) {
      for (const propertyName in this.ListTiers.errors) {
        if (this.ListTiers.errors.hasOwnProperty(propertyName) && this.ListTiers.touched) {
          return this.validationService.getValidatorErrorMessage(propertyName, this.ListTiers.errors[propertyName]);
        }
      }
    }
  }

  getCurrentIndex(): number {
    const currentElement = this.el.nativeElement.querySelector('.nav-item > .active');
    if (!isNullOrUndefined(currentElement)) {
      const currentStep = (element) => element.tag === currentElement.id.slice(NumberConstant.ZERO, -NumberConstant.FOUR);
      return this.steps.findIndex(currentStep);
    }
  }

  validateSteps(currentIndex: number) {
    this.steps[NumberConstant.ZERO].isValidate = this.validateRequiredFirstStep() && currentIndex >= NumberConstant.ZERO;
    this.steps[NumberConstant.ONE].isValidate = currentIndex >= NumberConstant.ONE;
    this.steps[NumberConstant.TWO].isValidate = this.ItemWarehouse.valid && currentIndex >= NumberConstant.TWO;
    this.steps[NumberConstant.THREE].isValidate = this.checkValidityUnitStockAndSales() && currentIndex >= NumberConstant.THREE;
    this.steps[NumberConstant.FOUR].isValidate = currentIndex >= NumberConstant.FOUR;
  }

  validateCharacteristicStep(): boolean {
    return this.openBrandCollapse && !this.ItemVehicleBrandModelSubModel.valid;
  }

  isCurrentStep(currentIndex, inedxToGo): boolean {
    return currentIndex === inedxToGo;
  }


  downloadCodeBar1D() {
    const qrcode = document.getElementById('barCode');
    this.downloadBarCode1DOr2D(qrcode.firstChild.firstChild, 'barCode');
  }

  downloadCodeBar2D() {
    const qrcode = document.getElementById('qrCode');
    this.downloadBarCode1DOr2D(qrcode.children[1], 'qrCode');
  }

  downloadBarCode1DOr2D(codeImg, barCodeName) {
    let doc = new jsPDF();
    let imageData = this.getBase64Image(codeImg, barCodeName);
    doc.setFontSize(9);
    if (barCodeName == 'qrCode') {
      doc.addImage(imageData, 'JPG', 10, 12);
    } else {
      doc.addImage(imageData, 'JPG', 10, 11);
    }
    var textWidth = doc.getStringUnitWidth(this.itemForm.controls['Code'].value);
    var textOffset = 30 - (textWidth);
    doc.text(textOffset, 7, this.itemForm.controls['Code'].value);

    var textWidth1 = doc.getStringUnitWidth(this.itemForm.controls['Description'].value);
    var textOffset1 = (30 - textWidth1);
    doc.text(textOffset1, 7, '\n' + this.itemForm.controls['Description'].value);
    doc.save(barCodeName + '.pdf');
  }

  getBase64Image(img, barCodeName) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width - 1;
    canvas.height = img.height - 1;
    var ctx = canvas.getContext('2d');
    if (barCodeName == 'qrCode') {
      canvas.width = 189;
      canvas.height = 113;
      ctx.drawImage(img, 0, 0, 189, 85);
    } else {
      ctx.drawImage(img, 0, 0, 189, 85);
    }
    var dataURL = canvas.toDataURL('image/png');
    return dataURL;
  }

  openDetailsBrandCollapse() {
    if (this.ItemVehicleBrandModelSubModel.length === NumberConstant.ZERO) {
      this.ItemVehicleBrandModelSubModel.push(this.CreateFormGroupBrand());
    }
  }

  isRowOfOemItemVisible(i): boolean {
    return !this.OemItem.at(i).get(ItemConstant.IS_DELETED).value;
  }

  /**
   * Init oem item form
   * */
  initOemItemForm() {
    if (this.itemToUpdate.OemItem && this.itemToUpdate.OemItem.length > NumberConstant.ZERO) {
      this.OemList = this.itemToUpdate.OemItem
      this.FilterOemlist();
      this.openOemCollapse = true;
    }
  }

  public selectedOemItemChange() {
    this.OemBrandComboBox.initDataSource();
    this.openOemCollapse = !this.openOemCollapse;
    if (this.openOemCollapse) {
      const oemItems = this.OemItem;
      oemItems.controls.forEach((element, index) => {
        if (element.invalid) {
          this.OemItem.removeAt(index);
        }
      });
    }
  }

  checkOemCollapseOpening() {
    if (!this.openOemCollapse && !this.OemItem.valid) {
      const oemItems = this.OemItem;
      oemItems.controls.forEach((element, index) => {
        if (element.invalid) {
          this.OemItem.removeAt(index);
        }
      });
    }
  }

  addOem() {
    if (this.OemBrandComboBox && this.OemBrandComboBox.selectedBandSource) {
      let OemToAdd = {
        IdBrand: this.OemBrandComboBox.selectedBandSource.Id,
        IdBrandNavigation: this.OemBrandComboBox.selectedBandSource,
        OemNumber: this.OemValue
      }
      if (!(this.OemList.find(x => x.IdBrandNavigation.Id === OemToAdd.IdBrandNavigation.Id && x.OemNumber === OemToAdd.OemNumber))) {
        this.OemList.push(OemToAdd);
        this.FilteredOemList = this.OemList.slice().sort((a, b) => a.IdBrand - b.IdBrand);
        this.OemBrandComboBox.selectedBrand = null;
        this.OemValue = "";
      }
      else {
        this.growlService.ErrorNotification(this.translate.instant("EXISTING_OEM"));
      }
    }
  }

  onEnterPress(event) {
    if (event.key === KeyboardConst.ENTER) {
      this.addOem()
    }
  }

  FilterOemlist() {
    if (this.OemBrandComboBox && this.OemBrandComboBox.selectedBandSource) {
      this.FilteredOemList = this.OemList.filter(x => x.IdBrandNavigation === this.OemBrandComboBox.selectedBandSource);
    }
    else {
      this.FilteredOemList = this.OemList.slice().sort((a, b) => a.IdBrand - b.IdBrand);
    }
  }

  RemoveOem(Oem) {
    this.OemList = this.OemList.filter(x => x !== Oem);
    this.FilterOemlist();
  }

  addTecDocMissingVehicleBrands() {
    let SavedBrandLabels;
    let listbrands = Array.from(new Set(this.TecDoc.OemNumbers.map(x => x.mfrName)))
    this.brandService.addTecDocMissingVehicleBrands(listbrands).subscribe(data => {
      SavedBrandLabels = data.map(x => x.Label);

      this.TecDoc.OemNumbers.forEach(Oemnumber => {
        let brand = data.filter(x => x.Label === Oemnumber.mfrName)[0]
        let Oem = new OemItem(0, Oemnumber.articleNumber, brand)
        Oem.IdBrand = Oem.IdBrandNavigation.Id;
        this.OemList.push(Oem)
      });
      this.FilterOemlist();
    });
  }






  public editItemSalesPriceHandler({ sender, rowIndex, dataItem }) {
    this.salesPriceFormGroup = new FormGroup({
      'Price': new FormControl(dataItem.Price, { validators: [digitsAfterComma(this.formatSaleOptions ? this.formatSaleOptions.minimumFractionDigits : NumberConstant.THREE), Validators.min(0)] }),
      'Percentage': new FormControl(dataItem.Percentage, digitsAfterComma(NumberConstant.THREE))
    });
    if ((this.itemForm.controls['UnitHtsalePrice'].value === 0 || this.itemForm.controls['UnitHtsalePrice'].value === null)
      && (this.salesPriceFormGroup.controls['Price'].value === NumberConstant.ZERO || this.salesPriceFormGroup.controls['Price'].value === null)) {

      this.salesPriceFormGroup.controls['Price'].disable();
    } else {
      this.salesPriceFormGroup.controls['Price'].enable();
    }
    this.salesEditRowIndex = rowIndex;
    sender.editRow(rowIndex, this.salesPriceFormGroup);
  }

  public removeItemSalesPriceHandler({ sender, rowIndex, dataItem }) {
    this.itemSalesPrices.splice(rowIndex, 1);
  }
  public cancelItemSalesPriceHandler({ sender, rowIndex }) {
    sender.closeRow(rowIndex);
    this.salesEditRowIndex = undefined;
    this.salesPriceFormGroup = undefined;
  }
  public AddItemSalesPrice() {
    let objectToSave: ItemSalesPrice = new ItemSalesPrice();
    objectToSave.IdSalesPrice = this.idSelectedSalesPrice;
    objectToSave.Price = Number(Number.parseFloat(this.valueSalesPrice.toString())
      .toFixed(this.formatSaleOptions ? this.formatSaleOptions.minimumFractionDigits : NumberConstant.THREE));
    objectToSave.IdItem = this.id;
    objectToSave.Percentage = this.percentageSalesPrice;
    objectToSave.IdSalesPriceNavigation = this.selectedSalesPrice;
    this.itemSalesPrices.push(objectToSave);
    this.SalesPriceDropDown.salesPriceComboBox.dataItem = undefined;
    this.SalesPriceDropDown.selectedValue = undefined;
    this.percentageSalesPrice = undefined;
    this.valueSalesPrice = undefined;
    this.cantAddPrice = true;
  }
  public salesPriceSelected($event) {
    if ($event) {
      let isSalesPriceExist = this.itemSalesPrices.filter(x => x.IdSalesPrice == $event.Id);
      if (isSalesPriceExist && isSalesPriceExist.length > 0) {
        this.growlService.ErrorNotification(this.translate.instant(SalesPriceConstant.ADD_EXISTING_Sales_Price));
        this.cantAddPrice = true;
        this.SalesPriceDropDown.salesPriceComboBox.dataItem = undefined;
        this.SalesPriceDropDown.selectedValue = undefined;
        this.percentageSalesPrice = undefined;
        this.valueSalesPrice = undefined;
      } else {
        this.cantAddPrice = false;
        this.selectedSalesPrice = $event;
        this.idSelectedSalesPrice = $event.Id;
        this.percentageSalesPrice = $event.Value
        if (this.itemForm && this.itemForm.controls && this.itemForm.controls['UnitHtsalePrice'] && this.itemForm.controls['UnitHtsalePrice'].value > 0) {
          if (this.percentageSalesPrice > 0) {
            this.valueSalesPrice = this.itemForm.controls['UnitHtsalePrice'].value + (this.itemForm.controls['UnitHtsalePrice'].value * (this.percentageSalesPrice / 100));
            this.valueSalesPrice = Number(Number.parseFloat(this.valueSalesPrice.toString()).toFixed(this.formatSaleOptions.minimumFractionDigits));
          } else {
            this.valueSalesPrice = ((this.percentageSalesPrice / 100) * this.itemForm.controls['UnitHtsalePrice'].value) + this.itemForm.controls['UnitHtsalePrice'].value
            this.valueSalesPrice = Number(Number.parseFloat(this.valueSalesPrice.toString()).toFixed(this.formatSaleOptions.minimumFractionDigits));
          }
        } else {
          this.valueSalesPrice = 0;
        }
      }

    } else {
      this.idSelectedSalesPrice = undefined;
      this.percentageSalesPrice = undefined;
      this.valueSalesPrice = undefined;
    }
  }
  public saveItemSalesPriceHandler($event) {
    const itemsalesPrice = $event.formGroup.value;
    if ($event.formGroup.valid) {
      if (itemsalesPrice.Price === "") {
        itemsalesPrice.Price = 0;
      }
      $event.dataItem.Price = itemsalesPrice.Price;
      $event.dataItem.Percentage = itemsalesPrice.Percentage;
      $event.sender.closeRow($event.rowIndex);
    }

  }
  public changePercentageSalesPrice() {
    if (this.itemForm && this.itemForm.controls && this.itemForm.controls['UnitHtsalePrice'] && this.itemForm.controls['UnitHtsalePrice'].value > 0) {
      if (this.percentageSalesPrice > 0) {
        this.valueSalesPrice = this.itemForm.controls['UnitHtsalePrice'].value + (this.itemForm.controls['UnitHtsalePrice'].value * (this.percentageSalesPrice / 100));
        this.valueSalesPrice = Number(Number.parseFloat(this.valueSalesPrice.toString()).toFixed(this.formatSaleOptions.minimumFractionDigits));
      } else {
        this.valueSalesPrice = ((this.percentageSalesPrice / 100) * this.itemForm.controls['UnitHtsalePrice'].value) + this.itemForm.controls['UnitHtsalePrice'].value
        this.valueSalesPrice = Number(Number.parseFloat(this.valueSalesPrice.toString()).toFixed(this.formatSaleOptions.minimumFractionDigits));
      }
    } else {
      this.valueSalesPrice = 0;
    }
  }
  public changeSalesPrice() {
    if (this.valueSalesPrice && this.valueSalesPrice > 0 && this.itemForm &&
      this.itemForm.controls && this.itemForm.controls['UnitHtsalePrice'] && this.itemForm.controls['UnitHtsalePrice'].value > 0) {
      this.percentageSalesPrice = ((this.valueSalesPrice - this.itemForm.controls['UnitHtsalePrice'].value) * 100) / this.itemForm.controls['UnitHtsalePrice'].value;
      this.percentageSalesPrice = Number(Number.parseFloat(this.percentageSalesPrice.toString()).toFixed(3));
    }
  }

  public changPercentageData() {
    if (this.salesPriceFormGroup && this.salesPriceFormGroup.controls && this.salesPriceFormGroup.controls['Percentage'].value) {
      var newPrice = Number(Number.parseFloat(((1 + (this.salesPriceFormGroup.controls['Percentage'].value / 100)) * this.itemForm.controls['UnitHtsalePrice'].value).toString()).toFixed(3));
      this.salesPriceFormGroup.controls['Price'].setValue(newPrice);

    }

  }
  public changePriceData() {
    if (this.salesPriceFormGroup && this.salesPriceFormGroup.controls && this.salesPriceFormGroup.controls['Price'].value && this.itemForm.controls['UnitHtsalePrice'].value > 0) {
      var newPercentage = Number(Number.parseFloat((((this.salesPriceFormGroup.controls['Price'].value - this.itemForm.controls['UnitHtsalePrice'].value) * 100) / this.itemForm.controls['UnitHtsalePrice'].value).toString()).toFixed(3));
      this.salesPriceFormGroup.controls['Percentage'].setValue(newPercentage);
    }
  }

  public changeBarCode1D() {
    this.itemForm.controls[ItemConstant.BARCODE1D].setValue(this.Code.value);
  }

}
