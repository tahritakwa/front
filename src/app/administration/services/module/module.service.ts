import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ModuleByRole } from '../../../models/administration/module-by-role.model';
import { Observable } from 'rxjs/Observable';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { Operation } from '../../../../COM/Models/operations';
import { RoleConstant } from '../../../constant/Administration/role.constant';
import { ModuleByUser } from '../../../models/administration/module-by-user.model';

@Injectable()
export class ModuleByRoleService extends ResourceService<ModuleByRole> {
    constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
        super(
            httpClient, appConfig,
            'module', 'Role', 'Shared');
    }

    public getModulesByRoleConfig(predicate: PredicateFormat): Observable<any> {
        return this.callService(Operation.POST, RoleConstant.GET_MODULES_BY_ROLE_CONFIG, predicate);
    }
    public getFunctionnalitiesByRoleConfig(predicate: PredicateFormat): Observable<any> {
        return this.callService(Operation.POST, RoleConstant.GET_FUNCTIONNALITIES_BY_ROLE_CONFIG, predicate);
    }
}
@Injectable()
export class ModuleByUserService extends ResourceService<ModuleByUser> {
    constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
        super(
            httpClient, appConfig,
            'module', 'Role', 'Shared');
    }

    public getModulesByUser(predicate: PredicateFormat): Observable<any> {
        return this.callService(Operation.POST, RoleConstant.GET_MODULES_BY_USER, predicate);
    }
    public getFunctionnalitiesByUser(predicate: PredicateFormat): Observable<any> {
        return this.callService(Operation.POST, RoleConstant.GET_FUNCTIONNALITIES_BY_USER, predicate);
    }
}

