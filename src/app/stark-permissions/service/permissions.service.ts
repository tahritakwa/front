import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { StarkPermissionsStore } from '../store/permissions.store';
import { StarkPermission } from '../model/permission.model';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/from';

import { merge } from 'rxjs/observable/merge';

import { isFunction, transformStringToArray } from '../utils/utils';


export interface StarkPermissionsObject {[name: string]: StarkPermission; }

export const USE_PERMISSIONS_STORE = new InjectionToken('USE_PERMISSIONS_STORE');


@Injectable()
export class StarkPermissionsService {

    private permissionsSource: BehaviorSubject<StarkPermissionsObject>;
    public permissions$: Observable<StarkPermissionsObject>;

    constructor(
        @Inject(USE_PERMISSIONS_STORE) private isolate: boolean = false,
        private permissionsStore: StarkPermissionsStore,
    ) {
        this.permissionsSource = this.isolate ? new BehaviorSubject<StarkPermissionsObject>({}) : this.permissionsStore.permissionsSource;
        this.permissions$ = this.permissionsSource.asObservable();
    }

    /**
     * Remove all permissions from permissions source
     */
    public flushPermissions(): void {
        this.permissionsSource.next({});
    }

    public hasPermission(permission: string | string[]): Promise<boolean> {
        if (!permission || (Array.isArray(permission) && permission.length === 0)) {
            return Promise.resolve(true);
        }

        permission = transformStringToArray(permission);
        return this.hasArrayPermission(permission);
    }

    public loadPermissions(permissions: string[], validationFunction?: Function): void {
        const newPermissions = permissions.reduce((source, p) =>
                this.reducePermission(source, p, validationFunction)
            , {});

        this.permissionsSource.next(newPermissions);
    }

    public addPermission(permission: string | string[], validationFunction?: Function): void {
        if (Array.isArray(permission)) {
            const permissions = permission.reduce((source, p) =>
                    this.reducePermission(source, p, validationFunction)
                , this.permissionsSource.value);

            this.permissionsSource.next(permissions);
        } else {
            const permissions = this.reducePermission(this.permissionsSource.value, permission, validationFunction);

            this.permissionsSource.next(permissions);
        }
    }

    /**
     * @param {string} permissionName
     * Removes permission from permissionsObject;
     */
    public removePermission(permissionName: string): void {
        const permissions = {
            ...this.permissionsSource.value
        };
        delete permissions[ permissionName ];
        this.permissionsSource.next(permissions);
    }

    public getPermission(name: string): StarkPermission {
        return this.permissionsSource.value[ name ];
    }

    public getPermissions(): StarkPermissionsObject {
        return this.permissionsSource.value;
    }

    public hasElements(): boolean {
        return (Object.keys(this.permissionsSource.value).length > 0) ;
    }
    private reducePermission(
        source: StarkPermissionsObject,
        name: string,
        validationFunction?: Function
    ): StarkPermissionsObject {
        if (!!validationFunction && isFunction(validationFunction)) {
            return {
                ...source,
                [ name ]: { name, validationFunction }
            };
        } else {
            return {
                ...source,
                [ name ]: { name }
            };
        }
    }

    private hasArrayPermission(permissions: string[]): Promise<boolean> {
        const promises: any[] = [];
        permissions.forEach((key) => {
            if (this.hasPermissionValidationFunction(key)) {
                const immutableValue = { ...this.permissionsSource.value };
                return promises.push(Observable.from(Promise.resolve((<Function>this.permissionsSource.value[ key ].validationFunction)(
                    key,
                    immutableValue
                ))).catch(() => {
                    return Observable.of(false);
                }));
            } else {
                // check for name of the permission if there is no validation function
                promises.push(Observable.of(!!this.permissionsSource.value[ key ]));
            }

        });
        return merge(promises)
                         .mergeAll()
                         .first((data: any) => {
                             return data !== false;
                         }, () => true, false)
                         .toPromise()
                         .then((data: any) => {
                             return data;
                         });
    }

    private hasPermissionValidationFunction(key: string): boolean {
        return !!this.permissionsSource.value[ key ] && !!this.permissionsSource.value[ key ].validationFunction
         && isFunction(this.permissionsSource.value[ key ].validationFunction);
    }

    // Get the list of permissions
    public ListPermissionsAsObservable() {
        return this.permissionsSource.asObservable();
    }
}
