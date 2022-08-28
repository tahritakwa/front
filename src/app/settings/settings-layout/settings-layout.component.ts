import {Component, OnInit} from '@angular/core';
import {RoleConfigConstant} from '../../Structure/_roleConfigConstant';
import {Router} from '@angular/router';
import {AllSettings} from '../_settings';
import {NumberConstant} from '../../constant/utility/number.constant';
import { AuthService } from '../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-settings-layout',
  providers: [AllSettings],
  templateUrl: './settings-layout.component.html',
  styleUrls: ['./settings-layout.component.scss']
})
export class SettingsLayoutComponent implements OnInit {
  public RoleConfigConstant = RoleConfigConstant;
  activatedMenu: string;
  subMenus: any;
  allSettings: any;
  constructor(
    private router: Router,
    private _allSettings: AllSettings,
    public authService: AuthService) {
    this.allSettings = _allSettings.ALL_SETTINGS;
  }

  ngOnInit(): void {
    let i = NumberConstant.ZERO;
    while (i < this.allSettings.length && !this.isUrlOfMenu(this.allSettings[i].sub_menus)) {
      i++;
    }
    if (i < this.allSettings.length) {
      this.activatedMenu = this.allSettings[i].menu;
      this.subMenus = this.allSettings[i].sub_menus;
    } else {
      let menuInitialized = false;
      for (let j = NumberConstant.ZERO; j < i; j++) {
        if (!menuInitialized && this.authService.hasAuthorities(this.allSettings[j].permission)) {
          this.activatedMenu = this.allSettings[j].menu;
          this.subMenus = this.allSettings[j].sub_menus;
          menuInitialized = true;
        }
      }

    }
  }

  onActivatedMenu(activatedMenu: string) {
    this.activatedMenu = activatedMenu;
    let i = NumberConstant.ZERO;
    while (i < this.allSettings.length && this.allSettings[i].menu !== activatedMenu) {
      i++;
    }
    if (i < this.allSettings.length) {
      this.subMenus = this.allSettings[i].sub_menus;
    }
  }

  isUrlOfMenu(subMenu: any[]) {
    for (let i = NumberConstant.ZERO; i < subMenu.length; i++) {
      if (subMenu[i].url === this.router.url) {
        return true;
      }
    }
    return false;
  }
}
