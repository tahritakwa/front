import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { GarageSettings } from '../../../models/garage/garage-settings.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class GarageSettingsService extends ResourceServiceGarage<GarageSettings> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'settings', 'GarageSettings');
  }

  public getGarageVersionProperties(): Observable<any> {
    return this.callService(Operation.GET, GarageConstant.GET_GARAGE_SETTINGS);
  }
}
