import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { Role } from '../../../models/administration/role.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { RoleConfigConstant } from '../../../constant/Administration/role-config.constant';
import { Operation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs/Observable';
import { ObjectToSave } from '../../../models/shared/objectToSend';

@Injectable()
export class RoleService extends ResourceService<Role> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'role', 'Role', 'Shared');
  }

  public saveRole(datatosave: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, RoleConfigConstant.INSERT_ROLE, datatosave);
}

public updateRole(datatosave: ObjectToSave): Observable<any> {
  return this.callService(Operation.POST, RoleConfigConstant.UPDATE_ROLE, datatosave);
}

public getRoleConfigsFromRole(data: any): Observable<any> {
  return this.callService(Operation.POST, RoleConfigConstant.GET_ROLE_CONFIGS_FROM_ROLE, data);
}
  public getRoleConfigs(predicate: PredicateFormat): Observable<any> {
    return this.callService(Operation.POST, RoleConfigConstant.GET_ROLE_CONFIGS, predicate);
}
}
