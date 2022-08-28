import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { City } from '../../../models/administration/city.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';

@Injectable()
export class CityService extends ResourceService<City> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig, 'city', 'City', 'Shared');
  }

}
