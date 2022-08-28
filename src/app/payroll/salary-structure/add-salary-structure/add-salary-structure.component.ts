import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { SalaryStructureConstant } from '../../../constant/payroll/salary-structure.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { SalaryRuleValidityPeriodStateEnumerator } from '../../../models/enumerators/salaryRuleValidityPeriodStateEnumerator.model';
import { SalaryRule } from '../../../models/payroll/salary-rule.model';
import { SalaryStructureValidityPeriod } from '../../../models/payroll/salary-structure-validity-period';
import { SalaryStructureValidityPeriodSalaryRule } from '../../../models/payroll/salary-structure-validity-period-salary-rule';
import { SalaryStructure } from '../../../models/payroll/salary-structure.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';
import { UtilityService } from '../../../shared/services/utility/utility.service';
import { isAlphabetical, isNumeric, unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SalaryRuleService } from '../../services/salary-rule/salary-rule.service';
import {
  SalaryStructureValidityPeriodService
} from '../../services/salary-structure-validity-period/salary-structure-validity-period.service';
import { SalaryStructureService } from '../../services/salary-structure/salary-structure.service';


@Component({
  selector: 'app-add-salary-structure',
  templateUrl: './add-salary-structure.component.html',
  styleUrls: ['./add-salary-structure.component.scss']
})
export class AddSalaryStructureComponent implements OnInit, OnDestroy {

  salaryStructureFormGroup: FormGroup;
  public id: number;
  public disabledCheckboxRules = false;
  private predicate: PredicateFormat;
  isUpdateMode: boolean;
  /**verify if item will be deplicated */
  public isDuplicated =  false;
  private salaryStructureToUpdate: SalaryStructure = new SalaryStructure();
  private salaryStructureParent: SalaryStructure = new SalaryStructure();
  public salaryRuleList: Array<SalaryRule>;
  public currentSalaryStructureSalaryRuleList: Array<SalaryStructureValidityPeriodSalaryRule>;
  private savedRule: SalaryRule;
  private checkBoxMargin: number;
  public isDisabledParent = false;
  salaryStructureValidityPeriodStateEnumerator = SalaryRuleValidityPeriodStateEnumerator;
  language: string;
  public options = { year: 'numeric', month: 'long'};
  private isSaveOperation = false;
  public salaryStructureValidityPeriodTouched = false;
  public checkboxTouched = false;
  private subscriptions: Subscription[] = [];
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;

  constructor(private formBuilder: FormBuilder,
    private utilisService: UtilityService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private salaryStructureService: SalaryStructureService,
    private salaryRuleService: SalaryRuleService,
    public validationService: ValidationService,
      private swalWarrings: SwalWarring, private localStorageService: LocalStorageService,
    public serviceSalaryStructureValidityPeriod: SalaryStructureValidityPeriodService,
    private authService: AuthService, private styleConfigService: StyleConfigService) {
      this.checkRoutes();
      this.salaryRuleList = new Array<SalaryRule>();
      this.savedRule = new SalaryRule();
      this.currentSalaryStructureSalaryRuleList = new Array<SalaryStructureValidityPeriodSalaryRule>();
      this.checkBoxMargin = NumberConstant.ZERO;

      this.language = this.localStorageService.getLanguage();
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_SALARYSTRUCTURE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_SALARYSTRUCTURE);
    this.subscriptions.push(this.salaryRuleService.getSalaryRuleOrderedByApplicabilityThenByOrder().subscribe(data => {
      this.salaryRuleList = data;
      if (this.isUpdateMode || this.isDuplicated) {
        this.preparePredicate();
        this.getDataToUpdate(this.id);
        this.isDisabledParent = true;
      } else {
        this.createAddForm();
      }
    }));
  }

/** check route (update or depilcate item) */
private checkRoutes() {
  if (this.router.url.indexOf(ItemConstant.DUPLICATE_ITEM) < 0) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params[ItemConstant.ID] || 0;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    }));
  } else {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params[ItemConstant.CLONE_ID] || 0;
      this.isDuplicated = true;
    }));
  }
}
  /**
   * Create princial form group, salarystructure
   * @param salaryStructureToUpdate
   */
  private createAddForm(salaryStructureToUpdate?: SalaryStructure): void {
    this.salaryStructureFormGroup = this.formBuilder.group({
      Id: [salaryStructureToUpdate ? salaryStructureToUpdate.Id : NumberConstant.ZERO],
      Name: [salaryStructureToUpdate ? salaryStructureToUpdate.Name : '', Validators.required],
      SalaryStructureReference: [salaryStructureToUpdate ? salaryStructureToUpdate.SalaryStructureReference : '',
      { validators: [Validators.required, isAlphabetical()], asyncValidators:
        unique(SalaryStructureConstant.SALARY_STRUCTURE_REFERENCE, this.salaryStructureService, String(this.id)),
      updateOn: 'blur'
      }],
      Order: [{ value: salaryStructureToUpdate ?
        salaryStructureToUpdate.Order : '', disabled: this.isUpdateMode },
      [Validators.required, Validators.min(NumberConstant.ZERO), Validators.max(NumberConstant.FIFTY), isNumeric()]],
      Description: [salaryStructureToUpdate ? salaryStructureToUpdate.Description : ''],
      IdParent : [{ value: salaryStructureToUpdate ? salaryStructureToUpdate.IdParent : '',
        disabled: salaryStructureToUpdate ? salaryStructureToUpdate.Order === NumberConstant.ZERO : false }],
      SalaryStructureValidityPeriod: this.formBuilder.array([]),
    });
    if (salaryStructureToUpdate && salaryStructureToUpdate.SalaryStructureValidityPeriod.length > NumberConstant.ZERO) {
      salaryStructureToUpdate.SalaryStructureValidityPeriod.forEach(salaryStructureValidityPeriod => {
        this.SalaryStructureValidityPeriod.push(this.buildSalaryStructureValidityPeriodForm(salaryStructureValidityPeriod));
      });
    } else {
      this.SalaryStructureValidityPeriod.push(this.buildSalaryStructureValidityPeriodForm());
    }
    if (this.isUpdateMode && !this.hasUpdatePermission) {
      this.salaryStructureFormGroup.disable();
    }
  }

  /**
   * Build each validityperiod of salaryStructure
   * @param salaryStructureValidityPeriod
   */
  buildSalaryStructureValidityPeriodForm(salaryStructureValidityPeriod?: SalaryStructureValidityPeriod): FormGroup {
    const startDate = salaryStructureValidityPeriod ? new Date(salaryStructureValidityPeriod.StartDate) : undefined;
    const validityFormGroup = this.formBuilder.group({
      Id: [salaryStructureValidityPeriod ? salaryStructureValidityPeriod.Id : NumberConstant.ZERO],
      IdSalaryStructure: [this.isUpdateMode ? this.salaryStructureToUpdate.Id : NumberConstant.ZERO],
      StartDate: [salaryStructureValidityPeriod ? new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()) :
        '', [Validators.required]],
      IsDeleted: [false],
      State: [salaryStructureValidityPeriod ? salaryStructureValidityPeriod.State : NumberConstant.TWO],
      Hide: true,
      SalaryStructureValidityPeriodSalaryRule: this.formBuilder.array([])
    });
    if (salaryStructureValidityPeriod) {
      validityFormGroup.value.SalaryStructureValidityPeriodSalaryRule
        .push(this.buildSalaryStructureValidityPeriodSalaryRuleForm(validityFormGroup,
          salaryStructureValidityPeriod.SalaryStructureValidityPeriodSalaryRule));
    } else {
      validityFormGroup.value.SalaryStructureValidityPeriodSalaryRule
      .push(this.buildSalaryStructureValidityPeriodSalaryRuleForm(validityFormGroup));
    }
    return validityFormGroup;
  }

  buildSalaryStructureValidityPeriodSalaryRuleForm(validityFormGroup?: FormGroup,
    salaryStructureValidityPeriodSalaryRule?: SalaryStructureValidityPeriodSalaryRule[]) {
    let formArray: FormArray = new FormArray([]);
    if (validityFormGroup) {
      formArray = validityFormGroup.get(SalaryStructureConstant.SALARY_STRUCTURE_VALIDITY_PERIOD_SALARY_RULE) as FormArray;
    }
    this.salaryRuleList.forEach(salaryRule => {
      let formGroup: FormGroup;
      if (salaryStructureValidityPeriodSalaryRule) {
        const res = salaryStructureValidityPeriodSalaryRule.filter(x => x.IdSalaryRule === salaryRule.Id);
        const parentSalaryRulesIds = this.IdParent.value > NumberConstant.ZERO ? this.salaryStructureParent.SalaryStructureValidityPeriod
          .filter( x => x.State === this.salaryStructureValidityPeriodStateEnumerator.InProgress)[NumberConstant.ZERO]
          .SalaryStructureValidityPeriodSalaryRule.map(x => x.IdSalaryRule) : undefined;
        formGroup = this.formBuilder.group({
          Id: [res.length !== NumberConstant.ZERO ? res[NumberConstant.ZERO].Id : NumberConstant.ZERO],
          IdSalaryStructureValidityPeriod: [validityFormGroup.controls.Id.value],
          IdSalaryRule: [salaryRule.Id],
          IsDeleted: [false],
          Checked: [res.length !== NumberConstant.ZERO ? true : false],
          IsDisabledCheckbox: [(this.isUpdateMode && !this.hasUpdatePermission) ||
             (res.length !== NumberConstant.ZERO && (parentSalaryRulesIds === undefined ||
              parentSalaryRulesIds.includes(res[NumberConstant.ZERO].IdSalaryRule)))
            || validityFormGroup.controls[SharedConstant.STATE].value === this.salaryStructureValidityPeriodStateEnumerator.Expired],
          IdSalaryRuleNavigation: [salaryRule]
        });
      } else {
        formGroup = this.formBuilder.group({
          Id: [NumberConstant.ZERO],
          IdSalaryStructureValidityPeriod: [validityFormGroup.controls.Id.value],
          IdSalaryRule: [salaryRule.Id],
          IsDeleted: [false],
          Checked: [false],
          IsDisabledCheckbox: [false],
          IdSalaryRuleNavigation: [salaryRule]
        });
      }
      formArray.push(formGroup);
    });
    return formArray;
  }

  private getDataToUpdate(idSalaryStructure?: number): void {
    this.subscriptions.push(this.salaryStructureService.getSalaryStructureWithSalaryRules(idSalaryStructure).subscribe(data => {
      this.salaryStructureToUpdate = data;
      this.isDisabledParent = true;
      if (this.isDuplicated) {
        this.salaryStructureToUpdate.SalaryStructureReference = '';
        this.salaryStructureToUpdate.Name = '';
        const dateMax = this.utilisService.maxDateBetweendates(data.SalaryStructureValidityPeriod
          .filter( x => x.State !== NumberConstant.TWO).map( x => x.StartDate));
        this.salaryStructureToUpdate.SalaryStructureValidityPeriod = data.SalaryStructureValidityPeriod
          .filter(x => new Date(x.StartDate).toLocaleDateString() === dateMax.toLocaleDateString());
      }
      if (this.salaryStructureToUpdate.IdParent) {
        this.getStructureSalaryParentData(null, this.salaryStructureToUpdate.IdParent);
      } else {
        this.createAddForm(this.salaryStructureToUpdate);
      }
    }));
  }
  public getStructureSalaryParentData(item, id: number) {
    const parentId = item ? item.Id : id;
    this.subscriptions.push(this.salaryStructureService.getSalaryStructureWithSalaryRules(parentId).subscribe(data => {
      this.salaryStructureParent = data;
      if (this.salaryStructureParent != null) {
        this.salaryStructureParent.Id = NumberConstant.ZERO;
        if (item) {
        this.salaryStructureParent = this.salaryStructureFormGroup.getRawValue();
        }
        this.salaryStructureParent.SalaryStructureValidityPeriod = data.SalaryStructureValidityPeriod
          .filter( x => x.State === this.salaryStructureValidityPeriodStateEnumerator.InProgress);
        this.salaryStructureParent.SalaryStructureValidityPeriod[NumberConstant.ZERO].Id = NumberConstant.ZERO;
        this.salaryStructureParent.SalaryStructureValidityPeriod[NumberConstant.ZERO].IdSalaryStructure = NumberConstant.ZERO;
        this.salaryStructureParent.SalaryStructureValidityPeriod[NumberConstant.ZERO].IdSalaryStructureNavigation = null;
        this.salaryStructureParent.SalaryStructureValidityPeriod[NumberConstant.ZERO].SalaryStructureValidityPeriodSalaryRule
          .forEach( salaryRule => {
          salaryRule.Id = NumberConstant.ZERO;
        });
        if (item) {
          this.createAddForm(this.salaryStructureParent);
        } else if (item === null) {
          this.salaryStructureToUpdate.SalaryStructureValidityPeriod.forEach(period => {
            if (period.SalaryStructureValidityPeriodSalaryRule) {
              period.SalaryStructureValidityPeriodSalaryRule =
              period.SalaryStructureValidityPeriodSalaryRule.concat(
              this.salaryStructureParent.SalaryStructureValidityPeriod[NumberConstant.ZERO].SalaryStructureValidityPeriodSalaryRule);
            } else {
              period.SalaryStructureValidityPeriodSalaryRule = this.salaryStructureParent
                .SalaryStructureValidityPeriod[NumberConstant.ZERO].SalaryStructureValidityPeriodSalaryRule;
            }
          });
          this.createAddForm(this.salaryStructureToUpdate);
        }
      }
    }));
    this.disabledCheckboxRules = true;
}
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push.apply(this.predicate.Filter, [new Filter(SharedConstant.ID, Operation.eq, this.id)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(SalaryStructureConstant.SALARY_STRUCTURE_VALIDITY_PERIOD)]);
    this.predicate.Relation.push(new Relation(SalaryStructureConstant.ID_PARENT_NAVIGATION));
  }

  saveSalaryStructure() {
    this.salaryStructureFormGroup.updateValueAndValidity();
    if (this.salaryStructureFormGroup.valid) {
      const salaryStructureToSave: SalaryStructure = Object.assign({},
        this.salaryStructureToUpdate, this.salaryStructureFormGroup.getRawValue());
      salaryStructureToSave.SalaryStructureValidityPeriod.forEach(period => {
        period.SalaryStructureValidityPeriodSalaryRule = period.SalaryStructureValidityPeriodSalaryRule.filter(x => x.Checked);
        if (this.IdParent.value > NumberConstant.ZERO) {
          const idsSalaryRulesFromParent = this.salaryStructureParent.SalaryStructureValidityPeriod
            .filter( x => x.State === this.salaryStructureValidityPeriodStateEnumerator.InProgress)[NumberConstant.ZERO]
              .SalaryStructureValidityPeriodSalaryRule.map(x => x.IdSalaryRule);
          period.SalaryStructureValidityPeriodSalaryRule =
            period.SalaryStructureValidityPeriodSalaryRule.filter(x => !idsSalaryRulesFromParent.includes(x.IdSalaryRule));
        }
      });
      if (this.isUpdateMode) {
        this.salaryStructureService.checkIfSalaryStructureIsAssociatedWithAnyPayslip(salaryStructureToSave).toPromise().then(res => {
          if (res === true) {
            this.swalWarrings.CreateSwal(SalaryStructureConstant.SALARYSTRUCTURE_HAS_PAYSLIP_ERROR, undefined,
                SharedConstant.YES, SharedConstant.NO).then((result) => {
              if (result.value) {
                this.actionToSave(salaryStructureToSave);
              }
            });
          } else {
            this.actionToSave(salaryStructureToSave);
          }
        });
      } else {
        this.actionToSave(salaryStructureToSave);
      }
    } else {
      this.validationService.validateAllFormFields(this.salaryStructureFormGroup);
    }
  }

  private actionToSave(salaryStructureToSave: SalaryStructure) {
    this.isSaveOperation = true;
    this.subscriptions.push(this.salaryStructureService.save(salaryStructureToSave, !this.isUpdateMode).subscribe(res => {
      this.backToList();
    }));
  }

  public setSalaryStructureValidityPeriodsOfDataToUpdate(currentSalaryStructure: SalaryStructure) {
    if (currentSalaryStructure.SalaryStructureValidityPeriod) {
      for (const currentSalaryStructureValidityPeriod of currentSalaryStructure.SalaryStructureValidityPeriod) {
          this.SalaryStructureValidityPeriod.push(this.buildSalaryStructureValidityPeriodForm(currentSalaryStructureValidityPeriod));
      }
    }
  }

  /**
   * Add new salary structure validity period to the salary structure form
   *
   */
  addSalaryStructureValidityPeriod(): void {
    if (this.hasAddPermission || this.hasUpdatePermission) {
      if (this.IdParent.value) {
        this.SalaryStructureValidityPeriod.push(this.buildSalaryStructureValidityPeriodForm(
          this.salaryStructureParent.SalaryStructureValidityPeriod[NumberConstant.ZERO]));
      } else {
        this.SalaryStructureValidityPeriod.push(this.buildSalaryStructureValidityPeriodForm());
      }
    this.salaryStructureValidityPeriodTouched = true;
    }
  }

  backToList() {
    this.router.navigateByUrl(SalaryStructureConstant.LIST_URL);
  }
  changeOrder() {
    if (this.Order.value === NumberConstant.ZERO) {
      this.IdParent.setValue('');
      this.IdParent.disable();
    } else {
      this.IdParent.enable();
    }
  }

  getMarginSize(rule) {
    const level = NumberConstant.ONE;
    const margin = NumberConstant.TWENTY;
    // begin execution
    if (rule.Applicability === this.savedRule.Applicability) {
      if (rule.Order !== this.savedRule.Order) {
        this.checkBoxMargin++;
      }
    } else {
      this.checkBoxMargin = NumberConstant.ZERO;
    }
    // end execution
    // max margin controle
    if (this.checkBoxMargin > level) {
      this.checkBoxMargin = level;
    }
    this.savedRule = rule;
    return (this.checkBoxMargin * margin).toString().concat('px');
  }

  /**
   * Salary structure's validity period list
   */
  get SalaryStructureValidityPeriod(): FormArray {
    return this.salaryStructureFormGroup.get(SalaryStructureConstant.SALARY_STRUCTURE_VALIDITY_PERIOD) as FormArray;
  }

  get IdParent(): FormControl {
    return this.salaryStructureFormGroup.get(SalaryStructureConstant.ID_PARENT) as FormControl;
  }

  get SalaryStructureReference(): FormControl {
    return this.salaryStructureFormGroup.get(SalaryStructureConstant.SALARY_STRUCTURE_REFERENCE) as FormControl;
  }

  get Name(): FormControl {
    return this.salaryStructureFormGroup.get(SalaryStructureConstant.SALARY_STRUCTURE_NAME) as FormControl;
  }

  get Order(): FormControl {
    return this.salaryStructureFormGroup.get(SalaryStructureConstant.SALARY_STRUCTURE_ORDER) as FormControl;
  }

  isFormChanged(): boolean {
    if (this.salaryStructureFormGroup && (this.salaryStructureFormGroup.touched || this.salaryStructureValidityPeriodTouched
       || this.checkboxTouched )) {
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
