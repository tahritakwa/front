import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { User } from '../../../models/administration/user.model';
import { Operation as RequestOperation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs/Observable';
const URL_TARGETED_USERS = 'getTargetedUsers';
const USER = 'UserB2B';
const SHARED = 'Shared';
const USER_BASE_URL = 'UserB2b';
const GET_LIST_OF_USERS_PARENT = '/getListOfUsersParent';
const CHANGE_PASSWORD = 'updatePwd';
@Injectable()
export class UserB2bService extends ResourceService<User> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, USER_BASE_URL, USER, SHARED);
  }
  public getUserIdFromIdTiers(idTiers: number): Observable<any> {
    return super.callService(RequestOperation.GET, 'getUserIdFromIdTiers/' + idTiers);
  }
  public getTargetedUsers(objectToSend: any): Observable<Array<User>> {
    return super.callService(RequestOperation.POST, URL_TARGETED_USERS, objectToSend);
  }
}
