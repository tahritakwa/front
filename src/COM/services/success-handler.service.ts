import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpAccountErrorCodes } from '../../app/accounting/http-error-account-codes';
import { GrowlService } from '../Growl/growl.service';
import { HttpStatusCodes } from './http-status-codes';
import { DatePipe } from '@angular/common';
import { TimePipe } from '../../app/shared/components/time-pipe/time-pipe.component';
import { SharedConstant } from '../../app/constant/shared/shared.constant';
import { DocumentAccountConstant } from '../../app/constant/accounting/document-account.constant';
import { HttpCrmErrorCodes } from '../../app/crm/http-error-crm-codes';
import { NumberConstant } from '../../app/constant/utility/number.constant';
import { HttpErrorManufacturingCode } from '../../app/manufacturing/http-error-manufacturing-code';
import { SkillsConstant } from '../../app/constant/payroll/skills.constant';
import { StockDocumentConstant } from '../../app/constant/inventory/stock-document.constant';

const pipe = new DatePipe('en-US');
const timePipe = new TimePipe();

const FUNCTION = 'function';
const LOGIN_URL = 'login';
const EN = 'en';

const LOGIN_PAGE = 'login';

const UNKNOWN_ERROR_MSG = 'UNKNOWN_ERROR_MSG';
const SESSION_EXPIRED = 'SESSION_EXPIRED';
const SUCCESS_OPERATION = 'SUCCESS_OPERATION';
const ENTITY_PARAMETER = '{ENTITY_PARAMETER}';
const ADD_SUCCESSFUL = 'ADD_SUCCESSFUL';
const UPDATE_SUCCESSFUL = 'UPDATE_SUCCESSFUL';
const DELETE_SUCCESSFULL = 'DELETE_SUCCESSFULL';
const AFFECTED_SUCCESSFULL = 'AFFECTED_SUCCESSFULL';
const UNAFFECTED_SUCCESSFULL = 'UNAFFECTED_SUCCESSFULL';
const ENABLE_USER_SUCCESSFULL = 'ENABLE_USER_SUCCESSFULL';
const DISABLE_USER_SUCCESSFULL = 'DISABLE_USER_SUCCESSFULL';
const ENABLE_MASSIF_USERS_SUCCESSFULL = 'ENABLE_MASSIF_USERS_SUCCESSFULL';
const DISABLE_MASSIF_USERS_SUCCESSFULL = 'DISABLE_MASSIF_USERS_SUCCESSFULL';
const SUCCESS_SEND_MAIL = 'SUCCESS_SEND_MAIL';
const SUCCESS_CLOSE_SESSION_CASH = 'SUCCESS_CLOSE_SESSION_CASH';
const SUCCESS_OPEN_SESSION_CASH = 'SUCCESS_OPEN_SESSION_CASH';
const SEND_SMS_SUCCESSFULL = 'SEND_SMS_SUCCESSFULL';

const ENTITY = 'ENTITY';


/**
 *
 * handle http response errors
 * */
@Injectable()
export class SuccessHandlerService implements ErrorHandler {

  // errors diactionary
  private errorActions: Array<Function>;

  /**
   * create new service instance
   * @param router
   * @param growlService
   * @param translate
   */
  constructor(private router: Router, private growlService: GrowlService, private translate: TranslateService, private datePipe: DatePipe) {
    this.initErrorActions();
  }

  /**
   * handel error and show error message
   * @param error
   * @param listErrorParams
   */
  public handleError(error: HttpErrorResponse, listErrorParams?: any): void {
    const httpErrorCode = error.status;
    if (!this.translate.getDefaultLang()) {
      this.translate.setDefaultLang(EN);
    }
    if (typeof this.errorActions[httpErrorCode] === FUNCTION) {
      if (listErrorParams) {
        this.errorActions[httpErrorCode](listErrorParams);
      } else if (httpErrorCode === 800) {
        this.growlService.ErrorNotification(this.translate.instant(SESSION_EXPIRED));
        setTimeout(() => {
          this.router.navigateByUrl(LOGIN_PAGE);
        }, 2000);
      } else {
        this.errorActions[httpErrorCode]();
      }
    } else {
      this.growlService.successNotification(this.translate.instant(SUCCESS_OPERATION));
    }
  }

  /**
   * init errors diactionary
   * */
  private initErrorActions() {
    // create error dictionary
    this.errorActions = new Array();
    // when Unauthorized error action
    this.errorActions[HttpStatusCodes.AddSuccessfull] = (param: any) => {
      this.growlService.successNotification(this.buildMsgWithEntityName(param, ADD_SUCCESSFUL));
    };
    this.errorActions[HttpStatusCodes.UpdateSuccessfull] = (param: any) => {
      this.growlService.successNotification(this.buildMsgWithEntityName(param, UPDATE_SUCCESSFUL));
    };
    this.errorActions[HttpStatusCodes.DeleteSuccessfull] = (param: any) => {
      this.growlService.successNotification(this.buildMsgWithEntityName(param, DELETE_SUCCESSFULL));
    };
    this.errorActions[HttpStatusCodes.AffectedSuccessfully] = (param: any) => {
      this.growlService.successNotification(this.buildMsgWithEntityName(param, AFFECTED_SUCCESSFULL));
    };
    this.errorActions[HttpStatusCodes.UnaffectedSuccessfully] = (param: any) => {
      this.growlService.successNotification(this.buildMsgWithEntityName(param, UNAFFECTED_SUCCESSFULL));
    };
    this.errorActions[HttpStatusCodes.EnableUserSuccessfull] = (param: any) => {
      this.growlService.successNotification(this.buildMsgWithEntityName(param, ENABLE_USER_SUCCESSFULL));
    };
    this.errorActions[HttpStatusCodes.DisableUserSuccessfull] = (param: any) => {
      this.growlService.successNotification(this.buildMsgWithEntityName(param, DISABLE_USER_SUCCESSFULL));
    };
    this.errorActions[HttpStatusCodes.EnableMassifUsersSuccessfull] = (param: any) => {
      this.growlService.successNotification(this.buildMsgWithEntityName(param, ENABLE_MASSIF_USERS_SUCCESSFULL));
    };
    this.errorActions[HttpStatusCodes.DisableMassifUsersSuccessfull] = (param: any) => {
      this.growlService.successNotification(this.buildMsgWithEntityName(param, DISABLE_MASSIF_USERS_SUCCESSFULL));
    };
    this.errorActions[HttpStatusCodes.SendMailSuccessfull] = (param: any) => {
      this.growlService.successNotification(this.buildMsgWithEntityName(param, SUCCESS_SEND_MAIL));
    };
    this.errorActions[HttpStatusCodes.SessionCashClosedSuccessfull] = (param: any) => {
      this.growlService.successNotification(this.buildMsgWithEntityName(param, SUCCESS_CLOSE_SESSION_CASH));
    };
    this.errorActions[HttpStatusCodes.SessionCashOpenedSuccessfull] = (param: any) => {
      this.growlService.successNotification(this.buildMsgWithEntityName(param, SUCCESS_OPEN_SESSION_CASH));
    };
    this.errorActions[HttpStatusCodes.SendSMSSuccessfull] = (param: any) => {
      this.growlService.successNotification(this.buildMsgWithEntityName(param, SEND_SMS_SUCCESSFULL));
    };
  }

  private buildMsgWithEntityName(param, GenericMsg): string {
    if (param) {
      let entityName: string;
      entityName = param.EntityName ? param.EntityName.toUpperCase() : ENTITY;
      if (entityName === SkillsConstant.SKILLS) {
        entityName = SkillsConstant.SKILLS_ENTITY;
      } else if (entityName === StockDocumentConstant.STOCKDOCUMENT_INV){
        entityName = StockDocumentConstant.INVENTORY_UPPERCASE;
      } else if (entityName === StockDocumentConstant.STOCKDOCUMENT_TM){
        entityName = StockDocumentConstant.TRANSFERT_MOVEMENT;
      } else if (entityName === StockDocumentConstant.STOCKDOCUMENT_TSHST){
      entityName = StockDocumentConstant.TRANSFERT_MOVEMENT;
      }else if (entityName === StockDocumentConstant.TIERCATEGORY){
        entityName = StockDocumentConstant.TIER_CATEGORY;
      }
      const message = this.translate.instant(GenericMsg);
      const msgWithParam = message.toString().replace(ENTITY_PARAMETER, this.translate.instant(entityName));
      return msgWithParam;
    }
  }
  /**
   * buid error message for unath error
   * @param errorParams
   * @returns error message
   */
  private buildUnathErrorMessage(errorParams: any): string {
    // error param contains missing role name
    const missingRole = errorParams.param1 as string;
    const message = 'msg';
    return message;
  }
}
