import {Component, ViewChild, Input, OnChanges, Output, EventEmitter, OnInit} from '@angular/core';
import {Item} from '../../../models/inventory/item.model';
import {ListItemComponent} from '../list-item/list-item.component';
import {ItemService} from '../../services/item/item.service';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ItemToGetEquivalentList} from '../../../models/inventory/item-to-get-equivalent-list.model';
import {GridDataResult} from '@progress/kendo-angular-grid';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ItemWarehouse} from '../../../models/inventory/item-warehouse.model';
import {ItemConstant} from '../../../constant/inventory/item.constant';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const For_Kit_Items_Tab_Id = 'items-kitt-tab';
const For_Kit_Fiches_Tab_Id = 'fiches-kitt-tab';
const For_Kit_Depot_Tab_Id = 'associated-depot-kitt-tab';
const For_Kit_Items_Tab_Href = 'items-kitt';
const For_Kit_Fiches_Tab_Href = 'fiches-kitt';
const For_Kit_Depot_Tab_Href = 'associated-depot-kitt';

const Items_Tab_Id = 'items-replacement-tab';
const Fiches_Tab_Id = 'fiches-replacement-tab';
const Depot_Tab_Id = 'associated-depots-replacement-tab';
const Items_Tab_Href = 'items-replacement';
const Fiches_Tab_Href = 'fiches-replacement';
const Depot_Tab_Href = 'associated-depots-replacement';

@Component({
  selector: 'app-replacement-list-product',
  templateUrl: './replacement-list-product.component.html',
  styleUrls: ['./replacement-list-product.component.scss']
})
export class ReplacementListProductComponent implements OnInit{
  @ViewChild(ListItemComponent) listItem;
  @Input() isCollapsed: boolean;
  @Input() item: Item;
  @Input() isEquivalenceGroupInterface = false;
  @Input() public isModal: boolean;
  @Input() public modalOptions;
  @Input() isToShow: boolean;
  @Input() sendToDocument: boolean;
  @Input() isForKit: boolean;
  @Input() isReplacementInterface: boolean;
  public equivalenceGrpList: Array<Item>;
  @Input() openedFromGarageAddCar;
  public replacementGrpList: Array<Item>;
  public replacementItem: any;
  public kitItems: any;
  @Input() showFiche = true;
  @Input() showSearch = true;
  @Output() refreshNumbreOfKit = new EventEmitter<any>();

  /**
   * Flag in case to show only product brand column
   */
  @Input()public isToOnlyShowBrand : boolean;
  /***
   * If it's the kit products
   */
  @Input() forKitItemsTabId = For_Kit_Items_Tab_Id;
  @Input() forKitFichesTabId = For_Kit_Fiches_Tab_Id;
  @Input() forKitDepotTabId = For_Kit_Depot_Tab_Id;

  @Input() forKitItemsTabHref = For_Kit_Items_Tab_Href;
  @Input() forKitFichesTabHref = For_Kit_Fiches_Tab_Href;
  @Input() forKitDepotTabHref = For_Kit_Depot_Tab_Href;

  /***
   * If it's the replacement products
   */
  @Input() itemsTabId = Items_Tab_Id;
  @Input() fichesTabId = Fiches_Tab_Id;
  @Input() depotTabId = Depot_Tab_Id;

  @Input() itemsTabHref = Items_Tab_Href;
  @Input() fichesTabHref = Fiches_Tab_Href;
  @Input() depotTabHref = Depot_Tab_Href;
  public columnsConfig: ColumnSettings[] = [
    {
      field: ItemConstant.SUPPLIER_COLUMN_FIELD,
      title: TiersConstants.SUPPLIER,
      _width: 150,
      filterable: true
    },
    {
      field: ItemConstant.CODE_COLUMN,
      title: ItemConstant.ITEM,
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

  public gridReplacementSettings: GridSettings = {
    state: this.itemService.gridState,
    columnsConfig: this.columnsConfig
  };
  public associatedWarehouseGridData = SharedConstant.DEFAULT_GRID_DATA;
  /**
   * Object to hold the selected item in the list
   */
  public selectedItemFromList: Item;
  /**
   * permissions
   */
   public hasShowPermission: boolean;
   public hasUpdatePermission : boolean;
  constructor(public itemService: ItemService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ITEM_STOCK);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ITEM_STOCK);
    this.GetData();
  }
  public GetData() {
    this.equivalenceGrpList = [];
    if (this.item) {
      let list;
      const guidItem = new ItemToGetEquivalentList();
      guidItem.Id = this.item.Id;
      guidItem.IdSelectedWarehouse = this.itemService.idSelectedWarehouse;
      if (this.itemService.isPurchase) {
        guidItem.IsForPurchase = this.itemService.isPurchase;
      }
      if (this.isForKit) {
        this.setDataforKit(guidItem, list);
      } else {
        this.setDataforReplacement(guidItem, list);
      }
      this.refreshNumbreOfKit.emit();
    }
    if (this.listItem) {
      this.listItem.onStateChange({take: 10, skip: 0}, this.equivalenceGrpList);
    }
  }

  setDataforKit(guidItem, list) {
    this.itemService.getItemKit(guidItem).toPromise().then(data => {
      this.setData(data, list);
      this.kitItems = data;
    });
  }

  setDataforReplacement(guidItem, list) {
    this.itemService.getReplacementItems(guidItem).toPromise().then(data => {
      this.setData(data, list);
      this.replacementItem = data;
    });
  }

  // set data from back end
  private setData(data, list) {
    list = data;
    this.equivalenceGrpList = list;
    this.gridReplacementSettings.columnsConfig = this.columnsConfig;
    if (this.listItem) {
      this.listItem.onStateChange({take: 10, skip: 0}, this.equivalenceGrpList);
    }
  }

  ngOnChanges(): void {
    this.GetData();
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
              data.forEach(itemWarehouse => {
                item.ItemWarehouse.push(itemWarehouse);
              });
            }
          }, () => {
          }, () => {
            this.fillAssociatedWarehouseGridData(item.ItemWarehouse, item.ItemWarehouse.length);
          });
      }
    } else {
      this.fillAssociatedWarehouseGridData([], NumberConstant.ZERO);
    }
  }

  private fillAssociatedWarehouseGridData(data: any [], total: number) {
    this.associatedWarehouseGridData = {
      data: data,
      total: total
    };
  }
  public receiveData(event: any) {
    let list;
    const guidItem = new ItemToGetEquivalentList();
    guidItem.Id = this.item.Id;
    guidItem.SearchString = event;
    if (this.isForKit) {
      this.setDataforKit(guidItem, list);
    } else {
      this.setDataforReplacement(guidItem, list);
    }
  }
}
