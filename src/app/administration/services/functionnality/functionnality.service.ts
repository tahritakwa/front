import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { FunctionnalityByRole } from '../../../models/administration/functionnality-by-role.model';
import { FunctionnalityByUser } from '../../../models/administration/functionnality-by-user.model';

@Injectable()
export class FunctionnalityByRoleService extends ResourceService<FunctionnalityByRole> {
    constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
        super(
            httpClient, appConfig,
            'module', 'FunctionnalityByRole', 'Functionnality');
    }
}

@Injectable()
export class FunctionnalityByUserService extends ResourceService<FunctionnalityByUser> {
    constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
        super(
            httpClient, appConfig,
            'module', 'FunctionnalityByUser', 'Functionnality');
    }
}
