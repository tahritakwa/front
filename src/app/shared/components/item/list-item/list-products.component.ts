import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { GridComponent, GridDataResult, PagerSettings, RowArgs, RowClassArgs } from '@progress/kendo-angular-grid';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalWarring } from '../../swal/swal-popup';
import { ItemService } from '../../../../inventory/services/item/item.service';
import { Filter, Operation, Operator, OrderBy, OrderByDirection, PredicateFormat, Relation, SpecFilter } from '../../../utils/predicate';
import { GridSettings } from '../../../utils/grid-settings.interface';
import { Item } from '../../../../models/inventory/item.model';
import { ValidationService } from '../../../services/validation/validation.service';
import { ItemConstant } from '../../../../constant/inventory/item.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { KeyboardConst } from '../../../../constant/keyboard/keyboard.constant';
import { SearchConstant } from '../../../../constant/search-item';
import { FiltersItemDropdown } from '../../../../models/shared/filters-item-dropdown.model';
import { FetchProductsComponent } from '../../../../inventory/components/fetch-products/fetch-products.component';
import { RoleConfigConstant } from '../../../../Structure/_roleConfigConstant';
import { DocumentEnumerator, documentStatusCode } from '../../../../models/enumerators/document.enum';
import { SearchItemService } from '../../../../sales/services/search-item/search-item.service';
import { GrowlService } from '../../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { ListTecDocComponent } from '../../../../inventory/components/list-tec-doc/list-tec-doc.component';
import { FormModalDialogService } from '../../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { StarkRolesService } from '../../../../stark-permissions/service/roles.service';
import { DetailsProductComponent } from '../details-product/details-product.component';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { ActivityAreaEnumerator } from '../../../../models/enumerators/activity-area.enum';
import { ProvisioningService } from '../../../../purchase/services/order-project/provisioning-service.service';
import { ProvisioningDetails } from '../../../../models/purchase/provisioning-details.model';
import { StockDocumentsService } from '../../../../inventory/services/stock-documents/stock-documents.service';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { ComponentsConstant } from '../../../../constant/shared/components.constant';
import { TiersConstants } from '../../../../constant/purchase/tiers.constant';
import { ItemToGetEquivalentList } from '../../../../models/inventory/item-to-get-equivalent-list.model';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { LocalStorageService } from '../../../../login/Authentification/services/local-storage-service';
import { SearchItemToGenerateDoc } from '../../../../models/sales/search-item-to-generate-document';
import { TiersTypeEnumerator } from '../../../../models/enumerators/tiers-type.enum';
import { TiersService } from '../../../../purchase/services/tiers/tiers.service';
import { FilterSearchItem } from '../../../../models/inventory/filter-search-item-model';
import { MediaConstant } from '../../../../constant/utility/Media.constant';
import { ItemPrice } from '../../../../models/sales/item-price.model';
import { DocumentService } from '../../../../sales/services/document/document.service';
import { DocumentLine } from '../../../../models/sales/document-line.model';
import { UserWarehouseService } from '../../../../inventory/services/user-warehouse/user-warehouse.service';
import { WarehouseService } from '../../../../inventory/services/warehouse/warehouse.service';
import { Warehouse } from '../../../../models/inventory/warehouse.model';
import { TecdocService } from '../../../../inventory/services/tecdoc/tecdoc.service';

const CLAIMS_URL = 'main/helpdesk/claims/claimItem/';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
      .k-grid tr.red {
          color: #ef5958;
          font-weight: bold;
      }

      .k-grid tr.orange {
          color: #ffc107;
          font-weight: bold;
      }

      .k-grid tr.green {
          color: #4dbd74;
          font-weight: bold;
      }

      .k-grid tr.blue {
          color: #63c2de;
          font-weight: bold;
      }
  `],
})
export class ListProductsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isForGarage: boolean;
  @Input() hasDefaultWarehouse: boolean;
  @Output() itemSelectedForGarage: EventEmitter<any> = new EventEmitter<any>();
  @Input() isPurchase = false;
  // selected warehouse, if from warehouse interface
  public RoleConfigConstant = RoleConfigConstant;
  public selectedItemToOpen: any = [];
  public selectedRow;
  public btnEditVisible: boolean;
  public isEsnVersion: boolean;
  public groups: GroupDescriptor[];
  public predicate: PredicateFormat;
  public advancedSearchPredicate: PredicateFormat;
  public stockDocumentLine: FormGroup;
  public isCollapsed;
  public distinctCategories;
  public formGroup: FormGroup;
  private editedRowIndex: number;
  public selectedItem: number;
  public selectedElement: Item;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public swalNotif: SwalWarring;
  public showTab = false;
  public IdItemSelected: number;
  public FromApi: any;
  public openHistory: boolean;
  idWarehouse = null;
  filterArray: Array<Filter>;
  operator: Operator;
  JSON: JSON;
  public config = this.itemService.ExcelColumnsConfig;
  @Input() public gridSettings: GridSettings;
  public documentType: string;
  public modalOptions: Partial<IModalDialogOptions<any>>;
  @Input()
  public isModal = false;
  @Input()
  public isForWarehouseDetail = false;
  public isTecdocFiltered = true;
  @Output() messageEvent = new EventEmitter<boolean>();
  @Output() itemEvent = new EventEmitter<Item>();
  @Input() isForStockMvt= false;
  /**
   * Decorator to hold selectedEvent in the dataGrid
   */
  @Output() itemDetailsEvent = new EventEmitter<Item>();
  @Output() TecDocItemEvent = new EventEmitter<Item>();
  @ViewChild(GridComponent) grid: GridComponent;
  @ViewChild(ListTecDocComponent) listTecDocComponent;
  keyAction;
  @Output() cleanEquivalenceListe = new EventEmitter<boolean>();
  @Output() clearTecDocEquivalentListe = new EventEmitter<boolean>();
  @Output() showTecDocList = new EventEmitter<boolean>();
  @Output() affectEquivalentItemEvent = new EventEmitter<any>();
  @Input() sendToDocument: boolean;
  @Input() isFromAddDocumentLine: boolean;
  public warehouseForm: FormGroup;
  public tecdocAvailableQuanittyFilter = false;
  filtersItemDropdown: FiltersItemDropdown;
  availableQuanittyFilter = false;
  centralQuantityFilter = false;
  isSync = false;
  idDocument: number;
  QuantityForDocumentLine: number;
  @ViewChild('container', { read: ViewContainerRef })
  @Input() BrandModelSubModel: any;
  @ViewChild(DetailsProductComponent) detailsProductComponent;
  @Input() isFromStockDocument = false;
  @Input() advancedSearchPredicateFormat;
  public isInSalesRole = false;
  public TecDocGrid= false;
  // select first row by default
  public mySelection: any[] = [0];
  // Use an arrow function to capture the 'this' execution context of the class.
  public isTecdocCollapsed = true;
  dataDetailsOnOrderQuantity: GridDataResult;
  public selectedRowOfOnOrderQuantity;
  allDataDetailsOnOrderQuantity: any;
  public skipOnOrderQuantity = 0;
  public pageSizeOnOrderQuantity = 10;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  public statusCode = documentStatusCode;
  searchItemDocumentType: string;
  isToInitFocus = false;
  opentecdocdetails: boolean;
  public SelectedForDetails: Item;
  isAutoVersion: boolean;
  public FormatNumber = SharedConstant.NUMBER_FORMAT;
  isCentralWarehouseSelectedByDefault = true;
  searchInProductList = true;
  listStockDocumentLine: any[] = [];
  oldModalOptions: Partial<IModalDialogOptions<any>>;
  public api = ItemConstant.WAREHOUSE_FILTRE_API;
  public isVisibleSimpleFiltre = false;
  public isFromAdvancedSearch = false;
  @Input() isCardViewMode: boolean;
  @Input() selectedItemInParentComp: number;
  public selectedDefaultIndex = NumberConstant.ZERO;
  @Input() itemId;
  @Output() generateBL = new EventEmitter<boolean>();
  public wahreHouseName;
  public max = NumberConstant.MAX_QUANTITY;
  public showOtherSuppliers: boolean;
  public dropdownSettings: {};
  public counts = 0;
  totalcounts: number;
  numberDaysOutOfStock = 0;
  @Input() public haveWarehouse: boolean = false;
  public excelPredicate: PredicateFormat;
  public selectedWarehouseName: string;
  public selectedWarehouseId: number;
  public selectedNatureName: string;
  @Input() valueToFind: string;
  @Input() isFromFetchProduct: boolean;
  @Input() isSales: boolean;
  public isFromQuickSearch = false;
  public quickSearchPredicate: PredicateFormat;
  tecDocCounts: any;
  public hasAddBLPermission = false;
  public hasUpdateBLPermission = false;
  @Input() idSelectedCustomer: number;
  @Input() idSelectedVehicle: number;
  @Input() isFromSalesHistory = false;
  @Input() allowRelationSupplierItems: boolean;
  @Input() idTierType: number;
  @Input() NotPaidSubModal: boolean;
  @Input() filterFromTecDoc: boolean;
  @Output() onCloseNotPaidModal = new EventEmitter<any>();
  public gridSetting: GridSettings = {
    state: this.itemService.gridState,
    columnsConfig: this.itemService.columnsConfig
  };
  public isPosWarehouse = true;

  /**
   * permissions
   */
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowSalePricePermission: boolean;
  public hasShowPurchasePricePermission: boolean;
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasClaimListPermission: boolean;
  public userEmail : string;
  public isSelectedWarehouse : boolean;

  public isRowSelected = (e: RowArgs) => this.mySelection.indexOf(e.index) >= 0;
  public filterItemSearch = new FilterSearchItem();
  public centralWarehouse : Warehouse;


  /**
   * create new compoenent instance
   * @param itemService
   * @param router
   * @param swalWarrings
   * @param validationService
   * @param modalService
   * @param searchItemService
   * @param growlService
   * @param rolesService
   * @param fetchProductsComponent
   * @param translate
   * @param zone
   * @param formModalDialogService
   * @param viewRef
   * @param activatedroute
   * @param companyService
   * @param provisioningService
   * @param stockDocumentsService
   */
  constructor(public itemService: ItemService,
    private router: Router, private localStorageService: LocalStorageService,
    private swalWarrings: SwalWarring,
    private validationService: ValidationService,
    private modalService: ModalDialogInstanceService,
    public searchItemService: SearchItemService,
    public tiersService: TiersService,
    private growlService: GrowlService,
    private rolesService: StarkRolesService,
    public fetchProductsComponent: FetchProductsComponent,
    private translate: TranslateService,
    private zone: NgZone, protected formModalDialogService: FormModalDialogService,
    protected viewRef: ViewContainerRef,
    private activatedroute: ActivatedRoute, private companyService: CompanyService, private provisioningService: ProvisioningService,
      private stockDocumentsService: StockDocumentsService, private authService: AuthService, public tecdocService: TecdocService,
    private documentService: DocumentService, private translateService: TranslateService, protected serviceUserWarehouse : UserWarehouseService,
    protected warehouseService : WarehouseService) {
    this.isAutoVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Auto;
    this.isEsnVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Esn;
    this.userEmail = this.localStorageService.getEmail();
    this.keyAction = (event) => {
      const keyName = event.key;
      if (keyName === KeyboardConst.ESCAPE && !this.isFromStockDocument) {
        if (document.getElementsByClassName('modal-backdrop show').length > 0) {
          this.removeAllModal();
          this.closeModalAction();
        }
        if(this.modalOptions)
        this.modalOptions.onClose();
        this.modalService.closeAnyExistingModalDialog();
        if(this.NotPaidSubModal){
          this.onCloseNotPaidModal.emit();
        }
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);
    this.JSON = JSON;

    this.activatedroute.data.subscribe(data => {
      this.itemService.isPurchase = data.isPurchase;
      this.itemService.isForInventory = data.isForInventory;
      if (data.isPurchase) {
        this.searchItemService.isFromSearchItem_supplierInetrface = false;
      }
    });
    this.warehouseService.getCentralWarehouse().subscribe(warehouse => {
      this.centralWarehouse = warehouse;
    })
  }

  private removeAllModal() {
    const modal = document.getElementsByClassName('modal-backdrop show');
    if (modal.length > 0) {
      modal[0].className = '';
      this.removeAllModal();
    }
  }

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId) {
      this.showTab = true;
    }
  }

  /**
   * init component
   **/
  public ngOnInit(): void {
    this.TecDocGrid = false;
    this.itemService.hideTecDocGrid();
    if (!this.idTierType && this.searchItemService.typeSupplier) {
      this.idTierType = this.searchItemService.typeSupplier ;
    }
    if( this.fetchProductsComponent && this.fetchProductsComponent.selectedWarehouseFromItemDropDown && !this.selectedWarehouseId){
      this.selectedWarehouseId = this.fetchProductsComponent.selectedWarehouseFromItemDropDown;
    }
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ITEM_STOCK);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_ITEM_STOCK);
    this.hasShowSalePricePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_SALES_PRICE);
    this.hasShowPurchasePricePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_PURCHASE_PRICE);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ITEM_STOCK);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ITEM_STOCK);
    this.hasAddBLPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_DELIVERY_SALES);
    this.hasUpdateBLPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_DELIVERY_SALES);
    this.hasClaimListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_CLAIM_PURCHASE);
    if (this.gridSettings === undefined) {
      this.gridSettings = this.gridSetting;
    }
    this.modalOptions = this.fetchProductsComponent.options;
    //initialize filter 
    this.getInitFilterItemSearch();
    this.initListSuppliers();
    this.itemService.getJson('environments/TecDocConf.json').subscribe(data => {
      this.FromApi = data.IsUseTecDocApi;
    });
    if (this.hasDefaultWarehouse) {
      this.idWarehouse = this.modalOptions.data.idWarehouse;
    }
    this.oldModalOptions = this.modalOptions ? Object.assign(this.modalOptions) : undefined;
    this.CreateWarehouseFromGroup();
    if (this.isEsnVersion) {
      this.initGridDataSource();
    }
    this.btnEditVisible = true;
    this.isCollapsed = true;
    this.sendCollapseStauts();
    if (this.sendToDocument) {
      this.documentType = this.searchItemService.searchItemDocumentType;
    }
    if (!this.itemService.isPurchase && this.modalOptions) {
      this.itemService.isPurchase = this.isPurchase;
      if (this.modalOptions && this.modalOptions.data && this.modalOptions.data.selectedTiers) {
        this.createFormatPurchase(this.modalOptions.data.selectedTiers);
      }
    }
    this.itemService.formatSaleOptions = {
      style: 'currency',
      currency: this.localStorageService.getCurrencyCode(),
      currencyDisplay: 'symbol',
      minimumFractionDigits: this.localStorageService.getCurrencyPrecision()
    };
    this.config[8].condition = this.isAutoVersion;
    this.config[10].condition = this.isAutoVersion;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['isCardViewMode']) {
      this.selectFirstElementInGrid();
    }
    if (changes && changes['idSelectedCustomer'] && changes['idSelectedCustomer'].currentValue) {
      this.idSelectedCustomer = changes['idSelectedCustomer'].currentValue;
    }
    if (changes && changes['idSelectedVehicle'] && changes['idSelectedVehicle'].currentValue) {
      this.idSelectedVehicle = changes['idSelectedVehicle'].currentValue;
    }
    if (changes && changes['itemId'] && changes['itemId'].currentValue && this.advancedSearchPredicate && this.itemId) {
      this.filterItemSearch.IdItem = this.itemId;
      this.loadAdvancedSearchDataSource(this.filterItemSearch);
    }
  }

  public selectFirstElementInGrid() {
    this.mySelection = [NumberConstant.ZERO + this.gridSettings.state.skip];
    if (this.gridSettings.gridData && this.gridSettings.gridData.data.length > NumberConstant.ZERO) {
      this.itemEvent.emit(this.gridSettings.gridData.data[NumberConstant.ZERO]);
    }
  }
  public createFormatPurchase(idTier: number) {
    this.tiersService.getFormatOptionsForPurchase(idTier).subscribe(data => {
      this.itemService.formatPurchaseOptions = data;
    });
  }
  public CreateWarehouseFromGroup() {
    // used filter with warehouse if need it
    const idWarehouse = this.modalOptions !== undefined
      && (this.modalOptions.data.isWharehouseFilterRequired || this.hasDefaultWarehouse) ? this.modalOptions.data.idWarehouse : '';
    if (Number(idWarehouse) && idWarehouse > 0 && !this.hasDefaultWarehouse) {
      this.isCentralWarehouseSelectedByDefault = false;
    }
    this.warehouseForm = new FormGroup({
      IdWarehouse: new FormControl(idWarehouse)
    });
    this.warehouseForm.get(ItemConstant.ID_WAREHOUSE).valueChanges.subscribe((value) => {
      if (value) {
        this.searchItemService.setWarehouse(value);
      }
      if (this.warehouseForm.dirty ||
        (!this.isModal && !this.searchItemService.isFromSearchItem_supplierInetrface) || this.isFromAddDocumentLine ||
        (this.modalOptions && this.modalOptions.data && this.modalOptions.data.filtersItemDropdown &&
          this.modalOptions.data.filtersItemDropdown.isForSale && this.hasDefaultWarehouse)) {
        this.gridSettings.state.skip = 0;
        this.initGridDataSource(null, null, this.filtersItemDropdown);
      }

    });

  }

  tecDocCollapse(isCollapsed: boolean) {
    this.isCollapsed = isCollapsed;
    this.sendCollapseStauts();
  }

  closeModalAction() {
    this.IdItemSelected = 0;
    this.searchItemService.closeModalAction();
  }

  /**
   *
   * init data source
   * */
  initGridDataSource(filter?: Array<Filter>, operator?: Operator, filtersItemDropdown?: FiltersItemDropdown) {
    if (this.TecDocGrid && this.listTecDocComponent) {
      this.listTecDocComponent.initGridDataSource();
    } else {
      if (((this.searchItemService.isFromSearchItem_supplierInetrface && !this.searchItemService.idSupplier))
        && (!this.isFromAddDocumentLine && (this.modalOptions && !this.modalOptions.data.filtersItemDropdown.isForSale))) {
        this.growlService.warningNotification(this.translate.instant('SEARCH_FIELD_REQUIRED'));
      } else {
        if (filter || operator) {
          this.filterArray = filter;
          this.operator = operator;
          /*init Grid skip take */
          this.gridSettings.state.skip = 0;
        }
        this.preparePrediacte();

        this.filtersItemDropdown = new FiltersItemDropdown();
        if (filtersItemDropdown !== null && filtersItemDropdown !== undefined) {
          this.filtersItemDropdown = filtersItemDropdown;
        }
        if (this.modalOptions && this.modalOptions.data) {
          if (this.filtersItemDropdown.constaines === undefined) {
            this.filtersItemDropdown.constaines = this.modalOptions.data.filtersItemDropdown.constaines;
          }
          this.filtersItemDropdown.idTiers = this.modalOptions.data.filtersItemDropdown.idTiers;
          this.filtersItemDropdown.isForSale = this.modalOptions.data.filtersItemDropdown.isForSale;
          this.filtersItemDropdown.isForPurchase = this.modalOptions.data.filtersItemDropdown.isForPurchase;
          this.filtersItemDropdown.isForItemReplacement = this.modalOptions.data.isForItemReplacement;
          this.filtersItemDropdown.isWharehouseFilterRequired = this.modalOptions.data.isWharehouseFilterRequired;
          if (this.modalOptions.data.isOnlyStocKManaged) {
            if (!this.predicate.Filter) {
              this.predicate.Filter = new Array<Filter>();
              this.predicate.Filter.push(new Filter('IdNatureNavigation.IsStockManaged', Operation.eq, true));
            }
          }
        } else {
          this.filtersItemDropdown.isForPurchase = this.itemService.isPurchase;
        }
        if (!this.predicate.OrderBy) {
          this.predicate.OrderBy = new Array<OrderBy>();
        }
        this.predicate.OrderBy.push(new OrderBy(ItemConstant.CREATION_DATE, OrderByDirection.desc));

        if (this.isForWarehouseDetail && this.selectedItemToOpen.item) {
          this.filtersItemDropdown.idWarehouse = this.selectedItemToOpen.item.Id;
          if (this.predicate) {
            if (!this.predicate.SpecFilter) {
              this.predicate.SpecFilter = new Array<SpecFilter>();
            }
            const warehousePredicate = new PredicateFormat();
            warehousePredicate.Filter = new Array<Filter>();
            warehousePredicate.Filter.push(new Filter(ItemConstant.ID_WAREHOUSE, Operation.eq, this.selectedItemToOpen.item.Id));
            const specFiltre = new SpecFilter(ItemConstant.INVENTORY_MODULE, ItemConstant.ITEM_WAREHOUSE, ItemConstant.ITEM_ID,
              warehousePredicate, ItemConstant.ID_WAREHOUSE);
            this.predicate.SpecFilter.push(specFiltre);
            this.predicate.SpecificRelation = [ItemConstant.ITEM_TIERS_TIERS_NAVIGATION];
          }

        } else {
          this.filtersItemDropdown.idWarehouse = this.warehouseForm.controls[ItemConstant.ID_WAREHOUSE].value;
        }
        this.filtersItemDropdown.isAvailableInStock = this.availableQuanittyFilter;
        this.filtersItemDropdown.isCentralOnly = this.centralQuantityFilter;
        if (this.searchInProductList) {
          this.filtersItemDropdown.isWharehouseFilterRequired = true;
        }
        if (this.modalOptions && this.modalOptions.data && this.modalOptions.data.filtersItemDropdown) {
          this.filtersItemDropdown.isRestaurn = this.modalOptions.data.filtersItemDropdown.isRestaurn;
        }

        if (!this.isForWarehouseDetail) {
          this.predicate = this.advancedSearchPredicateFormat;
        }
        this.itemService.reloadServerSideDataWithListPredicate(this.gridSettings.state, [this.predicate],
          SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe((result) => {
            this.selectFirstInputElement();
            this.prepareList(result, true);
          });


        /* Close expanded rows when filtering */
        if (this.gridSettings.gridData && this.grid) {
          this.gridSettings.gridData.data.forEach((item, idx) => {
            this.grid.collapseRow(this.gridSettings.state.skip + idx);
          });
        }
      }
    }
  }

  selectFirstInputElement() {
    if (((this.isModal || this.sendToDocument) && (this.modalOptions) &&
      !(this.modalOptions.data.isForItemReplacement || this.modalOptions.data.isFroSerach)) ||
      (!this.isForWarehouseDetail && !this.isModal && !this.sendToDocument && this.searchItemService.isFromSearchItem_supplierInetrface)
    ) {
      this.zone.run(() => {
        var interval = setInterval(() => {
          // focus first qty input
          if (document.getElementsByName('QuantityForDocumentLine')[0] &&
            document.getElementsByName('QuantityForDocumentLine')[0].getElementsByClassName('k-input')[0] && !this.isToInitFocus) {
            this.focusQty();
            clearInterval(interval);
          }
        }, 1);
      });
    }
  }

  stepUp(item) {
    (!item.QuantityForDocumentLine) ? item.QuantityForDocumentLine = 1 : item.QuantityForDocumentLine++;
  }

  stepdown(item) {
    (!item.QuantityForDocumentLine && item.QuantityForDocumentLine === 0) ?
      item.QuantityForDocumentLine = 0 : item.QuantityForDocumentLine--;
  }




  filterCentralQuantity() {
    this.centralQuantityFilter = !this.centralQuantityFilter;
    this.gridSettings.state.skip = 0;
    this.initGridDataSource(null, null, this.filtersItemDropdown);
  }

  public sendCollapseStauts(): void {
    this.messageEvent.emit(this.isCollapsed);
    this.itemEvent.emit(this.selectedElement);
  }

  /**
   * data state change
   * @param state
   */
  public dataStateChange(state: any): void {
    if (state && state.sort && (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir))) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.filterItemSearch.pageSize = this.gridSettings.state.take;
    this.filterItemSearch.page = (this.gridSettings.state.skip /this.filterItemSearch.pageSize ) + 1;
    
    this.getOrderByFromFilterSearchItem(state);

  }

  paginate(event) {
    this.gridSettings.state.skip = event.skip;
    this.gridSettings.state.take = event.take;
    this.dataStateChange(this.gridSettings.state);
  }

  private loadItemsPicture(itemList: Item[]) {
    var itemsPicturesUrls = [];
    itemList.forEach((item: Item) => {
      itemsPicturesUrls.push(item.UrlPicture);
    });
    if (itemsPicturesUrls.length > NumberConstant.ZERO) {
      this.itemService.getPictures(itemsPicturesUrls, false).subscribe(itemsPictures => {
        this.fillItemsPictures(itemList, itemsPictures);
      });
    }
  }

  private fillItemsPictures(itemList, itemsPictures) {
    itemList.map((item: Item) => {
      if (item.UrlPicture) {
        let dataPicture = itemsPictures.objectData.find(value => value.FulPath === item.UrlPicture);
        if (dataPicture) {
          item.image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }

  prepareList(result, fromAdvancedSearchApi?) {
    // get first picture
    if (result) {
      const data = result.data || result.listData;
      this.loadItemsPicture(data);
      data.forEach(product => {
        product.image = MediaConstant.PLACEHOLDER_PICTURE;
      });
    }
    this.gridSettings.gridData = result;
    this.gridSettings.gridData.data = fromAdvancedSearchApi ? result.data : result.listData;
    this.gridSettings.gridData.total = result.total;
    this.gridSettings.gridData.data.forEach(element => {
      element.QuantityForDocumentLine = 1;
      element.isChecked =
        this.listStockDocumentLine.find((x) => x.IdItem === element.Id) ? true : false;
    });
    this.cleanEquivalenceListe.emit(true);
    this.clearTecDocEquivalentListe.emit(true);
    this.TecDocGrid =false;
    if (this.isToInitFocus) {
      this.focusQty();
    }
    this.changeSelectedDefaultIndex();
    // Select firstElement
    if (this.gridSettings.gridData.data && this.gridSettings.gridData.total > 0) {
      this.mySelection = [this.selectedDefaultIndex + this.gridSettings.state.skip];
      const event = {
        selectedRows: []
      };
      const row = {
        dataItem: this.gridSettings.gridData.data[this.selectedDefaultIndex],
        index: this.selectedDefaultIndex + this.gridSettings.state.skip
      };
      event.selectedRows.push(row);
      this.selectRow(event);
    } else {
      this.emptyselected();
    }
  }

  changeSelectedDefaultIndex() {
    if (this.itemId !== NumberConstant.ZERO) {
      this.selectedDefaultIndex = this.gridSettings.gridData.data.findIndex(item => item.Id === Number(this.itemId));
    }
  }

  onChangeQtyForDocLine(event) {
    if (document.getElementsByName('QuantityForDocumentLine')[0] &&
      document.getElementsByName('QuantityForDocumentLine')[0].getElementsByClassName('k-input')[0] && !this.isToInitFocus) {
      this.focusQty();
    }
  }

  private focusQty() {
    if (document.getElementsByName('QuantityForDocumentLine')[0]) {
      const QuantityForDocumentLine = document.getElementsByName('QuantityForDocumentLine')[0].getElementsByClassName('k-input')[0] as any;
      this.isToInitFocus = true;
      if (this.gridSettings.gridData && this.gridSettings.gridData.data.length > 0) {
        this.itemEvent.emit(this.gridSettings.gridData.data[0]);
        QuantityForDocumentLine.focus();
      }
    }
  }

  /**
   * quik add
   * @param param0
   */
  public addHandler({ sender }) {
    this.closeEditor(sender);

    this.formGroup = new FormGroup({
      Code: new FormControl('', Validators.required),
      Description: new FormControl('', Validators.required),
      IdNature: new FormControl(undefined, Validators.required)
    });

    sender.addRow(this.formGroup);
    this.btnEditVisible = false;
  }

  /**
   * quik edit
   * @param param0
   */
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.formGroup = new FormGroup({
      Id: new FormControl(dataItem.Id),
      Code: new FormControl(dataItem.Code, Validators.required),
      Description: new FormControl(dataItem.Description, Validators.required),
      IdNature: new FormControl(dataItem.IdNature, Validators.required)
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
    this.btnEditVisible = false;
  }

  /**
   * cancel
   * @param param0
   */
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
  }

  /**
   * save
   * @param param0
   */
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    if ((formGroup as FormGroup).valid) {
      const item: Item = formGroup.value;
      this.itemService.save(item, isNew, this.predicate).subscribe(() => {
        this.initGridDataSource();
      });
      sender.closeRow(rowIndex);
      this.btnEditVisible = true;
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
   * remove
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateDeleteSwal(ItemConstant.ITEM, SharedConstant.CET).then((result) => {
      if (result.value) {
        this.itemService.remove(dataItem).subscribe(() => {
          this.dataStateChange(this.gridSettings.state);
        });
      }
    });

  }

  /**
   * close editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.btnEditVisible = true;
  }

  public ToshowTecDocGrid(value) {
    this.TecDocGrid = value;
    this.itemService.TecDoc = value;
    this.showTecDocList.emit(value);
    this.cleanEquivalenceListe.emit(true);
    this.clearTecDocEquivalentListe.emit(true);
    this.initialiseItemsTab(value);
  }


  /**
   * init predicate filter
   * */
  private preparePrediacte(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    if (this.filterArray && this.filterArray.length > 0) {
      this.predicate.Filter = new Array<Filter>();
      this.predicate.OrderBy = new Array<OrderBy>();
      this.filterArray.forEach(p => this.predicate.Filter.push(p));
      this.filterArray.forEach(p => this.predicate.OrderBy.push(new OrderBy(p.prop + '.Length', OrderByDirection.asc)));
    }
    if (this.operator !== undefined) {
      this.predicate.Operator = this.operator;
    }
    this.predicate.Relation.push.apply(this.predicate.Relation, [
      new Relation(ItemConstant.NATURE_NAVIGATION),
      new Relation(ItemConstant.ITEM_BRAND_PRODUCT),
      new Relation(ItemConstant.ITEM_WAREHOUSE),
      new Relation(ItemConstant.UNIT_STOCK_NAVIGATION),
      new Relation(ItemConstant.UNIT_SALES_NAVIGATION)
    ]);
    // add group by
    if (this.gridSettings.state.group) {
      this.predicate.OrderBy = [];
      const predicate = this.predicate;
      this.gridSettings.state.group.forEach(function (group) {
        predicate.OrderBy.push(new OrderBy(group.field, group.dir === 'desc' ? OrderByDirection.desc : OrderByDirection.asc));
      });
    }
  }

  /**
   * advanced edit
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    if (this.itemService.isPurchase) {
      this.router.navigateByUrl(ItemConstant.URI_ADVANCED_EDIT_PURCHASE + dataItem.Id, { queryParams: dataItem, skipLocationChange: true });
    } else {
      this.router.navigateByUrl(ItemConstant.URI_ADVANCED_EDIT + dataItem.Id, { queryParams: dataItem, skipLocationChange: true });
    }
  }
  public showOnlyIfStockManagedDetails(dataItem: any): boolean {
    return dataItem.IsStockManaged === true;
  }
  /** show quantity details*/
  quantityDetails($event) {
    this.selectedRow = $event;
  }

  /**
   * load item wrhouse related to the item
   * @param event
   */
  public loadWarehousDetails(event: any) {
    this.itemService.loadWarhouseDetails(event, true);
  }
  /**
   * @param event
   */
  public selectRow(event: any) {
    if (this.hasShowPermission || this.hasUpdatePermission) {
      if (event && event.selectedRows[0] && event.selectedRows[0].dataItem) {
        this.itemDetailsEvent.emit(event.selectedRows[0].dataItem);
        this.mySelection = [event.selectedRows[0].index];
        this.selectedElement = event.selectedRows[0].dataItem;
        if (this.isCollapsed && event.selectedRows[0] && event.selectedRows[0].dataItem) {
          this.itemEvent.emit(event.selectedRows[0].dataItem);
          const guidItem = new ItemToGetEquivalentList();
          guidItem.Id = this.selectedElement.Id;
          guidItem.EquivalenceItem = this.selectedElement.EquivalenceItem;
          guidItem.IdSelectedWarehouse = this.itemService.idSelectedWarehouse;
          this.itemService.getNumberOfItemEquiKit(guidItem).subscribe(data => {
            this.counts = data;
            this.totalcounts = data.reduce((sum, current) => sum + current);
          });
        }
        if (this.isModal && this.modalOptions) {
          this.selectedItem = event.selectedRows[0].dataItem.Id;
        }

      }
    }
  }
  countTecDoc(event) {
    this.tecDocCounts = event;
  }
  emptyselected() {
    this.itemDetailsEvent.emit(undefined);
    this.mySelection = [];
    this.selectedElement = undefined;
    this.selectedItem = undefined;
    this.itemEvent.emit(undefined);

  }

  public onItemClickFromCard(dataItem) {
    if (dataItem) {
      this.itemEvent.emit(dataItem);
    }
  }

  public selectRowTecDoc(event: any) {
    if (this.isCollapsed && event.selectedRows[0] && event.selectedRows[0].dataItem.IsInDb) {
      this.TecDocItemEvent.emit(event.selectedRows[0].dataItem.ItemInDB);
      this.itemEvent.emit(event.selectedRows[0].dataItem.ItemInDB);
      this.itemDetailsEvent.emit(event.selectedRows[0].dataItem.ItemInDB);
    }
    if (this.isCollapsed && event.selectedRows[0] && !event.selectedRows[0].dataItem.IsInDb) {
      this.TecDocItemEvent.emit(event.selectedRows[0].dataItem);
    }
    if (this.isModal && this.modalOptions) {
      if (event.selectedRows[0].dataItem.ItemInDB) {
        this.selectedItem = event.selectedRows[0].dataItem.ItemInDB.Id;
      }
    }
  }

  public filter(filter?: Array<Filter>, operator?: Operator, filtersItemDropdown?: FiltersItemDropdown) {
    this.getPredicateFromAdvancedSearch();
  }

  getItemId(dataItem) {
    if (dataItem) {
      if(this.isModal && this.modalOptions && this.modalOptions.data && this.modalOptions.data.isForAdvanceProduct && this.modalOptions.data.idItemToIgnore ){
        var dataToSend = {
          'IdItem': this.modalOptions.data.idItemToIgnore,
          'IdSelectedItem': dataItem.Id
        }
        this.affectEquivalentItemEvent.emit(dataToSend);
      }else{
      // if is from improuvement
      if (this.modalOptions.data.idStockDocument > 0) {
        const stockDocumentLine = new FormGroup({
          'Id': new FormControl(0),
          'IdItem': new FormControl(dataItem.Id),
          'IdLine': new FormControl(this.modalOptions.data.counter),
          'ActualQuantity': new FormControl(dataItem.QuantityForDocumentLine, [Validators.min(0),
          Validators.max(NumberConstant.MAX_QUANTITY),
          Validators.pattern('[-+]?[0-9]*\.?[0-9]*')]),
          'LabelItem': new FormControl(dataItem.Code),
          'Designation': new FormControl(dataItem.Description),
          'IsDeleted': new FormControl(false),
          'IdStockDocument': new FormControl(this.modalOptions.data.idStockDocument),
          'AvailableQuantity': new FormControl(dataItem.AllAvailableQuantity)
        });

        this.stockDocumentsService.saveStockDocumentLineInRealTime(stockDocumentLine.getRawValue()).subscribe(res => {
          this.modalOptions.data = this.oldModalOptions.data;
          this.modalOptions.data.stockDocumentLineSaved = true;
        });
        if (dataItem.dataItem && dataItem.dataItem.IsItemTecdoc) {
          this.modalOptions.data = {
            Id: dataItem.dataItem.ItemInDB.Id,
            Quantity: dataItem.dataItem.QuantityForDocumentLine,
            IsItemTecdoc: dataItem.dataItem.IsItemTecdoc,
          };
        }
      } else 
      {
        if (dataItem && dataItem.dataItem && dataItem.dataItem.IsItemTecdoc) 
        {
          if (this.documentType == this.documentEnumerator.PurchaseOrder || this.documentType == this.documentEnumerator.PurchaseFinalOrder ||
            this.documentType == this.documentEnumerator.PurchaseDelivery || this.documentType == this.documentEnumerator.PurchaseInvoices ||
            this.documentType == this.documentEnumerator.PurchaseAsset || this.documentType == this.documentEnumerator.PurchasesQuotations) 
            {
              const searchItemToGenerateDoc: SearchItemToGenerateDoc =
                  new SearchItemToGenerateDoc(dataItem.dataItem.ItemInDB.Id,
                  this.searchItemService.idDocument, dataItem.dataItem.QuantityForDocumentLine, this.searchItemService.idSupplier, this.idWarehouse, this.documentType);
              this.searchItemService.hideDocumentDetail = false;
              if (dataItem.dataItem && dataItem.dataItem.ItemInDB && dataItem.dataItem.ItemInDB.IdsTiers && 
                !dataItem.dataItem.ItemInDB.IdsTiers.includes(this.searchItemService.idSupplier)) 
                {
                  this.swalWarrings.CreateSwal(this.translateService.instant('NO_RELATION_BETWEEN_SUPPLIER_AND_ITEM')
                    , null, this.translateService.instant('CREATE_RELATION')).then((result) => 
                    {
                      if (result.value) 
                      {
                        this.searchItemService.insertDocLineOperations(searchItemToGenerateDoc);
                      }
                   });
                }
                else 
                {
                  this.searchItemService.insertDocLineOperations(searchItemToGenerateDoc);
                }
           }
            else if ((this.documentType == this.documentEnumerator.BE || this.documentType == this.documentEnumerator.BS) && this.modalOptions && this.modalOptions.data &&
                    this.modalOptions.data.tierType == TiersTypeEnumerator.Supplier) 
                    {
                      const searchItemToGenerateDoc: SearchItemToGenerateDoc =
                      new SearchItemToGenerateDoc(dataItem.dataItem.ItemInDB.Id,
                        this.searchItemService.idDocument, dataItem.dataItem.QuantityForDocumentLine, this.searchItemService.idSupplier, this.idWarehouse, this.documentType);
                       this.searchItemService.hideDocumentDetail = false;
                      if (dataItem.dataItem && dataItem.dataItem.ItemInDB && dataItem.dataItem.ItemInDB.IdsTiers &&
                          !dataItem.dataItem.ItemInDB.IdsTiers.includes(this.searchItemService.idSupplier)) 
                          {
                            this.swalWarrings.CreateSwal(this.translateService.instant('NO_RELATION_BETWEEN_SUPPLIER_AND_ITEM')
                              , null, this.translateService.instant('CREATE_RELATION')).then((result) => 
                              {
                                if (result.value) 
                                {
                                  this.searchItemService.insertDocLineOperations(searchItemToGenerateDoc);
                                }
                              });
                          }
                          else 
                          {
                            this.searchItemService.insertDocLineOperations(searchItemToGenerateDoc);
                          }
                    }
                    else 
                    {
                      const searchItemToGenerateDoc: SearchItemToGenerateDoc =
                      new SearchItemToGenerateDoc(dataItem.dataItem.ItemInDB.Id,
                          this.searchItemService.idDocument, dataItem.dataItem.QuantityForDocumentLine, this.searchItemService.idSupplier, this.idWarehouse, this.documentType);
                      this.searchItemService.hideDocumentDetail = false;
                      this.searchItemService.insertDocLineOperations(searchItemToGenerateDoc);
                   }
        }
        else 
        {
          this.modalOptions.data = {
            Id: dataItem.Id,
            Quantity: dataItem.QuantityForDocumentLine,
            Code: dataItem.Code ? dataItem.Code : "",
            Description: dataItem.Description ? dataItem.Description : ""
          };
          this.modalService.closeAnyExistingModalDialog();
          this.modalOptions.onClose();
        }
      }
    }
  }
  }

  /** show quantity details*/
  goToClaims($event) {
    this.selectedRow = $event;
    this.router.navigateByUrl(CLAIMS_URL + this.selectedRow.Id, {
      queryParams:
      {
        id: this.selectedRow.Id,
        dataitem: this.selectedRow
      }
    });
  }

  isSelectedSupplier(event, documentType, QuantityForDocumentLine) {
    if (this.searchItemService.idSupplier) {
      this.addDocument(event, documentType, QuantityForDocumentLine);
      if (documentType === DocumentEnumerator.SalesDelivery) {
        this.generateBL.emit(true);
      }
    }
  }

  addDocument(event, documentType, QuantityForDocumentLine) {
    if (this.searchItemService.idProvision && !this.searchItemService.idDocument) {
      const provisioningDetails = new ProvisioningDetails();
      provisioningDetails.IdItem = event;
      provisioningDetails.IdProvisioning = this.searchItemService.idProvision;
      provisioningDetails.MvtQty = QuantityForDocumentLine;
      this.provisioningService.addItemFromModal(provisioningDetails).subscribe();
    } else {
      this.documentType = documentType;
      this.searchItemService.searchItemDocumentType = documentType;
      this.QuantityForDocumentLine = QuantityForDocumentLine;
      this.IdItemSelected = event;
      let warehouse = this.isSelectedWarehouse ? this.selectedWarehouseId : this.centralWarehouse.Id;

      if (this.fetchProductsComponent && this.fetchProductsComponent.isPurchase && !this.allowRelationSupplierItems && this.searchItemService && this.searchItemService.searchItemDocumentType
        && this.searchItemService.searchItemDocumentType != this.documentEnumerator.BE && this.searchItemService.searchItemDocumentType != this.documentEnumerator.BS) {
        this.documentService.isAnyRelationSupplierWithItem(this.searchItemService.idSupplier,this.IdItemSelected).subscribe(x => {
          if (x.objectData === false) {
            this.swalWarrings.CreateSwal(this.translateService.instant('NO_RELATION_BETWEEN_SUPPLIER_AND_ITEM')
              , null, this.translateService.instant('CREATE_RELATION')).then((result) => {
                if (result.value) {
                  this.searchItemService.addDocument(this.IdItemSelected, QuantityForDocumentLine, warehouse);
                }
              });
          } else {
            this.searchItemService.addDocument(this.IdItemSelected, QuantityForDocumentLine, warehouse);
          }
        });
      }else {
        this.searchItemService.addDocument(this.IdItemSelected, QuantityForDocumentLine, warehouse);
      }

    }
  }

  addItemToIntervention(idItem, unitHtsalePrice, quantityForDocumentLine, description, code) {
    const itemForGarage = {};
    itemForGarage['IdItem'] = idItem;
    itemForGarage['UnitHtsalePrice'] = unitHtsalePrice;
    itemForGarage['Quantity'] = quantityForDocumentLine;
    itemForGarage['Description'] = description;
    itemForGarage['Code'] = code;
    this.itemSelectedForGarage.emit(itemForGarage);
  }

  ngOnDestroy(): void {
    this.removeAllModal();
    this.searchItemService.isModal = false;
    this.searchItemService.disableFields = true;
    this.searchItemService.isFromSearchItem_supplierInetrface = false;
    document.removeEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);
    this.itemService.advancedSearchPredicateChange.observers.forEach(value => value.complete());
  }

  public rowCallbackProductList(context: RowClassArgs) {
    if (context.dataItem.AllAvailableQuantity > 0) {
      return { available: context.dataItem.AllAvailableQuantity > 0 };
    } else {
      return {};
    }
  }

  public clearTecDocEquivalents($event) {
    this.itemService.showTecDocGrid();
    this.clearTecDocEquivalentListe.emit(true);
  }

  public getShowModalCondition(): boolean {
    return this.IdItemSelected > 0 && (!this.searchItemService.idDocument || this.searchItemService.idDocument === 0);
  }

  public filterTecdocByAvailbleQuantity() {
    this.listTecDocComponent.availableQuanittyFilter = this.tecdocAvailableQuanittyFilter;
    this.listTecDocComponent.filterByAvailbleQuantity();
  }

  public sendtecdocCollapseStatus() {
    this.listTecDocComponent.isCollapsed = this.isTecdocCollapsed;
    this.listTecDocComponent.sendCollapseStauts();
  }

  public FilterHandle() {
    this.listTecDocComponent.isFiltered = this.isTecdocFiltered;
    this.listTecDocComponent.FilterHandle();
  }

  setItemWarehouse($event) {
    this.itemService.idSelectedWarehouse = $event.IdWarehouse.value;
    if ($event && $event.combobox && $event.combobox.dataItem) {
      this.wahreHouseName = $event.combobox.dataItem.WarehouseName;
      this.config[5].condition = true;
      this.config[4].condition = false;
      this.config[5].title = this.translate.instant('CURRENT_WAREHOUSE') + '(' + this.wahreHouseName + ')';
    } else if (this.itemService.idSelectedWarehouse) {
      this.wahreHouseName = 'Central';
      this.config[5].condition = true;
      this.config[4].condition = false;
      this.config[5].title = this.translate.instant('CURRENT_WAREHOUSE') + '(' + this.wahreHouseName + ')';
    } else {
      this.wahreHouseName = undefined;
      this.config[5].condition = false;
      this.config[4].condition = true;

    }
  }

  openTecdocModal(dataItem) {
    this.opentecdocdetails = true;
    this.SelectedForDetails = dataItem;
  }

  closeTecdocModal() {
    this.opentecdocdetails = false;
  }

  /** duplicte item from edited item */
  colneItem(id) {
    if (this.itemService.isPurchase) {
      window.open(ItemConstant.DUPLICATE_ITEM_URL_PURCHASE.concat(id));
    } else {
      window.open(ItemConstant.DUPLICATE_ITEM_URL.concat(id));
    }
  }



  getPredicateFromAdvancedSearch() {
    this.isFromAdvancedSearch = true;
    this.isFromQuickSearch = false;
    let filterSearchItem = new FilterSearchItem();
    if (this.fetchProductsComponent) {
      filterSearchItem = this.fetchProductsComponent.mergefilters();
    }
    this.loadAdvancedSearchDataSource(filterSearchItem);
  }

  getOrderByFromFilterSearchItem(state?: any) {
    this.isFromAdvancedSearch = true;
    this.isFromQuickSearch = false;
    let filterSearchItem = new FilterSearchItem();
    if (this.fetchProductsComponent) {
      filterSearchItem = this.fetchProductsComponent.mergefilters(this.isFromSalesHistory);
    }
    if (state && state.sort && state.sort.length > 0) {
      const dir = state.sort[NumberConstant.ZERO].dir;
      const field = state.sort[NumberConstant.ZERO].field;
      filterSearchItem.OrderBy = new Array<OrderBy>();
      filterSearchItem.OrderBy.push(new OrderBy(field, dir));
    }
    this.loadAdvancedSearchDataSource(filterSearchItem);

  }
  getInitFilterItemSearch() {
    this.isFromAdvancedSearch = false;
    this.isFromQuickSearch = false;
    let filterSearchItem = new FilterSearchItem();
    if (this.fetchProductsComponent) {
      filterSearchItem = this.fetchProductsComponent.mergefilters(this.isFromSalesHistory);
      if (this.idSelectedCustomer || (!this.isPurchase && this.modalOptions && this.modalOptions.data && this.modalOptions.data.selectedTiers)) {
        filterSearchItem.IdCustomer = this.idSelectedCustomer ? this.idSelectedCustomer : this.modalOptions.data.selectedTiers ;
      } else {
        filterSearchItem.IdCustomer = undefined;
      }
      if (this.idSelectedVehicle) {
        filterSearchItem.IdVehicle = this.idSelectedVehicle;
      } else {
        filterSearchItem.IdVehicle = undefined;
      }
    }
    this.filterItemSearch.page = NumberConstant.ONE;
    this.filterItemSearch.pageSize = NumberConstant.TEN;
    this.filterItemSearch.OrderBy = new Array<OrderBy>();
    this.filterItemSearch.OrderBy.push(new OrderBy(ItemConstant.ID, OrderByDirection.desc));
    this.loadAdvancedSearchDataSource(filterSearchItem);
  }

  loadAdvancedSearchDataSource(filterItemSearch: any) {
    this.loadSearchDataSource(filterItemSearch);
  }

  loadSearchDataSource(filterItemSearch: FilterSearchItem) {
    this.isSelectedWarehouse = filterItemSearch.IdWarehouse ? true : false
    if(!this.isFromQuickSearch){
      filterItemSearch.page = this.filterItemSearch.page;
    }
    if (!filterItemSearch.page){
      filterItemSearch.page = NumberConstant.ONE;
    }
    filterItemSearch.pageSize = this.filterItemSearch.pageSize;
    if (this.selectedNatureName && this.selectedNatureName.length > 0) {
      this.config[11].condition = false;
      this.config[0].title = this.translate.instant("REFERENCE") + "(" + this.selectedNatureName + ")";
    } else {
      this.config[11].condition = true;
    }
    if (this.selectedWarehouseName && this.selectedWarehouseName.length > 0) {
      this.config[4].condition = true;
      this.config[4].title = this.translate.instant("CURRENT_WAREHOUSE") + "(" + this.selectedWarehouseName + ")";
    } else {
      this.config[4].condition = false;
    }
    if (this.selectedItemToOpen.item) {
      filterItemSearch.IdWarehouse = this.selectedItemToOpen.item;
      this.searchItemService.idWarehouse = this.selectedItemToOpen.item;
    } else if (this.selectedWarehouseId) {
      filterItemSearch.IdWarehouse = this.selectedWarehouseId;
      this.searchItemService.idWarehouse = this.selectedWarehouseId;
    }
    if (this.isForGarage) {
      filterItemSearch.IsStockManaged = true;
    }

      filterItemSearch.isFromSalesHistory = this.isFromSalesHistory;
    
    this.itemService.getItemDataWithSpecificFilter(filterItemSearch).subscribe((result) => {
      this.selectFirstInputElement();
      if(this.fetchProductsComponent && this.fetchProductsComponent.itemAdvancedSearchComponent && filterItemSearch){
        this.fetchProductsComponent.itemAdvancedSearchComponent.filterSearchItem = filterItemSearch;
      }
      this.prepareList(result, false);
    });
  }
  /**
   * Load data source from quick search
   * @param predicateFormat
   */
  loadQuickSearchDataSource(predicateFormat?: any) {
    this.isFromQuickSearch = true;
    this.isFromAdvancedSearch = false;
    predicateFormat.isFromSalesHistory = this.isFromSalesHistory;
    if(!this.isFromSalesHistory && predicateFormat){
      predicateFormat.IdCustomer = undefined;
    }
    this.loadSearchDataSource(predicateFormat);
  }


  public getStyle(dataItem: Item): any {
    if (dataItem) {
      const isAvailable = dataItem.AllAvailableQuantity > 0;
      return {
        'color': isAvailable ? ItemConstant.ITEMS_STOCK_COLOR : ItemConstant.ITEMS_NOT_STOCK_FONT_WEIGHT,
        'font-weight': isAvailable ? ItemConstant.ITEMS_STOCK_FONT_WEIGHT : SharedConstant.EMPTY
      };
    }
  }


  public initListSuppliers() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: ComponentsConstant.ID,
      textField: TiersConstants.NAME,
      unSelectAllText: '',
      itemsShowLimit: NumberConstant.THREE,
      allowSearchFilter: false,
      enableCheckAll: false
    };
  }

  getRestOfSuppliers(listTiers: any[]) {
    if (listTiers) {
      return listTiers.slice(2);
    }
  }
  public generateBLTecDoc() {
    this.generateBL.emit(true);
  }

  clickTab(label) {
    if (label === 'GeneralItems') {
     this.TecDocGrid = false;
    //save predicate from advanced search 
     this.getInitFilterItemSearch();
  }else {
    this.TecDocGrid = true;
    //save predicate tecdoc from advanced search 
    this.tecdocService.tecdocSearchModeChange.next( this.tecdocService.searchTecDocLabel);
  }
}
/**
 * if search with tecDoc , the tab items tecdoc is active 
 * @param isTecDocTab 
 */
initialiseItemsTab(isTecDocTab:boolean){
  this.TecDocGrid = isTecDocTab;
  var navTabItems = document.getElementById('tabListCounterItems') != null ? document.getElementById('tabListCounterItems').getElementsByTagName('a')[0]: null;
  var navTabTecDocItems = document.getElementById('tabListCounterItems') != null ?document.getElementById('tabListCounterItems').getElementsByTagName('a')[1]: null;
  var navItems = document.getElementById('GeneralItems');
  var navItemsTecDoc = document.getElementById('GeneralItemsTecDoc');
  if (navItemsTecDoc && navItems) {
    if(isTecDocTab){
      navItemsTecDoc.className = "nav-style tab-pane section-style active pt-0 show";
      navItems.className ="nav-style tab-pane";
      navTabItems.className ="nav-link pb-0 pt-1";
      navTabTecDocItems.className ="nav-link  pb-0 pt-1 active";
    }else {
      navItems.className = "nav-style tab-pane section-style active pt-0 show";
      navItemsTecDoc.className ="nav-style tab-pane";
      navTabTecDocItems.className ="nav-link pb-0 pt-1";
      navTabItems.className ="nav-link  pb-0 pt-1 active";
    }

  }
  
}
}
