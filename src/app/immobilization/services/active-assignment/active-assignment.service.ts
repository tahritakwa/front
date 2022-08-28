import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ActiveAssignment } from '../../../models/immobilization/active-assignment.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';

@Injectable()
export class ActiveAssignmentService extends ResourceService<ActiveAssignment> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'history', 'History', 'Immobilisation');
  }

}
