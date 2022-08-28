import {Inject, Injectable} from '@angular/core';
import {Team} from '../../../models/payroll/team.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {HttpClient} from '@angular/common/http';
// tslint:disable-next-line: import-blacklist
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {TeamConstant} from '../../../constant/payroll/team.constant';
import {PredicateFormat} from '../../../shared/utils/predicate';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class TeamService extends ResourceServiceRhPaie<Team> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'team', 'Team', 'PayRoll');
  }

  public getModelByConditionWithHistory(predicate: PredicateFormat): Observable<any> {
    return super.callService(Operation.POST, TeamConstant.GET_MODEL_BY_CONDITION_WITH_HISTORY, predicate);
  }

  public getEmployeeTeamDropdown(): Observable<any> {
    return this.callService(Operation.GET, TeamConstant.GET_EMPLOYEE_TEAM_DROPDOWN);
  }

  public getTeamsByType(teamCode: string): Observable<any> {
    return this.callService(Operation.GET, TeamConstant.GET_TEAMS_BY_TYPE.concat(teamCode));
  }

  public getEmployeesOfTeamType(teamArray: string[]): Observable<any> {
    return this.callService(Operation.POST, TeamConstant.GET_EMPLOYEES_OF_TEAM_TYPE, teamArray);
  }
}
