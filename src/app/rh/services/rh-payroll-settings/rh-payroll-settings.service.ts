import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { RhPayrollSettings } from '../../../models/rh/rh-payroll-settings.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class RhPayrollSettingsService extends ResourceServiceRhPaie<RhPayrollSettings> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'settings', 'RhPayrollSettings');
  }

  public getRhPayrollSettings(): Observable<any> {
    return this.callService(Operation.GET, SharedConstant.RH_PAYROLL_SETTINGS_URL);
  }
}