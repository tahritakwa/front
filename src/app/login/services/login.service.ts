import {Observable} from 'rxjs/Observable';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../COM/config/app.config';
import {Operation} from '../../../COM/Models/operations';
import {ResourceService} from '../../shared/services/resource/resource.service';
import {Credentials} from '../../models/login/credentials.model';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../shared/services/language/language.service';
import {DashboardService} from '../../dashboard/services/dashboard.service';
import {ChatService} from '../../shared/services/signalr/chat/chat.service';
import {StarkRolesService} from '../../stark-permissions/service/roles.service';
import {StarkPermissionsService} from '../../stark-permissions/stark-permissions.module';
import {LoginConst} from '../../constant/login/login.constant';
import {UserConstant} from '../../constant/Administration/user.constant';


@Injectable()
export class LoginService extends ResourceService<Credentials> {

  public listRoleConfigs: any;
  public showAside: any = 'lg';

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
              public dashService: DashboardService) {
    super(httpClient, appConfig, UserConstant.LOGIN);
  }

  /**
   * get list of all campanies
   * */
  public getCompanyList(): Observable<any[]> {
    return this.callService(Operation.GET, UserConstant.COMPANY_LIST);
  }


  public changeDataBaseConnection(code: string): Observable<any> {
    return this.callService(Operation.POST, LoginConst.CHANGE_DATA_BASE_CONNECTION, code);
  }

  public setDotNetSessionInformation(data): Observable<any> {
    return this.callService(Operation.POST, LoginConst.SET_DOT_NET_SESSION_INFORMATION, data);
  }

  public changeCompany(companyCode: string): Observable<any> {
    return this.callService(Operation.POST, LoginConst.CHANGE_COMPANY, companyCode);
  }

  /**
   * get environment name
   */
  public getEnvName(): Observable<any> {
    return this.callService(Operation.GET, 'getEnvName');
  }

  /**
   * validate recaptcha token
   * @param captchaResponse
   */
  public ValidateRecaptchaToken(captchaResponse: string): Observable<any> {
    return this.callService(Operation.POST, 'ValidateRecaptchaToken', captchaResponse);
  }

}
