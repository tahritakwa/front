import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbTabChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridComponent, PagerSettings } from "@progress/kendo-angular-grid";
import { GroupDescriptor, process } from "@progress/kendo-data-query";
import { IModalDialogOptions } from "ngx-modal-dialog";
import { ModalDialogInstanceService } from "ngx-modal-dialog/src/modal-dialog-instance.service";
import swal from 'sweetalert2';
import { CompanyService } from "../../administration/services/company/company.service";
import { EcommerceConstant } from "../../constant/ecommerce/ecommerce.constant";
import { ItemConstant } from "../../constant/inventory/item.constant";
import { WarehouseConstant } from "../../constant/inventory/warehouse.constant";
import { KeyboardConst } from "../../constant/keyboard/keyboard.constant";
import { SearchConstant } from "../../constant/search-item";
import { SharedConstant } from "../../constant/shared/shared.constant";
import { NumberConstant } from "../../constant/utility/number.constant";
import { FetchProductsComponent } from "../../inventory/components/fetch-products/fetch-products.component";
import { ItemService } from "../../inventory/services/item/item.service";
import { ActivityAreaEnumerator } from "../../models/enumerators/activity-area.enum";
import { ItemFilterEcommerceStatusEnumerator } from "../../models/enumerators/item-filter-e-commerce-status.enum";
import { ItemOnlineSynchronizationWithEcommerceStatusEnumerator } from "../../models/enumerators/item-online-synchronization-with-e-commerce-status.enum";
import { ItemSynchronizationWithEcommerceStatusEnumerator } from "../../models/enumerators/item-synchronization-with-e-commerce-status.enum";
import { Item } from '../../models/inventory/item.model';
import { FiltersItemDropdown } from "../../models/shared/filters-item-dropdown.model";
import { FileInfo } from "../../models/shared/objectToSend";
import { SwalWarring } from "../../shared/components/swal/swal-popup";
import { UserCurrentInformationsService } from "../../shared/services/utility/user-current-informations.service";
import { ColumnSettings } from "../../shared/utils/column-settings.interface";
import { GridSettings } from "../../shared/utils/grid-settings.interface";
import { Filter, Operation, Operator, OrderBy, OrderByDirection, PredicateFormat, Relation } from "../../shared/utils/predicate";
import { EcommerceProductService } from "../services/ecommerce-product/ecommerce-product.service";
import { SharedEcommerceService } from "../services/shared-ecommerce/shared-ecommerce.service";
import {LocalStorageService} from '../../login/Authentification/services/local-storage-service';
const DETAILS_URL = 'main/inventory/product/details/';
const GET_PREDICATE = 'getDataSourcePredicate';

@Component({
  selector: 'app-product-ecommerce',
  templateUrl: './product-ecommerce.component.html',
  styleUrls: ['./product-ecommerce.component.scss']
})



export class ProductEcommerceComponent implements OnInit, OnDestroy {

  public selectedItemToOpen: any = [];
  public selectProductForPages = false;
  public deselectProductForPages = false;
  public selectProductForAll = false;
  public deselectProductForAll = false;
  public itemsWithBaseStatus: Item[];
  choosenFilter: string;
  choosenFilterNumber = NumberConstant.ZERO;
  public visitedData: { [id: number]: boolean } = {};
  public onlineProductsOfThisPage: any = [];
  public onlineProductsForChange: any = [];
  public offlineProductsOfThisPage: any = [];
  public offlineProductsForChange: any = [];

  public sendProduct: { [id: number]: boolean } = {};
  public oldData: { [id: number]: boolean } = {};
  private importFileProducts: FileInfo;
  dataImported: boolean;
  importData: Array<Item>;
  public isEsnVersion: boolean;
  public groups: GroupDescriptor[];
  public predicate: PredicateFormat;
  public isCollapsed;
  public isEcommerceOrNotOnly;
  public distinctCategories;
  public formGroup: FormGroup;
  public selectedItem: number;
  public selectedElement: Item;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public swalNotif: SwalWarring;
  isBtnClicked = false;
  public showTab = false;
  public synchronizationWithEcommerceStatus = ItemSynchronizationWithEcommerceStatusEnumerator;
  public onlineSynchronizationWithEcommerceStatus = ItemOnlineSynchronizationWithEcommerceStatusEnumerator;
  public filterEcommerceStatus = ItemFilterEcommerceStatusEnumerator;

  public columnsConfig: ColumnSettings[] = [

    {
      field: EcommerceConstant.TIERS_NAME_Data,
      title: EcommerceConstant.SUPPLIER_UPPER,
      filterable: true
    },
    {
      field: EcommerceConstant.CODE,
      title: EcommerceConstant.REFERENCE_UPPER,
      filterable: true
    },
    {
      field: EcommerceConstant.TEC_DOC_REF,
      title: EcommerceConstant.TEC_DEOC_REFERENCE_UPPER,
      filterable: true
    },
    {
      field: EcommerceConstant.DESCRIPTION,
      title: EcommerceConstant.DESIGNATION_UPPER,
      filterable: true
    },
    {
      field: EcommerceConstant.ECOMMERCE_AVAILABLE_QUANTITY,
      title: EcommerceConstant.AVAILBEL_IN_ECOMMERCE_UPPER,
      filterable: true,
      _width: 100
    },
    {
      field: EcommerceConstant.SYNCHONIZATION_STATUS,
      title: EcommerceConstant.SYNCHRONIZATION_UPPER,
      filterable: true,
      _width: 200
    },
    {
      field: EcommerceConstant.IS_ECOMMERCE,
      title: EcommerceConstant.ONLINE_UPPER,
      filterable: true,
      _width: 150
    }

  ];

  filterArray: Array<Filter>;
  operator: Operator;
  public gridSettings: GridSettings = {
    state: this.itemService.gridState,
    columnsConfig: this.columnsConfig
  };
  public modalOptions: Partial<IModalDialogOptions<any>>;
  @Input()
  public isModal = false;
  @Input()
  public isForWarehouseDetail = false;
  @Output()
  messageEvent = new EventEmitter<boolean>();
  @Output()
  itemEvent = new EventEmitter<Item>();
  @Output()
  TecDocItemEvent = new EventEmitter<Item>();
  @ViewChild(GridComponent) grid: GridComponent;
  keyAction;
  @Output() cleanEquivalenceListe = new EventEmitter<boolean>();
  @Output() clearTecDocEquivalentListe = new EventEmitter<boolean>();
  public TecDocGrid: boolean;
  public warehouseForm: FormGroup;
  filtersItemDropdown: FiltersItemDropdown;
  availableQuanittyFilter = false;
  centralQuantityFilter = false;
  isSync = false;
  isFirstTime = true;
  isSelectAllPage = false;

  constructor(public itemService: ItemService,
    private router: Router, private translate: TranslateService,
              private localStorageService : LocalStorageService,
    private modalService: ModalDialogInstanceService,
    private fetchProductsComponent: FetchProductsComponent,
    private sharedEcommerceService: SharedEcommerceService,
    private ecommerceProductService: EcommerceProductService) {
     this.isEsnVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Esn;
    this.keyAction = (event) => {
      const keyName = event.key;
      if (keyName === KeyboardConst.ESCAPE) {
        this.modalService.closeAnyExistingModalDialog();
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);
  }

  public ngOnInit(): void {
    this.modalOptions = this.fetchProductsComponent.options;
    this.CreateWarehouseFromGroup();
    this.isCollapsed = true;
    this.sendCollapseStauts();
    if (!this.isModal) {
      this.initGridDataSource();
    }
    this.initAllPendedItems();
    this.choosenFilter = this.translate.instant(EcommerceConstant.ALL_ITEMS);
  }

  IsAnyWaiting(): boolean {

    if (this.gridSettings.gridData &&
      this.gridSettings.gridData.data.find(function (x) {
        return (x.OnlineSynchonizationStatus ===
          ItemOnlineSynchronizationWithEcommerceStatusEnumerator.Pended);
      })
    ) {

      return true;
    } else {

      return false;
    }
  }

  initAllPendedItems(): any {

    if (this.IsAnyWaiting()) {
      this.sharedEcommerceService.warehouseFilterWithoutSpinner(this.gridSettings.state, this.predicate, this.filtersItemDropdown).
        subscribe(result => {

          this.itemsWithBaseStatus = result.listData;

          this.gridSettings.gridData.data.forEach(item => {

            if (item.OnlineSynchonizationStatus ===
              ItemOnlineSynchronizationWithEcommerceStatusEnumerator.Pended) {

              const dataBaseItem = this.itemsWithBaseStatus.find(function (x) {
                return (x.Id === item.Id);
              });

              if (dataBaseItem && dataBaseItem.OnlineSynchonizationStatus !==
                ItemOnlineSynchronizationWithEcommerceStatusEnumerator.Pended) {
                if (dataBaseItem.IsEcommerce) {
                  this.onlineProductsOfThisPage.push(dataBaseItem.Id);
                } else {
                  this.offlineProductsOfThisPage.push(dataBaseItem.Id);
                }
                Object.keys(dataBaseItem).forEach((key) => {
                  item[key] = dataBaseItem[key]
                })
              }
            }

          });

        });

    }

  }

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId) {
      this.showTab = true;
    }
  }

  public groupChange(groups: GroupDescriptor[]): void {
    this.groups = groups;
    this.initGridDataSource();
  }

  public CreateWarehouseFromGroup() {
    this.warehouseForm = new FormGroup({
      IdWarehouse: new FormControl('')
    });
    if (!this.isModal) {
      this.warehouseForm.get(ItemConstant.ID_WAREHOUSE).valueChanges.subscribe((value) => {
        this.initGridDataSource();
      });
    }
  }
  tecDocCollapse(isCollapsed: boolean) {
    this.isCollapsed = isCollapsed;
    this.sendCollapseStauts();
  }

  initGridDataSource(filter?: Array<Filter>,
    operator?: Operator, filtersItemDropdown?: FiltersItemDropdown) {
    if (filter || operator || filtersItemDropdown) {
      this.filterArray = filter ? filter : this.filterArray;
      this.operator = operator ? operator : this.operator;
      this.gridSettings.state.skip = NumberConstant.ZERO;
    }
    this.preparePrediacte();
    if (this.isForWarehouseDetail) {
      this.callGenericService();
    } else {

      if (filtersItemDropdown) {
        this.filtersItemDropdown = filtersItemDropdown;
      } else if (!this.filtersItemDropdown) {
        this.filtersItemDropdown = new FiltersItemDropdown();
      }

      if (this.modalOptions && this.modalOptions.data) {
        this.filtersItemDropdown.idTiers = this.modalOptions.data.filtersItemDropdown.idTiers;
        this.filtersItemDropdown.isForSale = this.modalOptions.data.filtersItemDropdown.isForSale;
        this.filtersItemDropdown.isForPurchase = this.modalOptions.data.filtersItemDropdown.isForPurchase;
      }
      this.filtersItemDropdown.idWarehouse = this.warehouseForm.controls[ItemConstant.ID_WAREHOUSE].value;
      this.filtersItemDropdown.isAvailableInStock = this.availableQuanittyFilter;
      this.filtersItemDropdown.isCentralOnly = this.centralQuantityFilter;
      this.filtersItemDropdown.fromEcommerce = true;
      this.filtersItemDropdown.isEcommerceOrNotOnly = this.isEcommerceOrNotOnly;

      this.sharedEcommerceService.warehouseFilter(this.gridSettings.state, this.predicate, this.filtersItemDropdown).
        toPromise().then(async result => {
          await new Promise(resolve => resolve(
            this.prepareList(result)
          ));
        });
    }
    if (this.gridSettings.gridData) {
      this.gridSettings.gridData.data.forEach((item, idx) => {
        this.grid.collapseRow(this.gridSettings.state.skip + idx);
      });
    }
  }

  callGenericService() {
    let api = GET_PREDICATE;
    if (this.isForWarehouseDetail && this.selectedItemToOpen[WarehouseConstant.ITEM]) {
      api = ItemConstant.GET_ITEM_LIST_BY_WAREHOUSE;
      if (!this.predicate.Filter) {
        this.predicate.Filter = new Array<Filter>();
      }
      this.predicate.Filter.push(
        new Filter(ItemConstant.ID_WAREHOUSE, Operation.eq, this.selectedItemToOpen[WarehouseConstant.ITEM].Id)
      );
    }
    this.itemService.reloadServerSideData(this.gridSettings.state, this.predicate, api).
      subscribe(result => {
        this.prepareList(result);
      });
  }
  filterByAvailbleQuantity() {
    this.availableQuanittyFilter = !this.availableQuanittyFilter;
    this.initGridDataSource();
  }

  filterCentralQuantity() {
    this.centralQuantityFilter = !this.centralQuantityFilter;
    this.initGridDataSource();
  }

  public sendCollapseStauts(): void {
    this.messageEvent.emit(this.isCollapsed);
    this.itemEvent.emit(this.selectedElement);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.initGridDataSource();

  }
  async prepareList(result) {
    this.deselectProductForPages = false;
    this.selectProductForPages = false;
    let state = this.itemService.gridState;
    state.skip = 0;
    state.take = this.gridSettings.state.take;
    state.filter = this.gridSettings.state.filter;
    state.group = this.gridSettings.state.group;
    state.sort = this.gridSettings.state.sort;
    let Process = this.isForWarehouseDetail ? process(result.data, state) : process(result.listData, state);
    this.gridSettings.gridData = result;
    this.gridSettings.gridData.data = Process.data;

    this.isSelectAllPage = false;

    this.onlineProductsOfThisPage = [];
    this.offlineProductsOfThisPage = [];

    let product: Item;
    for (product of this.gridSettings.gridData.data) {
      var id = product.Id;
      if (!product.IsEcommerce) { product.IsEcommerce = false; }


      if ((!product.OnlineSynchonizationStatus ||
        (product.OnlineSynchonizationStatus && product.OnlineSynchonizationStatus !==
          ItemOnlineSynchronizationWithEcommerceStatusEnumerator.Pended))) {

        if (product.IsEcommerce) {
          this.onlineProductsOfThisPage.push(id);
        } else {
          this.offlineProductsOfThisPage.push(id);
        }
      }

    }

    this.gridSettings.gridData.total = result.total;
    this.cleanEquivalenceListe.emit(true);
    await this.clearTecDocEquivalentListe.emit(true);

  }

  public ToshowTecDocGrid(value) {
    this.TecDocGrid = value;
    this.itemService.TecDoc = value;
  }

  private preparePrediacte(): void {
    this.predicate = new PredicateFormat();

    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy('TecDocRef', OrderByDirection.desc));

    if (this.filterArray && this.filterArray.length > 0) {
      this.predicate.Filter = new Array<Filter>();
      this.filterArray.forEach(p => this.predicate.Filter.push(p));
    }
    if (this.operator) {
      this.predicate.Operator = this.operator;
    }

    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [
      new Relation(ItemConstant.NATURE_NAVIGATION),
      new Relation(ItemConstant.ID_TIERS_NAVIGATION)
    ]);

  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(ItemConstant.URI_ADVANCED_EDIT + dataItem.Id, { queryParams: dataItem, skipLocationChange: true });
  }

  public isNotEmpty(myString: string): boolean {
    return myString && myString !== '';
  }

  public loadWarehousDetails(event: any) {
    this.itemService.loadWarhouseDetails(event, true);
  }

  public selectRow(event: any) {
    this.selectedElement = event.selectedRows[0].dataItem;
    if (this.isCollapsed && event.selectedRows[0] && event.selectedRows[0].dataItem) {
      this.itemEvent.emit(event.selectedRows[0].dataItem);
    }
    if (this.isModal && this.modalOptions) {
      this.selectedItem = event.selectedRows[0].dataItem.Id;
    }
    if (this.isBtnClicked) {
      this.dbCellClick();
      this.isBtnClicked = false;
    }
  }

  public selectRowTecDoc(event: any) {
    if (this.isCollapsed && event.selectedRows[0] && event.selectedRows[0].dataItem.IsInDb) {
      this.TecDocItemEvent.emit(event.selectedRows[0].dataItem.ItemInDB);
    }
    if (this.isCollapsed && event.selectedRows[0] && !event.selectedRows[0].dataItem.IsInDb) {
      this.TecDocItemEvent.emit(event.selectedRows[0].dataItem);
    }
    if (this.isModal && this.modalOptions) {
      this.selectedItem = event.selectedRows[0].dataItem.ItemInDB.Id;
    }
    if (this.isBtnClicked) {
      this.dbCellClick();
      this.isBtnClicked = false;
    }
  }

  public filter(filter?: Array<Filter>, operator?: Operator, filtersItemDropdown?: FiltersItemDropdown) {
    this.initializeFilters();
    this.initGridDataSource(filter, operator, filtersItemDropdown);
  }

  initializeFilters() {
    this.selectProductForAll = false;
    this.deselectProductForAll = false;
    this.selectProductForPages = false;
    this.deselectProductForPages = false;
  }

  public dbCellClick(): void {
    if (this.isModal && this.modalOptions) {
      this.modalOptions.data = this.selectedItem;
      this.modalOptions.onClose();
    }
    this.modalService.closeAnyExistingModalDialog();
  }

  TecDocDbCellClick(value) {
  }

  onClickGoToDetails(id) {
    this.router.navigateByUrl(DETAILS_URL.concat(id));
  }

  getItemId($event) {
    this.isBtnClicked = true;
  }
  ngOnDestroy(): void {
    document.removeEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);
  }

  isInterfaceChangedData(id: number) {
    return this.visitedData[id] !== this.oldData[id];
  }

  public checkIfIsEcommerce(id: number) {
    return this.visitedData[id];
  }

  public selectItemToChangeIsEcommerceValue(id: number, isSelected: boolean, isEcommerce: boolean) {

    if (isEcommerce) {
      if (isSelected) {
        this.onlineProductsForChange.push(id);
      }
      else {
        const index: number = this.onlineProductsForChange.indexOf(id);
        if (index !== -1) {
          this.onlineProductsForChange.splice(index, 1);
        }
      }
    } else {
      if (isSelected) {
        this.offlineProductsForChange.push(id);
      }
      else {
        const index: number = this.offlineProductsForChange.indexOf(id);
        if (index !== -1) {
          this.offlineProductsForChange.splice(index, 1);
        }
      }
    }

  }

  public isChecked(id) {
    return ((this.onlineProductsForChange.indexOf(id) > -1) ||
      (this.offlineProductsForChange.indexOf(id) > -1));
  }

  public selectProductForPage(isSelected: boolean) {
    if (this.selectProductForPages || this.deselectProductForPages) {
      let product: Item;
      for (product of this.gridSettings.gridData.data) {
        this.selectItemToChangeIsEcommerceValue(product.Id, isSelected, product.IsEcommerce);
      }
    } else {

      for (let product of this.gridSettings.gridData.data) {
        var id = product[SharedConstant.ID];
        this.visitedData[id] = this.oldData[id];
      }
    }
  }

  public selectProductForAlls(isSelected: boolean) {

    if (this.selectProductForAll || this.deselectProductForAll) {

      this.filtersItemDropdown.isSelectOrDeselectAllEcommerce = true;

      this.sharedEcommerceService.warehouseFilter(this.gridSettings.state, this.predicate, this.filtersItemDropdown).
        toPromise().then(async result => {
          const data: Array<Item> = result[EcommerceConstant.LIST_DATA];
          data.forEach(x => {
            if (!this.visitedData[x.Id]) {
              this.oldData[x.Id] = x.IsEcommerce;
            }
            this.visitedData[x.Id] = isSelected;
          });
          this.filtersItemDropdown.isSelectOrDeselectAllEcommerce = false;
        });

    }
  }

  synchronizeProduct(id: number, isEcommerce: boolean) {
    this.ecommerceProductService.synchronizeAllProductsDetails({ [id]: isEcommerce }).subscribe(() => {
      delete this.visitedData[id];
      delete this.sendProduct[id];
      delete this.oldData[id];
      this.initGridDataSource();
    });
  }

  public exposeAllSelectedProductsOnOrOffLine(isToPutOnline: boolean) {

    if (isToPutOnline) {
      this.offlineProductsForChange.forEach((Id) => {
        this.sendProduct[Id] = isToPutOnline;
      });
    } else {
      this.onlineProductsForChange.forEach((Id) => {
        this.sendProduct[Id] = isToPutOnline;
      });
    }

    this.ecommerceProductService.synchronizeProducts(this.sendProduct).subscribe(() => {
      this.sendProduct = {};
      this.onlineProductsForChange = [];
      this.offlineProductsForChange = [];
      this.isSelectAllPage = false;
      this.initGridDataSource();
    });




  }
  isExposeOnlineBtnDisabled(): boolean {
    return this.choosenFilterNumber === this.filterEcommerceStatus.IsEcommerceOnly ||
      !this.offlineProductsForChange || this.offlineProductsForChange.length === 0;
  }
  isExposeOfflineBtnDisabled(): boolean {
    return this.choosenFilterNumber === this.filterEcommerceStatus.IsNotEcommerceOnly ||
      !this.onlineProductsForChange || this.onlineProductsForChange.length === 0;
  }
  public onFilterClick(filterStatus?: number) {
    if (!filterStatus) {
      this.choosenFilter = this.translate.instant(EcommerceConstant.ALL_ITEMS);
      this.isEcommerceOrNotOnly = filterStatus;
    } else {

      this.gridSettings.state.skip = NumberConstant.ZERO;

      switch (filterStatus) {
        case this.filterEcommerceStatus.IsEcommerceOnly:
          this.isEcommerceOrNotOnly = true;
          this.choosenFilter = this.translate.instant(EcommerceConstant.IS_EXPOSED_ONLINE_ONLY);
          break;
        case this.filterEcommerceStatus.IsNotEcommerceOnly:
          this.isEcommerceOrNotOnly = false;
          this.choosenFilter = this.translate.instant(EcommerceConstant.IS_EXPOSED_OFFLINE_ONLY);
          break;
      }

    }

    this.choosenFilterNumber = filterStatus;

    this.initGridDataSource();
  }

  public selectAllProductsByFilters() {
    this.selectProductForAll = !this.selectProductForAll;
    this.deselectProductForAll = false;
    this.selectProductForPages = false;
    this.deselectProductForPages = false;
    this.selectProductForAlls(true);
  }

  public deselectAllProductsByFilters() {
    this.deselectProductForAll = !this.deselectProductForAll;
    this.selectProductForAll = false;
    this.selectProductForPages = false;
    this.deselectProductForPages = false;
    this.selectProductForAlls(false);
  }

  public selectAllProductsByFiltersAndPages() {

    this.onlineProductsOfThisPage.forEach((value) => {
      if (this.onlineProductsForChange.indexOf(value) === -1) {
        this.onlineProductsForChange.push(value);
      }
    });
    this.offlineProductsOfThisPage.forEach((value) => {
      if (this.offlineProductsForChange.indexOf(value) === -1) {
        this.offlineProductsForChange.push(value);
      }
    });

    this.isSelectAllPage = true;
  }

  public deselectAllProductsByFiltersAndPages() {

    this.onlineProductsOfThisPage.forEach((value) => {
      if (this.onlineProductsForChange.indexOf(value) > -1) {
        const index: number = this.onlineProductsForChange.indexOf(value);
        if (index !== -1) {
          this.onlineProductsForChange.splice(index, 1);
        }
      }
    });
    this.offlineProductsOfThisPage.forEach((value) => {
      if (this.offlineProductsForChange.indexOf(value) > -1) {
        const index: number = this.offlineProductsForChange.indexOf(value);
        if (index !== -1) {
          this.offlineProductsForChange.splice(index, 1);
        }
      }
    });
    this.isSelectAllPage = false;

  }

  public ResetAllProducts(isNotFromResetBtn?: boolean) {
    this.visitedData = {};
    for (let id in this.oldData) {
      this.visitedData[id] = this.oldData[id];
    }
    if (!isNotFromResetBtn) {
      this.successSwal(SharedConstant.SUCCESSFULLY_RESET);
    }

  }

  successSwal(message: string) {
    swal.fire({
      icon: SharedConstant.SUCCESS,
      html: `${this.translate.instant(message)}`
    });
  }

  public incomingFile(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.importFileProducts = FileInfo.generateFileInfoFromFile(file, reader);
        this.sharedEcommerceService.uploadEmployee(this.importFileProducts).subscribe((res: Array<Item>) => {
          this.dataImported = true;
          this.importData = res;
        });
      };
    }
  }
  public sychronizeWithEcommerce() {
    this.ecommerceProductService.synchronizeWithEcommerce(this.offlineProductsForChange).subscribe(() => {
      this.initGridDataSource();
      this.offlineProductsForChange = [];
    });
  }



}
