import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {LoginConst} from '../../../constant/login/login.constant';
import {UserRequestDto} from '../../../login/Authentification/models/user-request-dto';

@Injectable()
export class UserJavaService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigAuth) {
    super(httpClient, appConfigAuth, 'auth', 'users');
  }


  changeUserLanguage(userMail : string , language : string) : Observable<any>{
    let userLanguage = new UserRequestDto();
    userLanguage.email = userMail;
    userLanguage.language = language;
    return this.getJavaGenericService().callService(Operation.POST,LoginConst.CHANGE_CONNECTED_USER_LANGUAGE,userLanguage);
  }
}
