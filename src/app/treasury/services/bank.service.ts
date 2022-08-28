import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../COM/config/app.config';
import {ResourceService} from '../../shared/services/resource/resource.service';
import { Bank } from '../../models/shared/bank.model';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../COM/Models/operations';
import { ObjectToSend } from '../../models/sales/object-to-save.model';

@Injectable()
export class BankService  extends  ResourceService<Bank> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'bank', 'Bank', 'Shared');
  }

  public updateBank(bank: any): Observable<any> {
    const data: any = {};
    data['bank'] = bank;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.PUT, 'updateBank', objectToSend);
  }

  public addBank(bank: any): Observable<any> {
    const data: any = {};
    data['bank'] = bank;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'addBank', objectToSend);
  }





}