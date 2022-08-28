import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {TranslateService} from '@ngx-translate/core';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TemplateAccountingConstant} from '../../../constant/accounting/template.constant';
import {TemplateAccountingService} from '../../services/template/template.service';
import {TemplateDetails} from '../../../models/accounting/templateDetails.model';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {SearchConstant} from '../../../constant/search-item';
import {DocumentAccountService} from '../../services/document-account/document-account.service';
import {AccountsConstant} from '../../../constant/accounting/account.constant';
import {AddAccountComponent} from '../../account/add-account/add-account.component';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {DocumentAccountConstant} from '../../../constant/accounting/document-account.constant';
import {KeyboardConst} from '../../../constant/keyboard/keyboard.constant';
import {GridComponent} from '@progress/kendo-angular-grid';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';
import {Currency} from '../../../models/administration/currency.model';
import {CompanyService} from '../../../administration/services/company/company.service';
import {Subscription} from 'rxjs/Subscription';
import {AccountingConfigurationService} from '../../services/configuration/accounting-configuration.service';
import {Observable} from 'rxjs/Observable';
import {NumberFormatOptions} from '@progress/kendo-angular-intl';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-template-account-add',
  templateUrl: './template-accounting-add.component.html',
  styleUrls: ['./template-accounting-add.component.scss'],
})
export class TemplateAccountingAddComponent implements OnInit, OnDestroy, AfterViewInit, IModalDialog {
  public keyAction;

  public dialogOptions: Partial<IModalDialogOptions<any>>;

  public accountFiltredList: any;

  public journalFiltredList: any;

  public isUpdateMode: boolean;

  private editedRowIndex: number;

  public templateAccountingDetailsForm: FormGroup;

  public currentExerciceStartDate: Date = new Date();

  public currentExerciceEndDate: Date = new Date();

  public accountList: any;

  public value: any;

  public showAddAcount = true;

  @ViewChild(GridComponent) public grid: GridComponent;

  @ViewChild('templateAccountinglabel') templateAccountingLabel: ElementRef;

  private templateAccountingIdOnUpdate: number;

  public templateAccountingFormGroup: FormGroup;

  public accountDropDownIsInEditingMode = false;

  public accountDropDownIsInRemoveMode = false;

  public isModalOption: boolean;

  public isNew = true;

  public rowIndex = -1;

  public sender: any;

  // number format
  public formatNumberOptions: NumberFormatOptions;
  purchasePrecision: number;

  public minAmountNumber = 0;

  public maxAmountNumber = AccountingConfigurationConstant.MAX_AMOUNT_NUMBER;

  public minLength = AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH;

  public maxLength = AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH;

  private subscription: Subscription;

  public isSaveOperation: boolean;

  public showDelay = SharedAccountingConstant.SHOW_TOOLTIP_DELAY;

  public templateAccountingDetails: Array<{
    id: number, accountId: number, codeAccount: number, nameAccount: string, label: string,
    debitAmount: number, creditAmount: number
  }> = [];

  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: TemplateAccountingConstant.ACCOUNT_CODE_FIELD,
      title: TemplateAccountingConstant.ACCOUNT_CODE_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: TemplateAccountingConstant.ACCOUNT_NAME_FIELD,
      title: TemplateAccountingConstant.ACCOUNT_NAME_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: TemplateAccountingConstant.LABEL_FIELD,
      title: TemplateAccountingConstant.LABEL_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: DocumentAccountConstant.DEBIT_AMOUNT_FIELD,
      title: DocumentAccountConstant.TOTAL_DEBIT_AMOUNT_TITLE,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: DocumentAccountConstant.CREDIT_AMOUNT_FIELD,
      title: DocumentAccountConstant.TOTAL_CREDIT_AMOUNT_TITLE,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;

  constructor(private templateAccountingService: TemplateAccountingService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private validationService: ValidationService,
              private translate: TranslateService,
              private growlService: GrowlService,
              private viewRef: ViewContainerRef,
              private modalService: ModalDialogInstanceService,
              private genericAccountingService: GenericAccountingService,
              private documentAccountService: DocumentAccountService,
              private formModalDialogService: FormModalDialogService,
              private companyService: CompanyService,
              private accountingConfigurationService: AccountingConfigurationService,
              private styleConfigService: StyleConfigService,
              private authService: AuthService
  ) {}

  handleFilterAccount(writtenValue) {
    this.accountFiltredList = this.documentAccountService.handleFilterAccount(writtenValue);
  }

  selectionChangeAccountDropdown($event) {
    this.documentAccountService.selectionChangeAccountDropdown($event);
  }

  public setLabelOnSelectAccount(event): void {
    this.genericAccountingService.setLabelOnSelectAccount(event, 'nameAccount',
      this.templateAccountingDetailsForm);
  }

  setDefaultValueOfJournalDropdownToLastElement(lastElement: any) {
    this.templateAccountingFormGroup.controls['journalId'].setValue(lastElement.id);
  }

  setDefaultValueOfAccountDropdownToLastElement(lastElement: any) {
    this.templateAccountingDetailsForm.controls['accountId'].setValue(lastElement.id);
    this.templateAccountingDetailsForm.controls['nameAccount'].setValue(lastElement.label);
  }

  addNewJournal() {
    this.genericAccountingService.openAddJournalModal(this.viewRef, this.handleAddNewElementToJournalDropdown.bind(this));
  }

  addNewAccount() {
    const modalTitle = this.translate.instant(AccountsConstant.ADD_NEW_ACCOUNT);
    this.formModalDialogService.openDialog(modalTitle, AddAccountComponent,
      this.viewRef, this.handleAddNewElementToAccountDropdown.bind(this),
      {'planCode': undefined}, null, SharedConstant.MODAL_DIALOG_SIZE_L);
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

  initJournalFilteredList() {
    this.genericAccountingService.getJournalList().then((journalList: any) => {
      this.journalFiltredList = journalList.slice(0);
    });
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
        this.accountList = accountList.slice(NumberConstant.ZERO);
        this.accountFiltredList = accountList.slice(NumberConstant.ZERO);
      }
    });
  }

  private createTemplateAccountingDetailsForm(templateDetails?: TemplateDetails): void {
    this.templateAccountingDetailsForm = new FormGroup({
      'accountId': new FormControl(templateDetails.accountId, Validators.required),
      'nameAccount': new FormControl({value: templateDetails.nameAccount, disabled: true}),
      'documentLineDate': new FormControl(new Date(templateDetails.documentLineDate)),
      'label': new FormControl(templateDetails.label, [Validators.required,
        Validators.minLength(AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH),
        Validators.maxLength(AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH)]),
      'debitAmount': new FormControl(+(templateDetails.debitAmount), Validators.required),
      'creditAmount': new FormControl(+(templateDetails.creditAmount), Validators.required)
    });
  }

  public addHandler({sender}) {
    if (!this.accountDropDownIsInEditingMode) {
      this.closeEditor(sender);
      this.templateAccountingDetailsForm.controls['label'].setValue(this.templateAccountingFormGroup.value.label);
      this.templateAccountingDetailsForm.patchValue({
        'accountId': null,
        'nameAccount': null,
        'debitAmount': NumberConstant.ZERO,
        'creditAmount': NumberConstant.ZERO
      });
      this.templateAccountingDetailsForm.markAsTouched();
      sender.addRow(this.templateAccountingDetailsForm);
      this.accountDropDownIsInEditingMode = true;
    }
  }

  public lineClickHandler({sender, rowIndex, dataItem}) {
    if (this.hasAuthorityAddOrUpdate()) {
      this.accountFiltredList = this.accountList;
      if (rowIndex !== -1) {
        this.isNew = false;
      }
      this.rowIndex = rowIndex;
      this.sender = sender;
      if (!this.accountDropDownIsInEditingMode && !this.accountDropDownIsInRemoveMode) {
        this.closeEditor(sender);
        this.createTemplateAccountingDetailsForm(new TemplateDetails(dataItem));
        this.editedRowIndex = rowIndex;
        this.templateAccountingDetailsForm.markAsTouched();
        sender.editRow(rowIndex);
        this.accountDropDownIsInEditingMode = true;
      } else {
        this.accountDropDownIsInRemoveMode = false;
      }
    }
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    this.checkDebitOrCreditEmpty();
    if (this.templateAccountingDetailsForm.valid) {
      const account = this.accountFiltredList.filter(c => c.id === this.templateAccountingDetailsForm.controls['accountId'].value)[0];
      if (isNew) {
        this.templateAccountingDetails.unshift({
          'id': undefined,
          'accountId': formGroup.value.accountId,
          'codeAccount': account.code,
          'nameAccount': account.label,
          'label': formGroup.value.label,
          'debitAmount': formGroup.value.debitAmount,
          'creditAmount': formGroup.value.creditAmount
        });
        this.grid.closeRow(rowIndex);
      } else {
        this.templateAccountingDetails[rowIndex].accountId = this.templateAccountingDetailsForm.controls['accountId'].value;
        this.templateAccountingDetails[rowIndex].label = this.templateAccountingDetailsForm.controls['label'].value;
        this.templateAccountingDetails[rowIndex].debitAmount = this.templateAccountingDetailsForm.controls['debitAmount'].value;
        this.templateAccountingDetails[rowIndex].creditAmount = this.templateAccountingDetailsForm.controls['creditAmount'].value;
        if (account !== undefined) {
          this.templateAccountingDetails[rowIndex].codeAccount = account.code;
          this.templateAccountingDetails[rowIndex].nameAccount = account.label;
        }
        this.grid.closeRow(rowIndex);
      }
      this.accountDropDownIsInEditingMode = false;
    } else {
      this.validationService.validateAllFormFields(this.templateAccountingDetailsForm);
    }
  }

  public removeHandler({dataItem}) {
    const index: number = this.templateAccountingDetails.indexOf(dataItem);
    this.templateAccountingDetails.splice(index, 1);
    this.accountDropDownIsInRemoveMode = true;
    this.templateAccountingDetailsForm.markAsTouched();
  }

  private closeEditor(grid: { closeRow: (arg0: number) => void; }, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
    }
    this.accountDropDownIsInEditingMode = false;
  }

  public saveTemplateClick() {
    const form = this.templateAccountingFormGroup.getRawValue();
    if (this.isUpdateMode) {
      form.id = this.templateAccountingIdOnUpdate;
    }
    if (this.templateAccountingFormGroup.valid && !this.accountDropDownIsInEditingMode) {
      this.isSaveOperation = true;
      this.templateAccountingService.getJavaGenericService().saveEntity(form)
        .subscribe(() => {
          this.showSuccessMessage();
        });
    } else {
      this.validationService.validateAllFormFields(this.templateAccountingFormGroup);
    }
  }

  showSuccessMessage() {
    this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
    if (this.isOpenDialogMode()) {
      this.dialogOptions.onClose();
      this.modalService.closeAnyExistingModalDialog();
    } else {
      this.router.navigateByUrl(TemplateAccountingConstant.TEMPLATE_URL);
    }
  }

  handleFilterJournal(writtenValue): void {
    this.journalFiltredList = this.genericAccountingService.getJournalFilteredListByWrittenValue(writtenValue);
  }

  setTemplateAccountingFormGroup(label: string, journalId: number, templateAccountingDetails: any) {
    this.templateAccountingFormGroup.controls['label'].setValue(label);
    this.templateAccountingFormGroup.controls['journalId'].setValue(journalId);
    this.templateAccountingFormGroup.controls['templateAccountingDetails'].setValue(templateAccountingDetails);

  }

  loadTemplateAccountingOnUpdate() {
    this.templateAccountingService.getJavaGenericService().getEntityById(this.templateAccountingIdOnUpdate)
      .subscribe(dataAccount => {
        this.genericAccountingService.getAccountList().then((accountList: any) => {
          this.accountList = accountList;
          this.accountFiltredList = accountList.slice(0);
          dataAccount.templateAccountingDetails.forEach(templateAccountingDetail => {
            this.templateAccountingDetails.push({
              'id': templateAccountingDetail.id,
              'accountId': templateAccountingDetail.accountId,
              'codeAccount': accountList.find(accountElement => accountElement.id === templateAccountingDetail.accountId).code,
              'nameAccount': accountList.find(accountElement => accountElement.id === templateAccountingDetail.accountId).label,
              'label': templateAccountingDetail.label,
              'debitAmount': templateAccountingDetail.debitAmount,
              'creditAmount': templateAccountingDetail.creditAmount
            });
          });
        });
        this.setTemplateAccountingFormGroup(dataAccount.label, dataAccount.journalId, this.templateAccountingDetails);
        if(!this.authService.hasAuthority(this.AccountingPermissions.UPDATE_ACCOUNTING_TEMPLATE)){
          this.templateAccountingFormGroup.disable();
        }
      });
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModalOption = true;
    this.setJournalId(this.dialogOptions);
    this.showAddAcount = this.dialogOptions.data.addNewAccountHidden;
  }

  isOpenDialogMode() {
    return this.dialogOptions !== undefined;
  }

  handleKeyAction() {
    if (this.showAddAcount) {
      this.keyAction = (event) => {
        this.documentAccountService.handleKeyAction(event,
          this.templateAccountingDetailsForm, this.viewRef, this.handleAddNewElementToAccountDropdown.bind(this), true);
        if (event.code === KeyboardConst.ENTER || event.code === KeyboardConst.NUMPAD_ENTER) {
          this.keyEnterAction(this.sender, this.templateAccountingDetailsForm, event);
        }
        if (event.code === KeyboardConst.NUMPAD_ADD) {
          const sender = this.grid;
          this.addHandler({sender});
        }

      };
      document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);
    }
  }

  initTemplateAccountingFormGroup() {
    this.templateAccountingFormGroup = new FormGroup({
      'label': new FormControl(undefined, [Validators.required,
        Validators.minLength(AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH),
        Validators.maxLength(AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH)]),
      'journalId': new FormControl(undefined, Validators.required),
      'templateAccountingDetails': new FormControl(this.templateAccountingDetails),
    });
  }

  changeCreditAmount($event) {
    if ($event.target.value > 0) {
      this.templateAccountingDetailsForm.patchValue({'creditAmount': null});
    }
  }

  changeDebitAmount($event) {
    if ($event.target.value > 0) {
      this.templateAccountingDetailsForm.patchValue({'debitAmount': null});
    }
  }

  keyEnterAction(sender: GridComponent, formGroup: any, e: any) {
    const rowIndex = this.rowIndex;
    const isNew = this.isNew;
    this.sender = sender;

    if (!this.templateAccountingDetailsForm || !this.templateAccountingDetailsForm.valid ||
      (e.key !== KeyboardConst.ENTER && e.key !== KeyboardConst.NUMPAD_ENTER)) {
      return;
    }
    this.isNew = true;
    this.addHandler({sender});
  }
  
  keyEnterSaveAction(sender: GridComponent, formGroup: any, e: any) {
    const rowIndex = this.rowIndex;
    const isNew = this.isNew;
    this.sender = sender;

    if (!this.templateAccountingDetailsForm || !this.templateAccountingDetailsForm.valid || e.key !== KeyboardConst.ENTER) {
      return;
    }
   this.isNew = true;
    this.saveHandler({sender,rowIndex, formGroup ,isNew});
  }

  /*get current currency  */
  private setSelectedCurrency(currency: ReducedCurrency) {
    this.purchasePrecision = currency.Precision;
    this.formatNumberOptions = {
      style: 'decimal',
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }

  public initTemplateDateForm() {
    this.subscription = this.accountingConfigurationService.getJavaGenericService().getEntityList(
      AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL
    ).subscribe(data => {
      this.currentExerciceStartDate = new Date(data.startDate);
      this.currentExerciceEndDate = new Date(data.endDate);
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.closeEditor(this.grid);
    this.grid.closeRow(-1);
  }

  private checkDebitOrCreditEmpty() {
    if (this.templateAccountingDetailsForm.value.debitAmount === null) {
      this.templateAccountingDetailsForm.controls['debitAmount'].setValue(0);
    }
    if (this.templateAccountingDetailsForm.value.creditAmount === null) {
      this.templateAccountingDetailsForm.controls['creditAmount'].setValue(0);
    }
  }

  private getCurrentCompany() {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.setSelectedCurrency(currency);
    });
  }

  private setJournalId(dialogOptions: Partial<IModalDialogOptions<any>>) {
    if (dialogOptions.data != null) {
      this.value = dialogOptions.data.journalId;
    }
  }

  private disableJournaCaseModalOpened() {
    if (this.isModalOption) {
      this.templateAccountingFormGroup.controls['journalId'].disable();
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(this.isTtemplateAccountingFormChanged.bind(this));
  }

  public isTtemplateAccountingFormChanged(): boolean {
    return this.templateAccountingFormGroup.touched || this.templateAccountingDetailsForm.touched;
  }

  ngOnInit() {
    this.getCurrentCompany();
    this.initTemplateDateForm();
    this.initJournalFilteredList();
    this.initTemplateAccountingFormGroup();
    this.createTemplateAccountingDetailsForm(new TemplateDetails());
    this.disableJournaCaseModalOpened();
    this.handleKeyAction();
    if (!this.isOpenDialogMode()) {
      this.activatedRoute.params.subscribe(params => {
        this.templateAccountingIdOnUpdate = +params['id'] || 0;
        if (this.templateAccountingIdOnUpdate > 0) {
          this.isUpdateMode = true;
          this.loadTemplateAccountingOnUpdate();
        } else {
          this.initAccountFilteredList();
        }
      });
    } else {
      this.initAccountFilteredList();
    }
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  ngOnDestroy() {
    document.removeEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    if (this.isModalOption) {
      this.templateAccountingLabel.nativeElement.focus();
    }
  }

  hasAuthorityAddOrUpdate(): boolean {
    return this.authService.hasAuthority(this.AccountingPermissions.ADD_ACCOUNTING_TEMPLATE)  && !this.isUpdateMode ||
    this.authService.hasAuthority(this.AccountingPermissions.UPDATE_ACCOUNTING_TEMPLATE) && this.isUpdateMode;
  }

}
