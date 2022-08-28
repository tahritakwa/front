import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { BonusConstant } from '../../../constant/payroll/bonus.constant';
import { dateValueGT, dateValueLT } from '../../../shared/services/validation/validation.service';
import { Observable } from 'rxjs/Observable';
import { UtilityService } from '../../../shared/services/utility/utility.service';
import { ReducedBonus } from '../../../models/payroll/reduced-bonus.model';
import { ContractBonusStateEnumerator } from '../../../models/enumerators/contractBonusStateEnumerator.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-contract-bonus-validity',
  templateUrl: './contract-bonus-validity.component.html',
  styleUrls: ['./contract-bonus-validity.component.scss']
})
export class ContractBonusValidityComponent implements OnInit , OnChanges {
  /**
   * Format Date
   */
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  @Input() ValidityFormGroup: FormGroup;
  @Input() contractStartDate: Date;
  @Input() contractEndDate: Date;
  public isFixeBonus = NumberConstant.ONE;
  /**
   * Contract bonus start date lower than validator observable
   */
  contractBonusStartDateLTObservable: Observable<Date>;
  /**
   * Contract bonus start date greater than validator observable
   */
  contractBonusStartDateGTObservable: Observable<Date>;
  /**
   * Contract bonus end date lower than validator observable
   */
  contractBonusEndDateLTObservable: Observable<Date>;
  /**
   * Contract bonus end date greater than validator observable
   */
  contractBonusEndDateGTObservable: Observable<Date>;

  contractBonusStateEnumerator = ContractBonusStateEnumerator;


  constructor(private utilityService: UtilityService, private translate: TranslateService) { }

  ngOnInit() { }

  ngOnChanges(): void {
    this.buildContractBonusValidators();
  }

  public receiveData(event: ReducedBonus) {
    this.BonusMinStartDate.patchValue(event.StartDate);
    this.buildContractBonusValidators();
  }


 buildContractBonusValidators() {
  this.contractBonusStartDateLTObservable = Observable.of(this.utilityService.minDateBetweendates([this.contractEndDate,
    this.ValidityEndDate.value]));
  this.contractBonusStartDateGTObservable = Observable.of(this.utilityService.maxDateBetweendates(
    this.BonusMinStartDate ?
    [this.contractStartDate, this.BonusMinStartDate.value] :
    [this.contractStartDate]));
  if (this.contractEndDate) {
    this.contractBonusEndDateLTObservable = Observable.of(new Date(this.contractEndDate));
  }
  this.contractBonusEndDateGTObservable = Observable.of(this.utilityService.maxDateBetweendates(
    this.BonusMinStartDate ?
    [this.contractStartDate, this.ValidityFormGroup.controls[BonusConstant.VALIDITY_START_DATE].value, this.BonusMinStartDate.value] :
    [this.contractStartDate, this.ValidityFormGroup.controls[BonusConstant.VALIDITY_START_DATE].value]));
   this.ValidityFormGroup.controls[BonusConstant.VALIDITY_START_DATE].setValidators([
     Validators.required,
     dateValueLT(this.contractBonusStartDateLTObservable),
     dateValueGT(this.contractBonusStartDateGTObservable),
   ]);
   this.ValidityFormGroup.controls[BonusConstant.VALIDITY_END_DATE].setValidators(
    this.contractBonusEndDateLTObservable ?
    [dateValueLT(this.contractBonusEndDateLTObservable), dateValueGT(this.contractBonusEndDateGTObservable)] :
    [dateValueGT(this.contractBonusEndDateGTObservable)]);
   this.ValidityStartDate.markAsTouched();
   this.ValidityStartDate.updateValueAndValidity();
   this.ValidityEndDate.markAsTouched();
   this.ValidityEndDate.updateValueAndValidity();
  }

  get IdBonus(): FormControl {
    return this.ValidityFormGroup.get(BonusConstant.ID_BONUS) as FormControl;
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

  get BonusMinStartDate(): FormControl {
    return this.ValidityFormGroup.get(BonusConstant.BONUS_MIN_START_DATE) as FormControl;
  }
  get State(): FormControl {
    return this.ValidityFormGroup.get(BonusConstant.STATE) as FormControl;
  }
}
