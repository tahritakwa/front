import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ModuleConfig } from '../../../models/administration/module-config.model';
import { Observable } from 'rxjs/Observable';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { Operation } from '../../../../COM/Models/operations';
import { RoleConfigConstant } from '../../../constant/Administration/role-config.constant';

@Injectable()
export class ModuleConfigService extends ResourceService<ModuleConfig> {
    constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
        super(
            httpClient, appConfig,
            'module', 'RoleConfig', 'Shared');
    }

    public getModulesByRoleConfig(predicate: PredicateFormat): Observable<any> {
        return this.callService(Operation.POST, RoleConfigConstant.GET_MODULES_BY_ROLE_CONFIG, predicate);
    }
    public getFunctionnalitiesByRoleConfig(predicate: PredicateFormat): Observable<any> {
        return this.callService(Operation.POST, RoleConfigConstant.GET_FUNCTIONNALITIES_BY_ROLE_CONFIG, predicate);
    }
}


