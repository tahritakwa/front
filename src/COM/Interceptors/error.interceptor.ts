import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {ErrorHandlerService} from '../services/error-handler-service';
import {_throw} from 'rxjs/observable/throw';
import { finalize, switchMap } from 'rxjs/operators';
import { HttpStatusCodes } from '../services/http-status-codes';
import { AuthService } from '../../app/login/Authentification/services/auth.service';
import { SpinnerService } from '../spinner/spinner.service';
import {TranslateService} from '@ngx-translate/core';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {


  constructor(private errorHandlerService: ErrorHandlerService, private authService: AuthService, private spinnerService: SpinnerService,
              private translate: TranslateService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /*
     * catching every http error
     * using the appropriate operator catch
     */if (this.authService.isLoginUrl(request)) {
      return next.handle(request)
      .pipe(finalize(() => {
        this.spinnerService.hideLaoder();
      }));
    }
    return next.handle(request).catch((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCodes.Unauthorized && !this.authService.isTokenNotNullAndNotExpired()) {
        return this.authService.loadAccessTokenUsingRefreshToken(true)
          .pipe(switchMap(token => {
              return next.handle(AuthService.addTokenToRequestHeader(token, request));
            }),
            finalize(() => {
              this.spinnerService.hideLaoder();
            }));
      }
        if(error.error && (error.error.error && error.error.error_description)){
          this.authService.logout(this.translate.instant('SESSION_EXPIRED'),null);
        }else{
          this.errorHandlerService.handleError(error);
        }
        return _throw(error);

    });
  }

}

