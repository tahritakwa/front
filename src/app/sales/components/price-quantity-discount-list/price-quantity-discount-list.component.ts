import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PricesConstant } from '../../../constant/sales/prices.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DiscountType } from '../../../models/enumerators/discount-type.enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { digitsAfterComma } from '../../../shared/services/validation/validation.service';

@Component({
  selector: 'app-price-quantity-discount-list',
  templateUrl: './price-quantity-discount-list.component.html',
  styleUrls: ['./price-quantity-discount-list.component.scss']
})
export class PriceQuantityDiscountListComponent implements OnInit {

  @Input() priceFormGroup: FormGroup;
  @Input() hasUpdatePermission: boolean;
  constructor(private fb: FormBuilder, private swalWarring: SwalWarring) { }

  ngOnInit() {
  }
  addDiscountDetail() {
    this.PriceQuantityDiscountList.push(this.generatePriceDetail());
  }
  public get PriceQuantityDiscountList(): FormArray {
    return this.priceFormGroup.get(PricesConstant.PRICE_QUANTITY_DISCOUNT_LIST) as FormArray;
  }
  isRowVisible(priceDiscount) {
    return !priceDiscount.value.IsDeleted;
  }
  isAnyVisibleRowBeforePosition(position): boolean {
    let isAnyVisibleRowBeforePosition = false;
    for (let _i = 0; _i < position; _i++) {
      if (!this.PriceQuantityDiscountList.at(_i).value.IsDeleted) {
        isAnyVisibleRowBeforePosition = true;
        break;
      }
    }
    return isAnyVisibleRowBeforePosition;
  }
  addCurrentPriceQuantityDiscount(newDiscountFormGroup: FormGroup): void {
    this.PriceQuantityDiscountList.push(newDiscountFormGroup);

  }
  public generatePriceDetail(isToDeleteId?: number): FormGroup {
    return this.fb.group({
      Id: [isToDeleteId ? isToDeleteId : NumberConstant.ZERO],
      StartDateTime: [isToDeleteId ? new Date() : ''],
      EndDateTime: [isToDeleteId ? new Date() : ''],
      Percentage: ['', [digitsAfterComma(NumberConstant.FIVE)]],
      MinimumQuantity: ['',  [digitsAfterComma(NumberConstant.FIVE)]],
      MaximumQuantity: ['',  [digitsAfterComma(NumberConstant.FIVE)]],
      TypeOfPriceDetail: [DiscountType.Quantity],
      IsDeleted: [isToDeleteId ? true : false],
    });
  }
  isEmptyElement(value: any): boolean {
    return !value.StartDateTime &&
      !value.EndDateTime &&
      !value.Percentage &&
      !value.MinimumQuantity &&
      !value.MaximumQuantity;
  }
  public deletePriceQuantityDiscount(priceDiscount: AbstractControl, index) {
    this.swalWarring.CreateDeleteSwal(PricesConstant.PRICE_DETAIL, PricesConstant.CETTE).then((result) => {
      if (result.value) {
        if (priceDiscount.value.Id !== NumberConstant.ZERO) {
          this.PriceQuantityDiscountList.at(index).get(SharedConstant.IS_DELETED).setValue(true);
          Object.keys((this.PriceQuantityDiscountList.at(index) as FormGroup).controls).forEach(key => {
            (this.PriceQuantityDiscountList.at(index) as FormGroup).get(key).setErrors(null);
          });
        } else {
          this.PriceQuantityDiscountList.removeAt(index);
        }
      }
    });
  }

  openCollapse() {
    if (this.PriceQuantityDiscountList.getRawValue().filter(x => !x.IsDeleted).length === NumberConstant.ZERO) {
      this.addDiscountDetail();
    }
  }
  closeCollapse() {
    let physicalyDeletedElementNumber = NumberConstant.ZERO;
    this.PriceQuantityDiscountList.getRawValue().forEach((value, indexInList) => {
      if (this.isEmptyElement(value)) {
        const realIndex = indexInList - physicalyDeletedElementNumber;
        if (value.Id !== NumberConstant.ZERO) {
          this.initControlToEmpty(value.Id, realIndex);
        } else {
          this.PriceQuantityDiscountList.removeAt(realIndex);
          physicalyDeletedElementNumber++;
        }
      }
    });
  }

  initControlToEmpty(id: number, index: number) {
    this.PriceQuantityDiscountList.setControl(index, this.generatePriceDetail(id));
  }

}
