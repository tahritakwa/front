import { Injectable } from '@angular/core';
import { NumberConstant } from '../../../constant/utility/number.constant';

@Injectable()
export class UtilityService {

  constructor() { }

  public minDateBetweendates(element: any []): Date {
    const array = this.convertInDates(element);
    const date = new Date(Math.min.apply(null, array));
    date.setHours(NumberConstant.ZERO, NumberConstant.ZERO,
      NumberConstant.ZERO, NumberConstant.ZERO);
      return date;
  }

  public maxDateBetweendates(element: any []): Date {
    const array = this.convertInDates(element);
    const date = new Date(Math.max.apply(null, array));
    date.setHours(NumberConstant.ZERO, NumberConstant.ZERO,
      NumberConstant.ZERO, NumberConstant.ZERO);
      return date;
  }

  private convertInDates(element: any []): Date [] {
    const array = [];
    element.forEach(date => {
      if (date) {
        array.push(new Date(date));
      }
    });
    return array;
  }
}
