import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { SalaryRuleConstant } from '../../../constant/payroll/salary-rule.constant';
import { VariableConstant } from '../../../constant/payroll/variable.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { SalaryRuleValidityPeriodStateEnumerator } from '../../../models/enumerators/salaryRuleValidityPeriodStateEnumerator.model';
import { WrongPayslipActionEnumerator } from '../../../models/enumerators/wrong-payslip-action.enum';
import { RuleUniqueReference } from '../../../models/payroll/rule-unique-reference';
import { SalaryRuleValidityPeriod } from '../../../models/payroll/salary-rule-validity-period.model';
import { SalaryRule } from '../../../models/payroll/salary-rule.model';
import { WrongPayslipListComponent } from '../../../shared/components/wrong-payslip-list/wrong-payslip-list.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';
import { isAlphabetical, isNumeric, unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { RuleUniqueReferenceService } from '../../services/rule-unique-reference/rule-unique-reference.service';
import { SalaryRuleService } from '../../services/salary-rule/salary-rule.service';


@Component({
  selector: 'app-add-salary-rule',
  templateUrl: './add-salary-rule.component.html',
  styleUrls: ['./add-salary-rule.component.scss']
})
export class AddSalaryRuleComponent implements OnInit, OnDestroy {

  salaryRuleFormGroup: FormGroup;
  private id: number;
  private predicate: PredicateFormat;
  isUpdateMode: boolean;
  private salaryRuleToUpdate: SalaryRule = new SalaryRule();
  private isVariable: boolean;
  dialogSalaryRuleValidityPeriodtData: any;
  public data: any;
  public canUpdatePaysSetting = false;
  language: string;
  salaryRuleValidityPeriodStateEnumerator = SalaryRuleValidityPeriodStateEnumerator;
  public canHaveValidity = false;
  public options = { year: 'numeric', month: 'long'};
  public actionEnum = WrongPayslipActionEnumerator;
  private isSaveOperation = false;
  public salaryRuleValidityPeriodTouched = false ;
  public checkboxTouched = false;
  private subscriptions: Subscription[] = [];
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;

    constructor(private formBuilder: FormBuilder, private localStorageService: LocalStorageService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public validationService: ValidationService,
              private ruleUniqueReferenceService: RuleUniqueReferenceService,
              private salaryRuleService: SalaryRuleService,
              private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService,
              private authService: AuthService, private styleConfigService: StyleConfigService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    }));
    this.isVariable = this.router.url.indexOf('/variable/') > NumberConstant.ZERO;
      this.language = this.localStorageService.getLanguage();

  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_SALARYRULE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_SALARYRULE);
    this.createAddFormSalaryRule();
    if (this.isUpdateMode) {
      this.preparePredicateSalaryRule();
      this.getDataToUpdate();
    } else {
      this.canHaveValidity = true;
    }
  }

  private createAddFormSalaryRule(salaryRuleToUpdate?: SalaryRule): void {
    this.salaryRuleFormGroup = this.formBuilder.group({
      Id: [salaryRuleToUpdate ? salaryRuleToUpdate.Id : NumberConstant.ZERO],
      Reference: [salaryRuleToUpdate ? salaryRuleToUpdate.IdRuleUniqueReferenceNavigation.Reference : '',
        { validators: [Validators.required, isAlphabetical()], asyncValidators:
          unique(VariableConstant.REFERENCE, this.ruleUniqueReferenceService, String(NumberConstant.ZERO)),
        updateOn: 'blur'
      }],
      Name: [salaryRuleToUpdate ? salaryRuleToUpdate.Name : '', Validators.required],
      Description: [salaryRuleToUpdate ? salaryRuleToUpdate.Description : ''],
      Order: [{ value: salaryRuleToUpdate ? salaryRuleToUpdate.Order : '', disabled: this.isUpdateMode },
        [Validators.required, Validators.min(NumberConstant.ZERO), Validators.max(NumberConstant.FIFTY), isNumeric()]],
      RuleType: [salaryRuleToUpdate ? salaryRuleToUpdate.RuleType : '', Validators.required],
      AppearsOnPaySlip: [salaryRuleToUpdate ? salaryRuleToUpdate.AppearsOnPaySlip : ''],
      Applicability: [salaryRuleToUpdate ? salaryRuleToUpdate.Applicability : '', [ Validators.required,
        Validators.min(NumberConstant.ZERO), Validators.max(NumberConstant.FIFTY), isNumeric()]],
      RuleCategory: [salaryRuleToUpdate ? salaryRuleToUpdate.RuleCategory : '', Validators.required],
      DependNumberDaysWorked: [salaryRuleToUpdate ? salaryRuleToUpdate.DependNumberDaysWorked : false],
      UsedinNewsPaper: [salaryRuleToUpdate ? salaryRuleToUpdate.UsedinNewsPaper : ''],
      SalaryRuleValidityPeriod: this.formBuilder.array([])
    });
    if (this.isUpdateMode && !this.hasUpdatePermission) {
      this.salaryRuleFormGroup.disable();
    } else if (!this.isUpdateMode) {
      this.SalaryRuleValidityPeriod.push(this.buildSalaryRuleValidityPeriodForm());
    }
  }


  buildSalaryRuleValidityPeriodForm(salaryRuleValidityPeriod?: SalaryRuleValidityPeriod): FormGroup {
    const formGroup = this.formBuilder.group({
      Id: [salaryRuleValidityPeriod ? salaryRuleValidityPeriod.Id : NumberConstant.ZERO],
      IdSalaryRule: [salaryRuleValidityPeriod ? salaryRuleValidityPeriod.IdSalaryRule : NumberConstant.ZERO],
      StartDate: [salaryRuleValidityPeriod ? new Date(salaryRuleValidityPeriod.StartDate) : '', Validators.required],
      IsDeleted: [false],
      State: [salaryRuleValidityPeriod ? salaryRuleValidityPeriod.State : NumberConstant.TWO],
      Rule: [salaryRuleValidityPeriod ? salaryRuleValidityPeriod.Rule : '', Validators.required],
      Hide: true
    });
    if (this.Order.value !== NumberConstant.ZERO) {
      formGroup.controls[SalaryRuleConstant.RULE].setValidators(Validators.required);
    }
    return formGroup;
  }


  prepareSalaryRuleToSave(): SalaryRule {
    const salaryRuleToSave = Object.assign({}, this.salaryRuleToUpdate, this.salaryRuleFormGroup.getRawValue());
    salaryRuleToSave.AppearsOnPaySlip = this.AppearsOnPaySlip.value ? true : false;
    salaryRuleToSave.DependNumberDaysWorked = this.DependNumberDaysWorked.value ? true : false;
    salaryRuleToSave.UsedinNewsPaper = this.UsedinNewsPaper.value ? true : false;
    salaryRuleToSave.SalaryRuleValidityPeriod = this.SalaryRuleValidityPeriod.getRawValue();
    if (!this.isUpdateMode) {
      const ruleUniqueReference = new RuleUniqueReference();
      ruleUniqueReference.Reference = this.salaryRuleFormGroup.controls[SalaryRuleConstant.REF].value;
      salaryRuleToSave.IdRuleUniqueReferenceNavigation = ruleUniqueReference;
    }
    return salaryRuleToSave;
  }

  save() {
    if (this.salaryRuleFormGroup.valid) {
      this.isSaveOperation = true;
      this.salaryRuleToUpdate = this.prepareSalaryRuleToSave();
      if (this.isUpdateMode) {
        this.salaryRuleService.checkIfSalaryRulesHasAnyPayslip(this.salaryRuleToUpdate).toPromise().then(res => {
          if (res.length > NumberConstant.ZERO) {
            this.formModalDialogService.openDialog(ContractConstant.WRONG_ENTITIES, WrongPayslipListComponent,
              this.viewRef, this.actionToDo.bind(this), res, true, SharedConstant.MODAL_DIALOG_SIZE_ML);
          } else {
            this.actionToSave(this.salaryRuleToUpdate);
          }
        });
      } else {
        this.actionToSave(this.salaryRuleToUpdate);
      }
    } else {
      this.validationService.validateAllFormFields(this.salaryRuleFormGroup);
    }
  }

  actionToDo(action) {
    switch (action) {
      case this.actionEnum.MarkPayslipToWrong:
        this.salaryRuleToUpdate.UpdatePayslip = true;
        this.actionToSave(this.salaryRuleToUpdate);
        break;
      case this.actionEnum.DoNotMarkPayslipToWrong:
        this.actionToSave(this.salaryRuleToUpdate);
        break;
      case this.actionEnum.Cancel:
        break;
    }
  }

  private actionToSave(salaryRuleToSave: SalaryRule) {
    this.salaryRuleService.save(salaryRuleToSave, !this.isUpdateMode).subscribe(res => {
      this.backToList();
    });
  }


  private getDataToUpdate(): void {
    this.subscriptions.push(this.salaryRuleService.getModelByCondition(this.predicate).subscribe(data => {
      this.salaryRuleToUpdate = data;
      this.canHaveValidity = this.salaryRuleToUpdate.Order > NumberConstant.ZERO ? true : false;
      this.createAddFormSalaryRule(this.salaryRuleToUpdate);
      this.setSalaryRuleValidityPeriodsOfDataToUpdate(this.salaryRuleToUpdate);
      this.Reference.setAsyncValidators([unique(VariableConstant.REFERENCE,
        this.ruleUniqueReferenceService, String(this.salaryRuleToUpdate.IdRuleUniqueReferenceNavigation.Id))]);
    }));
  }
  /**
   * Set the rule to update salary rule validity periods
   * */
  public setSalaryRuleValidityPeriodsOfDataToUpdate(currentSalaryRule: SalaryRule) {
    if (currentSalaryRule.SalaryRuleValidityPeriod) {
      for (const currentSalaryRuleValidityPeriod of currentSalaryRule.SalaryRuleValidityPeriod) {
        if (currentSalaryRuleValidityPeriod.State === this.salaryRuleValidityPeriodStateEnumerator.InProgress) {
          this.SalaryRuleValidityPeriod.insert(NumberConstant.ZERO,
            this.buildSalaryRuleValidityPeriodForm(currentSalaryRuleValidityPeriod));
        } else {
          this.SalaryRuleValidityPeriod.push(this.buildSalaryRuleValidityPeriodForm(currentSalaryRuleValidityPeriod));
        }
      }
    }
  }

  /**
   * Prepare Predicate
   */
  public preparePredicateSalaryRule(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push.apply(this.predicate.Filter, [new Filter(SharedConstant.ID, Operation.eq, this.id)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(SalaryRuleConstant.RULE_UNIQUE_REFERENCE_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(SalaryRuleConstant.SALARY_RULE_VALIDITY_PERIOD)]);
  }

  backToList() {
    if (this.isVariable) {
      this.router.navigateByUrl(VariableConstant.LIST_URL);
    } else {
      this.router.navigateByUrl(SalaryRuleConstant.SALARY_RULE_LIST_URL);
    }
  }

  /**
   * Add new salary rule validity period to the salary rule form
   */
  addSalaryRuleValidityPeriod(): void {
    if (this.SalaryRuleValidityPeriod.valid) {
      this.SalaryRuleValidityPeriod.push(this.buildSalaryRuleValidityPeriodForm());
      this.salaryRuleValidityPeriodTouched = true;
    } else {
      this.validationService.validateAllFormFields(this.salaryRuleFormGroup);
    }
  }

  changeOrder() {
    this.canHaveValidity = this.Order.value === NumberConstant.ZERO ? false : true;
    if (!this.canHaveValidity) {
      this.salaryRuleFormGroup.controls[SalaryRuleConstant.SALARY_RULE_VALIDITY_PERIOD] = this.formBuilder.array([]);
    } else if (this.SalaryRuleValidityPeriod.length === NumberConstant.ZERO) {
      this.SalaryRuleValidityPeriod.push(this.buildSalaryRuleValidityPeriodForm());
    }
  }

  get Reference(): FormControl {
    return this.salaryRuleFormGroup.controls[VariableConstant.REFERENCE] as FormControl;
  }

  get AppearsOnPaySlip(): FormControl {
    return this.salaryRuleFormGroup.controls[SalaryRuleConstant.APPEARS_ON_PAY_SLIP] as FormControl;
  }

  get DependNumberDaysWorked(): FormControl {
    return this.salaryRuleFormGroup.controls[SalaryRuleConstant.DEPEND_NUMBER_DAYS_WORKED] as FormControl;
  }

  get UsedinNewsPaper(): FormControl {
    return this.salaryRuleFormGroup.controls[SalaryRuleConstant.USED_IN_NEWS_PAPER] as FormControl;
  }

  get Order(): FormControl {
    return this.salaryRuleFormGroup.controls[SalaryRuleConstant.ORDER] as FormControl;
  }


  get Applicability(): FormControl {
    return this.salaryRuleFormGroup.controls[SalaryRuleConstant.APPLICABILITY] as FormControl;
  }

  /**
   * Salary rule's salary rule validity period list
   */
  get SalaryRuleValidityPeriod(): FormArray {
    return this.salaryRuleFormGroup.get(SalaryRuleConstant.SALARY_RULE_VALIDITY_PERIOD) as FormArray;
  }

  /***
   * Check if checkbox touched
   */
  toggleEditable() {
    this.checkboxTouched = true;
  }

  isFormChanged(): boolean {
    if (this.salaryRuleFormGroup.touched || this.salaryRuleValidityPeriodTouched || this.checkboxTouched) {
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
