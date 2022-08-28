import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { Project } from '../../../models/sales/project.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { ObjectToSend, ObjectToSave } from '../../../models/sales/object-to-save.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class ProjectService extends ResourceServiceRhPaie<Project> {
  constructor(@Inject(HttpClient)  httpClient, @Inject(AppConfig) appConfig) {
    super( httpClient, appConfig, 'project', 'Project', 'RH');
  }
  public defaultStartEndDateSearchSession = new Observable<Date[]>();
  public getEmployeeProjectChange(objectToSend: ObjectToSend): Observable<any> {
    return super.callService(Operation.POST, ProjectConstant.GET_EMPLOYEE_MONTH_PROJECT, objectToSend);
  }

  public getEmployeeWorkedProject(objectToSend: ObjectToSend): Observable<any> {
    return super.callService(Operation.POST, ProjectConstant.GET_EMPLOYEE_WORKED_PROJECT, objectToSend);
  }

  public getProjectDropdownForBillingSession(predicate: PredicateFormat, month: Date): Observable<any> {
    const data: any = {};
    data['predicate'] = predicate;
    data['month'] = month;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return super.callService(Operation.POST,
      ProjectConstant.GET_PROJECT_DROPDOWN_FOR_BILLING_SESSION, objectToSave);
  }

  public getModelByConditionWithHistory(predicate: PredicateFormat): Observable<any> {
    return super.callService(Operation.POST, ProjectConstant.GET_MODEL_BY_CONDITION_WITH_HISTORY, predicate);
  }

  public getFiltredProjectList(state: DataSourceRequestState, predicate: PredicateFormat, startDate: Date, endDate: Date): Observable<any> {
    super.prepareServerOptions(state, predicate);
    const data: any = {};
    data['predicate'] = predicate;
    data['startDate'] = startDate;
    data['endDate'] = endDate;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return super.callService(Operation.POST, ProjectConstant.GET_FILTRED_PROJECT_LIST, objectToSave);
  }
}

