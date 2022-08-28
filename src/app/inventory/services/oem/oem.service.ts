import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { Oem } from '../../../models/inventory/oem.model';
import { Observable } from 'rxjs';

@Injectable()
export class OemService extends ResourceService<Oem>{

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'oem', 'Oem', 'Inventory');
  }

  getOemlistWithSubbs(tecdocwithFilter): Observable<any> {
    return super.callService(Operation.POST, 'getOemList', tecdocwithFilter);
  }
}
