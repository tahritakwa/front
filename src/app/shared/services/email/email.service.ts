import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { Email } from '../../../models/rh/email.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { EmailConstant } from '../../../constant/rh/email.constant';
import { ResourceServiceSettings } from '../resource/resource.service.settings';

@Injectable()
export class EmailService extends ResourceServiceSettings<Email> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'email', 'Email', 'Mailing');
  }

  public sendEmail(email: Email): Observable<any> {
    var emailList: Email[] = [];
    emailList.push(email);
    return super.callService(Operation.POST, EmailConstant.SEND_EMAIL,emailList);
  }
  public getEmailById(id: number): Observable<any> {
    return super.callService(Operation.POST, EmailConstant.GET_EMAIL_BY_ID_URL + id);
  }
}
