import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import {DocumentEnumerator, documentStatusCode} from '../../../models/enumerators/document.enum';
import {DocumentConstant} from '../../../constant/sales/document.constant';
import {PagerSettings, SelectableSettings, DataStateChangeEvent} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {Observable} from 'rxjs';
import {PredicateFormat, Filter, OrderBy, OrderByDirection, Relation, Operation} from '../../../shared/utils/predicate';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {FormGroup, FormBuilder} from '@angular/forms';
import {DocumentService} from '../../../sales/services/document/document.service';
import {Router, ActivatedRoute} from '@angular/router';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ListDocumentService} from '../../../shared/services/document/list-document.service';
import {StarkPermissionsService} from '../../../stark-permissions/stark-permissions.module';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import {TranslateService} from '@ngx-translate/core';
import {FileService} from '../../../shared/services/file/file-service.service';
import {dateValueLT, dateValueGT} from '../../../shared/services/validation/validation.service';
import {isNullOrUndefined} from 'util';
import {DailySalesDeliveryReportQueryViewModel} from '../../../models/sales/daily-sales-delivery-report-query';
import {MessageService} from '../../../shared/services/signalr/message/message.service';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const START_DATE = 'StartDate';
const END_DATE = 'EndDate';

@Component({
  selector: 'app-document-control-status',
  templateUrl: './document-control-status.component.html',
  styleUrls: ['./document-control-status.component.scss']
})
export class DocumentControlStatusComponent implements OnInit {

  documentType = null;
  advencedAddLink = DocumentConstant.SALES_DELIVERY_ADD;
  translateFilterName = DocumentConstant.ALL_SALES_DELIVERY;
  public formatDateFilter = this.translate.instant(SharedConstant.FORMAT_DATE_PLACEHOLDER);
// pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  @Input() filterList: Array<documentStatusCode>;
  public statusCode = documentStatusCode;
  dataToUpdate: Observable<any>;
// Predicate proprety
  public predicate: PredicateFormat;
  /**
   * Grid state proprety
   */
  public gridState: DataSourceRequestState = this.documentListService.gridState;

  /**
   * Select grid settings
   */
  public selectableSettings: SelectableSettings;
  /**
   * Grid columns proprety
   */
  public columnsConfig: ColumnSettings[] = this.documentListService.columnsConfig;
  /**
   * Grid settingsproprety
   */
  public gridSettings: GridSettings = this.documentListService.gridSettings;

// choosenFilter name proprety
  choosenFilter: string;
  choosenFilterNumber = NumberConstant.ZERO;

  public dataToSave: any[];

  /** document Enumerator */
  documentEnumerator: DocumentEnumerator = new DocumentEnumerator();


  TermFailed = true;
  docListFormGroup: FormGroup;
  public statusList;
  public documentControlTypeList;
  public selectedDocumentControlTypeList = '[]';


  private oldStartDateValue: Date;
  private oldEndDateValue: Date;
  public minEndDate: Date;
  public maxStartDate: Date;

  public selectedRow;
  public isSuperAdminRole = false;
  public groupByCheck = false;
  public havePrintPermission = false;

  isModal = false;
  tableHeight: number;
  docPath = '';
  public permissionDoc ;

  constructor(public documentService: DocumentService, private router: Router, private swalWarrings: SwalWarring,
              public documentListService: ListDocumentService, private messageService: MessageService,
              private permissionsService: StarkPermissionsService, private rolesService: StarkRolesService,
              private translate: TranslateService, private route: ActivatedRoute, private fileService: FileService, private fb: FormBuilder,
              private cdRef: ChangeDetectorRef, public authService: AuthService) {
  }


  /**
   * ng init
   */
  ngOnInit() {
    this.havePrintPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_DOCUMENT_STATUS_CONTROL);
    this.columnsConfig[0].title = DocumentConstant.TIERS;
    this.createFormGroup();
    this.choosenFilter = this.documentListService.getChoosenFilter(this.translateFilterName);
    this.gridSettings.state.skip = 0;
    this.gridSettings.state.filter.filters = [];
    this.gridSettings.gridData = {
      data: [],
      total: 0
    };
    this.preparePredicate();
    if (this.documentListService.idClient > 0) {
      this.isModal = true;
      this.tableHeight = 650;
    }
    this.rolesService.ListRoleConfigsAsObservable().subscribe(() => {
      this.permissionsService.hasPermission(DocumentConstant.DOCUMENT_UPDATE_SUPER_ADMIN).then(x => this.isSuperAdminRole = x);
    });
  }

  /** create the form group */
  public createFormGroup(): void {
    this.docListFormGroup = this.fb.group({
      IdTiers: [undefined],
      StartDate: [undefined],
      EndDate: [undefined],
      Status: [undefined],
      DocumentControlType: [undefined],
      GroupByTiers: [undefined]
    });
    this.addDependentDateControls(this.docListFormGroup);
  }

  private addDependentDateControls(currentformGroup: FormGroup) {
    this.setStartDateControl(currentformGroup);
    this.setEndDateControl(currentformGroup);
    currentformGroup.get(START_DATE).valueChanges.subscribe(() => {
      if (currentformGroup.get(END_DATE).hasError('dateValueGT')) {
        currentformGroup.get(END_DATE).setErrors(null);
      }
    });
    currentformGroup.get(END_DATE).valueChanges.subscribe(() => {
      if (currentformGroup.get(START_DATE).hasError('dateValueLT')) {
        currentformGroup.get(START_DATE).setErrors(null);
      }
    });

  }

  private setStartDateControl(currentformGroup: FormGroup) {
    const oEndDate = new Observable<Date>(observer => observer.next(currentformGroup.get(END_DATE).value));
    currentformGroup.setControl(START_DATE, this.fb.control(currentformGroup.value.startDate,
      [dateValueLT(oEndDate)]));
  }

  private setEndDateControl(currentformGroup: FormGroup) {
    const oStartDate = new Observable<Date>(observer => observer.next(currentformGroup.get(START_DATE).value));
    currentformGroup.setControl(END_DATE, this.fb.control(currentformGroup.value.endDate,
      [dateValueGT(oStartDate)]));
  }

  changeStartDate() {
    if (this.docListFormGroup.get(START_DATE).value !== this.oldStartDateValue) {
      this.oldStartDateValue = this.docListFormGroup.get(START_DATE).value;
      if (!this.oldStartDateValue) {
        this.minEndDate = undefined;
      } else {
        this.minEndDate = this.oldStartDateValue;
      }
      this.cdRef.detectChanges();
    }
  }

  changeEndDate() {
    if (this.docListFormGroup.get(END_DATE).value !== this.oldEndDateValue) {
      this.oldEndDateValue = this.docListFormGroup.get(END_DATE).value;

      if (!this.oldEndDateValue) {
        this.maxStartDate = undefined;
      } else {
        this.maxStartDate = this.oldEndDateValue;
      }
      this.cdRef.detectChanges();
    }
  }

initGridDataSource() {
  this.documentService.reloadServerSideData(this.gridSettings.state, this.predicate,
    DocumentConstant.GET_DATASOURCE_PREDICATE_DOCUMENT_CONTROL).subscribe(res => {
      if(res.total == 0){
        this.openModal();
      }
      this.gridSettings.gridData = res;
    });
    this.documentListService.idClient = 0;
  }

  openModal(): any {
    const swalWarningMessage = `${this.translate.instant(SharedAccountingConstant.NO_RECORDS_FOUND)}`;
    return this.swalWarrings.CreateSwal(swalWarningMessage, 'INFO', 'OK', null, true);
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.searchDocuments();
    this.documentService.reloadServerSideData(state, this.predicate,
      DocumentConstant.GET_DATASOURCE_PREDICATE_DOCUMENT_CONTROL).subscribe(res => {
      this.gridSettings.gridData = res;
    });
  }


  private preparePredicate(idFromFilterSearch?: boolean): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_TYPE_CODE, Operation.eq, this.selectedDocumentControlTypeList));
    if (this.groupByCheck) {
      this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [new OrderBy(DocumentConstant.ID_TIER, OrderByDirection.desc)]);
    }
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [new OrderBy(DocumentConstant.DOCUMENT_TYPE_CODE, OrderByDirection.desc)]);
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [new OrderBy(DocumentConstant.ID_DOCUMENT, OrderByDirection.desc)]);

    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(DocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION),
      new Relation(DocumentConstant.ID_TIER_NAVIGATION), new Relation(DocumentConstant.ID_CREATOR_NAVIGATION)]);
  }


  /**
   * onChange Status PurchaseOrder
   * */
  public onChangeStatus(status: number) {
    if (status === this.statusCode.NoDocumentTypeSelected) {
      this.choosenFilter = this.translate.instant(this.translateFilterName);
    } else {
      this.choosenFilter = this.translate.instant(documentStatusCode[status].toUpperCase());
    }
    this.choosenFilterNumber = status;
    this.predicate = PredicateFormat.prepareDocumentPredicate(status, this.selectedDocumentControlTypeList);
    this.initGridDataSource();
  }


  /**
   * This method calculate startDate and endDate
   */
  prepareDate() {
    // endDate is the current date
    const endDate = new Date();
    // startDate is a previous month
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    this.maxStartDate = endDate;
    this.minEndDate = startDate;
    // set form control
    this.docListFormGroup.controls[START_DATE].setValue(startDate);
    this.docListFormGroup.controls[END_DATE].setValue(endDate);
  }


  searchDocuments() {
    this.preparePredicate(this.docListFormGroup.controls['Status'].value !== undefined
      && this.docListFormGroup.controls['Status'].value !== null);
    if (this.docListFormGroup.controls['Status'].value) {
      this.predicate.Filter.push(new Filter(DocumentConstant.ID_DOCUMENT_STATUS, Operation.eq,
        this.docListFormGroup.controls['Status'].value));
    }

    if (this.docListFormGroup.controls['DocumentControlType'].value) {
      // this.predicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_TYPE_CODE, Operation.eq,this.docListFormGroup.controls['DocumentControlType'].value));
      this.predicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_TYPE_CODE, Operation.eq,
        this.selectedDocumentControlTypeList));
    }

    if (this.docListFormGroup.controls['IdTiers'].value) {
      this.predicate.Filter.push(new Filter(DocumentConstant.ID_TIERS, Operation.eq,
        this.docListFormGroup.controls['IdTiers'].value));
    }

    if (this.docListFormGroup.controls['EndDate'].value) {

      let endDate = this.docListFormGroup.controls['EndDate'].value;
      this.predicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_DATE, Operation.lte,
        new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()))));
    }

    if (this.docListFormGroup.controls['StartDate'].value) {
      let startDate = this.docListFormGroup.controls['StartDate'].value;
      this.predicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_DATE, Operation.gte,
        new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()))));
    }
    this.initGridDataSource();
  }

  getValidDeliveryFromTiers() {

    this.docListFormGroup.controls['IdTiers'].setValue(this.documentListService.idClient);
    this.docListFormGroup.controls['Status'].setValue(documentStatusCode.Valid);
    this.searchDocuments();
  }

  clickSearch() {
    this.gridSettings.state.skip = 0;
    this.searchDocuments();
  }

  printDocument() {
    const idtiers = this.docListFormGroup.controls['IdTiers'].value;
    const idstatus = this.docListFormGroup.controls['Status'].value;
    const idtype = this.selectedDocumentControlTypeList;
    const groupbytiers = this.docListFormGroup.controls['GroupByTiers'].value === true ? 1 : -1;
    const startdate = this.docListFormGroup.controls['StartDate'].value;
    const enddate = this.docListFormGroup.controls['EndDate'].value;
    const queryvm = new DailySalesDeliveryReportQueryViewModel();
    queryvm.ListTiers = idtiers;
    queryvm.StartDate = startdate;
    queryvm.EndDate = enddate;
    queryvm.IdStatus = idstatus;
    queryvm.IdType = idtype;
    queryvm.GroupByTiers = groupbytiers;

    const dataToSend = {
      'idtiers': isNullOrUndefined(idtiers) ? -1 : idtiers,
      'idstatus': isNullOrUndefined(idstatus) ? -1 : idstatus,
      'idtype': isNullOrUndefined(idtype) ? '[-1]' : idtype,
      'groupbytiers': isNullOrUndefined(groupbytiers) ? -1 : groupbytiers,
      'startdate': startdate ? new Date(startdate.getFullYear(), startdate.getMonth(), startdate.getDate()) : undefined,
      'enddate': enddate ? new Date(enddate.getFullYear(), enddate.getMonth(), enddate.getDate()) : undefined,
      'printType': -1,
      'reportName': DocumentConstant.DOCUMENT_CONTROL_STATUS_REPORT_NAME
    };
    this.downloadReport(dataToSend);

    this.gridSettings.state.skip = 0;
    this.searchDocuments();

  }

/// Download Report
  public downloadReport(dataItem): void {
    this.documentService.downloadDocumentControlStatusReport(dataItem).subscribe(
      res => {
        this.fileService.downLoadFile(res.objectData);
      });
  }

printJasperDocument() {
  const idtiers = this.docListFormGroup.controls['IdTiers'].value;
  const idstatus = this.docListFormGroup.controls['Status'].value;
  const idtype = this.selectedDocumentControlTypeList == "[]" ? "" : this.selectedDocumentControlTypeList.replace('[', '').replace(']', '') ;
  const groupbytiers = this.docListFormGroup.controls['GroupByTiers'].value === true ? 1 : -1;
  const startdate = this.docListFormGroup.controls['StartDate'].value;
  const enddate = this.docListFormGroup.controls['EndDate'].value;
  const queryvm = new DailySalesDeliveryReportQueryViewModel();
  queryvm.ListTiers = idtiers;
  queryvm.StartDate = startdate;
  queryvm.EndDate = enddate;
  queryvm.IdStatus = idstatus;
  queryvm.IdType = idtype;
  queryvm.GroupByTiers = groupbytiers;

  const params = {
    idtiers: isNullOrUndefined(idtiers) ? -1 : idtiers,
    idstatus: isNullOrUndefined(idstatus) ? -1 : idstatus,
    idtype: (isNullOrUndefined(idtype) || !idtype) ? "-1" : idtype,
    groupbytiers: isNullOrUndefined(groupbytiers) ? -1 : groupbytiers,
    startdate:startdate ? startdate.getFullYear() + ',' +  (startdate.getMonth() + NumberConstant.ONE) + ',' + startdate.getDate() : "-1",
    enddate: enddate ? enddate.getFullYear() + ',' + (enddate.getMonth()+ NumberConstant.ONE) + ',' + enddate.getDate() : "-1"
  };

    const dataToSend = {
      'reportName': DocumentConstant.DOCUMENT_CONTROL_STATUS_REPORT_NAME,
      'documentName': 'Etat de Controle',
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'PrintType': -1,
      'reportparameters': params
    };

    this.downloadJasperReport(dataToSend);

    this.gridSettings.state.skip = 0;
    this.searchDocuments();

  }

/// Download Report
  public downloadJasperReport(dataItem): void {
    this.documentService.downloadJasperDocumentControlStatusReport(dataItem).subscribe(
      res => {
        this.fileService.downLoadFile(res.objectData);
      });
  }

  /** show quantity details*/
  documentRowDetails($event) {
    this.selectedRow = $event;
  }


  recieveDefaultStatus($event) {

  }

  recieveDefaultType($event) {
    if ($event) {
      this.selectedDocumentControlTypeList = '[' + $event + ']';
    } else {
      this.selectedDocumentControlTypeList = '[]';
    }
  }

  public onClickGroupBy() {
    this.groupByCheck = !this.groupByCheck;
    this.docListFormGroup.controls['GroupByTiers'].patchValue(this.groupByCheck ? 'checked' : null);
  }

  public get isGroupByChecked(): boolean {
    return this.groupByCheck;
  }

  showDocument(document) {
    let url: string;
    this.getDocPathOrigin(document);
    if(this.authService.hasAuthority(this.permissionDoc)){
    if (document.DocumentTypeCode == DocumentEnumerator.PurchaseRequest && document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT) {
      url = this.docPath.concat('/').concat(DocumentConstant.SHOW).concat('/').concat(document.Id);
    } else if (document.DocumentTypeCode == DocumentEnumerator.PurchaseRequest) {
      url = this.docPath.concat('/').concat('edit').concat('/').concat(document.Id);
    } else if (document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT) {
      url = this.docPath.concat('/').concat(DocumentConstant.SHOW).concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
    } else {
      url = this.docPath.concat('/').concat('edit').concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
    }
    if (this.isModal) {
      window.open(DocumentConstant.SALES_DELIVERY_URL.concat(url));
    } else {
      this.router.navigate(['main/' + url]);
    }
  }
  }

  getDocPathOrigin(document) {
    if (document.DocumentTypeCode == DocumentEnumerator.SalesOrder) {
      this.docPath = 'sales/order';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_ORDER_SALES : PermissionConstant.CommercialPermissions.UPDATE_ORDER_SALES
    } else if (document.DocumentTypeCode == DocumentEnumerator.PurchaseOrder) {
      this.docPath = 'purchase/purchaseorder';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_ORDER_QUOTATION_PURCHASE : PermissionConstant.CommercialPermissions.UPDATE_ORDER_QUOTATION_PURCHASE
    } else if (document.DocumentTypeCode == DocumentEnumerator.SalesDelivery) {
      this.docPath = 'sales/delivery';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_DELIVERY_SALES : PermissionConstant.CommercialPermissions.UPDATE_DELIVERY_SALES
    } else if (document.DocumentTypeCode == DocumentEnumerator.PurchaseDelivery) {
      this.docPath = 'purchase/delivery';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_RECEIPT_PURCHASE : PermissionConstant.CommercialPermissions.UPDATE_RECEIPT_PURCHASE
    } else if (document.DocumentTypeCode == DocumentEnumerator.SalesInvoices) {
      this.docPath = 'sales/invoice';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES : PermissionConstant.CommercialPermissions.UPDATE_INVOICE_SALES
    } else if (document.DocumentTypeCode == DocumentEnumerator.PurchaseInvoices) {
      this.docPath = 'purchase/invoice';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_INVOICE_PURCHASE : PermissionConstant.CommercialPermissions.UPDATE_INVOICE_PURCHASE
    } else if (document.DocumentTypeCode == DocumentEnumerator.SalesQuotations) {
      this.docPath = 'sales/quotation';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_QUOTATION_SALES : PermissionConstant.CommercialPermissions.UPDATE_QUOTATION_SALES
    } else if (document.DocumentTypeCode == DocumentEnumerator.PurchasesQuotations) {
      this.docPath = 'purchase/quotation';
    } else if (document.DocumentTypeCode == DocumentEnumerator.SalesAsset) {
      this.docPath = 'sales/asset';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_ASSET_SALES : PermissionConstant.CommercialPermissions.UPDATE_ASSET_SALES
    } else if (document.DocumentTypeCode == DocumentEnumerator.PurchaseAsset) {
      this.docPath = 'purchase/asset';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_ASSET_PURCHASE : PermissionConstant.CommercialPermissions.UPDATE_ASSET_PURCHASE
    } else if (document.DocumentTypeCode == DocumentEnumerator.PurchaseFinalOrder) {
      this.docPath = 'purchase/purchasefinalorder';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_FINAL_ORDER_PURCHASE : PermissionConstant.CommercialPermissions.UPDATE_FINAL_ORDER_PURCHASE
    } else if (document.DocumentTypeCode == DocumentEnumerator.SalesInvoiceAsset) {
      this.docPath = 'sales/invoiceasset';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_INVOICE_ASSET_SALES : PermissionConstant.CommercialPermissions.UPDATE_INVOICE_ASSET_SALES
    } else if (document.DocumentTypeCode == DocumentEnumerator.BE) {
      this.docPath = 'stockCorrection/be';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_ADMISSION_VOUCHERS : PermissionConstant.CommercialPermissions.UPDATE_ADMISSION_VOUCHERS
    } else if (document.DocumentTypeCode == DocumentEnumerator.BS) {
      this.docPath = 'stockCorrection/bs';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_EXIT_VOUCHERS : PermissionConstant.CommercialPermissions.UPDATE_EXIT_VOUCHERS
    } else if (document.DocumentTypeCode == DocumentEnumerator.PurchaseRequest) {
      this.docPath = 'purchase/purchaserequest';
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_PURCHASE_REQUEST : PermissionConstant.CommercialPermissions.UPDATE_PURCHASE_REQUEST
    }

  }
}
