import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Privilege } from '../../../models/administration/privilege.model';

@Injectable()
export class PrivilegeService extends ResourceService<Privilege> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
  @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService) {
    super(httpClient, appConfig, 'privilege', 'Privilege', 'Shared', dataTransferShowSpinnerService);
  }

}
