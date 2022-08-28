import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../resource/resource.service';
import { Information } from '../../../../models/shared/information.model';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../../COM/config/app.config';
import { Observable } from 'rxjs/Observable';
import { PredicateFormat, Filter, Operation } from '../../../utils/predicate';
import { InformationTypeEnum } from './information.enum';

const INFORMATION = 'Information';
const ERP_SETTINGS = 'ErpSettings';
const TYPE = 'Type';

@Injectable()
export class InformationService extends ResourceService<Information> {

  /**
   * create new service information
   * @param httpClient
   * @param appConfig
   */
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'information', INFORMATION, ERP_SETTINGS);
  }
  /**
   * get information to send by type
   * @param informationType
   */
  getInfomationByType(informationType: InformationTypeEnum): Observable<Information> {
    return super.getModelByCondition(this.prepareTypePredicate(informationType));
  }
  /**
   * preppare predicate format
   * @param informationType
   */
  private prepareTypePredicate(informationType: InformationTypeEnum): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(TYPE, Operation.eq, informationType));
    return predicate;
  }
}
