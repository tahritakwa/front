import { Injectable, Inject } from '@angular/core';
import { GeneralSettings } from '../../../models/shared/general-settings';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { GeneralSettingsConstant } from '../../../constant/shared/general-settings.constant';
import { ResourceServiceRhPaie } from '../resource/resource.service.rhpaie';

@Injectable()
export class GeneralSettingsService extends ResourceServiceRhPaie<GeneralSettings> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'generalSettings', 'GeneralSettings', 'Shared');
  }

  public getReviewManagerSettings(): Observable<any> {
    return super.callService(Operation.GET, GeneralSettingsConstant.GET_REVIEW_MANAGER_Settings);
  }
  public updateReviewManagerSettings(obj: any): Observable<any> {
    return super.callService(Operation.PUT, 'UpdateReviewManagerSettings', obj);
  }

}
