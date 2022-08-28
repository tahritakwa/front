import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { Worker } from '../../../models/garage/worker.model';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';

@Injectable()
export class WorkerService extends ResourceServiceGarage<Worker> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'worker', 'Worker');
  }
  getDropdownDataWithNotAffectedWorkers(workersInGrid, idGarage, selectedWorker): Observable<any> {
    const data: any = {};
    data['IdGarage'] = idGarage ? idGarage : 0;
    data['WorkersInGrid'] = workersInGrid ? workersInGrid : [];
    data['SelectedWorker'] = selectedWorker ? selectedWorker : 0;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, GarageConstant.GET_DROPDOWN_DATA_WITH_NOT_AFFECTED_WORKERS, objectToSend);
  }
}
