import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener,
  ViewContainerRef,
  Input,
  OnDestroy,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl,
} from "@angular/forms";
import { FiscalYearService } from "../../services/fiscal-year/fiscal-year.service";
import { FiscalYear } from "../../../models/accounting/fiscal-year.model";
import { AccountsConstant } from "../../../constant/accounting/account.constant";
import { AccountService } from "../../services/account/account.service";
import { FiscalYearConstant } from "../../../constant/accounting/fiscal-year.constant";
import { NumberConstant } from "../../../constant/utility/number.constant";
import { DatePipe } from "@angular/common";
import { SharedAccountingConstant } from "../../../constant/accounting/sharedAccounting.constant";
import { DocumentAccountService } from "../../services/document-account/document-account.service";
import { ReportingService } from "../../services/reporting/reporting.service";
import { BankReconciliation } from "../../../models/accounting/bankReconciliationStatement.model";
import { ReportingConstant } from "../../../constant/accounting/reporting.constant";
import { GrowlService } from "../../../../COM/Growl/growl.service";
import { ModalDialogInstanceService } from "ngx-modal-dialog/src/modal-dialog-instance.service";
import { IModalDialogOptions } from "ngx-modal-dialog";
import { TranslateService } from "@ngx-translate/core";
import {
  ValidationService,
  isDateValidAccounting,
} from "../../../shared/services/validation/validation.service";
import { Observable } from "rxjs/Observable";
import { GenericAccountingService } from "../../services/generic-accounting.service";
import { State } from "@progress/kendo-data-query";
import { SharedConstant } from "../../../constant/shared/shared.constant";
import { ColumnSettings } from "../../../shared/utils/column-settings.interface";
import { GridSettings } from "../../../shared/utils/grid-settings.interface";
import {
  DataStateChangeEvent,
  PageChangeEvent,
  PagerSettings,
} from "@progress/kendo-angular-grid";
import { ReconciliationConstant } from "../../../constant/accounting/reconciliation-bank";
import { AccountingConfigurationConstant } from "../../../constant/accounting/accounting-configuration.constant";
import { AccountingConfigurationService } from "../../services/configuration/accounting-configuration.service";
import { FiscalYearStateEnumerator } from "../../../models/enumerators/fiscal-year-state-enumerator.enum";
import NumberFormatOptions = Intl.NumberFormatOptions;
import { Currency } from "../../../models/administration/currency.model";
import { CompanyService } from "../../../administration/services/company/company.service";
import { ReportingInModalComponent } from "../../../shared/components/reports/reporting-in-modal/reporting-in-modal.component";
import { FormModalDialogService } from "../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ReportTemplateDefaultParameters } from "../../../models/accounting/report-template-default-parameters";
import { StarkRolesService } from "../../../stark-permissions/service/roles.service";
import { StyleConfigService } from "../../../shared/services/styleConfig/style-config.service";
import { ReducedCurrency } from "../../../models/administration/reduced-currency.model";
import { RoleConfigConstant } from "../../../Structure/_roleConfigConstant";
import { AuthService } from "../../../login/Authentification/services/auth.service";
import { PermissionConstant } from "../../../Structure/permission-constant";
import { ReportTemplateDefaultParams } from './../../../models/accounting/report-template-default-params';
import { ReconciliationBankBehaviorSubjectService } from "../../services/reconciliation-bank-service/reconciliation-bank-behavior-subject.service";
import { filter } from "rxjs/operators";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";

@Component({
  selector: "app-reconciliation-bank",
  templateUrl: "./reconciliation-bank.component.html",
  styleUrls: ["./reconciliation-bank.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ReconciliationBankComponent implements OnInit, OnDestroy {
  @Input() isReconciliable = true;
  @Input() isStatement = false;
  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;

  // number format
  public formatNumberOptions: NumberFormatOptions;
  public reconcilableAccountList = [];
  public reconcilableAccountFiltredList = [];
  public documentAccountLineSource = [];
  public keepedDocumentAccountLineSourceIds = [];
  public keepedDocumentAccountLineSelectedIds = [];
  public documentAccountLineSelected = [];
  public documentAccountLineAffected = [];
  public documentAccountLineReleased = [];

  public documentAccountLineFormGroup: FormGroup;
  public initialAmount = 0;
  public initialAmountDebit = "0.000";
  public initialAmountCredit = "0.000";
  public finalAmount = 0;
  public finalAmountDebit = "0.000";
  public finalAmountCredit = "0.000";
  public reconciliationBankStatement = new BankReconciliation();
  public isSave = false;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public documentToAffectSelectedId = [];
  public documentToAffectSelected = [];
  public documentToReleaseSelectedId = [];
  public documentToReleaseSelected = [];
  public currentExerciceStartDate: any;
  public currentExerciceEndDate: any;
  public fiscalYearId: number;
  public fiscalYearIsOpened: boolean;
  public currencyId: number;
  public currencyCode: string;
  private reconciliationPageSize = SharedConstant.DEFAULT_ITEMS_NUMBER;
  private reconciliationCurrentPage = NumberConstant.ZERO;
  private closedPageSize = NumberConstant.TWENTY;
  private closedCurrentPage = NumberConstant.ZERO;
  public spinner = false;
  public isPrintedClosedLine = false;
  public isPrinted = false;
  public provisionalEdition = false;
  public unreconciledEntriesTotalDebit = NumberConstant.ZERO;
  public unreconciledEntriesTotalCredit = NumberConstant.ZERO;
  public currentFiscalYear: any;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: [],
    },
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: ReconciliationConstant.CODE,
      title: ReconciliationConstant.CODE_TITLE,
      tooltip: ReconciliationConstant.CODE_TITLE,
      filterable: true,
      width: 120,
    },
    {
      field: ReconciliationConstant.JOURNAL_LABEL,
      title: ReconciliationConstant.JOURNAL_LABEL_TITLE,
      tooltip: ReconciliationConstant.JOURNAL_LABEL_TITLE,
      filterable: true,
      width: 150,
    },

    {
      field: ReconciliationConstant.DOCUMENT_DATE,
      title: ReconciliationConstant.DOCUMENT_DATE_TITLE,
      format: SharedAccountingConstant.YYYY_MM_DD,
      tooltip: ReconciliationConstant.DOCUMENT_DATE_TITLE,
      filterable: true,
      width: 115,
    },
    {
      field: ReconciliationConstant.REFERENCE,
      title: ReconciliationConstant.REFERENCE_TITLE,
      tooltip: ReconciliationConstant.REFERENCE_TITLE,
      filterable: true,
      width: 230,
    },
    {
      field: ReconciliationConstant.LABEL,
      title: ReconciliationConstant.LABEL_TITLE,
      tooltip: ReconciliationConstant.LABEL_TITLE,
      filterable: true,
      width: 250,
    },
    {
      field: ReconciliationConstant.DEBIT_AMOUNT,
      title: ReconciliationConstant.DEBIT_AMOUNT_TITLE,
      tooltip: ReconciliationConstant.DEBIT_AMOUNT_TITLE,
      filterable: true,
      width: 150,
    },
    {
      field: ReconciliationConstant.CREDIT_AMOUNT,
      title: ReconciliationConstant.CREDIT_AMOUNT_TITLE,
      tooltip: ReconciliationConstant.CREDIT_AMOUNT_TITLE,
      filterable: true,
      width: 150,
    },
  ];

  public reconciliationSortParams = "";
  public closedSortParams = "";
  reconciliationGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public closedGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  private reconciliationBankBehaviorSubjectServiceSubsecribtion: any;

  constructor(
    private reconciliationBankBehaviorSubjectService: ReconciliationBankBehaviorSubjectService,
    private fiscalYearService: FiscalYearService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private documentAccountService: DocumentAccountService,
    private datePipe: DatePipe,
    private reportService: ReportingService,
    private growlService: GrowlService,
    private modalService: ModalDialogInstanceService,
    public validationService: ValidationService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    public authService: AuthService,
    private accountingConfigurationService: AccountingConfigurationService,
    private genericAccountingService: GenericAccountingService,
    private companyService: CompanyService,
    private viewRef: ViewContainerRef,
    private formModalDialogService: FormModalDialogService,
    private router: Router,
    private styleConfigService: StyleConfigService
  ) {
    if (
      this.isReconciliable &&
      !this.authService.hasAuthority(
        this.AccountingPermissions.VIEW_RECONCILIATION_BANK
      ) &&
      this.authService.hasAuthority(
        this.AccountingPermissions.VIEW_RECONCILIATION_BANK_STATEMENT
      )
    ) {
      this.router.navigateByUrl(
        ReconciliationConstant.RECONCILIATION_BANK_STATEMENT_URL
      );
    }
    if (this.route.snapshot.data["currentFiscalYear"]) {
      this.currentFiscalYear = this.route.snapshot.data["currentFiscalYear"];
      this.fiscalYearIsOpened =
        this.route.snapshot.data["currentFiscalYear"].closingState ===
          FiscalYearStateEnumerator.Open ||
        this.route.snapshot.data["currentFiscalYear"].closingState ===
          FiscalYearStateEnumerator.PartiallyClosed;
      if (!this.fiscalYearIsOpened) {
        this.growlService.warningNotification(
          this.translate.instant(
            SharedAccountingConstant.SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE
          )
        );
      }
    } else {
      this.accountingConfigurationService
        .getJavaGenericService()
        .getEntityList(AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL)
        .subscribe((data) => {
          this.currentFiscalYear = data;
          this.fiscalYearIsOpened =
            data.closingState === FiscalYearStateEnumerator.Open ||
            data.closingState === FiscalYearStateEnumerator.PartiallyClosed;
          if (!this.fiscalYearIsOpened) {
            this.growlService.warningNotification(
              this.translate.instant(
                SharedAccountingConstant.SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE
              )
            );
          }
        });
    }
  }
  ngOnDestroy(): void {
    this.reconciliationBankBehaviorSubjectServiceSubsecribtion.unsubscribe()
  }

  /**
   * when the page change , the active page change
   * @param state
   */
  dataReconciliationStateChange(state: DataStateChangeEvent) {
    this.reconciliationGridSettings.state = state;
    this.reconciliationSortParams = this.genericAccountingService.getSortParams(
      state.sort
    );
  }

  /**
   * when the page change , the active page change
   * @param state
   */
  dataClosedStateChange(state: DataStateChangeEvent) {
    this.closedGridSettings.state = state;
    this.closedSortParams = this.genericAccountingService.getSortParams(
      state.sort
    );
  }

  onPageChangeReconciliationLine(event: PageChangeEvent) {
    this.reconciliationCurrentPage = event.skip / this.reconciliationPageSize;
    this.reconciliationPageSize = event.take;
    this.getReconcilableDocumentAccountLineToClose();
  }

  public reconciliationGridSortChange() {
    this.reconciliationCurrentPage = 0;
    this.reconciliationGridSettings.state.skip = this.reconciliationCurrentPage;
    this.getReconcilableDocumentAccountLineToClose();
  }

  public closedGridSortChange() {
    this.closedCurrentPage = 0;
    this.closedGridSettings.state.skip = this.closedCurrentPage;
    this.getBankReconciliationStatement();
  }
  onPageChangeClosedLine(event: PageChangeEvent) {
    this.closedCurrentPage = event.skip / this.closedPageSize;
    this.closedPageSize = event.take;
    this.getBankReconciliationStatement();
  }

  changeClosedMonth(event) {
    this.endDateInput.setValue(
      new Date(event.getFullYear(), event.getMonth() + 1, 0)
    );
  }

  initReconcilableAccountList() {
    this.accountService
      .getJavaGenericService()
      .getEntityList(AccountsConstant.GET_RECONCILABLE_ACCOUNTS_URL)
      .subscribe((data) => {
        this.reconcilableAccountList = data;
        this.reconcilableAccountFiltredList = data;
      });
  }

  initialDocumentAccountLineForm() {
    const date = new Date();
    this.documentAccountLineFormGroup = this.formBuilder.group({
      closeMonth: [null, Validators.required],
      account: [null, Validators.required],
      startDate: [
        new Date(
          date.getFullYear(),
          NumberConstant.ZERO,
          NumberConstant.ONE,
          NumberConstant.ZERO,
          NumberConstant.ZERO,
          NumberConstant.ZERO
        ),
        [Validators.required],
      ],
      endDate: [
        new Date(
          date.getFullYear(),
          NumberConstant.ELEVEN,
          NumberConstant.THIRTY_ONE,
          NumberConstant.TWENTY_THREE,
          NumberConstant.FIFTY_NINE,
          NumberConstant.FIFTY_NINE
        ),
        [Validators.required],
      ],
    });
    this.reconciliationBankBehaviorSubjectServiceSubsecribtion =
      this.reconciliationBankBehaviorSubjectService.sharedMessage.subscribe(
        (message) => {
          if(message.isFromHistoric){
          this.documentAccountLineFormGroup.patchValue({
            account: message.account,
            closeMonth: message.closeMonth,
          });}
        }
      );    
      this.reconciliationBankBehaviorSubjectService.nextMessage({isFromHistoric : false});
  }

  initDefaultDocument() {
    this.startDateInput.setValue(this.currentExerciceStartDate);
    this.endDateInput.setValue(this.currentExerciceEndDate);
  }

  get startDateInput(): FormControl {
    return this.documentAccountLineFormGroup.get("startDate") as FormControl;
  }

  get endDateInput(): FormControl {
    return this.documentAccountLineFormGroup.get("endDate") as FormControl;
  }

  loadDocumentAccountLineOnSearch() {
    if (
      this.authService.hasAuthority(
        this.AccountingPermissions.VIEW_RECONCILIATION_BANK
      )
    ) {
      const selectedAccountId = this.documentAccountLineFormGroup.value.account;
      if (!this.isReconciliationBankFormChanged()) {
        this.reconciliationCurrentPage = 0;
        this.reconciliationGridSettings.state.skip = this.reconciliationCurrentPage;
        this.closedCurrentPage = 0;
        this.closedGridSettings.state.skip = this.closedCurrentPage;
        let dataForm = this.documentAccountLineFormGroup.getRawValue();
        let endDate = this.datePipe.transform(
          dataForm.endDate,
          SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS
        );
        if(dataForm.closeMonth != new Date(endDate).getMonth()+1){
          this.documentAccountLineFormGroup.controls['closeMonth'].setValue(new Date(endDate));
        }
        this.initGridDataSource();
      } else {
        this.genericAccountingService
          .openModalToConfirmSwitchingToAnotherOperationType()
          .then((result) => {
            if (result.value) {
              this.documentAccountLineFormGroup.value.account =
                selectedAccountId;
              this.reconciliationCurrentPage = 0;
              this.reconciliationGridSettings.state.skip =
                this.reconciliationCurrentPage;
              this.closedCurrentPage = 0;
              this.closedGridSettings.state.skip = this.closedCurrentPage;
              this.initGridDataSource();
            }
          });
      }
      this.isSave = false;
    } else {
      this.validationService.validateAllFormFields(
        this.documentAccountLineFormGroup
      );
    }
  }

  private initGridDataSource() {
    this.documentAccountLineAffected = [];
    this.documentAccountLineReleased = [];
    this.getReconcilableDocumentAccountLineToClose();
  }

  private getReconcilableDocumentAccountLineToClose() {
    const startDate = this.datePipe.transform(
      this.documentAccountLineFormGroup.value.startDate,
      SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS
    );
    const endDate = this.datePipe.transform(
      this.documentAccountLineFormGroup.value.endDate,
      SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS
    );
    if (!this.documentAccountLineFormGroup.value.account) {
      this.growlService.ErrorNotification(this.translate.instant(AccountsConstant.PLEASE_CHOOSE_AN_ACCOUNT));
      this.validationService.validateAllFormFields(
        this.documentAccountLineFormGroup
      );
      return;
    }
    this.documentAccountService
      .getJavaGenericService()
      .sendData(
        `${ReportingConstant.CLOSE_RECONCILABLE_DOCUMENT_ACCOUNT_LINE}` +
        `?accountId=${this.documentAccountLineFormGroup.value.account}&startDate=${startDate}&endDate=${endDate}&page=${this.reconciliationCurrentPage}&size=${this.reconciliationPageSize}${this.reconciliationSortParams}`,
        this.documentAccountLineAffected.concat(
          this.documentAccountLineReleased
        )
      )
      .subscribe((data) => {
        this.documentAccountLineSource = data.closeDocumentAccountLineDtos;
        let total = data.total + this.documentAccountLineReleased.length;
        this.unreconciledEntriesTotalCredit = data.totalCredit;
        this.unreconciledEntriesTotalDebit = data.totalDebit;
        this.documentAccountLineSource.forEach((documentLine) => {
          const index = this.documentAccountLineReleased.findIndex(
            (doc) => doc.id === documentLine.id
          );
          if (index !== -1) {
            total--;
          }
        });
        if (
          data.total !== 0 &&
          data.total % this.reconciliationPageSize === 0
        ) {
          data.total--;
        }
        const lastPageNumber = Math.trunc(
          data.total / this.reconciliationPageSize
        );
        if (
          this.documentAccountLineSource.length < this.reconciliationPageSize &&
          lastPageNumber <= this.reconciliationCurrentPage
        ) {
          let documentAccountLineReleased = this.documentAccountLineReleased;
          if (lastPageNumber < this.reconciliationCurrentPage) {
            const nbreElements =
              (this.reconciliationPageSize -
                (data.total % this.reconciliationPageSize)) *
              (this.reconciliationCurrentPage - lastPageNumber);
            documentAccountLineReleased =
              documentAccountLineReleased.slice(nbreElements);
          }
          documentAccountLineReleased.forEach((documentLineReleased) => {
            if (
              this.documentAccountLineSource.length <
              this.reconciliationPageSize
            )
              this.documentAccountLineSource.push(documentLineReleased);
          });
        }
        this.reconciliationGridSettings.gridData = {
          data: this.documentAccountLineSource,
          total: total,
        };
        if (!this.isSave) {
          if (this.documentAccountLineSource.length > 0) {
            const keepedDocumentAccountLineSource =
              data.closeDocumentAccountLineDtos.concat(
                this.documentAccountLineAffected.filter(
                  (item) =>
                    this.documentAccountLineReleased.findIndex(
                      (doc) => doc === item.id
                    ) < 0
                )
              );
            this.keepedDocumentAccountLineSourceIds =
              keepedDocumentAccountLineSource.map(
                (documentAccountLine) => documentAccountLine.id
              );
            this.isPrinted = true;
          } else {
            this.keepedDocumentAccountLineSourceIds = [];
            this.isPrinted = false;
          }
        }
      });
      this.getBankReconciliationStatement();
  }

  private getBankReconciliationStatement() {
    let dataForm = this.documentAccountLineFormGroup.getRawValue();
    let endDate = this.datePipe.transform(
      dataForm.endDate,
      SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS
    );
    if(this.genericAccountingService.isNullAndUndefinedAndEmpty(dataForm.closeMonth)){
      this.documentAccountLineFormGroup.controls['closeMonth'].setValue(new Date(endDate));
    }
    this.reportService
      .getJavaGenericService()
      .sendData(
        `${ReportingConstant.BANK_RECONCILIATION}` +
          `?accountId=${
            this.documentAccountLineFormGroup.value.account
          }&fiscalYearId=${this.fiscalYearId}
      &closeMonth=${
        this.documentAccountLineFormGroup.value.closeMonth.getMonth() + 1
      }&page=${this.closedCurrentPage}&size=${this.closedPageSize}${
            this.closedSortParams
          }`,
        this.documentAccountLineReleased.concat(
          this.documentAccountLineAffected
        )
      )
      .subscribe((data) => {
        this.reconciliationBankStatement = data.bankReconciliationStatementDto;

        let total = 0;
        if (
          this.reconciliationBankStatement.closeDocumentAccountLines === null
        ) {
          this.documentAccountLineSelected = [];
        } else {
          this.documentAccountLineSelected =
            data.bankReconciliationStatementDto.closeDocumentAccountLines;
        }
        total = data.total + this.documentAccountLineAffected.length;
        this.documentAccountLineSelected.forEach((documentLine) => {
          const index = this.documentAccountLineAffected.findIndex(
            (doc) => doc.id === documentLine.id
          );
          if (index !== -1) {
            total--;
          }
        });
        if (data.total !== 0 && data.total % this.closedPageSize === 0) {
          data.total--;
        }
        const lastPageNumber = Math.trunc(data.total / this.closedPageSize);
        if (
          this.documentAccountLineSelected.length < this.closedPageSize &&
          lastPageNumber <= this.closedCurrentPage
        ) {
          let documentAccountLineAffected = this.documentAccountLineAffected;
          if (lastPageNumber < this.closedCurrentPage) {
            const nbreElements =
              (this.closedPageSize - (data.total % this.closedPageSize)) *
              (this.closedCurrentPage - lastPageNumber);
            documentAccountLineAffected =
              documentAccountLineAffected.slice(nbreElements);
          }
          documentAccountLineAffected.forEach((documentLineAffected) => {
            if (this.documentAccountLineSelected.length < this.closedPageSize)
              this.documentAccountLineSelected.push(documentLineAffected);
          });
        }
        this.closedGridSettings.gridData = {
          data: this.documentAccountLineSelected,
          total: total,
        };
        this.finalAmount =
          data.bankReconciliationStatementDto.initialAmount +
          data.totalDebit -
          data.totalCredit;
        this.initialAmount = data.bankReconciliationStatementDto.initialAmount;
        this.onchangeFinalAmount(this.documentAccountLineAffected);
        this.calculateInitialAmount();
        this.calculateFinalAmount();
        if (!this.isSave) {
          if (
            this.reconciliationBankStatement.closeDocumentAccountLines !==
              null &&
            this.reconciliationBankStatement.closeDocumentAccountLines.length >
              0
          ) {
            const keepedDocumentAccountLineSelected =
              data.bankReconciliationStatementDto.closeDocumentAccountLines;
            this.keepedDocumentAccountLineSelectedIds =
              keepedDocumentAccountLineSelected.map(
                (documentAccountLine) => documentAccountLine.id
              );
            this.isPrintedClosedLine = true;
          } else {
            this.keepedDocumentAccountLineSelectedIds = [];
            this.isPrintedClosedLine = false;
          }
        }
      });
  }

  private calculateFinalAmount() {
    if (this.finalAmount > NumberConstant.ZERO) {
      this.finalAmountDebit = Math.abs(this.finalAmount).toFixed(
        NumberConstant.THREE
      );
      this.finalAmountCredit = NumberConstant.ZERO.toFixed(
        NumberConstant.THREE
      );
    } else {
      this.finalAmountCredit = Math.abs(this.finalAmount).toFixed(
        NumberConstant.THREE
      );
      this.finalAmountDebit = NumberConstant.ZERO.toFixed(NumberConstant.THREE);
    }
  }

  private calculateInitialAmount() {
    if (this.initialAmount > NumberConstant.ZERO) {
      this.initialAmountDebit = Math.abs(this.initialAmount).toFixed(
        NumberConstant.THREE
      );
      this.initialAmountCredit = NumberConstant.ZERO.toFixed(
        NumberConstant.THREE
      );
    } else {
      this.initialAmountCredit = Math.abs(this.initialAmount).toFixed(
        NumberConstant.THREE
      );
      this.initialAmountDebit = NumberConstant.ZERO.toFixed(
        NumberConstant.THREE
      );
    }
  }

  saveReconciliationBank() {
    if (this.fiscalYearIsOpened) {
      this.reconciliationBankStatement.documentAccountLinesAffected =
        this.documentAccountLineAffected;
      this.reconciliationBankStatement.documentAccountLinesReleased =
        this.documentAccountLineReleased;
      if (+this.initialAmountDebit !== NumberConstant.ZERO) {
        this.reconciliationBankStatement.initialAmount =
          +this.initialAmountDebit;
      } else {
        this.reconciliationBankStatement.initialAmount =
          -this.initialAmountCredit;
      }
      if (+this.finalAmountDebit !== NumberConstant.ZERO) {
        this.reconciliationBankStatement.finalAmount = +this.finalAmountDebit;
      } else {
        this.reconciliationBankStatement.finalAmount = -this.finalAmountCredit;
      }
      this.reconciliationBankStatement.closeMonth =
        this.documentAccountLineFormGroup.value.closeMonth.getMonth() + 1;
      this.reconciliationBankStatement.fiscalYearId = this.fiscalYearId;
      this.reconciliationBankStatement.accountId =
        this.documentAccountLineFormGroup.value.account;
      this.reportService
        .getJavaGenericService()
        .sendData(
          ReportingConstant.BANK_RECONCILIATION_STATEMENT,
          this.reconciliationBankStatement
        )
        .subscribe((data) => {
          if (
            this.reconciliationBankStatement.closeDocumentAccountLines !==
              null &&
            this.reconciliationBankStatement.closeDocumentAccountLines.length >
              0
          ) {
            this.isPrintedClosedLine = true;
          } else {
            this.isPrintedClosedLine = false;
          }
          if (this.documentAccountLineSource.length > 0){
            this.isPrinted = true;
          } else {
            this.isPrinted = false;
          }
          this.showSuccessMessage();
          this.isSave = false;
          this.keepedDocumentAccountLineSourceIds =
            this.documentAccountLineSource.map(
              (documentAccountLine) => documentAccountLine.id
            );
        });
    }
  }

  showSuccessMessage() {
    this.growlService.successNotification(
      this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION)
    );
    if (this.isOpenDialogMode()) {
      this.dialogOptions.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }
  }

  isOpenDialogMode() {
    return this.dialogOptions !== undefined;
  }

  handleFilterAccount(writtenValue: string) {
    this.reconcilableAccountFiltredList = this.reconcilableAccountList.filter(
      (s) =>
        s.label.toLowerCase().includes(writtenValue.toLowerCase()) ||
        s.label.toLocaleLowerCase().includes(writtenValue.toLowerCase()) ||
        s.code.toString().startsWith(writtenValue)
    );
  }

  onchangeFinalAmount(documentAccountLinesAfftected) {
    documentAccountLinesAfftected.forEach((documentAccountLine) => {
      this.finalAmount =
        this.finalAmount +
        documentAccountLine.debitAmount -
        documentAccountLine.creditAmount;
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(
      this.isReconciliationBankFormChanged.bind(this)
    );
  }

  isReconciliationBankFormChanged() {
    return !this.sourceAndKeepedHaveSameIds();
  }

  isClosedBankFormChanged() {
    return this.selectedAndKeepedHaveSameIds();
  }

  public sourceAndKeepedHaveSameIds() {
    return (
      (this.keepedDocumentAccountLineSourceIds.length === 0 &&
        this.documentAccountLineSource.length === 0) ||
      (this.keepedDocumentAccountLineSourceIds.filter((keepedId) =>
        this.documentAccountLineSource
          .map((documentAccountLine) => documentAccountLine.id)
          .includes(keepedId)
      ).length === this.documentAccountLineSource.length &&
        this.documentAccountLineSource
          .map((documentAccountLine) => documentAccountLine.id)
          .filter((id) => this.keepedDocumentAccountLineSourceIds.includes(id))
          .length === this.keepedDocumentAccountLineSourceIds.length)
    );
  }

  public selectedAndKeepedHaveSameIds() {
    return (
      (this.keepedDocumentAccountLineSelectedIds.length === 0 &&
        this.documentAccountLineSelected.length === 0) ||
      (this.keepedDocumentAccountLineSelectedIds.filter((keepedId) =>
        this.documentAccountLineSelected
          .map((documentAccountLine) => documentAccountLine.id)
          .includes(keepedId)
      ).length === this.documentAccountLineSelected.length &&
        this.documentAccountLineSelected
          .map((documentAccountLine) => documentAccountLine.id)
          .filter((id) =>
            this.keepedDocumentAccountLineSelectedIds.includes(id)
          ).length === this.keepedDocumentAccountLineSelectedIds.length)
    );
  }

  affectDocuemntAccountLine() {
    if (this.documentAccountLineSelected.length < this.closedPageSize) {
      this.affectDocument();
    } else {
      this.documentToAffectSelected.forEach((documentLineSelected) => {
        const pageNumber = Math.trunc(
          this.closedGridSettings.gridData.total / this.closedPageSize
        );

        this.documentAccountLineSelected.push(documentLineSelected);
        let index = this.documentAccountLineSource.findIndex(
          (doc) => doc.id === documentLineSelected.id
        );
        if (index !== -1) {
          this.documentAccountLineSource.splice(index, 1);
        }
        const indexReleased = this.documentAccountLineReleased.findIndex(
          (doc) => doc.id === documentLineSelected.id
        );
        if (indexReleased !== -1) {
          this.documentAccountLineReleased.splice(indexReleased, 1);
        }
        index = this.documentAccountLineAffected.findIndex(
          (doc) => doc.id === documentLineSelected.id
        );
        if (index === -1) {
          this.documentAccountLineAffected.push(documentLineSelected);
        }
      });
    }
    this.getReconcilableDocumentAccountLineToClose();
    this.getBankReconciliationStatement();
    this.documentToAffectSelected = [];
    this.documentToAffectSelectedId = [];
    this.isSave = true;
  }

  affectDocuemntAccountAllLine() {
    const startDate = this.datePipe.transform(
      this.documentAccountLineFormGroup.value.startDate,
      SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS
    );
    const endDate = this.datePipe.transform(
      this.documentAccountLineFormGroup.value.endDate,
      SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS
    );
    this.documentAccountService
      .getJavaGenericService()
      .sendData(
        `${ReportingConstant.CLOSE_RECONCILABLE_DOCUMENT_ACCOUNT_ALL_LINE}` +
          `?accountId=${this.documentAccountLineFormGroup.value.account}&startDate=${startDate}&endDate=${endDate}`,
        this.documentAccountLineAffected
      )
      .subscribe((data) => {
        this.documentToAffectSelected =
          this.documentAccountLineReleased.concat(data);
        this.documentToAffectSelectedId = this.documentToAffectSelected.map(
          (documentToAffect) => documentToAffect.id
        );
        this.affectDocuemntAccountLine();
      });
  }

  releaseDocuemntAccountAllLine() {
    this.reportService
      .getJavaGenericService()
      .sendData(
        `${ReportingConstant.ALL_BANK_RECONCILIATION}` +
          `?accountId=${
            this.documentAccountLineFormGroup.value.account
          }&fiscalYearId=${this.fiscalYearId}
      &closeMonth=${
        this.documentAccountLineFormGroup.value.closeMonth.getMonth() + 1
      }`,
        this.documentAccountLineReleased
      )
      .subscribe((data) => {
        this.documentToReleaseSelected =
          this.documentAccountLineAffected.concat(data);
        this.documentToReleaseSelectedId = this.documentToReleaseSelected.map(
          (documentToRelease) => documentToRelease.id
        );
        this.releaseDocuemntAccountLine();
      });
  }
  private affectDocument() {
    if (
      this.documentToAffectSelectedId.length !== 0 &&
      this.fiscalYearIsOpened
    ) {
      this.documentToAffectSelected.forEach((documentAccountLine) => {
        const pageNumber = Math.trunc(
          this.closedGridSettings.gridData.total / this.closedPageSize
        );
        if (
          this.documentAccountLineSelected.length < this.closedPageSize &&
          this.closedCurrentPage === pageNumber &&
          this.documentAccountLineSelected.findIndex(
            (doc) => doc.id === documentAccountLine.id
          ) === -1
        ) {
          this.documentAccountLineSelected.push(documentAccountLine);
        }
        let index = this.documentAccountLineSource.findIndex(
          (doc) => doc.id === documentAccountLine.id
        );
        if (index !== -1) {
          this.documentAccountLineSource.splice(index, 1);
        }
        const indexReleased = this.documentAccountLineReleased.findIndex(
          (doc) => doc.id === documentAccountLine.id
        );
        if (indexReleased !== -1) {
          this.documentAccountLineReleased.splice(indexReleased, 1);
        }
        index = this.documentAccountLineAffected.findIndex(
          (doc) => doc.id === documentAccountLine.id
        );
        if (index === -1) {
          this.documentAccountLineAffected.push(documentAccountLine);
        }
      });
    }
  }

  releaseDocuemntAccountLine() {
    if (this.documentAccountLineSource.length < this.reconciliationPageSize) {
      this.releaseDocument();
    } else {
      this.documentToReleaseSelected.forEach((documentLineSelected) => {
        let index = this.documentAccountLineSelected.findIndex(
          (doc) => doc.id === documentLineSelected.id
        );
        if (index !== -1) {
          this.documentAccountLineSelected.splice(index, 1);
        }
        const indexAffected = this.documentAccountLineAffected.findIndex(
          (doc) => doc.id === documentLineSelected.id
        );
        if (indexAffected !== -1) {
          this.documentAccountLineAffected.splice(indexAffected, 1);
        }
        index = this.documentAccountLineReleased.findIndex(
          (doc) => doc.id === documentLineSelected.id
        );
        if (index === -1) {
          this.documentAccountLineReleased.push(documentLineSelected);
        }
      });
    }
    this.getReconcilableDocumentAccountLineToClose();
    this.getBankReconciliationStatement();
    this.documentToReleaseSelected = [];
    this.documentToReleaseSelectedId = [];
    this.isSave = true;
  }

  private releaseDocument() {
    if (
      this.documentToReleaseSelectedId.length !== 0 &&
      this.fiscalYearIsOpened
    ) {
      this.documentToReleaseSelected.forEach((documentLineSelected) => {
        const pageNumber = Math.trunc(
          this.reconciliationGridSettings.gridData.total /
            this.reconciliationPageSize
        );
        if (
          this.documentAccountLineSource.length < this.reconciliationPageSize &&
          this.reconciliationCurrentPage === pageNumber &&
          this.documentAccountLineSource.findIndex(
            (doc) => doc.id === documentLineSelected.id
          ) === -1
        ) {
          this.documentAccountLineSource.push(documentLineSelected);
        }
        let index = this.documentAccountLineSelected.findIndex(
          (doc) => doc.id === documentLineSelected.id
        );
        if (index !== -1) {
          this.documentAccountLineSelected.splice(index, 1);
        }
        const indexAffected = this.documentAccountLineAffected.findIndex(
          (doc) => doc.id === documentLineSelected.id
        );
        if (indexAffected !== -1) {
          this.documentAccountLineAffected.splice(indexAffected, 1);
        }
        index = this.documentAccountLineReleased.findIndex(
          (doc) => doc.id === documentLineSelected.id
        );
        if (index === -1) {
          this.documentAccountLineReleased.push(documentLineSelected);
        }
      });
    }
  }

  onSelectedKeysChange(event) {
    this.onDeselectFromSelected(event);
    this.onSelectFromSelected(event);
  }

  private onDeselectFromSelected(event) {
    const missingElement = this.documentToReleaseSelected.filter(
      (item) => event.findIndex((doc) => doc === item.id) < 0
    );
    missingElement.forEach((element) => {
      this.documentToReleaseSelected.splice(
        this.documentToReleaseSelected.findIndex(
          (doc) => doc.id === element.id
        ),
        1
      );
    });
  }

  private onSelectFromSelected(event) {
    if (event.length !== 0 && this.fiscalYearIsOpened) {
      event.forEach((element) => {
        const documentLineSelected = this.documentAccountLineSelected.find(
          (doc) => doc.id === element
        );
        const indexDocumentLineToRelease =
          this.documentToReleaseSelected.findIndex((doc) => doc.id === element);
        if (
          documentLineSelected !== undefined &&
          indexDocumentLineToRelease === -1
        ) {
          this.documentToReleaseSelected.push(documentLineSelected);
        }
      });
    }
  }

  onSourceKeysChange(event) {
    this.onDeselectFromSource(event);
    this.onSelectFromSource(event);
  }

  private onSelectFromSource(event) {
    if (event.length !== 0 && this.fiscalYearIsOpened) {
      event.forEach((element) => {
        const documentLineSource = this.documentAccountLineSource.find(
          (doc) => doc.id === element
        );
        const indexDocumentLineToAffect =
          this.documentToAffectSelected.findIndex((doc) => doc.id === element);
        if (
          documentLineSource !== undefined &&
          indexDocumentLineToAffect === -1
        ) {
          this.documentToAffectSelected.push(documentLineSource);
        }
      });
    }
  }

  private onDeselectFromSource(event) {
    const missingElement = this.documentToAffectSelected.filter(
      (item) => event.findIndex((doc) => doc === item.id) < 0
    );
    missingElement.forEach((element) => {
      this.documentToAffectSelected.splice(
        this.documentToAffectSelected.findIndex((doc) => doc.id === element.id),
        1
      );
    });
  }

  @HostListener("document:keydown.Enter", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.loadDocumentAccountLineOnSearch();
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: "decimal",
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision,
    };
  }

  getCompanyCurrency() {
    this.companyService
      .getDefaultCurrencyDetails()
      .subscribe((currency: ReducedCurrency) => {
        this.currencyId = currency.Id;
        this.setSelectedCurrency(currency);
        this.currencyCode = currency.Code;
      });
  }

  initDataToSendToTelerikReport(reportName: any, url: any) {
    return {
      accountingUrl: url.url,
      reportName: reportName,
      provisionalEdition: this.provisionalEdition,
      fiscalYearId: this.reconciliationBankStatement.fiscalYearId,
      closeMonth: this.reconciliationBankStatement.closeMonth,
      accountId: this.reconciliationBankStatement.accountId,
      period:
        this.translate.instant(
          SharedConstant.MONTHS[this.reconciliationBankStatement.closeMonth - 1]
        ) +
        " " +
        this.reconciliationBankStatement.fiscalYearLabel,
      codeAccount: this.reconciliationBankStatement.accountCode,
      labelAccount: this.reconciliationBankStatement.accountLabel,
      finalamount: this.reconciliationBankStatement.finalAmount,
      initialAmount: this.reconciliationBankStatement.initialAmount,
      company: "",
    };
  }

  initDataOfBankStatementToSendToTelerikReport(reportName: any, url: any) {
    return {
      accountingUrl: url.url,
      reportName: reportName,
      provisionalEdition: this.provisionalEdition,
      fiscalYearId: this.reconciliationBankStatement.fiscalYearId,
      accountId: this.reconciliationBankStatement.accountId,
      codeAccount: this.reconciliationBankStatement.accountCode,
      labelAccount: this.reconciliationBankStatement.accountLabel,
      startDate: this.datePipe.transform(
        this.documentAccountLineFormGroup.value.startDate,
        SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS
      ),
      endDate: this.datePipe.transform(
        this.documentAccountLineFormGroup.value.endDate,
        SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS
      ),
      company: "",
    };
  }

  public onClickPrintByJasper(): void {
    const dataToSend = {
      company: "",
      logoDataBase64: "",
      companyAdressInfo: "",
      generationDate: "",
      commercialRegister: "",
      matriculeFisc: "",
      mail: "",
      webSite: "",
      tel: "",
    };

    if (this.documentAccountLineFormGroup.valid) {
      this.spinner = true;
      this.companyService.getCurrentCompany().subscribe((company) => {
        let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
        const printPDF = () => {
           this.genericAccountingService.setCompanyInfos(dataToSend, company);
           const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company,dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate,dataToSend.commercialRegister,dataToSend.matriculeFisc,dataToSend.mail,dataToSend.webSite,dataToSend.tel);


            if (this.isReconciliable) {
              this.reportService.getJavaGenericService().saveEntity(
                reportTemplateParams,
                ReportingConstant.JASPER_ENTITY_NAME +
                  "/" +
                  `${ReportingConstant.BANK_RECONCILIATION_JASPER_REPORT}` +
                  `?fiscalYearId=${this.fiscalYearId}&accountId=${
                    this.reconciliationBankStatement.accountId
                  }&closeMonth=${
                    this.documentAccountLineFormGroup.value.closeMonth.getMonth() +
                    1
                  }` +
                  `&period=${
                    this.translate.instant(
                      SharedConstant.MONTHS[
                        this.reconciliationBankStatement.closeMonth - 1
                      ]
                    ) +
                    " " +
                    this.currentFiscalYear.name
                  }` +
                  `&initialAmountCredit=${this.initialAmountCredit}&finalAmountCredit=${this.finalAmountCredit}&initialAmountDebit=${this.initialAmountDebit}` +
                  `&finalAmountDebit=${this.finalAmountDebit}`)
               .subscribe( (data) => {
                this.genericAccountingService.downloadPDFFile(
                  data,
                  this.translate.instant(
                    ReportingConstant.RECONCILIATION_BANK
                  )
                );
              },
              () => {},
              () => {
                this.spinner = false;
              });
            }else {
              const startDate = this.datePipe.transform(
                this.documentAccountLineFormGroup.value.startDate,
                SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS
              );
              const endDate = this.datePipe.transform(
                this.documentAccountLineFormGroup.value.endDate,
                SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS
              );
              this.reportService.getJavaGenericService().saveEntity(
                reportTemplateParams,
                ReportingConstant.JASPER_ENTITY_NAME +
                  "/" +
                  `${ReportingConstant.BANK_RECONCILIATION_STATEMENT_JASPER_REPORT}` +
                  `?accountId=${
                    this.reconciliationBankStatement.accountId
                  }&endDate=${
                    endDate
                  }` +
                  `&startDate=${
                    startDate
                  }` +
                  `&period=${
                    this.translate.instant(
                      SharedConstant.MONTHS[
                        this.reconciliationBankStatement.closeMonth - 1
                      ]
                    ) +
                    " " +
                    this.currentFiscalYear.name
                  }`)
               .subscribe( (data) => {
                this.genericAccountingService.downloadPDFFile(
                  data,
                  this.translate.instant(
                    ReportingConstant.RECONCILIATION_BANK_STATEMENT
                  )
                );
              },
              () => {},
              () => {
                this.spinner = false;
              });
            }
          };
                   if (srcPicture == ""){
                     dataToSend.logoDataBase64= "";
                     printPDF();
                   }
                   else{ 
                    srcPicture.subscribe((res: any) => {
                          if(res){
                          dataToSend.logoDataBase64= res;}},
                          () => {dataToSend.logoDataBase64= "";},
                          () => printPDF());
                 }
      });
    } else {
      this.validationService.validateAllFormFields(
        this.documentAccountLineFormGroup
      );
    }
  }

  changeProvisionalEdition() {
    this.provisionalEdition = !this.provisionalEdition;
  }

  ngOnInit() {
    this.initialDocumentAccountLineForm();
    this.fiscalYearId = this.currentFiscalYear.id;
    this.currentExerciceStartDate = new Date(this.currentFiscalYear.startDate);
    this.currentExerciceEndDate = new Date(this.currentFiscalYear.endDate);
    this.initDefaultDocument();
    this.initReconcilableAccountList();
    this.getCompanyCurrency();
  }

  public goToHistoric() {
    if (this.documentAccountLineFormGroup.valid) {
      const selectedAccountId = this.documentAccountLineFormGroup.value.account;
      this.reconciliationBankBehaviorSubjectService.nextMessage({
        account: this.documentAccountLineFormGroup.value.account,
        closeMonth: this.documentAccountLineFormGroup.value.closeMonth,
        isFromHistoric : false
      });
      this.router.navigateByUrl(
        ReconciliationConstant.RECONCILIATION_HISTORY_URL.concat(
          selectedAccountId
        )
      );
      this.isSave = false;
    } else {
      this.validationService.validateAllFormFields(
        this.documentAccountLineFormGroup
      );
    }
  }
  getFooterClass(): string {
    return this.styleConfigService.getFooterClassLayoutAddComponent();
  }
}
