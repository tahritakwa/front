import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { AuthService } from './auth.service';

/**
 *
 * Auth Guard
 * */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, public authService: AuthService, private translate: TranslateService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.check();
  }

  check(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      if (this.router.routerState.root.firstChild != null) {
        this.authService.logout(this.translate.instant('SESSION_EXPIRED'));
        return false;
      } else {
        this.authService.logout();
        return false;
      }
    }
  }

  /**
   *
   * check  if user is loggedin
   * */
  isLoggednIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
