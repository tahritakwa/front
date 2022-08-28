import { Filter, Operation, SpecFilter, PredicateFormat, OrderByDirection, OrderBy, Relation } from './../../../shared/utils/predicate';
import { QuickSearchItemComponent } from './../quick-search-item/quick-search-item.component';
import { AfterViewInit, Component, ComponentRef, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { TecDocArticleModel } from '../../../models/inventory/tec-doc-article.model';
import { AdvancedListProductsComponent } from '../advanced-list-products/advanced-list-products.component';
import { Item } from '../../../models/inventory/item.model';
import { TecDocAdvancedListProductComponent } from '../tec-doc-advanced-list-product/tec-doc-advanced-list-product.component';
import { ItemService } from '../../services/item/item.service';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { ReplacementListProductComponent } from '../replacement-list-product/replacement-list-product.component';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { ListProductsComponent } from '../../../shared/components/item/list-item/list-products.component';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { ItemWarehouse } from '../../../models/inventory/item-warehouse.model';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { StyleConstant } from '../../../constant/utility/style.constant';
import { AssociatedWarehouseGridComponent } from '../../associated-warehouse-grid/associated-warehouse-grid.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { scrollToInvalidField } from '../../../shared/helpers/scrolling.helper';
import { ItemDropdownComponent } from '../../../shared/components/item-dropdown/item-dropdown.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ItemAdvancedSearchComponent } from '../../../shared/components/item-advanced-search/item-advanced-search.component';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { isNotNullOrEmptyString } from '@progress/kendo-data-query/dist/npm/utils';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SearchItemSupplier, searchTypes } from '../../../models/sales/search-item-supplier.model';
import { FilterSearchItem } from '../../../models/inventory/filter-search-item-model';
import { FormGroup } from '@angular/forms';

const LIST_REPLACEMENT_COMP_ID = 'replacementListProductComponent';
const LIST_KIT_COMP_ID = 'kitListProductComponent';

const Items_Tab_Id = 'items-tab-equv';
const Fiches_Tab_Id = 'fiche-tab-equv';
const Depot_Tab_Id = 'tab-associated-depot-equv';

const Items_Tab_Href = 'items-equv';
const Fiches_Tab_Href = 'fiches-equv';
const Depot_Tab_Href = 'associated-depot-equv';

const IS_CLOSED = 'isColsed';
const ITEM_ID = 'itemId';
@Component({
  selector: 'app-fetch-products',
  templateUrl: './fetch-products.component.html',
  styleUrls: ['./fetch-products.component.scss']
})
export class FetchProductsComponent implements IModalDialog, OnInit, AfterViewInit {
  @Input() options: Partial<IModalDialogOptions<any>>;
  @Input() isModal: boolean;
  @Input() sendToDocument: boolean;
  @Input() isFromAddDocumentLine: boolean;
  @Input() isPurchase = false;
  @Input() isForWarehouseDetail = false;
  @Input() idSelectedWarehouse;
  @Input() hasDefaultWarehouse: boolean;
  @Input() isForGarage: boolean;
  @Input() idWarehouse: number;
  @Input() isSales = false;
  @Input() ignoreCharges: boolean = null;
  @Input() valueToFind: string;
  @Input() isFromFetchProduct: boolean=true;
  @Output() itemSelectedForGarage: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(AdvancedListProductsComponent) equivalentList: AdvancedListProductsComponent;
  @ViewChild(ReplacementListProductComponent) repKit: ReplacementListProductComponent;
  @ViewChild(LIST_REPLACEMENT_COMP_ID) replacementListProductComponent: ReplacementListProductComponent;
  @ViewChild(LIST_KIT_COMP_ID) kitListProductComponent: ReplacementListProductComponent;
  @ViewChild(TecDocAdvancedListProductComponent) TecDocAdvancedList: TecDocAdvancedListProductComponent;
  @ViewChild('listproduct') listProductsComponent: ListProductsComponent;
  @ViewChild('saleshistory') listSalesHistory: ListProductsComponent;
  @ViewChild(AssociatedWarehouseGridComponent) associatedWarehouse: AssociatedWarehouseGridComponent;
  @ViewChild(ItemDropdownComponent) itemDropDown: ItemDropdownComponent;
  @ViewChild(ItemAdvancedSearchComponent) itemAdvancedSearchComponent: ItemAdvancedSearchComponent;
  @ViewChild('quickSearch') quickSearchItemComponent: QuickSearchItemComponent;
  @ViewChild('searchItemHistory') quickSearchItemHistory: QuickSearchItemComponent;
  @ViewChild('itemList') itemsTab: ElementRef;
  public associatedWarehouseGridData = SharedConstant.DEFAULT_GRID_DATA;
  public filterFromTecDoc = false;
  /**
   * To hold Item Id for equivalent products & kitt
   */
  public selectedItemFromList: Item;
  /**
   * To hold Item with Item warehouse for associated warehouse
   */
  public selectedItemEvent: any;
  openedFromGarageAddCar: boolean;
  BrandModelSubModel: any;
  public isFromStockDocument = false;
  public gridClass = StyleConstant.COL_LG_9;
  public advancedSearchClass = StyleConstant.COL_LG_3_PR_LG_0;
  public isVisibleAdvancedSearchComponent = true;
  public isOpenedAdvancedSearch = true;
  public predicateFormat: PredicateFormat;
  public firstCollapseIsOpened;
  public secondCollapseIsOpened;
  public thirdCollapseIsOpened;
  public fourthCollapseIsOpened;
  public readonly navItemClass = '.navItems';
  public assoicatedWarehouseGridHeight = '623px';
  public isCardViewMode = false;
  public isVisibleAssociatedDepot = false;
  public isVisibleEquivProductKits = false;
  public isVisibleFiche = false;
  public itemId: number;
  isCollapsed: boolean;
  isTecDocEquivalentListChanged: boolean;
  item: Item;
  tecdocItem: TecDocArticleModel;
  isEquivalentListChanged: boolean;
  public replacementGridData: GridDataResult;
  @Output() isBLGenerated = new EventEmitter<boolean>();
  public gridSettings: GridSettings;
  public gridSettingsHistory: GridSettings;
  searchObject;
  description: string;
  public idTierType: number;
  public isForStockMvt = false;
  /**
  * quick search predicate
  */
  public predicateQuickSearch: PredicateFormat;
  /**


  /**
   * equ comp child components Tabs Ids
   */
  public itemsTabId = Items_Tab_Id;
  public fichesTabId = Fiches_Tab_Id;
  public depotTabId = Depot_Tab_Id;

  /**
   * equ comp child components Tabs herf
   */
  public itemsTabHref = Items_Tab_Href;
  public fichesTabHref = Fiches_Tab_Href;
  public depotTabHref = Depot_Tab_Href;
  id: number;
  public predicate: PredicateFormat;
  public listTiers;
  public selectedWarehouseFromItemDropDown;
  public filterItemSearch = new FilterSearchItem();

  /**
   * permissions
   */
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;
  public hasUpdatePermission : boolean;
  public idSelectedCustomer;
  public idSelectedVehicle;
  @Output() closeNotPaidModal: EventEmitter<any> = new EventEmitter<any>();
  @Input() isQuickSales = false ;
  @Input() allowRelationSupplierItems: boolean;
  @Input() NotPaidSubModal: boolean;
  /**
   *
   * @param itemService
   * @param permsService
   * @param rolesService
   * @param searchItemService
   * @param injector
   * @param router
   * @param activatedRoute
   */

  constructor(public itemService: ItemService, public permsService: StarkPermissionsService, public rolesService: StarkRolesService,
    public searchItemService: SearchItemService, private injector: Injector,
    private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = params[ITEM_ID] || NumberConstant.ZERO;
    });
  }

  ngAfterViewInit() {
    this.itemId = this.id;
    if (this.id && this.id > 0 && ((!this.item) || (this.item.Id != this.id))) {
      this.itemService.getReducedItemData(this.id).subscribe((result) => {
        this.item = result;
        if (this.router.url.includes(ItemConstant.URL_SHOW_ITEM_FROM_LIST_PRODUCT)) {
          this.showFiche();
        }
      });
    }
  }

  receiveCollapseStatus($event) {
    this.isCollapsed = $event;
  }
  onCloseNotPaidModal(){
    this.closeNotPaidModal.emit();
  }
  itemSend(selectedItem) {
    if (isNotNullOrUndefinedAndNotEmptyValue(selectedItem)) {
      this.item = selectedItem;
      this.selectedItemFromList = selectedItem;
      if (!this.listProductsComponent.TecDocGrid && this.listProductsComponent.gridSettings.gridData) {
        this.listProductsComponent.mySelection =
          [this.listProductsComponent.gridSettings.gridData.data.findIndex(item => item.Id === selectedItem.Id)
            + this.listProductsComponent.gridSettings.state.skip];
      }
    } else {
      this.item = undefined;
    }
  }

  public itemDetailsSend(itemEvent: Item) {
    this.selectedItemEvent = itemEvent;
    this.selectedItemFromList = itemEvent;
    if (this.isVisibleAssociatedDepot) {
      this.loadItemWarehouseDetails();
    }
    if (!this.listProductsComponent.TecDocGrid && this.listProductsComponent.gridSettings.gridData && itemEvent) {
      this.listProductsComponent.mySelection =
        [this.listProductsComponent.gridSettings.gridData.data.findIndex(item => item.Id == itemEvent.Id)
          + this.listProductsComponent.gridSettings.state.skip];
    }
  }

  private loadItemWarehouseDetails() {
    if (isNotNullOrUndefinedAndNotEmptyValue(this.selectedItemEvent)) {
      this.selectedItemEvent.ItemWarehouse = new Array<ItemWarehouse>();
      this.itemService.getItemWarhouseOfSelectedItem(this.selectedItemEvent.Id)
        .subscribe(data => {
          data.forEach(x => {
            this.selectedItemEvent.ItemWarehouse.push(x);
          });
        }, () => {
        }, () => {
          this.associatedWarehouseGridData = {
            data: this.selectedItemEvent.ItemWarehouse,
            total: this.selectedItemEvent.ItemWarehouse.length
          };
        });
    }
  }

  itemTecDocSend($event) {
    this.tecdocItem = $event;
  }

  /**
   * mode modal init
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.searchItemService.isModal = true;
    this.options = options;
    if (this.options && this.options.data && this.options.data.isFromStockDocument) {
      this.isFromStockDocument = this.options.data.isFromStockDocument;
    }
    this.searchItemService.openedModalOptions = options;
    if (options.data.openedFromGarageAddCar) {
      this.BrandModelSubModel = options.data;
      this.openedFromGarageAddCar = options.data.openedFromGarageAddCar;
    }
    this.isPurchase = options.data.isPurchase;
  }

  clearEquivalentList($event) {
    this.isEquivalentListChanged = $event;
    if (this.isEquivalentListChanged && this.isVisibleEquivProductKits) {
      this.equivalentList.item = undefined;
      this.replacementListProductComponent.item = undefined;
      this.kitListProductComponent.item = undefined;
      // this.equivalentList.ngOnChanges();
      this.repKit.ngOnChanges();
    }
  }


  clearTecDocEquivalentList($event) {
    this.isTecDocEquivalentListChanged = $event;
    if (this.TecDocAdvancedList && this.isTecDocEquivalentListChanged && this.itemService.showtecdoc === true) {
      this.TecDocAdvancedList.tecdocItem = undefined;
      this.itemService.TecDoc = true;
      this.itemService.TecDocIdSupplier = null;
      this.itemService.TecDocReference = null;
      this.TecDocAdvancedList.ngOnChanges();
    }
    this.itemService.hideTecDocGrid();
  }

  isVisibleAdvancedSearch(isVisible) {
    this.isOpenedAdvancedSearch = isVisible;
    if (isVisible) {
      this.advancedSearchClass = StyleConstant.COL_LG_3_PR_LG_0;
      this.gridClass = StyleConstant.COL_LG_9;
    } else {
      this.advancedSearchClass = StyleConstant.COL_LG_12_H_2REM;
      this.gridClass = StyleConstant.COL_LG_12;
    }
  }

  // isFromPurchaseListItems() {
  //  this.isVisibleAdvancedSearchComponent = this.router.url === ItemConstant.LIST_ITEMS_PURCHASE_URL ||
  //    this.router.url === ItemConstant.LIST_ITEMS_INVENTORY_URL || this.router.url === SharedConstant.SEARCH_ITEM_ADD_URL ||
  //    this.router.url.includes(ItemConstant.URL_SHOW_ITEM_FROM_LIST_PRODUCT) || this.isModal;
  //  if (!this.isVisibleAdvancedSearchComponent) {
  //    this.gridClass = StyleConstant.COL_LG_12;
  //  }
  // }

  itemSelectedForGarageEvent($event) {
    this.itemSelectedForGarage.emit($event);
  }

  ngOnInit(): void {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ITEM_STOCK);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ITEM_STOCK);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ITEM_STOCK);
    if(this.isSales){
    this.idSelectedCustomer = this.searchItemService.idSupplier;
    }
    this.gridSettings = {
      state: this.itemService.gridState,
      columnsConfig: this.itemService.columnsConfig
    };
    this.gridSettingsHistory = {
      state: this.itemService.gridState,
      columnsConfig: this.itemService.columnsConfig
    };
    if (this.isModal) {
      this.handleClickSearchButton(this.itemAdvancedSearchComponent);
      if (this.options.data.filtersItemDropdown.idTiers && this.options.data.filtersItemDropdown.idTiers.length > 0) {
        this.listTiers = this.options.data.filtersItemDropdown.idTiers;
      }
      if (this.options.data.idWarehouse) {
        this.selectedWarehouseFromItemDropDown = this.options.data.idWarehouse;
      }
    }
    if (this.isForWarehouseDetail && this.idSelectedWarehouse || (this.isModal || this.isSales)) {
      this.listProductsComponent.selectedItemToOpen = { 'item': this.idSelectedWarehouse };
    }
  }

  /**
   * load item wrhouse related to the item
   * @param event
   */
  public loadWarehousDetails(event: any) {
    this.itemService.loadWarhouseDetails(event, true);
  }

  public searchAdd() {
    if (this.searchItemService.isFromSearchItem_supplierInetrface && !this.searchItemService.isForPurchase
      && (this.description || this.searchObject)) {
      const searchItem = new SearchItemSupplier();
      searchItem.Type = searchTypes.GENERIC_TYPE;
      if (this.searchObject) {
        searchItem.BarCode = this.searchObject.BarCode;
        searchItem.OEM = this.searchObject.Oem;
        searchItem.ProductType = this.searchObject.NatureLabel;
        searchItem.WarehouseName = this.searchObject.WarehouseName;
        searchItem.Supplier = this.searchObject.SupplierName;
        searchItem.BrandOfItem = this.searchObject.ProductBrandLabel;
        searchItem.Brand = this.searchObject.BrandLabel;
        searchItem.Model = this.searchObject.ModelLabel;
        searchItem.SubModel = this.searchObject.SubModelLabel;
        searchItem.Family = this.searchObject.FamilyLabel;
        searchItem.SubFamily = this.searchObject.SubFamilyLabel;
        searchItem.MinPrice = this.searchObject.MinPrice;
        searchItem.MaxPrice = this.searchObject.MaxPrice;
      }
      if (this.description) {
        searchItem.Description = this.description;
      }
      const serchRes = this.searchItemService.saveSearch(searchItem);
      if (serchRes.IdTiers) {
        this.searchItemService.addSearch(serchRes).subscribe(() => {
          this.searchItemService.disableFields = false;
        });
      }
    }
  }

  searchObjectHandler(searchObject) {
    this.searchObject = searchObject;
  }
  handleClickSearchButton(searchEvent) {
    this.searchAdd();
    this.listProductsComponent.selectedWarehouseId = undefined;
    if (this.itemAdvancedSearchComponent) {
      this.listProductsComponent.selectedWarehouseId = this.itemAdvancedSearchComponent.selectedWarehouseId;
    }
    
    this.itemId = 0;
    this.itemsTab.nativeElement.click();
    this.filterItemSearch = this.mergefilters();
    if(this.options && this.options.data && this.options.data.isForTransfertMvt && this.options.data.idWarehouse && !this.filterItemSearch.IdWarehouse){
      this.filterItemSearch.IdWarehouse = this.options.data.idWarehouse;
    }

    if (searchEvent) {
      scrollToInvalidField(this.navItemClass, this.injector.get(ElementRef));
      this.listProductsComponent.gridSettings.state.skip = NumberConstant.ZERO;
      if(this.listProductsComponent && this.listProductsComponent.filterItemSearch && this.listProductsComponent.filterItemSearch.page){
        this.listProductsComponent.filterItemSearch.page= NumberConstant.ONE;
      }
      this.listProductsComponent.loadAdvancedSearchDataSource(this.filterItemSearch);

    }
  }

  handleResetSearchButton(resetEvent: boolean) {
    if (resetEvent) {
      this.listProductsComponent.selectedWarehouseId = undefined;
      this.quickSearchItemComponent && this.quickSearchItemComponent.quickPredicate ?
        this.quickSearchItemComponent.quickPredicate.Filter = [] : '';
      this.quickSearchItemComponent && this.quickSearchItemComponent.quickPredicate ?
        this.quickSearchItemComponent.itemSearchValue = SharedConstant.EMPTY : '';
      this.itemAdvancedSearchComponent.ngOnInit();
      this.listProductsComponent.ngOnInit();
    }
  }
  handleTecdocSearch(isTecdocSearch: boolean) {
    this.listProductsComponent.ToshowTecDocGrid(isTecdocSearch);
    this.listProductsComponent.tecDocCounts = 0;
  }
  handleWarehouseName(warehouseName: string) {
    if (warehouseName && warehouseName.length > 0) {
      this.listProductsComponent.selectedWarehouseName = warehouseName;
    } else {
      this.listProductsComponent.selectedWarehouseName = undefined;
    }
  }
  handleNatureName(natureName: string) {
    if (natureName && natureName.length > 0) {
      this.listProductsComponent.selectedNatureName = natureName;
    } else {
      this.listProductsComponent.selectedNatureName = undefined;
      this.listProductsComponent.selectedWarehouseName = undefined;
    }
  }


  public getItemSelectedInDropDown() {
    if (this.itemDropDown && this.itemDropDown.selectedItemInList) {
      return this.itemDropDown.selectedItemInList.Id ? this.itemDropDown.selectedItemInList.Id : this.itemDropDown.selectedItemInList;
    }
  }

  showAssociatedDepot() {
    if (!this.isVisibleAssociatedDepot) {
      this.isVisibleAssociatedDepot = true;
      this.loadItemWarehouseDetails();
    }
  }

  showEquivProductKits() {
    if (!this.isVisibleEquivProductKits) {
      this.isVisibleEquivProductKits = true;
    }
  }


  getSumOfEquivalenceItems(): number {
    let sum = 0;
    if (this.equivalentList && this.equivalentList.gridEquivalenceSettings
      && this.equivalentList.gridEquivalenceSettings.gridData) {
      sum = this.equivalentList.gridEquivalenceSettings.gridData.total;
    }
    return sum;
  }

  getSumOfReplacementItems(): number {
    let sum = 0;
    if (this.replacementListProductComponent &&
      this.replacementListProductComponent.gridReplacementSettings
      && this.replacementListProductComponent.gridReplacementSettings.gridData) {
      sum = this.replacementListProductComponent.gridReplacementSettings.gridData.total;
    }
    return sum;
  }

  getSumOfKitItems(): number {
    let sum = 0;
    if (this.kitListProductComponent && this.kitListProductComponent.gridReplacementSettings
      && this.kitListProductComponent.gridReplacementSettings.gridData) {
      sum = this.kitListProductComponent.gridReplacementSettings.gridData.total;
    }
    return sum;
  }

  getTotalSumOfItems(): number {
    return this.getSumOfKitItems() + this.getSumOfReplacementItems() + this.getSumOfEquivalenceItems();
  }

  showFiche() {
    if (!this.isVisibleFiche) {
      this.isVisibleFiche = true;
    }
    // this.showAssociatedDepot();
  }

  switchToCardMode() {
    this.isCardViewMode = true;
    this.showAssociatedDepot();
  }

  closeEquivProductKits() {
    this.isVisibleEquivProductKits = false;
    this.isVisibleFiche = false;

  }

  getReplacementGridData() {
    if (this.replacementListProductComponent && this.replacementListProductComponent.gridReplacementSettings) {
      return this.replacementListProductComponent.gridReplacementSettings.gridData;
    }
  }
  generateBL() {
    this.isBLGenerated.emit(true);
  }
  receiveData(event: any) {
    let searchItemObject = new FilterSearchItem();
    if (this.itemAdvancedSearchComponent) {
      searchItemObject = this.itemAdvancedSearchComponent.filterSearchItem;
    }
    
    searchItemObject.GlobalSearchItem = event.itemSearchValue;
    this.filterItemSearch.GlobalSearchItem = event.itemSearchValue;
    searchItemObject.OrderBy = new Array<OrderBy>();
    searchItemObject.OrderBy.push(new OrderBy(ItemConstant.ID, OrderByDirection.desc));
    searchItemObject.page= NumberConstant.ONE;
    this.listProductsComponent.gridSettings.state.skip = NumberConstant.ZERO;
    if (searchItemObject.GlobalSearchItem) {
      this.searchAdd();
    }
    this.valueToFind = null;
    this.listProductsComponent.loadQuickSearchDataSource(searchItemObject);
  }
  initPredicate($event) {
    this.itemService.advancedSearchPredicateChange.next($event);
  }

  mergefilters(isFromSalesHistory : boolean = false) {
    if (this.itemAdvancedSearchComponent) {
      this.filterItemSearch = this.itemAdvancedSearchComponent.filterSearchItem;
      if(this.searchItemService && this.searchItemService.idSelectedSalesPrice){
        this.filterItemSearch.IdSalesPrice = this.searchItemService.idSelectedSalesPrice;
      }else{
        this.filterItemSearch.IdSalesPrice = undefined;
      }
      if(!isFromSalesHistory){
        this.filterItemSearch.IdCustomer = undefined;
        this.filterItemSearch.IdVehicle = undefined;
      }else{
        this.filterItemSearch.GlobalSearchItem = undefined;
        this.filterItemSearch.IdCustomer = this.listSalesHistory.idSelectedCustomer;
      }
    }
    if (this.quickSearchItemComponent && this.quickSearchItemComponent.itemSearchValue && !isFromSalesHistory) {
      this.filterItemSearch.GlobalSearchItem = this.quickSearchItemComponent.itemSearchValue;
       }
    if (this.quickSearchItemComponent && this.quickSearchItemComponent.itemSearchValue && !isFromSalesHistory) {
      this.filterItemSearch.GlobalSearchItem= this.quickSearchItemComponent.itemSearchValue;
    }
    if (this.quickSearchItemHistory && this.quickSearchItemHistory.itemSearchValue && isFromSalesHistory) {
      this.filterItemSearch.GlobalSearchItem = this.quickSearchItemHistory.itemSearchValue;
    }
    this.getPredicateforModalsearch();
    return (this.filterItemSearch);
  }

  getPredicateforModalsearch() {
    if (this.filterItemSearch.OrderBy == undefined) {
      this.filterItemSearch.OrderBy = new Array<OrderBy>();
      this.filterItemSearch.OrderBy.push(new OrderBy(ItemConstant.ID, OrderByDirection.desc));
    }
    if (this.isModal) {
      if (this.options.data.idItemToIgnore) {
        this.filterItemSearch.IdItemToIgnore = Number(this.options.data.idItemToIgnore);
      }
      if (this.options.data.tierType) {
        this.idTierType = this.options.data.tierType;
      }
      if ((this.listProductsComponent.selectedWarehouseId || this.options.data.idWarehouse) && !this.itemAdvancedSearchComponent) {
        this.filterItemSearch.IdWarehouse = this.listProductsComponent.selectedWarehouseId ? this.listProductsComponent.selectedWarehouseId : this.options.data.idWarehouse;
        if (this.listProductsComponent.selectedWarehouseId || this.options.data.idWarehouse) {
          this.filterItemSearch.IdWarehouse = this.options.data.idWarehouse;
        }
      }

      if (this.options.data.filtersItemDropdown && this.options.data.filtersItemDropdown.idStorage) {
        this.filterItemSearch.IdStorage = this.options.data.filtersItemDropdown.idStorage;
      }

      if (this.options.data.filtersItemDropdown && this.options.data.filtersItemDropdown.isForPurchase && this.options.data.filtersItemDropdown.isForPurchase == true) {
        this.filterItemSearch.isForPurchase = this.options.data.filtersItemDropdown.isForPurchase;
      }

      if (this.options.data.filtersItemDropdown && this.options.data.filtersItemDropdown.ignoreCharges && this.options.data.filtersItemDropdown.ignoreCharges == true) {
        this.filterItemSearch.isExpense = false;
      }

      if (this.options.data.isOnlyStocKManaged && this.options.data.isOnlyStocKManaged == true) {
        this.filterItemSearch.IsStockManaged = this.options.data.isOnlyStocKManaged;
      }

      if (this.options.data.filtersItemDropdown && this.options.data.filtersItemDropdown.isForSale && this.options.data.filtersItemDropdown.isForSale == true) {
        this.filterItemSearch.isForSale = this.options.data.filtersItemDropdown.isForSale;
      }

      if (this.options.data.filtersItemDropdown && this.options.data.filtersItemDropdown.isRestaurn && this.options.data.filtersItemDropdown.isRestaurn == true) {
        this.filterItemSearch.isRestaurn = true;
      }
      if (this.options.data.isForPos) {
        this.filterItemSearch.IsProduct = true;
      }
      if (this.options.data.isForStockMvt) {
        this.isForStockMvt = true;
      }
      if (this.options.data.filtersItemDropdown && this.options.data.filtersItemDropdown.idTiers && this.options.data.filtersItemDropdown.idTiers.length > 0) {
        this.filterItemSearch.IdTiers = this.options.data.filtersItemDropdown.idTiers;
      }
      if (isNotNullOrEmptyString(this.options.data.valueToFind)) {
        this.filterItemSearch.GlobalSearchItem = this.options.data.valueToFind;
      }
      if (this.options.data.filtersItemDropdown && this.options.data.filtersItemDropdown.idSalesPrice) {
        this.filterItemSearch.IdSalesPrice = this.options.data.filtersItemDropdown.idSalesPrice;
      }
    } else {
      if (this.isSales) {
        this.filterItemSearch.isForSale = true;
      }
      if (this.ignoreCharges) {
        this.filterItemSearch.isExpense = false;
      }
      if (this.isPurchase) {
        this.filterItemSearch.isForPurchase = true;
        if (this.options.data.filtersItemDropdown && this.options.data.filtersItemDropdown.idTiers && this.options.data.filtersItemDropdown.idTiers.length > 0) {
          this.filterItemSearch.IdTiers = this.options.data.filtersItemDropdown.idTiers;
        }
      }
      if (this.searchItemService && this.searchItemService.idSelectedSalesPrice) {
        this.filterItemSearch.IdSalesPrice = this.searchItemService.idSelectedSalesPrice;
      }
    }
  }

  public showSoldItems() {
    this.listSalesHistory.ngOnInit();
  }
  public receiveDataSalesHistory(event: any){
    this.listSalesHistory.getInitFilterItemSearch();
  }
  public clickTabItemsTecDoc (event: any){
    this.listProductsComponent.TecDocGrid = event;
    this.listProductsComponent.ngOnInit();
    this.listProductsComponent.ToshowTecDocGrid(event);
  }

  public affectEquivalentItem($event){
    if ($event && $event.IdItem && $event.IdSelectedItem) {
      this.itemService.affectEquivalentItemWithoutResponse($event.IdItem, $event.IdSelectedItem).subscribe();
    }
  }
}
