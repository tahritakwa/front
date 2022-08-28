import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import * as $ from 'jquery';
import { RoleConfigConstant } from '../../Structure/_roleConfigConstant';
import { AllSettings } from '../_settings';
import { NumberConstant } from '../../constant/utility/number.constant';
import { Router } from '@angular/router';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../stark-permissions/utils/utils';
import { AuthService } from '../../login/Authentification/services/auth.service';

const SCROLL_BAR_WIDTHS = 40;
const ACTIVE_LINK = 'active';
const MAIN_LINK_SETTINGS = 'main/settings/';
@Component({
  selector: 'app-scroll-bar',
  providers: [AllSettings],
  templateUrl: './scroll-bar.component.html',
  styleUrls: ['./scroll-bar.component.scss']
})
export class ScrollBarComponent implements AfterViewInit, OnInit {

  @Input() activeMenu;
  @Input() subMenus;
  @Output() outputActiveMenu = new EventEmitter<string>();
  allMenus;
  public RoleConfigConstant = RoleConfigConstant;

  constructor(public router: Router,
    public allSettings: AllSettings,
    public authService: AuthService
  ) {
    this.allMenus = this.allSettings.ALL_SETTINGS;
  }

  ngOnInit() {
  }

  @HostListener('click', ['$event.target'])
  onClick(menu) {
    if (menu && menu.id) {
      menu = menu.id;
    }
    if (menu) {
      this.activeMenu = menu;
    }
    this.outputActiveMenu.emit(menu);
    let defaultMenu = this.allMenus.filter(x => x.menu === menu);
    if (defaultMenu.length > 0) {
      for (let i = 0; i < defaultMenu[NumberConstant.ZERO].sub_menus.length; i++) {
        if (this.authService.hasAuthorities(defaultMenu[NumberConstant.ZERO].sub_menus[i].permission)) {
          this.gotoFirstSubMenu('/main/settings/' + defaultMenu[NumberConstant.ZERO].sub_menus[i].url);
          break;
        }
      }
    }
  }
  public gotoFirstSubMenu(url: any) {
    let index = NumberConstant.ZERO;
    if (url.substring(NumberConstant.FIFTEEN, NumberConstant.TWENTY_THREE) === 'treasury') {
      if (url.substring(NumberConstant.THIRTY_NINE) !== 'bank' && url.substring(NumberConstant.THIRTY_NINE) !== 'bankaccounts/fromSettings') {
        this.moveToLink(url);
      }
    }
    else {
      let firstElementTag;
      for (let i = 0; i < this.subMenus.length; i++) {
        if (this.authService.hasAuthorities(this.subMenus[i].permission)) {
          firstElementTag = this.subMenus[i].menu;
          index = i;
          break;
        }
      }
      const subUrl = url.substring(NumberConstant.FIFTEEN);
      if (subUrl !== '') {
        this.allMenus.forEach(x => {
          let subMenu = x.sub_menus.filter(elt => elt.url === subUrl);
          if (subMenu.length !== NumberConstant.ZERO) {
            this.subMenus = x.sub_menus;
          }
        });
        let subMenuWithRightUrl = this.subMenus.filter(s => subUrl === s.url);
        if (subMenuWithRightUrl !== null) {
          firstElementTag = subMenuWithRightUrl.menu;
          index = this.subMenus.indexOf(subMenuWithRightUrl[NumberConstant.ZERO]);
        }
      }
      const firstElement = document.getElementById(firstElementTag);
      if (firstElement && !firstElement.className.includes(ACTIVE_LINK)) {
        firstElement.className += ACTIVE_LINK;
      }
      const linkToGo = this.subMenus[index].url;
      this.moveToLink(linkToGo);
    }
  }
  ngAfterViewInit() {
    this.reAdjust();

    $(window).on('resize', function (e) {
      this.reAdjust();
    }.bind(this));
    this.gotoFirstSubMenu(this.router.url);
  }

  widthOfList() {
    let itemsWidth = 0;
    $('.list a').each(function () {
      let itemWidth = $(this).outerWidth();
      itemsWidth += itemWidth;
    });
    return itemsWidth;
  };

  widthOfHidden() {
    let ww = 0 - $('.wrapper').outerWidth();
    let hw = (($('.wrapper').outerWidth()) - this.widthOfList() - this.getLeftPosi()) - SCROLL_BAR_WIDTHS;
    let rp = $(document).width() - ($('.nav-item.nav-link').last().offset().left + $('.nav-item.nav-link').last().outerWidth());

    if (ww > hw) {
      return (rp > ww ? rp : ww);
    }
    else {
      return (rp > hw ? rp : hw);
    }
  };

  getLeftPosi() {

    let ww = 0 - $('.wrapper').outerWidth();
    let lp = $('.list').position().left;

    if (ww > lp) {
      return ww;
    }
    else {
      return lp;
    }
  };

  reAdjust() {
    let rp;
    // check right pos of last nav item
    if ($('.nav-item.nav-link').last().offset()) {
      rp = $(document).width() - ($('.nav-item.nav-link').last().offset().left + $('.nav-item.nav-link').last().outerWidth());
    }
    if ((($('.wrapper').outerWidth()) < this.widthOfList() && (rp < 0)) || ($(window).width() < 650 && (rp > 0))) {
      $('.scroller-right').show().css('display', 'flex');
    }
    else {
      $('.scroller-right').hide();
    }

    if (this.getLeftPosi() < 0) {
      $('.scroller-left').show().css('display', 'flex');
    }
    else {
      $('.item').animate({ left: "-=" + this.getLeftPosi() + "px" }, 'slow');
      $('.scroller-left').hide();
    }
  }

  onRightClick() {
    $('.scroller-left').fadeIn('slow');
    $('.scroller-right').fadeOut('slow');

    $('.list').animate({ left: "+=" + this.widthOfHidden() + "px" }, 'slow', function () {
      this.reAdjust();
    }.bind(this));
  }

  onLeftClick() {
    $('.scroller-right').fadeIn('slow');
    $('.scroller-left').fadeOut('slow');

    $('.list').animate({ left: "-=" + this.getLeftPosi() + "px" }, 'slow', function () {
      this.reAdjust();
    }.bind(this));
  }

  moveToLink(linkToGo) {
    let link = linkToGo;
    if (isNotNullOrUndefinedAndNotEmptyValue(linkToGo) && !linkToGo.includes(MAIN_LINK_SETTINGS)) {
      link = MAIN_LINK_SETTINGS.concat(linkToGo);
    }
    this.router.navigateByUrl(link);
  }
}
