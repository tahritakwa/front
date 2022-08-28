import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { RoleConfig } from '../../../models/administration/role-config.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { RoleConfigConstant } from '../../../constant/Administration/role-config.constant';
import { Operation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs/Observable';
import { ObjectToSave } from '../../../models/shared/objectToSend';

@Injectable()
export class RoleConfigService extends ResourceService<RoleConfig> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'roleConfig', 'RoleConfig', 'Shared');
  }

  public saveRoleConfig(datatosave: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, RoleConfigConstant.INSERT_ROLE, datatosave);
}

public updateRoleConfig(datatosave: ObjectToSave): Observable<any> {
  return this.callService(Operation.POST, RoleConfigConstant.UPDATE_ROLE, datatosave);
}

  public getRoleConfigs(predicate: PredicateFormat): Observable<any> {
    return this.callService(Operation.POST, RoleConfigConstant.GET_ROLE_CONFIGS, predicate);
}
  public getRoleConfigsCategory(predicate: PredicateFormat): Observable<any> {
    return this.callService(Operation.POST, RoleConfigConstant.GET_ROLE_CONFIGS_CATEGORY, predicate);
}

}
