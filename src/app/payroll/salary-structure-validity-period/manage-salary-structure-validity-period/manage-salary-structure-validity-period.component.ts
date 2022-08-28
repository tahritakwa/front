import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Resource } from '../../../models/shared/ressource.model';
import { SalaryStructureService } from '../../services/salary-structure/salary-structure.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { SalaryStructureConstant } from '../../../constant/payroll/salary-structure.constant';
import { SalaryRuleService } from '../../services/salary-rule/salary-rule.service';
import { SalaryRule } from '../../../models/payroll/salary-rule.model';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { SalaryRuleValidityPeriodStateEnumerator } from '../../../models/enumerators/salaryRuleValidityPeriodStateEnumerator.model';

@Component({
  selector: 'app-manage-salary-structure-validity-period',
  templateUrl: './manage-salary-structure-validity-period.component.html',
  styleUrls: ['./manage-salary-structure-validity-period.component.scss']
})
export class ManageSalaryStructureValidityPeriodComponent implements OnInit {

  @Input() group: FormGroup;
  @Input() index: number;
  @Input() service: ResourceService<Resource>;
  @Output() formReady = new EventEmitter<FormGroup>();
  public salaryRuleList: Array<SalaryRule>;
  public test = new Array<FormGroup>();
  salaryStructureValidityPeriodStateEnumerator = SalaryRuleValidityPeriodStateEnumerator;
  private savedRule: SalaryRule;
  private checkBoxMargin: number;

  constructor(protected salaryStructureService: SalaryStructureService, protected salaryRuleService: SalaryRuleService) {
    this.savedRule = new SalaryRule();
    this.checkBoxMargin = 0;
  }

  get Id(): FormControl {
    return this.group.get(SharedConstant.ID) as FormControl;
  }

  get StartDate(): FormControl {
    return this.group.get(SharedConstant.START_DATE) as FormControl;
  }

  get State(): FormControl {
    return this.group.get(SharedConstant.STATE) as FormControl;
  }

  get SalaryStructureValidityPeriodSalaryRule(): FormArray {
    return this.group.get(SalaryStructureConstant.SALARY_STRUCTURE_VALIDITY_PERIOD_SALARY_RULE) as FormArray;
  }

  get SalaryStructureValidityPeriod(): FormArray {
    return this.group.get(SalaryStructureConstant.SALARY_STRUCTURE_VALIDITY_PERIOD_SALARY_RULE) as FormArray;
  }

  ngOnInit() {
    if (this.State.value === this.salaryStructureValidityPeriodStateEnumerator.Expired) {
      this.group.disable();
      this.SalaryStructureValidityPeriodSalaryRule.disable();
      this.SalaryStructureValidityPeriodSalaryRule.updateValueAndValidity();
    }
    this.loadSalaryRules();
  }

  loadSalaryRules() {
    this.salaryRuleService.getSalaryRuleOrderedByApplicabilityThenByOrder().subscribe(data => {
      this.salaryRuleList = data;

    });
  }

  public getId(dataItem): string {
    return this.index.toString().concat(SharedConstant.UNDERSCORE).concat(dataItem.IdSalaryRule.toString());
  }

  getMarginSize(rule: SalaryRule) {
    const level = NumberConstant.ONE;
    const margin = NumberConstant.TWENTY;
    // begin execution
    if (rule.Applicability === this.savedRule.Applicability) {
      if (rule.Order !== this.savedRule.Order) {
        this.checkBoxMargin++;
      }
    } else {
      this.checkBoxMargin = 0;
    }
    // end execution
    // max margin controle
    if (this.checkBoxMargin > level) {
      this.checkBoxMargin = level;
    }
    this.savedRule = rule;
    return (this.checkBoxMargin * margin).toString().concat('px');
  }


}
