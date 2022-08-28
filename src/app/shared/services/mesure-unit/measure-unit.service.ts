import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceService } from '../resource/resource.service';
import { MeasureUnit } from '../../../models/inventory/measure-unit.model';

@Injectable()
export class MeasureUnitService extends ResourceService<MeasureUnit> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'measureUnit', 'MeasureUnit', 'Inventory');
  }
}
