import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {linesToAdd, StockDocumentsService} from '../../../inventory/services/stock-documents/stock-documents.service';
import {Filter, Operation, Operator, PredicateFormat} from '../../../shared/utils/predicate';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {DataStateChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {ActivatedRoute, Router} from '@angular/router';
import {StockDocumentConstant} from '../../../constant/inventory/stock-document.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {process} from '@progress/kendo-data-query';
import {dateValueGT, dateValueLT, ValidationService} from '../../../shared/services/validation/validation.service';
import {StockDocument} from '../../../models/inventory/stock-document.model';
import {ObjectToValidate} from '../../../models/sales/object-to-save.model';
import {InformationTypeEnum} from '../../../shared/services/signalr/information/information.enum';
import {MessageService} from '../../../shared/services/signalr/message/message.service';
import {Subscription} from 'rxjs/Subscription';
import {ItemWarehouse} from '../../../models/inventory/item-warehouse.model';
import {isNullOrUndefined} from 'util';
import {IModalDialogOptions} from 'ngx-modal-dialog';
import {ReportingInModalComponent} from '../../../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {SalesInventoryDocumentLine} from '../../../models/inventory/sales-inventory-document-line.model';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {Observable} from 'rxjs/Observable';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {DailySalesLine} from '../../../models/inventory/daily-sales-line.model';
import {DocumentService} from '../../services/document/document.service';
import {FileService} from '../../../shared/services/file/file-service.service';
import {DatePipe} from '@angular/common';
import {StyleConstant} from '../../../constant/utility/style.constant';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import {FiltrePredicateModel} from '../../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../../constant/shared/fieldType.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const MIN_DATE_FILTER = 1753;

@Component({
  selector: 'app-list-daily-sales-inventory-movement',
  templateUrl: './list-daily-sales-inventory-movement.component.html',
  styleUrls: ['./list-daily-sales-inventory-movement.component.scss']
})

export class ListDailySalesInventoryMovementComponent implements OnInit, OnDestroy{

  dailySalesInventoryMovementForm: FormGroup;
  formGroup: FormGroup;
  warehouseAssociatedToItems: number;
  public selectedRow;
  public selectedElement: DailySalesLine;
  public selectedItem: number;

  public counter = linesToAdd.length;
  public view: DailySalesLine[];
  private stockDocument: StockDocument;
  @Input()
  public modalOptions: Partial<IModalDialogOptions<any>>;
  @Input()
  public isModal = false;
  isBtnClicked = false;
  ShowWarehouse = true;
  public predicate: PredicateFormat[];
  public Searchpredicate: PredicateFormat;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public swalNotif: SwalWarring;
  datePipe = new DatePipe('en-US');
  private oldStartDateValue: Date;
  private oldEndDateValue: Date;
  public minEndDate: Date;
  public maxStartDate: Date;
  public canChangeServiceDate: boolean = true;
  public isValidDateStart = true;
  public isValidDateEnd = true;
  filterArray: Array<Filter>;
  operator: Operator;
  public gridSettings: GridSettings = {
    state: this.stockDocumentsService.gridState,
    columnsConfig: this.stockDocumentsService.dailyInventoryColumnsConfig
  };

  public isUserInListRole;

  public maxDate: Date = new Date();
  public minDate: Date = new Date(this.maxDate.getFullYear(), 0, 1);
  public currentStockDate = `${this.translate.instant(StockDocumentConstant.ID_ITEM_NAVIGATION_ACTUALQUANTITY_TITLE)}` + new Date();

  /*
   * is updateMode
   */
  public isGeneratedDailyInventory: boolean;
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
  reference: string;
  constaines = true;
  filteredData;
  totalData;
  isFiltred;
  public startDateToSend;
  public endDateToSend ;
  public choosenWarehouse;

  public fieldsetBorderShowed = StyleConstant.BORDER_SOLID;
  public fieldsetBorderHidden = StyleConstant.BORDER_NONE;
  public isDetailsContentVisible = true;
  public fieldsetBorderStyle: string;

  public journalSales;
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];
  /**
   * advanced search predicate
   */
  public predicateAdvancedSearch: PredicateFormat;
  public predicateQuickSearch: PredicateFormat;
  hasPrintPermission = false;

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private formBuilder: FormBuilder, public stockDocumentsService: StockDocumentsService,
    public documentService: DocumentService, public fileService: FileService, private router: Router,
    public translate: TranslateService, public validationService: ValidationService, private messageService: MessageService,
    private modalService: ModalDialogInstanceService, private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef, private cdRef: ChangeDetectorRef, private growlService: GrowlService,
    private activatedRoute: ActivatedRoute, private swalWarrings: SwalWarring, public datepipe: DatePipe,
    private authService: AuthService) {
    this.idSubscription = this.activatedRoute.params.subscribe(() => {
    });
    this.isAdminUser = false;
    this.fieldsetBorderStyle = this.fieldsetBorderShowed;
  }


  ngOnInit() {
    this.hasPrintPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_SALES_JOURNAL);
    this.view = this.stockDocumentsService.LinesToAdd();
    this.createAddForm();
    this.initFiltreConfig();
    this.predicateAdvancedSearch = PredicateFormat.prepareEmptyPredicate();
    this.predicateQuickSearch = PredicateFormat.prepareEmptyPredicate();
    this.predicate = [];
  }

  /**
   * create add form
   * */
  private createAddForm(): void {
    this.dailySalesInventoryMovementForm = this.formBuilder.group({
      Id: [0],
      Code: [''],
      StartDocumentDate: [new Date(), Validators.required],
      EndDocumentDate: [new Date()],
      IdWarehouseSource: [undefined],
      reference: ['']
    });
    this.addDependentDateControls();
    const yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date);
    this.dailySalesInventoryMovementForm.controls[StockDocumentConstant.START_DOCUMENT_DATE].setValue(yesterday);
    this.dailySalesInventoryMovementForm.controls[StockDocumentConstant.END_DOCUMENT_DATE].setValue(new Date());
  }

  /**
   * add Aquisition date & service date
   * */
  private addDependentDateControls(): void {
    this.setStarDateControl();
    this.setEndDateControl();
    this.StartDate.valueChanges.subscribe(() => {
      if (this.EndDate.hasError(StockDocumentConstant.DATE_VALUE_GT)) {
        this.EndDate.setErrors(null);
      }
    });
    this.EndDate.valueChanges.subscribe(() => {
      if (this.StartDate.hasError(StockDocumentConstant.DATE_VALUE_LT)) {
        this.StartDate.setErrors(null);
      }
    });
  }

  /**
   * set service date control
   * */
  private setEndDateControl(): void {
    const oAcquisationDate = new Observable<Date>(observer => observer.next(this.StartDate.value));
    this.dailySalesInventoryMovementForm.setControl(StockDocumentConstant.END_DOCUMENT_DATE, this.formBuilder.control(undefined,
      [dateValueGT(oAcquisationDate)]));
  }
  /**
   * set aquistion date control
   * */
  private setStarDateControl(): void {
    const oServiceDate = new Observable<Date>(observer => observer.next(this.EndDate.value));
    this.dailySalesInventoryMovementForm.setControl(StockDocumentConstant.START_DOCUMENT_DATE, this.formBuilder.control(undefined,
      [Validators.required, dateValueLT(oServiceDate)]));
  }

  /** form gettes */
  get EndDate(): FormControl {
    return this.dailySalesInventoryMovementForm.get(StockDocumentConstant.END_DOCUMENT_DATE) as FormControl;
  }
  public get StartDate(): FormControl {
    return this.dailySalesInventoryMovementForm.get(StockDocumentConstant.START_DOCUMENT_DATE) as FormControl;
  }

  /**
   * Change min value of service date
   * */
  public onChangeStartDate(value: Date): void {
    if (this.dailySalesInventoryMovementForm.get(StockDocumentConstant.START_DOCUMENT_DATE).value !== this.oldStartDateValue) {
      this.oldStartDateValue = this.dailySalesInventoryMovementForm.get(StockDocumentConstant.START_DOCUMENT_DATE).value;
      this.minEndDate = this.dailySalesInventoryMovementForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value;
      this.cdRef.detectChanges();
    }
  }

  public changeDate() {
    if (this.dailySalesInventoryMovementForm.get(StockDocumentConstant.START_DOCUMENT_DATE) && this.dailySalesInventoryMovementForm.get(StockDocumentConstant.START_DOCUMENT_DATE).value) {
      const dateStart = this.dailySalesInventoryMovementForm.get(StockDocumentConstant.START_DOCUMENT_DATE).value;
      if (dateStart.getFullYear() < MIN_DATE_FILTER) {
        this.isValidDateStart = false;
        this.growlService.warningNotification(this.translate.instant('INVALID_START_DATE'));
      } else {
        this.isValidDateStart=true ;
        this.dailySalesInventoryMovementForm.get(StockDocumentConstant.START_DOCUMENT_DATE).setValue(new Date(Date.UTC(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate())));
      }
    }

    if (this.dailySalesInventoryMovementForm.get(StockDocumentConstant.END_DOCUMENT_DATE) && this.dailySalesInventoryMovementForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value) {
      const dateEnd = this.dailySalesInventoryMovementForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value;
      if (dateEnd.getFullYear() < MIN_DATE_FILTER) {
        this.isValidDateEnd = false;
        this.growlService.warningNotification(this.translate.instant('INVALID_END_DATE'));
      } else {
        this.isValidDateEnd= true;
        this.dailySalesInventoryMovementForm.get(StockDocumentConstant.END_DOCUMENT_DATE).setValue(new Date(Date.UTC(dateEnd.getFullYear(),
          dateEnd.getMonth(), dateEnd.getDate())));
      }
    }
  }
  /**
   * Change max value of Acquisation date
   * */
  onChangeEndDate(value: Date): void {
    this.canChangeServiceDate = true;
    if (this.dailySalesInventoryMovementForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value !== this.oldEndDateValue) {
      if (this.canChangeServiceDate) {
        this.oldEndDateValue = this.dailySalesInventoryMovementForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value;
        this.maxStartDate = this.dailySalesInventoryMovementForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value;
        this.cdRef.detectChanges();
      } else {
        this.growlService.ErrorNotification(this.translate.instant('CHECK_ASSIGNMENT_BEFORE_CHANGE_DATE'));
        this.dailySalesInventoryMovementForm.get(StockDocumentConstant.END_DOCUMENT_DATE).setValue(this.oldEndDateValue);
      }
    }
  }


  /**
   * Grid data source initiation, and filter
   * */
  public loadGridDataSource(isQuickSearch?) {
    let startDate: Date = this.dailySalesInventoryMovementForm.controls[StockDocumentConstant.START_DOCUMENT_DATE].value;
    let endDate: Date = this.dailySalesInventoryMovementForm.controls[StockDocumentConstant.END_DOCUMENT_DATE].value;
    var pipeDate = new DatePipe("en-US");
    this.startDateToSend = pipeDate.transform(startDate, "yyyy-MM-dd");
    this.endDateToSend = pipeDate.transform(endDate, "yyyy-MM-dd");
    this.choosenWarehouse = this.dailySalesInventoryMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_SOURCE].value

    this.setPredicateFiltre(isQuickSearch);
    this.stockDocumentsService.GetStockDailyDocumentLineList(this.predicate).
    subscribe(result => {
      if (result.listData.length == NumberConstant.ZERO) {
        this.swalWarrings.CreateSwal(StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_NOTEXISTING_INVENTORY_MOVEMENT_ITEMS,
          'INFO', 'OK', '', true, true);
      }
        this.totalData = result.listData;
        this.prepareList(result);

    });
  }


  //  /**
  //   *  Go to edit form
  //   * @param id
  //   */
  public goToAdvancedEdit(id: number) {
    this.router.navigateByUrl(StockDocumentConstant.URI_INVENTORY_EDIT.concat(id.toString()));
  }

  /**
   * data state change
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    if (this.gridSettings) {
      this.gridSettings.state = state;
      this.loadItem(this.gridSettings);
    }
  }

  private loadItem(gridSettings?, isFiltred?): void {
    if (gridSettings) {
      this.gridSettings.state = gridSettings.state;
      this.gridSettings.gridData.data = gridSettings.gridData.data;
      if (isFiltred) {
        const totalData = this.gridSettings.gridData.data;
        this.gridSettings.gridData = process(totalData, this.gridSettings.state);
      } else {
        const totalData = Object.assign([], this.totalData);
        this.gridSettings.gridData = process(totalData, this.gridSettings.state);
      }
    } else {
      const totalData = Object.assign([], this.totalData);
      this.gridSettings.gridData = process(totalData, this.gridSettings.state);
    }
  }

  prepareList(result) {
    const state = this.stockDocumentsService.gridState;
    state.skip = 0;
    state.take = this.gridSettings.state.take;
    state.filter = this.gridSettings.state.filter;
    state.group = this.gridSettings.state.group;
    state.sort = this.gridSettings.state.sort;
    const Process = !isNullOrUndefined(result.data) ? process(result.data, state) :
      !isNullOrUndefined(result.listData) ? process(result.listData, state) : null;

    if (!isNullOrUndefined(result) && !isNullOrUndefined(Process)) {

      /* Regroup returned data */
      if (Process.data.length > 0 && Process.data[NumberConstant.ZERO].ActualQuantity === NumberConstant.MINUS_ONE) {
        this.gridSettings.columnsConfig[NumberConstant.THREE].hidden = true;
      }
      this.view = result.listData;
      this.loadItem();
    } else {
      this.gridSettings.gridData = null;
    }

    if (!isNullOrUndefined(this.gridSettings.gridData)
      && !isNullOrUndefined(this.gridSettings.gridData.total)
      && this.gridSettings.gridData.total > 0) {
      this.isGeneratedDailyInventory = true;
    } else {
      this.isGeneratedDailyInventory = false;
      this.swalWarrings.CreateSwal(StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_NOTEXISTING_INVENTORY_MOVEMENT_ITEMS,
        'INFO', 'OK', '', true, true);
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

  private loadListofArticles(): void {
    this.loadGridDataSource();
  }

  generateDailyInventory() {
    if (this.dailySalesInventoryMovementForm.valid) {
      if ((this.StartDate.valid && this.EndDate.valid && this.StartDate.value <= this.EndDate.value && this.isValidDateStart && this.isValidDateEnd)
        || (!this.StartDate.hasError(StockDocumentConstant.DATE_VALUE_LT) && this.isValidDateStart && this.isValidDateEnd)) {
        if (this.dailySalesInventoryMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_SOURCE].value !== null) {
          if (this.dailySalesInventoryMovementForm.controls[StockDocumentConstant.END_DOCUMENT_DATE].value) {
            this.currentStockDate = `${this.translate.instant(StockDocumentConstant.ID_ITEM_NAVIGATION_ACTUALQUANTITY_TITLE)}` + this.dailySalesInventoryMovementForm.controls[StockDocumentConstant.END_DOCUMENT_DATE].value;
          }
          this.loadListofArticles();
        } else {
          this.swalWarrings.CreateSwal(StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_INVALID_DATE, 'INFO', 'OK', '', true, true);
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant('CHECK_ASSIGNMENT_BEFORE_CHANGE_DATE'));
      }
    } else {
      this.validationService.validateAllFormFields(this.dailySalesInventoryMovementForm);
    }

  }


  PrintDailyInventoryMovementReport() {
    if (this.isGeneratedDailyInventory) {
      const dataToSend = { 'id': this.stockDocument.Id, 'reportName': StockDocumentConstant.DAILY_INVENTORY_SUMMARY_REPORT_NAME };
      this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
        SharedConstant.MODAL_DIALOG_SIZE_L);
    } else {
      this.messageService.startSendMessage(null, InformationTypeEnum.INVENTORY_INVENTORY_MVT_PRINT_REPORT, null, false);
    }
  }

  PrintDailyInventoryMovementSlip() {

    if (this.isGeneratedDailyInventory) {
      const dataToSend = { 'id': this.stockDocument.Id, 'reportName': StockDocumentConstant.DAILY_INVENTORY_SLIP_SUMMARY_REPORT_NAME };
      this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
        SharedConstant.MODAL_DIALOG_SIZE_L);
    } else {
      this.messageService.startSendMessage(null, InformationTypeEnum.INVENTORY_INVENTORY_MVT_PRINT_SLIP, null, false);
    }
  }

  getItemId($event) {
    this.isBtnClicked = true;
  }

  /**
   *
   * */
  public dbCellClick(): void {
    if (this.isModal && this.modalOptions) {
      this.modalOptions.data = this.selectedItem;
      this.modalOptions.onClose();
    }
    this.modalService.closeAnyExistingModalDialog();
  }

  /** show quantity details*/
  quantityDetails($event) {
    this.selectedRow = $event;
  }

  /**
   * @param event
   */
  public selectRow(event: any) {
    this.selectedElement = event.selectedRows[0].dataItem;

    if (this.isModal && this.modalOptions) {
      this.selectedItem = event.selectedRows[0].dataItem.Id;
    }
    if (this.isBtnClicked === true) {
      this.dbCellClick();
      this.isBtnClicked = false;
    }
  }

  /**if purchaseHistory selected*/
  showWarehouseDropdown() {
    this.ShowWarehouse = !this.ShowWarehouse;
  }

  PrintDailySalesReport() {
    const idwarehousereport = this.dailySalesInventoryMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_SOURCE].value;
    if (this.isGeneratedDailyInventory) {
      const dataToSend = {
        'idwarehouse': this.ShowWarehouse ? (idwarehousereport ? idwarehousereport : -1) : -1,
        'startdate': this.StartDate.value ? new Date(this.StartDate.value.getFullYear(), this.StartDate.value.getMonth(), this.StartDate.value.getDate()) : undefined,
        'enddate': this.EndDate.value ? new Date(this.EndDate.value.getFullYear(), this.EndDate.value.getMonth(), this.EndDate.value.getDate()) : undefined,
        'printType': -1,
        'reportName': StockDocumentConstant.DAILY_SALES_SUMMARY_REPORT_NAME
      };
      //dataToSend = JSON.parse(JSON.stringify(dataToSend));
      this.downloadReport(dataToSend);
      // this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
      //   SharedConstant.MODAL_DIALOG_SIZE_L);
    } else {
      this.messageService.startSendMessage(null, InformationTypeEnum.INVENTORY_INVENTORY_MVT_PRINT_REPORT, null, false);
    }
  }

  PrintJasperDailySalesReport() {
    const idwarehousereport = this.dailySalesInventoryMovementForm.controls[StockDocumentConstant.ID_WAREHOUSE_SOURCE].value;
    if (this.isGeneratedDailyInventory) {

      const params = {
        idwarehouse: this.choosenWarehouse,
        startdate: this.startDateToSend ? this.startDateToSend : undefined,
        enddate: this.endDateToSend ? this.endDateToSend : undefined,
      };
      const documentName = this.translate.instant(StockDocumentConstant.ACCOUNTING_SALES_JOURNAL)
        .concat(SharedConstant.UNDERSCORE).concat(this.datePipe.transform(new Date(this.StartDate.value), 'dd/MM/yyyy'))
        .concat(SharedConstant.UNDERSCORE).concat(this.datePipe.transform(new Date(this.EndDate.value), 'dd/MM/yyyy'));
      const dataToSend = {
        'reportName' : StockDocumentConstant.DAILY_SALES_SUMMARY_REPORT_NAME,
        'documentName' : documentName,
        'reportFormatName' : 'pdf',
        'printCopies' : 1,
        'PrintType' : -1,
        'reportparameters' : params
      };


      this.downloadJasperReport(dataToSend);
    } else {
      this.messageService.startSendMessage(null, InformationTypeEnum.INVENTORY_INVENTORY_MVT_PRINT_REPORT, null, false);
    }
  }

  /// Download Invoice
  public downloadReport(dataItem): void {
    this.documentService.downloadDailySalesReport(dataItem).subscribe(
      res => {
        this.fileService.downLoadFile(res.objectData);
      });
  }

  /// Download Invoice
  public downloadJasperReport(dataItem): void {
    this.documentService.downloadJasperDailySalesReport(dataItem).subscribe(
      res => {
        this.fileService.downLoadFile(res.objectData);
      });
  }

  setEqualValue() {
    this.constaines = !this.constaines;
  }
  pressKeybordEnter($event) {
    if ($event) {
      this.filter($event.target.value);
    }
  }
  filter(value) {
    if (value) {
      this.reference = value;
    }
    this.filteredData = [];
    let allDatas = this.totalData;
    if (this.reference) {
      this.reference = this.reference.trim();
      if (this.constaines) {
        this.filteredData = allDatas.filter(p => (p.CodeItem === this.reference));
      } else {
        this.filteredData = allDatas.filter(p => (p.CodeItem.includes(this.reference)));
      }
      this.gridSettings.gridData.data = this.filteredData;
      this.gridSettings.state.skip = NumberConstant.ZERO;
      this.gridSettings.gridData.total = this.gridSettings.gridData.data.length;
      this.isFiltred = true;
      this.loadItem(this.gridSettings, this.isFiltred);
    } else {
      this.gridSettings.gridData.data = allDatas;
      this.gridSettings.state.skip = NumberConstant.ZERO;
      this.gridSettings.gridData.total = this.gridSettings.gridData.data.length;
      this.isFiltred = false;
      this.loadItem(this.gridSettings, this.isFiltred);
    }
  }
  public showDetailsContent() {
    this.isDetailsContentVisible = true;
    this.fieldsetBorderStyle = this.fieldsetBorderShowed;
  }

  public hideDetailsContent() {
    this.isDetailsContentVisible = false;
    this.fieldsetBorderStyle = this.fieldsetBorderHidden;
  }

  public pictureTierSrc(dataItem) {
    if (dataItem.PictureFileInfo) {
      return SharedConstant.PICTURE_BASE.concat((String)(dataItem.PictureFileInfo.Data));
    }
  }
  public filtere() {
    this.predicateQuickSearch = new PredicateFormat();
    this.predicateQuickSearch.Filter =  new Array<Filter>();
    this.predicateQuickSearch.Filter.push(new Filter(StockDocumentConstant.ID_ITEM_NAVIGATION_CODE_FIELD_ITEM, Operation.contains, this.journalSales, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(StockDocumentConstant.ID_ITEM_NAVIGATION_DESCRIPTION_FIELD_ITEM, Operation.contains, this.journalSales, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(StockDocumentConstant.WAREHOUSE_NAME, Operation.contains, this.journalSales, false, true));
    this.predicateQuickSearch.Filter.push(new Filter( StockDocumentConstant.SHELF_FIELD, Operation.contains, this.journalSales, false, true));
    this.predicateQuickSearch.Filter.push(new Filter( StockDocumentConstant.STORAGE_FIELD, Operation.contains, this.journalSales, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(StockDocumentConstant.ID_ITEM_NAVIGATION_AVAILABLEQUANTITY_FIELD, Operation.contains, this.journalSales, false, true));
    this.predicateQuickSearch.Filter.push(new Filter(StockDocumentConstant.ID_ITEM_NAVIGATION_SOLDQUANTITY_FIELD, Operation.contains, this.journalSales, false, true));
    this.loadGridDataSource(true);
  }

  /**
   * Reset dataGrid
   */
  resetClickEvent() {
    this.predicateQuickSearch = PredicateFormat.prepareEmptyPredicate();
    this.predicateAdvancedSearch = PredicateFormat.prepareEmptyPredicate();
    this.loadGridDataSource();
  }
  resetFiltre() {
    this.predicateQuickSearch = PredicateFormat.prepareEmptyPredicate();
    this.predicateAdvancedSearch = PredicateFormat.prepareEmptyPredicate();
  }
  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  /**
   * get array<Filtre> from advancedSearchComponenet
   * remove old filter property from the predicate filter list
   * case filtre type date between
   * @param filtre
   */
  getFiltrePredicate(filtre) {
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
  }

  private prepareSpecificFiltreFromAdvancedSearch(filtre) {
    if (filtre.SpecificFiltre && !filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
      this.predicateAdvancedSearch.SpecFilter.push(filtre.SpecificFiltre);
    } else if (filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
    }
  }

  /**
   * case filtre date between : we don't remove the old filtre date value
   * @param filtre
   * @private
   */
  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.prepareDatesFiltres(filtreFromAdvSearch);
    } else if (filtreFromAdvSearch.operation && !isNullOrUndefined(filtreFromAdvSearch.value) && filtreFromAdvSearch.value && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
  }

  private prepareDatesFiltres(filtreFromAdvSearch) {
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ZERO].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
    }
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ONE].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    }
  }

  private setPredicateFiltre(isQuickSearch) {
    this.predicate = [];
    this.predicate.push(PredicateFormat.prepareDailySalesPredicate(this.dailySalesInventoryMovementForm));
    if (isQuickSearch) {
      this.predicateQuickSearch.Operator = Operator.or;
      this.predicate.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicate.push(this.predicateAdvancedSearch);
    }
  }


  searchClick() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.loadGridDataSource();
  }

  public initFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(StockDocumentConstant.ID_ITEM_NAVIGATION_CODE_TITLE, FieldTypeConstant.TEXT_TYPE,
      StockDocumentConstant.ID_ITEM_NAVIGATION_CODE_FIELD_ITEM));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(StockDocumentConstant.ID_ITEM_NAVIGATION_DESCRIPTION_TITLE, FieldTypeConstant.TEXT_TYPE,
      StockDocumentConstant.ID_ITEM_NAVIGATION_DESCRIPTION_FIELD_ITEM));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(StockDocumentConstant.ID_WAREHOUSE_TITLE , FieldTypeConstant.TEXT_TYPE,
      StockDocumentConstant.WAREHOUSE_NAME));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(StockDocumentConstant.SHELF_TITLE, FieldTypeConstant.TEXT_TYPE,
      StockDocumentConstant.SHELF_FIELD));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(StockDocumentConstant.STORAGE_TITLE, FieldTypeConstant.TEXT_TYPE,
      StockDocumentConstant.STORAGE_FIELD));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(StockDocumentConstant.ID_ITEM_NAVIGATION_ACTUALQUANTITY_TITLE, FieldTypeConstant.numerictexbox_type,
      StockDocumentConstant.ID_ITEM_NAVIGATION_AVAILABLEQUANTITY_FIELD));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(StockDocumentConstant.ID_ITEM_NAVIGATION_SOLDQUANTITY_TITLE, FieldTypeConstant.numerictexbox_type,
      StockDocumentConstant.ID_ITEM_NAVIGATION_SOLDQUANTITY_FIELD));
  }
}
