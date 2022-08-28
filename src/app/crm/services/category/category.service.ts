import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import { Operation } from '../../../../COM/Models/operations';
import {CrmConstant} from '../../../constant/crm/crm.constant';
import {Subject} from 'rxjs/Subject';
import {OpportunityConstant} from '../../../constant/crm/opportunityConstant';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CategoryService extends ResourceServiceJava {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, 'crm', 'category/categories');
  }
  public statusSaved = new Subject<any>();

  getStatusTitleByCategoryIdAndPositionInPipe(categoryId: number, position: number): any {
   return this.callService(Operation.GET, `${categoryId}/${position}`);
  }
  getListOfCategories(type, isArchivingMode) {
    return this.callService(Operation.GET,
      CrmConstant.BY_TYPE.concat(type).concat('/related-to-opp-are-archived/').concat(isArchivingMode));
  }
  search(searchValue: string, pageSize: number, pageNumber: number): Observable<any> {
    return this.callService(Operation.GET, 'search/'.concat(searchValue).concat(`?page=${pageNumber}&size=${pageSize}`));
  }
}

