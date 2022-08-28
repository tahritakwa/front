import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Tiers } from '../../../models/achat/tiers.model';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { ObjectToSave, EntityAxisValues } from '../../../models/shared/objectToSend';
import { Filter, Relation, PredicateFormat } from '../../../shared/utils/predicate';
import { Subject, Observable } from 'rxjs';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { DataSourceRequestState } from '@progress/kendo-data-query';
@Injectable()
export class TiersService extends ResourceService<Tiers> {
  public isSelectedTier = new Subject<any>();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig,
      'tiers', 'Tiers', 'Sales');
  }
  /**
   * removeTiers
   * @param data
   */
  public removeTiers(data): Observable<any> {
    return super.callService(Operation.DELETE, TiersConstants.TIERS_DELETE_ROOT, data);
  }


  /**
   * saveTiers
   * @param data
   * @param isNew
   */
  public saveTiers(data, isNew: boolean): Observable<any> {
    const object: ObjectToSave = new ObjectToSave();
    object.Model = data;
    object.EntityAxisValues = Array<EntityAxisValues>();
    if (isNew) {
      return this.callService(Operation.POST, TiersConstants.TIERS_INSERT_ROOT, JSON.stringify(object));
    } else {
      return this.callService(Operation.POST, TiersConstants.TIERS_UPDATE_ROOT, JSON.stringify(object));
    }
  }

  public getTiersById(id: number): Observable<any> {
    return super.callService(Operation.GET, 'getTiersById/' + id);
  }
  show(data: any) {
    this.isSelectedTier.next({ value: true, data: data });

  }
  getResult(): Observable<any> {

    return this.isSelectedTier.asObservable();
  }

  public getContactTiers(): Observable<any> {
    return super.callService(Operation.GET, 'getTiersContact');
  }

  public getTiersByType(typeTiers: number): Observable<any> {
    return super.callService(Operation.GET, 'getTiersByType/' + typeTiers);
  }
  public downloadSupplierExcelTemplate(): Observable<any> {
    return super.callService(Operation.GET, 'downloadSupplierExcelTemplate');
  }
  public downloadCustomerExcelTemplate(): Observable<any> {
    return super.callService(Operation.GET, 'downloadCustomerExcelTemplate');
  }

  public getGeneralTier(tier): Observable<any> {
    return super.callService(Operation.POST, 'getGeneralTiers', tier);
  }
  public getlastArticles(tier): Observable<any> {
    return super.callService(Operation.GET, TiersConstants.TIERS_LAST_ARTICLES + tier.Id);
  }
  public uploadSupplier(file): Observable<any> {
    return super.callService(Operation.POST, 'importFileSuppliers', file);
  }
  public uploadCustomer(file): Observable<any> {
    return super.callService(Operation.POST, 'importFileCustomers', file);
  }
  public saveImportedData(data): Observable<any> {
    return super.callService(Operation.POST, 'insertTiersList', data);
  }
  public getSupplierDrodownList(predicate: PredicateFormat, idProject?: number): Observable<any> {
    const data: any = {};
    data['predicate'] = predicate;
    data['idProject'] = idProject;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return super.callService(Operation.POST,
      ProjectConstant.GET_SUPPLIER_DROPDOWN_LIST, objectToSave);
  }
  public getTiersListByArray(tiersArray: number[]) {
    return this.callService(Operation.POST, 'getTiersListByArray', tiersArray) as Observable<any>;
  }
  public CheckTaxRegistrationUnicity(value: String, type: number, code?: String ): Observable<boolean> {
    const object = {
      Value: value,
      Type: type,
      Code: code
    };
    return this.callService(Operation.POST, "CheckTaxRegistration", object) as Observable<boolean>;
  }


  public getCustomersFillingIsAffectedToPricesWithSpecificFilter(state: DataSourceRequestState,
    predicate: PredicateFormat[], idPrice: number): Observable<any> {
    predicate[1] = this.preparePrediacteFormat(state, predicate[1]);
    return super.callService(Operation.POST,
      'getCustomersFillingIsAffectedToPricesWithSpecificFilter/'.concat(idPrice.toString()), predicate);
  }
  public getActivitiesTiers(tier) {
    return this.callService(Operation.POST, 'getActivitiesTiers', tier) as Observable<any>;
  }
  public getFormatOptionsForPurchase(idTier) {
    return this.callService(Operation.GET, TiersConstants.GET_FORMAT_OPTIONS_FOR_PURCHASE + idTier) as Observable<any>;
  }

}
