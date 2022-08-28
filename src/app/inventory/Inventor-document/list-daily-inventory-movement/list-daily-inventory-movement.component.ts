import { Component, OnInit, OnDestroy, Input, ViewContainerRef } from '@angular/core';
import { StockDocumentsService, linesToAdd } from '../../services/stock-documents/stock-documents.service';
import { PredicateFormat, Filter, Operator } from '../../../shared/utils/predicate';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { ActivatedRoute } from '@angular/router';
import { StockDocumentConstant } from '../../../constant/inventory/stock-document.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ItemService } from '../../services/item/item.service';
import { process } from '@progress/kendo-data-query';
import { StockDocumentLine } from '../../../models/inventory/stock-document-line.model';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { StockDocument } from '../../../models/inventory/stock-document.model';
import { ObjectToValidate } from '../../../models/sales/object-to-save.model';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { MessageService } from '../../../shared/services/signalr/message/message.service';
import { Subscription } from 'rxjs/Subscription';
import { ItemWarehouse } from '../../../models/inventory/item-warehouse.model';
import { SearchConstant } from '../../../constant/search-item';
import { isNullOrUndefined } from 'util';
import { IModalDialogOptions } from 'ngx-modal-dialog';
import { ReportingInModalComponent } from '../../../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { SalesInventoryDocumentLine } from '../../../models/inventory/sales-inventory-document-line.model';
import { TranslateService } from '@ngx-translate/core';


export const createLineFormGroup = dataItem => new FormGroup({
  'Id': new FormControl(dataItem.Id),
  'IdLine': new FormControl(isNullOrUndefined(dataItem.IdLine) ? NumberConstant.ZERO : dataItem.IdLine),
  'CodeItem': new FormControl(isNullOrUndefined(dataItem.IdItemNavigation) ? '' : dataItem.IdItemNavigation.Code),
  'Code': new FormControl(isNullOrUndefined(dataItem.IdItemNavigation) ? '' : dataItem.IdItemNavigation.Code),
  'Description': new FormControl(isNullOrUndefined(dataItem.IdItemNavigation) ? '' : dataItem.IdItemNavigation.Description),
  'LabelItem': new FormControl(dataItem.IdItemNavigation.IdNatureNavigation ? dataItem.IdItemNavigation.IdNatureNavigation.Label : ''),
  'Designation': new FormControl(isNullOrUndefined(dataItem.Designation) ? '' : dataItem.Designation),
  'Nature': new FormControl(dataItem.IdItemNavigation.IdNatureNavigation ? dataItem.IdItemNavigation.IdNatureNavigation.Label : ''),
  'IdItem': new FormControl(dataItem.IdItem, Validators.required),
  'ForecastQuantity': new FormControl(dataItem.ForecastQuantity),
  'ActualQuantity': new FormControl(dataItem.ActualQuantity),
  'SoldQuantity': new FormControl(dataItem.SoldQuantity),
  'IsDeleted': new FormControl(dataItem.IsDeleted ? dataItem.IsDeleted : false),
  'IdStockDocument': new FormControl(dataItem.IdStockDocument)
});

@Component({
  selector: 'app-list-daily-inventory-movement',
  templateUrl: './list-daily-inventory-movement.component.html',
  styleUrls: ['./list-daily-inventory-movement.component.scss']
})

export class ListDailyInventoryMovementComponent implements OnInit,OnDestroy {

  public FormatNumber = SharedConstant.NUMBER_FORMAT;
  inventoryMovementForm: FormGroup;
  formGroup: FormGroup;
  warehouseAssociatedToItems: number;
  public counter = linesToAdd.length;
  public view: StockDocumentLine[];
  private stockDocument: StockDocument;
  @Input()
  public modalOptions: Partial<IModalDialogOptions<any>>;
  public predicate: PredicateFormat;
  public Searchpredicate: PredicateFormat;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public swalNotif: SwalWarring;

  filterArray: Array<Filter>;
  operator: Operator;
  public gridSettings: GridSettings = {
    state: this.stockDocumentsService.gridState,
    columnsConfig: this.stockDocumentsService.dailyInventoryColumnsConfig
  };

  public isUserInListRole;


  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  public isGeneratedDailyInventory: boolean;
  public isPlannedInventory: boolean;
  public isAlreadyPlannedInventory: boolean;
  public isAdminUser: boolean;
  /*
 * id Subscription
 */
  private idSubscription: Subscription;
  private transfertMvtSubscription: Subscription;

  qteDispo: number;
  showErrorMessage: boolean;
  isShowForm: boolean;
  objectToValidate: ObjectToValidate;
  CodeItem: any;
  item = new ItemWarehouse();
  keyAction;
  enterAction;

  constructor(public itemService: ItemService, public stockDocumentsService: StockDocumentsService,
    public validationService: ValidationService, private messageService: MessageService,
    private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private swalWarrings: SwalWarring, private translate: TranslateService) {
    this.idSubscription = this.activatedRoute.params.subscribe(() => {
    });
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);
    this.isAdminUser = false;
    this.isUpdateMode = false;
  }


  ngOnInit() {

    this.view = this.stockDocumentsService.LinesToAdd();
  }

 

  /**
   * Grid data source initiation, and filter
   * */
  public loadGridDataSource() {
    
    const document = new SalesInventoryDocumentLine(this.gridSettings.state.skip,
      this.gridSettings.state.take,
      this.inventoryMovementForm.controls[StockDocumentConstant.START_DOCUMENT_DATE].value,
      this.inventoryMovementForm.controls[StockDocumentConstant.END_DOCUMENT_DATE].value,
      this.inventoryMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_SOURCE].value);
    this.stockDocumentsService.GetInventoryDocumentLineList(document).
        subscribe(result => {
          this.prepareList(result);
        });
      }


  

  /**
   * data state change
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.loadGridDataSource();

  }

  prepareList(result) {
    const state = this.stockDocumentsService.gridState;
    state.skip = 0;
    state.take = this.gridSettings.state.take;
    state.filter = this.gridSettings.state.filter;
    state.group = this.gridSettings.state.group;
    state.sort = this.gridSettings.state.sort;
    const Process = !isNullOrUndefined(result.data) ? process(result.data, state) : process(result.listData, state);
 
    if (!isNullOrUndefined(result)) {

     /* Regroup returned data */
     if (Process.data.length > 0 && Process.data[NumberConstant.ZERO].ActualQuantity === NumberConstant.MINUS_ONE) {
      this.gridSettings.columnsConfig[NumberConstant.THREE].hidden = true;
     }

      this.gridSettings.gridData = result;
      this.gridSettings.gridData.data = Process.data;
      this.gridSettings.gridData.total = result.total;

      this.view = result.data;
      this.stockDocument.StockDocumentLine = result.data;
    }

    if (isNullOrUndefined(this.gridSettings.gridData)
    && isNullOrUndefined(this.gridSettings.gridData.total) && this.gridSettings.gridData.total <= 0) {
      if (this.stockDocument.IsPlannedInventory) {
        const swalttext = this.translate.instant(StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_PLANNED_INVENTORY,
          { PlannifiedDate: this.stockDocument.DocumentDate.toLocaleDateString() });
        this.swalWarrings.CreateSwal(swalttext, 'INFO', 'OK', '', true, true);
      } else {
        this.swalWarrings.CreateSwal(StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_NOTEXISTING_INVENTORY_MOVEMENT_ITEMS, 
          'INFO', 'OK', '', true, true);
      }
    }
    this.isAlreadyPlannedInventory = this.stockDocument.IsPlannedInventory == true || this.stockDocument.StockDocumentLine.length > 0 ;
  }

  ngOnDestroy() {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.transfertMvtSubscription) {
      this.transfertMvtSubscription.unsubscribe();
    }
    this.stockDocumentsService.OnDestroy();
    this.view = this.stockDocumentsService.LinesToAdd();
  }

  private loadListofArticles(): void {
    this.loadGridDataSource();
}

generateDailyInventory() {
    this.loadListofArticles();
}


PrintDailyInventoryMovementReport() {
  if (this.isGeneratedDailyInventory && this.isPlannedInventory) {
    const dataToSend = { 'id': this.stockDocument.Id, 'reportName': StockDocumentConstant.DAILY_INVENTORY_SUMMARY_REPORT_NAME };
  this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
    SharedConstant.MODAL_DIALOG_SIZE_L);
  }
  else {
    this.messageService.startSendMessage(null, InformationTypeEnum.INVENTORY_INVENTORY_MVT_PRINT_REPORT, null, false);
  }
}

  PrintDailyInventoryMovementSlip() {

    if (this.isGeneratedDailyInventory && this.isPlannedInventory) {
      const dataToSend = { 'id': this.stockDocument.Id, 'reportName': StockDocumentConstant.DAILY_INVENTORY_SLIP_SUMMARY_REPORT_NAME };
    this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
      SharedConstant.MODAL_DIALOG_SIZE_L);
    }
    else {
      this.messageService.startSendMessage(null, InformationTypeEnum.INVENTORY_INVENTORY_MVT_PRINT_SLIP, null, false);
    }
  }


}
