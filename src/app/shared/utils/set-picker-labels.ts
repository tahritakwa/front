import { OwlDateTimeIntl } from 'ng-pick-datetime';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
@Injectable()
export class SetPickerLabels extends OwlDateTimeIntl  {
    public cancelBtnLabel = '';
    public setBtnLabel = '';
    constructor(public translate: TranslateService) {
        super();
        this.cancelBtnLabel = this.translate.instant(SharedConstant.CANCEL);
        this.setBtnLabel = this.translate.instant(SharedConstant.OKAY);
    }
}
