import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { BillingEmployee } from '../../../models/sales/billing-employee.model';
@Injectable()
export class BillingEmployeeService extends ResourceService<BillingEmployee> {
    constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
        super(
            httpClient, appConfig,
            'base', 'BillingEmployee', 'Sales');
    }

}
