import { Component, OnInit, ComponentRef, OnDestroy } from '@angular/core';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { ValidationService, unique } from '../../../shared/services/validation/validation.service';
import { BenefitInKind } from '../../../models/payroll/benefit-in-kind.model';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { BenefitInKindService } from '../../services/benefit-in-kind/benefit-in-kind.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { BonusConstant } from '../../../constant/payroll/bonus.constant';
import { CnssConstant } from '../../../constant/payroll/cnss.constant';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { BenefitInKindConstant } from '../../../constant/payroll/benefit-in-kind.constant';
import { SalaryRuleConstant } from '../../../constant/payroll/salary-rule.constant';
import { Subscription } from 'rxjs/Subscription';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-add-benefit-in-kind',
  templateUrl: './add-benefit-in-kind.component.html',
  styleUrls: ['./add-benefit-in-kind.component.scss']
})
export class AddBenefitInKindComponent implements OnInit , OnDestroy {

  isModal: boolean;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  benefitInKindFormGroup: FormGroup;
  isUpdateMode: boolean;
  benefitInKindToUpdate: BenefitInKind;
  private subscriptions: Subscription[] = [];
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;

  constructor(private modalService: ModalDialogInstanceService,
    private fb: FormBuilder,
    private validationService: ValidationService,
    private benefitInKindService: BenefitInKindService,
    private swalWarrings: SwalWarring, private authService: AuthService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_BENEFITINKIND);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_BENEFITINKIND);
    if (this.isUpdateMode) {
      this.createAddBenefitInKindForm(this.benefitInKindToUpdate);
    } else {
      this.createAddBenefitInKindForm();
    }
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
    if (this.dialogOptions.data) {
      this.isUpdateMode = true;
      this.benefitInKindToUpdate = this.dialogOptions.data;
    } else {
      this.isUpdateMode = false;
    }
  }

  createAddBenefitInKindForm(benefitInKind?: BenefitInKind) {
    this.benefitInKindFormGroup = this.fb.group({
      Id: [benefitInKind ? benefitInKind.Id : NumberConstant.ZERO],
      Code: [benefitInKind ? benefitInKind.Code : '',
      { validators: [Validators.required, Validators.maxLength(NumberConstant.FIFTY)], asyncValidators:
          unique(SharedConstant.CODE, this.benefitInKindService, String(benefitInKind ? benefitInKind.Id : NumberConstant.ZERO)),
        updateOn: 'blur'
      }],
      Name: [benefitInKind ? benefitInKind.Name : undefined,
      [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      Description: [benefitInKind ? benefitInKind.Description : ''],
      IdCnss: [benefitInKind ? benefitInKind.IdCnss : '', Validators.required],
      IsTaxable: [benefitInKind ? benefitInKind.IsTaxable : false],
      DependNumberDaysWorked: [benefitInKind ? benefitInKind.DependNumberDaysWorked : false],
    });
    if (this.isUpdateMode && !this.hasUpdatePermission) {
      this.benefitInKindFormGroup.disable();
    }
  }

  public save(): void {
    if (this.benefitInKindFormGroup.valid) {
        const benefitToSave: BenefitInKind = Object.assign({}, new BenefitInKind(), this.benefitInKindFormGroup.value);
        if (this.isUpdateMode) {
        this.benefitInKindService.checkIfContractsHasAnyPayslip(benefitToSave).toPromise().then(res => {
          if (res === true) {
            this.swalWarrings.CreateSwal(BenefitInKindConstant.BENEFITINKIND_HAS_PAYSLIP_ERROR, undefined,
                SharedConstant.YES, SharedConstant.NO).then((result) => {
              if (result.value) {
                this.actionToSave(benefitToSave);
              }
            });
          } else {
            this.actionToSave(benefitToSave);
          }
        });
      } else {
        this.actionToSave(benefitToSave);
      }
    } else {
      this.validationService.validateAllFormFields(this.benefitInKindFormGroup);
    }
  }

  private actionToSave(benefitToSave: BenefitInKind) {
    this.subscriptions.push(this.benefitInKindService.save(benefitToSave, !this.isUpdateMode).subscribe(() => {
      this.dialogOptions.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }));
  }

  get Id(): FormControl {
    return this.benefitInKindFormGroup.get(BonusConstant.ID) as FormControl;
  }
  get Code(): FormControl {
    return this.benefitInKindFormGroup.get(BonusConstant.CODE) as FormControl;
  }
  get Description(): FormControl {
    return this.benefitInKindFormGroup.get(BonusConstant.DESCRIPTION) as FormControl;
  }
  get IdCnss(): FormControl {
    return this.benefitInKindFormGroup.get(CnssConstant.ID_CNSS) as FormControl;
  }
  get IsContributory(): FormControl {
    return this.benefitInKindFormGroup.get(BonusConstant.IS_CONTRIBUTORY) as FormControl;
  }
  get Name(): FormControl {
    return this.benefitInKindFormGroup.get(BonusConstant.NAME) as FormControl;
  }
  get IsTaxable(): FormControl {
    return this.benefitInKindFormGroup.get(BonusConstant.IS_TAXABLE) as FormControl;
  }
  get DependNumberDaysWorked(): FormControl {
    return this.benefitInKindFormGroup.controls[SalaryRuleConstant.DEPEND_NUMBER_DAYS_WORKED] as FormControl;
  }
  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
