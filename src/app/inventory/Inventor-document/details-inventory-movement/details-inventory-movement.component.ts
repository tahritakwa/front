import { Component, OnInit, OnDestroy, Input, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ItemService } from '../../services/item/item.service';
import { PredicateFormat, Relation, Filter, Operator, Operation } from '../../../shared/utils/predicate';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { StockDocumentsService, linesToAdd } from '../../services/stock-documents/stock-documents.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { StockDocumentLine } from '../../../models/inventory/stock-document-line.model';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { StockDocument } from '../../../models/inventory/stock-document.model';
import { ObjectToValidate } from '../../../models/sales/object-to-save.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ItemWarehouse } from '../../../models/inventory/item-warehouse.model';
import { StockDocumentConstant } from '../../../constant/inventory/stock-document.constant';
import { isNullOrUndefined } from 'util';
import { InventoryDocument } from '../../../models/inventory/inventory-document.model';
import { ReportingInModalComponent } from '../../../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';

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
  'IsDeleted': new FormControl(dataItem.IsDeleted ? dataItem.IsDeleted : false),
  'IdStockDocument': new FormControl(dataItem.IdStockDocument)
});


@Component({
  selector: 'app-details-inventory-movement',
  templateUrl: './details-inventory-movement.component.html',
  styleUrls: ['./details-inventory-movement.component.scss']
})

export class DetailsInventoryMovementComponent implements OnInit, OnDestroy {
  public FormatNumber = SharedConstant.NUMBER_FORMAT;
  inventoryMovementDetailsForm: FormGroup;
  formGroup: FormGroup;
  warehouseAssociatedToItems: number;
  public counter = linesToAdd.length;
  public view: StockDocumentLine[];
  labelItem: string;
  designation: string;
  private stockDocument: StockDocument;
  isDisabled: boolean;
  isSelectedItem = false;
  @Input()
  public isForWarehouseDetail = false;
  public groups: GroupDescriptor[];
  public predicate: PredicateFormat;
  public isCollapsed;
  public distinctCategories;
  availableQuanittyFilter = false;
  centralQuantityFilter = false;
  public selectedItem: number;
  public selectedElement: StockDocumentLine;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public swalNotif: SwalWarring;
  isBtnClicked = false;
  public showTab = false;
  filterArray: Array<Filter>;
  operator: Operator;
  public gridSettings: GridSettings = {
    state: this.stockDocumentsService.gridState,
    columnsConfig: this.stockDocumentsService.inventoryColumnsConfig
  };
  
  public isUserInListRole;

  /*
  * Id Entity
  */
  private id: number;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  public isGeneratedInventory: boolean;
  public isAdminUser: boolean;
  /*
 * id Subscription
 */
  private idSubscription: Subscription;
  private transfertMvtSubscription: Subscription;
  /*
 * active to update
 */
  private transfertMvtToUpdate: StockDocument;

  qteDispo: number;
  showErrorMessage: boolean;
  isShowForm: boolean;
  objectToValidate: ObjectToValidate;
  CodeItem: any;
  item = new ItemWarehouse();
  keyAction;

  constructor(private formBuilder: FormBuilder, public itemService: ItemService, public stockDocumentsService: StockDocumentsService,
    public validationService: ValidationService, private activatedRoute: ActivatedRoute,
    private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef, private swalWarrings: SwalWarring) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    });
    
    this.isAdminUser = false;
    this.isUpdateMode = false;
  }


  ngOnInit() {

    this.view = this.stockDocumentsService.LinesToAdd();
    this.createAddForm();
    this.isUpdateMode = this.id > 0;
    if (this.isUpdateMode) {
      this.isDisabled = true;
      this.isShowForm = true;
      this.getDataToUpdate();
    }


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

  
  /**
 * create add form
 * */
private createAddForm(): void {
  this.inventoryMovementDetailsForm = this.formBuilder.group({
    Id: [0],
    Code: [''],
    DocumentDate: [new Date(), Validators.required],
    IdWarehouseSource: [undefined, Validators.required],
  });

}



  /**
 *  get data to update
 * */
  private getDataToUpdate(): void {
    this.preparePredicate();
    this.stockDocumentsService.GetStockDoucment(this.predicate).subscribe(data => {
      this.transfertMvtToUpdate = data;
      if (this.transfertMvtToUpdate) {
        this.stockDocument = this.transfertMvtToUpdate;
        this.prepareDocumentPredicate();
        const document = new InventoryDocument(this.stockDocument.Id, this.gridSettings.state.skip, this.gridSettings.state.take);
        this.stockDocumentsService.GetStockDocumentLineList(document).
          subscribe(result => {
            this.prepareList(result);
            this.transfertMvtToUpdate.StockDocumentLine = result['listData'];
            this.transfertMvtToUpdate.DocumentDate = new Date(this.transfertMvtToUpdate.DocumentDate);
            this.inventoryMovementDetailsForm.controls[StockDocumentConstant.DATE_FIELD]
            .setValue(new Date(this.stockDocument.DocumentDate));
            this.inventoryMovementDetailsForm.patchValue(this.transfertMvtToUpdate);

            this.transfertMvtToUpdate.StockDocumentLine.forEach((x) => {
              x.LabelItem = x.IdItemNavigation.Description;
              x.CodeItem = x.IdItemNavigation.Code;
              this.stockDocumentsService.saveStockDocumentLines(x, true);
              this.isDisabled = true;
            });
          });


      }
    });
  }

  private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(StockDocumentConstant.ID, Operation.eq, this.id));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(StockDocumentConstant.STOCK_DOCUMENT_LINE)]);
  }

  private prepareDocumentPredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(StockDocumentConstant.ID_WAREHOUSE, Operation.eq, this.stockDocument.Id));
    
  }

  prepareList(result) {
    let state = this.itemService.gridState;
    state.skip = 0;
    state.take = this.gridSettings.state.take;
    state.filter = this.gridSettings.state.filter;
    state.group = this.gridSettings.state.group;
    state.sort = this.gridSettings.state.sort;

    if (!isNullOrUndefined(result)) {

      /* Regroup returned data */
     if (result.listData[NumberConstant.ZERO].ActualQuantity === NumberConstant.MINUS_ONE) {
      this.gridSettings.columnsConfig[NumberConstant.THREE].hidden = true;
     }
      this.gridSettings.gridData = result;
      this.gridSettings.gridData.data = result.listData;
      this.gridSettings.gridData.total = result.total;
      this.view = result.data;
    }

    if (!isNullOrUndefined(this.gridSettings.gridData) &&
    !isNullOrUndefined(this.gridSettings.gridData.total) && this.gridSettings.gridData.total > 0) {
      this.isGeneratedInventory = true;
    } else {
      this.isGeneratedInventory = false;
      this.swalWarrings.CreateSwal('No Records Found', 'INFO', 'OK', '', true, true);
    }

  }


  /**
   * data state change
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.loadGridDataSource();

  }

  /**
   * Grid data source initiation, and filter
   * */
  public loadGridDataSource(filter?: Array<Filter>, operator?: Operator, predicate?: PredicateFormat) {
    if (filter || operator) {
      this.filterArray = filter;
      this.operator = operator;
    }
    this.predicate = predicate ? predicate : this.predicate;
    const document = new InventoryDocument(this.stockDocument.Id,this.gridSettings.state.skip,this.gridSettings.state.take);
    this.stockDocumentsService.GetStockDocumentLineList(document)
      .subscribe((data) => {
        this.prepareList(data);
      });
  }

  PrintInventoryMovementReport() {
    const dataToSend = { 'id': this.stockDocument.Id, 'reportName': StockDocumentConstant.INVENTORY_SUMMARY_REPORT_NAME };
    this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
      SharedConstant.MODAL_DIALOG_SIZE_L);
    }
  
    PrintInventoryMovementSlip() {
      const dataToSend = { 'id': this.stockDocument.Id, 'reportName': StockDocumentConstant.INVENTORY_SLIP_SUMMARY_REPORT_NAME };
      this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
        SharedConstant.MODAL_DIALOG_SIZE_L);
      }
}
