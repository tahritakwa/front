import {Inject, Injectable} from '@angular/core';
import {ContractBenefitInKind} from '../../../models/payroll/contract-benefit-in-kind.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ContractBenefitInKindService extends ResourceServiceRhPaie<ContractBenefitInKind> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'ContractBenefitInKind', 'PayRoll');
  }

}
