import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppConfig} from '../../../../COM/config/app.config';
import {Operation} from '../../../../COM/Models/operations';
import {CompanyConstant} from '../../../constant/Administration/company.constant';

import {EmployeeConstant} from '../../../constant/payroll/employee.constant';
import {UserCurrentInformations} from '../../../models/shared/user-current-informations.model';
import {ResourceService} from '../resource/resource.service';

@Injectable()
export class UserCurrentInformationsService extends ResourceService<UserCurrentInformations>{

    constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
        super(
            httpClient, appConfig,
            'userCurrentInformations', 'UserCurrentInformations', 'Shared');
    }

   /* getCurrentLanguage(): Observable<any> {
        const token = this.jwtService.decodeToken(localStorage.getItem('access_token'));
        return this.userJavaService.getJavaGenericService().callService(Operation.GET, LoginConst.GET_CONNECTED_USER_LANGUAGE + '?email=' + token['user_name']);
    }


    public getCompanyDefaultLanguage(): Observable<any> {
        return this.companyJavaService.getJavaGenericService().callService(Operation.GET, CompanyConstant.GET_COMPANY_DEFAULT_LANGUAGE);
    }

    public getLanguagefromToken(): string {
        let access_token = localStorage.getItem('access_token');
        if (access_token) {
            const user = this.jwtService.decodeToken(localStorage.getItem('access_token'));
          return user.user.Language !== null ? user.user.Language : user.language;
        } else {
            return null
        }
    }

    public getconnectedUserFromToken(): any {
        let access_token = localStorage.getItem('access_token');
        if (access_token) {
            const user = this.jwtService.decodeToken(localStorage.getItem('access_token'));
            return user.user;
        } else {
            return null;
        }
    }
*/
    public getConnectedEmployeeId(): Observable<any> {
        return this.callService(Operation.GET, EmployeeConstant.GET_CONNECTED_EMPLOYEE_ID);
    }


  public getCurrentCompanyActivityAreaAndCurrency() : Observable<any> {
    return this.callService(Operation.GET,CompanyConstant.GET_CURRENT_COMPANY_ACTIVITY_AREA_AND_CURRENCY);
  }

  /*public getUserCurrentInformations(): Observable<any> {
      return this.callService(Operation.GET, SharedConstant.GET_USER_CURRENT_INFORMATIONS);
  }*/
}
