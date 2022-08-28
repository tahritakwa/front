import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { EmployeeProject } from '../../../models/rh/employee-project.model';
import { Operation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs/Observable';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class EmployeeProjectService extends ResourceServiceRhPaie<EmployeeProject>  {
  constructor(@Inject(HttpClient)  httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'employeeProject', 'EmployeeProject', 'RH');
  }

  /**
   * Recover employees who are assigned or not to the project include those who have
   * been assigned in the meantime but have been released in free resources section
   * @param idProject
   */
  public getProjectResources(idProject: number): Observable<any> {
    return this.callService(Operation.GET, ProjectConstant.GET_PROJECT_RESOURCES.concat(String(idProject)));
  }

  public getEmployeesAffectedToBillableProject(month: Date, predicate: PredicateFormat): Observable<any> {
    const data: any = {};
    data['month'] = month;
    data['predicate'] = predicate;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, ProjectConstant.GET_EMPLOYEES_AFFECTED_TO_BILLABLE_PROJECT, objectToSend);
  }

  public getAssignationtHistoric(idProject: number, idEmployee: number): Observable<any> {
    return this.callService(Operation.GET, ProjectConstant.GET_ASSIGNATION_HISTORIC
      .concat(String(idProject))
      .concat('/')
      .concat(String(idEmployee)));
  }

}
