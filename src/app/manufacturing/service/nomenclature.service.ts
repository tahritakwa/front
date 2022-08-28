import {Inject, Injectable} from '@angular/core';
import {AppConfig} from '../../../COM/config/app.config';
import {NomenclaturesConstant} from '../../constant/manufuctoring/nomenclature.constant';
import {HttpClient} from '@angular/common/http';
import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';
import { Observable } from 'rxjs';
import { Operation } from '../../../COM/Models/operations';
import { Nomenclature } from '../../models/manufacturing/nomenclature.model';

@Injectable()
export class NomenclatureService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, 'manufacturing', NomenclaturesConstant.ENTITY_NAME);
  }

  public checkProductsExistInNomenclature(ListItems: number[],page,size): Observable<any> {
    return this.callService(Operation.POST, 'productsExistenceInNomenclature?page='+page+'&size='+size ,ListItems);
  }

  public isNomenclatureUsedInGamme( id: Number): Observable<any> {
    return this.callService(Operation.GET, 'is-used-in-gamme?id='+id);
  }
}
