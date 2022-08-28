import { PipeTransform, Pipe } from '@angular/core';
import { NumberConstant } from '../../../constant/utility/number.constant';

@Pipe({name: 'time'})
export class TimePipe implements PipeTransform {
  /**
   * Format a time by raising the seconds pane
   */
  transform(value: string) {
    if (value && value.length >= NumberConstant.FIVE) {
      return value.substring(NumberConstant.ZERO, NumberConstant.FIVE);
    } else {
      return value;
    }
  }
}
