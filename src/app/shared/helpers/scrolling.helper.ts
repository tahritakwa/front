import {NumberConstant} from '../../constant/utility/number.constant';
import {ElementRef} from '@angular/core';

/**
 * scroll to invalid control by div
 * @param querySelector
 * @param elementRef
 */
export function scrollToInvalidField(querySelector, elementRef: ElementRef): void {
  const invalidControl = elementRef.nativeElement.querySelector(querySelector);
  const labelOffset = NumberConstant.FIFTY;
  window.scroll({
    top: invalidControl.getBoundingClientRect().top + window.scrollY - labelOffset,
    left: NumberConstant.ZERO,
    behavior: 'smooth'
  });
}
