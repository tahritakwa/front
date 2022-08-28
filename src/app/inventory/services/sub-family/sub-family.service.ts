import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { SubFamily } from '../../../models/inventory/sub-family.model';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SubFamilyService extends ResourceService<SubFamily> {
  public isCardMode = new Subject<any>();
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'subFamily', 'SubFamily', 'Inventory');
  }
  show(data: any) {
    this.isCardMode.next({value: true, data: data});
  }
  getResult(): Observable<any> {
    return this.isCardMode.asObservable();
  }
}
