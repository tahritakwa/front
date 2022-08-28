import { HttpClient} from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { Resource } from '../../../models/shared/ressource.model';
import { ResourceService } from './resource.service';
import { Inject } from '@angular/core';
import { DataTransferShowSpinnerService } from '../spinner/data-transfer-show-spinner.service';
const ROOT_CONFIG = 'settings_api';

export abstract class ResourceServiceSettings<T extends Resource> extends ResourceService<T> {
    constructor(
        public http: HttpClient, public config: AppConfig, public endpoint: string,
        public model?: string, public module?: string, @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService?
    ) {
     super(http, config, endpoint, model, module, dataTransferShowSpinnerService, ROOT_CONFIG, true);
    }
}
