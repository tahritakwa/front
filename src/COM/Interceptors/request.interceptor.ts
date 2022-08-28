import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/finally';
import { Observable } from 'rxjs/Observable';
import { finalize, switchMap } from 'rxjs/operators';
import { AuthService } from '../../app/login/Authentification/services/auth.service';
import { LocalStorageService } from '../../app/login/Authentification/services/local-storage-service';
import { DataTransferShowSpinnerService } from '../../app/shared/services/spinner/data-transfer-show-spinner.service';
import { SpinnerService } from '../spinner/spinner.service';


@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(public Service: SpinnerService, public dataTransferShowSpinnerService: DataTransferShowSpinnerService, public authService: AuthService,
    private localStorageService: LocalStorageService, private spinnerService: SpinnerService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.dataTransferShowSpinnerService.getShowSpinnerValue()) {
      this.Service.showLoader();
    }

    this.dataTransferShowSpinnerService.setShowSpinnerValue(false);
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }
    let userData = this.localStorageService.getUser();
    if (userData) {
      request = request.clone({ headers: request.headers.set('User', userData['Email'].toString()) });
      request = request.clone({ headers: request.headers.set('UserId', userData['IdUser'].toString()) });
      request = request.clone({ headers: request.headers.set('Company', userData['LastConnectedCompany'].toString()) });
      request = request.clone({ headers: request.headers.set('Language', userData['Language'].toString()) })
    }

    if (this.authService.isLoginUrl(request)) {
      request = request.clone({ headers: request.headers.set('ProjectName', 'StarkProject') });
    }

    request = request.clone({
      headers: request.headers.set(
        'Cache-Control', 'no-cache',
      )
    });
    request = request.clone({
      headers: request.headers.set(
        'Pragma', 'no-cache',
      )
    });
    request = request.clone({
      headers: request.headers.set(
        'Expires', '0',
      )
    });

    if (!this.authService.isLoginUrl(request)) {
      if (this.localStorageService.getAccessToken() !== null && this.authService.isTokenExpiredNowOrAfterOneMinute()) {
        return this.authService.loadAccessTokenUsingRefreshToken(false)
          .pipe(switchMap(token => {
            return next.handle(AuthService.addTokenToRequestHeader(token, request));
          }));
      } else {
        request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${this.localStorageService.getAccessToken()}`) });
      }
    }
    return next.handle(request)._finally(() => this.Service.hideLaoder());
  }
}
