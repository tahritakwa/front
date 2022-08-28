import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { FunctionnalityConfig } from '../../../models/administration/functionnality-config.model';

@Injectable()
export class FunctionalityConfigService extends ResourceService<FunctionnalityConfig> {
    constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
        super(
            httpClient, appConfig,
            'module', 'FunctionnalityConfig', 'FunctionnalityConfig');
    }
}


