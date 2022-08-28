import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { PricesConstant } from '../../../constant/sales/prices.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { dateTimeValueGT, dateTimeValueLT, digitsAfterComma, greaterOrEqualThan, lowerOrEqualThan } from '../../../shared/services/validation/validation.service';

@Component({
  selector: 'app-price-special-price-discount',
  templateUrl: './price-special-price-discount.component.html',
  styleUrls: ['./price-special-price-discount.component.scss']
})
export class PriceSpecialPriceDiscountComponent implements AfterViewInit {
  @Input() formGroupInput: FormGroup;
  @Input() currencyPrecesion: number;

  constructor(private fb: FormBuilder) { }

  ngAfterViewInit() {
    this.addSimpleValidators();
    this.addDatesValidators();
    this.addQuantitiesValidators();
  }

  private addSimpleValidators() {
    this.SpecialPrice.setValidators([Validators.required, digitsAfterComma(this.currencyPrecesion ? this.currencyPrecesion :NumberConstant.FIVE),
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
  private addQuantitiesValidators() {
    this.MinQuantity.setValidators([
      Validators.required,
      Validators.min(0),
      digitsAfterComma(NumberConstant.FIVE),
      lowerOrEqualThan(new Observable(o => o.next(this.MaxQuantity.value)))]);
    this.MaxQuantity.setValidators([
      Validators.required,
      Validators.min(0),
      digitsAfterComma(NumberConstant.FIVE),
      greaterOrEqualThan(new Observable(o => o.next(this.MinQuantity.value)))]);
    this.MinQuantity.valueChanges.subscribe(() => {
      if (this.MaxQuantity.hasError(PricesConstant.STRICT_SUP)) {
        this.MaxQuantity.setErrors(null);
      }
    });
    this.MaxQuantity.valueChanges.subscribe(() => {
      if (this.MinQuantity.hasError(PricesConstant.STRICT_INF)) {
        this.MinQuantity.setErrors(null);
      }
    });
  }

  get MaxQuantity(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.MAXIMUM_QUANTITY);
  }
  get MinQuantity(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.MINIMUM_QUANTITY);
  }
  get StartDateTime(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.START_DATE_TIME);
  }
  get EndDateTime(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.END_DATE_TIME);
  }
  get SpecialPrice(): FormControl {
    return <FormControl>this.formGroupInput.get(PricesConstant.SPECIAL_PRICE);
  }

}
