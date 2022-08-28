import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { PricesConstant } from '../../../constant/sales/prices.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { dateTimeValueGT, dateTimeValueLT, digitsAfterComma } from '../../../shared/services/validation/validation.service';

@Component({
  selector: 'app-price-gifted-items-discount',
  templateUrl: './price-gifted-items-discount.component.html',
  styleUrls: ['./price-gifted-items-discount.component.scss']
})
export class PriceGiftedItemsDiscountComponent implements AfterViewInit {
  @Input() formGroupInput: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngAfterViewInit() {
    this.addSimpleValidators();
    this.addDatesValidators();
  }

  private addSimpleValidators() {
    this.SaledItemsNumber.setValidators([Validators.required, digitsAfterComma(NumberConstant.FIVE),
    Validators.min(0)]);
    this.GiftedItemsNumber.setValidators([Validators.required, digitsAfterComma(NumberConstant.FIVE),
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
  get StartDateTime(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.START_DATE_TIME);
  }
  get EndDateTime(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.END_DATE_TIME);
  }
  get SaledItemsNumber(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.SALED_ITEMS_NUMBER);
  }
  get GiftedItemsNumber(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.GIFTED_ITEMS_NUMBER);
  }

}
