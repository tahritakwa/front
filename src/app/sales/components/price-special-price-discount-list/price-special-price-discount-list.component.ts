import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PricesConstant } from '../../../constant/sales/prices.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DiscountType } from '../../../models/enumerators/discount-type.enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { digitsAfterComma } from '../../../shared/services/validation/validation.service';

@Component({
  selector: 'app-price-special-price-discount-list',
  templateUrl: './price-special-price-discount-list.component.html',
  styleUrls: ['./price-special-price-discount-list.component.scss']
})
export class PriceSpecialPriceDiscountListComponent implements OnInit {

  @Input() priceFormGroup: FormGroup;
  @Input() hasUpdatePermission: boolean;
  @Input() currencyPrecesion : number;
  constructor(private fb: FormBuilder, private swalWarring: SwalWarring) { }

  ngOnInit() {
  }
  addDiscountDetail() {
    this.PriceSpecialPriceDiscountList.push(this.generatePriceDetail());
  }
  public get PriceSpecialPriceDiscountList(): FormArray {
    return this.priceFormGroup.get(PricesConstant.PRICE_SPECIAL_PRICE_DISCOUNT_LIST) as FormArray;
  }
  isRowVisible(priceDiscount) {
    return !priceDiscount.value.IsDeleted;
  }
  isAnyVisibleRowBeforePosition(position): boolean {
    let isAnyVisibleRowBeforePosition = false;
    for (let _i = 0; _i < position; _i++) {
      if (!this.PriceSpecialPriceDiscountList.at(_i).value.IsDeleted) {
        isAnyVisibleRowBeforePosition = true;
        break;
      }
    }
    return isAnyVisibleRowBeforePosition;
  }
  addCurrentPriceSpecialPriceDiscount(newDiscountFormGroup: FormGroup): void {
    this.PriceSpecialPriceDiscountList.push(newDiscountFormGroup);

  }
  public generatePriceDetail(isToDeleteId?: number): FormGroup {
    return this.fb.group({
      Id: [isToDeleteId ? isToDeleteId : NumberConstant.ZERO],
      StartDateTime: [isToDeleteId ? new Date() : ''],
      EndDateTime: [isToDeleteId ? new Date() : ''],
      SpecialPrice: ['', [digitsAfterComma(NumberConstant.FIVE)]],
      MinimumQuantity: ['', [digitsAfterComma(NumberConstant.FIVE)]],
      MaximumQuantity: ['', [digitsAfterComma(NumberConstant.FIVE)]],
      TypeOfPriceDetail: [DiscountType.SpecialPrice],
      IsDeleted: [isToDeleteId ? true : false],
    });
  }

  isEmptyElement(value: any): boolean {
    return !value.StartDateTime &&
      !value.EndDateTime &&
      !value.SpecialPrice &&
      !value.MinimumQuantity &&
      !value.MaximumQuantity;
  }

  public deletePriceSpecialPriceDiscount(priceDiscount: AbstractControl, index) {
    this.swalWarring.CreateDeleteSwal(PricesConstant.PRICE_DETAIL, PricesConstant.CETTE).then((result) => {
      if (result.value) {
        if (priceDiscount.value.Id !== NumberConstant.ZERO) {
          this.PriceSpecialPriceDiscountList.at(index).get(SharedConstant.IS_DELETED).setValue(true);
          Object.keys((this.PriceSpecialPriceDiscountList.at(index) as FormGroup).controls).forEach(key => {
            (this.PriceSpecialPriceDiscountList.at(index) as FormGroup).get(key).setErrors(null);
          });
        } else {
          this.PriceSpecialPriceDiscountList.removeAt(index);
        }
      }
    });
  }

  openCollapse() {
    if (this.PriceSpecialPriceDiscountList.getRawValue().filter(x => !x.IsDeleted).length === NumberConstant.ZERO) {
      this.addDiscountDetail();
    }
  }
  closeCollapse() {
    let physicalyDeletedElementNumber = NumberConstant.ZERO;
    this.PriceSpecialPriceDiscountList.getRawValue().forEach((value, indexInList) => {
      if (this.isEmptyElement(value)) {
        const realIndex = indexInList - physicalyDeletedElementNumber;
        if (value.Id !== NumberConstant.ZERO) {
          this.initControlToEmpty(value.Id, realIndex);
        } else {
          this.PriceSpecialPriceDiscountList.removeAt(realIndex);
          physicalyDeletedElementNumber++;
        }
      }
    });
  }

  
  initControlToEmpty(id: number, index: number) {
    this.PriceSpecialPriceDiscountList.setControl(index, this.generatePriceDetail(id));
  }

}