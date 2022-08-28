import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { DataStateChangeEvent, PageChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { State } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GrowlService } from '../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { ImportDocumentConstants } from '../../constant/accounting/import-document.constant';
import { ImportDocumentService } from '../services/import-document/import-document.service';
import { flatMap } from 'rxjs/operators';
import { DocumentService } from '../../sales/services/document/document.service';
import { ImportModel } from './model/import.model';
import { SharedAccountingConstant } from '../../constant/accounting/sharedAccounting.constant';
import { DatePipe } from '@angular/common';
import { accountingStatus, DocumentEnumerator, documentStatusCode } from '../../models/enumerators/document.enum';
import { NumberConstant } from '../../constant/utility/number.constant';
import { TypeDocument } from '../../constant/accounting/document-type';
import {
  Filter as predicate,
  Filter,
  Operation,
  Operator,
  OrderBy,
  OrderByDirection,
  PredicateFormat,
  Relation
} from '../../shared/utils/predicate';
import { DocumentConstant } from '../../constant/sales/document.constant';
import { CompanyService } from '../../administration/services/company/company.service';
import { Currency } from '../../models/administration/currency.model';
import { ReportingService } from '../services/reporting/reporting.service';
import { ReportingConstant } from '../../constant/accounting/reporting.constant';
import { AccountingConfigurationService } from '../services/configuration/accounting-configuration.service';
import { AccountingConfigurationConstant } from '../../constant/accounting/accounting-configuration.constant';
import { isDateValidAccounting } from '../../shared/services/validation/validation.service';
import { FiscalYearService } from '../services/fiscal-year/fiscal-year.service';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { FiscalYearStateEnumerator } from '../../models/enumerators/fiscal-year-state-enumerator.enum';
import { FiscalYearConstant } from '../../constant/accounting/fiscal-year.constant';
import { Subscription, Observable } from 'rxjs';
import { Http } from '@angular/http';
import { GenericAccountingService } from '../services/generic-accounting.service';
import { DocumentAccountConstant } from '../../constant/accounting/document-account.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { DeadLineDocumentService } from '../../sales/services/dead-line-document/dead-line-document.service';
import { KeyboardConst } from '../../constant/keyboard/keyboard.constant';
import { SearchConstant } from '../../constant/search-item';
import { FormModalDialogService } from '../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { AccountsConstant } from '../../constant/accounting/account.constant';
import { SelectFinancialAccountComponent } from './select-financial-account/select-financial-account.component';
import {StarkRolesService} from '../../stark-permissions/service/roles.service';
import { ErrorHandlerService } from '../../../COM/services/error-handler-service';
import { FiltreDocument } from './model/filtreDocument.model';
import { FiltreSettlement } from './model/filtreSettlement.model';
import {StyleConfigService} from '../../shared/services/styleConfig/style-config.service';
import {FiltrePredicateModel} from '../../models/shared/filtrePredicate.model';
import {FieldTypeConstant} from '../../constant/shared/fieldType.constant';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../stark-permissions/utils/utils';
import { ReducedCurrency } from '../../models/administration/reduced-currency.model';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';

const SALE_INVOICE_URL = 'main/sales/invoice/show/';
const PURCHASE_INVOICE_URL = 'main/purchase/invoice/show/'
const AVOIR_SALE_INVOICE_URL = 'main/sales/asset/show/';
const AVOIR_PURCHASE_INVOICE_URL = 'main/purchase/asset/show/'
const CUSTOMER_URL = 'main/sales/customer/AdvancedEdit/';
const SUPPLIER_URL = 'main/purchase/suppliers/AdvancedEdit/';

@Component({
  selector: 'app-import-document',
  templateUrl: './import-document.component.html',
  styleUrls: ['./import-document.component.scss'],
})
export class ImportDocumentComponent implements OnInit {


  private _validatedIds = [];
  public inputForm: FormGroup;
  public dropDownData: any[];
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public statusCode = accountingStatus;
  public documentSelected = [];
  public documentToImport = [];
  public importButton = true;
  public isRegulation = false;
  public currentExerciceStartDate: Date;
  public currentExerciceEndDate: Date;
  public documentDateFilter: any;
  public currentFiscalYear: any;
  public keyAction: any;

  // choosenFilter name proprety
  public choosenFilter: string;
  public status = NumberConstant.THREE;
  public documentType: string;
  public setllementType: number;
  public fiscalYearId: number;
  public dropDownFilterData: any;
  public predicate: PredicateFormat;
  public showDelay = SharedAccountingConstant.SHOW_TOOLTIP_DELAY;
  public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: ImportDocumentConstants.CODE,
      title: ImportDocumentConstants.CODE_TITLE,
      filterable: true
    },
    {
      field: ImportDocumentConstants.TIER_NAME,
      title: ImportDocumentConstants.TIER_NAME_TITLE,
      filterable: true
    },
    {
      field: ImportDocumentConstants.AMOUNTTTC,
      title: ImportDocumentConstants.AMOUNTTTC_TITLE,
      filterable: true
    },
    {
      field: ImportDocumentConstants.DOCUMENTDATE,
      title: ImportDocumentConstants.DOCUMENT_DATE_TITLE,
      format: SharedAccountingConstant.YYYY_MM_DD,
      filterable: true
    },
    {
      field: ImportDocumentConstants.STATUS,
      title: ImportDocumentConstants.STATUS_TITLE,
      filterable: true,
    }
  ];

  public regulationsDetails: ColumnSettings[] = [
    {
      field: ImportDocumentConstants.CODE_SETTLEMENT,
      title: ImportDocumentConstants.CODE_TITLE,
      filterable: true
    },
    {
      field: ImportDocumentConstants.TIERS_NAME,
      title: ImportDocumentConstants.TIER_NAME_TITLE,
      filterable: true
    },
    {
      field: ImportDocumentConstants.PAYMENT_AMOUNT,
      title: ImportDocumentConstants.PAYMENT_AMOUNT_TITLE,
      filterable: true,
    },
    {
      field: ImportDocumentConstants.PAYMENT_MODE,
      title: ImportDocumentConstants.PAYMENT_MODE_TITLE,
      filterable: true,
    },
    {
      field: ImportDocumentConstants.BANK_NAME,
      title: ImportDocumentConstants.BANK_NAME_TITLE,
      filterable: true,
    },
    {
      field: ImportDocumentConstants.SETTLEMENT_DATE,
      title: ImportDocumentConstants.SETTLEMENT_DATE_TITLE,
      format: SharedAccountingConstant.YYYY_MM_DD,
      filterable: false
    },
    {
      field: ImportDocumentConstants.IS_ACCOUNTED,
      title: ImportDocumentConstants.STATUS_TITLE,
      filterable: true,
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public accountedList = false;
  public mode = 'multiple';
  public formatNumberOptions: any;
  public readOnly = true;
  public cookie: any;
  public contentType: any;
  public user: any;
  public authorization: any;
  public selectedValue: string;
  public startDate: Date;
  public endDate: Date;
  public spinner = false;
  private pageSize = NumberConstant.TEN;
  private currentPage = NumberConstant.ZERO;
  public isAccounted = false;
  public bankAccounts = [];
  public cofferAccount = [];
  /**
   * advanced search predicate
   */
  public predicateAdvancedSearchForDocument: PredicateFormat;
  public predicateAdvancedSearchForSettlement: PredicateFormat;
  public filtreDocument = new FiltreDocument(null, '', '', null);
  public filtreSettlement = new FiltreSettlement(null, '', '', null, '', '');
  public amountTTC: number;
  public tierName: string;
  public codeDocument: string;
  public setllementCode: string;
  public settlementTierName: string;
  public paymentMethod: string;
  public amount: number;
  public bankName:string;
  // filter for accounting document
  public filterFieldsColumns = [];
  public filterFieldsInputs = [];
  // filter for settlement document
  public settlementFilterFieldsColumns = [];
  public settlementFilterFieldsInputs = [];

  public AccountingPermissions = PermissionConstant.AccountingPermissions;
  hasReadWritePermission = false;
  public isAccountedState = false;
  constructor(private fb: FormBuilder, private growlService: GrowlService, private translate: TranslateService,
    private importDocumentService: ImportDocumentService, private viewRef: ViewContainerRef,
    private documentService: DocumentService, private formModalDialogService: FormModalDialogService,
    private datePipe: DatePipe, private companyService: CompanyService, private starkRolesService: StarkRolesService,
    private reportService: ReportingService, private accountingConfigurationService: AccountingConfigurationService,
    private fiscalYearService: FiscalYearService, private deadLineDocumentService: DeadLineDocumentService,
    private genericAccountingService: GenericAccountingService, private route: ActivatedRoute,
    private swalWarrings: SwalWarring, private router: Router,
    private errorHandlerService: ErrorHandlerService, public authService: AuthService,
    private styleConfigService: StyleConfigService) {
    this.hasReadWritePermission = GenericAccountingService.hasAccountingReadWritePermission();
    this.initDropDownList();
    this.initDropDownFilterList();
    if (this.route.snapshot.data['currentFiscalYear']) {
      this.currentFiscalYear = this.route.snapshot.data['currentFiscalYear'];
      this.bankAccounts = this.route.snapshot.data['bankAccounts'];
      this.cofferAccount = this.route.snapshot.data['cofferAccount'];
    } else {
      this.accountingConfigurationService.getJavaGenericService().getEntityList(
        AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL
      ).subscribe(data => {
        this.currentFiscalYear = data;
      });
    }
  }

  setConfigurationServerSide() {
    this.reportService.getJavaGenericService().getData(ReportingConstant.CONFIGURATION_COOKIES_URL)
      .subscribe(data => {
        this.contentType = data[NumberConstant.ZERO];
        this.user = data[NumberConstant.ONE];
        this.authorization = data[NumberConstant.TWO];
      });
  }

  onClickSearch(){
    this.currentPage = NumberConstant.ZERO;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.predicateAdvancedSearchForDocument.page = this.currentPage + 1;
    this.initDataSource();
  }

  initDataSource() {
    if (this.inputForm.value.DocumentType != null) {
      switch (this.inputForm.value.DocumentType) {
        case TypeDocument.I_PU: {
          this.documentType = TypeDocument.I_PU;
          this.isRegulation = false;
          break;
        }
        case TypeDocument.I_SA: {
          this.documentType = TypeDocument.I_SA;
          this.isRegulation = false;
          break;
        }

        case TypeDocument.A_PU: {
          this.documentType = TypeDocument.A_PU;
          this.isRegulation = false;
          break;
        }

        case TypeDocument.IA_SA: {
          this.documentType = TypeDocument.IA_SA;
          this.isRegulation = false;
          break;
        }

        case TypeDocument.S_PU: {
          this.documentType = TypeDocument.S_PU;
          this.isRegulation = true;
          this.setllementType = NumberConstant.TWO;
          break;
        }

        case TypeDocument.S_SA: {
          this.documentType = TypeDocument.S_SA;
          this.isRegulation = true;
          this.setllementType = NumberConstant.ONE;
          break;
        }
        default: {
          break;
        }
      }

      if (!this.isRegulation) {
        this.documentService.getDocumentToImported(this.predicateAdvancedSearchForDocument).pipe(flatMap(value => {
          this.gridSettings.gridData = {
            data: value.listData,
            total: value.total
          };
          return this.sendImportedDocumentsData(value.listData);
        })).subscribe(data =>  {
          let isAccounted;
          if (this.predicateAdvancedSearchForDocument.Filter.filter(x => x.prop == DocumentConstant.IS_ACCOUNTED).length == 0) {
            isAccounted = 'All'
          }
          else {
            isAccounted = this.predicateAdvancedSearchForDocument.Filter.filter(x => x.prop == DocumentConstant.IS_ACCOUNTED)[0].value;
          }
          if (isAccounted === true){
            this.status = this.statusCode.Accounted;
            this.isAccountedState = true;
          } else if(isAccounted === false){
            this.status = this.statusCode.NotAccounted;
            this.isAccountedState = false;
          } else {
            this.status = this.statusCode.All;
            this.isAccountedState = false;
          }
          this._validatedIds = data;
          let index = 0;
          this._validatedIds.forEach(validateDocument => {
            if (this.status === this.statusCode.All) {
              this.gridSettings.gridData.data[index].isAccounted = validateDocument.id !== null;
            } else
            if ((this.status === this.statusCode.Accounted && validateDocument.id === null) ||
              (this.status === this.statusCode.NotAccounted && validateDocument.id !== null)){
              this.gridSettings.gridData.data.splice(index, 1);
              this._validatedIds.splice(index, 1);
            }
            index++;   
          });
        },() => {
          this.spinner = false
        });
       } else {
        this.deadLineDocumentService.getSettlementToImport(this.predicateAdvancedSearchForSettlement).pipe(flatMap(value => {
          this.gridSettings.gridData = {
            data: value.data,
            total: value.total
          };
          return this.sendImportedSettlementsData(value.data);
        })).subscribe(data => {
          let isAccounted;
          if (this.predicateAdvancedSearchForSettlement.Filter.filter(x => x.prop == DocumentConstant.IS_ACCOUNTED).length == 0) {
            isAccounted = 'All'
          }
          else {
            isAccounted = this.predicateAdvancedSearchForSettlement.Filter.filter(x => x.prop == DocumentConstant.IS_ACCOUNTED)[0].value;
          } if (isAccounted === true) {
            this.status = this.statusCode.Accounted;
            this.isAccountedState = true;
          } else if(isAccounted === false){
            this.status = this.statusCode.NotAccounted;
            this.isAccountedState = false;
          } else {
            this.status = this.statusCode.All;
            this.isAccountedState = false;
          }
          this._validatedIds = data;
          let index = 0;
          this._validatedIds.forEach(validateDocument => {
              if (this.status === this.statusCode.All) {
              this.gridSettings.gridData.data[index].isAccounted = validateDocument.id !== null;
              } else
              if ((this.status === this.statusCode.Accounted && validateDocument.id === null) ||
                (this.status === this.statusCode.NotAccounted && validateDocument.id !== null)){
                this.gridSettings.gridData.data.splice(index, 1);
                this._validatedIds.splice(index, 1);
              }
            index++;
          });
        },() => {
        this.spinner = false
        });
       }
    }
}

  private sendImportedDocumentsData(documents) {
    let documentsIds = [];
    documents.forEach(document => documentsIds.push(document.idDocument));
    return this.importDocumentService.getJavaGenericService().sendData('getDocuments', documentsIds);
  }

  private sendImportedSettlementsData(documents: any) {
    let settlementIds = [];
    documents.forEach(document => settlementIds.push(document.idSettlement));
    return this.importDocumentService.getJavaGenericService().sendData('getDocuments', settlementIds);
  }

  public onChangeStatus(status: number) {
    if (status === this.statusCode.All) {
      this.choosenFilter = this.translate.instant(ImportDocumentConstants.ALL);
      this.accountedList = false;
      this.isAccounted = null;
    } else if (status === this.statusCode.Accounted) {
      this.choosenFilter = this.translate.instant(ImportDocumentConstants.ACCOUNTED);
      this.accountedList = true;
      this.isAccounted = true;
    } else {
      this.choosenFilter = this.translate.instant(ImportDocumentConstants.NOT_ACCOUNTED);
      this.accountedList = false;
      this.isAccounted = false;
    }
    this.status = status;
    this.initDataSource();
  }



  private createInputForm(): void {
    const date = new Date();
    this.inputForm = this.fb.group({
      StartDate: [new Date(date.getFullYear(), NumberConstant.ZERO, NumberConstant.ONE, NumberConstant.ZERO,
        NumberConstant.ZERO, NumberConstant.ZERO), [Validators.required]],
      EndDate: [new Date(date.getFullYear(), NumberConstant.ELEVEN, NumberConstant.THIRTY_ONE, NumberConstant.TWENTY_THREE,
        NumberConstant.FIFTY_NINE, NumberConstant.FIFTY_NINE), [Validators.required]],
      AccountingStatus: [null],
      DocumentType: [null, Validators.required]
    });
  }


  public dataStateChange(dataState: DataStateChangeEvent): void {
    this.gridSettings.state = dataState;
  }

  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / this.pageSize;
    this.pageSize = event.take;
    if(!this.isRegulation){
      this.predicateAdvancedSearchForDocument.page = this.currentPage + 1;
      this.predicateAdvancedSearchForDocument.pageSize = this.pageSize;
    } else {
      this.predicateAdvancedSearchForSettlement.page = this.currentPage + 1;
      this.predicateAdvancedSearchForSettlement.pageSize = this.pageSize;
    }
    this.initDataSource();
  }

  public onSearch(): void {
    this.clearGrid();
    this.currentPage = NumberConstant.ZERO;
    if (this.predicateAdvancedSearchForDocument){
      this.predicateAdvancedSearchForDocument.page = this.currentPage + 1;
    }
    if (this.predicateAdvancedSearchForSettlement){
      this.predicateAdvancedSearchForSettlement.page = this.currentPage + 1;
    }
    if (!this.dateInputsIsValid()) {
      this.documentSelected = [];
      this.growlService.warningNotification(this.translate.instant(ImportDocumentConstants.DATE_INTERVAL_VIOLATION));
      return;
    }
    this.initDataSource();
  }

  /*
   * compares if startDate < endDate
   */
  public dateInputsIsValid(): boolean {
    return new Date(this.inputForm.controls['StartDate'].value) <= new Date(this.inputForm.controls['EndDate'].value);
  }

  displayInvoice(dataItem: any): void {
    if (this.inputForm.value.DocumentType === TypeDocument.I_PU) {
      window.open(PURCHASE_INVOICE_URL.concat(dataItem.idDocument, '/' + this.formatNumberOptions.id), '_blank');
    } else if (this.inputForm.value.DocumentType === TypeDocument.I_SA) {
      window.open(SALE_INVOICE_URL.concat(dataItem.idDocument, '/' + this.formatNumberOptions.id), '_blank');
    }  else if (this.inputForm.value.DocumentType === TypeDocument.IA_SA) {
      window.open(AVOIR_SALE_INVOICE_URL.concat(dataItem.idDocument, '/' + this.formatNumberOptions.id), '_blank');
    }  else {
      window.open(AVOIR_PURCHASE_INVOICE_URL.concat(dataItem.idDocument, '/' + this.formatNumberOptions.id), '_blank');
    }
  }

  displayTiers(idTiers: string): void {
    if (this.inputForm.value.DocumentType === TypeDocument.S_PU || this.inputForm.value.DocumentType === TypeDocument.A_PU
      || this.inputForm.value.DocumentType === TypeDocument.I_PU) {
        this.router.navigateByUrl(SUPPLIER_URL.concat(idTiers));
    } else {
      this.router.navigateByUrl(CUSTOMER_URL.concat(idTiers));
    }
  }

  validateMultipleDocument() {
    this.documentSelected.forEach(invoiceId => {
      const invoice = this.gridSettings.gridData.data.find(inv => inv.idDocument === invoiceId);
      invoice.documentDate = this.datePipe.transform(invoice.documentDate, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
      this.documentToImport.push(invoice);
    });
    if (this.documentToImport.length > 0) {
      this.generateMultipleDocument();
    } else {
      this.importButton = true;
    }
  }

  generateMultipleDocument() {                   
  this.spinner = true;
 this.fiscalYearService.getJavaGenericService().getEntityById(this.fiscalYearId).subscribe(data => {
      if (data.closingState === FiscalYearStateEnumerator.Open || data.closingState === FiscalYearStateEnumerator.PartiallyClosed) {
        this.importDocumentService.getJavaGenericService().sendData(
          `importDocuments?contentType=${this.contentType}&user=${this.user}&authorization=${this.authorization}`, {
            billDtos: this.documentToImport,
            fiscalYearId: this.fiscalYearId
          }).subscribe((result) => {
            if (result.billIdNotInCurrentFiscalYear.length > NumberConstant.ZERO) {
              this.growlService.ErrorNotification(`${this.translate.instant('BILL_DATE_NOT_IN_FISCAL_YEAR')}`);
            }
            if (result.listBillImported.length > NumberConstant.ZERO) {
              const listCode = result.listBillImported.join(', ')
              this.growlService.ErrorNotification(`${this.translate.instant('BILL_ALREADY_IMPORTED', { code: listCode})}`);
            }
            if (result.billFailedDtos.length > NumberConstant.ZERO) {
              this.growlService.ErrorNotification(`${this.translate.instant('BILL_SAVE_ERROR')}`);
            }
            if (result.billSuccessList.length > NumberConstant.ZERO) {
              this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
              this.growlService.InfoNotification(this.translate.instant(ImportDocumentConstants.BILL_IMPORTED_SUCCESSFULLY));
              this.spinner = false;
            }
            if (result.httpErrorCodes.length) {
              result.httpErrorCodes.forEach(httpErrorCode => {
                this.errorHandlerService.getErrorNotification(httpErrorCode);
              });
              this.spinner = false;
            }
          }, error => {
          },
          () => {
           this.initDataSource();
            this.documentToImport = [];
            this.documentSelected = [];
          });
      } else {
        this.growlService.ErrorNotification(`${this.translate.instant(FiscalYearConstant.FISCAL_YEAR_NOT_OPENED)}`);
      }
    });
  }

  validateMultipleSettlement() {
    if (this.documentSelected.length > 0) {
      this.documentSelected.forEach(settlementId => {
        const settlement = this.gridSettings.gridData.data.find(inv => inv.idSettlement === settlementId);
        settlement.settlementDate = this.datePipe.transform(settlement.settlementDate, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
        settlement.documentType = this.documentType;
        this.documentToImport.push(settlement);
      });
      this.selectAccounts();
    } else {
      this.importButton = true;
    }
  }

  onSelectedKeysChange() {
    this.importButton = this.documentSelected.length === 0;
  }

  clearGrid(): void {
    this.gridSettings.gridData = { data: [], total: 0 };
  }


  redirectTo(rowIndex: number) {
    window.open(DocumentAccountConstant.DOCUMENT_ACCOUNT_EDIT_URL.concat(this._validatedIds[rowIndex-(this.pageSize*this.currentPage)].id), '_blank');
  }

  getDocumentCode(rowIndex): string {
    return this._validatedIds[rowIndex-(this.pageSize*this.currentPage)] ? this._validatedIds[rowIndex-(this.pageSize*this.currentPage)].codeDocument : '';
  }

  openModalToConfirmSwitchingToAnotherOperationType(): any {
    const swalWarningMessage = `${this.translate.instant('UNACCOUNTED_DOCUMENT')}`;
    return this.swalWarrings.CreateSwal(swalWarningMessage, ImportDocumentConstants.ARE_YOU_SURE_TO_UNACCOUNTED_DOCUMENT,
      SharedConstant.YES, SharedConstant.NO);
  }

  disaccountedDocument(index: number) {
    return new Promise(() => {
      this.openModalToConfirmSwitchingToAnotherOperationType().then((result) => {
        if (result.value) {
          if (index !== undefined) {
            this.importDocumentService.getJavaGenericService().deleteEntity(this._validatedIds[index-(this.pageSize*this.currentPage)].id)
              .pipe(flatMap((data) => {
                this.growlService.InfoNotification(this.translate.instant(ImportDocumentConstants.BILL_DISACCOUNTED));
                this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
                return this.documentService.disaccountedDocument(data.billId);
              })).subscribe(() => this.initDataSource());
          } else {
            this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.OPERATION_FAILED));
          }
        }
      });
    });
  }

  disaccountedSettlement(index: number) {
    return new Promise(() => {
      this.openModalToConfirmSwitchingToAnotherOperationType().then((result) => {
        if (result.value) {
          if(index !== undefined) {
            this.importDocumentService.getJavaGenericService().deleteEntity(this._validatedIds[index-(this.pageSize*this.currentPage)].id)
              .pipe(flatMap((data) => {
                this.growlService.InfoNotification(this.translate.instant(ImportDocumentConstants.BILL_DISACCOUNTED));
                this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
                return this.deadLineDocumentService.changeSettlementStatus(data.billId);
              })).subscribe(() => this.initDataSource());
          } else {
            this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.OPERATION_FAILED));
          }
        }
      });
    });
  }

  private preparePredicate(statusInvoice?: string): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.OrderBy = new Array<OrderBy>();
    if (statusInvoice !== undefined) {
      this.predicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_TYPE_CODE, Operation.eq, DocumentEnumerator.SalesInvoices),
        new Filter(DocumentConstant.ID_DOCUMENT_STATUS, Operation.eq, documentStatusCode[statusInvoice]));
    } else {
      this.predicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_TYPE_CODE, Operation.eq, DocumentEnumerator.SalesInvoices));
    }
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [new OrderBy(DocumentConstant.ID_DOCUMENT, OrderByDirection.desc)]);
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(DocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION),
    new Relation(DocumentConstant.ID_TIER_NAVIGATION)]);
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: 'accounting',
      currency: currency.Code,
      currencyDisplay: 'symbol',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision,
      id: currency.Id
    };
  }

  initDropDownList() {
    this.dropDownData = [{
      text: this.translate.instant(ImportDocumentConstants.PURCHASES),
      DocumentType: TypeDocument.I_PU
    }, {
      text: this.translate.instant(ImportDocumentConstants.SALES),
      DocumentType: TypeDocument.I_SA
    }, {
      text: this.translate.instant(ImportDocumentConstants.CREDIT_NOTE_PURCHASE),
      DocumentType: TypeDocument.A_PU
    }, {
      text: this.translate.instant(ImportDocumentConstants.CREDIT_NOTE_SALES),
      DocumentType: TypeDocument.IA_SA
    }, {
      text: this.translate.instant(ImportDocumentConstants.CUSTOMER_STATEMENT),
      DocumentType: TypeDocument.S_SA
    }, {
      text: this.translate.instant(ImportDocumentConstants.SUPPLIER_STATEMENT),
      DocumentType: TypeDocument.S_PU
    }];
  }

  initDropDownFilterList() {
    this.dropDownFilterData = [{
      text: this.translate.instant(ImportDocumentConstants.ALL),
      value: this.statusCode.All
    }, {
      text: this.translate.instant(ImportDocumentConstants.ACCOUNTED),
      value: this.statusCode.Accounted
    }, {
      text: this.translate.instant(ImportDocumentConstants.NOT_ACCOUNTED),
      value: this.statusCode.NotAccounted
    }];
  }

  initDefaultDocument() {
    this.selectedValue = this.dropDownData[1].DocumentType;
    this.startDateInput.setValue(this.currentExerciceStartDate);
    this.endDateInput.setValue(this.currentExerciceEndDate);
    this.inputForm.value.DocumentType = TypeDocument.I_SA;
    this.initPredicateAdvancedSearchForDocument();
    this.onSearch();
  }

  get startDateInput(): FormControl {
    return this.inputForm.get('StartDate') as FormControl;
  }

  get endDateInput(): FormControl {
    return this.inputForm.get('EndDate') as FormControl;
  }

  public initDateForm() {
    this.currentExerciceStartDate = new Date(this.currentFiscalYear.startDate);
    this.currentExerciceEndDate = new Date(this.currentFiscalYear.endDate);
    this.startDateInput.setValidators(isDateValidAccounting(this.currentExerciceStartDate, this.currentExerciceEndDate));
    this.endDateInput.setValidators(isDateValidAccounting(this.currentExerciceStartDate, this.currentExerciceEndDate));
    this.fiscalYearId = this.currentFiscalYear.id;
    this.initDefaultDocument();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(this.isImportDocumentCurrentOperationNotCompleted.bind(this));
  }

  public isImportDocumentCurrentOperationNotCompleted(): boolean {
    return this.documentSelected.length !== 0;
  }

  public keyEnterAction() {
    this.keyAction = (event) => {
      if (!this.inputForm || !this.inputForm.valid || event.key === KeyboardConst.ENTER) {
        this.onSearch();
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);

  }

  selectAccounts() {
    if (this.documentToImport.length > 0) {
      this.fiscalYearService.getJavaGenericService().getEntityById(this.fiscalYearId).subscribe(data => {
        if (data.closingState === FiscalYearStateEnumerator.Open || data.closingState === FiscalYearStateEnumerator.PartiallyClosed) {
          const modalTitle = this.translate.instant(AccountsConstant.SETTLEMENT_ACCOUNT);
          let cashDocument = this.documentToImport.find(document => document.bankName === '' || document.bankName === null);
          let bankDocument = this.documentToImport.find(document => document.bankName !== '' && document.bankName !== null);
          const displayCofferAccounts = cashDocument !== undefined;
          const displayBankAccounts = bankDocument !== undefined;
          this.formModalDialogService.openDialog(modalTitle, SelectFinancialAccountComponent, this.viewRef,
            this.handleAddNewElementToAccountDropdown.bind(this),
            { regulationsDtos: this.documentToImport, fiscalYearId: this.fiscalYearId,
              cofferAccounts: this.cofferAccount, bankAccounts: this.bankAccounts,
              displayCofferAccounts: displayCofferAccounts, displayBankAccounts: displayBankAccounts
            },
            null, SharedConstant.MODAL_DIALOG_SIZE_ML);
        } else {
          this.growlService.ErrorNotification(`${this.translate.instant(FiscalYearConstant.FISCAL_YEAR_NOT_OPENED)}`);
        }
      });
    }
  }

  handleAddNewElementToAccountDropdown() {
    this.initDataSource();
    this.documentToImport = [];
    this.documentSelected = [];
    this.spinner = false;
  }

  onChangeOperation(){
    this.gridSettings.state = this.gridState;
    this.documentToImport = [];
    this.documentSelected = [];
    if(this.inputForm.value.DocumentType == "S-SA"){
      this.setllementType = NumberConstant.ONE;
    } else if(this.inputForm.value.DocumentType == "S-PU"){
      this.setllementType = NumberConstant.TWO
    }
    if(!this.isRegulation){
      this.initPredicateAdvancedSearchForSettlement();
    }else if(this.isRegulation && (this.inputForm.value.DocumentType == "S-SA" || this.inputForm.value.DocumentType == "S-PU" )){
      this.predicateAdvancedSearchForSettlement.Filter = this.predicateAdvancedSearchForSettlement.Filter.filter(x => x.prop != ImportDocumentConstants.ID_TIERS_NAVIGATION_TYPE);
      this.predicateAdvancedSearchForSettlement.Filter.push(new Filter(ImportDocumentConstants.ID_TIERS_NAVIGATION_TYPE,Operation.eq,this.setllementType));
    }
      this.predicateAdvancedSearchForDocument.Filter = this.predicateAdvancedSearchForDocument.Filter.filter(x => x.prop != DocumentConstant.DOCUMENT_TYPE_CODE);
      this.predicateAdvancedSearchForDocument.Filter.push(new Filter(DocumentConstant.DOCUMENT_TYPE_CODE,Operation.eq,this.inputForm.value.DocumentType));


    this.onSearch();
  }

  ngOnInit() {
    this.createInputForm();
    this.initDateForm();
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
    });
    this.choosenFilter = this.translate.instant(ImportDocumentConstants.NOT_ACCOUNTED);
    this.preparePredicate();
    this.setConfigurationServerSide();
    this.keyEnterAction();
    this.initFliedFilterConfigForDocument();
    this.initFliedFilterConfigForSettlement();
  }

  validateAll() {
    if (!this.isRegulation) {
      const importModel: ImportModel = {
        ...this.inputForm.value, DocumentType: this.documentType,
        AccountingStatus: this.statusCode.NotAccounted, Skip: NumberConstant.ZERO, Take: this.gridSettings.gridData.total
      };
      this.documentService.getDocumentToImported(importModel).subscribe(value => {
        value.listData.forEach(invoice => {
          invoice.documentDate = this.datePipe.transform(invoice.documentDate, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
          this.documentToImport.push(invoice);
        });
        if (this.documentToImport.length > 0) {
          this.generateMultipleDocument();
        }
      });
    } else {
      const Model = {
        Model: {
          StartDate: this.inputForm.value.StartDate,
          EndDate: this.inputForm.value.EndDate,
          Type: this.setllementType,
          Page: NumberConstant.ZERO,
          PageSize: this.gridSettings.gridData.total,
          IsAccounted: this.isAccounted
        }
      };
      this.deadLineDocumentService.getSettlementToImport(Model).subscribe(value => {
        value.data.forEach(settlement => {
          settlement.SettlementDate = this.datePipe.transform(settlement.SettlementDate, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
          this.documentToImport.push(settlement);
        });
        this.selectAccounts();
      });
    }
  }

  public getFooterClass() {
    return this.styleConfigService.getFooterClassLayoutAddComponent();
  }

  getFilterPredicate(filtre) {
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
  }
  private prepareSpecificFiltreFromAdvancedSearch(filtre) {
    if (filtre.SpecificFiltre && !filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearchForDocument.SpecFilter = this.predicateAdvancedSearchForDocument.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
      this.predicateAdvancedSearchForDocument.SpecFilter.push(filtre.SpecificFiltre);
    } else if (filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearchForDocument.SpecFilter = this.predicateAdvancedSearchForDocument.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
    }
  }

  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearchForDocument.Filter = this.predicateAdvancedSearchForDocument.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.prepareDatesFiltres(filtreFromAdvSearch,true);
    } else if (filtreFromAdvSearch.operation && isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      if(filtreFromAdvSearch.prop == ImportDocumentConstants.IS_ACCOUNTED){
        this.prepareStatusFiltres(filtreFromAdvSearch,true);
      }else {
        this.predicateAdvancedSearchForDocument.Filter.push(filtreFromAdvSearch);
      }

    }
  }
  private prepareDatesFiltres(filtreFromAdvSearch,isForDocument? :boolean) {
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ZERO].value)) {
      isForDocument? this.predicateAdvancedSearchForDocument.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]):
      this.predicateAdvancedSearchForSettlement.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
    }
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ONE].value)) {
      isForDocument? this.predicateAdvancedSearchForDocument.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]):
      this.predicateAdvancedSearchForSettlement.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    }
  }

  getSettlementFilterPredicate(filtre) {
    this.prepareSpecificFiltreFromAdvancedSearchForSettlement(filtre);
    this.prepareFiltreFromAdvancedSearchForSettlement(filtre);
  }
  private prepareSpecificFiltreFromAdvancedSearchForSettlement(filtre) {
    if (filtre.SpecificFiltre && !filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearchForSettlement.SpecFilter = this.predicateAdvancedSearchForSettlement.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
      this.predicateAdvancedSearchForSettlement.SpecFilter.push(filtre.SpecificFiltre);
    } else if (filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearchForSettlement.SpecFilter = this.predicateAdvancedSearchForSettlement.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
    }
  }

  private prepareFiltreFromAdvancedSearchForSettlement(filtreFromAdvSearch) {
    this.predicateAdvancedSearchForSettlement.Filter = this.predicateAdvancedSearchForSettlement.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.prepareDatesFiltres(filtreFromAdvSearch);
    } else if (filtreFromAdvSearch.operation && isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      if(filtreFromAdvSearch.prop == ImportDocumentConstants.IS_ACCOUNTED){
        this.prepareStatusFiltres(filtreFromAdvSearch);
      }else {
        this.predicateAdvancedSearchForSettlement.Filter.push(filtreFromAdvSearch);
      }

    }
  }

  private prepareStatusFiltres(filtreFromAdvSearch,isForDocument? :boolean) {
    if(filtreFromAdvSearch.value == NumberConstant.ONE){
      isForDocument?this.predicateAdvancedSearchForDocument.Filter.push(new Filter(ImportDocumentConstants.IS_ACCOUNTED, Operation.eq, true))
      : this.predicateAdvancedSearchForSettlement.Filter.push(new Filter(ImportDocumentConstants.IS_ACCOUNTED, Operation.eq, true));
    } else if(filtreFromAdvSearch.value == NumberConstant.TWO){
      isForDocument?this.predicateAdvancedSearchForDocument.Filter.push(new Filter(ImportDocumentConstants.IS_ACCOUNTED, Operation.eq, false))
      :this.predicateAdvancedSearchForSettlement.Filter.push(new Filter(ImportDocumentConstants.IS_ACCOUNTED, Operation.eq, false));
    }
  }
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearchForDocument.Operator = operator;
  }


  resetClickEvent() {
    this.initPredicateAdvancedSearchForDocument();
    this.initPredicateAdvancedSearchForSettlement();
    this.initDataSource();
  }
  initFliedFilterConfigForDocument() {
    this.filterFieldsColumns.push(new FiltrePredicateModel(ImportDocumentConstants.CODE_TITLE, FieldTypeConstant.TEXT_TYPE, ImportDocumentConstants.CODE_DOCUMENT));
    this.filterFieldsColumns.push(new FiltrePredicateModel(ImportDocumentConstants.TIER_NAME_TITLE, FieldTypeConstant.TEXT_TYPE, ImportDocumentConstants.ID_TIERS_NAVIGATION_NAME));
    this.filterFieldsColumns.push(new FiltrePredicateModel(ImportDocumentConstants.STATUS_TITLE, FieldTypeConstant.statusAccountedComponent, ImportDocumentConstants.IS_ACCOUNTED));
    this.filterFieldsInputs.push(new FiltrePredicateModel(ImportDocumentConstants.AMOUNTTTC_TITLE, FieldTypeConstant.numerictexbox_type, ImportDocumentConstants.DOCUMENT_AMOUNT_TTC));
  }
  initFliedFilterConfigForSettlement() {
    this.settlementFilterFieldsColumns.push(new FiltrePredicateModel(ImportDocumentConstants.CODE_TITLE, FieldTypeConstant.TEXT_TYPE, ImportDocumentConstants.CODE_DOCUMENT));
    this.settlementFilterFieldsColumns.push(new FiltrePredicateModel(ImportDocumentConstants.TIER_NAME_TITLE, FieldTypeConstant.TEXT_TYPE, ImportDocumentConstants.ID_TIERS_NAVIGATION_NAME));
    this.settlementFilterFieldsColumns.push(new FiltrePredicateModel(ImportDocumentConstants.STATUS_TITLE, FieldTypeConstant.statusAccountedComponent, ImportDocumentConstants.IS_ACCOUNTED));
    this.settlementFilterFieldsInputs.push(new FiltrePredicateModel(ImportDocumentConstants.PAYMENT_AMOUNT_TITLE, FieldTypeConstant.numerictexbox_type, ImportDocumentConstants.AMOUNT));
    this.settlementFilterFieldsInputs.push(new FiltrePredicateModel(ImportDocumentConstants.PAYMENT_MODE_TITLE, FieldTypeConstant.paymentMethodeComponent, ImportDocumentConstants.PAYMENT_METHODE));
    this.settlementFilterFieldsInputs.push(new FiltrePredicateModel(ImportDocumentConstants.BANK_NAME_TITLE, FieldTypeConstant.TEXT_TYPE, ImportDocumentConstants.BANK_NAME));
    this.settlementFilterFieldsInputs.push(new FiltrePredicateModel(ImportDocumentConstants.SETTLEMENT_DATE_TITLE, FieldTypeConstant.DATE_TYPE, ImportDocumentConstants.SETTLEMENT_DATE_FIELD));
  }
  initPredicateAdvancedSearchForDocument() {
    this.predicateAdvancedSearchForDocument = new PredicateFormat();
    this.predicateAdvancedSearchForDocument.Filter = new Array<Filter>();
    this.predicateAdvancedSearchForDocument.Filter.push(new Filter(DocumentConstant.DOCUMENT_DATE,Operation.gte,this.startDateInput.value));
    this.predicateAdvancedSearchForDocument.Filter.push(new Filter(DocumentConstant.DOCUMENT_DATE,Operation.lte,this.endDateInput.value));
    this.predicateAdvancedSearchForDocument.Filter.push(new Filter(DocumentConstant.DOCUMENT_TYPE_CODE,Operation.eq,TypeDocument.I_SA));
    this.predicateAdvancedSearchForDocument.Filter.push(new Filter(DocumentConstant.ID_DOCUMENT_STATUS,Operation.neq,documentStatusCode.Provisional));
    this.predicateAdvancedSearchForDocument.Filter.push(new Filter(DocumentConstant.ID_DOCUMENT_STATUS,Operation.neq,documentStatusCode.DRAFT));
    this.predicateAdvancedSearchForDocument.Filter.push(new Filter(DocumentConstant.IS_ACCOUNTED,Operation.neq,accountingStatus.NotAccounted));
    this.predicateAdvancedSearchForDocument.OrderBy = new Array<OrderBy>();
    this.predicateAdvancedSearchForDocument.OrderBy.push(new OrderBy(DocumentConstant.DOCUMENT_DATE,OrderByDirection.desc));

    this.predicateAdvancedSearchForDocument.Relation = new Array<Relation>();
    this.predicateAdvancedSearchForDocument.Relation.push(new Relation("DocumentTaxsResume"));
    this.predicateAdvancedSearchForDocument.Relation.push(new Relation("IdTiersNavigation"));
    this.predicateAdvancedSearchForDocument.Relation.push(new Relation("DocumentTaxsResume.IdTaxNavigation"));
    this.predicateAdvancedSearchForDocument.SpecificRelation = ["DocumentTaxsResume.IdTaxNavigation"];
    this.predicateAdvancedSearchForDocument.page = this.gridSettings.state.skip + 1;
    this.predicateAdvancedSearchForDocument.pageSize = this.gridSettings.state.take;
  }

  initPredicateAdvancedSearchForSettlement() {
    this.predicateAdvancedSearchForSettlement = new PredicateFormat();
    this.predicateAdvancedSearchForSettlement.Filter = new Array<Filter>();
    this.predicateAdvancedSearchForSettlement.Filter.push(new Filter(ImportDocumentConstants.SETTLEMENT_DATE_FIELD,Operation.gte,this.startDateInput.value));
    this.predicateAdvancedSearchForSettlement.Filter.push(new Filter(ImportDocumentConstants.SETTLEMENT_DATE_FIELD,Operation.lte,this.endDateInput.value));
    this.predicateAdvancedSearchForSettlement.Filter.push(new Filter(ImportDocumentConstants.ID_TIERS_NAVIGATION_TYPE,Operation.eq,this.setllementType));
    this.predicateAdvancedSearchForSettlement.Filter.push(new Filter(DocumentConstant.IS_ACCOUNTED,Operation.neq,accountingStatus.NotAccounted));

    this.predicateAdvancedSearchForSettlement.OrderBy = new Array<OrderBy>();
    this.predicateAdvancedSearchForSettlement.OrderBy.push(new OrderBy(ImportDocumentConstants.CODE_DOCUMENT,OrderByDirection.desc));

    this.predicateAdvancedSearchForSettlement.Relation = new Array<Relation>();
    this.predicateAdvancedSearchForSettlement.Relation.push(new Relation("IdPaymentMethodNavigation"));
    this.predicateAdvancedSearchForSettlement.Relation.push(new Relation("IdTiersNavigation"));
    this.predicateAdvancedSearchForSettlement.Relation.push(new Relation("IdUsedCurrencyNavigation"));
    this.predicateAdvancedSearchForSettlement.Relation.push(new Relation("IdBankAccountNavigation"));
    this.predicateAdvancedSearchForSettlement.Relation.push(new Relation("SettlementCommitment"));
    this.predicateAdvancedSearchForSettlement.SpecificRelation = ["IdBankAccountNavigation.IdBankNavigation",
      "SettlementCommitment.Commitment","SettlementCommitment.Commitment.IdDocumentNavigation","SettlementCommitment.Commitment.IdDocumentNavigation.DocumentWithholdingTax"];
    this.predicateAdvancedSearchForSettlement.page = this.gridSettings.state.skip + 1;
    this.predicateAdvancedSearchForSettlement.pageSize = this.gridSettings.state.take;
  }
}
