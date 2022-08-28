import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PricesConstant } from '../../../constant/sales/prices.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DiscountType } from '../../../models/enumerators/discount-type.enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { digitsAfterComma } from '../../../shared/services/validation/validation.service';

@Component({
  selector: 'app-price-total-purchases-discount-list',
  templateUrl: './price-total-purchases-discount-list.component.html',
  styleUrls: ['./price-total-purchases-discount-list.component.scss']
})
export class PriceTotalPurchasesDiscountListComponent implements OnInit {

  @Input() priceFormGroup: FormGroup;

  constructor(private fb: FormBuilder, private swalWarring: SwalWarring) { }

  ngOnInit() {
  }
  addDiscountDetail() {
    this.PriceTotalPurchasesDiscountList.push(this.generatePriceDetail());
  }
  public get PriceTotalPurchasesDiscountList(): FormArray {
    return this.priceFormGroup.get(PricesConstant.PRICE_TOTAL_PURCHASES_DISCOUNT_LIST) as FormArray;
  }
  isRowVisible(priceDiscount) {
    return !priceDiscount.value.IsDeleted;
  }
  isAnyVisibleRowBeforePosition(position): boolean {
    let isAnyVisibleRowBeforePosition = false;
    for (let _i = 0; _i < position; _i++) {
      if (!this.PriceTotalPurchasesDiscountList.at(_i).value.IsDeleted) {
        isAnyVisibleRowBeforePosition = true;
        break;
      }
    }
    return isAnyVisibleRowBeforePosition;
  }
  addCurrentPriceTotalPurchasesDiscount(newDiscountFormGroup: FormGroup): void {
    this.PriceTotalPurchasesDiscountList.push(newDiscountFormGroup);

  }
  public generatePriceDetail(isToDeleteId?: number): FormGroup {
    return this.fb.group({
      Id: [isToDeleteId ? isToDeleteId : NumberConstant.ZERO],
      StartDateTime: [isToDeleteId ? new Date() : ''],
      EndDateTime: [isToDeleteId ? new Date() : ''],
      Percentage: ['', [digitsAfterComma(NumberConstant.FIVE)]],
      ReducedValue: ['', [digitsAfterComma(NumberConstant.FIVE)]],
      TotalPrices: ['', [digitsAfterComma(NumberConstant.FIVE)]],
      TypeOfPriceDetail: [DiscountType.TotalPurchases],
      IsDeleted: [isToDeleteId ? true : false],
    });
  }

  isEmptyElement(value: any): boolean {
    return !value.StartDateTime &&
      !value.EndDateTime &&
      !value.Percentage &&
      !value.ReducedValue &&
      !value.TotalPrices;
  }
  public deletePriceTotalPurchasesDiscount(priceDiscount: AbstractControl, index) {
    this.swalWarring.CreateDeleteSwal(PricesConstant.PRICE_DETAIL, PricesConstant.CETTE).then((result) => {
      if (result.value) {
        if (priceDiscount.value.Id !== NumberConstant.ZERO) {
          this.PriceTotalPurchasesDiscountList.at(index).get(SharedConstant.IS_DELETED).setValue(true);
          Object.keys((this.PriceTotalPurchasesDiscountList.at(index) as FormGroup).controls).forEach(key => {
            (this.PriceTotalPurchasesDiscountList.at(index) as FormGroup).get(key).setErrors(null);
          });
        } else {
          this.PriceTotalPurchasesDiscountList.removeAt(index);
        }
      }
    });
  }

  openCollapse() {
    if (this.PriceTotalPurchasesDiscountList.getRawValue().filter(x => !x.IsDeleted).length === NumberConstant.ZERO) {
      this.addDiscountDetail();
    }
  }
  closeCollapse() {
    let physicalyDeletedElementNumber = NumberConstant.ZERO;
    this.PriceTotalPurchasesDiscountList.getRawValue().forEach((value, indexInList) => {
      if (this.isEmptyElement(value)) {
        const realIndex = indexInList - physicalyDeletedElementNumber;
        if (value.Id !== NumberConstant.ZERO) {
          this.initControlToEmpty(value.Id, realIndex);
        } else {
          this.PriceTotalPurchasesDiscountList.removeAt(realIndex);
          physicalyDeletedElementNumber++;
        }
      }
    });
  }

  initControlToEmpty(id: number, index: number) {
    this.PriceTotalPurchasesDiscountList.setControl(index, this.generatePriceDetail(id));
  }

}
