import { Component, ComponentRef, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Subscription } from 'rxjs/Subscription';
import { EvaluationConstant } from '../../../constant/rh/evaluation.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { EvaluationCriteriaTheme } from '../../../models/rh/evaluation-criteria-theme.model';
import { EvaluationCriteria } from '../../../models/rh/evaluation-criteria.model';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { EvaluationCriteriaThemeService } from '../../services/evaluation/evaluation-criteria-theme.service';

@Component({
  selector: 'app-add-evaluation-criteria-theme',
  templateUrl: './add-evaluation-criteria-theme.component.html',
  styleUrls: ['./add-evaluation-criteria-theme.component.scss']
})
export class AddEvaluationCriteriaThemeComponent implements OnInit, OnDestroy {

  evaluationCriteriaThemeFormGroup: FormGroup;

  isUpdateMode = false;
  isModal: boolean;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  evaluationCriteriaThemeToUpdate: EvaluationCriteriaTheme;
  private subscription: Subscription;
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  constructor(private modalDialogInstanceService: ModalDialogInstanceService,
              private evaluationCriteriaThemeService: EvaluationCriteriaThemeService,
              private authService: AuthService, private fb: FormBuilder, private validationService: ValidationService) {
  }

  get Label(): FormControl {
    return this.evaluationCriteriaThemeFormGroup.get(EvaluationConstant.LABEL) as FormControl;
  }

  get Description(): FormControl {
    return this.evaluationCriteriaThemeFormGroup.get(EvaluationConstant.DESCRIPTION) as FormControl;
  }

  get EvaluationCriteria(): FormArray {
    return this.evaluationCriteriaThemeFormGroup.get(EvaluationConstant.EVALUATION_CRITERIA) as FormArray;
  }

  ngOnInit() {
    this.hasAddPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_EVALUATIONCRITERIATHEME);
    this.hasUpdatePermission =
    this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_EVALUATIONCRITERIATHEME);
    this.createForm();
    if (this.isUpdateMode) {
      this.setEvaluationCriteria(this.evaluationCriteriaThemeToUpdate);
    } else {
      this.addEvaluationCriteria();
    }
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
    this.evaluationCriteriaThemeToUpdate = this.dialogOptions.data;
    if (this.evaluationCriteriaThemeToUpdate) {
      this.isUpdateMode = true;
    } else {
      this.isUpdateMode = false;
    }
  }

  save() {
    if (this.evaluationCriteriaThemeFormGroup.valid) {
      const evaluationCriteriaTheme: EvaluationCriteriaTheme =
        Object.assign({}, this.evaluationCriteriaThemeToUpdate, this.evaluationCriteriaThemeFormGroup.getRawValue());
      this.subscription = this.evaluationCriteriaThemeService.save(evaluationCriteriaTheme, !this.isUpdateMode).subscribe((result) => {
        this.dialogOptions.data = result;
        this.dialogOptions.onClose();
        this.modalDialogInstanceService.closeAnyExistingModalDialog();
      });
    } else {
      this.validationService.validateAllFormFields(this.evaluationCriteriaThemeFormGroup);
    }
  }

  addEvaluationCriteria() {
    this.EvaluationCriteria.push(this.buildEvaluationCriteriaForm());
  }

  public buildEvaluationCriteriaForm(evaluationCriteria?: EvaluationCriteria): FormGroup {
    return this.fb.group({
      Id: [evaluationCriteria ? evaluationCriteria.Id : NumberConstant.ZERO],
      Label: [evaluationCriteria ? evaluationCriteria.Label : '', [Validators.required]],
      Description: [evaluationCriteria ? evaluationCriteria.Description : ''],
      IdEvaluationCriteriaTheme: [evaluationCriteria ? evaluationCriteria.IdEvaluationCriteriaTheme : NumberConstant.ZERO],
      IsDeleted: [false]
    });
  }

  isEvaluationCriteriaRowVisible(index: number): boolean {
    return !this.EvaluationCriteria.at(index).get(SharedConstant.IS_DELETED).value;
  }

  deleteEvaluationCriteria(index: number) {
    if (this.EvaluationCriteria.at(index).get(SharedConstant.ID).value === NumberConstant.ZERO) {
      this.EvaluationCriteria.removeAt(index);
    } else {
      this.EvaluationCriteria.at(index).get(SharedConstant.IS_DELETED).setValue(true);
      this.EvaluationCriteria.at(index).get(EvaluationConstant.DESCRIPTION).clearValidators();
    }
  }

  setEvaluationCriteria(evaluationCriteriaTheme: EvaluationCriteriaTheme) {
    if (evaluationCriteriaTheme.EvaluationCriteria) {
      evaluationCriteriaTheme.EvaluationCriteria.forEach(evaluationCriteria => {
        this.EvaluationCriteria.push(this.buildEvaluationCriteriaForm(evaluationCriteria));
      });
    }
    if (!this.hasUpdatePermission) {
      this.evaluationCriteriaThemeFormGroup.disable();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  private createForm(): void {
    this.evaluationCriteriaThemeFormGroup = this.fb.group({
      Id: [this.evaluationCriteriaThemeToUpdate ? this.evaluationCriteriaThemeToUpdate.Id : NumberConstant.ZERO],
      Label: [this.evaluationCriteriaThemeToUpdate ? this.evaluationCriteriaThemeToUpdate.Label : '', [Validators.required]],
      Description: [this.evaluationCriteriaThemeToUpdate ? this.evaluationCriteriaThemeToUpdate.Description : ''],
      EvaluationCriteria: this.fb.array([])
    });
  }
}
