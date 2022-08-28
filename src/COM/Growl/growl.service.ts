import {Injectable} from '@angular/core';
import {htmlToPlaintext} from '../../app/shared/helpers/string.helper';
import {TranslateService} from '@ngx-translate/core';
import {NumberConstant} from '../../app/constant/utility/number.constant';
import {SnotifyPosition, SnotifyService, SnotifyToast} from 'ng-snotify';

@Injectable()
export class GrowlService {
  shortConfig = {
    closeOnClick: true,
    timeout: 3000,
    showProgressBar: false,
    position: SnotifyPosition.rightTop,
    toast: SnotifyToast,
    titleMaxLength: 100,
    pauseOnHover: true,
    newOnTop: false
  };
  meduimConfig = {
    closeOnClick: true,
    timeout: 5000,
    showProgressBar: false,
    position: SnotifyPosition.rightTop,
    toast: SnotifyToast,
    titleMaxLength: 100,
    pauseOnHover: true,
    newOnTop: false
  };
  longConfig = {
    closeOnClick: true,
    timeout: 7000,
    showProgressBar: false,
    position: SnotifyPosition.rightTop,
    toast: SnotifyToast,
    titleMaxLength: 100,
    pauseOnHover: true,
    newOnTop: false
  };

  constructor(private snotifyService: SnotifyService, private translate: TranslateService) {
    this.snotifyService.setDefaults({ global: { maxAtPosition: NumberConstant.THREE, maxOnScreen: NumberConstant.THREE } });
  }

  public successNotification(message?: string, messages?: Array<string>) {
    this.snotifyService.success(message, this.shortConfig);
  }

  public warningNotification(message?: string, messages?: Array<string>) {
    this.snotifyService.warning(message, this.meduimConfig);
  }

  public ErrorNotification(message?: string, messages?: Array<string>, title?: string) {
    this.snotifyService.error(message, this.longConfig);
  }

  public InfoNotification(message?: string, messages?: Array<string>) {
    this.snotifyService.info(htmlToPlaintext(message), this.meduimConfig);
  }

  public WaitNotification(message?: string, messages?: Array<string>) {
  }
}
