import { Component, ComponentRef, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import swal from 'sweetalert2';
import { CounterSalesConstant } from '../../../../constant/sales/counter-sales.constant';
import { DocumentConstant } from '../../../../constant/sales/document.constant';
import { FieldTypeConstant } from '../../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { TicketConstant } from '../../../../constant/treasury/ticket.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { CashRegisterItemTypeEnumerator, CashRegisterTypeEnum } from '../../../../models/enumerators/cash-managment-hierarchy-test-data.enum';
import { DocumentEnumerator, documentStatusCode, DocumentTypesEnumerator, InvoicingTypeEnumerator } from '../../../../models/enumerators/document.enum';
import { Document } from '../../../../models/sales/document.model';
import { FiltrePredicateModel } from '../../../../models/shared/filtrePredicate.model';
import { CashRegister } from '../../../../models/treasury/cash-register.model';
import { DocumentService } from '../../../../sales/services/document/document.service';
import { FileService } from '../../../../shared/services/file/file-service.service';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat, Relation } from '../../../../shared/utils/predicate';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../../stark-permissions/utils/utils';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { TicketService } from '../../../services/ticket/ticket.service';

@Component({
  selector: 'app-cash-register-ticket',
  templateUrl: './cash-register-ticket.component.html',
  styleUrls: ['./cash-register-ticket.component.scss']
})
export class CashRegisterTicketComponent implements OnInit, IModalDialog {

  @Input() cashRegister: CashRegister;
  public predicate = new PredicateFormat();


  public columnsConfig: ColumnSettings[] = [
    {
      field: TicketConstant.CODE,
      title: TicketConstant.CODE_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: TicketConstant.CODE_BL,
      title: TicketConstant.CODE_BL_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: TicketConstant.CODE_INVOICE,
      title: TicketConstant.CODE_INVOICE_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: TicketConstant.DATE,
      title: TicketConstant.DATE_TITLE,
      format: this.translate.instant("DATE_AND_TIME_FORMAT"),
      filterable: true,
      _width: 150
    },
    {
      field: TicketConstant.CUSTOMER,
      title: TicketConstant.CUSTOMER_TITLE,
      filterable: true,
      _width: 100
    },
    {
      field: TicketConstant.AMOUNT,
      title: TicketConstant.AMOUNT_TITLE,
      filterable: true,
      _width: 200
    },
    {
      field: TicketConstant.ID_TICKET_PAYMENT,
      title: TicketConstant.PAYMENT,
      filterable: true,
      _width: 200
    }
  ];
  public excelColumnsConfig: ColumnSettings[] = [
    {
      field: TicketConstant.CODE,
      title: TicketConstant.CODE_TITLE,
      filterable: true,
      _width: 100
    },
    {
      field: TicketConstant.CODE_BL,
      title: TicketConstant.CODE_BL_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: TicketConstant.CODE_INVOICE,
      title: TicketConstant.CODE_INVOICE_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: TicketConstant.CREATION_DATE_TIME,
      title: TicketConstant.DATE_TITLE,
      format: this.translate.instant("DATE_AND_TIME_FORMAT"),
      filterable: true,
      _width: 150
    },
    {
      field: TicketConstant.CUSTOMER,
      title: TicketConstant.CUSTOMER_TITLE,
      filterable: true,
      _width: 100
    },
    {
      field: TicketConstant.AMOUNT,
      title: TicketConstant.AMOUNT_TITLE,
      filterable: true,
      _width: 200
    },
    {
      field: TicketConstant.PAYMENT_TYPE,
      title: TicketConstant.PAYMENT,
      filterable: true,
      _width: 200
    },
    {
      field: TicketConstant.SETTLEMENT_CODE,
      title: TicketConstant.SETTLEMENT_CODE_TITLE,
      filterable: true,
      _width: 150
    }
  ];

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  /* Grid state
 */
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  public excelGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.excelColumnsConfig
  };

  openedSession: any;
  documentTypeEnum = DocumentTypesEnumerator;
  cashRegisterItemTypeEnumerator = CashRegisterItemTypeEnumerator;
  isModal: boolean;
  currentSession = true;
  // advanced search
  filtreFieldsColumns = [];
  filtreFieldsInputs = [];
  public predicateAdvancedSearch: PredicateFormat;
  public dialogOptions: Partial<IModalDialogOptions<any>>;
  public hasShowDeliveryFormPermission: boolean;
  public hasShowSalesInvoicePermission: boolean;
  public hasGenerateInvoicePermission: boolean;
  public hasPrintPermission: boolean;
  constructor(public serviceTicket: TicketService, private translate: TranslateService, public intl: IntlService,
    private authService: AuthService, private router: Router, public documentService: DocumentService,
    protected ticketService: TicketService, private fileService: FileService) { }

  ngOnInit() {
    this.hasShowDeliveryFormPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_DELIVERY_SALES);
    this.hasShowSalesInvoicePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES);
    this.hasGenerateInvoicePermission = this.authService.hasAuthority(
      PermissionConstant.CommercialPermissions.GENERATE_INVOICE
    );
    this.hasPrintPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_PAYMENT_TICKET);
    if (this.cashRegister && this.cashRegister.Type == CashRegisterTypeEnum.RecipeBox) {
      let predicateAdv = this.preparePredicate();
      this.predicateAdvancedSearch = predicateAdv;
      this.initGridDataSource();
    }
    this.initCustomersFiltreConfig();
  }
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {

    this.dialogOptions = options;
    this.isModal = true;
    this.openedSession = this.dialogOptions.data.openedSession;
    let predicateAdv = this.preparePredicate();
    this.predicateAdvancedSearch = predicateAdv;
    this.initGridDataSource();

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cashRegister.currentValue) {
      this.currentSession = true;
      let predicateAdv = this.preparePredicate();
      this.predicateAdvancedSearch = predicateAdv;
      this.gridSettings.state.skip = NumberConstant.ZERO;
      this.gridSettings.state.take = NumberConstant.TWENTY;
      this.initGridDataSource();
    }
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;

    this.initGridDataSource();

  }

  public initGridDataSource() {
    this.serviceTicket.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  preparePredicate(): PredicateFormat {
    this.predicate.Filter = new Array<Filter>();
    if (!this.isModal) {
      this.predicate.Filter.push(new Filter(TicketConstant.ID_SESSION_NAVIGATION_CASH_REGISTER, Operation.eq, this.cashRegister.Id));
    } else {
      this.predicate.Filter.push(new Filter(TicketConstant.IDSESSIONCASH, Operation.eq, this.openedSession.Id));
    }
    if (this.currentSession && !this.isModal) {
      this.predicate.Filter.push(new Filter(TicketConstant.SESSION_CASH_STATE, Operation.eq, NumberConstant.ONE));
    } 
    this.predicate.Relation = new Array<Relation>();

    this.predicate.Relation.push(new Relation(TicketConstant.ID_INVOICE_NAVIGATION));
    this.predicate.Relation.push(new Relation(TicketConstant.ID_DELIVERYFORM_NAVIGATION));
    this.predicate.Relation.push(new Relation(TicketConstant.ID_TICKET_PAYMENT));
    this.predicate.Relation.push(new Relation(TicketConstant.ID_DELIVERYFORM_NAVIGATION_TIERS));
    this.predicate.Relation.push(new Relation(TicketConstant.ID_DELIVERYFORM_NAVIGATION_CURRENCY));
    return this.predicate;
  }

  public getDocumentCurrency(Code, Precision) {
    return {
      style: 'currency',
      currency: Code,
      currencyDisplay: 'symbol',
      minimumFractionDigits: Precision
    };
  }

  showDocument(document, type) {

    let url = type == DocumentTypesEnumerator.SALES_INVOICE ? DocumentConstant.SALES_INVOICE_URL : DocumentConstant.SALES_DELIVERY_URL;
    url = url.concat('/')
      .concat(DocumentConstant.SHOW).concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
    this.router.navigate([]).then(() => { window.open(url, '_blank'); });
  }

  /**
   * load advancedSearch parameters config
   * @private
   */
  private initCustomersFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TicketConstant.CODE_TITLE, FieldTypeConstant.TEXT_TYPE, TicketConstant.CODE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TicketConstant.CODE_BL_TITLE, FieldTypeConstant.TEXT_TYPE, TicketConstant.CODE_BL));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TicketConstant.CODE_INVOICE_TITLE, FieldTypeConstant.TEXT_TYPE, TicketConstant.CODE_INVOICE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TicketConstant.DATE_TITLE, FieldTypeConstant.DATE_TYPE, TicketConstant.DATE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TicketConstant.CUSTOMER_TITLE, FieldTypeConstant.customerComponent, TicketConstant.CUSTOMER_ID));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TicketConstant.AMOUNT_TITLE, FieldTypeConstant.numerictexbox_type, TicketConstant.AMOUNT));

  }

  getFiltrePredicate(filtre) {
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
    this.mergefilters();
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
    } else if (filtreFromAdvSearch.operation && isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
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

  mergefilters() {
    if (this.predicateAdvancedSearch) {
      this.cloneAdvancedSearchPredicate(this.predicate);
    }

    return (this.predicate);
  }

  public cloneAdvancedSearchPredicate(targetPredicate: PredicateFormat) {
    targetPredicate.Filter = this.predicateAdvancedSearch.Filter;
    targetPredicate.IsDefaultPredicate = this.predicateAdvancedSearch.IsDefaultPredicate;
    targetPredicate.Operator = this.predicateAdvancedSearch.Operator;
    targetPredicate.OrderBy = this.predicateAdvancedSearch.OrderBy;
    targetPredicate.Relation = this.predicateAdvancedSearch.Relation;
    targetPredicate.SpecFilter = this.predicateAdvancedSearch.SpecFilter;
    targetPredicate.SpecificRelation = this.predicateAdvancedSearch.SpecificRelation;
    targetPredicate.page = this.predicateAdvancedSearch.page;
    targetPredicate.pageSize = this.predicateAdvancedSearch.pageSize;
    targetPredicate.values = this.predicateAdvancedSearch.values;
  }

  resetClickEvent() {
    this.predicateAdvancedSearch = this.preparePredicate();
    this.mergefilters();
    this.initGridDataSource();
  }

  filterFieldsInputsChange($event) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== $event.fieldInput
      .columnName);
    this.mergefilters();
  }

  searchClick() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
  generatePosInvoiceFromBl(dataItem) {
    const invoice: Document = new Document();
    invoice.DocumentDate = new Date();
    invoice.DocumentTypeCode = DocumentEnumerator.SalesInvoices;
    invoice.IdDocumentStatus = documentStatusCode.Valid;
    invoice.IdTiers = dataItem.IdDeliveryFormNavigation.IdTiers;
    invoice.IdCurrency = dataItem.IdDeliveryFormNavigation.IdUsedCurrencyNavigation.Id;
    invoice.IdUsedCurrency = dataItem.IdDeliveryFormNavigation.IdUsedCurrencyNavigation.Id;
    invoice.ValidationDate = new Date();
    invoice.IsForPos = true;
    invoice.DocumentAmountPaidWithCurrency = 0;
    invoice.DocumentHtpriceWithCurrency = 0;
    invoice.DocumentOtherTaxesWithCurrency = 0;
    invoice.DocumentPriceIncludeVatWithCurrency = 0;
    invoice.DocumentRemainingAmountWithCurrency = 0;
    invoice.DocumentTotalDiscountWithCurrency = 0;
    invoice.DocumentTotalExcVatTaxesWithCurrency = 0;
    invoice.DocumentTotalVatTaxesWithCurrency = 0;
    invoice.DocumentTtcprice = 0;
    invoice.DocumentTtcpriceWithCurrency = 0;
    invoice.InoicingType = InvoicingTypeEnumerator.Cash;
    this.documentService
      .generatePosInvoiceFromBl(invoice,false, dataItem.IdDeliveryForm, dataItem.Id)
      .subscribe((data) => {
        let message: string = this.translate.instant(
          CounterSalesConstant.SUCCESS_GENERATE_INVOICE_MESSAGE
        );
        message = message.concat(
          '<a target="_blank" rel="noopener noreferrer" href="' + this.getInvoiceUrl(data.Id) + '" > ' + data.Code + ' </a>');
        swal.fire({
          icon: SharedConstant.SUCCESS,
          html: message,
          onClose: () => this.initGridDataSource()
        })
      });
  }


  getInvoiceUrl(invoiceId: number) {
    return '/main/sales/invoice/edit/' + invoiceId + '/' + documentStatusCode.Provisional;
  }
  printTicketClickHandler(dataItem) {
    const documentName = this.translate.instant(CounterSalesConstant.PRINT_COUNTER_SALES_TICKET);
    const params = {
      'idTicket': dataItem.Id,
    };
    const dataToSend = {
      'reportName': 'TicketPos',
      'documentName': documentName.concat('_').concat(dataItem.Code),
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'PrintType': '-1',
      'reportparameters': params
    };
    this.ticketService.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileService.downLoadFile(res.objectData);
      }
    );
  }

  public CheckCurrentSession() {
    this.predicate.Filter = this.predicate.Filter.filter(value => value.prop !== TicketConstant.SESSION_CASH_STATE);
    if(this.currentSession){
      this.predicate.Filter.push(new Filter(TicketConstant.SESSION_CASH_STATE, Operation.eq, NumberConstant.ONE));
    }
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.gridSettings.state.take = NumberConstant.TWENTY;
    this.initGridDataSource();
  }

  printReportOnClickHandler() {
    const documentName = this.translate.instant(CounterSalesConstant.SESSION_PAYMENT_REPORT);
    const params = {
      'idSession': this.openedSession.Id,
    };
    const dataToSend = {
      'reportName': CounterSalesConstant.PAYMENT_SESSION_REPORT_NAME,
      'documentName': documentName.concat('_').concat(this.openedSession.Code),
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'PrintType': '-1',
      'reportparameters': params
    };
    this.serviceTicket.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileService.downLoadFile(res.objectData);
      }
    );
  }

  showCounterSales(dataItem) {
    let url;
    if (dataItem.Id > NumberConstant.ZERO) {
      url = CounterSalesConstant.COUNTER_SALES_SHOW_URL.concat(dataItem.Id);
    } else if (dataItem.IdDeliveryForm > NumberConstant.ZERO) {
      url = CounterSalesConstant.COUNTER_SALES_SHOW_BL_URL.concat(dataItem.IdDeliveryForm);
    }
    this.router.navigate([]).then(() => { window.open(url, '_blank'); });


  }
}
