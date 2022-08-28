import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../COM/config/app.config';
import {ProductNomenclatureConstant} from '../../constant/manufuctoring/productNomenclature.constant';
import {HttpClient} from '@angular/common/http';
import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';

@Injectable()
export class ProductNomenclatureService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, 'manufacturing', ProductNomenclatureConstant.ENTITY_NAME);
  }
  

}
