import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Offer} from '../../../models/rh/offer.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {OfferConstant} from '../../../constant/rh/offer.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class OfferService extends ResourceServiceRhPaie<Offer> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'offer', 'Offer', 'RH');
  }

  public generateOffermail(offer: Offer, lang?: string): Observable<any> {
    return super.callService(Operation.POST, OfferConstant.GENERATE_OFFER_EMAIL_BY_OFFER.concat('/').concat(lang), offer);
  }

  public getOfferWithHisNavigations(idOffer: number): Observable<any> {
    return super.callService(Operation.GET, OfferConstant.GET_OFFER_WITH_HIS_NAVIGATION.concat(String(idOffer)));
  }

  public acceptTheOffer(offer: Offer): Observable<any> {
    return super.callService(Operation.POST, OfferConstant.ACCEPT_OFFER, offer);
  }

  public refuseTheOffer(offer: Offer): Observable<any> {
    return super.callService(Operation.POST, OfferConstant.REFUSE_OFFER, offer);
  }

  public updateOfferAfterEmailSend(offer: Offer): Observable<any> {
    return super.callService(Operation.POST, OfferConstant.UPDATE_OFFER_AFTER_EMAIL_SEND, offer);
  }
}
