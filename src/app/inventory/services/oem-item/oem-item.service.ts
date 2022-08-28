import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { OemItem } from '../../../models/inventory/oem-item.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';

@Injectable()
export class OemItemService  extends ResourceService<OemItem> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'oemItem', 'OemItem', 'Inventory');
  }
}