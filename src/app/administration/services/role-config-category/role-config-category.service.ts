import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { RoleConfigCategory } from '../../../models/administration/role-config-category.model';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';

@Injectable()
export class RoleConfigCategoryService extends ResourceService<RoleConfigCategory> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, undefined, 'RoleConfigCategory', 'Shared');
  }

}

