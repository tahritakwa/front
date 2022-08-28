import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { MasterRoleUser } from '../../../models/administration/user-role.model';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';

@Injectable()
export class UserRoleService extends ResourceService<MasterRoleUser> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'base', 'UserRole', 'Shared');
  }

}
