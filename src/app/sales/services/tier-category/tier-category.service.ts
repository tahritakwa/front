import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AppConfig } from './../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { TierCategory } from './../../../models/sales/tier-category.model';
import { Injectable , Inject} from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';

@Injectable()
export class TierCategoryService extends ResourceService<TierCategory> {


constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
  super(httpClient, appConfig, 'base', 'TierCategory', 'Sales');
 }


}
