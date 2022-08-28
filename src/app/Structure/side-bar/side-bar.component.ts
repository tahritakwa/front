import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {NavGlobals} from '../_nav';
import {TranslateService} from '@ngx-translate/core';
import {NumberConstant} from '../../constant/utility/number.constant';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {isNullOrUndefined} from 'util';
import {RoleConfigConstant} from '../_roleConfigConstant';
import {DashboardService} from '../../dashboard/services/dashboard.service';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {RoleConfig} from '../../models/administration/role-config.model';
import {notEmptyValue} from '../../stark-permissions/utils/utils';
import {DocumentPurchasePathEnumerator, DocumentSalesPathEnumerator} from '../../models/enumerators/document-path.enum';
import {Router} from '@angular/router';
import {CompanyService} from '../../administration/services/company/company.service';
import {AuthService} from '../../login/Authentification/services/auth.service';

const MAIN_URL = '/main/';

@Component({
  selector: 'app-side',
  providers: [NavGlobals],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})

export class SideBarComponent implements OnInit, OnDestroy {
  public filteredNavItems: any;
  public sideBarItems: Array<any> = [];
  public navItems: any;
  public navItemsConsultant: any;
  public test: Array<any> = [
    {
      name: 'Dashboard',
      key: 'dashboard',
      url: 'dashboard',
      children: undefined,
      icon: 'icon-speedometer'
    },
    {
      name: 'Dashboard',
      key: 'dashboard',
      url: 'dashboard',
      children: undefined,
      icon: 'icon-speedometer'
    },
    {
      name: 'Dashboard',
      key: 'dashboard',
      url: 'dashboard',
      children: undefined,
      icon: 'icon-speedometer'
    }
  ];

  lastIndexOpen = NumberConstant.MINUS_ONE;
  currentIndexOpen = NumberConstant.MINUS_ONE;
  NewIndexOpen = NumberConstant.MINUS_ONE;
  nbrOpen = NumberConstant.ZERO;
  selectedSubMenu = NumberConstant.MINUS_ONE;
  indexDashbord = NumberConstant.MINUS_ONE;
  lastIndex = NumberConstant.MINUS_ONE;
  getElemNavItemDropdown = document.getElementsByClassName(SharedConstant.NAME_CLASS_SIDE_BAR_NAV_ITEM_NAV_DROPDOWN);
  isAutoVersion: boolean;
  public testMenuPath: boolean;

  constructor(public translate: TranslateService, public el: ElementRef, public dashService: DashboardService,
              private navGlobals: NavGlobals, private router: Router, private companyService: CompanyService, public authService: AuthService) {
    this.filteredNavItems = null;
    this.navItems = navGlobals.navItems;
    this.navItemsConsultant = navGlobals.navItemsConsultant;
    // this.filterNavItems().subscribe(data => this.filteredNavItems = data);
    // this.translateMenu().subscribe(data => this.filteredNavItems = data);
    // this.translate.onLangChange.subscribe(() => {
    //   this.translateMenu().subscribe(data =>
    //     this.filteredNavItems = data
    //   );
    // });
    // this.companyService.getCurrentCompany().subscribe(data => {
    //   this.isAutoVersion = data.ActivityArea === ActivityAreaEnumerator.Auto;
    //
    // });

    const authorities = this.authService.getAuthorities();
    const isConsultant = this.authService.getAuthorities().filter(authority => authority.toUpperCase()
      .includes(RoleConfigConstant.ConsultantConfig)).length > NumberConstant.ZERO && (authorities.length <= NumberConstant.ONE);
    if (isConsultant) {
      // this.sideBarItems = this.filterNavItemsV2(this.navItemsConsultant);
    } else {
      // this.sideBarItems = {...this.navItems};
      let sideBarMenuItemIndex = 0;

      let menuRolesNames: string[] = this.navItems.map(navItem => navItem.name);
      for (let menuItemsIndex = 0; menuItemsIndex < menuRolesNames.length; menuItemsIndex++) {
        let menuItem = this.navItems[menuItemsIndex];
        let menuItemRolesNames = menuItem.role.map(role => role.name);
        if (this.authService.hasAuthorities(menuItemRolesNames)) {//1st level
          this.sideBarItems.push(menuItem);
          sideBarMenuItemIndex++;
        }
        let menuItemHasChildren: boolean = menuItem.hasOwnProperty('children') && menuItem.children !== undefined && menuItem.children.length != 0;
        if (menuItemHasChildren) {//2nd Level
          let allowedChildren = [];
          let children = menuItem.children;
          for (let childIndex = 0; childIndex < children.length; childIndex++) {
            let child = children[childIndex];
            let childRoles = child.role.map(role => role.name);
            if (this.authService.hasAuthorities(childRoles)) {
              allowedChildren.push(child);
              let menuItemChildHasChildren = child.hasOwnProperty('children') && child.children !== undefined && child.children.length != 0;
              if (menuItemChildHasChildren) {//3rd level
                let allowedGrandChildren = [];
                let grandChildren = child.children;
                for (let grandChildrenIndex = 0; grandChildrenIndex < grandChildren.length; grandChildrenIndex++) {
                  let grandChild = grandChildren[grandChildrenIndex];
                  let grandChildRoles = grandChild.role.map(role => role.name);
                  if (this.authService.hasAuthorities(grandChildRoles)) {
                    allowedGrandChildren.push(grandChild);
                  }
                }
                child.children = allowedGrandChildren;
              }
            }
          }
          menuItem.children = allowedChildren;
        }
      }
    }
    this.translateMenuV2(this.sideBarItems).subscribe(data => this.sideBarItems = data);
  }

  // initialize a private variable _RoleConfig, it's a BehaviorSubject
  private _RoleConfig = new BehaviorSubject<any>(null);

  get RoleConfig() {
    // get the latest value from _RoleConfig BehaviorSubject
    return this._RoleConfig.getValue();
  }

  // change data to use getter and setter
  @Input()
  set RoleConfig(value) {
    // set the latest value for _RoleConfig BehaviorSubject
    this._RoleConfig.next(value);
  }

  translateMenuV2(navItems: any): Observable<any> {
    return Observable.create((observers: { next: { (arg0: any): void; (arg0: any): void; }; }) => {
      const newmenuitems: any = navItems;
      if (!isNullOrUndefined(newmenuitems)) {
        newmenuitems.forEach((element: { children: any; name: string | string[]; }) => {
          if (!isNullOrUndefined(element)) {
            if (element.children !== undefined) {
              this.translate.stream(element.name).subscribe(translate => {
                element.name = translate;
              });
              const childNode = element.children;
              for (let index = NumberConstant.ZERO; index < childNode.length; index++) {
                this.translate.stream(childNode[index].name).subscribe((translate) => {
                  if (!isNullOrUndefined(childNode[index])) {
                    childNode[index].name = translate;
                  }
                });
                if (childNode[index].children !== undefined) {
                  const childChildNode = childNode[index].children;
                  for (let i = NumberConstant.ZERO; i < childChildNode.length; i++) {
                    this.translate.stream(childChildNode[i].name).subscribe((translate) => {
                      if (!isNullOrUndefined(childChildNode[i])) {
                        childChildNode[i].name = translate;
                      }
                    });
                  }
                }
              }
            } else {
              this.translate.stream(element.name).subscribe(translate => {
                element.name = translate;
              });
            }
          }
        });
        return observers.next(newmenuitems);
      }
      return observers.next(newmenuitems);
    });
  }

  /**
   * Condition to select index menu selected
   */
  conditionSelectIndexDropdownOpen(i: number): boolean {
    return this.getElemNavItemDropdown[i].className.indexOf(SharedConstant.NAME_CLASS_SIDE_BAR_NAV_ITEM_NAV_DROPDOWN_OPEN)
      === NumberConstant.ZERO;
  }

  /**
   * All Element Menu initiation after clicking the dashbord button
   */
  initializeSideBare() {
    this.lastIndexOpen = NumberConstant.MINUS_ONE;
    this.currentIndexOpen = NumberConstant.MINUS_ONE;
    for (let i = NumberConstant.ZERO; i < this.getElemNavItemDropdown.length; i++) {
      if (this.conditionSelectIndexDropdownOpen(i)) {
        this.getElemNavItemDropdown[i].className = this.getElemNavItemDropdown[i].className.replace(SharedConstant.OPEN, '').trim();
      }
    }
  }

  /**
   * Updating Varibles Last index Open and current index Open After any chnging in the menu
   */
  getCurrentAndLastIndexAndAutoCloseUnusedMenu() {
    this.nbrOpen = NumberConstant.ZERO;
    for (let i = NumberConstant.ZERO; i < this.getElemNavItemDropdown.length; i++) {
      if (this.conditionSelectIndexDropdownOpen(i)) {
        this.nbrOpen++;
      }
    }
    if (this.nbrOpen === NumberConstant.ZERO) {
      this.lastIndexOpen = NumberConstant.MINUS_ONE;
      this.currentIndexOpen = NumberConstant.MINUS_ONE;
      this.NewIndexOpen = NumberConstant.MINUS_ONE;
    }
    if (this.nbrOpen === NumberConstant.ONE) {
      for (let i = NumberConstant.ZERO; i < this.getElemNavItemDropdown.length; i++) {
        if (this.conditionSelectIndexDropdownOpen(i)) {
          this.currentIndexOpen = i;
        }
      }
    } else if (this.nbrOpen === NumberConstant.TWO) {
      for (let i = NumberConstant.ZERO; i < this.getElemNavItemDropdown.length; i++) {
        if (this.conditionSelectIndexDropdownOpen(i)) {
          if (this.lastIndexOpen !== i) {
            this.lastIndexOpen = this.currentIndexOpen;
            this.currentIndexOpen = i;
          }
        }
      }
      this.initializeTheIdOfChildrens(this.lastIndexOpen);
      if (this.getElemNavItemDropdown[this.currentIndexOpen].id === '') {
        this.getElemNavItemDropdown[this.lastIndexOpen].className = SharedConstant.NAME_CLASS_SIDE_BAR_NAV_ITEM_NAV_DROPDOWN;
      }
    } else if (this.nbrOpen === NumberConstant.THREE) {
      for (let i = NumberConstant.ZERO; i < this.getElemNavItemDropdown.length; i++) {
        if (this.conditionSelectIndexDropdownOpen(i)) {
          if (this.lastIndexOpen !== i && this.currentIndexOpen !== i) {
            this.NewIndexOpen = i;
          }
        }
      }
      this.initializeTheIdOfChildrens(this.NewIndexOpen);
      if (this.getElemNavItemDropdown[this.currentIndexOpen].id !== '' && this.getElemNavItemDropdown[this.NewIndexOpen].id !== '') {
        this.getElemNavItemDropdown[this.currentIndexOpen].className = SharedConstant.NAME_CLASS_SIDE_BAR_NAV_ITEM_NAV_DROPDOWN;
        this.currentIndexOpen = this.NewIndexOpen;
      } else if (this.getElemNavItemDropdown[this.NewIndexOpen].id === '') {
        this.getElemNavItemDropdown[this.lastIndexOpen].className = SharedConstant.NAME_CLASS_SIDE_BAR_NAV_ITEM_NAV_DROPDOWN;
        this.lastIndexOpen = this.currentIndexOpen;
        this.getElemNavItemDropdown[this.currentIndexOpen].className = SharedConstant.NAME_CLASS_SIDE_BAR_NAV_ITEM_NAV_DROPDOWN;
        this.currentIndexOpen = this.NewIndexOpen;
      }
    }
  }


  initializeTheIdOfChildrens(index: number) {
    if (this.nbrOpen > 0) {
      const children = this.getElemNavItemDropdown[index].lastElementChild.children;
      for (let i = NumberConstant.ZERO; i < children.length; i++) {
        if (children[i].className.indexOf('nav-item nav-dropdown') === 0) {
          children[i].id = '1';
        }
      }
    }
  }

  ngOnInit(): void {
    document.addEventListener('click', (event) => {
      if (event.target['children'][NumberConstant.ZERO]) {
        if (Object.keys(event.target['children'][NumberConstant.ZERO].className)
          .indexOf(SharedConstant.SPEEDOMETRER) !== NumberConstant.MINUS_ONE) {
          this.initializeSideBare();
        }
      }
      this.getCurrentAndLastIndexAndAutoCloseUnusedMenu();
    });

  }

  ngOnDestroy() {

  }

  filterNavItemsGenericRec(navitemslist, roleconfig, newnavitem, CurrentRoleName, Modulesandroles, Modulesfuncsandroles): any {
    let navitem: Array<any> = new Array<any>();
    let navchilditem: Array<any> = new Array<any>();
    const currentRoleName = this.initCurrentRoleName(CurrentRoleName, roleconfig);
    const modulesandroles = this.initModulesandroles(Modulesandroles, roleconfig);
    const modulesfuncsandroles = this.initModulesfuncsandroles(Modulesfuncsandroles, roleconfig);
    if (isNullOrUndefined(newnavitem)) {
      // if the menu is in the first iteration initialise it to empty array
      newnavitem = new Array<any>();
    }
    navitemslist.forEach((menuelement) => {
      // iteration trough the list of the menu from _nav.ts list and check whether to add the menu or not
      if (this.checkHasChildren(menuelement)) {
        this.filterNavItemsGenericRec(menuelement.children, roleconfig, navchilditem, currentRoleName,
          modulesandroles, modulesfuncsandroles);
      }
      if (menuelement.name === 'DOCUMENTS') {
        if (menuelement.role[0].name.includes('PURCHASE')) {
          let purchaseDocumentPathList = Object.keys(DocumentPurchasePathEnumerator)
            .map(key => ({config: key, path: DocumentPurchasePathEnumerator[key]}));

          // tslint:disable-next-line: max-line-length
          let listOfExistDocumentConfig = roleconfig.filter(x => purchaseDocumentPathList.map(({config}) => config).indexOf(x.Code.trim()) !== -1);
          for (let i = 0; i < purchaseDocumentPathList.length; i++) {
            if (listOfExistDocumentConfig.map(({Code}) => Code.trim()).indexOf(purchaseDocumentPathList[i].config.trim()) !== -1) {
              menuelement.url = purchaseDocumentPathList[i].path.trim();
              break;
            }
          }
        } else {
          let salesDocumentPathList = Object.keys(DocumentSalesPathEnumerator)
            .map(key => ({config: key, path: DocumentSalesPathEnumerator[key]}));
          let listOfExistDocumentConfig = roleconfig.filter(x => salesDocumentPathList.map(({config}) => config).indexOf(x.Code.trim()) !== -1);
          for (let i = 0; i < salesDocumentPathList.length; i++) {
            if (listOfExistDocumentConfig.map(({Code}) => Code.trim()).indexOf(salesDocumentPathList[i].config.trim()) !== -1) {
              menuelement.url = salesDocumentPathList[i].path.trim();
              break;
            }
          }
        }
      }
      if (menuelement.name !== 'MODULES') {
        if (this.showInMenu(menuelement.role.map(x => x.name.trim().toUpperCase()),
          currentRoleName, modulesandroles, roleconfig, modulesfuncsandroles)) {
          if (!isNullOrUndefined(menuelement.children) && menuelement.children.length !== 0) {
            if (!isNullOrUndefined(navchilditem) && navchilditem.length > 0) {
              menuelement.children = null;
              menuelement.children = Array.from(new Set(navchilditem));
              newnavitem.push(menuelement);
              navchilditem = new Array<any>();
            }
          } else {
            newnavitem.push(menuelement);
            // if ( !this.testMenuPath ) {
            //   this.router.navigateByUrl(MAIN_URL + menuelement.url);
            //   this.testMenuPath = true;
            // }
          }
        }
      } else {
        newnavitem.push(menuelement);
      }
    });
    navitem = Array.from(new Set(newnavitem));
    newnavitem = new Array<any>();
    return Array.from(new Set(navitem));
  }


  initModulesfuncsandroles(modulesfuncsandroles, roleconfig) {
    if (isNullOrUndefined(modulesfuncsandroles)) {
      modulesfuncsandroles = Array.prototype.concat.apply([],
        roleconfig
          .map((val: { FunctionalityConfig: { map: (arg0: (v: { IdFunctionalityNavigationName: any; }, i: any) => any) => void; }; }) =>
            val.FunctionalityConfig.map((v: { IdFunctionalityNavigationName: any; }) => {
              v.IdFunctionalityNavigationName.replace(/LIST-|SHOW-/, '');
              return v.IdFunctionalityNavigationName;
            })))
        .filter(x => x.startsWith('SHOW-') || x.startsWith('LIST-'));
      modulesfuncsandroles = Array.from(new Set(modulesfuncsandroles));
    }
    return modulesfuncsandroles;
  }

  initModulesandroles(modulesandroles, roleconfig) {
    if (isNullOrUndefined(modulesandroles)) {
      modulesandroles = Array.prototype.concat.apply([],
        roleconfig
          .map((val: { ModuleConfig: { map: (arg0: (v: { IdModuleNavigationName: any; }, i: any) => any) => void; }; }) =>
            val.ModuleConfig.map((v: { IdModuleNavigationName: any; }) => v.IdModuleNavigationName)));
    }
    return modulesandroles;
  }

  initCurrentRoleName(currentRoleName, roleconfig) {
    if (isNullOrUndefined(currentRoleName)) {
      currentRoleName = Array.prototype.concat.apply([], roleconfig.map(val => val.Code.trim().toUpperCase()));
    }
    return currentRoleName;
  }

  /**
   * showInMenu
   */
  public showInMenu(navtitemroles, currentRoleName, modulesandroles, roleconfigs, modulesfuncsandroles) {
    const checkNotControlled = ((navtitemroles.includes(RoleConfigConstant.NotControlledConfig)
      || navtitemroles.includes(RoleConfigConstant.AllowAnonymousConfig)));

    const checkUnauthorized = navtitemroles.filter(elem => elem.toString().includes('!') === true
      && currentRoleName.includes(elem.replace('!', '').toUpperCase())).length > NumberConstant.ZERO
      && (currentRoleName.includes(RoleConfigConstant.StockConfig) === false
        || currentRoleName.includes(RoleConfigConstant.AdminConfig) === false
        || currentRoleName.includes(RoleConfigConstant.SuperAdminConfig) === false
        || currentRoleName.includes(RoleConfigConstant.PurchaseConfig) === false)
      && (currentRoleName.length <= NumberConstant.TWO);

    if (!isNullOrUndefined(checkNotControlled) && !checkNotControlled) {
      if (!isNullOrUndefined(checkUnauthorized) && !checkUnauthorized) {
        const checkInModules = modulesandroles.find((v: { toUpperCase: () => string; }) => !isNullOrUndefined(v)
          && navtitemroles.includes(v.toUpperCase()))
          || ((navtitemroles.includes(RoleConfigConstant.NotControlledConfig)
            || navtitemroles.includes(RoleConfigConstant.AllowAnonymousConfig))
            && roleconfigs.length >= NumberConstant.SEVEN);
        const checkInConfigs = roleconfigs.filter(x => navtitemroles.indexOf(x.Code.toUpperCase().trim()) !== -1);
        if ((!isNullOrUndefined(checkInModules) && checkInModules) || checkInConfigs.length > 0) {
          const checkInFuncs = modulesfuncsandroles.find((v: { toUpperCase: () => string; }) => !isNullOrUndefined(v)
            && navtitemroles.filter(elem =>
              v.toUpperCase().replace(/SHOW-|LIST-/g, '').replace(elem, 'True') === 'True').length > NumberConstant.ZERO);
          return (!isNullOrUndefined(checkInFuncs) && checkInFuncs) || checkInConfigs.length > 0;
        }
      }
    } else {
      return checkUnauthorized === false;
    }
    return false;
  }

  /**
   * checkStillhasChildren
   */
  public checkHasChildren(menuelement) {
    return !isNullOrUndefined(menuelement.children) && menuelement.children.length > 0;
  }

  /**
   * checkStillhasChildren
   */
  public checkStillHasChildren(menuelement) {
    return !isNullOrUndefined(menuelement.children) && menuelement.children.length > 0;
  }


  filterNavItems(): Observable<any> {

    // tslint:disable-next-line:max-line-length
    return Observable.create((observers: { next: { (arg0: any[]): void; (arg0: any[]): void; (arg0: any[]): void; (arg0: any[]): void; }; }) => {
      let roleconfigs: Array<RoleConfig> = new Array<RoleConfig>();
      const newmenuitems = new Array();
      this._RoleConfig.subscribe(() => {
        roleconfigs = this.RoleConfig;
        if (!isNullOrUndefined(roleconfigs) && notEmptyValue(roleconfigs)) {
          this.prepareMenu(observers, roleconfigs, newmenuitems);
        }
      });
    });
  }


  prepareMenu(observers, roleconfigs, newmenuitems) {
    let navToUse;
    const IsConsultant = roleconfigs.filter(rc => rc.Code.toUpperCase()
      .includes(RoleConfigConstant.ConsultantConfig) || rc.Code.toUpperCase()
      .includes(RoleConfigConstant.G_ADMINISTRATIVE_RW)).length > NumberConstant.ZERO && (roleconfigs.length <= NumberConstant.TWO);
    navToUse = this.navItems;
    if (IsConsultant) {
      // it is a consultant
      navToUse = this.navItemsConsultant;
    }
    this.testMenuPath = false;
    newmenuitems = this.filterNavItemsGenericRec(navToUse, roleconfigs, null, null, null, null);
    return observers.next(newmenuitems);
  }


}
