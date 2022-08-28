import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PricesConstant } from '../../../constant/sales/prices.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DiscountType } from '../../../models/enumerators/discount-type.enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { digitsAfterComma } from '../../../shared/services/validation/validation.service';

@Component({
  selector: 'app-price-gifted-items-discount-list',
  templateUrl: './price-gifted-items-discount-list.component.html',
  styleUrls: ['./price-gifted-items-discount-list.component.scss']
})
export class PriceGiftedItemsDiscountListComponent implements OnInit {

  @Input() priceFormGroup: FormGroup;

  constructor(private fb: FormBuilder, private swalWarring: SwalWarring) { }

  ngOnInit() {
  }
  addDiscountDetail() {
    this.PriceGiftedItemsDiscountList.push(this.generatePriceDetail());
  }
  public get PriceGiftedItemsDiscountList(): FormArray {
    return this.priceFormGroup.get(PricesConstant.PRICE_GIFTED_ITEMS_DISCOUNT_LIST) as FormArray;
  }
  isRowVisible(priceDiscount) {
    return !priceDiscount.value.IsDeleted;
  }
  isAnyVisibleRowBeforePosition(position): boolean {
    let isAnyVisibleRowBeforePosition = false;
    for (let _i = 0; _i < position; _i++) {
      if (!this.PriceGiftedItemsDiscountList.at(_i).value.IsDeleted) {
        isAnyVisibleRowBeforePosition = true;
        break;
      }
    }
    return isAnyVisibleRowBeforePosition;
  }
  addCurrentPriceGiftedItemsDiscount(newDiscountFormGroup: FormGroup): void {
    this.PriceGiftedItemsDiscountList.push(newDiscountFormGroup);

  }
  public generatePriceDetail(isToDeleteId?: number): FormGroup {
    return this.fb.group({
      Id: [isToDeleteId ? isToDeleteId : NumberConstant.ZERO],
      StartDateTime: [isToDeleteId ? new Date() : ''],
      EndDateTime: [isToDeleteId ? new Date() : ''],
      SaledItemsNumber: ['', [digitsAfterComma(NumberConstant.FIVE)]],
      GiftedItemsNumber: ['', [digitsAfterComma(NumberConstant.FIVE)]],
      TypeOfPriceDetail: [DiscountType.GiftedItems],
      IsDeleted: [isToDeleteId ? true : false],
    });
  }

  isEmptyElement(value: any): boolean {
    return !value.StartDateTime &&
      !value.EndDateTime &&
      !value.SaledItemsNumber &&
      !value.GiftedItemsNumber;
  }
  public deletePriceGiftedItemsDiscount(priceDiscount: AbstractControl, index) {
    this.swalWarring.CreateDeleteSwal(PricesConstant.PRICE_DETAIL, PricesConstant.CETTE).then((result) => {
      if (result.value) {
        if (priceDiscount.value.Id !== NumberConstant.ZERO) {
          this.PriceGiftedItemsDiscountList.at(index).get(SharedConstant.IS_DELETED).setValue(true);
          Object.keys((this.PriceGiftedItemsDiscountList.at(index) as FormGroup).controls).forEach(key => {
            (this.PriceGiftedItemsDiscountList.at(index) as FormGroup).get(key).setErrors(null);
          });
        } else {
          this.PriceGiftedItemsDiscountList.removeAt(index);
        }
      }
    });
  }

  openCollapse() {
    if (this.PriceGiftedItemsDiscountList.getRawValue().filter(x => !x.IsDeleted).length === NumberConstant.ZERO) {
      this.addDiscountDetail();
    }
  }
  closeCollapse() {
    let physicalyDeletedElementNumber = NumberConstant.ZERO;
    this.PriceGiftedItemsDiscountList.getRawValue().forEach((value, indexInList) => {
      if (this.isEmptyElement(value)) {
        const realIndex = indexInList - physicalyDeletedElementNumber;
        if (value.Id !== NumberConstant.ZERO) {
          this.initControlToEmpty(value.Id, realIndex);
        } else {
          this.PriceGiftedItemsDiscountList.removeAt(realIndex);
          physicalyDeletedElementNumber++;
        }
      }
    });
  }

  initControlToEmpty(id: number, index: number) {
    this.PriceGiftedItemsDiscountList.setControl(index, this.generatePriceDetail(id));
  }

}

