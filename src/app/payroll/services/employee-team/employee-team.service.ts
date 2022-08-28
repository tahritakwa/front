import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Operation} from '../../../../COM/Models/operations';
import {Observable} from 'rxjs/Observable';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {EmployeeTeam} from '../../../models/payroll/employee-team.model';
import {TeamConstant} from '../../../constant/payroll/team.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class EmployeeTeamService extends ResourceServiceRhPaie<EmployeeTeam> {
  constructor(@Inject(HttpClient)  httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'employeeTeam', 'EmployeeTeam', 'PayRoll');
  }

  /**
   * Recover employees who are assigned or not to the team include those who have
   * been assigned in the meantime but have been released in free resources section
   * @param idTeam
   */
  public getTeamResources(idTeam: number): Observable<any> {
    return this.callService(Operation.GET, TeamConstant.GET_TEAM_RESOURCES.concat(String(idTeam)));
  }

  /**
   * Recover employees who are assigned or not to the team include those who have
   * been assigned in the meantime but have been released in free resources section
   * @param idTeam
   * @param idEmployee
   * @param predicate
   */

  public getAssignationtHistoric(predicate: PredicateFormat, idTeam: number, idEmployee: number): Observable<any> {
    return super.callService(Operation.POST, TeamConstant.GET_ASSIGNATION_HISTORIC
      .concat(String(idTeam))
      .concat('/')
      .concat(String(idEmployee)), predicate);
  }

  public validateConditionAssignmentPercentage(data): Observable<any> {
    return this.callService(Operation.POST, TeamConstant.VALIDATE_CONDITION_ASSIGNMENT_PERSENTAGE, data);
  }

}
