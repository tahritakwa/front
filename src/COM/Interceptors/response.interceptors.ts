import 'rxjs/add/observable/throw';
import {HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {GrowlService} from '../Growl/growl.service';
import {SpinnerService} from '../spinner/spinner.service';

import {ErrorHandlerService} from '../services/error-handler-service';
import {TranslateService} from '@ngx-translate/core';
import {HttpStatusCodes} from '../services/http-status-codes';
import {HttpAccountErrorCodes} from '../../app/accounting/http-error-account-codes';
import {HttpCrmErrorCodes} from '../../app/crm/http-error-crm-codes';
import {SuccessHandlerService} from '../services/success-handler.service';
import {HttpAuthErrorCodes} from '../../app/login/Authentification/http-error-auth-codes';
import {AuthService} from '../../app/login/Authentification/services/auth.service';
import {finalize, switchMap} from 'rxjs/operators';
import {Serializer} from '../../app/shared/utils/serializer';
import {HttpErrorManufacturingCode} from '../../app/manufacturing/http-error-manufacturing-code';

const SUCCESS_OPERATION = 'SUCCESS_OPERATION';
const LINE_ADDED_SUCCESSFULLY = 'LINE_ADDED_SUCCESSFULLY';
const DOCUMENT_IMPORTED_SUCCESSFULLY = 'DOCUMENT_IMPORTED_SUCCESSFULLY';
const FLAG_STATUS_0 = 0;
const FLAG_STATUS_1 = 1;
const FLAG_STATUS_2 = 2;
const DOCUMENT_ADDED_SUCCESSFULLY = 'DOCUMENT_ADDED_SUCCESSFULLY';
const ALL_TASK_ARE_ASSIGNED = 'ALL_TASK_ARE_ASSIGNED';
const LINE_DELETED_SUCCESSFULLY = 'LINE_DELETED_SUCCESSFULLY';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private growlService: GrowlService, public serviceSpinner: SpinnerService,
              private errorHandlerService: ErrorHandlerService, private successHandlerService: SuccessHandlerService,
              private translate: TranslateService, private authService: AuthService, private spinnerService: SpinnerService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).map((event: HttpEvent<any>) => {

      if (event instanceof HttpResponse && event.body) {
        if (event.status === HttpAccountErrorCodes.CUSTOM_ACCOUNTING_RESPONSE_CODE ||
          event.status === HttpCrmErrorCodes.CUSTOM_CRM_RESPONSE_CODE || event.status === HttpAuthErrorCodes.CUSTOM_AUTH_RESPONSE_CODE) {
          if (event.body.errorCode === HttpErrorManufacturingCode.AllTaskAreAssigned) {
            this.growlService.InfoNotification(`${this.translate.instant(ALL_TASK_ARE_ASSIGNED)}`);
            return;
          } else if (event.body.errors) {
            this.errorHandlerService.handleError(new HttpErrorResponse({status: event.body.errorCode}), event.body.errors);
            return;
          } else if (event.body.errorCode) {
            this.errorHandlerService.handleError(new HttpErrorResponse({status: event.body.errorCode}));
            return;
          }
        }
        if (event.body.Message === 'Failed') {
          this.growlService.ErrorNotification(this.translate.instant('WRONG_LOGIN_OR_PASSWORD'));
        }
        if ((event.body.customStatusCode > HttpStatusCodes.OK && event.body.customStatusCode < HttpStatusCodes.Ambiguous) ||
          event.body.customStatusCode === HttpStatusCodes.AffectedSuccessfully ||
          event.body.customStatusCode === HttpStatusCodes.UnaffectedSuccessfully ||
          event.body.customStatusCode === HttpStatusCodes.EnableUserSuccessfull ||
          event.body.customStatusCode === HttpStatusCodes.DisableUserSuccessfull ||
          event.body.customStatusCode === HttpStatusCodes.EnableMassifUsersSuccessfull ||
          event.body.customStatusCode === HttpStatusCodes.DisableMassifUsersSuccessfull ||
          event.body.customStatusCode === HttpStatusCodes.SendMailSuccessfull ||
          event.body.customStatusCode === HttpStatusCodes.SessionCashClosedSuccessfull ||
          event.body.customStatusCode === HttpStatusCodes.SessionCashOpenedSuccessfull ||
          event.body.customStatusCode === HttpStatusCodes.SendSMSSuccessfull) {
          let _body = event.body;
          if (_body.flag === FLAG_STATUS_0) {
            _body = _body.listObject.listData;
          } else if (_body.flag === FLAG_STATUS_1) {
            _body = _body.objectData;
          } else if (_body.flag === FLAG_STATUS_2) {
            _body = _body.listObject;
          }
          if ((Object.values(HttpStatusCodes).includes(event.body.customStatusCode)
            && (HttpStatusCodes.AddSuccessfull <= event.body.customStatusCode
              && event.body.customStatusCode <= HttpStatusCodes.SUCCESS_REJECT)) ||
            event.body.customStatusCode === HttpStatusCodes.AffectedSuccessfully ||
            event.body.customStatusCode === HttpStatusCodes.UnaffectedSuccessfully ||
            event.body.customStatusCode === HttpStatusCodes.EnableUserSuccessfull ||
            event.body.customStatusCode === HttpStatusCodes.DisableUserSuccessfull ||
            event.body.customStatusCode === HttpStatusCodes.EnableMassifUsersSuccessfull ||
            event.body.customStatusCode === HttpStatusCodes.DisableMassifUsersSuccessfull ||
            event.body.customStatusCode === HttpStatusCodes.SendMailSuccessfull ||
            event.body.customStatusCode === HttpStatusCodes.SessionCashClosedSuccessfull ||
              event.body.customStatusCode === HttpStatusCodes.SessionCashOpenedSuccessfull ||
              event.body.customStatusCode === HttpStatusCodes.SendSMSSuccessfull) {
            this.successHandlerService.handleError(new HttpErrorResponse({ status: event.body.customStatusCode }), event.body.objectData);
          } else if (event.body.customStatusCode === HttpStatusCodes.LineAddedsuccessfully) {
            this.growlService.successNotification(this.translate.instant(LINE_ADDED_SUCCESSFULLY));
          } else if (event.body.customStatusCode === HttpStatusCodes.DocumentAddedsuccessfully) {
            this.growlService.successNotification(this.translate.instant(DOCUMENT_ADDED_SUCCESSFULLY));
          }else if(event.body.customStatusCode === HttpStatusCodes.LineDeletedSuccessfully){
            this.growlService.successNotification(this.translate.instant(LINE_DELETED_SUCCESSFULLY));
          }
          return event.clone({
            body: _body
          });
        } else if (event.body.customStatusCode === HttpStatusCodes.DocumentImportedSuccessfully) {
          this.growlService.successNotification(this.translate.instant(DOCUMENT_IMPORTED_SUCCESSFULLY));
          return event.clone({
            body: event.body
          });
        } else if (event.body.customStatusCode) {
          this.serviceSpinner.hideLaoder();
          this.errorHandlerService.handleError(new HttpErrorResponse({status: event.body.customStatusCode}), event.body.objectData);
          if (event.body.customStatusCode === HttpStatusCodes.PreselectionToNextStepViolation ||
            event.body.customStatusCode === HttpStatusCodes.deletedFinancialCommitments
            || event.body.customStatusCode === HttpStatusCodes.selectedFinancialCommitmentsHasBeenChanged ||
            event.body.customStatusCode === HttpStatusCodes.ItemWithoutTaxError) {
            return event.clone({
              body: event.body
            });
          }
        } else if (event.body.customStatusCode === HttpAuthErrorCodes.USER_WITH_EMAIL_NOT_ACTIVE) {
          this.authService.logout(this.translate.instant('USER_WITH_EMAIL_NOT_ACTIVE'));
        } else {
          return event;
        }
      }
    });
  }
}
