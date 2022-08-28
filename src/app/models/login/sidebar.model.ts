import { Resource } from '../shared/ressource.model';
import { NumberConstant } from '../../constant/utility/number.constant';
import { isNullOrUndefined } from 'util';
import { RoleConfigConstant } from '../../Structure/_roleConfigConstant';

export class Sidebar extends Resource {
  currentRoleName;
  modulesandroles;
  modulesfuncsandroles;
  allnavitems: any;
  roleconfigs: any;
  newnavitem: Array<any>;
  newnavchilditem: Array<any>;
  navitemidx: number;
  navchilditemidx: number;
  stillHasChild: boolean;
  allitemslength: number;
  allchilditemslength: number;
  navtitemroles;
  navtitemchildroles;

  /**
   *
   */
  constructor(
    allnavitems: any, roleconfigs: any, newnavitem: Array<any>, newnavchilditem: Array<any>,
    navitemidx: number, navchilditemidx: number, stillHasChild: boolean, allitemslength: number, allchilditemslength: number
  ) {
    super();
    this.allnavitems = allnavitems;
    this.roleconfigs = roleconfigs;
    this.initConst(roleconfigs);
    this.initProps(this);
  }


  initProps({ allnavitems, newnavitem }: { allnavitems: any; newnavitem: Array<any>; }) {
    if (isNullOrUndefined(newnavitem)) {
      this.newnavitem = new Array();
      this.newnavchilditem = new Array();
      // tslint:disable-next-line: forin
      this.newnavitem.push(allnavitems[NumberConstant.ZERO]);
      this.newnavitem.push(allnavitems[NumberConstant.ONE]);
      this.navitemidx = NumberConstant.TWO;
      this.navchilditemidx = NumberConstant.ZERO;
      this.allitemslength = allnavitems.length - NumberConstant.TWO;
      this.allchilditemslength = NumberConstant.ZERO;
    }
  }

  initConst(roleconfigs: any) {
    this.initcurrentRoleName(roleconfigs);
    this.initmodulesandroles(roleconfigs);
    this.initmodulesfuncsandroles(roleconfigs);
  }

  initcurrentRoleName(roleconfigs: any) {
    this.currentRoleName = Array.prototype.concat.apply([], roleconfigs.map(val => val.RoleName.trim().toUpperCase()));
  }

  initmodulesandroles(roleconfigs: any) {
    this.modulesandroles = Array.prototype.concat.apply([],
      roleconfigs
        .map((val: { ModuleConfig: { map: (arg0: (v: { IdModuleNavigationName: any; }, i: any) => any) => void; }; }) =>
          val.ModuleConfig.map((v: { IdModuleNavigationName: any; }) => v.IdModuleNavigationName)));
  }

  initmodulesfuncsandroles(roleconfigs: any) {
    this.modulesfuncsandroles = Array.prototype.concat.apply([],
      roleconfigs
        .map((val: { FunctionalityConfig: { map: (arg0: (v: { IdFunctionalityNavigationName: any; }, i: any) => any) => void; }; }) =>
          val.FunctionalityConfig.map((v: { IdFunctionalityNavigationName: any; }) => {
            v.IdFunctionalityNavigationName.replace(/LIST-|SHOW-/, '');
            return v.IdFunctionalityNavigationName;
          })))
      .filter(x => x.includes('SHOW-') || x.includes('LIST-'));
    this.modulesfuncsandroles = this.modulesfuncsandroles.filter(b => b.includes('DROPDOWNLIST') === false);
    this.modulesfuncsandroles = Array.from(new Set(this.modulesfuncsandroles));
  }

  checkStillHasChild() {
    this.stillHasChild = !isNullOrUndefined(this.allnavitems[this.navitemidx].children)
      && this.allchilditemslength >= NumberConstant.ZERO;
  }

  handleNavUpdate() {
    if (!isNullOrUndefined(this.newnavchilditem) && this.newnavchilditem.length > NumberConstant.ZERO && !this.stillHasChild
      && this.allchilditemslength <= NumberConstant.ZERO) {
      this.newnavitem[this.newnavitem.length - NumberConstant.ONE].children = this.newnavchilditem;
      this.navitemidx = this.navitemidx + NumberConstant.ONE;
      this.allchilditemslength = NumberConstant.ZERO;
    } else if (!isNullOrUndefined(this.allnavitems[this.navitemidx].children)
      && !isNullOrUndefined(this.newnavchilditem) && this.newnavchilditem.length <= NumberConstant.ZERO && !this.stillHasChild
      && this.allchilditemslength <= NumberConstant.ZERO) {
      this.newnavitem.pop();
      this.navitemidx = this.navitemidx + NumberConstant.ONE;
      this.allchilditemslength = NumberConstant.ZERO;
    }
  }

  checkIsNotLastChild() {
    return this.navitemidx <= this.newnavitem.length - NumberConstant.ONE
      && !isNullOrUndefined(this.allnavitems[this.navitemidx].children)
      && !isNullOrUndefined(this.allnavitems[this.navitemidx].children[this.navchilditemidx])
      && this.allnavitems[this.navitemidx].children[this.navchilditemidx].role;
  }

  checkIsLastChild() {
    return this.navitemidx > this.newnavitem.length - NumberConstant.ONE
      && !isNullOrUndefined(this.allnavitems[this.navitemidx].children)
      && !isNullOrUndefined(this.allnavitems[this.navitemidx].children[this.navchilditemidx])
      && this.allnavitems[this.navitemidx].children[this.navchilditemidx].role;
  }

  checkIsNotLast() {
    return this.navitemidx <= this.newnavitem.length - NumberConstant.ONE
      && !isNullOrUndefined(this.allnavitems[this.navitemidx])
      && this.allnavitems[this.navitemidx].role;
  }

  checkIsLast() {
    return this.navitemidx > this.newnavitem.length - NumberConstant.ONE
      && !isNullOrUndefined(this.allnavitems[this.navitemidx])
      && this.allnavitems[this.navitemidx].role;
  }


  initChildItemRoles() {
    if (this.checkIsNotLastChild()) {
      this.navtitemchildroles = this.newnavitem[this.navitemidx].children[this.navchilditemidx].role
        .map((v: { name: { toUpperCase: () => void; }; }) => v.name.toUpperCase());
    } else {
      this.navtitemchildroles = this.allnavitems[this.navitemidx].children[this.navchilditemidx - 1].role
        .map((v: { name: { toUpperCase: () => void; }; }) => v.name.toUpperCase());
    }
  }

  initItemRoles() {
    this.allitemslength = this.allitemslength - NumberConstant.ONE;
    if (this.checkIsNotLast()) {
      this.navtitemroles = this.allnavitems[this.navitemidx].role
        .map((v: { name: { toUpperCase: () => void; }; }) => v.name.toUpperCase());
    } else {
      this.navtitemroles = this.allnavitems[this.navitemidx - 1].role
        .map((v: { name: { toUpperCase: () => void; }; }) => v.name.toUpperCase());
    }
  }

  checkNotControlled = () => {
    return ((this.navtitemroles.includes(RoleConfigConstant.NotControlledConfig)
      || this.navtitemroles.includes(RoleConfigConstant.AllowAnonymousConfig)));
  }

  checkUnauthorized = () => {
    return this.navtitemroles.filter(elem => elem.includes('!') === true
      && this.currentRoleName.includes(elem.replace('!', '').toUpperCase())).length > NumberConstant.ZERO
      && (this.currentRoleName.includes(RoleConfigConstant.StockConfig) === false
        || this.currentRoleName.includes(RoleConfigConstant.AdminConfig) === false
        || this.currentRoleName.includes(RoleConfigConstant.SuperAdminConfig) === false
        || this.currentRoleName.includes(RoleConfigConstant.PurchaseConfig) === false)
      && (this.currentRoleName.length < NumberConstant.TWO);;
  }

  checkInModules = () => {
    return this.modulesandroles.find((v: { toUpperCase: () => string; }) => !isNullOrUndefined(v)
      && this.navtitemroles.includes(v.toUpperCase()))
      || ((this.navtitemroles.includes(RoleConfigConstant.NotControlledConfig)
        || this.navtitemroles.includes(RoleConfigConstant.AllowAnonymousConfig))
        && this.roleconfigs.length >= NumberConstant.SEVEN);
  }

  checkInFuncs = () => {
    return this.modulesfuncsandroles.find((v: { toUpperCase: () => string; }) => !isNullOrUndefined(v)
      && this.navtitemroles.filter(elem =>
        v.toUpperCase().replace(/SHOW-|LIST-/g, '').replace(elem, 'True') === 'True').length > NumberConstant.ZERO);
  }

  /**
* initTopLevel
*/
  public initTopLevel(this) {
    this.allitemslength = this.allitemslength - NumberConstant.ONE;
    if (this.allitemslength >= NumberConstant.ZERO) {
      if (isNullOrUndefined(this.newnavchilditem)) {
        this.newnavchilditem = new Array();
      }
      this.navtitemroles = this.allnavitems[this.navitemidx].role
        .map((v: { name: { toUpperCase: () => void; }; }) => v.name.toUpperCase());
    }
  }
  /**
   * nextTopLevelMenu
   */
  public nextTopLevelMenu(this) {
    this.navitemidx = this.navitemidx + NumberConstant.ONE;
    this.newnavchilditem = new Array();
    this.stillHasChild = false;
    this.allchilditemslength = NumberConstant.ZERO;
    this.navchilditemidx = NumberConstant.ZERO;
  }

  /**
   * addTopLevelMenu
   */
  public addTopLevelMenu() {
    const newlement = this.allnavitems[this.navitemidx];
    const newlength = this.newnavitem.push(newlement);
    this.allchilditemslength = !isNullOrUndefined(newlement.children) ? newlement.children.length : NumberConstant.ZERO;
    this.newnavchilditem = new Array();
    this.stillHasChild = !isNullOrUndefined(newlement.children) && this.allchilditemslength >= NumberConstant.ZERO;
    this.navitemidx = this.stillHasChild ? this.navitemidx : this.navitemidx + NumberConstant.ONE;
    this.navchilditemidx = NumberConstant.ZERO;
  }

  /**
   * addChildMenu
   */
  public addChildMenu() {

    this.initChildItemRoles();
    const showInMenu = this.showInMenu();

    if (this.checkIsNotLastChild()) {

      if (showInMenu) {
        const newitemidx =
          this.newnavchilditem.push(this.newnavitem[this.navitemidx].children[this.navchilditemidx]);
        this.navchilditemidx = newitemidx === this.navchilditemidx ?
          this.navchilditemidx + NumberConstant.ONE : newitemidx;
      } else if (this.navtitemchildroles.includes(RoleConfigConstant.NotControlledConfig)
        || this.navtitemchildroles.includes(RoleConfigConstant.AllowAnonymousConfig)) {
        const newitemidx =
          this.newnavchilditem.push(this.newnavitem[this.navitemidx].children[this.navchilditemidx]);
        this.navchilditemidx = newitemidx === this.navchilditemidx ?
          this.navchilditemidx + NumberConstant.ONE : newitemidx;
      } else {
        this.navchilditemidx = this.allnavitems[this.navitemidx].children.length - this.allchilditemslength;
      }

    } else if (this.checkIsLastChild()) {

      if (showInMenu) {
        const newitemidx =
          this.newnavchilditem.push(this.allnavitems[this.navitemidx].children[this.navchilditemidx]);
        this.navchilditemidx = newitemidx === this.navchilditemidx ?
          this.navchilditemidx + NumberConstant.ONE : newitemidx;
      } else if (this.navtitemchildroles.includes(RoleConfigConstant.NotControlledConfig)
        || this.navtitemchildroles.includes(RoleConfigConstant.AllowAnonymousConfig)) {
        const newitemidx = this.newnavchilditem
          .push(this.allnavitems[this.navitemidx].children[this.navchilditemidx]);
        this.navchilditemidx = newitemidx === this.navchilditemidx ?
          this.navchilditemidx + NumberConstant.ONE : newitemidx;
      } else {
        this.navchilditemidx = this.allnavitems[this.navitemidx].children.length - this.allchilditemslength;
      }

    }
  }
  /**
   * showInMenu
   */
  public showInMenu() {
    const checkNotControlled = this.checkNotControlled();
    if (!isNullOrUndefined(checkNotControlled)) {
      return true;
    }

    const checkUnauthorized = this.checkUnauthorized();
    if (!isNullOrUndefined(checkUnauthorized)) {
      return false;
    }

    const checkInModules = this.checkInModules();
    if (isNullOrUndefined(checkInModules)) {
      return false;
    }

    const checkInFuncs = this.checkInFuncs();
    return !isNullOrUndefined(checkInFuncs) && checkInFuncs;

  }
}
