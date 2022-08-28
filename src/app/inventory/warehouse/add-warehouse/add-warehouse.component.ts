import { Component, OnInit, ViewContainerRef, Output, EventEmitter, ViewChild , DoCheck } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WarehouseService } from '../../services/warehouse/warehouse.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationKeysConstant } from '../../../constant/shared/translation-keys.constant';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { PopupAddWarehouseComponent } from '../popup-add-warehouse/popup-add-warehouse.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ItemService } from '../../services/item/item.service';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { Item } from '@progress/kendo-angular-grid/dist/es2015/data/data.iterators';
import { PredicateFormat, Relation, Filter, Operation } from '../../../shared/utils/predicate';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { WarehouseConstant } from '../../../constant/inventory/warehouse.constant';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ListProductsComponent } from '../../../shared/components/item/list-item/list-products.component';

@Component({
  selector: 'app-add-warehouse',
  templateUrl: './add-warehouse.component.html',
  styleUrls: ['./add-warehouse.component.scss']
})
export class AddWarehouseComponent implements OnInit, DoCheck {
  @ViewChild(ListProductsComponent) listProduct: ListProductsComponent;

  public selectedKeys: any[] = ['0'];
  public selectedItemToOpen: any = [];
  warehouseForm: FormGroup;
  public data: any[];
  isSelected: boolean = true;
  isToInitProductList = false;
  public parsedData: any[] = this.data;
  public codeSelectedItem: string;
  public nameSelectedItem: string;
  public adressSelectedItem: string;
  public typeSelectedItem: string;
  public responsibleSelectedItem: string;
  public classSelectedItem: string;
  public searchText: string;

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  public gridSettings: GridSettings = {
    state: this.itemService.gridState,
    columnsConfig: this.itemService.columnsConfig
  };
  public groups: GroupDescriptor[];
  public isCollapsed = false;

  @Output()
  itemEvent = new EventEmitter<Item>();
  public predicate: PredicateFormat;
  public showTab = false;
  constructor(public warehouseService: WarehouseService, public translate: TranslateService,
    private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef,
    private swalWarrings: SwalWarring, public itemService: ItemService) {
    this.preparePrediacte();
  }
  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId) {
      this.showTab = true;
    }
  }

  /**
 * Load item warhouse related to the item
 * @param event
 */
  public loadWarehousDetails(event: any) {
    this.itemService.loadWarhouseDetails(event, false, this.selectedItemToOpen[WarehouseConstant.ITEM].Id);
  }

  /**
 * Select row
 * @param event
 */
  public selectRow(event: any) {
    if (this.isCollapsed && event.selectedRows[0] && event.selectedRows[0].dataItem) {
      this.itemEvent.emit(event.selectedRows[0].dataItem);
    }

  }

  /**
   * Filter grid of item
   * @param filterString
   * @param isRef
   */
  public filter(filterString: string, isRef?: boolean) {
    this.preparePrediacte(filterString);
    this.initGridOfItemDataSource();
  }

  /**
 * @param groups
 */
  public groupChange(groups: GroupDescriptor[]): void {
    this.groups = groups;
    this.initGridOfItemDataSource();
  }

  /**
 * data state change
 * @param state
 */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.initGridOfItemDataSource();

  }

  /**
   * init predicate filter
   * */
  private preparePrediacte(reference?: string): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    if (reference) {
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(new Filter(WarehouseConstant.CODE, Operation.contains, reference));
    }
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ItemConstant.NATURE_NAVIGATION)]);
  }

  /**
 *
 * init data source
 * */
  initGridOfItemDataSource() {
    this.itemService.getItemsListByWarehouse(this.gridSettings.state, undefined, this.selectedItemToOpen[WarehouseConstant.ITEM].Id).
      subscribe(result => {
        this.gridSettings.gridData = result;
      });
  }

  /**
   * Add new element
   * @param isUpdateMode
   */
  public addNew(isUpdateMode: boolean) {
    this.selectedItemToOpen[WarehouseConstant.IS_UPDATE_MODE] = isUpdateMode;
    // Prepare title by the boolean isUpdateMode
    const title = isUpdateMode ? TranslationKeysConstant.EDIT_WAREHOUSE_ZONE : TranslationKeysConstant.ADD_WAREHOUSE_ZONE;
    // Open modal dialog ==> refresh the treeView
    this.formModalDialogService.openDialog(title, PopupAddWarehouseComponent,
      this.viewRef, this.initGridDataSource.bind(this, true), this.selectedItemToOpen);
  }

  /**
   * On key up in search input
   * @param value
   * @param isFromPopup
   */
  public onkeyup(value: string, isFromPopup?: boolean): void {
    this.searchText = value;
    // Search value in treeview
    this.parsedData = this.search(this.data, value);
    /* If returned list not null ==> [If action from on close modal ==> select the edited or added element
     * else if action of search from input ==> select central element] */
    if (this.parsedData.length > 0) {
      document.getElementById(WarehouseConstant.DIV_BUTTON_EDIT).setAttribute(WarehouseConstant.CLASS, '');
      document.getElementById(WarehouseConstant.DIV_BUTTON_ADD).setAttribute(WarehouseConstant.CLASS, '');
      if (!isFromPopup) {
        // Action of search from input ==> select central element
        this.selectedKeys = ['0'];
        this.showDetails(this.data[0]);

      } else {
        // Action from on close modal ==> select the edited or added element
        this.showDetailsItemFromListOfData(this.selectedItemToOpen[WarehouseConstant.ITEM] ?
          this.selectedItemToOpen[WarehouseConstant.ITEM].WarehouseCode : this.parsedData[0].WarehouseCode, this.data);
        if (this.selectedItemToOpen[WarehouseConstant.ITEM].IsWarehouse && !this.selectedItemToOpen[WarehouseConstant.ITEM].IsCentral) {
          document.getElementById(WarehouseConstant.DIV_BUTTON_ADD).setAttribute(WarehouseConstant.CLASS, WarehouseConstant.DISABLED_DIV);
        }
      }
      this.isSelected = true;
    } else {
      // Disable div of edit and add button
      document.getElementById(WarehouseConstant.DIV_BUTTON_EDIT).setAttribute(WarehouseConstant.CLASS, WarehouseConstant.DISABLED_DIV);
      if (value !== '') {
        document.getElementById(WarehouseConstant.DIV_BUTTON_ADD).setAttribute(WarehouseConstant.CLASS, WarehouseConstant.DISABLED_DIV);
      } else {
        document.getElementById(WarehouseConstant.DIV_BUTTON_ADD).setAttribute(WarehouseConstant.CLASS, '');
      }
      this.isSelected = false;
    }
  }

  /**
   * Search items
   * @param Items
   * @param term
   */
  public search(Items: any[], term: string): any[] {
    return Items.reduce((acc, item) => {
      if (this.contains(item.Text, term)) {
        acc.push(item);
      } else if (item.Items && item.Items.length > 0) {
        const newItems = this.search(item.Items, term);
        // Return list of details of elements
        if (newItems.length > 0) {
          acc.push({
            Id: item.Id,
            Text: item.Text,
            Items: newItems,
            IsCentral: item.IsCentral,
            IsWarehouse: item.IsWarehouse,
            WarehouseCode: item.WarehouseCode,
            WarehouseName: item.WarehouseName,
            WarehouseAdresse: item.WarehouseAdresse,
            IdResponsableNavigation: item.IdResponsableNavigation
          });
        }
      }

      return acc;
    }, []);
  }
  /**
   * Return if Text Contains term
   * @param Text
   * @param term
   */
  public contains(Text: string, term: string): boolean {
    return Text.toLowerCase().indexOf(term ? term.toLowerCase() : '') >= 0;
  }

  showDetailsItemFromListOfData(code: string, listOfData) {
    const ctrl = this;
    listOfData.forEach(function (value) {
      if (value.WarehouseCode === code) {
        ctrl.showDetails(value);
      } else {
        if (value.Items) {
          ctrl.showDetailsItemFromListOfData(code, value.Items);
        }
      }
    });
  }
  /**
   * Specifie icon to Show
   * @param param0
   */
  public iconClass({ IsCentral, IsWarehouse }: any): any {
    if (IsCentral) {
      return WarehouseConstant.FA_BUILDING;
    } else if (!IsWarehouse) {
      return WarehouseConstant.FA_MAP_MARKER;
    } else {
      return WarehouseConstant.FA_UNIVERSITY;
    }
  }

  deleteWarehouse(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.warehouseService.remove(dataItem).subscribe(() => {
          this.initGridDataSource(false);
        });
      }
    });
  }

  /**
   * Event on select
   * @param param0
   */
  public handleSelection({ index, dataItem }: any): void {
    // Selected key
    this.selectedKeys = [index];
    // If selected element is a warehouse ==> disable add button
    if (dataItem.IsWarehouse && !dataItem.IsCentral) {
      document.getElementById(WarehouseConstant.DIV_BUTTON_ADD).setAttribute(WarehouseConstant.CLASS, WarehouseConstant.DISABLED_DIV);
    } else {
      document.getElementById(WarehouseConstant.DIV_BUTTON_ADD).setAttribute(WarehouseConstant.CLASS, '');
    }
    // Show details of selected element
    this.showDetails(dataItem);
  }

  /**
 * Retreive the data from the server
 */
  initGridDataSource(isToRefresh) {
    this.warehouseService.getWarehouseList().subscribe(res => {
      this.data = res;
      this.parsedData = res;
      // if is not juste to refresh ==> select central element and show details of central
      if (res.length > 0 && !isToRefresh) {
        this.showDetails(res[0]);
      }
      // If list of warehouse empty
      if (res.length === 0) {
        // Disable edit button
        document.getElementById(WarehouseConstant.DIV_BUTTON_EDIT).setAttribute(WarehouseConstant.CLASS, WarehouseConstant.DISABLED_DIV);
        // Do not show details
        this.isSelected = false;
      }
      // If is juste refresh ==> select last selected element
      if (isToRefresh) {
        this.onkeyup(this.searchText, true);

      }
    }
    );
  }

  /**
   * Show detail of selected element
   * @param selectedItem
   */
  showDetails(selectedItem): void {
    this.codeSelectedItem = selectedItem.WarehouseCode;
    this.nameSelectedItem = selectedItem.WarehouseName;
    this.adressSelectedItem = selectedItem.WarehouseAdresse;
    if (selectedItem.IsCentral) {
      this.typeSelectedItem = this.translate.instant(WarehouseConstant.CENTRAL);
      this.classSelectedItem = WarehouseConstant.FA_BUILDING;
    } else if (selectedItem.IsWarehouse) {
      this.typeSelectedItem = this.translate.instant(WarehouseConstant.WAREHOUSE);
      this.classSelectedItem = WarehouseConstant.FA_UNIVERSITY;
    } else {
      this.typeSelectedItem = this.translate.instant(WarehouseConstant.ZONE);
      this.classSelectedItem = WarehouseConstant.FA_MAP_MARKER;
    }
    this.responsibleSelectedItem = selectedItem.IdUserResponsableNavigation ?
      selectedItem.IdUserResponsableNavigation.LastName.concat(' '.concat(selectedItem.IdUserResponsableNavigation.FirstName)) : '';
    this.selectedItemToOpen[WarehouseConstant.ITEM] = selectedItem;
    if (this.listProduct) {
      this.listProduct.selectedItemToOpen = this.selectedItemToOpen;
      this.listProduct.initGridDataSource();
    } else {
      this.isToInitProductList = true;
    }
  }


  ngOnInit() {
    this.initGridDataSource(false);
  }



  ngDoCheck() {
    this.checkAndInitListProduct();
  }
  checkAndInitListProduct() {
    if (this.isToInitProductList && this.listProduct) {
      this.isToInitProductList = false;
      this.listProduct.selectedItemToOpen = this.selectedItemToOpen;
      this.listProduct.initGridDataSource();
    }
  }
}
