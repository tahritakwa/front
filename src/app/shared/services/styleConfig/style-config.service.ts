import {Injectable} from '@angular/core';
import {StyleConstant} from '../../../constant/utility/style.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';


@Injectable()
export class StyleConfigService {
  /**
   * get footer class for add/edit setting layout component
   */
  public getFooterClassSettingLayoutAddComponent(): string {
    const sidebarMinimized = document.getElementsByClassName(StyleConstant.SIDEBAR_MINIMIZED);
    const sidebarShow = document.getElementsByClassName(StyleConstant.SIDEBAR_SHOW);
    if (window.innerWidth <= NumberConstant.NINE_HUNDRED_NINETY && sidebarShow.length === NumberConstant.ZERO) {
      return StyleConstant.IS_NOTSHOWED_SIDEBAR;
    } else if ((sidebarMinimized.length === NumberConstant.ZERO) ||
      (window.innerWidth <= NumberConstant.NINE_HUNDRED_NINETY && sidebarShow.length > NumberConstant.ZERO)) {
      return StyleConstant.IS_SHOWED_SIDEBAR;
    } else {
      return StyleConstant.IS_SHOWED_MINIMZED_SIDEBAR;
    }
  }

  public getFooterClassLayoutAddComponent(): string {
    const sidebarMinimized = document.getElementsByClassName(StyleConstant.SIDEBAR_MINIMIZED);
    const sidebarShow = document.getElementsByClassName(StyleConstant.SIDEBAR_SHOW);
    if (window.innerWidth <= NumberConstant.NINE_HUNDRED_NINETY && sidebarShow.length === NumberConstant.ZERO) {
      return StyleConstant.IS_NOTSHOWED_SIDEBAR;
    } else if ((sidebarMinimized.length === NumberConstant.ZERO) ||
      (window.innerWidth <= NumberConstant.NINE_HUNDRED_NINETY && sidebarShow.length > NumberConstant.ZERO)) {
      return StyleConstant.IS_SHOWED_SIDEBAR_MINIMZE_FULL;
    } else {
      return StyleConstant.IS_SHOWED_SIDEBAR_FULL;
    }
  }

}
