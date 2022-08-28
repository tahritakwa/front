import { Component, OnInit, ComponentRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { ValidationService, unique, uniqueStartPeriode } from '../../../shared/services/validation/validation.service';
import { Bonus } from '../../../models/payroll/bonus.model';
import { BonusService } from '../../services/bonus/bonus.service';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { BonusValidityPeriod } from '../../../models/payroll/bonus-validity-period.model';
import { BonusConstant } from '../../../constant/payroll/bonus.constant';
import { CnssConstant } from '../../../constant/payroll/cnss.constant';
import { Observable } from 'rxjs/Observable';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { SalaryRuleConstant } from '../../../constant/payroll/salary-rule.constant';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { WrongPayslipListComponent } from '../../../shared/components/wrong-payslip-list/wrong-payslip-list.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { WrongPayslipActionEnumerator } from '../../../models/enumerators/wrong-payslip-action.enum';
import { Subscription } from 'rxjs/Subscription';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-add-bonus',
  templateUrl: './add-bonus.component.html',
  styleUrls: ['./add-bonus.component.scss']
})
export class AddBonusComponent implements OnInit , OnDestroy {
  /*
   * Form Group
   */
  bonusFormGroup: FormGroup;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  public isDisabled = false;
  /*
   * If type=fixe
   */
  public showValidtyPeriodSection: boolean;
  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  /*
   * Data input of the modal
   */
  public data: any;
  /**
   * number of deleted element in update case
   */
  public DeletedElementsNumber = NumberConstant.ZERO;
  public bonusToUpdate: Bonus;
  public actionEnum = WrongPayslipActionEnumerator;
  private subscriptions: Subscription[] = [];
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;

  constructor(private modalService: ModalDialogInstanceService,
    private bonusService: BonusService, private fb: FormBuilder, private validationService: ValidationService,
    private growlService: GrowlService, private translateService: TranslateService,
    private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService, private authService: AuthService) { }

  /**
   * Inialise The Component
   * @param reference
   * @param options
   */
  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_BONUS);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_BONUS);
    if (this.isUpdateMode) {
      if (this.data.IsFixe) {
        this.showValidtyPeriodSection = true;
      }
      this.createAddBonusForm(this.data);
      if (this.data.BonusValidityPeriod) {
        this.data.BonusValidityPeriod.forEach(element => {
          this.BonusValidityPeriod.push(this.buildValidityForm(element));
        });
      }
    } else {
      this.createAddBonusForm();
    }
    this.bonusToUpdate = new Bonus();
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.data = this.dialogOptions.data;
    if (this.data) {
      this.isUpdateMode = true;
    } else {
      this.isUpdateMode = false;
    }
  }

  /**
   * Create Bonus form
   * @param bonus
   */
  private createAddBonusForm(bonus?: Bonus): void {
    this.bonusFormGroup = this.fb.group({
      Id: [bonus ? bonus.Id : NumberConstant.ZERO],
      Code: [bonus ? bonus.Code : '',
        { validators: [Validators.required, Validators.maxLength(BonusConstant.VARCHAR_MAX_LENGTH)], asyncValidators:
          unique(BonusConstant.CODE, this.bonusService, String(bonus ? bonus.Id : NumberConstant.ZERO)),
        updateOn: 'blur'
      }],
      Name: [bonus ? bonus.Name : '', [Validators.required, Validators.maxLength(BonusConstant.VARCHAR_MAX_LENGTH)]],
      Description: [bonus ? bonus.Description : '', Validators.maxLength(BonusConstant.DESCRIPTION_MAX_LENGTH)],
        IsFixe: [bonus ? bonus.IsFixe : false],
      IsContributory: [bonus ? bonus.IsContributory : false],
      IdCnss: [bonus ? bonus.IdCnss : '', [Validators.required]],
      IsTaxable: [bonus ? bonus.IsTaxable : false],
      DependNumberDaysWorked: [bonus ? bonus.DependNumberDaysWorked : false],
      BonusValidityPeriod: this.fb.array([]),
    });
    if (this.isUpdateMode && !this.hasUpdatePermission) {
      this.bonusFormGroup.disable();
    }
  }

  /**
   * Bonus form Getters
   */
  get BonusValidityPeriod(): FormArray {
    return this.bonusFormGroup.get(BonusConstant.BONUS_VALIDITY_PERIOD) as FormArray;
  }
  get Id(): FormControl {
    return this.bonusFormGroup.get(BonusConstant.ID) as FormControl;
  }
  get Code(): FormControl {
    return this.bonusFormGroup.get(BonusConstant.CODE) as FormControl;
  }
  get Description(): FormControl {
    return this.bonusFormGroup.get(BonusConstant.DESCRIPTION) as FormControl;
  }
  get IsFixe(): FormControl {
    return this.bonusFormGroup.get(BonusConstant.IS_FIXE) as FormControl;
  }
  get IdCnss(): FormControl {
    return this.bonusFormGroup.get(CnssConstant.ID_CNSS) as FormControl;
  }
  get IsContributory(): FormControl {
    return this.bonusFormGroup.get(BonusConstant.IS_CONTRIBUTORY) as FormControl;
  }
  get Name(): FormControl {
    return this.bonusFormGroup.get(BonusConstant.NAME) as FormControl;
  }
  get IsTaxable(): FormControl {
    return this.bonusFormGroup.get(BonusConstant.IS_TAXABLE) as FormControl;
  }
  get DependNumberDaysWorked(): FormControl {
    return this.bonusFormGroup.controls[SalaryRuleConstant.DEPEND_NUMBER_DAYS_WORKED] as FormControl;
  }

  /**
   * Build BonusValidityPeriod Array form Bonus
   * @param validityPeriod
   */
  public buildValidityForm(validityPeriod?: BonusValidityPeriod): FormGroup {
    const START_DATE = validityPeriod ? new Date(validityPeriod.StartDate) : undefined;
    this.BonusValidityPeriod.controls.forEach((element: FormGroup) => {
      element.controls[SharedConstant.START_DATE].clearValidators();
    });
    return this.fb.group({
      Id: [validityPeriod ? validityPeriod.Id : NumberConstant.ZERO],
      Value: [validityPeriod ? validityPeriod.Value : '', [Validators.required, Validators.min(0)]],
      StartDate: [START_DATE, [
        Validators.required,
        uniqueStartPeriode(new Observable(o =>
          o.next((this.BonusValidityPeriod.value as Array<any>)
          .filter(y => !y.IsDeleted)
          .map(x => new Date(new Date(x.StartDate).getFullYear(), new Date(x.StartDate).getMonth(), NumberConstant.SHIFT_FIRST_DATE)))))
      ]],
      IsDeleted: [false]
    });
  }

  /**
   * return the visibility of a validityPeriod
   * @param i
   */
  isRowVisible(i): boolean {
    return !this.BonusValidityPeriod.at(i).get(BonusConstant.IS_DELETED).value;
  }

  /**
   * onClick on add validity period button a new child will be display
   */
  public addBonusValidityPeriod(): void {
    if (this.BonusValidityPeriod.length === NumberConstant.ZERO) {
      this.BonusValidityPeriod.push(this.buildValidityForm());
    } else if (this.BonusValidityPeriod.controls[this.BonusValidityPeriod.length - NumberConstant.ONE] &&
      this.BonusValidityPeriod.controls[this.BonusValidityPeriod.length - NumberConstant.ONE].valid) {
        this.BonusValidityPeriod.push(this.buildValidityForm());
    } else if (this.BonusValidityPeriod.controls[this.BonusValidityPeriod.length - NumberConstant.ONE]) {
      this.validationService.validateAllFormFields(this.BonusValidityPeriod.
        controls[this.BonusValidityPeriod.length - NumberConstant.ONE] as FormGroup);
    }
  }

  /**
   * Dispalay the add validity period section if the bonus is fixed
   */
  public showValiditySection() {
    if (!this.isUpdateMode) {
      this.showValidtyPeriodSection = !this.showValidtyPeriodSection;
      if (this.showValidtyPeriodSection) {
        this.addBonusValidityPeriod();
      } else {
        this.clearFormArray(this.BonusValidityPeriod);
      }
    } else {
      this.growlService.warningNotification(this.translateService.instant(BonusConstant.CANNOT_CHANGE_BONUS_TYPE));
      return false;
    }
  }

  /**
   * Save a new Bonus with all the relations
   */
  public save(): void {
    if (this.bonusFormGroup.valid) {
      this.bonusToUpdate = Object.assign({}, new Bonus(), this.bonusFormGroup.value);
      if (this.isUpdateMode) {
        this.bonusService.checkIfBonussHasAnyPayslip(this.bonusToUpdate).toPromise().then(res => {
          if (res.length > NumberConstant.ZERO) {
            this.formModalDialogService.openDialog(ContractConstant.WRONG_ENTITIES, WrongPayslipListComponent,
            this.viewRef, this.actionToDo.bind(this), res, true, SharedConstant.MODAL_DIALOG_SIZE_ML);
          } else {
            this.actionToSave(this.bonusToUpdate);
          }
        });
      } else {
        this.actionToSave(this.bonusToUpdate);
      }
    } else {
      this.validationService.validateAllFormFields(this.bonusFormGroup);
    }
  }

  actionToDo(action) {
    switch (action) {
      case this.actionEnum.MarkPayslipToWrong:
        this.bonusToUpdate.UpdatePayslip = true;
        this.actionToSave(this.bonusToUpdate);
        break;
      case this.actionEnum.DoNotMarkPayslipToWrong:
        this.actionToSave(this.bonusToUpdate);
      break;
      case this.actionEnum.Cancel:
      break;
    }
  }

  private actionToSave(bonusToSave: Bonus) {
    this.subscriptions.push(this.bonusService.save(bonusToSave, !this.isUpdateMode).subscribe(() => {
      this.dialogOptions.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }));
  }

  /**
   * Delete a specific element of the formArray
   * @param index
   */
  public deleteBonusValidityPeriod(index): void {
    if (this.isUpdateMode) {
      if (this.BonusValidityPeriod.at(index).get(BonusConstant.ID).value === 0) {
        this.BonusValidityPeriod.removeAt(index);
      } else {
        this.BonusValidityPeriod.at(index).get(BonusConstant.IS_DELETED).setValue(true);
        this.DeletedElementsNumber++;
        // check if all items in array is removed
        if (this.BonusValidityPeriod.length === this.DeletedElementsNumber) {
          this.bonusFormGroup.controls[BonusConstant.IS_FIXE].setValue(false);
          this.BonusValidityPeriod.at(index).get(BonusConstant.START_DATE).clearAsyncValidators();
          this.showValidtyPeriodSection = false;
        }
      }
    } else {
      this.BonusValidityPeriod.removeAt(index);
    }
    // if all bonus period has been removed change IsFixed false
    if (this.BonusValidityPeriod.length <= 0) {
      this.bonusFormGroup.controls[BonusConstant.IS_FIXE].setValue(false);
      this.showValidtyPeriodSection = false;
    }
    this.BonusValidityPeriod.controls.forEach((elt: FormGroup) => {
      elt.controls[SharedConstant.START_DATE].updateValueAndValidity();
    });
  }

  /**
   * Delete all elements of the formArray
   */
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  /** Validate Form */
  validateForm($event) {
    this.BonusValidityPeriod.controls.forEach((elt: FormGroup) => {
      const startDate = new Date(elt.controls[SharedConstant.START_DATE].value);
      elt.controls[SharedConstant.START_DATE]
        .setValue(new Date(startDate.getFullYear(), startDate.getMonth(), NumberConstant.SHIFT_FIRST_DATE));
      elt.controls[SharedConstant.START_DATE].updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
