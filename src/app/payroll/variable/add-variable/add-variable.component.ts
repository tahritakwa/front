import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { PredicateFormat, Relation, Filter, Operation } from '../../../shared/utils/predicate';
import { Variable } from '../../../models/payroll/variable.model';
import { Router, ActivatedRoute } from '@angular/router';
import { VariableConstant } from '../../../constant/payroll/variable.constant';
import { VariableService } from '../../services/variable/variable.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ValidationService, unique, isAlphabetical } from '../../../shared/services/validation/validation.service';
import { RuleUniqueReference } from '../../../models/payroll/rule-unique-reference';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { VariableValidityPeriod } from '../../../models/payroll/variable-validity-period.model';
import { VariableValidityPeriodStateEnumerator } from '../../../models/enumerators/variableValidityPeriodEnumerator.model';
import { RuleUniqueReferenceService } from '../../services/rule-unique-reference/rule-unique-reference.service';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { WrongPayslipListComponent } from '../../../shared/components/wrong-payslip-list/wrong-payslip-list.component';
import { WrongPayslipActionEnumerator } from '../../../models/enumerators/wrong-payslip-action.enum';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';

@Component({
  selector: 'app-add-variable',
  templateUrl: './add-variable.component.html',
  styleUrls: ['./add-variable.component.scss']
})
export class AddVariableComponent implements OnInit, OnDestroy {

  variableFormGroup: FormGroup;
  variableValidityPeriodStateEnumerator = VariableValidityPeriodStateEnumerator;
  private id: number;
  private predicate: PredicateFormat;
  isUpdateMode: boolean;
  private variableToUpdate: Variable = new Variable();
  public actionEnum = WrongPayslipActionEnumerator;
  private isSaveOperation = false;
  public variableValidityPeriodTouched = false ;
  private subscriptions: Subscription[] = [];
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private variableService: VariableService,
              private ruleUniqueReferenceService: RuleUniqueReferenceService,
              public validationService: ValidationService,
              private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService,
              private authService: AuthService, private styleConfigService: StyleConfigService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    }));
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_VARIABLE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_VARIABLE);
    this.createAddFormVariable();
    if (this.isUpdateMode) {
      this.preparePredicateVariable();
      this.getDataToUpdate();
    }
  }

  private createAddFormVariable(variableToUpdate?: Variable): void {
    this.variableFormGroup = this.formBuilder.group({
      Id: [variableToUpdate ? variableToUpdate.Id : NumberConstant.ZERO],
      Name: [variableToUpdate ? variableToUpdate.Name : '', Validators.required],
      Description: [variableToUpdate ? variableToUpdate.Description : ''],
      Reference: [variableToUpdate ? variableToUpdate.IdRuleUniqueReferenceNavigation.Reference : '',
        { validators: [Validators.required, isAlphabetical()], asyncValidators:
          unique(VariableConstant.REFERENCE, this.ruleUniqueReferenceService, String(NumberConstant.ZERO)),
        updateOn: 'blur'
      }],
      VariableValidityPeriod: this.formBuilder.array([])
    });
    if (this.isUpdateMode && !this.hasUpdatePermission) {
      this.variableFormGroup.disable();
    } else if (!this.isUpdateMode) {
      this.VariableValidityPeriod.push(this.buildVariableValidityPeriodForm());
    }
  }

  buildVariableValidityPeriodForm(variableValidityPeriod?: VariableValidityPeriod): FormGroup {
    return this.formBuilder.group({
      Id: [variableValidityPeriod ? variableValidityPeriod.Id : NumberConstant.ZERO],
      IdVariable: [variableValidityPeriod ? variableValidityPeriod.IdVariable : NumberConstant.ZERO],
      StartDate: [variableValidityPeriod ? new Date(variableValidityPeriod.StartDate) : '', Validators.required],
      IsDeleted: [false],
      State: [variableValidityPeriod ? variableValidityPeriod.State : NumberConstant.TWO],
      Formule: [variableValidityPeriod ? variableValidityPeriod.Formule : '', Validators.required],
      Hide: true
    });
  }



  prepareVariableToSave(): Variable {
    const variableToSave = Object.assign({}, this.variableToUpdate, this.variableFormGroup.getRawValue());
    variableToSave.VariableValidityPeriod = this.VariableValidityPeriod.getRawValue();
    if (!this.isUpdateMode) {
      const ruleUniqueReference = new RuleUniqueReference();
      ruleUniqueReference.Reference = this.variableFormGroup.controls[VariableConstant.REFERENCE].value;
      variableToSave.IdRuleUniqueReferenceNavigation = ruleUniqueReference;
    }
    return variableToSave;
  }

  private getDataToUpdate(): void {
    this.subscriptions.push(this.variableService.getModelByCondition(this.predicate).subscribe(data => {
      this.variableToUpdate = data;
      this.createAddFormVariable(this.variableToUpdate);
      this.setSalaryRuleValidityPeriodsOfDataToUpdate(this.variableToUpdate);
      this.Reference.setAsyncValidators([unique(VariableConstant.REFERENCE,
        this.ruleUniqueReferenceService, String(this.variableToUpdate.IdRuleUniqueReferenceNavigation.Id))]);
    }));
  }

  public setSalaryRuleValidityPeriodsOfDataToUpdate(currentVariable: Variable) {
    if (currentVariable.VariableValidityPeriod) {
      for (const currentVariableValidityPeriod of currentVariable.VariableValidityPeriod) {
        if (currentVariableValidityPeriod.State === this.variableValidityPeriodStateEnumerator.InProgress) {
          this.VariableValidityPeriod.insert(NumberConstant.ZERO, this.buildVariableValidityPeriodForm(currentVariableValidityPeriod));
        } else {
          this.VariableValidityPeriod.push(this.buildVariableValidityPeriodForm(currentVariableValidityPeriod));
        }
      }
    }
  }

  public preparePredicateVariable(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push.apply(this.predicate.Filter, [new Filter(SharedConstant.ID, Operation.eq, this.id)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(VariableConstant.RULE_UNIQUE_REFERENCE_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(VariableConstant.VARIABLE_VALIDITY_PERIOD)]);
  }

  save() {
    if (this.variableFormGroup.valid) {
      this.variableFormGroup.updateValueAndValidity();
      this.variableToUpdate = this.prepareVariableToSave();
      this.isSaveOperation = true;
      if (this.isUpdateMode) {
        this.variableService.checkIFVariableIsUsedInAnyRuleUsedInAnyPayslip(this.variableToUpdate).toPromise().then(res => {
          if (res && res.length > NumberConstant.ZERO) {
            this.formModalDialogService.openDialog(ContractConstant.WRONG_ENTITIES, WrongPayslipListComponent,
              this.viewRef, this.actionToDo.bind(this), res, true, SharedConstant.MODAL_DIALOG_SIZE_ML);
          } else {
            this.actionToSave(this.variableToUpdate);
          }
        });
      } else {
        this.actionToSave(this.variableToUpdate);
      }
    } else {
      this.validationService.validateAllFormFields(this.variableFormGroup);
    }
  }

  actionToDo(action) {
    switch (action) {
      case this.actionEnum.MarkPayslipToWrong:
        this.variableToUpdate.UpdatePayslip = true;
        this.actionToSave(this.variableToUpdate);
        break;
      case this.actionEnum.DoNotMarkPayslipToWrong:
        this.actionToSave(this.variableToUpdate);
        break;
      case this.actionEnum.Cancel:
        break;
    }
  }

  private actionToSave(variableToSave: Variable) {
    this.subscriptions.push(this.variableService.save(variableToSave, !this.isUpdateMode).subscribe(res => {
      this.backToList();
    }));
  }

  backToList() {
    this.router.navigateByUrl(VariableConstant.LIST_URL);
  }


  /**
   * Add new variable validity period to the variable form
   */
  addVariableValidityPeriod(): void {
    if ((this.hasAddPermission || this.hasUpdatePermission) && this.VariableValidityPeriod.valid) {
      this.VariableValidityPeriod.push(this.buildVariableValidityPeriodForm());
      this.variableValidityPeriodTouched = true;
    } else {
      this.validationService.validateAllFormFields(this.variableFormGroup);
    }
  }

  get Reference(): FormControl {
    return this.variableFormGroup.controls[VariableConstant.REFERENCE] as FormControl;
  }

  /**
   * Variable's variable validity period list
   */
  get VariableValidityPeriod(): FormArray {
    return this.variableFormGroup.get(VariableConstant.VARIABLE_VALIDITY_PERIOD) as FormArray;
  }

  isFormChanged(): boolean {
    if (this.variableFormGroup.touched || this.variableValidityPeriodTouched) {
      return true;
    }
    return false;
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
