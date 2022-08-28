import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BenefitInKindConstant } from '../../../constant/payroll/benefit-in-kind.constant';
import { BonusConstant } from '../../../constant/payroll/bonus.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { BenefitInKindStateEnumerator } from '../../../models/enumerators/benefitInKindStateEnumerator.model';
import { UtilityService } from '../../services/utility/utility.service';
import { dateValueGT, dateValueLT } from '../../services/validation/validation.service';

@Component({
  selector: 'app-benefit-in-kind-validity',
  templateUrl: './benefit-in-kind-validity.component.html',
  styleUrls: ['./benefit-in-kind-validity.component.scss']
})
export class BenefitInKindValidityComponent implements OnInit, OnChanges {
  /**
   * Format Date
   */
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  @Input() ValidityFormGroup: FormGroup;
  @Input() contractStartDate: Date;
  @Input() contractEndDate: Date;
  /**
   * Benefit In Kind start date lower than validator observable
   */
  benefitInKindStartDateLTObservable: Observable<Date>;
  /**
   * Benefit In Kind start date greater than validator observable
   */
  benefitInKindStartDateGTObservable: Observable<Date>;
  /**
   * Benefit In Kind end date lower than validator observable
   */
  benefitInKindEndDateLTObservable: Observable<Date>;
  /**
   * Benefit In Kind end date greater than validator observable
   */
  benefitInKindEndDateGTObservable: Observable<Date>;
  benefitInKindStateEnumerator = BenefitInKindStateEnumerator;

  constructor(private utilityService: UtilityService, private translate: TranslateService) {
  }

  get IdBenefitInKind(): FormControl {
    return this.ValidityFormGroup.get(BenefitInKindConstant.ID_BENEFIT_IN_KIND) as FormControl;
  }

  get ValidityStartDate(): FormControl {
    return this.ValidityFormGroup.get(BonusConstant.VALIDITY_START_DATE) as FormControl;
  }

  get ValidityEndDate(): FormControl {
    return this.ValidityFormGroup.get(BonusConstant.VALIDITY_END_DATE) as FormControl;
  }

  get Value(): FormControl {
    return this.ValidityFormGroup.get(BonusConstant.VALUE) as FormControl;
  }

  get State(): FormControl {
    return this.ValidityFormGroup.get(BonusConstant.STATE) as FormControl;
  }

  ngOnInit() {
  }

  ngOnChanges(): void {
    this.buildbenefitInKindValidators();
  }

  buildbenefitInKindValidators() {
    this.benefitInKindStartDateLTObservable = Observable.of(this.utilityService.minDateBetweendates([this.contractEndDate,
      this.ValidityEndDate.value]));
    this.benefitInKindStartDateGTObservable = Observable.of(this.contractStartDate);
    if (this.contractEndDate) {
      this.benefitInKindEndDateLTObservable = Observable.of(new Date(this.contractEndDate));
    }
    this.benefitInKindEndDateGTObservable = Observable.of(this.utilityService.maxDateBetweendates(
      [this.contractStartDate, this.ValidityFormGroup.controls[BonusConstant.VALIDITY_START_DATE].value]));
    this.ValidityFormGroup.controls[BonusConstant.VALIDITY_START_DATE].setValidators([
      Validators.required,
      dateValueLT(this.benefitInKindStartDateLTObservable),
      dateValueGT(this.benefitInKindStartDateGTObservable),
    ]);
    this.ValidityFormGroup.controls[BonusConstant.VALIDITY_END_DATE].setValidators(
      this.benefitInKindEndDateLTObservable ?
        [dateValueLT(this.benefitInKindEndDateLTObservable), dateValueGT(this.benefitInKindEndDateGTObservable)] :
        [dateValueGT(this.benefitInKindEndDateGTObservable)]);
    this.ValidityStartDate.markAsTouched();
    this.ValidityStartDate.updateValueAndValidity();
    this.ValidityEndDate.markAsTouched();
    this.ValidityEndDate.updateValueAndValidity();
  }
}
