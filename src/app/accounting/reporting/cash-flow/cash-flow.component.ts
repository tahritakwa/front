import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GrowlService } from "../../../../COM/Growl/growl.service";
import { TranslateService } from "@ngx-translate/core";
import { FormModalDialogService } from "../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service";
import { ReportingConstant } from "../../../constant/accounting/reporting.constant";
import { NumberConstant } from "../../../constant/utility/number.constant";
import { SharedAccountingConstant } from "../../../constant/accounting/sharedAccounting.constant";
import {
  DataStateChangeEvent,
  GridComponent,
  RowClassArgs,
} from "@progress/kendo-angular-grid";
import { DataSourceRequestState } from "@progress/kendo-data-query";
import { ColumnSettings } from "../../../shared/utils/column-settings.interface";
import { GridSettings } from "../../../shared/utils/grid-settings.interface";
import { ReportingService } from "../../services/reporting/reporting.service";
import { ValidationService } from "../../../shared/services/validation/validation.service";
import { FiscalYearDropdownComponent } from "../../../shared/components/fiscal-year-dropdown/fiscal-year-dropdown.component";
import { GenericAccountingService } from "../../services/generic-accounting.service";
import { Observable } from "rxjs/Observable";
import { DatePipe } from "@angular/common";
import { SwalWarring } from "../../../shared/components/swal/swal-popup";
import { AccountingConfigurationService } from "../../services/configuration/accounting-configuration.service";
import { Operation } from "../../../../COM/Models/operations";
import { CompanyService } from "../../../administration/services/company/company.service";
import NumberFormatOptions = Intl.NumberFormatOptions;
import { FiscalYearService } from "../../services/fiscal-year/fiscal-year.service";
import { FiscalYearStateEnumerator } from "../../../models/enumerators/fiscal-year-state-enumerator.enum";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountingConfigurationConstant } from "../../../constant/accounting/accounting-configuration.constant";
import { FiscalYearConstant } from "../../../constant/accounting/fiscal-year.constant";
import { SpinnerService } from "../../../../COM/spinner/spinner.service";
import { ReportTemplateDefaultParameters } from "../../../models/accounting/report-template-default-parameters";
import { KeyboardConst } from "../../../constant/keyboard/keyboard.constant";
import { ReducedCurrency } from "../../../models/administration/reduced-currency.model";
import { AuthService } from "../../../login/Authentification/services/auth.service";
import { PermissionConstant } from "../../../Structure/permission-constant";
import { ReportTemplateDefaultParams } from "../../../models/accounting/report-template-default-params";

@Component({
  selector: "app-cash-flow",
  templateUrl: "./cash-flow.component.html",
  styleUrls: ["./cash-flow.component.scss"],
})
export class CashFlowComponent implements OnInit {
  public cashFlowForm: FormGroup;
  public reportTypeData: any[];
  public editedRowIndex: number;
  public reportConfigFormGroup: FormGroup;
  public editLineMode = false;

  provisionalEdition = false;
  fiscalYearIsOpened = true;
  public signValues;
  spinner = false;
  @ViewChild(GridComponent)
  public grid: GridComponent;

  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    filter: {
      // Initial filter descriptor
      logic: "and",
      filters: [],
    },
  };
  nameReport = "";
  @ViewChild(FiscalYearDropdownComponent) fiscalYearDropdownComponent;

  public columnsConfig: ColumnSettings[] =
    ReportingConstant.REPORTS_DEFAULT_COLUMNS_CONFIG;

  public cashFlowData: any[];
  public cashFlowDataFilter: any[];
  public displayReportDetails = false;
  public previousFiscalYearLabel = "-";
  public currentFiscalYearLabel = "-";
  public currentFiscalYear: any;
  fiscalYears: any;

  public currencyCode: string;

  lastUpdated: any;
  user: any;
  reportLinesOnPreview: any;

  public formatNumberOptions: NumberFormatOptions;

  firstGeneration = true;
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };


  urlReport = "";
  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  constructor(
    private fb: FormBuilder,
    private growlService: GrowlService,
    private swalWarrings: SwalWarring,
    private reportingService: ReportingService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private formModalDialogService: FormModalDialogService,
    public authService: AuthService,
    private validationService: ValidationService,
    private viewContainerRef: ViewContainerRef,
    private reportService: ReportingService,
    private genericAccountingService: GenericAccountingService,
    private accountingConfigurationService: AccountingConfigurationService,
    private companyService: CompanyService,
    private fiscalYearService: FiscalYearService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private router: Router
  ) {
    if (this.route.snapshot.data["currentFiscalYear"]) {
      this.currentFiscalYear = this.route.snapshot.data["currentFiscalYear"];
      this.fiscalYearIsOpened =
        this.currentFiscalYear.closingState ===
          FiscalYearStateEnumerator.Open ||
        this.currentFiscalYear.closingState ===
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
    if (this.route.snapshot.data["fiscalYears"]) {
      this.fiscalYears = this.route.snapshot.data["fiscalYears"];
    } else {
      this.fiscalYearService
        .getJavaGenericService()
        .getEntityList(FiscalYearConstant.FIND_ALL_METHOD_URL)
        .subscribe((data) => {
          this.fiscalYears = data;
        });
    }
  }

  receiveCurrentFiscalYear($event) {
    if ($event !== undefined && $event.selectedValue !== undefined) {
      this.closeEditor(this.editedRowIndex);
      this.fiscalYearService
        .getJavaGenericService()
        .getEntityById($event.selectedValue)
        .subscribe((data) => {
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
          this.previewReportInGrid();
        });
    }
  }

  public rowClassCallback = (context: RowClassArgs) => {
    return { grayed: context.dataItem.highlighted };
  };

  private createInputForm(): void {
    this.cashFlowForm = this.fb.group({
      cashFlowType: ["", Validators.required],
      reportType: ["", [Validators.required]],
    });
  }

  public initSignValues() {
    this.signValues = [
      {
        negative: false,
        status: `${this.translate.instant(ReportingConstant.POSITIVE)}`,
      },
      {
        negative: true,
        status: `${this.translate.instant(ReportingConstant.NEGATIVE)}`,
      },
    ];
  }
  previewReportInGrid() {
    if (this.cashFlowForm.valid) {
      this.firstGeneration = false;
      this.initGridDataSource();
    } else {
      this.validationService.validateAllFormFields(this.cashFlowForm);
    }
  }

  assignDataToGrid(data) {
    data.map((reportLine) => {
      if (reportLine.negative === true) {
        reportLine.negative = this.signValues[1].status;
      } else if (reportLine.negative === false) {
        reportLine.negative = this.signValues[0].status;
      }
    });
    this.reportLinesOnPreview = data;
    this.gridSettings.gridData = data;
    this.previousFiscalYearLabel = data[0].previousFiscalYear;
    this.currentFiscalYearLabel = data[0].fiscalYear.name;
    const lastUpdatedReportLine = data.sort((a: any, b: any) => {
      return (
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
    });
    this.user = lastUpdatedReportLine[0].user;
    this.lastUpdated = this.datePipe.transform(
      lastUpdatedReportLine[0].lastUpdated,
      SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS
    );
    this.displayReportDetails = true;
  }

  initGridDataSource(data?: any) {
    if (data !== undefined) {
      this.assignDataToGrid(data);
    } else {
      this.spinner = true;
      this.reportingService
        .getJavaGenericService()
        .getEntityList(
          `${ReportingConstant.GENERATE_ANNUAL_REPORT}/` +
            `${this.currentFiscalYear.id}/${this.cashFlowForm.value.reportType}`
        )
        .subscribe(
          (reportLines) => {
            this.assignDataToGrid(reportLines);
          },
          () => {},
          () => {
            this.spinner = false;
          }
        );
    }
  }

  resetFormula(dataItem) {
    if (dataItem.id) {
      this.reportingService
        .getJavaGenericService()
        .callService(
          Operation.PUT,
          ReportingConstant.RESET_REPORT_LINE,
          dataItem
        )
        .finally(() => {
          this.terminateOperation(this.editedRowIndex);
        })
        .subscribe();
    }
  }

  public lineClickHandler({ rowIndex, dataItem }) {
    if (
      this.authService.hasAuthority(
        this.AccountingPermissions.UPDATE_FINANCIAL_STATES_REPORTS_FORMULA
      ) &&
      this.fiscalYearIsOpened
    ) {
      this.cashFlowForm.disable();
      if (
        this.editedRowIndex !== undefined &&
        this.editedRowIndex !== rowIndex &&
        this.editLineMode
      ) {
        this.saveHandler();
      }
      this.reportConfigFormGroup = this.reportingService.editHandler(
        rowIndex,
        dataItem,
        this.grid
      );
      if (this.reportConfigFormGroup) {
        if (dataItem.negative === this.signValues[1].status) {
          this.reportConfigFormGroup.controls["negative"].setValue(true);
        } else {
          this.reportConfigFormGroup.controls["negative"].setValue(false);
        }
        this.editedRowIndex = rowIndex;
        this.editLineMode = true;
      }
    }
  }

  public cancelHandler({ rowIndex }) {
    this.closeEditor(rowIndex);
  }

  public closeEditor(rowIndex: number) {
    this.grid.closeRow(rowIndex);
    this.cashFlowForm.enable();
    if (this.currentFiscalYear.id) {
      this.fiscalYearService
        .getJavaGenericService()
        .getEntityById(this.currentFiscalYear.id)
        .subscribe((data) => {
          this.fiscalYearIsOpened =
            data.closingState === FiscalYearStateEnumerator.Open ||
            data.closingState === FiscalYearStateEnumerator.PartiallyClosed;
          this.editLineMode = false;
        });
    }
  }

  public keyEnterAction(
    sender: GridComponent,
    formGroup: any,
    e: KeyboardEvent
  ) {
    const rowIndex = this.editedRowIndex;
    if (!formGroup || !formGroup.valid || e.key !== KeyboardConst.ENTER) {
      return;
    }
    this.editedRowIndex = rowIndex;
    this.reportConfigFormGroup = formGroup;
    this.saveHandler();
  }

  terminateOperation(rowIndex: number) {
    this.initGridDataSource();
    this.closeEditor(rowIndex);
  }

  public saveHandler() {
    this.reportingService.saveHandler(
      this.editedRowIndex,
      this.reportConfigFormGroup,
      this.terminateOperation.bind(this)
    );
    this.editedRowIndex = undefined;
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(
      this.isBalanceSheetFormChanged.bind(this)
    );
  }

  isBalanceSheetFormChanged() {
    return this.reportConfigFormGroup !== undefined;
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      style: "decimal",
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision,
    };
  }

  checkBalancedChartAccount() {
    this.reportService
      .getJavaGenericService()
      .getData(
        "check-balanced-plan" + `?fiscalYearId=${this.currentFiscalYear.id}`
      )
      .subscribe();
  }
  public onClickPrintJasper(): void {
    this.spinner = true;
    if (this.cashFlowForm.invalid) {
      return;
    }
    let report;
    if (this.cashFlowForm.getRawValue().cashFlowType === NumberConstant.ZERO) {
      report = ReportingConstant.GENERATE_ANNUAL_REPORT_JASPER;
      if (this.cashFlowForm.value.reportType === ReportingConstant.CF) {
        this.nameReport = this.translate.instant(
          ReportingConstant.CASH_FLOW_REFERENCE
        );
      } else {
        this.nameReport = this.translate.instant(
          ReportingConstant.CASH_FLOW_AUTHORIZED
        );
      }
    } else {
      report = ReportingConstant.GENERATE_ANNUAL_REPORT_ANNEX_JASPER;
      if (this.cashFlowForm.value.reportType === ReportingConstant.CF) {
        this.nameReport = this.translate.instant(
          ReportingConstant.CASH_FLOW_ANNEX_REPORT_NAME
        );
      } else {
        this.nameReport = this.translate.instant(
          ReportingConstant.CASH_FLOW_AUTHORIZED_ANNEX_REPORT_NAME
        );
      }
    }

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

    this.companyService.getCurrentCompany().subscribe((company) => {
      let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
      const printPDF = () => {
        this.genericAccountingService.setCompanyInfos(dataToSend, company);
        const reportTemplateParams = new ReportTemplateDefaultParams(
          dataToSend.company,
          dataToSend.logoDataBase64,
          dataToSend.companyAdressInfo,
          this.provisionalEdition,
          dataToSend.generationDate,
          dataToSend.commercialRegister,
          dataToSend.matriculeFisc,
          dataToSend.mail,
          dataToSend.webSite,
          dataToSend.tel
        );
        this.reportingService
          .getJavaGenericService()
          .saveEntity(
            reportTemplateParams,
            `${ReportingConstant.JASPER_ENTITY_NAME}/${report}` +
              `/${this.currentFiscalYear.id}` +
              `/${this.cashFlowForm.value.reportType}`
          ) .subscribe(
            (data) => {
              this.genericAccountingService.downloadPDFFile(
                data,
                this.nameReport
              );
            },
            () => {},
            () => {
              this.spinner = false;
            }
          );
             }
             if (srcPicture == ""){
               dataToSend.logoDataBase64= "";
               printPDF();
             }
             else{ srcPicture.subscribe(
              (res:any)=>{
                if(res){
                  dataToSend.logoDataBase64= res;}},
                  () => {dataToSend.logoDataBase64= "";},
                  () => printPDF());
            }
    });
  }

  changeReport(event) {
    if (event) {
      this.previewReportInGrid();
    }
  }

  handleFilterCashFlow(writtenValue) {
    this.cashFlowData = this.cashFlowDataFilter.filter(
      (s) =>
        s.text.toLowerCase().includes(writtenValue.toLowerCase()) ||
        s.text.toLocaleLowerCase().includes(writtenValue.toLowerCase())
    );
  }

  onSearch() {
    this.previewReportInGrid();
  }

  ngOnInit() {
    this.companyService
      .getDefaultCurrencyDetails()
      .subscribe((currency: ReducedCurrency) => {
        this.setSelectedCurrency(currency);
        this.currencyCode = currency.Code;
      });
    this.initSignValues();
    this.createInputForm();
    this.cashFlowData = [
      {
        text: this.translate.instant(ReportingConstant.CASH_FLOW),
        cashFlowType: NumberConstant.ZERO,
      },
      {
        text: this.translate.instant(ReportingConstant.CASH_FLOW_ANNEX),
        cashFlowType: NumberConstant.ONE,
      },
    ];
    this.reportTypeData = [
      /*{
      text: this.translate.instant(ReportingConstant.MODEL_AUTHORIZED),
        reportType: ReportingConstant.CFA
      },*/
      {
        text: this.translate.instant(ReportingConstant.MODEL_REFERENCE),
        reportType: ReportingConstant.CF,
      },
    ];
    this.cashFlowDataFilter = this.cashFlowData;
    this.cashFlowForm.controls["cashFlowType"].setValue(
      this.cashFlowData[0].cashFlowType
    );
    this.cashFlowForm.controls["reportType"].setValue(
      this.reportTypeData[0].reportType
    );
    this.accountingConfigurationService
      .getJavaGenericService()
      .getEntityList(AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL)
      .subscribe((fiscalYear) => {
        this.fiscalYearIsOpened =
          fiscalYear.closingState === FiscalYearStateEnumerator.Open ||
          fiscalYear.closingState === FiscalYearStateEnumerator.PartiallyClosed;
        if (!this.fiscalYearIsOpened) {
          this.growlService.warningNotification(
            this.translate.instant(
              SharedAccountingConstant.SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE
            )
          );
        }
        if (
          this.authService.hasAuthority(
            this.AccountingPermissions.VIEW_FINANCIAL_STATES_REPORTS
          ) ||
          this.authService.hasAuthority(
            this.AccountingPermissions.UPDATE_FINANCIAL_STATES_REPORTS_FORMULA
          )
        ) {
          this.initGridDataSource();
          this.checkBalancedChartAccount();
        }
      });
  }
  @HostListener("document:keydown.Enter", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.previewReportInGrid();
  }

  changeProvisionalEdition() {
    this.provisionalEdition = !this.provisionalEdition;
  }

  onClickPrintExcel() {
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

    if (this.cashFlowForm.getRawValue().cashFlowType === NumberConstant.ZERO) {
      this.urlReport = `${ReportingConstant.EXCEL_ENTITY_NAME}/${ReportingConstant.GET_ANNUAL_REPORT}/`;
      if (this.cashFlowForm.value.reportType === ReportingConstant.CF) {
        this.nameReport = this.translate.instant(
          ReportingConstant.CASH_FLOW_REFERENCE
        );
      } else {
        this.nameReport = this.translate.instant(
          ReportingConstant.CASH_FLOW_AUTHORIZED
        );
      }
    } else {
      this.urlReport = `${ReportingConstant.EXCEL_ENTITY_NAME}/${ReportingConstant.GENERATE_ANNUAL_REPORT_ANNEX}/`;
      if (this.cashFlowForm.value.reportType === ReportingConstant.CF) {
        this.nameReport = this.translate.instant(
          ReportingConstant.CASH_FLOW_ANNEX_REPORT_NAME
        );
      } else {
        this.nameReport = this.translate.instant(
          ReportingConstant.CASH_FLOW_AUTHORIZED_ANNEX_REPORT_NAME
        );
      }
    }

    this.companyService.getCurrentCompany().subscribe((company) => {

      let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
      const printPDF = () => {
        this.genericAccountingService.setCompanyInfos(dataToSend, company);
        const reportTemplateParams = new ReportTemplateDefaultParams(
          dataToSend.company,
          dataToSend.logoDataBase64,
          dataToSend.companyAdressInfo,
          this.provisionalEdition,
          dataToSend.generationDate,
          dataToSend.commercialRegister,
          dataToSend.matriculeFisc,
          dataToSend.mail,
          dataToSend.webSite,
          dataToSend.tel
        );
        this.reportingService
          .getJavaGenericService()
          .saveEntity(
            reportTemplateParams,
            this.urlReport +
              `${this.currentFiscalYear.id}/${this.cashFlowForm.value.reportType}`
          )
          .subscribe(
            (data) => {
              this.spinner = false;
              this.genericAccountingService.downloadExcelFile(
                data,
                this.nameReport
              );
            },
            () => {},
            () => {
              this.spinner = false;
            }
          );
             }
             if (srcPicture == ""){
               dataToSend.logoDataBase64= "";
               printPDF();
             }
             else{ srcPicture.subscribe(
              (res:any)=>{
                if(res){
                  dataToSend.logoDataBase64= res;}},
                  () => {dataToSend.logoDataBase64= "";},
                  () => printPDF());
            }  
        this.spinnerService.hideLaoder();
    });
  }

  public goToHistoric() {
    this.router.navigateByUrl(
      ReportingConstant.REPORT_HISTORY_URL.concat(ReportingConstant.CFA)
    );
  }
}
