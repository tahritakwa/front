import {Component, OnInit, ComponentRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {JournalService} from '../../services/journal/journal.service';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';
import {JournalConstants} from '../../../constant/accounting/journal.constant';
import {Observable} from 'rxjs/Observable';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import {NumberConstant} from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-add-journal',
  templateUrl: './add-journal.component.html',
  styleUrls: ['./add-journal.component.scss']
})
export class AddJournalComponent implements OnInit, IModalDialog {
  public journalListUrl = JournalConstants.JOURNAL_LIST_URL;

  dialogOptions: Partial<IModalDialogOptions<any>>;

  public journalAddFormGroup: FormGroup;

  public reconciliationValues;
  public reconciliationValuesFilter;
  public isSaveOperation;
  public isReconcilableChecked = false;
  public isCashFlowChecked = false;
  public id;
  public isUpdateMode = false;

  constructor(
    public journalService: JournalService,
    private fb: FormBuilder,
    private validationService: ValidationService,
    private growlService: GrowlService,
    private translate: TranslateService,
    private modalService: ModalDialogInstanceService,
    private genericAccountingService: GenericAccountingService,
    private router: Router,
    private styleConfigService: StyleConfigService,
    private activatedRoute: ActivatedRoute
  ) {

  }

  showSuccessMessage() {
    this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
    if (this.isOpenDialogMode()) {
      this.dialogOptions.onClose();
      this.modalService.closeAnyExistingModalDialog();
    } else {
      this.router.navigateByUrl(this.journalListUrl);
    }
  }

  private initAddJournalFormGroup(): void {
    this.journalAddFormGroup = this.fb.group({
      id: [this.id ? this.id : NumberConstant.ZERO],
      code: ['', [Validators.required, Validators.minLength(AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH),
        Validators.maxLength(AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH)]],
      label: ['', [Validators.required, Validators.minLength(AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH),
        Validators.maxLength(AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH)]],
      reconcilable: [false, [Validators.required]],
      cashFlow: [false, [Validators.required]],
    });
  }

  public saveJournal(): void {
    if (this.journalAddFormGroup.valid) {
      this.isSaveOperation = true;
      const removedWhiteSpaceFromBothSideOfCode = this.journalAddFormGroup.value.code.trim();
      const removedWhiteSpaceFromBothSideOfLabel = this.journalAddFormGroup.value.label.trim();
      this.journalAddFormGroup.patchValue({'code': removedWhiteSpaceFromBothSideOfCode, 'label': removedWhiteSpaceFromBothSideOfLabel});

      if (this.isUpdateMode) {
        this.journalService.getJavaGenericService().updateEntity(this.journalAddFormGroup.value, this.id).subscribe(data => {
          this.showSuccessMessage();
        }, err => {
          this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.FAILURE_OPERATION));
        });
      } else {
        this.journalService.getJavaGenericService().saveEntity(this.journalAddFormGroup.value).subscribe(data => {
          this.showSuccessMessage();
        }, err => {
          this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.FAILURE_OPERATION));
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.journalAddFormGroup);
    }
  }

  public initReconciliationValues() {
    this.reconciliationValues = [{isReconcilable: false, status: `${this.translate.instant(JournalConstants.NO)}`},
      {isReconcilable: true, status: `${this.translate.instant(JournalConstants.YES)}`}];
  }

  handleFilterChange(writtenValue) {
    this.reconciliationValues = this.reconciliationValuesFilter.filter((s) =>
      s.status.toLowerCase().includes(writtenValue.toLowerCase())
      || s.status.toLocaleLowerCase().includes(writtenValue.toLowerCase())
    );
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    });
    this.initAddJournalFormGroup();
    this.reconciliationValuesFilter = this.reconciliationValues;
    if (this.id) {
      this.isUpdateMode = true;
      this.getDataToUpdate();
    }
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.initAddJournalFormGroup();
    this.initReconciliationValues();
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(this.isAccountFormChanged.bind(this));
  }

  public isAccountFormChanged(): boolean {
    return this.journalAddFormGroup.touched;
  }

  public checkReconciliation() {
    this.isReconcilableChecked = !this.isReconcilableChecked;
    this.journalAddFormGroup.controls[JournalConstants.RECONCILABLE].setValue(this.isReconcilableChecked);
  }

  public checkCashFlow() {
    this.isCashFlowChecked = !this.isCashFlowChecked;
    this.journalAddFormGroup.controls[JournalConstants.CASH_FLOW].setValue(this.isCashFlowChecked);
  }

  getFooterClass(): string {
    return !this.dialogOptions ? this.styleConfigService.getFooterClassSettingLayoutAddComponent() : SharedConstant.EMPTY;
  }

  private setForm(account): void {
    this.journalAddFormGroup.patchValue(account);
  }

  getDataToUpdate() {
    this.journalService.getJavaGenericService().getEntityById(this.id)
      .subscribe(data => {
        this.setForm(data);
        this.isReconcilableChecked = data.reconcilable;
        this.isCashFlowChecked = data.cashFlow;
      });
  }

  isOpenDialogMode() {
    return this.dialogOptions !== undefined;
  }
}
