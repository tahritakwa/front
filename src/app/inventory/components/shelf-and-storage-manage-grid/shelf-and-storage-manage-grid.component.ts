import { Component, OnInit, Input, ViewChild, ViewContainerRef, Output, EventEmitter, HostListener, OnDestroy,Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GridComponent, PagerSettings, PageChangeEvent } from '@progress/kendo-angular-grid';
import { ItemWarehouse } from '../../../models/inventory/item-warehouse.model';
import { WarehouseItemService } from '../../services/warehouse-item/warehouse-item.service';
import { State, process } from '@progress/kendo-data-query';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { CrudGridService } from '../../../sales/services/document-line/crud-grid.service';
import { DepotDropdownComponent } from '../../../shared/components/depot-dropdown/depot-dropdown.component';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { isBetweenKendoDropdowns } from '../../../shared/helpers/component.helper';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { StockDocumentConstant } from '../../../constant/inventory/stock-document.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
const createFormGroup = dataItem => new FormGroup({
  'Id': new FormControl(dataItem.Id),
  'IdItem': new FormControl(dataItem.IdItem, Validators.required),
  'IdWarehouse': new FormControl(dataItem.IdWarehouse, Validators.required),
  'Item': new FormControl(dataItem.Item),
  'WarehouseName': new FormControl(dataItem.WarehouseName),
  'AvailableQuantity': new FormControl(dataItem.AvailableQuantity),
  'OrderedQuantity': new FormControl(dataItem.OrderedQuantity),
  'Shelf': new FormControl(dataItem.Shelf),
  'Storage': new FormControl(dataItem.Storage),
  'NewStorage': new FormControl(dataItem.NewStorage, Validators.pattern('^[A-Z|a-z]{1,2}.{3}')),
});
export const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);

@Component({
  selector: 'app-shelf-and-storage-manage-grid',
  templateUrl: './shelf-and-storage-manage-grid.component.html',
  styleUrls: ['./shelf-and-storage-manage-grid.component.scss']
})
export class ShelfAndStorageManageGridComponent implements OnInit, OnDestroy {
  public FormatNumber = SharedConstant.NUMBER_FORMAT;
  @Input() selfStorageForm: FormGroup;
  @ViewChild(GridComponent) private grid: GridComponent;
  @ViewChild(DepotDropdownComponent) childWerehouse;
  @Output() selectNewStorageSet = new EventEmitter<any>();
  selectNewStorageValue: string;
  formGroup: FormGroup;
  itemToBeRemoved: boolean;
  selectedRow: any;
  editedRowIndex: number;
  public newStorage;
  isNew: boolean;
  public skip = 0;
  public pageSize = 20;
  public newStorageData: any[];
  public allNewStorageData: any[];
  public allowCustom: boolean;
  public gridObject;
  public itemToSearch;
  private isSelected: boolean;
  private isRemoveAction: boolean;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public gridState: State = {
    skip: 0,
    take: 20
  };
  public gridSettings: GridSettings = {
    state: this.gridState
  };
  public wrongPattern = false;
  public haveLines = false;
  public docClickSubscription: any;
  public haveNewLine = false ;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === KeyboardConst.ESCAPE) {
      this.closeEditor();
    }
    let selectedIndex: number;
    let OpenLineIndex: number;
    // get data from grid
    const dataGrid = this.grid.data as { data, total };
    if (dataGrid) {
      this.callNexTLine(dataGrid, event, selectedIndex, OpenLineIndex);
    }
  }
  callNexTLine(dataGrid, event, selectedIndex, OpenLineIndex) {
    if (event.path[2] && this.editedRowIndex >= 0 && !isBetweenKendoDropdowns(event)) {
      if (event.key === KeyboardConst.ARROW_DOWN &&
        event.path[2].sectionRowIndex < dataGrid.data.length - 1) {

        // get next index
        selectedIndex = event.path[2].sectionRowIndex + 1;
        OpenLineIndex = this.editedRowIndex + 1;

        this.moveToNexLine(selectedIndex, dataGrid, OpenLineIndex);
      } else if (event.key === KeyboardConst.ARROW_UP && event.path[2].sectionRowIndex > 0) {

        // get previous index
        selectedIndex = event.path[2].sectionRowIndex - 1;
        OpenLineIndex = this.editedRowIndex - 1;
        this.moveToNexLine(selectedIndex, dataGrid, OpenLineIndex);

        // if it is the first or last line at the grid
      } else if ((event.key === KeyboardConst.ARROW_DOWN || event.key === KeyboardConst.ARROW_UP)) {
        this.saveCurrent();
      }
    }
  }
  moveToNexLine(selectedIndex: number, dataGrid: any, OpenLineIndex: number) {
    this.gridObject = { isEdited: false, dataItem: dataGrid.data[selectedIndex], rowIndex: OpenLineIndex };
    this.cellClickHandler(this.gridObject);
  }

  constructor(public viewRef: ViewContainerRef, private itemWarehouseService: WarehouseItemService,
    public validationService: ValidationService, public crudGridService: CrudGridService,
    private translate: TranslateService, private growlService: GrowlService,  private renderer: Renderer2,
    private swalWarrings: SwalWarring) { }

  public dataStateChange(state: State) {
    if(this.haveNewLine){
      const swalWarningMessage = `${this.translate.instant(StockDocumentConstant.LOSE_NEW_LINES)}`;
    const swalWarningTitle = `${'Alerte'}`;
      this.swalWarrings.CreateSwalYesOrNo(swalWarningMessage,
        swalWarningTitle, 'Oui', 'Non').then((result) => {
          if (result.value) {
            this.gridState = state;
            this.gridSettings.state = this.gridState;
            this.generateData(state);
            }
          });
          } else {
            this.gridState = state;
              this.gridSettings.state = this.gridState;
              this.generateData(state);
          }
    }
    

  searchValue() {
    this.cancelHandler();
    this.loadItems();
  }

  // page change
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
    this.loadItems();
  }

  setWarehouseIfSalesDocument() {
    /**get warhouse values */
    if (this.childWerehouse) {
      this.childWerehouse.warehouseFiltredDataSource = [];
      this.childWerehouse.ChangeVagetItemValue(this.formGroup.controls['IdItem'].value);
      this.formGroup.controls['IdWarehouse'].enable();
      let central = this.childWerehouse.getCentralWarehouse();
      this.formGroup.controls['IdWarehouse'].setValue(central.Id);
      this.formGroup.controls['WarehouseName'].setValue(central.WarehouseName);
    }
  }
  // get grid data source
  public generateData(state?) {
    if(!state){
      this.skip = 0;
      this.pageSize = 20;
      this.gridState.take = 20;
      this.gridState.skip = 0;
      this.gridState.sort = [{field:'Id', dir:'desc'}];
      this.gridState.group = [];
    }
    state = this.gridState;
 
    if (this.selfStorageForm.valid) {
      const itemWarhouse = new ItemWarehouse(this.selfStorageForm.controls['IdWarehouse'].value, 0,
        this.selfStorageForm.controls['oldStorage'].value,
        this.selfStorageForm.controls['shelf'].value); 
        if(itemWarhouse.Shelf == this.translate.instant(StockDocumentConstant.Unaffected)){
          itemWarhouse.Shelf="";
        }
        this.haveNewLine = false;
      this.itemWarehouseService.generateItemsFromShelfAndStorage(state, itemWarhouse).subscribe(data => {
        this.ngOnDestroy();

        if (data.listData.length > 0) {
          this.haveLines = true;
        } else {
          this.haveLines = false;
        }
        data.listData.forEach((element: ItemWarehouse) => {
          if(element.Shelf){
          element.NewStorage = element.Shelf.concat(element.Storage);
          }
          else
          {
            element.NewStorage=null;
          }
          this.crudGridService.saveData(element, true, 'anyData');
        });
        this.loadItems();
      });
    } else {
      this.validationService.validateAllFormFields(this.selfStorageForm);
    }
  }
  // fornt end paging
  private loadItems(linesDeletedNumber?: number) {
   

    if (this.itemToSearch) {
      let data = this.crudGridService.anyData.filter((s) => s.Item.toLowerCase().indexOf(this.itemToSearch.toLowerCase()) !== -1);
      this.setDataToGrid(data);
    } else {
      if (this.itemToBeRemoved) {
        if (linesDeletedNumber && linesDeletedNumber >= 0 && this.gridSettings.gridData.data.length - linesDeletedNumber <= 0 &&
          this.gridSettings.state.skip > 0) {
          this.gridSettings.state.skip = this.gridSettings.state.skip - this.gridSettings.state.take;
          this.skip = this.gridSettings.state.skip;
        }
        this.itemToBeRemoved = false;
      }
      this.gridSettings.gridData = {
        data: this.crudGridService.anyData.reverse().slice(this.skip, this.skip + this.pageSize),
        total: this.crudGridService.anyData.length
      };
      if (this.gridSettings.gridData.total > 0) {
        this.haveLines = true;
      } else {
        this.haveLines = false;
      }
    }
  }
  private setDataToGrid(data) {
    this.gridSettings.gridData = {
      data: data,
      total: data.length
    };
  }
  public ChangeItemStorage() {
    this.itemWarehouseService.ChangeItemStorage(this.gridSettings.gridData.data).subscribe();
  }

  public cellClickHandler({ isEdited, dataItem, rowIndex }): void {
    if ((isEdited || (this.formGroup && !this.formGroup.valid)) || this.itemToBeRemoved) {
      this.itemToBeRemoved = false;
      return;
    }
    if (!this.formGroup) {
      this.editOperation({ isEdited, dataItem, rowIndex });
    } else {
      if (this.formGroup && this.formGroup.valid) {
        this.saveCurrent();
        this.editOperation({ isEdited, dataItem, rowIndex });
      } else {
        this.validationService.validateAllFormFields(this.formGroup);
      }
    }
    this.gridObject = undefined;
  }
  private editOperation({ isEdited, dataItem, rowIndex }) {
    if (!this.isRemoveAction) {
      this.formGroup = createFormGroup(dataItem);
      this.editedRowIndex = rowIndex;
      this.isSelected = true;
      this.grid.editRow(rowIndex, this.formGroup);
    }
  }
  public cancelHandler(): void {
    this.closeEditor();
  }
  public saveCurrent(openNew?: boolean): void {
    if (this.formGroup && this.formGroup.valid) {
      if (!(this.crudGridService.anyData.filter((x) => x.IdItem === this.formGroup.controls['IdItem'].value).length > 0 && this.isNew)) {
        this.crudGridService.saveData(this.formGroup.getRawValue(), this.isNew, 'anyData');
        this.itemWarehouseService.ChangeOneItemtorage(this.formGroup.getRawValue()).subscribe();
        this.loadItems();
        this.closeEditor();
        this.haveNewLine = true ;
        if (openNew) {
          this.addHandler();
        }
      } else {
        this.growlService.warningNotification(this.translate.instant('IETM_ALREADY_EXIST'));
        this.closeEditor();
      }
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }
  public addHandler(): void {
    this.closeEditor();
    this.formGroup = createFormGroup({
      'Id': 0,
      'IdItem': undefined,
      'IdWarehouse': this.selfStorageForm.controls['IdWarehouse'].value,
      'Item': '',
      'WarehouseName': '',
      'AvailableQuantity': 0,
      'OrderedQuantity': 0,
      'Shelf': '',
      'Storage': this.selfStorageForm.controls['oldStorage'].value,
      'NewStorage': this.selfStorageForm.controls['newStorage'].value,
    });
    this.isNew = true;
    this.grid.addRow(this.formGroup);
    this.formGroup.controls['IdWarehouse'].disable();
    this.gridObject = undefined;
  }
  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.isNew = false;
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.gridObject = undefined;
    this.isSelected = false;
  }

  removeLine({ isEdited, dataItem, rowIndex, sender }) {
    this.isRemoveAction = true;
    this.swalWarrings.CreateSwal().then((result) => {
      this.isRemoveAction = false;
      if (result.value) {
    this.itemToBeRemoved = true;
        this.crudGridService.anyData.splice(rowIndex, 1);
        this.closeEditor();
    this.loadItems(1);
      }
    });
  }
  public itemSelectGrid($event) {
    this.isSelected = false;
    this.formGroup.controls['IdWarehouse'].setValue(undefined);
    if (this.formGroup.controls['IdItem'].value) {
      let itemSelectedValue = $event.itemDataSource.filter(x => x.Id == this.formGroup.controls['IdItem'].value);
      if (itemSelectedValue) {
        this.formGroup.controls['Item'].setValue(itemSelectedValue[0].Code + ' - ' + itemSelectedValue[0].Description);
        this.setWarehouseIfSalesDocument();
      }
      
    }
    if (this.formGroup.controls['IdItem'].value && this.formGroup.controls['IdWarehouse'].value) {
      this.itemWarehouseService.getItemWarehouseData(this.formGroup.getRawValue()).subscribe(data => {
        this.setData(data);
      });
    }
  }
  public warehouseSelectGrid($event) {
    if ($event) {
      if($event.combobox.dataItem)
      {
        this.formGroup.controls['WarehouseName'].setValue($event.combobox.dataItem.WarehouseName);
      }
      
      if (this.formGroup.controls['IdItem'].value && this.formGroup.controls['IdWarehouse'].value) {
        this.itemWarehouseService.getItemWarehouseData(this.formGroup.getRawValue()).subscribe(data => {
          this.setData(data);
        });
      }
    }
  }
  private setData(data) {
    this.isSelected = true;
    this.formGroup.patchValue(data);
    this.formGroup.controls['NewStorage'].setValue(data.Shelf.concat(data.Storage));
  }
  selectNewStorage() {
    const regex = new RegExp('^[A-Z|a-z]{1,2}.{3}$');
    this.selectNewStorageSet.emit(this.selectNewStorageValue);
    if (regex.test(this.selectNewStorageValue)) {
      this.wrongPattern = false;
      this.crudGridService.anyData.forEach(x => {
        x.NewStorage = this.selectNewStorageValue;
      });
      this.loadItems();
    } else {
      this.wrongPattern = true;
    }
  }
  ngOnInit() {
    this.crudGridService.anyData = [];
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
  }
  public ngOnDestroy(): void {
    this.crudGridService.anyData = [];
    this.gridSettings.gridData = {
      data: [],
      total: 0
    };
  }

  filterNewStorage($event) {
    this.newStorageData = this.allNewStorageData.filter(x => x.toUpperCase().indexOf($event.toUpperCase()) != -1);
  }
  public onDocumentClick(e: any): void {
    if (!matches(e.target,
      'tbody *, .k-grid-toolbar .k-button, .k-grid-add-command, .k-link, .input-checkbox100, .label-checkbox100, .k-button.k-button-icon')
      && (e.target.parentElement && !matches(e.target.parentElement,
        '.k-grid-add-command, .k-animation-container, .k-animation-container-show, k-popup k-list-container k-reset'))
      && (e.composedPath().filter(x => x.tagName === 'MODAL-DIALOG').length === 0 &&
        e.composedPath().filter(x => x.className === 'modal').length === 0)
      && !e.target.className.includes('swal')) {
      this.cancelHandler();
    }
  }
}
