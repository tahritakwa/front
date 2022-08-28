import {AfterViewInit, Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NumberConstant} from '../../constant/utility/number.constant';
import {DataStateChangeEvent, PageChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {GridSettings} from '../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../shared/utils/column-settings.interface';
import {LetteringConstant} from '../../constant/accounting/lettering.constant';
import {LetteringService} from '../services/lettering/lettering-service';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {GrowlService} from '../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {SharedAccountingConstant} from '../../constant/accounting/sharedAccounting.constant';
import {GenericAccountingService} from '../services/generic-accounting.service';
import {PageFilterService} from '../services/page-filter-accounting.service';
import {SwalWarring} from '../../shared/components/swal/swal-popup';
import {LetteringDataSource} from '../../models/accounting/letteringDataSource';
import {LiterableDocumentAccountLine} from '../../models/accounting/LiterableDocumentAccountLine';
import {Observable} from 'rxjs/Observable';
import {SearchConstant} from '../../constant/search-item';
import {ActivatedRoute, Router} from '@angular/router';
import {CompanyService} from '../../administration/services/company/company.service';
import {Currency} from '../../models/administration/currency.model';
import {DocumentAccountConstant} from '../../constant/accounting/document-account.constant';
import {FiscalYearStateEnumerator} from '../../models/enumerators/fiscal-year-state-enumerator.enum';
import {AccountingConfigurationService} from '../services/configuration/accounting-configuration.service';
import {FiscalYearService} from '../services/fiscal-year/fiscal-year.service';
import {AccountingConfigurationConstant} from '../../constant/accounting/accounting-configuration.constant';
import {StarkRolesService} from '../../stark-permissions/service/roles.service';
import {StyleConfigService} from '../../shared/services/styleConfig/style-config.service';
import { ReducedCurrency } from '../../models/administration/reduced-currency.model';
import { RoleConfigConstant } from '../../Structure/_roleConfigConstant';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';

@Component({
  selector: 'app-lettering',
  templateUrl: './lettering.component.html',
  styleUrls: ['./lettering.component.scss']
})

export class LetteringComponent implements OnInit, AfterViewInit {

  public letteringOperationTypeData: any[];
  public letteringOperationTypeDataFilter: any[];
  public currentLetteringOperationType = NumberConstant.ZERO;
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);

  public letteringDataSource = new LetteringDataSource();
  public keepedDocumentAccountLines: Array<LiterableDocumentAccountLine> = [];
  public literableLinePageListIfIsAutoGenerateMode;
  private literableLinePageSize = SharedConstant.DEFAULT_ITEMS_NUMBER;
  private literableLinePage = NumberConstant.ZERO;
  public accountPage = NumberConstant.ZERO;

  fiscalYearIsOpened = false;
  public selectedKeys = [];
  public oldSelectedKeys = [];
  public oldSizeOfSelectedKeys = NumberConstant.ZERO;

  public accountFiltredList;

  public isAutoGenerateMode = false;

  public letteringFilterFormGroup: FormGroup;
  public letteringCodeFormGroup: FormGroup;
  public letteringOperationTypeFormGroup: FormGroup;

  public isDelettering = false;
  public currentFiscalYear: any;
  public totalDebitAmount = NumberConstant.ZERO;
  public totalCreditAmount = NumberConstant.ZERO;

  public displayedCodeOfChoosenAccountCode: string;
  public displayedLabelOfChoosenAccountCode: string;
  public displayedAccountId: number;
  public startDate;
  public endDate;
  public sameAmount = false;
  public sortParams = null;
  public spinner = false;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: this.literableLinePageSize,
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: LetteringConstant.DOCUMENT_DATE_FILED,
      title: LetteringConstant.BILLING_DATE,
      tooltip: LetteringConstant.BILLING_DATE,
      filterable: true,
    },
    {
      field: LetteringConstant.CODE_DOCUMENT_ACCOUNT_FILED,
      title: LetteringConstant.CODE_DOCUMENT_ACCOUNT_TITLE,
      tooltip: LetteringConstant.CODE_DOCUMENT_ACCOUNT_TITLE,

      filterable: true,
    },
    {
      field: LetteringConstant.DOCUMENT_ACCOUNT_LINE_LABEL_FILED,
      title: LetteringConstant.DOCUMENT_ACCOUNT_LINE_LABEL_TITLE,
      tooltip: LetteringConstant.DOCUMENT_ACCOUNT_LINE_LABEL_TITLE,
      filterable: true,
    },
    {
      field: LetteringConstant.JOURNAL_FILED,
      title: LetteringConstant.JOURNAL_TITLE,
      tooltip: LetteringConstant.JOURNAL_TITLE,
      filterable: false,
    },
    {
      field: LetteringConstant.REFERENCE_FILED,
      title: LetteringConstant.REFERENCE_TITLE,
      tooltip: LetteringConstant.REFERENCE_TITLE,
      filterable: true,
    },
    {
      field: LetteringConstant.LETTER_FILED,
      title: LetteringConstant.LETTER_TITLE,
      tooltip: LetteringConstant.LETTER_TITLE,
      filterable: true,
    },
    {
      field: LetteringConstant.DEBIT_FILED,
      title: LetteringConstant.DEBIT_TITLE,
      tooltip: LetteringConstant.DEBIT_TITLE,
      filterable: true,
    },
    {
      field: LetteringConstant.CREDIT_FILED,
      title: LetteringConstant.CREDIT_TITLE,
      tooltip: LetteringConstant.CREDIT_TITLE,
      filterable: true,
    },
    {
      field: LetteringConstant.DOCUMENT_ACCOUNT_ID_FILED,
      title: LetteringConstant.DOCUMENT_ACCOUNT_ID_TITLE,
      tooltip: LetteringConstant.DOCUMENT_ACCOUNT_ID_TITLE,
      filterable: true,
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public beginAccountkeyAction: any;
  public endAccountkeyAction: any;
  public pageFilterStatus = true;

  public purchasePrecision: number;
  public formatNumberOptions: any;
  public currencyCode: string;

  linesDataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
  }

  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  constructor(private formBuilder: FormBuilder, private letteringService: LetteringService,
              private growlService: GrowlService, private translate: TranslateService, private swalWarrings: SwalWarring,
              private route: ActivatedRoute, private genericAccountingService: GenericAccountingService, private pageFilterService: PageFilterService,
              private accountingConfigurationService: AccountingConfigurationService, public authService: AuthService,
              private fiscalYearService: FiscalYearService, private companyService: CompanyService,
              private viewRef: ViewContainerRef, private router: Router,
              private styleConfigService: StyleConfigService) {
    if (this.route.snapshot.data['currentFiscalYear']) {
      this.currentFiscalYear = this.route.snapshot.data['currentFiscalYear'];
      this.startDate = new Date(this.currentFiscalYear.startDate);
      this.endDate = new Date(this.currentFiscalYear.endDate);
      this.fiscalYearIsOpened = this.route.snapshot.data['currentFiscalYear'].closingState === FiscalYearStateEnumerator.Open
        || this.route.snapshot.data['currentFiscalYear'].closingState === FiscalYearStateEnumerator.PartiallyClosed;
      if (!this.fiscalYearIsOpened) {
        this.growlService.warningNotification(this.translate.instant(SharedAccountingConstant.SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE));
      }
    } else {
      this.accountingConfigurationService.getJavaGenericService().getEntityList(
        AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL
      ).subscribe(data => {
        this.currentFiscalYear = data;
        this.startDate = new Date(this.currentFiscalYear.startDate);
        this.endDate = new Date(this.currentFiscalYear.endDate);
        this.fiscalYearIsOpened = data.closingState === FiscalYearStateEnumerator.Open || data.closingState === FiscalYearStateEnumerator.PartiallyClosed;
        if (!this.fiscalYearIsOpened) {
          this.growlService.warningNotification(this.translate.instant(SharedAccountingConstant.SELECTED_FISCAL_YEAR_IS_NOT_OPENED_YOU_ARE_IN_READ_MODE));
        }
      });
    }
  }

  initLetteringFilterFormGroup() {
    this.letteringFilterFormGroup = this.formBuilder.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      beginAccountId: null,
      beginAccountCode: null,
      endAccountId: null,
      endAccountCode: null,
    });
  }

  initLetteringCodeFormGroup() {
    this.letteringCodeFormGroup = this.formBuilder.group({
      letteringCode: ['AAA', [
        Validators.pattern('^[A-Z]+[A-Z]+[A-Z]'),
        Validators.minLength(NumberConstant.THREE),
        Validators.maxLength(NumberConstant.THREE),
        Validators.required
      ]]
    });
    if (!this.authService.hasAuthority(this.AccountingPermissions.PERFORM_LETTERING)) {
      this.letteringCodeFormGroup.disable();
    }
  }

  initLetteringOperationTypeFormGroup(): void {
    this.letteringOperationTypeFormGroup = this.formBuilder.group({
      letteringOperationType: [NumberConstant.ZERO, Validators.required]
    });
  }

  initAccountFilteredList() {
    this.genericAccountingService.getAccountList().then((accountList: any) => {
      this.accountFiltredList = accountList.slice(NumberConstant.ZERO).filter(element => element.literable === true);
    });
  }

  handleAddNewElementToAccountDropdown() {
    this.genericAccountingService.getAccountList().then((accountList: any) => {
      this.pageFilterService.setDefaultValueOfAccountDropdownToLastElement(accountList[accountList.length - NumberConstant.ONE], this.letteringFilterFormGroup);
      this.accountFiltredList = accountList.slice(NumberConstant.ZERO);
    });
  }

  handleChangeLetteringOperationType($event) {
    if (this.letteringOperationTypeFormGroup.valid) {
      if (this.isCurrentLetteringOperationNotStartedYet()) {
        this.switchToTheOtherLetteringOperationType();
      } else {
        this.genericAccountingService.openModalToConfirmSwitchingToAnotherOperationType()
          .then((result) => {
            if (result.value) {
              this.switchToTheOtherLetteringOperationType();
            } else {
              this.stayOnCurrentLetteringOperationType();
            }
          });
      }
    } else {
      this.stayOnCurrentLetteringOperationType();
    }
  }

  isCurrentLetteringOperationNotStartedYet() {
    return !this.isThereCheckedLines();
  }

  switchToTheOtherLetteringOperationType() {
    if (this.currentLetteringOperationType === NumberConstant.ZERO) {
      this.letteringOperationTypeFormGroup.controls['letteringOperationType'].setValue(NumberConstant.ONE);
      this.isDelettering = true;
    } else {
      this.letteringOperationTypeFormGroup.controls['letteringOperationType'].setValue(NumberConstant.ZERO);
      this.isDelettering = false;
    }
    this.currentLetteringOperationType = this.letteringOperationTypeFormGroup.value.letteringOperationType;
    this.isAutoGenerateMode = false;
    this.loadLetteringDataSourceOfChoosenAccount(this.getLetteringDataSourceUrl.bind(this), NumberConstant.ZERO, NumberConstant.ZERO);
  }

  openModalToConfirmLoadingLetteringDataSourceOfChoosenAccount(getListUrl: Function, accountPage: number, literableLinePage: number) {
    const swalWarningMessage = `${this.translate.instant(LetteringConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    this.swalWarrings.CreateSwal(swalWarningMessage, LetteringConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED, SharedConstant.YES, SharedConstant.NO)
      .then((result) => {
        if (result.value) {
          this.loadLetteringDataSourceOfChoosenAccount(getListUrl, accountPage, literableLinePage);
        }
      });
  }

  openModalToConfirmSearch() {
    const swalWarningMessage = `${this.translate.instant(LetteringConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    this.swalWarrings.CreateSwal(swalWarningMessage, LetteringConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED, SharedConstant.YES, SharedConstant.NO)
      .then((result) => {
        if (result.value) {
          this.isAutoGenerateMode = false;
          this.loadLetteringDataSourceOfChoosenAccount(this.getLetteringDataSourceUrl.bind(this), NumberConstant.ZERO, NumberConstant.ZERO);
        }
      });
  }

  stayOnCurrentLetteringOperationType() {
    this.letteringOperationTypeFormGroup.controls['letteringOperationType'].setValue(this.currentLetteringOperationType);
  }

  search() {
    if (this.isCurrentLetteringOperationNotStartedYet()) {
      this.initDocumentAccountLinesDataSource();
    } else {
      this.openModalToConfirmSearch();
    }
  }

  public autoGenerateLetterToLiterableDocumentAccountLine() {
    this.isAutoGenerateMode = true;
    this.gridSettings.state.sort = [];
    this.handleLoadLetteringDataSourceOfChoosenAccount(this.getAutoGeneratedLetteringDataSourceUrl.bind(this), this.accountPage, this.literableLinePage);
  }

  resetToFirstPage() {
    this.literableLinePage = NumberConstant.ZERO;
    this.gridSettings.state.skip = this.literableLinePage;
  }

  onChangeLinesPage(event: PageChangeEvent) {
    let oldPageSize = this.literableLinePageSize;
    let newPageSize = event.take;
    this.literableLinePage = (event.skip) / this.literableLinePageSize;
    this.literableLinePageSize = event.take;
    if (this.isAutoGenerateMode) {
      if (oldPageSize === newPageSize) {
        this.loadNextPageOfChoosenAccount(this.getAutoGeneratedLetteringDataSourceUrl.bind(this), this.accountPage, this.literableLinePage);
      } else {
        this.loadLetteringDataSourceOfChoosenAccount(this.getAutoGeneratedLetteringDataSourceUrl.bind(this), this.accountPage, this.literableLinePage);
      }
    } else {
      this.loadNextPageOfChoosenAccount(this.getLetteringDataSourceUrl.bind(this), this.accountPage, this.literableLinePage);
    }
  }

  initDocumentAccountLinesDataSource() {
    this.findDocumentAccountLinesForAFirstLiterableAccount();
  }

  findDocumentAccountLinesForAFirstLiterableAccount() {
    this.isAutoGenerateMode = false;
    this.handleLoadLetteringDataSourceOfChoosenAccount(this.getLetteringDataSourceUrl.bind(this), NumberConstant.ZERO, NumberConstant.ZERO);
  }

  findDocumentAccountLinesForAPreviousLiterableAccount() {
    this.isAutoGenerateMode = false;
    this.handleLoadLetteringDataSourceOfChoosenAccount(this.getLetteringDataSourceUrl.bind(this), this.accountPage - NumberConstant.ONE, NumberConstant.ZERO);
  }

  findDocumentAccountLinesForANextLiterableAccount() {
    this.isAutoGenerateMode = false;
    this.handleLoadLetteringDataSourceOfChoosenAccount(this.getLetteringDataSourceUrl.bind(this), this.accountPage + NumberConstant.ONE, NumberConstant.ZERO);
  }

  findDocumentAccountLinesForALastLiterableAccount() {
    this.isAutoGenerateMode = false;
    this.handleLoadLetteringDataSourceOfChoosenAccount(this.getLetteringDataSourceUrl.bind(this),
      this.letteringDataSource.totalElementsOfAccounts - NumberConstant.ONE, NumberConstant.ZERO);
  }

  updatePageParameter(accountPage: number, literableLinePage: number) {
    this.gridSettings.state.skip = literableLinePage * this.literableLinePageSize;
    this.accountPage = accountPage;
    this.literableLinePage = literableLinePage;
  }

  public generateLetterCode() {
    if (this.authService.hasAuthority(this.AccountingPermissions.PERFORM_LETTERING) && !this.isDelettering) {
      this.letteringService.getJavaGenericService().getEntityList(
        `${LetteringConstant.GENERATE_LETTER_CODE}`)
        .subscribe(literableDocumentAccountLineDto => {
          this.letteringCodeFormGroup.controls['letteringCode'].setValue(literableDocumentAccountLineDto.letter);
      });
    }
  }

  handleLoadLetteringDataSourceOfChoosenAccount(getListUrl: Function, accountPage: number, literableLinePage: number) {
    if (this.isCurrentLetteringOperationNotStartedYet()) {
      this.loadLetteringDataSourceOfChoosenAccount(getListUrl, accountPage, literableLinePage);
    } else {
      this.openModalToConfirmLoadingLetteringDataSourceOfChoosenAccount(getListUrl, accountPage, literableLinePage);
    }
  }

  loadNextPageOfChoosenAccount(getListUrl: Function, accountPage: number, literableLinePage: number) {
    this.updatePageParameter(accountPage, literableLinePage);
    this.generateLetterCode();
    this.letteringService.getJavaGenericService().getEntityList(getListUrl())
      .subscribe(data => {

        this.letteringDataSource = data;

        this.selectedKeys = [];
        if (this.isAutoGenerateMode) {
          this.handleLoadNextPageOfChoosenAccountIfIsAutoGenerateMode();
        } else {
          if (this.isDelettering) {
            this.handleLoadNextPageOfChoosenAccountIfIsDelettringOperation();
          } else {
            this.handleLoadNextPageOfChoosenAccountIfIsLettringOperation();
          }
        }
        this.oldSizeOfSelectedKeys = this.selectedKeys.length;
        this.oldSelectedKeys = [];
        this.selectedKeys.forEach(key => this.oldSelectedKeys.push(key));
        this.gridSettings.gridData = {
          data: this.letteringDataSource.content,
          total: this.letteringDataSource.totalElementsOfDocumentAccountLinesPerAccount
        };
      });
  }

  private isMoreThanLineSelectedAtATime() {
    return (this.selectedKeys.length - this.oldSizeOfSelectedKeys) > 1;
  }

  private isMoreThanLineDeselectedAtATime() {
    return (this.oldSizeOfSelectedKeys - this.selectedKeys.length) > 1;
  }

  private handleLoadNextPageOfChoosenAccountIfIsAutoGenerateMode() {
    if (!this.literableLinePageListIfIsAutoGenerateMode.includes(this.literableLinePage)) {
      this.literableLinePageListIfIsAutoGenerateMode.push(this.literableLinePage);
      this.letteringDataSource.content.filter(letteringLine => letteringLine.letter !== null).forEach(letteringLine => {
        this.keepedDocumentAccountLines.push(letteringLine);
        this.selectedKeys.push(letteringLine.id);
      });
    } else {
      this.letteringDataSource.content.forEach(letteringLine => {
        if (this.keepedDocumentAccountLines.map(line => line.id).includes(letteringLine.id)) {
          this.selectedKeys.push(letteringLine.id);
          letteringLine.letter = this.keepedDocumentAccountLines.find(line => line.id === letteringLine.id).letter;
        } else {
          letteringLine.letter = null;
        }
      });
    }
  }

  private handleLoadNextPageOfChoosenAccountIfIsLettringOperation() {
    this.keepedDocumentAccountLines.forEach(keepedLine => {
      this.selectedKeys.push(keepedLine.id);
      const letteringLineHavingSameId = this.letteringDataSource.content
        .find(letteringLine => keepedLine.id === letteringLine.id);
      if (letteringLineHavingSameId) {
        letteringLineHavingSameId.letter = keepedLine.letter;
      }
    });
  }

  private handleLoadNextPageOfChoosenAccountIfIsDelettringOperation() {
    this.selectedKeys = [];
    this.keepedDocumentAccountLines.forEach(keepedLine => {
      this.selectedKeys.push(keepedLine.id);
      const letteringLineHavingSameId = this.letteringDataSource.content
        .find(letteringLine => keepedLine.id === letteringLine.id);
      if (letteringLineHavingSameId) {
        letteringLineHavingSameId.letter = null;
      }
    });
  }

  loadLetteringDataSourceOfChoosenAccount(getListUrl: Function, accountPage: number, literableLinePage: number) {
    this.updatePageParameter(accountPage, literableLinePage);
    this.generateLetterCode();
    this.spinner = true;
    this.letteringService.getJavaGenericService().getEntityList(getListUrl())
      .subscribe(data => {
        this.spinner = false;
        this.setDispalyedAccountCodeAndLabel(data);
        this.letteringDataSource = data;
        this.selectedKeys = [];
        this.totalCreditAmount = this.letteringDataSource.totalCredit;
        this.totalDebitAmount = this.letteringDataSource.totalDebit;
        if (this.isAutoGenerateMode) {
          this.selectedKeys = this.letteringDataSource.content.filter(line => line.letter !== null).map(line => line.id);
          this.literableLinePageListIfIsAutoGenerateMode = [this.literableLinePage];
          this.keepedDocumentAccountLines = this.letteringDataSource.content.filter(letteringLine => letteringLine.letter !== null);
          if (!this.isThereCheckedLines()) {
            this.growlService.InfoNotification(this.translate.instant(LetteringConstant.NO_LINE_WAS_LETTERED));
            this.isAutoGenerateMode = false;
          }
        } else {
          this.keepedDocumentAccountLines = [];
        }
        this.oldSizeOfSelectedKeys = this.selectedKeys.length;
        this.oldSelectedKeys = [];
        this.selectedKeys.forEach(key => this.oldSelectedKeys.push(key));
        this.gridSettings.gridData = {
          data: this.letteringDataSource.content,
          total: this.letteringDataSource.totalElementsOfDocumentAccountLinesPerAccount
        };
      });
  }

  isThereCheckedLines(): boolean {
    return this.totalCreditAmount !== NumberConstant.ZERO || this.totalDebitAmount !== NumberConstant.ZERO;
  }

  private setDispalyedAccountCodeAndLabel(data: any) {
    if (data.content.length > NumberConstant.ZERO) {
      this.displayedAccountId = data.content[NumberConstant.ZERO].accountId;
      this.displayedCodeOfChoosenAccountCode = data.content[NumberConstant.ZERO].account.substring(NumberConstant.ZERO, NumberConstant.EIGHT);
      this.displayedLabelOfChoosenAccountCode = data.content[NumberConstant.ZERO].account.substring(NumberConstant.NINE, data.content[NumberConstant.ZERO].account.length);
    } else {
      this.displayedAccountId = 0;
      this.displayedCodeOfChoosenAccountCode = '';
      this.displayedLabelOfChoosenAccountCode = '';
    }
  }

  public onSelectedKeysChange() {
    let letteringLinesFromDataSourceToBeHandled: Array<any>;

    if (this.isUncheckedLineMode()) {

      if (this.isMoreThanLineDeselectedAtATime()) {
        letteringLinesFromDataSourceToBeHandled = this.letteringDataSource.content.filter(line => !this.selectedKeys.includes(line.id));
      } else {
        letteringLinesFromDataSourceToBeHandled = [this.letteringDataSource.content.find(line => line.id === this.oldSelectedKeys.filter(key => !this.selectedKeys.includes(key))[0])];
      }

      this.handleUncheckLineMode(letteringLinesFromDataSourceToBeHandled);

      letteringLinesFromDataSourceToBeHandled.forEach(line => {
        this.totalCreditAmount -= line.credit;
        this.totalDebitAmount -= line.debit;
      });

    } else {

      if (this.isMoreThanLineSelectedAtATime()) {
        letteringLinesFromDataSourceToBeHandled = this.letteringDataSource.content.filter(line => this.selectedKeys.includes(line.id));
        this.totalCreditAmount = 0;
        this.totalDebitAmount = 0;
      } else {
        letteringLinesFromDataSourceToBeHandled = [this.letteringDataSource.content.find(line => line.id === this.selectedKeys.filter(key => !this.oldSelectedKeys.includes(key))[0])];
      }

      this.handleCheckLineMode(letteringLinesFromDataSourceToBeHandled);

      letteringLinesFromDataSourceToBeHandled.forEach(line => {
        this.totalCreditAmount += line.credit;
        this.totalDebitAmount += line.debit;
      });

    }

    this.oldSizeOfSelectedKeys = this.selectedKeys.length;
    this.oldSelectedKeys = [];
    this.selectedKeys.forEach(key => this.oldSelectedKeys.push(key));
  }

  private handleCheckLineMode(letteringLinesFromDataSourceToBeHandled: any[]) {
    if (this.isDelettering) {
      if (!this.isMoreThanLineSelectedAtATime()) {
        this.handleCheckLineModeIfIsDeletteringOperation(letteringLinesFromDataSourceToBeHandled[NumberConstant.ZERO]);
      } else {
        this.handleCheckLineModeIfIsDeletteringOperationAndIsMoreLineChecked(letteringLinesFromDataSourceToBeHandled);
      }
    } else {
      this.handleCheckLineModeIfIsLetteringOperation(letteringLinesFromDataSourceToBeHandled);
    }
  }

  private handleUncheckLineMode(letteringLinesFromDataSourceToBeHandled: any[]) {
    if (this.isDelettering) {
      if (!this.isMoreThanLineDeselectedAtATime()) {
        this.handleUncheckLineModeIfIsDeletteringOperation(letteringLinesFromDataSourceToBeHandled[NumberConstant.ZERO]);
      } else {
        this.handleUncheckLineModeIfIsDeletteringOperationAndIsMoreLineChecked(letteringLinesFromDataSourceToBeHandled);
      }
    } else {
      this.handleUncheckLineModeIfIsLetteringOperation(letteringLinesFromDataSourceToBeHandled);
    }
  }

  private handleCheckLineModeIfIsDeletteringOperationAndIsMoreLineChecked(letteringLinesFromDataSourceToBeHandled: Array<any>) {
    letteringLinesFromDataSourceToBeHandled.forEach(lineToKeep => {
      this.keepedDocumentAccountLines.push(
        new LiterableDocumentAccountLine(lineToKeep.id, lineToKeep.account, lineToKeep.letter, lineToKeep.credit, lineToKeep.debit, lineToKeep.documentAccount)
      );
    });
  }

  handleUncheckLineModeIfIsDeletteringOperationAndIsMoreLineChecked(letteringLinesFromDataSourceToBeHandled: Array<any>) {
    letteringLinesFromDataSourceToBeHandled.forEach(keepedLineToDelete => {
      this.keepedDocumentAccountLines.splice(this.keepedDocumentAccountLines.indexOf(letteringLinesFromDataSourceToBeHandled.find(line => line.id === keepedLineToDelete.id)), NumberConstant.ONE);
    });
  }

  private handleCheckLineModeIfIsDeletteringOperation(letteringLineFromDataSourceToBeHandled: any) {
    this.keepedDocumentAccountLines.push(new LiterableDocumentAccountLine(letteringLineFromDataSourceToBeHandled.id,
      letteringLineFromDataSourceToBeHandled.account, letteringLineFromDataSourceToBeHandled.letter, letteringLineFromDataSourceToBeHandled.credit,
      letteringLineFromDataSourceToBeHandled.debit, letteringLineFromDataSourceToBeHandled.documentAccount));
    this.letteringDataSource.content.filter(line => (line.letter === letteringLineFromDataSourceToBeHandled.letter && line.id !== letteringLineFromDataSourceToBeHandled.id))
      .forEach(lineToKeep => {
        this.keepedDocumentAccountLines.push(
          new LiterableDocumentAccountLine(lineToKeep.id, lineToKeep.account, lineToKeep.letter, lineToKeep.credit, lineToKeep.debit, lineToKeep.documentAccount)
        );
        this.selectedKeys.push(lineToKeep.id);
        this.totalCreditAmount += lineToKeep.credit;
        this.totalDebitAmount += lineToKeep.debit;
      });
  }

  private handleUncheckLineModeIfIsDeletteringOperation(letteringLineFromDataSourceToBeHandled: any) {
    this.letteringDataSource.content.filter(line => (line.letter === letteringLineFromDataSourceToBeHandled.letter && line.id !== letteringLineFromDataSourceToBeHandled.id))
      .forEach(line => {
        let keepedLineToDelete = this.keepedDocumentAccountLines.find(keepedLine => keepedLine.id === line.id);
        this.keepedDocumentAccountLines.splice(this.keepedDocumentAccountLines.indexOf(keepedLineToDelete), NumberConstant.ONE);
        this.selectedKeys.splice(this.selectedKeys.indexOf(keepedLineToDelete.id), NumberConstant.ONE);
        this.totalCreditAmount -= keepedLineToDelete.credit;
        this.totalDebitAmount -= keepedLineToDelete.debit;
      });
    let keepedLineToDelete = this.keepedDocumentAccountLines.find(keepedLine => keepedLine.id === letteringLineFromDataSourceToBeHandled.id);
    this.keepedDocumentAccountLines.splice(this.keepedDocumentAccountLines.indexOf(keepedLineToDelete), NumberConstant.ONE);
  }

  private handleCheckLineModeIfIsLetteringOperation(letteringLinesFromDataSourceToBeHandled: Array<any>) {
    letteringLinesFromDataSourceToBeHandled.forEach(lineToKeep => {
      lineToKeep.letter = this.letteringCodeFormGroup.value.letteringCode;
      this.keepedDocumentAccountLines.push(lineToKeep);
    });
  }

  private handleUncheckLineModeIfIsLetteringOperation(letteringLinesFromDataSourceToBeHandled: Array<any>) {
    letteringLinesFromDataSourceToBeHandled.forEach(line => {
      const keepedLineToDelete = this.keepedDocumentAccountLines.find(keepedLine => keepedLine.id === line.id);
      this.keepedDocumentAccountLines.splice(this.keepedDocumentAccountLines.indexOf(keepedLineToDelete), NumberConstant.ONE);
      line.letter = null;
    });
  }

  private isUncheckedLineMode() {
    return this.selectedKeys.length < this.oldSizeOfSelectedKeys;
  }

  public save() {
    const dataToSave = [];
    this.keepedDocumentAccountLines.forEach(keepedLine => {
      dataToSave.push(keepedLine);
    });
    if (!this.isDelettering) {
      this.saveLettersToSelectedLinesIfLettering(dataToSave);
    } else {
      this.removeLettersFromSelectedLinesIfDelettering(dataToSave);
    }
  }

  public saveLettersToSelectedLinesIfLettering(dataToSave: any) {
    if (this.isAutoGenerateMode && !this.hasAllLiterableLinePagesPerAccountBeenVisited()) {
      this.growlService.InfoNotification(this.translate.instant(LetteringConstant.YOU_MUST_VISIT_ALL_PAGES_BEFORE_SAVE));
    } else {
      this.letteringService.getJavaGenericService().saveEntity(dataToSave)
        .subscribe(data => {
          this.successOperation();
        });
    }
  }

  public hasAllLiterableLinePagesPerAccountBeenVisited(): boolean {
    return this.literableLinePageSize * (this.literableLinePageListIfIsAutoGenerateMode.length - NumberConstant.ONE) + NumberConstant.ONE <=
      this.letteringDataSource.totalElementsOfDocumentAccountLinesPerAccount &&
      this.letteringDataSource.totalElementsOfDocumentAccountLinesPerAccount <= this.literableLinePageSize * this.literableLinePageListIfIsAutoGenerateMode.length;
  }

  public removeLettersFromSelectedLinesIfDelettering(dataToSave: any) {
    this.letteringService.getJavaGenericService().sendData(LetteringConstant.REMOVE_LETTER_FROM_DESELECTED_DOCUMENT_ACCOUNT_LINE, dataToSave)
      .subscribe(data => {
        this.successOperation();
      });
  }

  successOperation() {
    this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
    this.resetToFirstPage();
    this.isAutoGenerateMode = false;
    this.loadLetteringDataSourceOfChoosenAccount(this.getLetteringDataSourceUrl.bind(this), this.accountPage, this.literableLinePage);
  }

  initLetteringOperationTypeData() {
    this.letteringOperationTypeData = [{
      text: this.translate.instant(LetteringConstant.LETTERING),
      letteringOperationType: NumberConstant.ZERO
    }, {
      text: this.translate.instant(LetteringConstant.DELETTERING),
      letteringOperationType: NumberConstant.ONE
    }];
  }

  getLetteringDataSourceUrl() {
    this.initSortDataGrid();
    const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.letteringFilterFormGroup);
    const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.letteringFilterFormGroup);
    return `${LetteringConstant.GET_DOCUMENT_ACCOUNT_LINES_FOR_LITERABLE_ACCOUNT}` +
      `?accountPage=${this.accountPage}&literableLinePage=${this.literableLinePage}` +
      `&literableLinePageSize=${this.literableLinePageSize}&havingLetteredLines=${this.isDelettering}` +
      `&beginAccountCode=${this.letteringFilterFormGroup.value.beginAccountCode}` +
      `&endAccountCode=${this.letteringFilterFormGroup.value.endAccountCode}&sameAmount=${this.sameAmount}` +
      `&startDate=${startDate}&endDate=${endDate}&field=${this.sortParams.field}&direction=${this.sortParams.direction}`;
  }

  getAutoGeneratedLetteringDataSourceUrl() {
    const startDate = this.pageFilterService.getStartDateToUseInPageFilter(this.letteringFilterFormGroup);
    const endDate = this.pageFilterService.getEndDateToUseInPageFilter(this.letteringFilterFormGroup);
    return `${LetteringConstant.AUTO_GENERATE_LETTER_TO_LITERABLE_DOCUMENT_ACCOUNT_LINE}` +
      `?accountPage=${this.accountPage}&literableLinePage=${this.literableLinePage}` +
      `&literableLinePageSize=${this.literableLinePageSize}` +
      `&beginAccountCode=${this.letteringFilterFormGroup.value.beginAccountCode}` +
      `&endAccountCode=${this.letteringFilterFormGroup.value.endAccountCode}` +
      `&startDate=${startDate}&endDate=${endDate}`;
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(this.isLetteringFormChanged.bind(this));
  }

  private isLetteringFormChanged(): boolean {
    return !this.isCurrentLetteringOperationNotStartedYet();
  }

  onSelectBeginAccount(event) {
    this.genericAccountingService.setCodeOnSelectAccount(event, 'beginAccountCode',
      this.letteringFilterFormGroup);
  }

  onSelectEndAccount(event) {
    this.genericAccountingService.setCodeOnSelectAccount(event, 'endAccountCode',
      this.letteringFilterFormGroup);
  }

  handleFilterAccount(writtenValue: string) {
    this.accountFiltredList = this.genericAccountingService.handleFilterAccount(writtenValue)
      .filter(element => element.literable === true);
  }

  addNewBeginAccount() {
    this.pageFilterService.addNewBeginAccount(this.viewRef, this.handleAddNewElementToAccountDropdown.bind(this));
  }

  addNewEndAccount() {
    this.pageFilterService.addNewEndAccount(this.viewRef, this.handleAddNewElementToAccountDropdown.bind(this));
  }

  handleAccountKeyAction() {
    const inputBeginAccount = document.getElementById('beginAccountInput');
    const inputEndAccount = document.getElementById('endAccountInput');
    this.beginAccountkeyAction = (event) => {
      this.genericAccountingService.handleKeyAction(event, this.letteringFilterFormGroup, 'beginAccountId', 'beginAccountCode');
    };
    this.endAccountkeyAction = (event) => {
      this.genericAccountingService.handleKeyAction(event, this.letteringFilterFormGroup, 'endAccountId', 'endAccountCode');
    };
    inputBeginAccount.addEventListener(SearchConstant.KEY_DOWN, this.beginAccountkeyAction);
    inputEndAccount.addEventListener(SearchConstant.KEY_DOWN, this.endAccountkeyAction);
  }

  selectionChangeAccountDropdown($event) {
    this.genericAccountingService.selectionChangeAccountDropdown($event);
  }

  redirectTo(dataItem) {
    const url = this.router.serializeUrl(this.router.createUrlTree(
      [DocumentAccountConstant.DOCUMENT_ACCOUNT_EDIT_URL.concat(dataItem.documentAccount)],
      {queryParams: {id: dataItem.id}}));
    window.open(url, '_blank');
  }

  refreshLetteringInterface() {
    if (this.isAutoGenerateMode) {
      this.refreshLetteringLinesIfIsAutoGenerateMode();
    } else {
      this.refreshLetteringLinesIfIsManualMode();
    }
  }

  private refreshLetteringLinesIfIsManualMode() {
    this.letteringService.getJavaGenericService().getEntityList(this.getLetteringDataSourceUrl())
      .subscribe(newData => {
        this.refreshLetteringLines(newData);
      });
  }

  private refreshLetteringLinesIfIsAutoGenerateMode() {
    this.letteringService.getJavaGenericService().getEntityList(this.getAutoGeneratedLetteringDataSourceUrl())
      .subscribe(newData => {
        this.refreshLetteringLines(newData);
      });
  }

  private refreshLetteringLines(newData: any) {
    this.letteringDataSource.content.forEach(oldLetteringLine => {
      const newLetteringLineHavingSameId = newData.content.find(line => line.id === oldLetteringLine.id);
      const indexOfOldLetteringLine = this.letteringDataSource.content.indexOf(oldLetteringLine);
      if (newLetteringLineHavingSameId) {
        newLetteringLineHavingSameId.letter = oldLetteringLine.letter;
        if (this.selectedKeys.includes(newLetteringLineHavingSameId.id)) {
          this.totalCreditAmount += newLetteringLineHavingSameId.credit - oldLetteringLine.credit;
          this.totalDebitAmount += newLetteringLineHavingSameId.debit - oldLetteringLine.debit;
        }
        this.letteringDataSource.content[indexOfOldLetteringLine] = newLetteringLineHavingSameId;
      }
    });
  }

  private setSelectedCurrency(currency: ReducedCurrency) {
    this.purchasePrecision = currency.Precision;
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  getCurrentCurrency() {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency)=> {
      this.setSelectedCurrency(currency);
      this.currencyCode = currency.Code;
    });
  }

  handleFilterChange(writtenValue) {
    this.letteringOperationTypeData = this.letteringOperationTypeDataFilter.filter((s) =>
      s.text.toLowerCase().includes(writtenValue.toLowerCase())
      || s.text.toLocaleLowerCase().includes(writtenValue.toLowerCase())
    );
  }

  ngOnInit() {
    this.getCurrentCurrency();

    this.initAccountFilteredList();

    this.initLetteringFilterFormGroup();

    this.initLetteringCodeFormGroup();
    this.initLetteringOperationTypeFormGroup();

    this.pageFilterService.initFormDatesThroughCurrentFiscalYear(this.letteringFilterFormGroup, this.initDocumentAccountLinesDataSource.bind(this),
      SharedAccountingConstant.START_DATE_ACCOUNTING, SharedAccountingConstant.END_DATE_ACCOUNTING, this.currentFiscalYear);

    this.handleAccountKeyAction();
  }

  public sortChange() {
    this.initSortDataGrid();
    this.isAutoGenerateMode = false;
    this.handleLoadLetteringDataSourceOfChoosenAccount(this.getLetteringDataSourceUrl.bind(this), this.accountPage, NumberConstant.ZERO);
  }

  initSortDataGrid() {
    if (this.gridSettings.state.sort && this.gridSettings.state.sort.length > 0) {
      this.sortParams = {
        field: this.gridSettings.state.sort[NumberConstant.ZERO].field,
        direction: this.gridSettings.state.sort[NumberConstant.ZERO].dir === undefined ? '' : this.gridSettings.state.sort[NumberConstant.ZERO].dir
      };
    } else {
      this.sortParams = {
        field: '',
        direction: ''
      };
    }
  }

  ngAfterViewInit(): void {
    this.initLetteringOperationTypeData();
    this.letteringOperationTypeDataFilter = this.letteringOperationTypeData;
  }

  public goToHistoric() {
    this.router.navigateByUrl(LetteringConstant.LETTERING_HISTORY_URL.concat(this.displayedAccountId.toString()));
  }

  public getFooterClass() {
  return this.styleConfigService.getFooterClassLayoutAddComponent();
  }
}
