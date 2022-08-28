import {ReducedRoleConfig} from '../../models/administration/reduced-role-config.model';
import {isNullOrUndefined} from 'util';
import {NumberConstant} from '../../constant/utility/number.constant';
import {RoleConfigConstant} from '../../Structure/_roleConfigConstant';
import {RoleSettings} from '../../models/administration/role_settings.model';
import {StarkPermissionsService} from '../service/permissions.service';
import {StarkRolesService} from '../service/roles.service';
import {AuthGuard} from '../../login/Authentification/services/auth.guard';

export function isFunction(functionToCheck: any): functionToCheck is Function {
  const getType = {};
  return !!functionToCheck && functionToCheck instanceof Function && getType.toString.call(functionToCheck) === '[object Function]';
}

export function isNotNullOrUndefinedAndNotEmptyValue(item: any): boolean {
  return (!isNullOrUndefined(item) && notEmptyValue(item));
}

export function isPlainObject(value: any): boolean {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  } else {
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
  }
}

export function isString(value: any): value is string {
  return !!value && typeof value === 'string';
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isPromise(promise: any) {
  return Object.prototype.toString.call(promise) === '[object Promise]';
}

export function notEmptyValue(value: any): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return !!value;
}


export function transformStringToArray(value: any): string[] {
  if (isString(value)) {
    return [value];
  }
  return value;
}

export function isDataHasNotLoaded(authGuard: AuthGuard,
                                   permissionsService: StarkPermissionsService,
                                   rolesService: StarkRolesService, isolate: boolean) {
  return new Promise((resolve, reject) => {
    if (!isolate) {
      let isNullPermissionServiceStore = true;
      let isNullRoleServiceStore = true;
      isNullPermissionServiceStore = !(!isNullOrUndefined(permissionsService) && permissionsService.hasElements());
      isNullRoleServiceStore = !(!isNullOrUndefined(rolesService) && rolesService.hasElements());
      resolve(isNullRoleServiceStore && isNullPermissionServiceStore && authGuard.isLoggednIn());
    }
  });
}

export async function fullReducedLoadConfigPermissions(dashService, rolesService, permissionsService): Promise<any> {
  return await new Promise(async (resolve, reject) => {
    await dashService.getReducedRoleConfigsModulesFuncsServerSession().subscribe(async (result: RoleSettings) => {
      rolesService.flushRoles();
      permissionsService.flushPermissions();
      const roleconfigs: Array<ReducedRoleConfig> = result.RoleData;
      const roleConfig = Object.assign([], roleconfigs);
      if (!isNullOrUndefined(roleconfigs)) {

        let allperms = Array.prototype.concat.apply([], Array.from(new Set(result.Allperms)));
        allperms = Array.from(new Set(allperms));
        const perms = result.Allperms;
        const roles = result.AllRoles;

        permissionsService.loadPermissions(allperms);
        await rolesService.addMultiRole(roles, perms);
        if (result.IsAdmin) {
          rolesService.addRole(RoleConfigConstant.AdminConfig, allperms);
        }
        rolesService.ListRoleConfigs = roleConfig;

        resolve(`Completed`);

      } else {
        reject(`No data returned`);
      }
    });
  });
}

export async function fullReducedLoadPermissions(dashService, permissionsService) {
  return new Promise((resolve, reject) => {
    dashService.getReducedRoleConfigsModulesFuncsServerSession().subscribe(roledata => {

      permissionsService.flushPermissions();
      const roleconfigs: Array<ReducedRoleConfig> = roledata;
      if (!isNullOrUndefined(roleconfigs)) {
        const allperms = Array.prototype.concat.apply([], roleconfigs
          .map((val) => val.FunctionalityConfig
            .map((v) => v.IdFunctionalityNavigationName.trim().toUpperCase())));
        const perms = roleconfigs.map((val) => val.FunctionalityConfig.map((v) => v.IdFunctionalityNavigationName));
        permissionsService.loadPermissions(allperms);
        resolve(`Completed `);
      } else {
        reject(`No data returned `);
      }
    });
  });
}

export function fullReducedLoadRoles(dashService, rolesService) {
  return new Promise((resolve, reject) => {
    dashService.getReducedRoleConfigsModulesFuncsServerSession().subscribe(roledata => {
      rolesService.flushRoles();
      const roleconfigs: Array<ReducedRoleConfig> = roledata;
      if (!isNullOrUndefined(roleconfigs)) {
        const allperms = Array.prototype.concat.apply([], roleconfigs
          .map((val) => val.FunctionalityConfig
            .map((v) => v.IdFunctionalityNavigationName.trim().toUpperCase())));
        const perms = roleconfigs.map((val) => val.FunctionalityConfig.map((v) => v.IdFunctionalityNavigationName));
        const roles = roleconfigs.map((val) => val.Code.trim().toUpperCase());

        roles.forEach((b, i) => {
          rolesService.addRole(b, perms[i].map((v) => v.trim().toUpperCase()));
        });
        if (roles.length >= NumberConstant.FOUR) {
          rolesService.addRole(RoleConfigConstant.AdminConfig, allperms);
        }
        resolve(`Completed `);
      } else {
        reject(`No data returned `);
      }
    });
  });
}

