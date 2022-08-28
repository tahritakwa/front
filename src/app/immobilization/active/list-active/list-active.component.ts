import { Component, Injector, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { PredicateFormat, Relation, Operation, Filter } from '../../../shared/utils/predicate';
import { DataSourceRequestState, SortDescriptor, State } from '@progress/kendo-data-query';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { StatusComboboxComponent } from '../../components/status-combobox/status-combobox.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActiveService } from '../../services/active/active.service';
import { strictSup, ValidationService } from '../../../shared/services/validation/validation.service';
import { Active } from '../../../models/immobilization/active.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ReportingInModalComponent } from '../../../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GenericAccountingService } from '../../../accounting/services/generic-accounting.service';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
import { NumberFormatOptions } from '@progress/kendo-angular-intl';
import { Currency } from '../../../models/administration/currency.model';
import { ReportingConstant } from '../../../constant/accounting/reporting.constant';
import { AccountingConfigurationService } from '../../../accounting/services/configuration/accounting-configuration.service';
import { AccountingConfigurationConstant } from '../../../constant/accounting/accounting-configuration.constant';
import { FiscalYearStateEnumerator } from '../../../models/enumerators/fiscal-year-state-enumerator.enum';
import { GenerateDocumentAccountFromAmortization } from '../../../accounting/depreciation-assets/generate-document-account-from-amortization/generate-document-account-from-amortization.component';
import { ActiveConstant } from '../../../constant/immobilization/active.constant';
import { ActiveAssignmentService } from '../../services/active-assignment/active-assignment.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { ActiveAssignment } from '../../../models/immobilization/active-assignment.model';
import { ReportTemplateDefaultParameters } from '../../../models/accounting/report-template-default-parameters';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { ReportTemplateDefaultParams } from '../../../models/accounting/report-template-default-params';

const ACTIVE_EDIT_URL = 'main/immobilization/listOfActive/AdvancedEdit/';
const ACCOUNTING_IMMOBILIZATION_EDIT_URL = 'main/accounting/depreciationAssets/edit/';

@Component({
  selector: 'app-list-active',
  templateUrl: './list-active.component.html',
  styleUrls: ['./list-active.component.scss']
})
export class ListActiveComponent implements OnInit {
  private statusComboboxComponent: StatusComboboxComponent;
  @Input()
  public accountingImmobilization = false;
  @Input()
  public currentFiscalYearId: number;
  @Input() dotationAmortizationAccounts = [];

  public currentFiscalYear: any;

  isAdvancedAdd = false;
  // Edited Row index
  private editedRowIndex: number;
  // Grid quick add
  public activeFormGroup: FormGroup;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  /**
   * button Advanced Edit visibility
   */
  private btnEditVisible: boolean;

  provisionalEdition = false;
  public formatNumberOptions: NumberFormatOptions;

  private currencyId: number;
  public currencyCode: string;
  public purchasePrecision: number;
  /**
   * Grid state
   */
  public gridState: State = {
    skip: 0,
    take: SharedConstant.DEFAULT_ITEMS_NUMBER,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  spinner = false;
  depreciationAssetsConfigurations: any;
  immobilizationAccounts: any;
  idsAssetsActives: any;
  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: 'Code',
      title: 'CODE',
      filterable: true,
    },
    {
      field: 'Label',
      title: 'LABEL',
      filterable: true
    },
    {
      field: 'Value',
      title: 'BUYING_PRICE',
      filterable: true
    },
    {
      field: 'Status',
      title: 'STATUS',
      filterable: true,
      filter: 'numeric',
    },
    {
      field: 'AcquisationDate',
      title: 'ACQUISATION_DATE',
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      filter: 'date'

    },
    {
      field: 'ServiceDate',
      title: 'SERVICE_DATE',
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT)
    },
    {
      field: 'IdCategoryNavigation.Label',
      title: 'CATEGORY',
      filterable: true
    },
    {
      field: 'IdCategoryNavigation.ImmobilisationTypeText',
      title: 'DEPRECIATION_ACCOUNT',
      filterable: true
    }
  ];

  public immobilizationAccountsIsLoading = false;
  public previousFiscalYearCheckingInProgress = false;
  public depreciationAssetsConfigurationIsLoading = false;
  public statusUpdateActives: any;
  public previousFiscalYearIsConcludedOrNonExistant = false;
  public isDetailedGeneration = false;
  isRemovable: boolean;
  public activeAssignmentList: ActiveAssignment[] = [];
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public sort: SortDescriptor[] = [{
    field: 'Label',
    dir: 'asc'
  }];
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.initGridDataSource();
  }
  public haveAddPermission = false;
  public haveUpdatePermission = false;
  public haveDeletePermission = false;
  public haveShowPermission = false;
  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  constructor(public activeService: ActiveService, private router: Router, private translate: TranslateService,
    private validationService: ValidationService, private swalWarrings: SwalWarring,
    private viewRef: ViewContainerRef,
    private formModalDialogService: FormModalDialogService,
    private companyService: CompanyService,
    public authService: AuthService,
    private genericAccountingService: GenericAccountingService,
    private injector: Injector, private growlService: GrowlService,
    private accountingConfigurationService: AccountingConfigurationService,
    private route: ActivatedRoute, private activeAssignmentService: ActiveAssignmentService,
    private localStorageService: LocalStorageService
  ) {
    this.statusComboboxComponent = new StatusComboboxComponent(translate);
    this.preparePredicate();
    this.btnEditVisible = true;
  }

  changeProvisionalEdition() {
    this.provisionalEdition = !this.provisionalEdition;
  }
  private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation('IdCategoryNavigation')]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation('IdHistoryNavigation')]);

  }
  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.activeService.reloadServerSideData(state, this.predicate).subscribe(data => this.gridSettings.gridData = data);
    if (this.accountingImmobilization) {
      this.initGridDataSource();
    }
  }

  /**
   * Close editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.activeFormGroup = undefined;
    }
    this.btnEditVisible = true;
  }

  /**
   * Quick add
   * @param param0
   */
  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.activeFormGroup = new FormGroup({
      Code: new FormControl('', Validators.required),
      Label: new FormControl('', Validators.required),
      Value: new FormControl(undefined, [Validators.required, strictSup(0)]),
      Status: new FormControl(undefined, Validators.required),
      AcquisationDate: new FormControl(undefined, Validators.required),
      IdCategory: new FormControl(undefined, Validators.required),
    });

    sender.addRow(this.activeFormGroup);
    this.btnEditVisible = false;

  }

  /**
   * Quick edit
   * @param param0
   */
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.activeFormGroup = new FormGroup({
      Id: new FormControl(dataItem.Id),
      Code: new FormControl(dataItem.Code, Validators.required),
      Label: new FormControl(dataItem.Label, Validators.required),
      Value: new FormControl(dataItem.Value, [Validators.required, Validators.min(0)]),
      Status: new FormControl(dataItem.Status, Validators.required),
      AcquisationDate: new FormControl(new Date(dataItem.AcquisationDate), Validators.required),
      ServiceDate: new FormControl(new Date(dataItem.ServiceDate)),
      IdCategory: new FormControl(dataItem.IdCategory, Validators.required),
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.activeFormGroup);
    this.btnEditVisible = false;
  }

  /**
   * Cancel
   * @param param0
   */
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
  }

  /**
   * Save handler
   * @param param0
   */
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    if ((formGroup as FormGroup).valid) {

      const item: Active = formGroup.value;
      this.activeService.save(item, isNew, this.predicate).subscribe(() => this.initGridDataSource());

      sender.closeRow(rowIndex);
      this.btnEditVisible = true;

    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler({ dataItem }) {
    this.isRemovable = true;
    this.activeAssignmentService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.activeAssignmentList = data.data;
        this.activeAssignmentList.forEach(element => {
          if (element.IdActive === dataItem.Id) {
            this.isRemovable = false;
          }
        });
        if (this.isRemovable) {
          this.swalWarrings.CreateSwal().then((result) => {
            if (result.value) {
              this.activeService.remove(dataItem).subscribe(() => {
                this.initGridDataSource();
              });
            }
          });
        } else {
          this.growlService.warningNotification(this.translate.instant(ActiveConstant.ACTIVE_AFFECTED));

        }
      });
  }

  public goToAdvancedEdit(dataItem) {
    if (this.accountingImmobilization === false) {
      this.router.navigateByUrl(ACTIVE_EDIT_URL.concat(dataItem.Id), { queryParams: dataItem, skipLocationChange: true });
    } else {
      // when method goToAdvancedEdit is called and accountingImmobilization is True, invoke import and inject required service
      const dynamicImportDepreciation = require('../../../models/accounting/depreciation');
      this.injector.get(dynamicImportDepreciation.Depreciation).depreciationAssets = this.initDeprecitionAssets(dataItem);
      this.router.navigateByUrl(ACCOUNTING_IMMOBILIZATION_EDIT_URL.concat(dataItem.Id), { skipLocationChange: true });
    }
  }

  /*set immobilization field value to send to accounting module*/
  initDeprecitionAssets(dataItem: any): any {
    // when method initDeprecitionAssets is called, invoke import
    const dynamicImportDepAssets = require('../../../models/accounting/depreciation-assets');
    const depreciationAssets = new dynamicImportDepAssets.DepreciationAssets();
    depreciationAssets.idAssets = dataItem.Id;
    depreciationAssets.assetsAmount = dataItem.Value;
    depreciationAssets.dateOfCommissioning = dataItem.ServiceDate;
    depreciationAssets.assetsLabel = dataItem.Label;
    depreciationAssets.idCategory = dataItem.IdCategory;
    return depreciationAssets;
  }

  loadDepreciationAssetsConfiguration() {
    this.accountingConfigurationService.getJavaGenericService()
      .getEntityList(AccountingConfigurationConstant.DEPRECIATION_ASSETS_CONFIGURATION_URL)
      .subscribe(CategoryParam => {
        this.depreciationAssetsConfigurations = CategoryParam;
      });
  }
  loadImmobilizationAccounts() {
    const dynamicImportReportService = require('../../../accounting/services/reporting/reporting.service');
    const dynamicImportReportingConstant = require('../../../constant/accounting/reporting.constant');
    this.injector.get(dynamicImportReportService.ReportingService)
      .getJavaGenericService().sendData(dynamicImportReportingConstant.ReportingConstant.ACCOUNT_DEPRECIATION_OF_ASSETS, this.idsAssetsActives)
      .subscribe(account => {
        this.immobilizationAccounts = account;
      });
  }

  public setCurrentFiscalYearById() {
    const dynamicImportFiscalYearService = require('../../../accounting/services/fiscal-year/fiscal-year.service');
    this.injector.get(dynamicImportFiscalYearService.FiscalYearService).getJavaGenericService().getEntityById(this.currentFiscalYearId).subscribe(data => {
      this.currentFiscalYear = data;
    });
  }

  checkPreviouFiscalYearIsConcluded() {
    if (this.currentFiscalYearId !== undefined && this.accountingImmobilization) {
      const dynamicImportFiscalYearService = require('../../../accounting/services/fiscal-year/fiscal-year.service');
      const dynamicImportFiscalYearConstant = require('../../../constant/accounting/fiscal-year.constant');
      this.injector.get(dynamicImportFiscalYearService.FiscalYearService)
        .getJavaGenericService().getEntityList(dynamicImportFiscalYearConstant.FiscalYearConstant.FISCAL_YEAR_PREVIOUS_URL + `/${this.currentFiscalYearId}`).subscribe(data => {
          if (data.id === null || data.closingState === FiscalYearStateEnumerator.Concluded) {
            this.previousFiscalYearIsConcludedOrNonExistant = true;
          }
        });
    }
  }
  loadDataDepreciationAssets(data) {
    if (this.accountingImmobilization) {
      this.idsAssetsActives = data.data.map(actif => actif.Id);
      this.loadDepreciationAssetsConfiguration();
      this.loadImmobilizationAccounts();
    }
  }

  initGridDataSource() {
    this.spinner = true;
    this.activeService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.loadDataDepreciationAssets(data);
        this.gridSettings.gridData = data;
        this.checkConsommingDatesInFiscalYear(data);
        this.checkPreviouFiscalYearIsConcluded();
      }, () => { }, () => {
        this.spinner = false;
      });
  }

  checkIfCategorySet(idCategory): boolean {
    if (this.depreciationAssetsConfigurations) {
      return this.depreciationAssetsConfigurations.map(category => category.idCategory).includes(idCategory);
    }
  }

  setImmobilisationAccount(idAssets): String {
    if (this.immobilizationAccounts && this.immobilizationAccounts[idAssets]) {
      return this.immobilizationAccounts[idAssets];
    }
    return '';
  }

  checkstatusUpdateActivesList(index): boolean {
    return this.statusUpdateActives && this.statusUpdateActives[index] && this.router.url.includes('immobilization/listOfActive');
  }

  initDataToSendToTelerikReport(reportName: string, url: any) {
    return {
      'accountingUrl': url.url,
      'provisionalEdition': this.provisionalEdition,
      'company': '',
      'companyAdressInfo': '',
      'companyCode': '',
      'reportName': reportName,
      'cookie': localStorage.getItem('Cookie'),
      'contentType': localStorage.getItem('Content-Type'),
      'user': this.localStorageService.getUser(),
      'authorization': localStorage.getItem('authorization'),
      'fiscalYearId': this.currentFiscalYearId,
    };
  }

  public onClickPrint(): void {
    const dynamicReportService = require('../../../accounting/services/reporting/reporting.service');
    this.injector.get(dynamicReportService.ReportingService).getJavaGenericService().getData(AccountsConstant.TOMCAT_SERVER_URL).subscribe(data => {
      const url = data;
      const dataToSend = this.initDataToSendToTelerikReport('AmortizationTable', url);
      this.companyService.getCurrentCompany().subscribe(company => {
        this.genericAccountingService.setCompanyInfo(dataToSend, company);
      }, error => { }, () => {
        this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
          SharedConstant.MODAL_DIALOG_SIZE_L);
      });
    });
  }

  public onClickPrintByJasper(): void {
    this.spinner = true;
    const dynamicReportService = require('../../../accounting/services/reporting/reporting.service');

    const dataToSend = {
      company: '',
      logoDataBase64: '',
      companyAdressInfo: '',
      generationDate: '',
      commercialRegister: '',
      matriculeFisc: '',
      mail: '',
      webSite: '',
      tel: '',
    };

    this.companyService.getCurrentCompany().subscribe(company => {
      let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
      const printPDF = () => {
        this.genericAccountingService.setCompanyInfos(dataToSend, company);
        const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company, dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate, dataToSend.commercialRegister, dataToSend.matriculeFisc, dataToSend.mail, dataToSend.webSite, dataToSend.tel);
        this.injector.get(dynamicReportService.ReportingService).getJavaGenericService().saveEntity(reportTemplateParams, ReportingConstant.JASPER_ENTITY_NAME
          + '/' + ReportingConstant.AMORTIZATION_REPORT + '/' + `${this.currentFiscalYearId}`)
          .subscribe(data => {
            this.genericAccountingService.downloadPDFFile(data, this.translate.instant(ReportingConstant.AMORTIZATION_TABLE));

          }, error => {
            this.spinner = false;
          }, () => {
            this.spinner = false;
          }
          );
             }
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
  }

  public onClickPrintExcel(): void {
    this.spinner = true;
    const dynamicReportService = require('../../../accounting/services/reporting/reporting.service');
    const dataToSend = {
      company: '',
      logoDataBase64: '',
      companyAdressInfo: '',
      generationDate: '',
      commercialRegister: '',
      matriculeFisc: '',
      mail: '',
      webSite: '',
      tel: '',
    };
    this.companyService.getCurrentCompany().subscribe(company => {
      let srcPicture = this.companyService.getPicture(company.AttachmentUrl)
      const printPDF = () => {
        this.genericAccountingService.setCompanyInfos(dataToSend, company);
        const reportTemplateParams = new ReportTemplateDefaultParams(dataToSend.company, dataToSend.logoDataBase64, dataToSend.companyAdressInfo, this.provisionalEdition, dataToSend.generationDate, dataToSend.commercialRegister, dataToSend.matriculeFisc, dataToSend.mail, dataToSend.webSite, dataToSend.tel);
        this.injector.get(dynamicReportService.ReportingService).getJavaGenericService().saveEntity(reportTemplateParams, ReportingConstant.EXCEL_ENTITY_NAME
          + '/' + ReportingConstant.AMORTIZATION_REPORT + '/' + `${this.currentFiscalYearId}`)
          .subscribe(data => {
            this.spinner = false;
            this.genericAccountingService.downloadExcelFile(data, this.translate.instant(ReportingConstant.AMORTIZATION_TABLE));
          }, () => { }, () => {
            this.spinner = false;
          });
             }
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
  }


  clearLocalStorage() {
    if (this.accountingImmobilization) {
      localStorage.removeItem('Cookie');
      localStorage.removeItem('Content-Type');
      localStorage.removeItem('User');
      localStorage.removeItem('Authorization');
    }
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.purchasePrecision = currency.Precision;
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  getCompanyCurrency() {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.currencyId = currency.Id;
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
  }

  openModalToGenerateDetailedDocumentAccountOfAmortization() {
    this.isDetailedGeneration = true;
    this.openModalTogenerateDocumentAccountFromAmortization('GENERATION_OF_DOCUMENT_ACCOUNT_WITH_DETAILS');
  }

  openModalToGenerateWithoutDetailDocumentAccountOfAmortization() {
    this.isDetailedGeneration = false;
    this.openModalTogenerateDocumentAccountFromAmortization('GENERATION_OF_DOCUMENT_ACCOUNT_WITHOUT_DETAILS');
  }

  public openModalTogenerateDocumentAccountFromAmortization(modalTitle: string) {
    const dataItem = {
      "currentFiscalYear": this.currentFiscalYear, "isDetailedGeneration": this.isDetailedGeneration, "dotationAmortizationAccounts":
        this.dotationAmortizationAccounts
    };
    this.formModalDialogService.openDialog(modalTitle, GenerateDocumentAccountFromAmortization, this.viewRef, null,
      dataItem, null, SharedConstant.MODAL_DIALOG_SIZE_M);
  }
  public checkConsommingDatesInFiscalYear(data) {
    const dynamicImportFiscalYearService = require('../../../accounting/services/fiscal-year/fiscal-year.service');
    const dynamicImportFiscalYearConstant = require('../../../constant/accounting/fiscal-year.constant');
    var serviceDates = [];
    var consommingDatesValue: any;
    var isAllAssetsConsommingDatesNull = false;
   this.genericAccountingService.doAsyncTaskUsingPromiseAndSetTimeOut(NumberConstant.ONE_HUNDRED).then(() => {
      serviceDates = data.data.map(actif => actif.ServiceDate);
      consommingDatesValue = serviceDates.map(date => date == null ? true: false);
      isAllAssetsConsommingDatesNull = serviceDates.filter(date => date == null).length == serviceDates.length;
      if(!isAllAssetsConsommingDatesNull) {
        this.injector.get(dynamicImportFiscalYearService.FiscalYearService)
        .getJavaGenericService().sendData(dynamicImportFiscalYearConstant.FiscalYearConstant.IS_CONSOMMING_DATES_IN_FISCAL_YEAR,
          serviceDates).subscribe(results => {
            this.statusUpdateActives = consommingDatesValue.map((item,index) => item ? true : (results[index] ? true : false))      
          }); 
      } else {
        this.statusUpdateActives = consommingDatesValue;
      }
    });
  }

  ngOnInit() {
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ACTIVE);
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ACTIVE);
    this.haveDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_ACTIVE);
    this.haveShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ACTIVE);
    this.initGridDataSource();
    // this.setConfigurationServerSide();
    this.getCompanyCurrency();
    if (this.accountingImmobilization) {
      this.setCurrentFiscalYearById();
    }
  }

  ngOnDestroy(): void {
    this.clearLocalStorage();
  }
}
