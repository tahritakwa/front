import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../COM/config/app.config';
import {GammeConstant} from '../../constant/manufuctoring/gamme.constant';
import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';
import {Operation} from '../../../COM/Models/operations';
import {Observable} from 'rxjs';
import {CalculateCostPriceConstant} from '../../constant/manufuctoring/calculateCostPrice.constant';

@Injectable()
export class GammeService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, GammeConstant.MANUFACTURING, GammeConstant.ENTITY_NAME);
  }

  public getAllGammmeOperations(idGamme: Number, page, size): Observable<any> {
    return this.callService(Operation.GET, 'gamme-operations?idGamme=' + idGamme + '&page=' + page + '&size=' + size);
  }
  public getAllGammeForCostPriceListPageable(page, size, sortParams, filters): Observable<any> {
    return this
      .callService(Operation.POST, CalculateCostPriceConstant.GAMME_COST_PRICE + `?page=${page}&size=${size}${sortParams}`, filters);
  }
  public getListGammmeOperations(idGamme: Number): Observable<any> {
    return this.callService(Operation.GET, 'list-gamme-operations?idGamme=' + idGamme);
  }
  public getListOperationsByGamme(idGamme: Number):  Observable<any> {
    return this.callService(Operation.GET, 'list-operations-by-gamme?idGamme=' + idGamme);
  }
  public getListMachinesByGamme(idGamme: Number, page, size):  Observable<any> {
    return this.callService(Operation.GET, 'list-machines-by-gamme?idGamme=' + idGamme + '&page=' + page + '&size=' + size);
  }
  public getListMachinesByOperation(idGamme: Number, opId: number, page, size):  Observable<any> {
    return this.callService(Operation.GET, 'list-machines-by-operation?idGamme=' + idGamme + '&opId=' + opId + '&page=' + page + '&size=' + size);
  }
  public getIdGammeOpByOperation(idGamme: Number, opId: number):  Observable<any> {
    return this.callService(Operation.GET, 'id-gammeOp-by-op?idGamme=' + idGamme + '&opId=' + opId);
  }

  public getProductsNomenclaturesByOperation(idGamme: Number, opId: number, page, size):  Observable<any> {
    return this.callService(Operation.GET, 'list-prNomenclatures-by-operation?idGamme=' + idGamme  + '&opId=' + opId + '&page=' + page + '&size=' + size);
  }

  public checkProductsExistInGamme(ListItems: number[], page, size): Observable<any> {
    return this.callService(Operation.POST, 'productsExistenceInGamme?page=' + page + '&size=' + size, ListItems);
  }
  public getAllResponsibles(): Observable<any> {
    return this.callService(Operation.GET, 'responsibles');
  }

  }
