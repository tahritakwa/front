import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ContractBonus} from '../../../models/payroll/contract-bonus.model';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ContractBonusService extends ResourceServiceRhPaie<ContractBonus> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'ContractBonus', 'PayRoll');
  }

}
