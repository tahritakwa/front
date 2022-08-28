import {Component, OnInit, ViewChild, Output, EventEmitter, ViewEncapsulation, Input, ElementRef, ViewChildren} from '@angular/core';
import {StockDocumentsService} from '../../services/stock-documents/stock-documents.service';
import {PagerSettings, GridComponent, DataStateChangeEvent, RowClassArgs, RowArgs} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {StockDocumentConstant} from '../../../constant/inventory/stock-document.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ValidationService, isNumeric, digitsAfterComma} from '../../../shared/services/validation/validation.service';
import {KeyboardConst} from '../../../constant/keyboard/keyboard.constant';
import {SearchConstant} from '../../../constant/search-item';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {isNullOrUndefined} from 'util';
import {ItemService} from '../../services/item/item.service';
import {StockDocumentLine} from '../../../models/inventory/stock-document-line.model';
import {InventoryDocument} from '../../../models/inventory/inventory-document.model';
import {PredicateFormat, Operation, Filter, Relation} from '../../../shared/utils/predicate';
import {GridCellInputTemplateComponent} from '../../../shared/components/grid-cell-input-template/grid-cell-input-template.component';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { UserService } from '../../../administration/services/user/user.service';

@Component({
  selector: 'app-inventory-details-list',
  templateUrl: './inventory-details-list.component.html',
  styleUrls: ['./inventory-details-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class InventoryDetailsListComponent implements OnInit {
  @ViewChild(GridComponent) private grid: GridComponent;
  @ViewChildren(GridCellInputTemplateComponent) public inputs;
  @Output() prepareList = new EventEmitter<any>();
  @Output() footerDisable = new EventEmitter<any>();
  @Output() editingItem = new EventEmitter<any>();
  @Input() isValidated = true;
  @Input() validDocumentRole;
  @Input() secondUserName;
  @Input() firstUserName;
  @Input() form: FormGroup;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  formGroup: FormGroup;
  private editedRowIndex: number;
  keyAction;
  enterAction;
  private isNew: boolean;
  showErrorMessage: boolean;
  public selectedItem: number;
  description: string;
  isBtnClicked = false;
  public selectedElement: StockDocumentLine;
  public savedLine: StockDocumentLine;
  articleReference = '';
  public FormatNumber = SharedConstant.NUMBER_FORMAT;
  IdUserInput1: number;
  IdUserInput2: number;
  UserId: number;
  public mySelection: StockDocumentLine[] = [];
  predicate: PredicateFormat;
  IsDefaultValue: any;
  IsOnlyAvailableQuantity: any;
  selectedcol = 0;
  public format;
  public mySelectionKey(context: RowArgs): StockDocumentLine {
    return context.dataItem;
  }

  constructor(private formBuilder: FormBuilder, public itemService: ItemService, public validationService: ValidationService,
              public stockDocumentsService: StockDocumentsService, private modalService: ModalDialogInstanceService,
    private localStorageService: LocalStorageService, private userService : UserService) {
    this.keyAction = (event) => {
      const keyName = event.key;
      /*escape keyboard click */
      if (keyName === KeyboardConst.ESCAPE) {
        this.closeEditor();
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);

  }

  ngOnInit() {
    this.userService.getByEmail(this.localStorageService.getUser().Email).subscribe(user => {
      this.UserId = user.Id;
    });
    
    this.IdUserInput1 = this.stockDocumentsService.inventoryMovementForm.controls.IdInputUser1.value;
    this.IdUserInput2 = this.stockDocumentsService.inventoryMovementForm.controls.IdInputUser2.value;
    this.IsDefaultValue = this.stockDocumentsService.inventoryMovementForm.controls.IsDefaultValue.value;
    this.IsOnlyAvailableQuantity = this.stockDocumentsService.inventoryMovementForm.controls.IsOnlyAvailableQuantity.value;
  }

  /*
* verify if the grid is in editing mode
*/
  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }


  /**
   * create add form
   * */
  private createLineFormGroup(dataItem, rowIndex): void {
    if(dataItem){
    this.formGroup = this.formBuilder.group({
      Id: [{value: dataItem.Id, disabled: true}],
      IdLine: [{value: rowIndex, disabled: true}],
      Code: [
        {value: isNullOrUndefined(dataItem.IdItemNavigation) ? '' : dataItem.IdItemNavigation.Code, disabled: true}, Validators.required
      ],
      IdItem: [{ value: dataItem.IdItem, disabled: true }],
      Description: [{ value: isNullOrUndefined(dataItem.IdItemNavigation) ? '' : dataItem.IdItemNavigation.Description, disabled: true }],
      IdWarehouse: [{ value: isNullOrUndefined(dataItem.IdWarehouse) ? '' : dataItem.IdWarehouse, disabled: true }],
      Shelf: [{ value: isNullOrUndefined(dataItem.Shelf) ? '' : dataItem.Shelf, disabled: true }],
      Storage: [{ value: isNullOrUndefined(dataItem.Storage) ? '' : dataItem.Storage, disabled: true }],
      ActualQuantity: [{ value: dataItem.ActualQuantity, disabled: true }],
      ForecastQuantity: [dataItem.ForecastQuantity, [ Validators.max(NumberConstant.MAX_QUANTITY)]],
      ForecastQuantity2: [dataItem.ForecastQuantity2, [ Validators.max(NumberConstant.MAX_QUANTITY)]],
      IsDeleted: [{ value: dataItem.IsDeleted, disabled: true }],
      IdStockDocument: [{ value: dataItem.IdStockDocument, disabled: true }],
    });
  }
  }

  /**
   * close editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor() {
    this.grid.closeRow(this.editedRowIndex);
    this.mySelection = [];
    this.footerDisable.emit(false);
    this.isNew = false;
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
  public havePermissionToEdit(){
    if(this.IdUserInput2){
      return (this.UserId == this.IdUserInput1 || this.UserId == this.IdUserInput2)
    }else{
      return this.UserId == this.IdUserInput1
    }
  }
  /*
  * on click documentline cell
  */
  public lineClickHandler({isEdited, dataItem, rowIndex}): void {
if(dataItem){
    if (isEdited
      || (this.formGroup && !this.formGroup.valid)
      || this.isInEditingMode && false
      || this.stockDocumentsService.stockDocument.IdDocumentStatus === 2 ||
      !this.havePermissionToEdit()) {
      this.showErrorMessage = false;
      return;
    }
    this.closeEditor();
    this.modalService.closeAnyExistingModalDialog();
    this.createLineFormGroup(dataItem, rowIndex);
    if (dataItem.IdItemNavigation.IdUnitStockNavigation.IsDecomposable) {
      const digits = dataItem.IdItemNavigation.IdUnitStockNavigation.DigitsAfterComma;
      this.formGroup.controls['ForecastQuantity'].setValidators([Validators.max(NumberConstant.MAX_QUANTITY), Validators.pattern('[0-9]+\.?[0-9]{0,' + digits + '}')]);
      this.formGroup.controls['ForecastQuantity2'].setValidators([Validators.max(NumberConstant.MAX_QUANTITY),Validators.pattern('[0-9]+\.?[0-9]{0,' + digits + '}')]);
    } else {
      this.formGroup.controls['ForecastQuantity'].setValidators([Validators.max(NumberConstant.MAX_QUANTITY), isNumeric()]);
      this.formGroup.controls['ForecastQuantity2'].setValidators([Validators.max(NumberConstant.MAX_QUANTITY), isNumeric()]);
    }
    this.formGroup.controls[StockDocumentConstant.ID_ITEM].disable();
    this.description = dataItem.Description;
    this.editedRowIndex = rowIndex;
    this.mySelection = [dataItem];
    this.footerDisable.emit(true);
    this.grid.editRow(rowIndex, this.formGroup);
  }
  }

  /*
   * on click documentline cell
   */
  public nextLineClickHandler(rowIndex?: number, dataIndex?: number): void {
    if (rowIndex !== -1 && dataIndex === -1) {
      const state = this.stockDocumentsService.inventoryGridSettings.state;
      state.skip -= state.take;
      this.stockDocumentsService.inventoryGridSettings.state = state;
      const document = new InventoryDocument(this.stockDocumentsService.stockDocument.Id,
        this.stockDocumentsService.inventoryGridSettings.state.skip,
        this.stockDocumentsService.inventoryGridSettings.state.take);
      this.stockDocumentsService.GetStockDocumentLineList(document).subscribe(result => {
        this.prepareList.emit(result);
        const dataItem = this.stockDocumentsService.inventoryGridSettings.gridData
          .data[this.stockDocumentsService.inventoryGridSettings.gridData.data.length - 1];
        this.mySelection = [dataItem];
        this.createLineFormGroup(dataItem, rowIndex);
        this.formGroup.controls[StockDocumentConstant.ID_ITEM].disable();
        this.description = dataItem.Description;
        this.editedRowIndex = rowIndex;
        this.footerDisable.emit(true);
        this.grid.editRow(this.editedRowIndex, this.formGroup);
      });
    }
    if (dataIndex === this.stockDocumentsService.inventoryGridSettings.gridData.data.length
      && rowIndex !== this.stockDocumentsService.inventoryGridSettings.gridData.total) {
      const state = this.stockDocumentsService.inventoryGridSettings.state;
      state.skip += state.take;
      this.stockDocumentsService.inventoryGridSettings.state = state;
      const document = new InventoryDocument(this.stockDocumentsService.stockDocument.Id,
        this.stockDocumentsService.inventoryGridSettings.state.skip,
        this.stockDocumentsService.inventoryGridSettings.state.take);
      this.stockDocumentsService.GetStockDocumentLineList(document).subscribe(result => {
        this.prepareList.emit(result);
        const dataItem = this.stockDocumentsService.inventoryGridSettings.gridData.data[0];
        this.mySelection = [dataItem];
        this.createLineFormGroup(dataItem, rowIndex);
        this.formGroup.controls[StockDocumentConstant.ID_ITEM].disable();
        this.description = dataItem.Description;
        this.editedRowIndex = rowIndex;
        this.footerDisable.emit(true);
        this.grid.editRow(this.editedRowIndex, this.formGroup);
      });
    } else {
      const dataItem = this.stockDocumentsService.inventoryGridSettings.gridData.data[dataIndex];
      if (dataItem) {
        this.mySelection = [dataItem];
        this.createLineFormGroup(dataItem, rowIndex);
        this.formGroup.controls[StockDocumentConstant.ID_ITEM].disable();
        this.description = dataItem.Description;
        this.editedRowIndex = rowIndex;
        this.footerDisable.emit(true);
        this.grid.editRow(this.editedRowIndex, this.formGroup);
      }
    }
  }

  setDefault(dataItem) {
    if (this.UserId === this.IdUserInput2) {
      dataItem.ForecastQuantity2 = dataItem.ActualQuantity;
    }
    if (this.UserId === this.IdUserInput1) {
      dataItem.ForecastQuantity = dataItem.ActualQuantity;
    }
    this.closeEditor();
  }

  public setSelectQty() {
    const forecastQty = document.getElementsByName('ForecastQuantity')[0] as any;
    forecastQty.select();
  }

  public rowCallback(context: RowClassArgs) {
    if (context.dataItem && Number(context.dataItem.ForecastQuantity)) {
      return {
        minus: context.dataItem.ForecastQuantity > context.dataItem.ActualQuantity,
        surplus: context.dataItem.ForecastQuantity < context.dataItem.ActualQuantity
      };
    }
  }

  SaveCurrentInventoryLine($event, isFromButton = false) {
    if (this.formGroup) {
      this.showErrorMessage = !this.formGroup.valid;

      if (this.formGroup.valid) {
        const idfiltredItem: number = this.formGroup.controls[StockDocumentConstant.ID_ITEM].value;
        this.stockDocumentsService.inventoryGridSettings.gridData.data.forEach(dataitem => {
          if (dataitem === this.mySelection[0]) {
            dataitem.ActualQuantity = this.formGroup.controls[StockDocumentConstant.ACTUAL_QUANTITY].value;
            dataitem.ForecastQuantity = Number(this.formGroup.controls[StockDocumentConstant.FORECAST_QUANTITY].value);
            dataitem.ForecastQuantity2 = Number(this.formGroup.controls[StockDocumentConstant.FORECAST_QUANTITY2].value);
          }
        });
        this.saveStockInventoryDocumentLines(this.formGroup.getRawValue(), false);

        if (isFromButton) {
          this.closeEditor();
        } else {
          // get next index
          let selectedIndex = $event.path[4].rowIndex + 1;
          let OpenLineIndex = this.editedRowIndex + 1;

          if ($event.key === 'ArrowUp') {
            selectedIndex = $event.path[4].rowIndex - 1;
            OpenLineIndex = this.editedRowIndex - 1;
          }

          this.closeEditor();
          this.nextLineClickHandler(OpenLineIndex, selectedIndex);
        }
      } else {
        this.validationService.validateAllFormFields(this.formGroup);
      }
    }
  }

  public saveStockInventoryDocumentLines(stockDocumentLine: any, isNew: boolean): void {
    if (isNew) {
      stockDocumentLine.IdLine = this.stockDocumentsService.counter++;
      this.stockDocumentsService.lineData.splice(NumberConstant.ZERO, NumberConstant.ZERO, stockDocumentLine);
      this.stockDocumentsService.ObjectToSend.splice(NumberConstant.ZERO, NumberConstant.ZERO, stockDocumentLine);
    } else {
      if (this.stockDocumentsService.lineData.length > NumberConstant.ZERO) {
        Object.assign(
          this.stockDocumentsService.lineData.find(({IdLine}) => IdLine === stockDocumentLine.IdLine),
          stockDocumentLine
        );
        Object.assign(
          this.stockDocumentsService.ObjectToSend.find(({IdLine}) => IdLine === stockDocumentLine.IdLine),
          stockDocumentLine
        );
      }
    }
    if(stockDocumentLine && Number(stockDocumentLine.IdWarehouse) == 0){
      stockDocumentLine.IdWarehouse = null ;
    }
    this.stockDocumentsService.saveStockDocumentLine(stockDocumentLine)
      .subscribe(data => {
        this.savedLine = data.listData;
        if(this.UserId == this.IdUserInput1){
          this.stockDocumentsService.inventoryGridSettings.gridData.data.find(x=>x.Id ==this.savedLine.Id).ForecastQuantity = this.savedLine.ForecastQuantity;
        }else {
          this.stockDocumentsService.inventoryGridSettings.gridData.data.find(x=>x.Id ==this.savedLine.Id).ForecastQuantity2 = this.savedLine.ForecastQuantity2;
        }
      });

  }

  /*
  *cancel changes
  */
  public cancelHandler(): void {
    this.showErrorMessage = false;
    this.closeEditor();
  }

  /**
   * data state change
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.stockDocumentsService.inventoryGridSettings.state = state;
    this.footerDisable.emit(false);
    this.loadGridDataSource();
  }

  preparePredicate(predicate) {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (predicate) {
      this.predicate = predicate;
    }
  }

  /**
   * Grid data source initiation, and filter
   * */
  public loadGridDataSource(predicate?) {
    if (isNotNullOrUndefinedAndNotEmptyValue(predicate)) {
      this.preparePredicate(predicate);
    }
    this.grid.loading = true;
    const document = new InventoryDocument(this.stockDocumentsService.stockDocument.Id,
      this.stockDocumentsService.inventoryGridSettings.state.skip,
      this.stockDocumentsService.inventoryGridSettings.state.take, this.articleReference, this.predicate);
    this.stockDocumentsService.GetStockDocumentLineList(document).subscribe(result => {
      this.prepareList.emit(result);
      // this.prepareList(result);
    });
    this.grid.loading = false;
  }

  setdef() {
    this.stockDocumentsService.inventoryGridSettings.gridData.data.forEach(x => {
      if (this.mySelection.find(y => y === x)) {
        this.setDefault(x);
      }
      if (this.selectedElement) {
        this.setDefault(this.selectedElement);
      }
    });
  }

  pictureTierSrc(dataIem) {
    /**
     * @TO_DO
     */
  }

  reinitialiseGridState() {
    this.stockDocumentsService.inventoryGridSettings.state.skip = NumberConstant.ZERO;
  }

  filter(predicate) {
    this.reinitialiseGridState();
    this.loadGridDataSource(predicate);
  }
}
