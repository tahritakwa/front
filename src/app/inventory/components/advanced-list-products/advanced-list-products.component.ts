import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { process } from '@progress/kendo-data-query';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ItemService } from '../../services/item/item.service';
import { Item } from '../../../models/inventory/item.model';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { TeckDockWithWarehouseFilter } from '../../../models/inventory/teckDock-with-warehouse-filter';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { ItemToGetEquivalentList } from '../../../models/inventory/item-to-get-equivalent-list.model';
import { ItemWarehouse } from '../../../models/inventory/item-warehouse.model';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { AssociatedWarehouseGridComponent } from '../../associated-warehouse-grid/associated-warehouse-grid.component';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { isNullOrUndefined } from 'util';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { TranslateService } from '@ngx-translate/core';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';

const GRID_STATE = 'gridState';

@Component({
  selector: 'app-advanced-list-products',
  templateUrl: './advanced-list-products.component.html',
  styleUrls: ['./advanced-list-products.component.scss']
})
export class AdvancedListProductsComponent implements OnInit {


  @ViewChild('listItem') equivalenceListItem;
  @ViewChild('listItemTecDoc') tecDocListItem;
  @Input() isCollapsed: boolean;
  @Input() item: Item;
  @Input() isEquivalenceGroupInterface = false;
  @Input() public isModal: boolean;
  @Input() public modalOptions;
  @Input() isToShow: boolean;
  @Input() isReduced = false;
  @Input() sendToDocument: boolean;
  @Input() disabled: boolean;
  @Input() idSelectedWarehouse: number;
  @Input() openedFromGarageAddCar;
  @Input() public showTecDocSwitch = false;
  public isdropdown: boolean;
  public equivalenceGrpList: Array<Item>;
  public equivalenceTecDocGrpList: Array<Item>;
  public showTab = false;
  public original: number;
  @Input() public isInitilize: boolean;
  public TecDocEquivalence = false;
  public firstCollapseIsOpened: boolean;
  @ViewChild(AssociatedWarehouseGridComponent) associatedWarehouse: AssociatedWarehouseGridComponent;
  @Input() showFiche = true;
  @Input() showSearch = true;
  @Input() gridState;
  /**
   * Flag in case to show only product brand column
   */
  @Input() public isToOnlyShowBrand: boolean;
  @Input() itemsTabId: string;
  @Input() fichesTabId: string;
  @Input() depotTabId: string;

  @Input() itemsTabHref: string;
  @Input() fichesTabHref: string;
  @Input() depotTabHref: string;
  @Output() refreshNumbreOfKit = new EventEmitter<any>();
  @Input() addItem: boolean;
  @Input() isFromUpdateItem: boolean;
  @Input() isForGarage: boolean;
  @Output() itemSelectedForGarage: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Object to hold the selected item in the list
   */
  public selectedItemFromList: Item;
  public associatedWarehouseGridData = SharedConstant.DEFAULT_GRID_DATA;
  formGroup: FormGroup;
  selectedItem: Item;
  public filtredEquivalenceGrpList: Array<Item>;
  /**
   * permissions
   */
  public hasShowPermission: boolean;
  public columnsConfig: ColumnSettings[] = [
    {
      field: ItemConstant.SUPPLIER_COLUMN_FIELD,
      title: TiersConstants.SUPPLIERS,
      _width: 150,
      filterable: true
    },
    {
      field: ItemConstant.CODE_COLUMN,
      title: ItemConstant.PRODUCTS,
      _width: 200,
      filterable: true
    },
    {
      field: 'Description',
      title: 'DESIGNATION',
      _width: 200,
      filterable: true
    },
    {
      field: 'AllAvailableQuantity',
      title: 'QTE_TOT',
      _width: 90,
      filterable: true
    },
    {
      field: 'LabelProduct',
      title: 'PRODUCT_BRAND',
      filterable: true,
      _width: 100
    }
  ];

  public hasUpdatePermission: boolean;
  public hasAddPermission: boolean;
  constructor(public itemService: ItemService, private searchItemService: SearchItemService, private fb: FormBuilder,
    private swalWarrings: SwalWarring, private translate: TranslateService, private validationService: ValidationService, public viewRef: ViewContainerRef,
    private authService: AuthService, private localStorageService: LocalStorageService) {
  }

  public gridEquivalenceSettings: GridSettings = {
    state: this.itemService.gridState,
    columnsConfig: this.columnsConfig,
  };

  public gridTecDocEquivalenceSettings: GridSettings = {
    state: this.itemService.gridState,
    columnsConfig: this.itemService.columnsConfig,

  };

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId) {
      this.showTab = true;
    }
  }

  itemSelectedForGarageEvent($event) {
    this.itemSelectedForGarage.emit($event);
  }

  public Assign() {
    this.equivalenceGrpList = [];
    this.equivalenceTecDocGrpList = [];
    if (this.item) {
      const guidItem = new ItemToGetEquivalentList();
      guidItem.Id = this.item.Id;
      guidItem.EquivalenceItem = this.item.EquivalenceItem;
      guidItem.IdSelectedWarehouse = this.itemService.idSelectedWarehouse;
      if (this.itemService.isPurchase) {
        guidItem.IsForPurchase = this.itemService.isPurchase;
      }
      this.reloadList(guidItem);
    } else {
      if (this.equivalenceListItem) {

        this.equivalenceListItem.onStateChange(this.gridEquivalenceSettings.state, this.equivalenceGrpList);
      }
      if (this.tecDocListItem) {
        this.tecDocListItem.onStateChange(this.gridTecDocEquivalenceSettings.state, this.equivalenceTecDocGrpList);
      }
    }
    this.refreshNumbreOfKit.emit();
  }

  public removeEquivalentItem(event) {
    this.equivalenceGrpList = this.equivalenceGrpList.filter(x => x.Code !== event.Code);
    this.gridEquivalenceSettings.gridData = {
      data: this.equivalenceGrpList,
      total: this.equivalenceGrpList.length
    };
    const listEquivalence = Object.assign([], this.equivalenceGrpList);
    this.gridEquivalenceSettings.gridData = process(listEquivalence, this.itemService.gridState);
    this.gridEquivalenceSettings.state.skip = NumberConstant.ZERO;
    this.equivalenceListItem.onStateChange(this.gridEquivalenceSettings.state, this.equivalenceGrpList);
  }

  reloadList(guidItem) {
    this.TecDocEquivalence = false;
    let list;
    if (this.isReduced) {
      this.itemService.getReducedItemEquivalance(guidItem).toPromise().then(res => {
        list = res;
        this.equivalenceGrpList = list;
        this.original = this.equivalenceGrpList.length;
        this.gridEquivalenceSettings.columnsConfig = this.columnsConfig;
        if (this.equivalenceListItem) {
          this.equivalenceListItem.onStateChange(this.gridEquivalenceSettings.state, this.equivalenceGrpList);
        }
      });
    } else {
      this.itemService.getItemEquivalance(guidItem).toPromise().then(res => {
        list = res;
        this.equivalenceGrpList = list;
        this.original = this.equivalenceGrpList.length;
        this.gridEquivalenceSettings.columnsConfig = this.columnsConfig;
        if (this.equivalenceListItem) {
          this.equivalenceListItem.onStateChange(this.gridEquivalenceSettings.state, this.equivalenceGrpList);
        }
      });
    }
  }

  public toggleTecDoc() {
    this.gridTecDocEquivalenceSettings.gridData = {
      data: [],
      total: NumberConstant.ZERO
    };

    if (this.tecDocListItem) {
      this.tecDocListItem.onStateChange(this.gridTecDocEquivalenceSettings.state, this.equivalenceTecDocGrpList);
    }
    this.TecDocEquivalence = !this.TecDocEquivalence;
    if (this.TecDocEquivalence === true) {
      if (this.item && this.item.TecDocRef && !this.isdropdown) {
        let list1;
        let selectedTecDocItem = new TeckDockWithWarehouseFilter(null, null, this.localStorageService, null, false,
          this.item.TecDocIdSupplier, this.item.TecDocRef, false, null);
        if (!this.isModal && !this.searchItemService.isFromSearchItem_supplierInetrface) {
          this.shoTeckDocEquivalent(selectedTecDocItem, list1);
        }
      }
    }
  }

  public shoTeckDocEquivalent(selectedTecDocItem, list1) {
    this.equivalenceTecDocGrpList = [];
    this.itemService.GetEquivalentTecDoc(selectedTecDocItem).toPromise().then(data => {
      if (data && data.length > NumberConstant.ZERO) {
        list1 = data;
        this.equivalenceTecDocGrpList = this.equivalenceTecDocGrpList.concat(list1.filter(x => x.IsInDb === false &&
          x.Reference !== selectedTecDocItem.TecDocReferance));
        this.gridTecDocEquivalenceSettings.gridData = {
          data: data.slice(this.gridTecDocEquivalenceSettings.state.skip,
            this.gridTecDocEquivalenceSettings.state.take),
          total: this.equivalenceTecDocGrpList.length
        };
        const listEquivalence = Object.assign([], this.equivalenceTecDocGrpList);
        this.gridTecDocEquivalenceSettings.gridData = process(listEquivalence, this.itemService.gridState);
        this.gridTecDocEquivalenceSettings.state.skip = NumberConstant.ZERO;
        if (this.tecDocListItem) {
          this.tecDocListItem.onStateChange(this.gridTecDocEquivalenceSettings.state, this.equivalenceTecDocGrpList);
        }
      }
      this.tecDocListItem.grid.loading = false;
    });

  }



  ngOnInit(): void {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ITEM_STOCK);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ITEM_STOCK);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ITEM_STOCK);
    if (this.addItem) {
      this.createFormGroup();
    }
    this.Assign();
  }
  createFormGroup() {
    this.formGroup = this.fb.group({
      IdItem: new FormControl(SharedConstant.EMPTY),
    });
  }
  /**
     * when affect item
     * */
  onAffectItem() {
    if (this.formGroup.valid) {
      if (this.equivalenceGrpList === undefined) {
        this.equivalenceGrpList = [];
      }

      if (this.item && this.item.Id && this.item.Id !== NumberConstant.ZERO) {
        this.affectionRealTimeOnServerSideForExistingItem();
      } else {
        this.affectionClientSideOnlyForNewItem();
      }

    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }
  private affectionRealTimeOnServerSideForExistingItem() {
    if (this.selectedItem) {
      this.itemService.affectEquivalentItem(this.item.Id, this.selectedItem.Id).subscribe(res => {
        this.item.EquivalenceItem = res.EquivalenceItem;
        this.selectedItem = null;
        this.formGroup.controls[ItemConstant.ITEM_ID].setValue('');
        this.Assign();
      });
    }
  }

  private affectionClientSideOnlyForNewItem() {
    if (this.equivalenceGrpList.length === NumberConstant.ZERO) {
      this.onAffectItemWhenEmptyList();
    } else {
      this.onAffectItemWhenNotEmtyList();
    }
  }
  private onAffectItemWhenEmptyList() {
    if(this.selectedItem){
    if ( !this.selectedItem.EquivalenceItem) {
      this.item.EquivalenceItem = Guid.create().toString();
      this.getItemDetails();
    } else {
      this.item.EquivalenceItem = this.selectedItem.EquivalenceItem;
      this.itemService.getReducedItemEquivalance(this.selectedItem).subscribe(data => {
        const listItemEquivalence = data as Array<Item>;
        listItemEquivalence.forEach(p => {
          this.equivalenceGrpList.push(p);
        });
        this.equivalenceGrpList.push(this.selectedItem);
        this.filtredEquivalenceGrpList = this.equivalenceGrpList.slice(0);
        this.equivalenceListItem.onStateChange(this.gridEquivalenceSettings.state);
      });
    }}
    this.selectedItem = null;
    this.formGroup.controls[ItemConstant.ITEM_ID].setValue('');
  }

  private onAffectItemWhenNotEmtyList() {
    if (this.equivalenceGrpList &&
      this.equivalenceGrpList.filter(c => c.Id === this.selectedItem.Id).length === 0) {
      if (!this.selectedItem.EquivalenceItem ||
        this.selectedItem.EquivalenceItem === this.item.EquivalenceItem) {
        this.getItemDetails();
      } else {
        const errorMessage = `${this.translate.instant(ItemConstant.DO_YOU_WANT_CHANGE_GRP_EQUIVALENCE_GUID)}`;
        this.swalWarrings.CreateSwal(errorMessage, null, ItemConstant.YES, ItemConstant.NO).then((result) => {
          if (result.value) {
            if (!this.item.EquivalenceItem) {
              this.item.EquivalenceItem = Guid.create().toString();
            }
            this.itemService.getReducedItemEquivalance(this.selectedItem).subscribe(data => {
              this.assignDataToEquivalentsGrid(data);
            });
          }
        });
      }
    }
    this.selectedItem = null;
    this.formGroup.controls[ItemConstant.ITEM_ID].setValue('');
  }
  private assignDataToEquivalentsGrid(data) {
    const listItemEquivalence = data as Array<Item>;
    listItemEquivalence.forEach(p => {
      this.equivalenceGrpList.push(p);
    });
    this.equivalenceGrpList.push(this.selectedItem);
    this.equivalenceListItem.onStateChange(this.gridEquivalenceSettings.state);
  }


  private getItemDetails() {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Relation = new Array<Relation>();
    predicate.Filter.push(new Filter('Id', Operation.eq, this.selectedItem.Id));
    predicate.Relation.push(new Relation(ItemConstant.ID_NATURE_NAVIGATION));
    this.itemService.getModelByCondition(predicate).subscribe(item => {
      if (!isNullOrUndefined(item)) {
        this.equivalenceGrpList.push(item);
        this.filtredEquivalenceGrpList = this.equivalenceGrpList.slice(0);
      }
      this.equivalenceListItem.onStateChange(this.gridEquivalenceSettings.state);
    });
  }
  checkState(changes) {
    if (changes && changes[GRID_STATE]) {
      this.gridEquivalenceSettings.state = this.gridState;
      this.gridTecDocEquivalenceSettings.state = this.gridState;
    }
  }

  public onRowClick(event) {
    if (event && event.dataItem) {
      const item: any = event.dataItem as any;
      this.selectedItemFromList = item;
      if ((item.IsStockManeged) || (!item.IsStockManaged && item.IdNatureNavigation && item.IdNatureNavigation.IsStockManaged)) {
        item.ItemWarehouse = new Array<ItemWarehouse>();
        this.itemService.getItemWarhouseOfSelectedItem(item.Id)
          .subscribe(data => {
            if (isNotNullOrUndefinedAndNotEmptyValue(data)) {
              data.forEach((itemWarehouse) => {
                item.ItemWarehouse.push(itemWarehouse);
              });
            }
            this.fillAssociatedWarehouseGridData(item.ItemWarehouse, item.ItemWarehouse.length);
          });
      }
    } else {
      this.fillAssociatedWarehouseGridData([], NumberConstant.ZERO);
    }
  }

  private fillAssociatedWarehouseGridData(data: any[], total: number) {
    this.associatedWarehouseGridData = {
      data: data,
      total: total
    };
  }

  public isCollapseSelected(): boolean {
    if (this.TecDocEquivalence) {
      return !this.isFromUpdateItem && this.gridTecDocEquivalenceSettings && this.gridTecDocEquivalenceSettings.gridData
        && this.gridTecDocEquivalenceSettings.gridData.total > NumberConstant.ZERO;
    } else if (!this.TecDocEquivalence) {
      return this.gridEquivalenceSettings && this.gridEquivalenceSettings.gridData
        && this.gridEquivalenceSettings.gridData.total > NumberConstant.ZERO;
    }
  }
  /**
   * receive data from quick search
   * @param event
   */
  public receiveData(event: any) {
    if (this.item.Id == undefined || this.item.Id == NumberConstant.ZERO) {
      this.equivalenceGrpList = this.filtredEquivalenceGrpList.filter(x => x.RefDesignation.includes(event));
      this.equivalenceListItem.onStateChange(this.gridEquivalenceSettings.state, this.equivalenceGrpList);
    } else {
      const guidItem = new ItemToGetEquivalentList();
      guidItem.Id = this.item.Id;
      guidItem.EquivalenceItem = this.item.EquivalenceItem;
      guidItem.IdSelectedWarehouse = this.itemService.idSelectedWarehouse;
      guidItem.SearchString = event;
      this.reloadList(guidItem);
    }

  }

  /**
   * when change item in dropdown
   * @param $event
   */
  itemSelected($event) {
    if ($event && $event.itemFiltredDataSource) {
      this.selectedItem = $event.itemFiltredDataSource.filter(c => c.Id ===
        $event.itemForm.controls[ItemConstant.ITEM_ID].value)[NumberConstant.ZERO];
    }
  }
  public RefreshEquivalenceList(){
    this.Assign();
  }
}

