import { FormControl, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Filter, Operation, PredicateFormat, Relation } from '../../utils/predicate';
import { Warehouse } from '../../../models/inventory/warehouse.model';
import { WarehouseItemService } from '../../../inventory/services/warehouse-item/warehouse-item.service';
import { WarehouseService } from '../../../inventory/services/warehouse/warehouse.service';
import { ItemWarehouse } from '../../../models/inventory/item-warehouse.model';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { WarehouseConstant } from '../../../constant/inventory/warehouse.constant';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { NumberConstant } from '../../../constant/utility/number.constant';

const WAREHOUSE_PARENT_NAVIGATION = 'InverseIdWarehouseParentNavigation';
const COUNT = 'Count';
const GET_PREDICATE = 'getDataDropdownWithPredicate';
const WAREHOUSE_FOR_INVENTORY = 'getWarehouseDropdownForInventory';
const WAREHOUSE_FOR_ECOMMERCE = 'getWarehouseDropdownForEcommerce';

@Component({
  selector: 'app-depot-dropdown',
  templateUrl: './depot-dropdown.component.html',
  styleUrls: ['./depot-dropdown.component.scss']
})
export class DepotDropdownComponent implements OnInit, DropDownComponent {
  @ViewChild('combobox') combobox: ComboBoxComponent;
  @Input() parent: FormGroup;
  @Input() FromComponent: boolean;
  @Input() disabled: boolean;
  @Input() allowCustom;
  @Input() SelectedValue: number;
  @Input() isCentralNotInList: boolean;
  @Input() warehouseForInventoryDocument: boolean;
  @Input() warehouseForEcommerceDocument: boolean;
  @Input() isCentralWarehouseSelectedByDefault: boolean;
  @Input() isInDocument: boolean;
  @Input() isUpdateDocument = false;
  @Input() idItem: number;
  @Input() placeholder: string;
  @Input() isShelfAndStorage = false;
  @Input() isWarehouseDropdownTypeDepotAndCentral = false;
  @Input() isWarehouseDropdownTypeZoneAndCentral = false;
  @Input() Required: boolean;
  @Input() hasDefaultWarehouse: boolean;
  @Input() idWarehouse: number;
  @Input() selectedWarehouseFromItemDropDown;

  public warehouseDataSource: Warehouse[];
  public warehouseDataSourceFiltred: Warehouse[];
  public listOfAllWarehouseDataSource: Warehouse[];
  predicate: PredicateFormat;
  @Output() Selected = new EventEmitter<any>();
  @Output() Focused = new EventEmitter<boolean>();
  Warehouse: any[];
  @Input() WarehouseName = WarehouseConstant.ID_WAREHOUSE;
  WarehouseSelected;
  public isInit = true;
  @ViewChild(ComboBoxComponent) depotComboBoxComponent: ComboBoxComponent;
  @Input() onlyWarehouse = false;
  newValue: any;

  constructor(private warehouseService: WarehouseService, private warehouseItemService: WarehouseItemService) {
  }

  get depotPlaceHolder() {
    return (this.placeholder != null && this.placeholder != undefined && this.placeholder != '') ?
      this.placeholder : 'CHOOSE_WAREHOUSE';
  }

  preparePredicate(IdWarehouse?: any[]) {
    const WAREHOUSE_PARENT_NAVIGATION_COUNT = `${WAREHOUSE_PARENT_NAVIGATION}.${COUNT}`;
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (this.isCentralNotInList) {
      this.predicate.Filter.push(new Filter(WarehouseConstant.IS_CENTRAL, Operation.neq, true));
    } else {
      if (this.isCentralWarehouseSelectedByDefault) {
        this.predicate.Filter.push(new Filter(WarehouseConstant.IS_CENTRAL, Operation.eq, true));
      }
    }
    if (this.onlyWarehouse) {
      this.predicate.Filter.push(new Filter(WarehouseConstant.IS_WAREHOUSE, Operation.eq, true));
    }
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(WAREHOUSE_PARENT_NAVIGATION)]);
  }

  ngOnInit() {
    if (this.isInDocument !== true) {
      this.initDataSource();
      this.WarehouseSelected = this.SelectedValue;
    }
    if (this.isUpdateDocument) {
      this.ChangeVagetItemValue(this.idItem);
    }
  }

  get IdWarehouse(): FormControl {
    return this.parent.get(WarehouseConstant.ID_WAREHOUSE) as FormControl;
  }

  preparePredicateForDocument(IdItem?: number) {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(WarehouseConstant.ID_ITEM, Operation.eq, IdItem));
    this.predicate.Filter.push(new Filter(WarehouseConstant.IS_WAREHOUSE, Operation.eq, true));
    if (this.isCentralNotInList) {
      this.predicate.Filter.push(new Filter(WarehouseConstant.ID_WAREHOUSE_NAVIGATION_IS_CENTRAL, Operation.neq, true));
    }
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(WarehouseConstant.ID_WAREHOUSE_NAVIGATION)]);
  }

  ChangeVagetItemValue(idItem: number) {
    if (idItem !== null && idItem !== undefined) {
      this.preparePredicateForDocument(idItem);
      this.warehouseItemService.callPredicateData(this.predicate).subscribe(data => {
        this.warehouseDataSourceFiltred = new Array<Warehouse>();
        this.warehouseDataSource = data;
        (data as ItemWarehouse[]).forEach(obj => {
          this.warehouseDataSourceFiltred.push(obj.IdWarehouseNavigation);
        });
      });
    }
  }

  public initDataSource(): void {
    this.preparePredicate();
    const api = (this.warehouseForInventoryDocument) ? WAREHOUSE_FOR_INVENTORY :
      (this.warehouseForEcommerceDocument) ? WAREHOUSE_FOR_ECOMMERCE : GET_PREDICATE;
    this.warehouseService.callPredicateData(this.predicate, api).subscribe(data => {
      this.warehouseDataSource = data;
      this.listOfAllWarehouseDataSource = data;
      if (this.hasDefaultWarehouse && this.idWarehouse) {
        this.parent.controls[this.WarehouseName].setValue(this.idWarehouse);
        this.onSelect(this);
      } else if (this.isCentralWarehouseSelectedByDefault) {
        const idCentralWarehouse = data.find(x => x.IsCentral === true).Id;
        this.parent.controls[this.WarehouseName].setValue(idCentralWarehouse);
        this.onSelect(this);
      }
      this.warehouseDataSourceFiltred = this.warehouseDataSource.slice(0);
      if (this.selectedWarehouseFromItemDropDown && !this.hasDefaultWarehouse) {
        this.warehouseDataSourceFiltred = this.warehouseDataSourceFiltred.filter(x => x.Id == this.selectedWarehouseFromItemDropDown);
      }
    }, () => { },
      () => {
        this.loadIsWarehouse();
      });
  }

  /**
   * case view is add shelf&storage  --> show only depot warehouse
   * @private
   */
  private loadIsWarehouse() {
    if (this.isWarehouseDropdownTypeDepotAndCentral || this.isWarehouseDropdownTypeZoneAndCentral) {
      this.warehouseDataSourceFiltred = this.listOfAllWarehouseDataSource.filter(warehouse => !warehouse.IsWarehouse
         || warehouse.IsCentral);
    } else if (this.isShelfAndStorage) {
      this.warehouseDataSourceFiltred = this.listOfAllWarehouseDataSource.filter(warehouse => warehouse.IsWarehouse || warehouse.IsCentral);
    }
  }


  handleFilter(value: string): void {
    const valueFilter = value ? value.toLowerCase() : value;
    if (this.isShelfAndStorage) {
      this.listOfAllWarehouseDataSource =
        this.listOfAllWarehouseDataSource.filter(warehouse => warehouse.IsWarehouse || warehouse.IsCentral);
      this.warehouseDataSourceFiltred = this.listOfAllWarehouseDataSource.filter((s) =>
        s.WarehouseCode.toLowerCase().includes(valueFilter) || s.WarehouseName.toLocaleLowerCase().includes(valueFilter));
    } else {
      this.warehouseDataSourceFiltred = this.warehouseDataSource.filter((s) =>
        s.WarehouseCode.toLowerCase().includes(valueFilter) || s.WarehouseName.toLocaleLowerCase().includes(valueFilter));
      if (this.selectedWarehouseFromItemDropDown && !this.hasDefaultWarehouse) {
        this.warehouseDataSourceFiltred = this.warehouseDataSourceFiltred.filter(x => x.Id == this.selectedWarehouseFromItemDropDown);
      }
    }
  }

  addNew(): void {
    throw new Error('Method not implemented.');
  }

  onSelect(event) {
    if (typeof (event) === 'number') {
      this.newValue = event;
    }
    this.Selected.emit(this);
    this.newValue = undefined;

  }

  public onFocus(event): void {
    this.Focused.emit(event);
  }

  public getCentralWarehouse(): Warehouse {
    let centralWarehouse: Warehouse;
    if (this.listOfAllWarehouseDataSource && this.listOfAllWarehouseDataSource.length > 0) {
      centralWarehouse = this.listOfAllWarehouseDataSource.find(x => x.IsCentral);
    }
    return centralWarehouse;
  }

  public getSelectedWarehouse() : Warehouse {
    let selectedWarehouse: Warehouse;
    if (this.listOfAllWarehouseDataSource && this.listOfAllWarehouseDataSource.length > 0) {
      selectedWarehouse = this.listOfAllWarehouseDataSource.find(x => x.Id === this.SelectedValue);
    }
    return selectedWarehouse;
  }

}
