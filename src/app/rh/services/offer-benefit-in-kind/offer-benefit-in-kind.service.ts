import {Inject, Injectable} from '@angular/core';
import {OfferBenefitInKind} from '../../../models/rh/offer-benefit-in-kind.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class OfferBenefitInKindService extends ResourceServiceRhPaie<OfferBenefitInKind> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'OfferBenefitInKind', 'RH');
  }
}
