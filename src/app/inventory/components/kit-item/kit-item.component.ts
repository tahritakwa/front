import { Component, OnInit, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { State, DataResult, process } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ItemKit } from '../../../models/inventory/item-kit.model';
import { Item } from '../../../models/inventory/item.model';

@Component({
  selector: 'app-kit-item',
  templateUrl: './kit-item.component.html',
  styleUrls: ['./kit-item.component.scss']
})
export class KitItemComponent implements OnInit {
  @ViewChild('ListProduct') listProductChild;
  selectedItem: Item;
  formGroup: FormGroup;
  @Input() item: Item;
  public gridData: ItemKit[] = new Array();
  public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: 'Code',
      title: 'REFERENCE',

      filterable: true
    },
    {
      field: 'Description',
      title: 'DESIGNATION',
      filterable: true
    },
    {
      field: 'Quantity',
      title: 'QUANTITY',
      filterable: true
    }
  ];
  public gridKitItemSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(private fb: FormBuilder, public viewRef: ViewContainerRef, private validationService: ValidationService) { }

  /**
  * when change item in dropdown
  * @param $event
  */
  itemSelected($event) {
    if($event){
      this.selectedItem = $event.itemFiltredDataSource.filter(c => c.Id ===
        $event.itemForm.controls["IdItem"].value)[0];
    }
  }

  /**
  * when affect item
  * */
  onAffectItem() {
    if (this.formGroup.valid) {
      if (!this.gridKitItemSettings.gridData) {
        this.gridKitItemSettings.gridData = { data: this.gridData, total: this.gridData.length };
      }
      const itemExist: ItemKit[] = this.gridKitItemSettings.gridData.data.filter(x => x.IdItem == this.selectedItem.Id);
      if (itemExist && itemExist.length > 0) {
        itemExist[0].Quantity++;
      } else {
        const itemKit: ItemKit = new ItemKit();
        itemKit.Code = this.selectedItem.Code;
        itemKit.Description = this.selectedItem.Description;
        itemKit.IdItem = this.selectedItem.Id;
        itemKit.Quantity = 1;
        itemKit.IdKit = this.item.Id;
        this.gridData.push(itemKit);
        this.gridKitItemSettings.gridData = { data: this.gridData, total: this.gridData.length };
        this.dataStateChange(<DataStateChangeEvent>this.gridKitItemSettings.state);
      }

      this.formGroup.get('IdItem').reset();
      this.selectedItem = undefined;
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }

  }






  public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
    if (!isEdited) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroupGrid(dataItem));
    }
  }

  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      const editedItem = this.gridData.filter(x => x.IdItem == dataItem.IdItem);
      if (editedItem && editedItem.length > 0) {
        editedItem[0].Quantity = formGroup.value['Quantity'];
        this.gridKitItemSettings.gridData = { data: this.gridData, total: this.gridData.length };
        this.dataStateChange(<DataStateChangeEvent>this.gridKitItemSettings.state);
      }
    }
  }




  public removeHandler({ dataItem }) {
    const indexOfItemToRemove = this.gridData.indexOf(dataItem);
    if (indexOfItemToRemove != -1) {
      this.gridData.splice(indexOfItemToRemove, 1);
      this.gridKitItemSettings.gridData = { data: this.gridData, total: this.gridData.length };
      this.dataStateChange(<DataStateChangeEvent>this.gridKitItemSettings.state);
    }
  }
  /**
* Data changed listener
* @param state
*/
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridKitItemSettings.state = state;
    const listItemsKit = Object.assign([], this.gridData);
    this.gridKitItemSettings.gridData = process(this.gridData, state);
  }
  createFormGroup() {
    this.formGroup = this.fb.group({
      IdItem: new FormControl('', [Validators.required]),
    });
  }


  public createFormGroupGrid(dataItem: any): FormGroup {
    return this.fb.group({
      'Quantity': [dataItem.Quantity, Validators.required]
    });
  }


  ngOnInit() {
    this.createFormGroup();
    if (this.item && this.item.ItemKitIdKitNavigation && this.item.ItemKitIdKitNavigation.length > 0) {
      this.gridData = this.item.ItemKitIdKitNavigation;
      this.gridKitItemSettings.gridData = { data: this.gridData, total: this.gridData.length };
      this.dataStateChange(<DataStateChangeEvent>this.gridKitItemSettings.state);
    }
  }

}
