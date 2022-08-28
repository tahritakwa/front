import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../../COM/config/app.config';
import { FabricationArrangementConstant } from '../../constant/manufuctoring/fabricationArrangement.constant';
import { HttpClient } from '@angular/common/http';
import { ResourceServiceJava } from '../../shared/services/resource/resource.serviceJava';

@Injectable()
export class FabricationArrangementService extends ResourceServiceJava{

  private connectionFab: string;
  private sectionFab = 'manufacturing';
  private endpointFab = 'of';

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigManufactoring) {
    super(httpClient, appConfigManufactoring, 'manufacturing', FabricationArrangementConstant.ENTITY_NAME);
    this.connectionFab = appConfigManufactoring.getConfig('root_api');
  }

  public readReport (url: string, data?: any) {
    return this.http.post(`${this.connectionFab}/${this.sectionFab}/${this.endpointFab}/${url}`, data, { responseType: 'blob' });
  }
}
