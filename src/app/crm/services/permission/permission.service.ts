import {Inject, Injectable} from '@angular/core';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {SharedCrmConstant} from '../../../constant/crm/sharedCrm.constant';
import {PermissionConstant} from '../../../constant/crm/permission.constant';
import {Observable} from 'rxjs/Observable';
import {GenericCrmService} from '../../generic-crm.service';
import {EmptyObservable} from 'rxjs/observable/EmptyObservable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class PermissionService extends ResourceServiceJava {

  /**
   * @param httpClient
   * @param appConfigCrm
   * @param genericCrmService
   */
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigCrm, private genericCrmService: GenericCrmService) {
    super(httpClient, appConfigCrm, SharedCrmConstant.CRM_URL, PermissionConstant.MODULE_NAME);
  }

  /**
   * Permission subject
   */
  public permissionEmitted = new Subject<any>();

  getResult(): Observable<any> {
    return this.permissionEmitted.asObservable();
  }

  send(permission: any, parent?: any) {
    this.permissionEmitted.next({permission: permission, parent: parent});
  }
  /**
   * generic save entity permission
   * @param relatedPermission
   * @param entityName
   * @param entityId
   */
  public savePermission(relatedPermission, entityName, entityId): Observable<any> {
    delete relatedPermission.id;
    delete relatedPermission.permissionValidForm;
    delete relatedPermission.isUpdateMode;
    relatedPermission.relatedEntity = entityName;
    relatedPermission.relatedEntityId = entityId;
    return this.getJavaGenericService().saveEntity(relatedPermission);
  }

  /**
   * generic update entity permission
   * @param relatedPermission
   * @param entityName
   * @param entityId
   */
  public updatePermission(relatedPermission, entityName, entityId): Observable<any> {
    if (this.genericCrmService.isNullOrUndefinedOrEmpty(relatedPermission.isUpdateMode) ||
      relatedPermission.isUpdateMode === true) {
      delete relatedPermission.permissionValidForm;
      delete relatedPermission.isUpdateMode;
      relatedPermission.relatedEntity = entityName;
      relatedPermission.relatedEntityId = entityId;
      return this.getJavaGenericService().updateEntity(relatedPermission, relatedPermission.id);
    } else {
      return new EmptyObservable();
    }
  }
}
