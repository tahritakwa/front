import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../COM/config/app.config';
import { ResourceService } from '../../shared/services/resource/resource.service';
import { Storage } from '../../models/inventory/storage.model';


@Injectable()
export class StorageService extends ResourceService<Storage> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'storage', 'Storage', 'Inventory');
  }


}
