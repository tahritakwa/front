import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { UserPrivilege } from '../../../models/administration/user-privilege.model';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { PrivilegUserConstant } from '../../../constant/Administration/privilege-user.constant';

@Injectable()
export class UserPrivilegeService  extends ResourceService<UserPrivilege> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
  @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService) {
    super(httpClient, appConfig, 'userPrivilege', 'UserPrivilege', 'Shared', dataTransferShowSpinnerService);
  }

  public getuserPrivileges(predicate: PredicateFormat): Observable<any> {
    return this.callService(Operation.POST, PrivilegUserConstant.GET_USER_PRIVILEGES, predicate);
}
}
