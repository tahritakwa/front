import {Component, Input, OnInit} from '@angular/core';
import {TiersConstants} from '../../constant/purchase/tiers.constant';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  @Input() list = [];
  @Input() tierType;

  constructor(private translate: TranslateService) {
  }

  GoToLink(item) {
    window.open(item.MainLink, '_blank');
  }

  public getNoActivityMessage() {
    return this.tierType === TiersConstants.CUSTOMER_TYPE ?
      this.translate.instant(TiersConstants.NO_ACTIVITY_TO_CUSTOMER)
      : TiersConstants.SUPPLIER_TYPE ? this.translate.instant(TiersConstants.NO_ACTIVITY_TO_SUPPLIER) : SharedConstant.EMPTY;
  }
}
