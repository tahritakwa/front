import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { PricesConstant } from '../../../constant/sales/prices.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { dateTimeValueGT, dateTimeValueLT, digitsAfterComma } from '../../../shared/services/validation/validation.service';

@Component({
  selector: 'app-price-total-purchases-discount',
  templateUrl: './price-total-purchases-discount.component.html',
  styleUrls: ['./price-total-purchases-discount.component.scss']
})
export class PriceTotalPurchasesDiscountComponent implements AfterViewInit {
  @Input() formGroupInput: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngAfterViewInit() {
    this.addSimpleValidators();
    this.addDatesValidators();
  }

  private addSimpleValidators() {
    this.TotalPrices.setValidators([Validators.required, digitsAfterComma(NumberConstant.FIVE),
    Validators.min(0)]);
    this.setPercentageAndReducedValueRequirement();
    this.Percentage.valueChanges.subscribe(() => {
      if (!this.percentageEmpty()) {
        this.ReducedValue.setValue('');
      }
      this.setPercentageAndReducedValueRequirement();
    });
    this.ReducedValue.valueChanges.subscribe(() => {
      if (!this.reducedValueEmpty()) {
        this.Percentage.setValue('');
      }
      this.setPercentageAndReducedValueRequirement();
    });
  }

  setPercentageAndReducedValueRequirement() {
    if (this.reducedValueEmpty() && !this.percentageEmpty()) {
      this.setPercentageRequiredAndReducedValueNotRequired();
    } else if (this.percentageEmpty() && !this.reducedValueEmpty()) {
      this.setPercentageNotRequiredAndReducedValueRequired();
    } else {
      this.setPercentageAndReducedValueRequired();
    }
    this.formGroupInput.updateValueAndValidity();
  }
  setPercentageAndReducedValueRequired() {
    this.Percentage.setValidators([Validators.required, digitsAfterComma(NumberConstant.FIVE),
    Validators.min(0), Validators.max(100)]);
    this.ReducedValue.setValidators([Validators.required, digitsAfterComma(NumberConstant.FIVE),
    Validators.min(0)]);
  }
  setPercentageRequiredAndReducedValueNotRequired() {
    this.ReducedValue.setErrors(null);
    this.Percentage.setValidators([Validators.required, digitsAfterComma(NumberConstant.FIVE),
    Validators.min(0), Validators.max(100)]);
    this.ReducedValue.setValidators([Validators.min(0), digitsAfterComma(NumberConstant.FIVE),]);
  }
  setPercentageNotRequiredAndReducedValueRequired() {
    this.Percentage.setErrors(null);
    this.Percentage.setValidators([Validators.min(0), Validators.max(100), digitsAfterComma(NumberConstant.FIVE),]);
    this.ReducedValue.setValidators([Validators.required, digitsAfterComma(NumberConstant.FIVE),
    Validators.min(0)]);
  }

  private addDatesValidators(): void {
    this.setStartDateControl();
    this.setEndDateControl();
    this.StartDateTime.valueChanges.subscribe(() => {
      if (this.EndDateTime.hasError(PricesConstant.DATE_VALUE_GT)) {
        this.EndDateTime.setErrors(null);
      }
    });
    this.EndDateTime.valueChanges.subscribe(() => {
      if (this.StartDateTime.hasError(PricesConstant.DATE_VALUE_LT)) {
        this.StartDateTime.setErrors(null);
      }
    });
  }
  private setStartDateControl(): void {
    const oEndDate = new Observable<Date>(observer => observer.next(this.EndDateTime.value));
    this.formGroupInput.setControl(PricesConstant.START_DATE_TIME, this.fb.control(this.StartDateTime.value,
      [Validators.required, dateTimeValueLT(oEndDate)]));

  }
  private setEndDateControl(): void {
    const oStartDate = new Observable<Date>(observer => observer.next(this.StartDateTime.value));
    this.formGroupInput.setControl(PricesConstant.END_DATE_TIME, this.fb.control(this.EndDateTime.value,
      [Validators.required, dateTimeValueGT(oStartDate)]));

  }
  percentageEmpty(): boolean {
    return !this.Percentage.value;
  }
  reducedValueEmpty(): boolean {
    return !this.ReducedValue.value;
  }

  get TotalPrices(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.TOTAL_PRICES);
  }
  get StartDateTime(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.START_DATE_TIME);
  }
  get EndDateTime(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.END_DATE_TIME);
  }
  get Percentage(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.PERCENTAGE);
  }
  get ReducedValue(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.REDUCED_VALUE);
  }

}