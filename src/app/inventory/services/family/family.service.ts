import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { Family } from '../../../models/inventory/family.model';

@Injectable()
export class FamilyService extends ResourceService<Family> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'family', 'Family', 'Inventory');
  }
}
