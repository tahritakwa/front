import { Component, OnInit, ViewChild, OnDestroy, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Router, ActivatedRoute, Data } from '@angular/router';
import { NumberConstant } from '../../constant/utility/number.constant';
import { linesToAdd, StockDocumentsService } from '../../inventory/services/stock-documents/stock-documents.service';
import { StockDocumentLine } from '../../models/inventory/stock-document-line.model';
import { ObjectToSend, ObjectToValidate } from '../../models/sales/object-to-save.model';
import { StockDocument } from '../../models/inventory/stock-document.model';
import { GridComponent, PagerSettings, PageChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { ItemDropdownComponent } from '../../shared/components/item-dropdown/item-dropdown.component';
import { StockDocumentEnumerator } from '../../models/enumerators/stock-document.enum';
import { Subscription } from 'rxjs';
import { PredicateFormat, Filter, Relation, Operation } from '../../shared/utils/predicate';
import { ItemWarehouse } from '../../models/inventory/item-warehouse.model';
import { ValidationService } from '../../shared/services/validation/validation.service';
import { MessageService } from '../../shared/services/signalr/message/message.service';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { KeyboardConst } from '../../constant/keyboard/keyboard.constant';
import { SearchConstant } from '../../constant/search-item';
import { StockDocumentConstant } from '../../constant/inventory/stock-document.constant';
import { ReducedItem } from '../../models/inventory/reduced-item.model';
import { documentStatusCode } from '../../models/enumerators/document.enum';
import { InformationTypeEnum } from '../../shared/services/signalr/information/information.enum';
import { WarehouseService } from '../../inventory/services/warehouse/warehouse.service';
import { Warehouse } from '../../models/inventory/warehouse.model';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { DocumentLinesWithPaging } from '../../models/sales/document-lines-with-paging.model';
import { SharedEcommerceService } from '../services/shared-ecommerce/shared-ecommerce.service';

export const createLineFormGroup = dataItem => new FormGroup({
  'Id': new FormControl(dataItem.Id),
  'IdLine': new FormControl(dataItem.IdLine),
  'CodeItem': new FormControl(dataItem.Code),
  'LabelItem': new FormControl(dataItem.LabelItem),
  'Designation': new FormControl(dataItem.Designation),
  'IdItem': new FormControl(dataItem.IdItem, Validators.required),
  'ActualQuantity': new FormControl(dataItem.ActualQuantity, [
    Validators.minLength(1),
    Validators.min(0),
    Validators.max(99999),
    Validators.maxLength(5),
    Validators.max(99999),
    Validators.pattern('[-+]?[0-9]*\.?[0-9]*'),
    Validators.required]),
  'IsDeleted': new FormControl(dataItem.IsDeleted ? dataItem.IsDeleted : false),
  'IdStockDocument': new FormControl(dataItem.IdStockDocument),
  'AvailableQuantity': new FormControl(dataItem.AvailableQuantity)
});
const GET_WAREHOUSE_ECOMMERCE = 'getWarehouseDropdownForEcommerce';
@Component({
  selector: 'app-add-mouvement-ecommerce',
  templateUrl: './add-mouvement-ecommerce.component.html',
  styleUrls: ['./add-mouvement-ecommerce.component.scss']
})
export class AddMouvementEcommerceComponent implements OnInit, OnDestroy {

  transfertMovementForm: FormGroup;
  isSavedDocument: boolean;
  /** tiersAssociatedToItems will be changed if its a purchase document and the supplier has been selected */
  warehouseAssociatedToItems: number;
  formGroup: FormGroup;
  public counter = linesToAdd.length;
  private isNew: boolean;
  private editedRowIndex: number;
  public view: GridDataResult;
  labelItem: string;
  designation: string;
  private objectToSave: ObjectToSend;
  private stockDocument: StockDocument;
  @ViewChild(GridComponent) private grid: GridComponent;
  @ViewChild(ItemDropdownComponent) private itemDropDown: ItemDropdownComponent;
  private documentCode: StockDocumentEnumerator = new StockDocumentEnumerator();
  private Code: string;
  isDisabled: boolean;
  isFromRemove = false;
  isSelectedItem = false;
  IdItemSource: any;
  IdItemDestination: any;
  IdType: any;
  /*
  * Id Entity
  */
  private id: number;

  private idWarehouseSource: number;
  private idWarehouseDestination: number;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  /*
 * id Subscription
 */
  private idSubscription: Subscription;
  private transfertMvtSubscription: Subscription;
  /*
 * active to update
 */
  private transfertMvtToUpdate: StockDocument;
  public predicate: PredicateFormat;

  private idCurrentWarehouseSource: number;

  qteDispo: number;
  showErrorMessage: boolean;
  isShowForm: boolean;
  isTransfertForm: boolean;
  isReceiveForm: boolean;
  objectToValidate: ObjectToValidate;
  item = new ItemWarehouse();
  keyAction;
  warehouseDataSource: any;
  idCentralWarehouse: any;
  idEcommerceWarehouse: any;
  isReservation: any;
  idLiberation: boolean;
  idReservation: boolean;
  UpdateValue: any;
  CentralWarehouse: Warehouse;
  EcommerceWarehouse: Warehouse;
  SourceWarehouse: Warehouse;
  showButtonAddLine: boolean = true;
  public pageSize = 50;
  public skip = 0;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public NewAvailbleQuantity: number = 0;

  constructor(private warehouseService: WarehouseService, private formBuilder: FormBuilder, 
    public stockDocumentsService: StockDocumentsService,public sharedEcommerceService :SharedEcommerceService,
    public validationService: ValidationService, private router: Router, private messageService: MessageService,
    private activatedRoute: ActivatedRoute, public viewRef: ViewContainerRef, private swalWarrings: SwalWarring) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    });
    this.keyAction = (event) => {
      const keyName = event.key;
      /*escape keyboard click */
      if (keyName === KeyboardConst.ESCAPE) {
        this.closeEditor();
      }
      /*Enter keyboard click */
      if (keyName === KeyboardConst.ENTER) {
        if (this.formGroup.valid) {
          event.preventDefault();
          this.saveCurrent();
        }
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    this.getDocLineWithPaging();
  }

  private getDocLineWithPaging(ifAfterSave?: boolean) {
    const documentLinesWithPaging = new DocumentLinesWithPaging(this.id, this.pageSize,
      this.skip, null, null, false);
    this.sharedEcommerceService.getStockDocumentWithStockDocumentLine(documentLinesWithPaging).subscribe(x => {  
      this.closeEditor();
      if (x.total === 0) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
      this.initGridData(x.data);
      this.view.total = x.total;
      if (ifAfterSave) {
        this.addLine();
      }
    });

  }

  initGridData(StockDocLine) {

    this.stockDocumentsService.lineData = [];
    this.stockDocumentsService.ObjectToSend = [];
    this.counter = 0;
    this.stockDocumentsService.counter = 0;
    if (StockDocLine && StockDocLine.length > 0) {
      StockDocLine.forEach((x) => {
        x.LabelItem = x.IdItemNavigation.Code;
        x.Designation = x.IdItemNavigation.Description;
        this.stockDocumentsService.saveStockDocumentLines(x, true);
        this.isDisabled = false;
      });
    }
    this.view.data = StockDocLine;
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
  private createAddForm(): void {
    this.transfertMovementForm = this.formBuilder.group({
      Id: [0],
      Code: [''],
      DocumentDate: [new Date(), Validators.required],
      IdWarehouseSource: [undefined, Validators.required],
      IdWarehouseDestination: [undefined, Validators.required]
    });
  }

  /**
   *  Get remaining quantity
   * @param qteDispo
   */
  getRemainingQuantity(qteDispo: number, idItem: number, idCurrentLine?: number): number {
    let remainingQuantity: number = qteDispo;
    // substract qty for deleted lines + add qty for new lines
    this.stockDocumentsService.ObjectToSend.filter(p => p.IdItem === idItem && p.IsDeleted)
      .forEach(p => remainingQuantity += Number(p.ActualQuantity));
    if (idCurrentLine != null && idCurrentLine != undefined) {
      this.stockDocumentsService.ObjectToSend.filter(p => p.IdItem === idItem && p.IdLine !== idCurrentLine && p.Id === 0)
        .forEach(p => remainingQuantity -= Number(p.ActualQuantity));
    }
    else {
      this.stockDocumentsService.ObjectToSend.filter(p => p.IdItem === idItem && p.Id === 0)
        .forEach(p => remainingQuantity -= Number(p.ActualQuantity));
    }
    return remainingQuantity;
  }

  /**Select warehouse Source */
  warehouseSourceFocused($event) {
    this.changeListOfWarehouse($event, StockDocumentConstant.ID_WAREHOUSE_DESTINATION, this.idWarehouseDestination);
  }

  /**Select warehouse Destination */
  warehouseDestinationFocused($event) {
    this.changeListOfWarehouse($event, StockDocumentConstant.ID_WAREHOUSE_SOURCE, this.idWarehouseSource);
  }

  /**
   * Change value of list of warehouse
   * @param $event
   * @param nameOfProperty
   * @param idSpecificWarehouse
   */
  changeListOfWarehouse($event, nameOfProperty, idSpecificWarehouse) {
    if (idSpecificWarehouse !== this.transfertMovementForm.value[nameOfProperty]) {
      idSpecificWarehouse = this.transfertMovementForm.value[nameOfProperty];
      // Init list of warehouse data source
      $event.warehouseDataSource = [];
      $event.warehouseDataSource = $event.warehouseDataSource.concat($event.listOfAllWarehouseDataSource);
      // Init list of filtred warehouse data source
      $event.warehouseFiltredDataSource = [];
      $event.warehouseFiltredDataSource = $event.warehouseFiltredDataSource.concat($event.listOfAllWarehouseDataSource);
      if (this.transfertMovementForm.value[nameOfProperty]) {
        // Change list of warehouse data source
        $event.warehouseFiltredDataSource.splice($event.warehouseFiltredDataSource.findIndex(d => d.Id === idSpecificWarehouse), 1);
        // Change list of filtred warehouse data source
        $event.warehouseDataSource.splice($event.warehouseDataSource.findIndex(d => d.Id === idSpecificWarehouse), 1);
      }
    }
  }

  /**Select item */
  itemSelect($event) {
    if ($event){
    if (this.item.IdItem !== $event.itemForm.value[StockDocumentConstant.ID_ITEM]) {
      this.isSelectedItem = true;
    }
    this.item = $event.itemForm.value;
    if ($event.itemForm && $event.itemForm.value[StockDocumentConstant.ID_ITEM] && this.isSelectedItem) {
      this.formGroup.controls[StockDocumentConstant.ACTUAL_QUANTITY].setValue(1);
      const model = {};
      model[StockDocumentConstant.ID_ITEM] = $event.itemForm.value[StockDocumentConstant.ID_ITEM];
      model[StockDocumentConstant.ID_WAREHOUSE] = this.IdItemSource;
      model[StockDocumentConstant.ID] = $event.itemForm.value[StockDocumentConstant.ID];
      model[StockDocumentConstant.DATE] = this.transfertMovementForm.controls[StockDocumentConstant.DATE_FIELD].value;
      const objectToSend: ObjectToSend = new ObjectToSend(model);

      this.sharedEcommerceService.getItemQtyInWarehouse(objectToSend).subscribe(res => {
        this.NewAvailbleQuantity = res.listData;
        this.formGroup.controls['AvailableQuantity'].setValue(res.listData);
      });
    }
  }
}
  changeStyleLabelQte(color: string) {
    if (document.getElementById(StockDocumentConstant.LABEL_QUANTITY)) {
      document.getElementById(StockDocumentConstant.LABEL_QUANTITY).style.color = color;
    }
  }
  itemFocused($event) {
    this.idCurrentWarehouseSource = this.IdItemSource;
    const listOfItemToShow: Array<ReducedItem> = new Array<ReducedItem>();
    this.itemDropDown.listOfAllItemDataSource.forEach((itm) => {
      if (itm.ItemWarehouse && itm.ItemWarehouse.length > 0) {
        itm.ItemWarehouse.forEach((itmWh) => {
          if (itmWh.IdWarehouse === this.idCurrentWarehouseSource) {
            listOfItemToShow.push(itm);
          }
        });
      }
    });
    this.itemDropDown.itemDataSource = listOfItemToShow;
    this.itemDropDown.itemFiltredDataSource = listOfItemToShow;
  }
  /**
* Prepare object to save
*/
  prepareObjectToSave(line: StockDocumentLine[]) {

    this.stockDocument = new StockDocument(line, this.documentCode.TransferMovement,
      this.transfertMovementForm.controls[StockDocumentConstant.DATE_FIELD].value,
      false,
      this.IdItemSource,
      this.IdItemDestination,
      documentStatusCode[StockDocumentConstant.PROVISIONAL],
      this.transfertMvtToUpdate ? this.transfertMvtToUpdate.Id : null,
      this.transfertMvtToUpdate ? this.transfertMvtToUpdate.Code : null);
    (this.IdItemSource == this.CentralWarehouse.Id) ? this.stockDocument.IdWarehouseSourceNavigation = this.CentralWarehouse : this.stockDocument.IdWarehouseSourceNavigation = this.EcommerceWarehouse;



    this.objectToSave = new ObjectToSend(this.stockDocument);


  }

  save() {
    const stockDocumentLines: Array<StockDocumentLine> = new Array<StockDocumentLine>();
    this.prepareObjectToSave(stockDocumentLines);
    this.stockDocumentsService.saveStockDocumentInRealTime(this.objectToSave).subscribe(res => {
      if (!this.isUpdateMode) {
        this.setDocumentCodeAndIdAfterSave(res);
        if (res && res.Id) {
          this.id = res.Id;
          this.isSavedDocument = true;
          // this.isUpdateMode = true;
          this.setValueTransfertMvt(res);
        }
        this.messageService.startSendMessage(res, InformationTypeEnum.INVENTORY_TRANSFER_MVT_ADD, null, false);
      }
    });
  }

  setValueTransfertMvt(data) {
    this.transfertMvtToUpdate = data;
    this.changeItemDropdown(this.transfertMvtToUpdate.IdWarehouseSource);
    if (this.transfertMvtToUpdate) {
      if (this.transfertMvtToUpdate.IdDocumentStatus !== NumberConstant.ONE) {
        this.isShowForm = true;
      }
      if (this.transfertMvtToUpdate.IdDocumentStatus === NumberConstant.TWO) {
        this.isTransfertForm = true;
      }
      if (this.transfertMvtToUpdate.IdDocumentStatus === NumberConstant.NINE) {
        this.isReceiveForm = true;
      }
      if (this.transfertMvtToUpdate.DocumentDate) {
        this.transfertMvtToUpdate.DocumentDate = new Date(this.transfertMvtToUpdate.DocumentDate);
      }
      this.transfertMovementForm.patchValue(this.transfertMvtToUpdate);

    }
  }

  public setDocumentCodeAndIdAfterSave(data) {
    this.transfertMovementForm.controls['Id'].setValue(data.Id);
    this.transfertMovementForm.controls['Code'].setValue(data.Code);
  }

  /*
  *cancel changes
  */
  public cancelHandler(): void {
    this.closeEditor();
    if (this.view.data.length === 0) {
      this.isDisabled = false;
    }
  }

  private closeEditor() {
    this.grid.closeRow(this.editedRowIndex);
    this.isNew = false;
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.showButtonAddLine = true;
    if (this.itemDropDown) {
      this.itemDropDown.activeKeyPress = false;
    }
  }

  /*
  * on click documentline cell
  */
  public lineClickHandler({ isEdited, dataItem, rowIndex }): void {
    if (!this.isShowForm) {
      if (isEdited || (this.formGroup && !this.formGroup.valid) || this.isInEditingMode || this.isFromRemove) {
        this.isFromRemove = false;
        this.showErrorMessage = false;
        return;
      }
      this.showButtonAddLine = false;
      this.isSelectedItem = false;
      this.calculateQuantityDispo(dataItem.IdItem, this.IdItemSource, this.transfertMovementForm.controls[StockDocumentConstant.DATE_FIELD].value, dataItem.Id);
      this.formGroup = createLineFormGroup(dataItem);
      this.formGroup.controls[StockDocumentConstant.ID_ITEM].disable();
      this.item = this.formGroup.value;
      this.labelItem = dataItem.LabelItem;
      this.designation = dataItem.Designation;
      this.editedRowIndex = rowIndex;
      this.grid.editRow(rowIndex, this.formGroup);
    }
  }

  calculateQuantityDispo(idItem: number, idWarehouseS: number, dateDocument: Date, idStockDocumentLine: number) {
    const model = {};
    model[StockDocumentConstant.ID_ITEM] = idItem;
    model[StockDocumentConstant.ID_WAREHOUSE] = idWarehouseS;
    model[StockDocumentConstant.ID] = idStockDocumentLine;
    model[StockDocumentConstant.DATE] = dateDocument;
    const objectToSend: ObjectToSend = new ObjectToSend(model);
    this.sharedEcommerceService.getItemQtyInWarehouse(objectToSend).subscribe(res => {
      this.qteDispo = this.getRemainingQuantity(Number(res.listData), idItem, this.formGroup.value[StockDocumentConstant.ID_LINE]);
      this.changeStyleLabelQte(StockDocumentConstant.GREEN);
      this.showErrorMessage = true;
    });

  }
  calculateQuantityDispoAndSaveCurrentLine(idItem: number, idWarehouseS: number, dateDocument: Date, idStockDocumentLine: number) {
    const model = {};
    model[StockDocumentConstant.ID_ITEM] = idItem;
    model[StockDocumentConstant.ID_WAREHOUSE] = idWarehouseS;
    model[StockDocumentConstant.ID] = idStockDocumentLine;
    model[StockDocumentConstant.DATE] = dateDocument;
    const objectToSend: ObjectToSend = new ObjectToSend(model);
    this.sharedEcommerceService.getItemQtyInWarehouse(objectToSend).subscribe(res => {
      this.qteDispo = this.getRemainingQuantity(Number(res.listData), idItem, this.formGroup.value[StockDocumentConstant.ID_LINE]);
      this.changeStyleLabelQte(StockDocumentConstant.GREEN);
      this.showErrorMessage = !this.formGroup.valid;

      if (this.formGroup.valid) {
        const filtredItem: ReducedItem = this.itemDropDown.itemDataSource.filter(x =>
          x.Id === this.formGroup.controls[StockDocumentConstant.ID_ITEM].value)[0];
        this.labelItem = filtredItem.Code;
        this.designation = filtredItem.Description;
        this.formGroup.controls[StockDocumentConstant.LABEL_ITEM].setValue(this.labelItem);
        this.formGroup.controls[StockDocumentConstant.DESIGNATION].setValue(this.designation);
        if (this.formGroup.controls[StockDocumentConstant.ACTUAL_QUANTITY].value > this.qteDispo) {
          this.changeStyleLabelQte(StockDocumentConstant.RED);
          this.showErrorMessage = true;
          this.validationService.validateAllFormFields(this.formGroup);
        } else {
          this.showErrorMessage = false;
          this.counter = this.formGroup.controls[StockDocumentConstant.ID_LINE].value;
          this.stockDocumentsService.saveStockDocumentLines(this.formGroup.value, this.isNew);
          this.closeEditor();
          this.isDisabled = true;
        }
      } else {
        this.validationService.validateAllFormFields(this.formGroup);
      }
    });

  }
  /*
* Add DocumentLine
*/
  public addLine(): void {
    if (this.itemDropDown) {
      this.itemDropDown.activeKeyPress = false;
    }
    /*if (this.transfertMovementForm.valid) {
      this.showButtonAddLine = false;*/
    this.changeItemDropdown(this.IdItemSource);
    this.formGroup = createLineFormGroup({
      'Id': 0,
      'IdItem': undefined,
      'ActualQuantity': 1,
      'LabelItem': undefined,
      'Designation': undefined,
      'IsDeleted': false
    });
    this.isNew = true;
    this.isSelectedItem = true;
    this.formGroup.controls[StockDocumentConstant.ID_LINE].setValue(this.stockDocumentsService.counter);
    this.grid.addRow(this.formGroup);
    this.isDisabled = true;
    if (this.IdType === 0) {
      this.idLiberation = true;
    } else {
      this.idReservation = true;
    }
    this.isUpdateMode = false;
    if (this.transfertMovementForm.controls['Id'].value <= 0) {
      this.save();
    }
  /*}else {
    this.showButtonAddLine = true;
    this.validationService.validateAllFormFields(this.transfertMovementForm);
  }*/
  }

  /*
* remove the current documentLine from the current data source
*/
  public removeLine({ isEdited, dataItem, rowIndex }) {
    this.sharedEcommerceService.removeDocumentLineInRealTime(dataItem.Id).subscribe(res => {
      this.getDocLineWithPaging();
      this.closeEditor();
      this.isDisabled = true;
      if (this.view.data.length === 0) {
      this.isDisabled = false;
      if (this.IdType == 0) {
        this.idReservation = false;
      }
      else {
        this.idLiberation  = false;
      }
    }
    });
  }

  /**
 * Save current documentline
 **/
public saveCurrent(): void {
  if (this.formGroup.valid) {

    const filtredItem: ReducedItem = this.itemDropDown.itemDataSource.filter(x =>
      x.Id === this.formGroup.controls[StockDocumentConstant.ID_ITEM].value)[0];
    this.labelItem = filtredItem.Code;
    this.designation = filtredItem.Description;
    this.formGroup.controls[StockDocumentConstant.LABEL_ITEM].setValue(this.labelItem);
    this.formGroup.controls[StockDocumentConstant.DESIGNATION].setValue(this.designation);

    this.counter = this.formGroup.controls[StockDocumentConstant.ID_LINE].value;
    this.formGroup.controls['IdStockDocument'].setValue(this.id);
    this.sharedEcommerceService.saveStockDocumentLineInRealTime(this.formGroup.getRawValue()).subscribe(res => {
      this.getDocLineWithPaging(true);
    });

  } 
  else {
    this.validationService.validateAllFormFields(this.formGroup);
}
}

  ngOnDestroy() {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.transfertMvtSubscription) {
      this.transfertMvtSubscription.unsubscribe();
    }
    this.sharedEcommerceService.OnDestroy();
    this.view.data = this.sharedEcommerceService.LinesToAdd();
    document.removeEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);
  }

  private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(StockDocumentConstant.ID, Operation.eq, this.id));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(StockDocumentConstant.STOCK_DOCUMENT_LINE)]);
  }

  validateTransfertMovement(): void {
    this.swalWarrings.CreateSwal(StockDocumentConstant.TEXT_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT,
      StockDocumentConstant.TITLE_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT,
      StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_VALIDATE_TRANSFERT_MOVEMENT).then((result) => {
        if (result.value) {
          this.sharedEcommerceService.validateEcommerceTransfertMovement(this.id).subscribe(res => {
            // send message
            this.messageService.startSendMessage(res, InformationTypeEnum.INVENTORY_TRANSFER_MVT_VALIDATION, null, false);
            this.router.navigate([StockDocumentConstant.URI_ECOMMERCE_LIST]);
          });
        }
      });
  }

  /**
 *  get data to update
 * */
  private getDataToUpdate(): void {
    this.preparePredicate();

    this.transfertMvtSubscription = this.stockDocumentsService.getModelByCondition(this.predicate).subscribe(data => {
      this.transfertMvtToUpdate = data;
      this.UpdateValue = "Libération";
      if (this.IdItemSource == this.transfertMvtToUpdate.IdWarehouseSource) {
        this.UpdateValue = "Réservation";
      }
      this.IdItemSource = this.transfertMvtToUpdate.IdWarehouseSource;
      this.changeItemDropdown(this.transfertMvtToUpdate.IdWarehouseSource);
      if (this.transfertMvtToUpdate) {
        if (this.transfertMvtToUpdate.IdDocumentStatus !== NumberConstant.ONE) {
          this.isShowForm = true;
        }
        if (this.transfertMvtToUpdate.IdDocumentStatus === NumberConstant.TWO) {
          this.isTransfertForm = true;
        }
        if (this.transfertMvtToUpdate.IdDocumentStatus === NumberConstant.NINE) {
          this.isReceiveForm = true;
        }
        if (this.transfertMvtToUpdate.DocumentDate) {
          this.transfertMvtToUpdate.DocumentDate = new Date(this.transfertMvtToUpdate.DocumentDate);
        }
        this.transfertMovementForm.patchValue(this.transfertMvtToUpdate);
        if(this.transfertMvtToUpdate.StockDocumentLine){
        this.transfertMvtToUpdate.StockDocumentLine.forEach((x) => {
          x.LabelItem = x.IdItemNavigation.Code;
          x.Designation = x.IdItemNavigation.Description;
          ///
          this.stockDocumentsService.saveStockDocumentLines(x, true);
          this.isDisabled = true; 
        });
      }
    }
    });

  }

  transfertValidateStockDocument(id?) {
    this.objectToValidate = new ObjectToValidate(id ? id : this.id);
    this.sharedEcommerceService.transfertValidateStockDocumentFromEcommerce(this.objectToValidate).subscribe(res => {
      this.receiveValidateStockDocument(res['Id']);
    });
  }

  receiveValidateStockDocument(id?) {
    this.objectToValidate = new ObjectToValidate(id ? id : this.id);
    this.sharedEcommerceService.receiveValidateStockDocument(this.objectToValidate).subscribe(res => {
      // send message      
      this.messageService.startSendMessage(res, InformationTypeEnum.INVENTORY_TRANSFER_MVT_RECEIVE, null, false);
      this.router.navigate([StockDocumentConstant.URI_ECOMMERCE_LIST]);
    });
  }

  ngOnInit() {

    this.view = {
      data: undefined,
      total: 0
    };

    this.initDataSource(this.id );

    this.IdType = 0;
    this.IdItemSource = this.idCentralWarehouse;
    this.IdItemDestination = this.idEcommerceWarehouse;
    this.createAddForm();
    this.isUpdateMode = this.id > 0;
    if (this.isUpdateMode) {
      this.isSavedDocument = true;
      this.getDataToUpdate();

    }
  }
  warehouseDestinationSelected($event) {
    this.changeItemDropdown($event.parent.value[StockDocumentConstant.ID_WAREHOUSE_SOURCE]);
  }
  /**
   *  Informe itemDropDown about warehouse changement
   */
  changeItemDropdown(idWarehouse) {
    if (idWarehouse) {
      this.warehouseAssociatedToItems = idWarehouse;
    } else {
      this.warehouseAssociatedToItems = null;
    }
    if (this.itemDropDown) {
      this.itemDropDown.getItemRelatedToWarehouse(idWarehouse);
    }
  }

  public initDataSource(id: any): void {
    this.IdType = id;
    this.preparePredicate();
    let api = GET_WAREHOUSE_ECOMMERCE;
    this.warehouseService.callPredicateData(this.predicate, api).subscribe(data => {
      this.CentralWarehouse = data.find(x => x.IsCentral === true);
      this.EcommerceWarehouse = data.find(x => x.IsEcommerce === true);
      this.idCentralWarehouse = data.find(x => x.IsCentral === true).Id;
      this.idEcommerceWarehouse = data.find(x => x.IsEcommerce === true).Id;
      if (id == 0) {
        this.IdItemSource = this.idCentralWarehouse;
        this.IdItemDestination = this.idEcommerceWarehouse;
        this.SourceWarehouse = this.CentralWarehouse;
        this.view.data= [];
      }
      else {
        this.IdItemSource = this.idCentralWarehouse;
        this.IdItemDestination = this.idEcommerceWarehouse;
        this.SourceWarehouse = this.EcommerceWarehouse;
        this.view.data= this.stockDocumentsService.LinesToAdd();

      }
    });
  }

  showSearch(id: any) {
    this.initDataSource(id);
  }

  ecommerceStockDocument(id?) {
    this.objectToValidate = new ObjectToValidate(id ? id : this.id);
    this.sharedEcommerceService.ecommerceValidateStockDocument(this.objectToValidate).subscribe(res => {
      // send message


      this.transfertValidateStockDocument(res['Id']);


      //this.receiveValidateStockDocument(res['Id']);
      //this.messageService.startSendMessage(res, InformationTypeEnum.INVENTORY_TRANSFER_MVT_RECEIVE, null, false);
      //this.router.navigate(["/main/ecommerce/mouvement"]);
    });
  }

}
