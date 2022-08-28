import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../COM/config/app.config';
import {GammeConstant} from '../../constant/manufuctoring/gamme.constant';
import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';
import {DetailOfConstant} from '../../constant/manufuctoring/detailOf.constant';

@Injectable()
export class OfService extends ResourceServiceJava {
  private connectionFab: string;
  private sectionFab = 'manufacturing';
  private endpointFab = 'Of';
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, GammeConstant.MANUFACTURING, DetailOfConstant.ENTITY);
   
  }


}
