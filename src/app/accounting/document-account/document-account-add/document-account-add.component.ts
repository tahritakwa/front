import {DatePipe} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DatePickerComponent} from '@progress/kendo-angular-dateinputs';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {GridComponent, PageChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {NumericTextBoxComponent} from '@progress/kendo-angular-inputs';
import {NumberFormatOptions} from '@progress/kendo-angular-intl';
import {DataSourceRequestState, State} from '@progress/kendo-data-query';
import {toNumber} from 'ngx-bootstrap/timepicker/timepicker.utils';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import swal from 'sweetalert2';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {Operation} from '../../../../COM/Models/operations';

import {AccountsConstant} from '../../../constant/accounting/account.constant';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';
import { DocumentAccountConstant } from '../../../constant/accounting/document-account.constant';
import { FiscalYearConstant } from '../../../constant/accounting/fiscal-year.constant';
import {JournalConstants} from '../../../constant/accounting/journal.constant';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {TemplateAccountingConstant} from '../../../constant/accounting/template.constant';
import {KeyboardConst} from '../../../constant/keyboard/keyboard.constant';
import {SearchConstant} from '../../../constant/search-item';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {AuthService} from '../../../login/Authentification/services/auth.service';
import {DocumentAccount} from '../../../models/accounting/document-account';
import {DocumentAccountAttachement} from '../../../models/accounting/document-account-attachement';
import {DocumentAccountLine} from '../../../models/accounting/document-account-line';
import {DocumentAccountStatus} from '../../../models/enumerators/document-account-status.enum';
import {FiscalYearStateEnumerator} from '../../../models/enumerators/fiscal-year-state-enumerator.enum';
import {FileInfo} from '../../../models/shared/objectToSend';
import {matches} from '../../../shared/components/document/document-generic-method/generic-grid';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {DataTransferShowSpinnerService} from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import {isDateValidAccounting, ValidationService} from '../../../shared/services/validation/validation.service';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {RoleConfigConstant} from '../../../Structure/_roleConfigConstant';
import {AddAccountComponent} from '../../account/add-account/add-account.component';
import {AccountingConfigurationService} from '../../services/configuration/accounting-configuration.service';
import {DocumentAccountFileStorageService} from '../../services/document-account/document-account-file-storage.service';
import {DocumentAccountService} from '../../services/document-account/document-account.service';
import {FiscalYearService} from '../../services/fiscal-year/fiscal-year.service';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {JournalService} from '../../services/journal/journal.service';
//import { StarkRolesService } from 'app/stark-permissions/service/roles.service';
import {TemplateAccountingService} from '../../services/template/template.service';
import {TemplateAccountingAddComponent} from '../../template-accounting/template-accounting-add/template-accounting-add.component';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import { isUndefined } from 'util';

@Component({
  selector: 'app-document-account-add',
  templateUrl: './document-account-add.component.html',
  styleUrls: ['./document-account-add.component.scss'],
})
export class DocumentAccountAddComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(GridComponent) grid;
  @ViewChild('documentDateField') documentDateInput: DatePickerComponent;
  @ViewChild('journalField') journalInput: ComboBoxComponent;
  @ViewChild('documentLineDateField') documentLineDateInput: DatePickerComponent;
  @ViewChild('accountId') accountIdInput: ComboBoxComponent;
  @ViewChild('label') labelInput: ElementRef;
  @ViewChild('reference') referenceInput: ElementRef;
  @ViewChild('labelDocumentAccountLine') labelDocumentAccountLineInput: ElementRef;
  @ViewChild('debitAmount') debitAmountInput: NumericTextBoxComponent;
  @ViewChild('creditAmount') creditAmountInput: NumericTextBoxComponent;
  public keyAction: any;
  public totalCreditAmount = '0';
  public totalDebitAmount = '0';
  public isUpdateMode = false;
  public documentAccountLineFormGroup: FormGroup;
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  public documentAccountFormGroup: FormGroup;
  public documentAccountLineList: Array<DocumentAccountLine> = [];
  public journalFiltredList: any;
  public templateAccountingFiltredList: any;
  public accountFiltredList: any;
  public accountList = [];
  public accountDropDownIsInEditingMode = false;
  public accountDropDownIsInRemoveMode = false;
  public isNew = true;
  public rowIndex = -1;
  public sender: any;
  public codeDocument: string;
  public currentExerciceStartDate = new Date(this.activatedRoute.snapshot.data['currentFiscalYear'].startDate);
  public currentExerciceEndDate = new Date(this.activatedRoute.snapshot.data['currentFiscalYear'].endDate);
  public dateOfToday: Date = new Date();
  public isSaveOperation: boolean;
  // number format
  public formatNumberOptions: NumberFormatOptions;
  public minAmountNumber = 0;
  public minLength = AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH;
  public maxLength = AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH;
  public spinner = false;
  public editMode = false;
  public showDelay = SharedAccountingConstant.SHOW_TOOLTIP_DELAY;
  public documentAccountStatus: number;
  public isDocumentDateInClosedPeriodStatus: boolean;
  public selectedDocumentAccountLines: number[] = [];
  public documentAccountLineIdComingFromOutside: number;
  public attachementFilesToUpload = [];
  public attachementFilesUploaded = [];
  public attachementFilesToDelete = [];
  public isOpenendModal = true;
  public isDocumentDateFocus: boolean;
  public isJournalFocus: boolean;
  public isAccountFocus: boolean;
  public isDebitAmountFocus: boolean;
  public isCreditAmountFocus: boolean;
  public isDocumentLineDateFocus: boolean;
  public currentFiscalYear;
  public templateAccountingList: any;
  public docClickSubscription: any;
  public journalValue: any;
  public lastValidJournalValue: any;
  public templateAccountingValue: any;
  public lastValidTemplateAccountingValue: any;
  public readOnlyMode = false;
  public currentDocumentAccount: any;
  public currency: any = this.activatedRoute.snapshot.data['currency'];
  accountDropDownOpened = false;
  public currentDocumentDate: Date;
  public originCodeDocument: string;
  public isCheckedDocumentLabel = true;
  public saveButtonDisabled = false;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public pageSize = SharedConstant.DEFAULT_ITEMS_NUMBER;
  public currentPage = NumberConstant.ZERO;
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: DocumentAccountConstant.ACCOUNT_CODE_FIELD,
      title: DocumentAccountConstant.ACCOUNT_CODE_TITLE,
      tooltip: DocumentAccountConstant.ACCOUNT_CODE_TITLE,
      filterable: true,
    },
    {
      field: DocumentAccountConstant.ACCOUNT_NAME_FIELD,
      title: DocumentAccountConstant.ACCOUNT_NAME_TITLE,
      tooltip: DocumentAccountConstant.ACCOUNT_NAME_TITLE,
      filterable: true,
    },
    {
      field: DocumentAccountConstant.DOCUMENT_LINE_DATE_FIELD,
      title: DocumentAccountConstant.DOCUMENT_LINE_DATE_TITLE,
      tooltip: DocumentAccountConstant.DOCUMENT_LINE_DATE_TITLE,
      filterable: true,
    },
    {
      field: DocumentAccountConstant.REFERENCE_FIELD,
      title: DocumentAccountConstant.REFERENCE_TITLE,
      tooltip: DocumentAccountConstant.REFERENCE_TITLE,
      filterable: true
    },
    {
      field: DocumentAccountConstant.LABEL_FIELD,
      title: DocumentAccountConstant.LABEL_TITLE,
      tooltip: DocumentAccountConstant.LABEL_TITLE,
      filterable: true
    },
    {
      field: DocumentAccountConstant.DEBIT_AMOUNT_FIELD,
      title: DocumentAccountConstant.TOTAL_DEBIT_AMOUNT_TITLE,
      tooltip: DocumentAccountConstant.TOTAL_DEBIT_AMOUNT_TITLE,
      filterable: false,
    },
    {
      field: DocumentAccountConstant.CREDIT_AMOUNT_FIELD,
      title: DocumentAccountConstant.TOTAL_CREDIT_AMOUNT_TITLE,
      tooltip: DocumentAccountConstant.TOTAL_CREDIT_AMOUNT_TITLE,
      filterable: false
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  hasReadWritePermission = false;
  public dataTransferShowSpinnerService: DataTransferShowSpinnerService;
  public AccountingPermissions = RoleConfigConstant.AccountingPermissions;
  listFile: any;
  private subscription: Subscription;
  private editedRowIndex: number;
  private documentAccountIdOnUpdate: number;
  private isLabelFocus: boolean;
  private isLabelDocumentAccountLineFocus: boolean;
  private isReferenceFocus: boolean;
  private isEmptyLine = true;
  private userId : number;
  private isLineTouched = false;
  constructor(public documentAccountService: DocumentAccountService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private validationService: ValidationService,
              private translate: TranslateService,
              private growlService: GrowlService,
              private datePipe: DatePipe,
              private templateAccountingService: TemplateAccountingService,
              private viewRef: ViewContainerRef,
              private genericAccountingService: GenericAccountingService,
              private accountingConfigurationService: AccountingConfigurationService,
              private fiscalYearService: FiscalYearService,
              private journalService: JournalService,
              @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService,
              private documentAccountFileStorageService: DocumentAccountFileStorageService,
              private formModalDialogService: FormModalDialogService,
              public authService: AuthService,
              private swalWarrings: SwalWarring, private renderer: Renderer2,
              private cdr: ChangeDetectorRef,
              private localStorageService: LocalStorageService) {
                this.userId = this.localStorageService.getUserId();
    this.hasReadWritePermission = this.authService.hasAuthorities([this.AccountingPermissions.ADD_DOCUMENTS_ACCOUNTS, this.AccountingPermissions.UPDATE_DOCUMENTS_ACCOUNTS]);
    this.attachementFilesToUpload = new Array<FileInfo>();
    if (this.activatedRoute.snapshot.data['currentFiscalYear']) {
      this.currentFiscalYear = this.activatedRoute.snapshot.data['currentFiscalYear'];
    } else {
      this.accountingConfigurationService.getJavaGenericService().getEntityList(
        AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL
      ).subscribe(currentFiscalYear => {
        this.currentFiscalYear = currentFiscalYear;
      });
    }
    if (this.activatedRoute.snapshot.data['documentAccountToBeUpdated']) {
      this.currentDocumentAccount = this.activatedRoute.snapshot.data['documentAccountToBeUpdated'];
    }
    if (dataTransferShowSpinnerService) {
      this.dataTransferShowSpinnerService = dataTransferShowSpinnerService;
    }
  }

  get documentAccountDate(): FormControl {
    return this.documentAccountFormGroup.get('documentDate') as FormControl;
  }

  get documentAccountCodeDocument(): FormControl {
    return this.documentAccountFormGroup.get('codeDocument') as FormControl;
  }

  get documentAccountLabel(): FormControl {
    return this.documentAccountFormGroup.get('label') as FormControl;
  }

  get documentAccountJournal(): FormControl {
    return this.documentAccountFormGroup.get('journalId') as FormControl;
  }

  get documentAccountTemplateAccountingId(): FormControl {
    return this.documentAccountFormGroup.get('templateAccountingId') as FormControl;
  }

  get documentAccountLineAccountId(): FormControl {
    return this.documentAccountLineFormGroup.get('accountId') as FormControl;
  }

  get documentLineDate(): FormControl {
    return this.documentAccountLineFormGroup.get('documentLineDate') as FormControl;
  }

  get documentAccountLineReference(): FormControl {
    return this.documentAccountLineFormGroup.get('reference') as FormControl;
  }

  get documentAccountLineLabel(): FormControl {
    return this.documentAccountLineFormGroup.get('label') as FormControl;
  }

  get documentAccountLineDebitAmount(): FormControl {
    return this.documentAccountLineFormGroup.get('debitAmount') as FormControl;
  }

  get documentAccountLineCreditAmount(): FormControl {
    return this.documentAccountLineFormGroup.get('creditAmount') as FormControl;
  }

  isDateInClosedPeriod(date: Date) {
    return this.currentFiscalYear.closingState !== FiscalYearStateEnumerator.Open && date >= new Date(this.currentFiscalYear.startDate)
      && date <= new Date(this.currentFiscalYear.closingDate);
  }

  handleFilterTemplateAccounting(writtenValue) {
    this.templateAccountingFiltredList = this.getTemplateAccountingFilteredListByWrittenValue(writtenValue);
  }

  handleFilterJournal(writtenValue) {
    this.journalFiltredList = this.genericAccountingService.getJournalFilteredListByWrittenValue(writtenValue);
  }
  onCreditOrDebitAmmountChange(event)
  {
    var value = event.srcElement.value;
    if (
      value.indexOf(",") !== -1 &&
      event.inputType === "insertText" &&
      +event.data === 0 &&
      value.split(",")[1].length > this.currency.Precision
    ) {
      event.srcElement.value = value.substr(0, value.length - 1);
    }
  }
  public addHandler({ sender }, formGroup)
  {
    if (this.documentAccountFormGroup.valid && !this.accountDropDownIsInEditingMode) {
        this.sender = sender;
        this.rowIndex = -1;
        this.setDocumentAccountLineLabel();
        this.documentLineDate.setValue(this.documentAccountDate.value);
        this.documentAccountLineFormGroup.patchValue({
          'accountId': null,
          'nameAccount': null,
          'debitAmount': NumberConstant.ZERO,
          'creditAmount': NumberConstant.ZERO
        });
        this.documentAccountLineFormGroup.markAsTouched();
        if (this.isEmptyLine) {
          sender.addRow(this.documentAccountLineFormGroup);
          this.accountDropDownIsInEditingMode = true;
        }
        this.isEmptyLine = true;
        this.accountFiltredList = this.accountList;
      
    } else {
      this.validationService.validateAllFormFields(this.documentAccountFormGroup);
    }
    if (
      this.grid.wrapper.nativeElement.getElementsByClassName("k-grid-edit-row")
        .length !== 0
    ) {
      this.closeHandlerEscEvent();
    }

  }

  public isDocumentAccountCreatedByConcludingCurrentFiscalYear() {
    return this.documentAccountStatus === DocumentAccountStatus.BY_CONCLUDING_CURRENT_FISCAL_YEAR_IS_CREATED;
  }

  public isDocumentAccountCreatedByImport() {
    return this.documentAccountStatus === DocumentAccountStatus.BY_IMPORT_DOCUMENT_IS_CREATED ||
    this.documentAccountStatus === DocumentAccountStatus.BY_IMPORT_SETTLEMENT_IS_CREATED;
  }

  public isDocumentAccountCreatedByGenerationFromAmortization() {
    return this.documentAccountStatus === DocumentAccountStatus.BY_GENERATION_FROM_AMORTIZAION_IS_CREATED;
  }

  public lineClickHandler({sender, rowIndex, dataItem}) {
    if (this.hasReadWritePermission && !this.editMode &&  !this.isLineTouched && !this.isDocumentAccountCreatedByImport()
      && !this.isDocumentAccountCreatedByConcludingCurrentFiscalYear() && !this.isDocumentAccountCreatedByGenerationFromAmortization()
      && !this.isDocumentDateInClosedPeriodStatus && !this.readOnlyMode) {
      dataItem.debitAmount = Number(dataItem.debitAmount);
      dataItem.creditAmount = Number(dataItem.creditAmount);
      dataItem.documentLineDate = new Date(dataItem.documentLineDate);
      this.isNew = false;
      this.isLineTouched = false;
      this.rowIndex = this.documentAccountLineList.indexOf(dataItem) + (this.pageSize * this.currentPage);
      this.sender = sender;
      if (!this.accountDropDownIsInEditingMode && !this.accountDropDownIsInRemoveMode) {
        if (!dataItem.close && !dataItem.letter) {
          this.setDocumetAccountLineForm(dataItem);
          this.editedRowIndex = this.rowIndex;
          this.documentAccountLineFormGroup.markAsTouched();
          sender.editRow(this.rowIndex);
          this.accountDropDownIsInEditingMode = true;
          this.editMode = true;
        }
      }
      else if(this.accountDropDownIsInEditingMode){
        sender.closeRow(this.editedRowIndex);
        this.accountDropDownIsInEditingMode = false;

      }
      else {
        this.accountDropDownIsInRemoveMode = false;
      }
    }
    this.accountFiltredList = this.accountList;
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
    this.setAccountIdEmpty();
    this.editMode = false;
    this.isLineTouched = false;
  }

  public saveHandler(event)
  {
    const { sender, rowIndex, formGroup, isNew } = event;
    if (
      (this.genericAccountingService.isNullAndUndefinedAndEmpty(
        this.gridSettings.gridData
      ) ||
        this.gridSettings.gridData.total === 0) &&
      this.documentAccountLineFormGroup.value.debitAmount === null &&
      this.documentAccountLineFormGroup.value.creditAmount === null
    ) {
      this.cancelHandler({ sender, rowIndex });
    } else {
      this.checkDebitOrCreditEmpty();
      if (this.documentAccountLineFormGroup.valid) {
        if (isNew) {
          event.hasOwnProperty("action")
            ? this.saveDocumentAccountLine(
                formGroup,
                sender,
                rowIndex,
                event.action
              )
            : this.saveDocumentAccountLine(formGroup, sender, rowIndex);
        } else {
          this.editDocumentAccountLine(rowIndex, sender);
        }
        this.loadDocumentAccountLineList();
      } else {
        this.validationService.validateAllFormFields(
          this.documentAccountLineFormGroup
        );
      }
    }
  }

  public removeHandler(event) {
    const dataItem = event.dataItem;
    let index: number;
    if (dataItem.id) {
      index = this.currentDocumentAccount.documentAccountLines
        .indexOf(this.currentDocumentAccount.documentAccountLines.find(line => line.id === dataItem.id));
    } else {
      index = event.rowIndex;
    }
    this.totalDebitAmount = (+this.totalDebitAmount - (+this.currentDocumentAccount.documentAccountLines[index].debitAmount)).toFixed(this.currency.Precision);
    this.totalCreditAmount = (+this.totalCreditAmount - (+this.currentDocumentAccount.documentAccountLines[index].creditAmount)).toFixed(this.currency.Precision);
    this.currentDocumentAccount.documentAccountLines.splice(index, 1);
    this.documentAccountLineList.splice(this.documentAccountLineList.indexOf(dataItem), 1);
    this.accountDropDownIsInRemoveMode = true;
    this.documentAccountLineFormGroup.markAsTouched();
    this.enableTemplateAccountingDropDown();
    this.loadDocumentAccountLineList();
  }

  save(formGroup, saveAndContinue: boolean) {
    const rowIndex = this.rowIndex;
    const isNew = this.isNew;
    const sender = this.sender;
    if (this.accountDropDownIsInEditingMode) {
      this.saveHandler({sender, rowIndex, formGroup, isNew});
    }
    this.saveDocumentAccountOnClick(saveAndContinue);
  }

  public saveDocumentAccountOnClick(saveAndContinue: boolean) {
    if (this.documentAccountFormGroup.valid && !this.accountDropDownIsInEditingMode) {
      if (!this.checkTotalDebitAndTotalCreditNotEmpty()) {
        this.isSaveOperation = true;
        const documentAccountEntity = this.documentAccountFormGroup.getRawValue();
        documentAccountEntity.codeDocument = this.documentAccountFormGroup.controls['codeDocument'].value;
        documentAccountEntity.documentAccountLines = this.currentDocumentAccount.documentAccountLines.slice();
        documentAccountEntity.documentAccountLines.reverse();
        documentAccountEntity.documentAccountLines.map(documentAccountLine => {
          documentAccountLine.documentLineDate = this.datePipe.transform(documentAccountLine.documentLineDate,
            SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
        });
        const documentDate = new Date(documentAccountEntity.documentDate);
        documentAccountEntity.documentDate = this.datePipe.transform(new Date(documentDate.getFullYear(), documentDate.getMonth(),
          documentDate.getDate(), documentDate.getHours(), documentDate.getMinutes(), documentDate.getSeconds()),
          SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
        if (this.isUpdateMode) {
          documentAccountEntity.id = this.documentAccountIdOnUpdate;
          this.documentAccountService.getJavaGenericService().updateEntity(documentAccountEntity, documentAccountEntity.id)
            .subscribe((documentAccount) => {
              this.spinner = true;
              this.currentDocumentAccount.codeDocument = documentAccount.codeDocument;
              if(this.authService.hasAuthority(this.AccountingPermissions.DELETE_FILE_ATTACHMENT_TO_DOCUMENTS_ACCOUNTS) ) {
                this.documentAccountFileStorageService.deleteFileFromDirectory(this.attachementFilesToDelete);
              }
              if (!this.attachementFilesToUpload || this.attachementFilesToUpload.length === 0) {
                this.growlService.successNotification(this.translate.instant(DocumentAccountConstant.DOCUMENT_ACCOUNT_UPDATED_SUCCESSFULLY));
                this.router.navigateByUrl(DocumentAccountConstant.LIST_DOCUMENT_ACCOUNT_URL);
              } else {
                this.uploadAttachmentFiles(documentAccountEntity.id, saveAndContinue);
              }
            }, () => {
              this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.FAILURE_OPERATION));
            });
        } else {
          this.saveButtonDisabled = true;
          this.documentAccountService.getJavaGenericService().saveEntity(documentAccountEntity)
            .subscribe((documentAccount) => {
              this.spinner = true;
              this.currentDocumentAccount.codeDocument = documentAccount.codeDocument;
              if (!this.attachementFilesToUpload || this.attachementFilesToUpload.length === 0) {
                this.growlService.successNotification(this.translate.instant(DocumentAccountConstant.DOCUMENT_ACCOUNT_SAVED_SUCCESSFULLY,
                  {code: this.currentDocumentAccount.codeDocument}));
                if (saveAndContinue) {
                  this.spinner = false;
                  this.documentAccountFormGroup.reset();
                  this.documentAccountLineFormGroup.reset();
                  this.documentAccountLineList = [];
                  this.totalCreditAmount = '0';
                  this.totalDebitAmount = '0';
                  this.currentDocumentAccount.documentAccountLines = [];
                  this.gridSettings.gridData = {
                    data: this.documentAccountLineList,
                    total: this.currentDocumentAccount.documentAccountLines.length
                  };
                  this.ngOnInit();
                  this.ngAfterViewInit();
                } else {
                  this.router.navigateByUrl(DocumentAccountConstant.LIST_DOCUMENT_ACCOUNT_URL);
                }
              } else {
                this.uploadAttachmentFiles(documentAccount.id, saveAndContinue);
              }
            }, () => {
              this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.FAILURE_OPERATION));
            }, () => {
              this.saveButtonDisabled = false;
            });
        }
      }
    } else {
      this.validationService.validateAllFormFields(this.documentAccountFormGroup);
    }
  }

  loadDocumentAccountOnUpdate() {
    let data;
    data = this.currentDocumentAccount;
    this.currentDocumentDate = new Date(this.currentDocumentAccount.documentDate);
    this.codeDocument = this.currentDocumentAccount.codeDocument;
    this.currentDocumentAccount.documentDate = new Date(this.currentDocumentAccount.documentDate);

    this.lastValidJournalValue = this.currentDocumentAccount.journalId;
    this.loadDocumentAccountLineList();
    this.loadTemplateAccountingByJournal(this.currentDocumentAccount.journalId);
    this.setDocumetAccountForm(this.currentDocumentAccount);
    this.updateTotalDebitAndTotalCreditPrecision(this.currentDocumentAccount);

    this.disableJournalIfDocumentAccountContainsReconcilableLines(data.documentAccountLines);

    this.documentAccountStatus = data.indexOfStatus;

    if (data) {
     if (this.isDocumentAccountCreatedByConcludingCurrentFiscalYear() && this.hasReadWritePermission) {
        this.growlService.warningNotification(this.translate.instant(SharedAccountingConstant.DOCUMENT_COMES_FROM_A_CLOSING_OPERATION_YOU_ARE_IN_READ_MODE));
        this.disableDocumentFormGroup(data.imported, data.indexOfStatus, this.isDocumentDateInClosedPeriodStatus);
      } else if (this.isDocumentAccountCreatedByGenerationFromAmortization() && this.hasReadWritePermission) {
        this.growlService.warningNotification(this.translate.instant(SharedAccountingConstant.DOCUMENT_ACCOUNT_IS_AUTOMATICALLY_GENERATED_YOU_ARE_IN_READ_MODE));
        this.disableDocumentFormGroup(data.imported, data.indexOfStatus, this.isDocumentDateInClosedPeriodStatus);
      } else if (this.isDocumentAccountCreatedByImport() && this.hasReadWritePermission) {
        this.disableDocumentFormGroup(data.imported, data.indexOfStatus, this.isDocumentDateInClosedPeriodStatus);
      } else {
        this.isDocumentDateInClosedPeriodStatus = this.isDateInClosedPeriod(new Date(data.documentDate));
        if (this.isDocumentDateInClosedPeriodStatus && this.hasReadWritePermission) {
          this.growlService.warningNotification(this.translate.instant(SharedAccountingConstant.DOCUMENT_IN_CLOSED_PERIOD_YOU_ARE_IN_READ_MODE));
          this.disableDocumentFormGroup(data.imported, data.indexOfStatus, this.isDocumentDateInClosedPeriodStatus);
        }
      }
      if (!this.authService.hasAuthorities([this.AccountingPermissions.UPDATE_DOCUMENTS_ACCOUNTS])) {
        this.documentAccountFormGroup.disable();
        this.documentAccountLineFormGroup.disable();
      }
    }
    this.spinner = false;
  }

  selectDocumentAccountLineComingFromOutside(documentAccount: any) {
    this.selectedDocumentAccountLines = documentAccount.documentAccountLines
      .filter(line => line.id === this.documentAccountLineIdComingFromOutside).map(line => line.id);
    for (let i = 0; i < this.currentDocumentAccount.documentAccountLines.length; i++) {
      if (this.currentDocumentAccount.documentAccountLines[i].id === this.documentAccountLineIdComingFromOutside) {
        this.currentPage = Math.floor(i / this.pageSize);
        this.gridSettings.state.skip = i;
        this.loadDocumentAccountLineList();
        break;
      }
    }
  }

  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / this.pageSize;
    this.pageSize = event.take;
    this.loadDocumentAccountLineList();
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
  }

  loadDocumentAccountLineList() {
    this.documentAccountLineList = [];
    const start = this.currentPage * this.pageSize;
    let limit;
    if (this.currentDocumentAccount.documentAccountLines.length >= start + this.pageSize + 1) {
      limit = start + this.pageSize;
    } else {
      limit = this.currentDocumentAccount.documentAccountLines.length;
    }
    for (let i = start; i < limit; i++) {
      let documentAccountLine;
      let line = this.currentDocumentAccount.documentAccountLines[i];
      documentAccountLine = new DocumentAccountLine(line.id, line.documentLineDate, line.reference, line.label,
        line.debitAmount, line.creditAmount, line.accountId, '', '', line.close, line.letter, line.reconciliationDate);
      documentAccountLine.nameAccount = this.accountList.find(accountElement => accountElement.id === line.accountId).label;
      documentAccountLine.codeAccount = this.accountList.find(accountElement => accountElement.id === line.accountId).code;
      documentAccountLine.documentLineDate = new Date(documentAccountLine.documentLineDate);
      this.documentAccountLineList.push(documentAccountLine);
    }
    this.gridSettings.gridData = {data: this.documentAccountLineList, total: this.currentDocumentAccount.documentAccountLines.length};
  }

  public loadTemplateAccount(id: number) {
    this.templateAccountingService.getJavaGenericService().getEntityById(id)
      .subscribe(templateAccount => {
        const values = this.documentAccountFormGroup.value;
        if (!this.currentDocumentAccount) {
          this.currentDocumentAccount = this.documentAccountFormGroup.getRawValue();
          this.currentDocumentAccount.documentAccountLines = [];
        }
        const documentLabel = (values.label == null || values.label.length === 0) ? templateAccount.label : values.label;
        const documentAccount = new DocumentAccount(values.documentDate, this.documentAccountFormGroup.getRawValue().codeDocument, documentLabel,
          templateAccount.journalId, this.documentAccountLineList);
        this.setDocumetAccountForm(documentAccount);
        this.loadTemplateAccountLineList(templateAccount.templateAccountingDetails);
      });
  }

  public loadTemplateAccountLineList(templateAccountLineList) {
    let totalDebitAmount = +this.totalDebitAmount;
    let totalCreditAmount = +this.totalCreditAmount;

    let documentAccountLine;
    const documentLineDate = new Date(this.documentAccountDate.value);
    const start = NumberConstant.ZERO;
    const limit = templateAccountLineList.length >= start + this.pageSize + 1 ? start + this.pageSize : templateAccountLineList.length;
    for (let i = start; i < limit; i++) {
      documentAccountLine = new DocumentAccountLine(undefined, documentLineDate, '',
        templateAccountLineList[i].label, +NumberConstant.ZERO, +NumberConstant.ZERO, templateAccountLineList[i].accountId, '', '');
      documentAccountLine.nameAccount = this.accountList.find(accountElement => accountElement.id === templateAccountLineList[i].accountId).label;
      documentAccountLine.debitAmount = templateAccountLineList[i].debitAmount;
      documentAccountLine.creditAmount = templateAccountLineList[i].creditAmount;
      documentAccountLine.codeAccount = this.accountList.find(accountElement => accountElement.id === templateAccountLineList[i].accountId).code;

      totalDebitAmount += +documentAccountLine.debitAmount;
      totalCreditAmount += +documentAccountLine.creditAmount;
      this.currentDocumentAccount.documentAccountLines.unshift(documentAccountLine);

      this.documentAccountLineList.unshift(documentAccountLine);
    }
    this.totalDebitAmount = ((+totalDebitAmount)).toFixed(this.currency.Precision).toString();
    this.totalCreditAmount = ((+totalCreditAmount)).toFixed(this.currency.Precision).toString();
    this.currentPage = NumberConstant.ZERO;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.loadDocumentAccountLineList();
  }

  initAccountFilteredList() {
    this.genericAccountingService.getAccountList().then((accountList: any) => {
      this.accountList = accountList;
      this.accountFiltredList = accountList.slice(0);
    });
  }

  handleAddNewElementToAccountDropdown() {
    this.genericAccountingService.getAccountList().then((accountList: any) => {
      if (this.accountList.length < accountList.length) {
        this.setDefaultValueOfAccountDropdownToLastElement(accountList.reduce((elementOfMaxId, element) =>
          elementOfMaxId.id > element.id ? elementOfMaxId : element));
        this.accountList = accountList.slice(0);
        this.accountFiltredList = accountList.slice(0);
      }
    });
  }

  initJournalFilteredList() {
    this.genericAccountingService.getJournalList().then((journalList: any) => {
      this.journalFiltredList = journalList.slice(0);
    });
  }

  handleAddNewElementToJournalDropdown() {
    this.genericAccountingService.getJournalList().then((journalList: any) => {
      if (this.journalFiltredList.length < journalList.length) {
        this.setDefaultValueOfJournalDropdownToLastElement(journalList.reduce((elementOfMaxId, element) =>
          elementOfMaxId.id > element.id ? elementOfMaxId : element));
        this.journalFiltredList = journalList.slice(0);
      }
    });
  }

  handleAddNewElementToTemplateAccountingDropdown() {
    this.isOpenendModal = true;
    if (this.journalValue) {
      this.templateAccountingService.getJavaGenericService().getEntityById(this.journalValue, TemplateAccountingConstant
        .SERACH_BY_JOURNAL).subscribe(templateAccountingList => {
        if (this.checkChangeTemplateAccounting(this.templateAccountingFiltredList, templateAccountingList)) {
          this.setDefaultValueOfTemplateAccountingDropdownToLastElement(templateAccountingList
            .reduce((elementOfMaxId, element) => elementOfMaxId.id > element.id ? elementOfMaxId : element));
          this.templateAccountingFiltredList = templateAccountingList.slice(0);
        }
      });
    }
  }

  setDefaultValueOfTemplateAccountingDropdownToLastElement(lastElement: any) {
    this.documentAccountTemplateAccountingId.setValue(lastElement.id);
    this.loadTemplateAccount(lastElement.id);
  }

  setDefaultValueOfJournalDropdownToLastElement(lastElement: any) {
    this.documentAccountJournal.setValue(lastElement.id);
    this.journalValue = lastElement.id;
  }

  setDefaultValueOfAccountDropdownToLastElement(lastElement: any) {
    this.documentAccountLineFormGroup.patchValue({'accountId': lastElement.id, 'nameAccount': lastElement.label});
  }

  selectedChangeHasValue($event) {
    return ($event !== undefined);
  }

  handleChangeTemplateAccounting($event): void {
    if (this.selectedChangeHasValue($event)) {

      this.swalWarrings.CreateSwal(this.translate.instant(AccountsConstant.ARE_YOU_SURE_TO_RELOAD_TEMPLATE_ACCOUNTING_LINES),
        this.translate.instant(AccountsConstant.ARE_YOU_SURE), this.translate.instant(AccountsConstant.VALIDATION_CONFIRM),
        this.translate.instant(AccountsConstant.CANCEL)).then((result) => {
        if (result.value) {

          this.loadTemplateAccount($event);
          this.lastValidTemplateAccountingValue = $event;
          this.documentAccountFormGroup.controls['templateAccountingId'].setValue($event);

        } else if (result.dismiss === swal.DismissReason.cancel) {

          this.cdr.detectChanges();
          this.templateAccountingValue = this.lastValidTemplateAccountingValue;
          this.documentAccountFormGroup.controls['templateAccountingId'].setValue(this.lastValidTemplateAccountingValue);

        }
      });
    }
  }

  disableJournalIfDocumentAccountContainsReconcilableLines(documentAccountLines: Array<DocumentAccountLine>) {
    if (this.getTotalReconcilableLinesOfCurrentDocumentAccount(documentAccountLines) > NumberConstant.ZERO) {
      this.documentAccountJournal.disable();
    }
  }

  getTotalReconcilableLinesOfCurrentDocumentAccount(documentAccountLines: Array<DocumentAccountLine>) {
    return documentAccountLines.filter(line => line.close === true).length;
  }

  setDocumetAccountForm(documentAccount: DocumentAccount) {
    this.documentAccountFormGroup.patchValue(documentAccount);
  }

  setDocumetAccountLineForm(documentAccountLine: DocumentAccountLine) {
    this.documentAccountLineFormGroup.patchValue(documentAccountLine);
    this.documentAccountLineAccountId.setValue(documentAccountLine.accountId);
  }

  addNewJournal() {
    this.genericAccountingService.openAddJournalModal(this.viewRef, this.handleAddNewElementToJournalDropdown.bind(this));
  }

  addNewAccount() {
    const modalTitle = this.translate.instant(AccountsConstant.ADD_NEW_ACCOUNT);
    this.formModalDialogService.openDialog(modalTitle, AddAccountComponent, this.viewRef,
      this.handleAddNewElementToAccountDropdown.bind(this),
      {'id': undefined, 'planCode': undefined, 'code': undefined},
      null, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  addNewTemplateAccounting(): void {
    this.isOpenendModal = false;
    if (!this.documentAccountJournal.value) {
      this.documentAccountJournal.setValue(this.journalValue);
    }
    const dataToSend = {'journalId': this.documentAccountJournal.value, 'addNewAccountHidden': false};
    const modalTitle = this.translate.instant(TemplateAccountingConstant.NEW_TEMPLATE_ACCOUNTING);
    this.formModalDialogService.openDialog(modalTitle, TemplateAccountingAddComponent, this.viewRef,
      this.handleAddNewElementToTemplateAccountingDropdown.bind(this), dataToSend,
      null, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  generateRandomCodeDocument() {
    if (this.isDateInClosedPeriod(this.documentAccountFormGroup.value.documentDate)){
      this.documentAccountFormGroup.controls['documentDate'].setErrors({'documentAccountInvalidDate': true});
    }
    if (this.documentAccountFormGroup.value.documentDate != null) {
      if (!this.currentDocumentDate ||
        this.currentDocumentDate.getFullYear() !== this.documentAccountFormGroup.value.documentDate.getFullYear() ||
        this.currentDocumentDate.getMonth() !== this.documentAccountFormGroup.value.documentDate.getMonth()) {
        this.documentAccountService.getJavaGenericService().getEntityList(
          `${DocumentAccountConstant.GET_CODE_DOCUMENT}` +
          `?documentDate=${this.datePipe.transform(this.documentAccountFormGroup.value.documentDate,
            SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS)}`)
          .subscribe(documentAccount => {
            this.documentAccountFormGroup.controls['codeDocument'].setValue(documentAccount.codeDocument);
            this.originCodeDocument = documentAccount.codeDocument;
          });
      } else {
        this.documentAccountFormGroup.controls['codeDocument'].setValue(this.codeDocument);
        this.originCodeDocument = this.codeDocument;
      }
    }
  }

  initDocumentAccountForm() {
    const documentAccountModel = new DocumentAccount();
    this.documentAccountFormGroup = new FormGroup({
      'codeDocument': new FormControl({value: documentAccountModel.codeDocument, disabled: true}),
      'documentDate': new FormControl(this.dateOfToday, Validators.required),
      'label': new FormControl(documentAccountModel.label,
        [Validators.required, Validators.minLength(AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH),
          Validators.maxLength(AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH)]),
      'journalId': new FormControl(documentAccountModel.journalId, Validators.required),
      'templateAccountingId': new FormControl(''),
      'documentAccountLines': new FormControl(documentAccountModel.documentAccountLines)
    });
  }

  setAccountDropDownListHasASelectedValue(keyName) {
    if (keyName === KeyboardConst.ARROW_DOWN || keyName === KeyboardConst.ARROW_UP) {
      this.documentAccountService.setAccountDropDownListHasASelectedValue(true);
    }
  }

  handleKeyAction() {

    this.keyAction = (event) => {
      this.setAccountDropDownListHasASelectedValue(event.key);
      this.documentAccountService.handleKeyAction(event, this.documentAccountLineFormGroup, this.viewRef,
        this.handleAddNewElementToAccountDropdown.bind(this), this.isOpenendModal);
      if (event.code === KeyboardConst.TAB) {
        this.checkInputNotNulBeforeTabulation(event);
      }
      if (event.code === KeyboardConst.ESCAPE) {
        this.closeHandlerEscEvent();
      }
      if (event.code === KeyboardConst.NUMPAD_ADD && !this.isJournalFocus && !this.isLabelFocus && !this.isReferenceFocus && !this.isDocumentDateFocus) {
        const sender = this.grid;
        setTimeout(() => {
          this.addHandler({sender}, this.documentAccountLineFormGroup);
        }, NumberConstant.ONE_HUNDRED);

      }
      if (event.code === KeyboardConst.F2) {
        this.eventKeyboardClick(event);
      }
      if (event.code === KeyboardConst.ENTER || event.code === KeyboardConst.NUMPAD_ENTER) {
        this.keyEnterAction(this.sender, this.documentAccountLineFormGroup, event);
      }
      if (event.code === KeyboardConst.SHIFT_RIGHT || event.code === KeyboardConst.SHIFT_LEFT) {
        this.documentAccountLineContainsEmptyDebitAndCredit();
      }
      if (!this.isLabelFocus && !this.isReferenceFocus && !this.saveButtonDisabled &&
        (event.code === KeyboardConst.BACKSLASH || event.code === KeyboardConst.NUMPAD_MULTIPLY)) {
        this.saveButtonDisabled = true;
        const rowIndex = this.rowIndex;
        const sender = this.grid;
        const isNew = this.rowIndex === -1;
        const formGroup = this.documentAccountLineFormGroup;
        this.saveHandler({sender, rowIndex, formGroup, isNew});
        this.saveDocumentAccountOnClick(false);
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);

  }

  /*Button F2 press */
  eventKeyboardClick(event: any) {
    if (!this.editMode && event.code === KeyboardConst.F2 || event.code === KeyboardConst.F3) {
      this.isNew = true;
      this.totalAmountValidation();
    } else if (this.editMode) {
      this.isNew = false;
      this.totalAmountValidationCurrentRow();
    }
  }

  /*check total debit amount equal to credit amount*/
  totalAmountValidation() {
    if (!this.checkTotalDebitAndTotalCreditNotEmpty()) {
      this.documentLineDate.setValue(this.documentAccountDate.value);
      if (this.editMode) {
        const event = {code: KeyboardConst.F2};
        this.eventKeyboardClick(event);
      } else {
        this.rowIndex = -1;
        let amount = 0;
        if (+this.totalCreditAmount === +this.totalDebitAmount) {
          this.growlService.InfoNotification(this.translate.instant(SharedAccountingConstant.DOCUMENT_ACCOUNT_AMOUNT_BALANCED));
        } else if (+this.totalCreditAmount > +this.totalDebitAmount) {
          this.grid.addRow(this.documentAccountLineFormGroup);
          amount = (+this.totalCreditAmount - +this.totalDebitAmount);
          this.documentAccountLineFormGroup.patchValue({'debitAmount': amount, 'creditAmount': 0});
          this.accountDropDownIsInEditingMode = true;
        } else {
          this.grid.addRow(this.documentAccountLineFormGroup);
          amount = (+this.totalDebitAmount - +this.totalCreditAmount);
          this.documentAccountLineFormGroup.patchValue({'debitAmount': 0, 'creditAmount': amount});
          this.accountDropDownIsInEditingMode = true;
        }
      }
    }
  }

  isAddNewRow() {
    return this.rowIndex === -1;
  }

  setDocumentAccountLineLabel() {
    if (this.isAddNewRow()) {
      if (this.isCheckedDocumentLabel) {
        this.documentAccountLineLabel.setValue(this.documentAccountFormGroup.value.label);
      } else {
        if (this.documentAccountLineList.length > 0) {
          this.documentAccountLineLabel.setValue(this.documentAccountLineList[0].label);
        } else {
          this.documentAccountLineLabel.setValue('');
        }
      }
    }
  }

  /*check total debit amount equal to credit amount*/
  totalAmountValidationCurrentRow() {
    this.isNew = false;
    if ((+this.totalCreditAmount) === (+this.totalDebitAmount)) {
      this.growlService.InfoNotification(this.translate.instant(SharedAccountingConstant.DOCUMENT_ACCOUNT_AMOUNT_BALANCED));
    } else if (+this.totalCreditAmount > +this.totalDebitAmount) {
      this.grid.editRow(this.rowIndex, this.documentAccountLineFormGroup);
      this.updateCurrentLineValueBalanced();
      this.accountDropDownIsInEditingMode = true;
    } else {
      this.grid.editRow(this.rowIndex, this.documentAccountLineFormGroup);
      this.updateCurrentLineValueBalanced();
      this.accountDropDownIsInEditingMode = true;
    }
  }

  updateCurrentLineValueBalanced() {
    let totalDebit = 0;
    let totalCredit = 0;
    this.currentDocumentAccount.documentAccountLines.forEach((documentAccountLine, index) => {
      if (index !== this.rowIndex) {
        totalDebit += +documentAccountLine.debitAmount;
        totalCredit += +documentAccountLine.creditAmount;
      }
    });
    if (totalDebit > totalCredit) {
      this.documentAccountLineDebitAmount.setValue(0);
      this.documentAccountLineCreditAmount.setValue(totalDebit - totalCredit);
    } else if (totalCredit > totalDebit) {
      this.documentAccountLineCreditAmount.setValue(0);
      this.documentAccountLineDebitAmount.setValue(totalCredit - totalDebit);
    }
    this.documentLineDate.setValue(this.documentAccountDate.value);
  }

  closeHandlerEscEvent() {
    const sender = this.sender === undefined ? this.grid : this.sender;
    const rowIndex = this.rowIndex;
    if (rowIndex !== undefined) {
      this.cancelHandler({sender, rowIndex});
      this.setAccountIdEmpty();
    }
  }

  setAccountIdEmpty() {
    this.documentAccountLineFormGroup.patchValue({
      accountId: null
    });
  }

  changeDebitAmount(value: number) {
    if (value > 0) {
      this.documentAccountLineDebitAmount.setValue(0);
    }
    this.documentAccountLineFormGroup.updateValueAndValidity();

  }

  changeCreditAmount(value: number) {
    if (value > 0) {
      this.documentAccountLineCreditAmount.setValue(0);
    }
    this.documentAccountLineFormGroup.updateValueAndValidity();
  }

  public keyEnterAction(sender: GridComponent, formGroup: any, e) {
    e.preventDefault();
    if (!this.documentAccountLineFormGroup || !this.documentAccountLineFormGroup.valid || (e.key !== KeyboardConst.ENTER
      && e.key !== KeyboardConst.NUMPAD_ENTER) || (this.isAccountFocus && this.accountDropDownOpened && +this.documentAccountLineDebitAmount.value === 0 && +this.documentAccountLineCreditAmount.value === 0)) {
      this.resetAccountDropDownOpenStatus();
      return;
    }
    const rowIndex = this.rowIndex;
    const isNew = this.rowIndex === -1;
    this.sender = sender;
    this.rowIndex = -1;
    this.saveHandler({sender, rowIndex, formGroup, isNew} );
    this.documentLineDate.setValue(this.documentAccountDate.value);
    this.documentAccountLineFormGroup.patchValue({
          'accountId': null,
          'nameAccount': null,
          'debitAmount': NumberConstant.ZERO,
          'creditAmount': NumberConstant.ZERO
        });
    this.documentAccountLineFormGroup.markAsTouched();
      if (this.isEmptyLine) {
        sender.addRow(this.documentAccountLineFormGroup);
        this.accountDropDownIsInEditingMode = true;
        this.isLineTouched = true;
      }
    this.isEmptyLine = true;
    this.accountFiltredList = this.accountList;
    this.isNew = true;
    this.resetAccountDropDownOpenStatus();
  }

  resetAccountDropDownOpenStatus() {
    if (this.isAccountFocus) {
      this.accountDropDownOpened = false;
    }
  }

  public initDocumentAccountDateForm() {
    this.dateOfToday.setFullYear(this.currentExerciceStartDate.getFullYear());
    this.documentAccountDate.setValue(this.dateOfToday);
    this.documentAccountDate.setValidators(isDateValidAccounting(this.currentExerciceStartDate, this.currentExerciceEndDate));
    this.documentLineDate.setValidators(isDateValidAccounting(this.currentExerciceStartDate, this.currentExerciceEndDate));
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(this.isDocumentAccountFormChanged.bind(this));
  }

  public isDocumentAccountFormChanged(): boolean {
    return this.documentAccountFormGroup.touched || this.documentAccountLineFormGroup.touched;
  }

  updateTotalDebitAndTotalCreditPrecision(documentAccount: DocumentAccount) {
    this.totalDebitAmount = documentAccount.totalDebitAmount.toFixed(this.currency.Precision);
    this.totalCreditAmount = documentAccount.totalCreditAmount.toFixed(this.currency.Precision);
  }

  loadTemplateAccountingByJournal(value: number) {
    this.templateAccountingService.getJavaGenericService().getEntityById(value, TemplateAccountingConstant
      .SERACH_BY_JOURNAL).subscribe(data => {
      this.templateAccountingList = data;
      this.templateAccountingFiltredList = data;
    });
  }

  handleChangeJournalAccounting(value: any) {
    if (this.selectedChangeHasValue(value)) {
      this.documentAccountTemplateAccountingId.enable();
      if (this.isUpdateMode) {
        this.swalWarrings.CreateSwal(this.translate.instant(AccountsConstant.ARE_YOU_SURE_TO_CHANGE_JOURNAL),
          this.translate.instant(AccountsConstant.ARE_YOU_SURE), this.translate.instant(AccountsConstant.VALIDATION_CONFIRM),
          this.translate.instant(AccountsConstant.CANCEL)).then((result) => {
          if (result.value) {
            this.loadTemplateAccountingByJournal(value);
            this.documentAccountTemplateAccountingId.setValue('');
            this.lastValidJournalValue = value;
            this.documentAccountJournal.setValue(value);
          } else if (result.dismiss === swal.DismissReason.cancel) {
            this.cdr.detectChanges();
            this.journalValue = this.lastValidJournalValue;
            this.documentAccountJournal.setValue(this.lastValidJournalValue);
          }
        });
      } else {
        this.documentAccountTemplateAccountingId.setValue('');
        this.loadTemplateAccountingByJournal(value);
      }
    }
  }

  controlFiledAmountMax(value: number, typeAmount: any) {
    if (value <= AccountingConfigurationConstant.MAX_AMOUNT_NUMBER) {
      this.documentAccountLineFormGroup.controls[typeAmount].setValue(value);
    } else {
      value = toNumber(value.toString().substr(0, NumberConstant.EIGHT));
      this.documentAccountLineFormGroup.controls[typeAmount].setValue(value);
    }
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.documentAccountFormGroup.markAsTouched();
      for (const file of event.target.files) {
        this.attachementFilesToUpload.push(file);
      }
    }
  }

  public uploadAttachmentFiles(documentAccountId: number, saveAndContinue: boolean) {
    if (this.attachementFilesToUpload && this.attachementFilesToUpload.length !== 0) {
      this.currentDocumentAccount.id = documentAccountId;
      this.listFile = [];
      for (const file of this.attachementFilesToUpload) {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        this.handleInputChange(file, saveAndContinue);
      }
    }
  }

  handleInputChange(file, saveAndContinue) {
    const reader = new FileReader();
    reader.onloadend = this._handleReaderLoaded.bind(this, file, saveAndContinue);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(file, saveAndContinue, e) {
    const reader = e.target;
    const base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    const documentAccountAttachement = new DocumentAccountAttachement(null, base64result, file.name, this.currentDocumentAccount.id);
    this.listFile.push(documentAccountAttachement);
    if (this.attachementFilesToUpload.length === this.listFile.length) {
      this.saveFile(this.listFile, saveAndContinue);
    }
  }

  saveFile(listFiles: Array<DocumentAccountAttachement>, saveAndContinue : boolean) {
    this.dataTransferShowSpinnerService.setShowSpinnerValue(true);
    this.documentAccountService.getJavaGenericService().saveEntity(listFiles, DocumentAccountConstant.UPLOAD_DOCUMENT_ACCOUNT_ATTACHEMENT
    ).subscribe(() => {
    }, () => {
    }, () => {
      this.spinner = false;
      if (this.isUpdateMode) {
        this.growlService.successNotification(this.translate.instant(DocumentAccountConstant.DOCUMENT_ACCOUNT_UPDATED_SUCCESSFULLY));
        this.router.navigateByUrl(DocumentAccountConstant.LIST_DOCUMENT_ACCOUNT_URL);
      } else {
        if(saveAndContinue){
          this.spinner = false;
          this.documentAccountFormGroup.reset();
          this.documentAccountLineFormGroup.reset();
          this.documentAccountLineList = [];
          this.attachementFilesToUpload = [];
          this.totalCreditAmount = '0';
          this.totalDebitAmount = '0';
          this.currentDocumentAccount.documentAccountLines = [];
          this.gridSettings.gridData = {
            data: this.documentAccountLineList,
            total: this.currentDocumentAccount.documentAccountLines.length
          };
          this.ngOnInit();
          this.ngAfterViewInit();
          this.router.navigateByUrl(DocumentAccountConstant.DOCUMENT_ACCOUNT_ADD_URL);

        }
        else{
          this.router.navigateByUrl(DocumentAccountConstant.LIST_DOCUMENT_ACCOUNT_URL);
        }
        this.growlService.successNotification(this.translate.instant(DocumentAccountConstant.DOCUMENT_ACCOUNT_SAVED_SUCCESSFULLY, {code: this.currentDocumentAccount.codeDocument}));
      }
    });
  }

  deleteFile(file: any, index: number, uploaded: boolean) {
    this.swalWarrings.CreateSwal(this.translate.instant(AccountsConstant.ARE_YOU_SURE_TO_DELETE_DOCUMENT_ATTACHEMENT),
      this.translate.instant(AccountsConstant.ARE_YOU_SURE), this.translate.instant(AccountsConstant.VALIDATION_CONFIRM),
      this.translate.instant(AccountsConstant.CANCEL)).then((result) => {
      if (result.value) {
        this.documentAccountFormGroup.markAsTouched();
        if (!uploaded) {
          this.attachementFilesToUpload = this.documentAccountFileStorageService.deleteFile(this.attachementFilesToUpload, index);
        } else {
          const documentAccountAttachementToDelete = new DocumentAccountAttachement(file.id, null, file.name, this.documentAccountIdOnUpdate);
          this.attachementFilesToDelete.push(documentAccountAttachementToDelete);
          this.attachementFilesUploaded = this.documentAccountFileStorageService.deleteFile(this.attachementFilesUploaded, index);
        }
      } else if (result.dismiss === swal.DismissReason.cancel) {
        this.cdr.detectChanges();
      }
    });
  }

  downloadFile(fileName: string) {
    this.documentAccountFileStorageService.downloadFile(fileName);
  }

  focusOrUnfocusField(field: string, status: boolean) {
    if (field === DocumentAccountConstant.LABEL_FIELD) {
      this.isLabelFocus = status;
    } else if (field === DocumentAccountConstant.REFERENCE_FIELD) {
      this.isReferenceFocus = status;
    } else if (field === DocumentAccountConstant.ACCOUNT_CODE_FIELD) {
      this.isAccountFocus = status;
    } else if (field === DocumentAccountConstant.DOCUMENT_LINE_DATE_FIELD) {
      this.isDocumentLineDateFocus = status;
    } else if (field === DocumentAccountConstant.DEBIT_AMOUNT_FIELD) {
      this.isDebitAmountFocus = status;
    } else if (field === DocumentAccountConstant.CREDIT_AMOUNT_FIELD) {
      this.isCreditAmountFocus = status;
    } else if (field === DocumentAccountConstant.JOURNAL_ID) {
      this.isJournalFocus = status;
    } else if (field === DocumentAccountConstant.DOCUMENT_DATE_FIELD) {
      this.isDocumentDateFocus = status;
    } else if (field === DocumentAccountConstant.LABEL_LINE_DATE_FIELD) {
      this.isLabelDocumentAccountLineFocus = status;
    }

  }

  documentAccountLineContainsEmptyDebitAndCredit() {
    this.documentAccountLineList.forEach((dataItem, rowIndex) => {
      Number(dataItem.debitAmount);
      if (Number(dataItem.debitAmount) === NumberConstant.ZERO && Number(dataItem.creditAmount) === NumberConstant.ZERO) {
        const sender = this.grid;
        this.isEmptyLine = false;
        this.lineClickHandler({sender, rowIndex, dataItem});
      }
    });
  }

  getTemplateAccountingFilteredListByWrittenValue(writtenValue: string): any {
    return this.templateAccountingList.filter((s) =>
      s.label.toLowerCase().includes(writtenValue.toLowerCase()) || s.label.toLocaleLowerCase().includes(writtenValue.toLowerCase()));
  }

  handleFilterAccount(writtenValue) {
    this.accountFiltredList = this.documentAccountService.handleFilterAccount(writtenValue);
  }

  selectionChangeAccountDropdown($event) {
    this.documentAccountService.selectionChangeAccountDropdown($event);
  }

  public setLabelOnSelectAccount(event): void {
    this.documentAccountLineFormGroup.value.accountId = undefined;
    this.genericAccountingService.setAccountIdOnSelectAccount(event, 'accountId',
      this.documentAccountLineFormGroup);
    this.genericAccountingService.setLabelOnSelectAccount(event, 'nameAccount',
      this.documentAccountLineFormGroup);
    if (event) {
      this.documentAccountService.selectionChangeAccountDropdown(event);
    }
  }

  public openAccountPopup(event): void {
    this.accountDropDownOpened = true;
  }

  public onDocumentClick(e): void {
    const path = e.path || (e.composedPath && e.composedPath());
    if (
      !matches(
        e.target,
        "tbody *,button.btn.btn-sm.btn-primary, .k-grid-toolbar .k-button, .k-grid-add-command, .k-link, .input-checkbox100, .label-checkbox100, button.btn.btn-success.btn-add-dropdown"
      ) &&
      e.target.parentElement &&
      !matches(
        e.target.parentElement,
        "div.card-footer,.k-grid-add-command, .k-animation-container, .k-animation-container-show, k-popup k-list-container k-reset"
      ) &&
      path.filter((x) => x.tagName === "MODAL-DIALOG").length === 0 &&
      path.filter((x) => x.className === "modal").length === 0 &&
      !e.target.className.includes("swal") &&
      !e.target.className.includes("fix-btn")
    ) {
      this.closeHandlerEscEvent();
    }
  }

  chekifIsConsultMode() {
    if (this.router.url.indexOf(DocumentAccountConstant.DOCUMENT_ACCOUNT_CONSULT) > NumberConstant.ZERO) {
      this.readOnlyMode = true;
      this.documentAccountFormGroup.disable();
      this.documentAccountLineFormGroup.disable();
    }
  }

  ngOnInit() {
    this.setFormatNumberOptions();
    this.handleKeyAction();
    this.initJournalFilteredList();
    this.initDocumentAccountForm();
    this.initDocumentAccountLineForm();
    this.initDocumentAccountDateForm();
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    this.activatedRoute.queryParams
      .filter(params => params.id)
      .subscribe(params => {
        this.documentAccountLineIdComingFromOutside = +params['id'];
      });
      this.activatedRoute.params.subscribe(params => {
        this.documentAccountIdOnUpdate = +params['id'] || 0;
        if (this.documentAccountIdOnUpdate > 0) {
          this.isUpdateMode = true;
          this.spinner = true;
          this.genericAccountingService.getAccountList().then((accountList: any) => {
            this.accountList = accountList;
            this.accountFiltredList = accountList.slice(0);
            this.loadDocumentAccountsAttachements();
            this.loadDocumentAccountOnUpdate();
          });

        } else {
          this.initAccountFilteredList();
          this.loadDefaultJournalByUser();
          this.generateRandomCodeDocument();
        }
      });

    this.chekifIsConsultMode();
  }

  loadOriginCodeDocument() {
    if (!this.isUpdateMode) {
      this.documentAccountFormGroup.patchValue({'codeDocument': this.originCodeDocument});
    } else {
      this.documentAccountFormGroup.patchValue({'codeDocument': this.codeDocument});
    }
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
    document.removeEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);
  }

  ngAfterViewInit(): void {
    if (!this.documentAccountFormGroup.disabled) {
      this.documentDateInput.focus();
    }
  }

  applyLabelToAllLines() {
    if (this.documentAccountFormGroup.valid) {
      if (!this.accountDropDownIsInEditingMode) {
        this.swalWarrings.CreateSwal(this.translate.instant(DocumentAccountConstant.ARE_YOU_SURE_TO_CHANGE_ALL_DOCUMENT_LINES),
          this.translate.instant(AccountsConstant.ARE_YOU_SURE), this.translate.instant(AccountsConstant.VALIDATION_CONFIRM),
          this.translate.instant(AccountsConstant.CANCEL)).then((result) => {
          if (result.value) {
            for (let i = 0; i < this.currentDocumentAccount.documentAccountLines.length; i++) {
              this.currentDocumentAccount.documentAccountLines[i].label = this.documentAccountFormGroup.value.label;
            }
            this.loadDocumentAccountLineList();
          }
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.documentAccountFormGroup);
    }
  }

  private editDocumentAccountLine(rowIndex: any, sender: any) {
    if (this.isDateInClosedPeriod(new Date(this.documentLineDate.value))) {
      this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.DOCUMENT_ACCOUNT_LINE_DATE_IN_CLOSED_PERIOD));
    } else {
      const debitAmount = this.documentAccountLineDebitAmount.value;
      const creditAmount = this.documentAccountLineCreditAmount.value;
      if ((+debitAmount === 0 && +creditAmount !== 0) || (+creditAmount === 0 && +debitAmount !== 0)) {
        const indexInPages = rowIndex - (this.pageSize * this.currentPage);
        this.totalDebitAmount = (+this.totalDebitAmount + (+debitAmount - +(this.documentAccountLineList[indexInPages].debitAmount)))
          .toFixed(this.currency.Precision).toString();
        this.totalCreditAmount = (+this.totalCreditAmount + (+creditAmount - (+this.documentAccountLineList[indexInPages].creditAmount)))
          .toFixed(this.currency.Precision).toString();
        const documentAccountLine = new DocumentAccountLine(this.documentAccountLineList[indexInPages].id,
          new Date(this.documentLineDate.value), this.documentAccountLineReference.value, this.documentAccountLineLabel.value,
          debitAmount, creditAmount, this.documentAccountLineAccountId.value, '', '',
          this.documentAccountLineList[indexInPages].close, this.documentAccountLineList[indexInPages].letter,
          this.documentAccountLineList[indexInPages].reconciliationDate);
        const account = this.accountFiltredList.filter(c => c.id === this.documentAccountLineAccountId.value)[0];
        documentAccountLine.codeAccount = account.code;
        documentAccountLine.nameAccount = account.label;
        if (documentAccountLine.id) {
          const indexInDocument: number = this.currentDocumentAccount.documentAccountLines.indexOf(
            this.currentDocumentAccount.documentAccountLines.find(line => line.id === documentAccountLine.id));
          this.currentDocumentAccount.documentAccountLines[indexInDocument] = documentAccountLine;
          this.documentAccountLineList[indexInPages] = documentAccountLine;
        } else {
          this.currentDocumentAccount.documentAccountLines[rowIndex] = documentAccountLine;
          this.documentAccountLineList[rowIndex] = documentAccountLine;
        }
        sender.closeRow(rowIndex);
        this.accountDropDownIsInEditingMode = false;
        this.setAccountIdEmpty();
        this.editMode = false;
      } else {
        this.growlService.ErrorNotification(this.translate.instant(DocumentAccountConstant.DOCUMENT_ACCOUNT_LINE_AMOUNT_NOT_VALID));
      }
    }
  }

  private saveDocumentAccountLine(formGroup: any, sender: any, rowIndex: any, action?:string) {
    if (this.isDateInClosedPeriod(new Date(formGroup.value.documentLineDate))) {
      this.growlService.ErrorNotification(
        this.translate.instant(
          SharedAccountingConstant.DOCUMENT_ACCOUNT_LINE_DATE_IN_CLOSED_PERIOD
        )
      );
    } else {
      const debitAmount = formGroup.value.debitAmount;
      const creditAmount = formGroup.value.creditAmount;
      if (
        (+debitAmount === 0 && +creditAmount !== 0) ||
        (+creditAmount === 0 && +debitAmount !== 0)
      ) {
        this.totalDebitAmount = (+this.totalDebitAmount + +debitAmount)
          .toFixed(this.currency.Precision)
          .toString();
        this.totalCreditAmount = (+this.totalCreditAmount + +creditAmount)
          .toFixed(this.currency.Precision)
          .toString();
        const account = this.accountFiltredList.filter(
          (c) => c.id === this.documentAccountLineAccountId.value
        )[0];
        const documentAccountLine = new DocumentAccountLine(
          undefined,
          new Date(formGroup.value.documentLineDate),
          formGroup.value.reference,
          formGroup.value.label,
          debitAmount,
          creditAmount,
          formGroup.value.accountId,
          account.label,
          account.code
        );
        this.documentAccountLineList.unshift(documentAccountLine);
        if (!this.currentDocumentAccount) {
          this.currentDocumentAccount =
            this.documentAccountFormGroup.getRawValue();
          this.currentDocumentAccount.documentAccountLines = [];
        }
        this.currentDocumentAccount.documentAccountLines.unshift(
          documentAccountLine
        );
        sender.closeRow(rowIndex);
        this.accountDropDownIsInEditingMode = false;
        this.setAccountIdEmpty();
        this.editMode = false;
        this.isLineTouched = true;
        this.currentPage = NumberConstant.ZERO;
        this.gridSettings.state.skip = NumberConstant.ZERO;
        this.loadDocumentAccountLineList();
      } else {
        this.editMode=true;
        this.isLineTouched = false;
        if (this.grid.view.length === 0) {
          action === "save"
            ? this.growlService.ErrorNotification(
                this.translate.instant(
                  DocumentAccountConstant.DOCUMENT_ACCOUNT_LINE_AMOUNT_NOT_VALID
                )
              )
            : null;
        } else {
          this.growlService.ErrorNotification(
            this.translate.instant(
              DocumentAccountConstant.DOCUMENT_ACCOUNT_LINE_AMOUNT_NOT_VALID
            )
          );
        }
      }
    }
  }

  private closeEditor(grid: { closeRow: (arg0: number) => void; }, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(-1);
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
    }
    this.accountDropDownIsInEditingMode = false;
  }

  private initDocumentAccountLineForm(): void {
    const documentAccountLine = new DocumentAccountLine();
    this.documentAccountLineFormGroup = new FormGroup({
      'accountId': new FormControl(documentAccountLine.accountId, Validators.required),
      'nameAccount': new FormControl({value: documentAccountLine.nameAccount, disabled: true}),
      'documentLineDate': new FormControl(new Date(documentAccountLine.documentLineDate)
        .setFullYear(this.currentExerciceStartDate.getFullYear()), Validators.required),
      'reference': new FormControl(documentAccountLine.reference),
      'label': new FormControl(documentAccountLine.label,
        [Validators.required, Validators.minLength(AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH),
          Validators.maxLength(AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH)]),
      'debitAmount': new FormControl(documentAccountLine.debitAmount, Validators.compose([Validators.min(0), Validators.required])),
      'creditAmount': new FormControl(documentAccountLine.creditAmount, Validators.compose([Validators.min(0), Validators.required]))
    });
  }

  private setFormatNumberOptions() {
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: this.currency.Precision,
      minimumFractionDigits: this.currency.Precision
    };
  }

  private checkDebitOrCreditEmpty() {
    if (this.documentAccountLineFormGroup.value.debitAmount === null) {
      this.documentAccountLineDebitAmount.setValue(0);
    }
    if (this.documentAccountLineFormGroup.value.creditAmount === null) {
      this.documentAccountLineCreditAmount.setValue(0);
    }
  }

  private disableDocumentFormGroup(imported: any, status: number, isDocumentDateInClosedPeriodStatus: any) {
    if (imported || status === DocumentAccountStatus.BY_CONCLUDING_CURRENT_FISCAL_YEAR_IS_CREATED || isDocumentDateInClosedPeriodStatus || this.readOnlyMode ||
      status === DocumentAccountStatus.BY_GENERATION_FROM_AMORTIZAION_IS_CREATED || status === DocumentAccountStatus.BY_IMPORT_DOCUMENT_IS_CREATED || 
      status === DocumentAccountStatus.BY_IMPORT_SETTLEMENT_IS_CREATED ) {
      this.documentAccountFormGroup.disable();
      this.documentAccountLineFormGroup.disable();
    }
  }

  private resetTotalValuesAndList() {
    this.documentAccountLineList = [];
    this.totalCreditAmount = '0';
    this.totalDebitAmount = '0';
  }

  private loadDocumentAccountsAttachements() {
    this.documentAccountService.getJavaGenericService().getEntityById(this.documentAccountIdOnUpdate,
      DocumentAccountConstant.DOCUMENT_ACCOUNT_ATTACHEMENT)
      .subscribe(data => {
        data.map(file => {
          file.name = file.fileName;
        });
        this.attachementFilesUploaded = data;
      });
  }

  private enableTemplateAccountingDropDown() {
    if (this.documentAccountLineList.length === 0) {
      this.documentAccountTemplateAccountingId.enable();
    }
  }

  private setLastdocumentAccountLineLabel() {
    if (this.editMode) {
      this.documentAccountLineLabel.setValue(this.documentAccountLineList[this.rowIndex].label);
    } else {
      this.documentAccountLineLabel.setValue(this.documentAccountFormGroup.value.label);
    }
  }

  private checkInputNotNulBeforeTabulation(event) {
    this.checkAccountFocusAndNotNull(event);
    this.checkDocumentLineDateFocusAndNotNull(event);
    this.checkLabelFocusAndNotNull(event);
    this.checkLabelDocAccLineFocusAndNotNull(event);
  }

  private checkAccountFocusAndNotNull(event) {
    if (this.isAccountFocus && (this.documentAccountLineFormGroup.value.accountId === undefined || this.documentAccountLineFormGroup.value.accountId === null)) {
      this.accountIdInput.focus();
      event.preventDefault();
    }
  }

  private checkDocumentLineDateFocusAndNotNull(event) {
    if (this.isDocumentLineDateFocus && this.genericAccountingService.isNullAndUndefinedAndEmpty(this.documentLineDate.value)) {
      this.documentLineDateInput.focus();
      event.preventDefault();
    }
  }

  private checkLabelFocusAndNotNull(event) {
    if (this.isLabelFocus && this.genericAccountingService.isNullAndUndefinedAndEmpty(this.documentAccountLabel.value)) {
      this.labelInput.nativeElement.focus();
      event.preventDefault();
    }
  }

  private checkLabelDocAccLineFocusAndNotNull(event) {
    if (this.isLabelDocumentAccountLineFocus && this.genericAccountingService.isNullAndUndefinedAndEmpty(this.documentAccountLineLabel.value)) {
      this.labelDocumentAccountLineInput.nativeElement.focus();
      event.preventDefault();
    }
  }

  private getDateStatusRelatedToCurrentFiscalYear(documentDate: Date): Promise<Boolean> {
    return new Promise(resolve => {
      this.fiscalYearService.getJavaGenericService().callService(Operation.POST,
        `${FiscalYearConstant.DATE_IN_CLOSED_PERIOD}?date=${this.datePipe.transform(documentDate, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS)}`)
        .subscribe((dateIsInClosedPeriodStatus) => {
          resolve(dateIsInClosedPeriodStatus);
        });
    });
  }

  private checkTotalDebitAndTotalCreditNotEmpty() {
    const checkTotalDebitAndTotalCredit = (this.totalDebitAmount === '0' || this.totalDebitAmount === '0.000') &&
      (this.totalCreditAmount === '0' || this.totalCreditAmount === '0.000');
    if (checkTotalDebitAndTotalCredit && this.documentAccountLineList.length === 0) {
      this.growlService.warningNotification(this.translate.instant(DocumentAccountConstant.DOCUMENT_ACCOUNT_WITHOUT_LINES));
      return true;
    } else if (checkTotalDebitAndTotalCredit) {
      this.growlService.ErrorNotification(this.translate.instant(DocumentAccountConstant.DOCUMENT_ACCOUNT_LINES_FROM_EMPTY_TEMPLATE_ACCOUNTING));

      return true;
    } else {
      return false;
    }
  }

  private loadDefaultJournalByUser() {
    this.journalService.getJavaGenericService().getEntityById(this.userId, JournalConstants.DEFAULT_JOURNAL_BY_USER)
      .subscribe(defaultJournalByUser => {
      if (defaultJournalByUser.journalId && defaultJournalByUser.journalId > 0) {
        this.journalValue = defaultJournalByUser.journalId;
        this.documentAccountJournal.setValue(this.journalValue);
        this.loadTemplateAccountingByJournal(this.journalValue);
        this.documentAccountTemplateAccountingId.enable();
        this.documentAccountFormGroup.updateValueAndValidity();
        this.documentAccountFormGroup.controls['journalId'].setValue(defaultJournalByUser.journalId);
      }
    });
  }
  checkChangeTemplateAccounting(templateAccountingFiltredList, templateAccountingList): boolean {
    return isUndefined(templateAccountingFiltredList) || isNotNullOrUndefinedAndNotEmptyValue(templateAccountingFiltredList)
      && templateAccountingFiltredList.length < templateAccountingList.length;
  }

}
