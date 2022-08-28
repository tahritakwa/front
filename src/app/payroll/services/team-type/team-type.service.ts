import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TeamType} from '../../../models/payroll/team-type.model';
import {AppConfig} from '../../../../COM/config/app.config';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';


@Injectable()
export class TeamTypeService extends ResourceServiceRhPaie<TeamType> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig,
      'teamType', 'TeamType', 'PayRoll');
  }
}
