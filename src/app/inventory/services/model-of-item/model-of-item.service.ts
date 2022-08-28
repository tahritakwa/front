import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { ModelOfItem } from '../../../models/inventory/model-of-item.model';

@Injectable()
export class ModelOfItemService extends ResourceService<ModelOfItem> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'modelOfItem', 'ModelOfItem', 'Inventory');
  }
}
