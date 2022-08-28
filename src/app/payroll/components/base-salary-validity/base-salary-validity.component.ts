import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Observable } from 'rxjs/Observable';
import { dateValueLT, dateValueGT } from '../../../shared/services/validation/validation.service';
import { BaseSalaryStateEnumerator } from '../../../models/enumerators/baseSalaryStateEnumerator.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-base-salary-validity',
  templateUrl: './base-salary-validity.component.html',
  styleUrls: ['./base-salary-validity.component.scss']
})
export class BaseSalaryValidityComponent implements OnInit, OnChanges {
  @Input() ValidityFormGroup: FormGroup;
  @Input() contractStartDate: Date;
  @Input() contractEndDate: Date;
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  baseSalaryStateEnumerator = BaseSalaryStateEnumerator;
  constructor(private translate: TranslateService) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[ContractConstant.CONTRACT_START_DATE]) {
      let previousValue = changes[ContractConstant.CONTRACT_START_DATE].previousValue;
      let currentValue = changes[ContractConstant.CONTRACT_START_DATE].currentValue;
      if ((!this.StartDate.value || this.StartDate.value === '') && currentValue) {
        this.StartDate.setValue(this.contractStartDate);
      } else if (previousValue && this.StartDate.value) {
        const startDate = new Date(this.StartDate.value);
        startDate.setHours(NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO);
        const StartDateTime = startDate.getTime();
        previousValue = new Date(previousValue);
        previousValue.setHours(NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO);
        currentValue = new Date(currentValue);
        currentValue.setHours(NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO);
        // If the current start date of the base salary is equal to the old start date of the contract or
        // Or if the current start date of the contract is greater than the start date of the current frequency
        // then synchronize the two dates so that they are equal
        if ((StartDateTime === new Date(previousValue).getTime()) ||
          (currentValue && new Date(currentValue).getTime() > StartDateTime)) {
          this.StartDate.setValue(this.contractStartDate);
        }
      }
    }
    this.buildBaseSalaryValidators();
  }

  /**
   * Build base salary validators
   */
  buildBaseSalaryValidators() {
     this.ValidityFormGroup.controls[ContractConstant.START_DATE].setValidators([
       Validators.required,
       this.contractEndDate ? dateValueLT(Observable.of(this.contractEndDate)) : dateValueLT(Observable.of(null)),
       this.contractStartDate ? dateValueGT(Observable.of(this.contractStartDate)) : dateValueGT(Observable.of(null)),
     ]);
     this.StartDate.markAsTouched();
     this.StartDate.updateValueAndValidity();
  }

  get Value(): FormControl {
    return this.ValidityFormGroup.get(ContractConstant.VALUE) as FormControl;
  }
  get StartDate(): FormControl {
    return this.ValidityFormGroup.get(ContractConstant.START_DATE) as FormControl;
  }
  get State(): FormControl {
    return this.ValidityFormGroup.get(ContractConstant.STATE) as FormControl;
  }
}
