import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';
import { Machine } from '../../../models/garage/machine.model';
import { Operation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs/Observable';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';

@Injectable()
export class MachineService extends ResourceServiceGarage<Machine> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'machine', 'Machine');
  }

  readDropdownDataWithNotAffectedMachine(machinesInGrid, idGarage, machineSelected): Observable<any> {
    const data: any = {};
    data['IdGarage'] = idGarage ? idGarage : 0;
    data['MachinesInTheGrid'] = machinesInGrid ? machinesInGrid : [];
    data['SelectedMachine'] = machineSelected ? machineSelected : 0;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, GarageConstant.GET_DROPDOWN_DATA_MACHINE_NOT_AFFECTED, objectToSend);
  }
}
