import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router,
    RouterStateSnapshot
} from '@angular/router';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../login/Authentification/services/auth.service';

@Injectable()
export class StarkPermissionsGuard implements CanActivate, CanLoad, CanActivateChild {


    constructor(private router: Router,private authService: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
        return this.hasPermissions(route, state);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.hasPermissions(childRoute, state);
    }

    canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
        return this.hasPermissions(route);
    }

    private async hasPermissions(route: ActivatedRouteSnapshot | Route, state?: RouterStateSnapshot) {
      const hasPermission = await this.authService.hasPermissionGard(route.data.permissions.only);
        if (!route.data.permissions || !hasPermission) {
             this.router.navigate(['main/error']);
        } else {
            return true;
        }
    }

}
