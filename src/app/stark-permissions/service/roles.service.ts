import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { StarkRole } from '../model/role.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/every';
import { merge } from 'rxjs/observable/merge';

import { Inject, Injectable, InjectionToken } from '@angular/core';
import { StarkRolesStore } from '../store/roles.store';
import { isFunction, isPromise, transformStringToArray } from '../utils/utils';
import { StarkPermissionsService } from './permissions.service';
import { DashboardService } from '../../dashboard/services/dashboard.service';
import { AuthGuard } from '../../login/Authentification/services/auth.guard';


export const USE_ROLES_STORE = new InjectionToken('USE_ROLES_STORE');

export interface StarkRolesObject {[name: string]: StarkRole; }

@Injectable()
export class StarkRolesService {
    private rolesSource: BehaviorSubject<StarkRolesObject>;

    public roles$: Observable<StarkRolesObject>;

    // initialize a private variable _RoleConfig, it's a BehaviorSubject
    private _listRoleConfigs = new BehaviorSubject<any>({});

    // change data to use getter and setter
    set ListRoleConfigs(value) {
        // set the latest value for _RoleConfig BehaviorSubject
        this._listRoleConfigs.next(value);
    }

    get ListRoleConfigs() {
        // get the latest value from _RoleConfig BehaviorSubject
        return this._listRoleConfigs.getValue();
    }

    constructor(@Inject(USE_ROLES_STORE) private isolate: boolean = false,
                private rolesStore: StarkRolesStore,
                private permissionsService: StarkPermissionsService,
                private dashService: DashboardService, private authGuard: AuthGuard) {
        this.rolesSource = this.isolate ? new BehaviorSubject<StarkRolesObject>({}) : this.rolesStore.rolesSource;
        this.roles$ = this.rolesSource.asObservable();
        this._listRoleConfigs = new BehaviorSubject<any>({});
    }

    public addRole(name: string, validationFunction: Function | string[]) {
        const roles = {
            ...this.rolesSource.value,
            [name]: {name, validationFunction}
        };
        this.rolesSource.next(roles);
    }
    public hasElements(): boolean {
        return (Object.keys(this.rolesSource.value).length > 0) ;
    }
    public addRoles(rolesObj: { [name: string]: Function | string[]}) {
        Object.keys(rolesObj).forEach((key) => {
            this.addRole(key, rolesObj[key]);
        });
    }
    public async addMultiRole(roles, perms) {
        roles.forEach((b, i) => {
            this.addRole(b, []);
          });
    }
    public flushRoles() {
        this.rolesSource.next({});
    }

    public removeRole(roleName: string) {
        const roles = {
            ...this.rolesSource.value
        };
        delete roles[roleName];
        this.rolesSource.next(roles);
    }

    public getRoles() {
        return this.rolesSource.value;
    }

    public getRole(name: string) {
        return this.rolesSource.value[name];
    }

    public ListRoleConfigsAsObservable() {
        // get the latest value from _RoleConfig BehaviorSubject
        return this._listRoleConfigs.asObservable();
    }

    public checkHasOnlyRoles(names: string | string[] | any): Promise<boolean> {
        if (!names || (Array.isArray(names) && names.length === 0)) { return Promise.resolve(true); }
        names = transformStringToArray(names);
        return new Promise((resolve, reject) => {
            this.dashService.checkHasOnlyRoles(names).subscribe( x => {
                resolve(x);
            });
         });
    }

    public checkHasOnlyPermissions(names: string | string[] | any): Promise<boolean> {
        if (!names || (Array.isArray(names) && names.length === 0)) { return Promise.resolve(true); }
        names = transformStringToArray(names);
        return new Promise((resolve, reject) => {
            this.dashService.checkHasOnlyPermissions(names).subscribe( x => {
                resolve(x);
            });
         });
    }

    public checkHasOnlyRolesPermissions(names: string | string[] | any): Promise<boolean> {
        if (!names || (Array.isArray(names) && names.length === 0)) { return Promise.resolve(true); }
        names = transformStringToArray(names);
        return new Promise((resolve, reject) => {
            this.dashService.checkHasOnlyRolesPermissions(names).subscribe( x => {
                resolve(x);
            });
         });
    }

    public hasOnlyRoles(names: string | string[] | any): Promise<boolean> {
        if (!names || (Array.isArray(names) && names.length === 0)) { return Promise.resolve(true); }
        names = transformStringToArray(names);
        return this.doHasOnlyRoles(names);
    }


    private hasRoleKey(roleName: string[]): Promise<boolean> {
        const promises: any[] = [];
        return this.doHasRoleKey(roleName, promises);
    }

    private hasRolePermission(roles: StarkRolesObject, roleNames: string[]): Promise<boolean> {
        return Observable.from(roleNames)
            .mergeMap((key) => {
                if (roles[key] && Array.isArray(roles[key].validationFunction)) {
                    return Observable.from(<string[]>roles[key].validationFunction)
                        .mergeMap((permission) => {
                            return this.permissionsService.hasPermission(permission);
                        })
                        .every((hasPermissions) => {
                            return hasPermissions === true;
                        });
                }
                return Observable.of(false);
            })
            .first((hasPermission) => {
                return hasPermission === true;
            }, () => true, false)
            .toPromise();
    }


    doHasOnlyRoles(names) {
        return Promise.all([this.hasRoleKey(names), this.hasRolePermission(this.rolesSource.value, names)])
            .then(([hasRoles, hasPermissions]: [boolean, boolean]) => {
            return hasRoles || hasPermissions;
        });
    }

    doHasRoleKey(roleName, promises: any[]) {
        roleName.forEach((key) => {
            if (!!this.rolesSource.value[key] &&
                !!this.rolesSource.value[key].validationFunction &&
                isFunction(this.rolesSource.value[key].validationFunction) &&
                !isPromise(this.rolesSource.value[key].validationFunction)) {
                return promises.push(
                    Observable.from(
                        Promise.resolve(
                        (<Function>this.rolesSource.value[key].validationFunction)()
                        )
                    ).catch(() => {
                    return Observable.of(false);
                }) );
            }
            promises.push(Observable.of(false));
        });
        return merge(promises).mergeAll().first((data: any) => {
            return data !== false;
        }, () => true, false).toPromise().then((data: any) => {
            return data;
        });
    }

}
