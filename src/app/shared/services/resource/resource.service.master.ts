import { MasterConfigService } from '../../../../COM/config/app-config.service-master';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { QueryOptions } from '../../utils/query-options';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';

export abstract class ResourceServiceMaster {
    private masterConfigservice: MasterConfigService;
    private headers: HttpHeaders;

    constructor(
        private http: HttpClient,
        private config: AppConfig,
        private endpoint: string,
        ) {
        this.headers = this.headers || new HttpHeaders();
        this.masterConfigservice = new MasterConfigService(http, config, endpoint);
    }

    public callService(action: Operation, service: string, data?: any, queryOptions?: QueryOptions): Observable<any> {
        return this.masterConfigservice.callService(action, service, data, queryOptions);
    }
}
