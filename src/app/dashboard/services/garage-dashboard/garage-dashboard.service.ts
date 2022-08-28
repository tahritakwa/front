import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { DashboardConstant } from '../../../constant/dashboard/dashboard.constant';
import { Dashboard } from '../../../models/dashboard/dashboard.model';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { ResourceServiceGarage } from '../../../shared/services/resource/ressource.service.garage';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';


@Injectable()
export class GarageDashboardService extends ResourceServiceGarage<Dashboard> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
    @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService) {
    super(httpClient, appConfig, 'garageDashboard', null, dataTransferShowSpinnerService);
  }


  getKPIFromTurnoverPerGarageStoredProcedure( periodEnum: number,
    byMonth: number): Observable<any> {
    const data = {};
    data['periodEnum'] = periodEnum;
    data['byMonth'] = byMonth;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPIFromTurnoverPerGarageStoredProcedure', objectToSend, null, true);
  }
  getKPIFromTotalInterventionPerGarageStoredProcedure(periodEnum: number): Observable<any> {
    const data = {};
    data['periodEnum'] = periodEnum;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPIFromTotalInterventionPerGarageStoredProcedure', objectToSend, null, true);
  }

  public getListAvailableLoanVehicle(): Observable<any> {
    return this.callService(Operation.GET, DashboardConstant.GET_AVAILABLE_lOAN_VEHICLE);
  }
  public getListOfInterventionInProgress(): Observable<any> {
    return this.callService(Operation.GET, DashboardConstant.GET_IN_PROGRESS_INTERVENTION);
  }

  getKPIFromTurnoverPerOperationStoredProcedure( periodEnum: number,byMonth: number): Observable<any> {
    const data = {};
    data['periodEnum'] = periodEnum;
    data['byMonth'] = byMonth;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, 'getKPIFromTurnoverPerOperationStoredProcedure', objectToSend, null, true);
  }
  getDailyAppointmentList(startDate: Date, endDate: Date): Observable<any> {
    const data: any = {};
    data['startDate'] = startDate;
    data['endDate'] = endDate;
    return this.callService(Operation.POST, DashboardConstant.GET_DAILY_APPOINTMENT_LIST, data);
  }
}
