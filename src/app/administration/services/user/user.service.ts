import { Inject, Injectable } from '@angular/core';
import { User } from '../../../models/administration/user.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Operation as RequestOperation, Operation } from '../../../../COM/Models/operations';
import { UserConstant } from '../../../constant/Administration/user.constant';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { EntityAxisValues, FileInfo, ObjectToSave } from '../../../models/shared/objectToSend';

const CHANGE_PASSWORD_SUPERADMIN = 'updatePwdSuperAdmin';


@Injectable()
export class UserService extends ResourceService<User> {
  // tslint:disable-next-line: max-line-length
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig, @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService) {
    super(httpClient, appConfig, UserConstant.USER_BASE_URL, UserConstant.USER, UserConstant.SHARED, dataTransferShowSpinnerService);
  }
  private userId: number[];
  private userState: boolean;

  /**
   * get current connected user
   */
  get currentUser(): User {
    return;
  }

  public getTargetedUsers(objectToSend: any): Observable<Array<User>> {
    return super.callService(RequestOperation.POST, UserConstant.URL_TARGETED_USERS, objectToSend);
  }

  public ChangePassword(password, userMail: string): Observable<any> {
    const data: any = {};
    data[UserConstant.ID] = password.Model.Id;
    data[UserConstant.PASSWORD] = password.Model.Password;
    data[UserConstant.NEW_PASSWORD] = password.Model.NewPassword;
    data[UserConstant.CONFIRM_NEW_PASSWORD] = password.Model.ConfirmNewPassword;
    data[UserConstant.EMAIL_FIELD] = userMail;
    password = data;
    return super.callService(RequestOperation.POST, UserConstant.CHANGE_PASSWORD, password);
  }

  public ChangePasswordSuperAdmin(password): Observable<any> {
    return super.callService(RequestOperation.PUT, CHANGE_PASSWORD_SUPERADMIN, password);
  }

  /**
   * Get list of user parent by idCurrentUser
   * @param idCurrentUser
   */
  public getListOfUsersParent(idCurrentUser: number, email: string): Observable<Array<User>> {
    const data: any = {};
    data[UserConstant.ID] = idCurrentUser;
    data[UserConstant.EMAIL] = email;
    return super.callService(RequestOperation.POST, UserConstant.GET_LIST_OF_USERS_PARENT, data);
  }

  /**
   * Get profile
   * @param id
   */
  public getProfile(id: number): Observable<any> {
    return super.callService(Operation.GET, UserConstant.GETPROFILE + id);
  }

  public updateB2BUser(objectToSend: User): Observable<any> {
    return super.callService(RequestOperation.POST, 'updateB2BUser', objectToSend);
  }

  public insertUser(objectToSend: User): Observable<any> {
    return super.callService(RequestOperation.POST, UserConstant.INSERT_USER, objectToSend);
  }

  public getUsersListFromMasterBase(predicate: PredicateFormat, companyCode: string): Observable<any> {
    const data: any = {};
    data[UserConstant.PREDICATE] = predicate;
    data[UserConstant.COMPANY_CODE] = companyCode;
    return super.callService(RequestOperation.POST, UserConstant.GET_USERS_LIST_FROM_MASTER_BASE, data);
  }

  public InsertUserInThisCompany(objectToSend: User): Observable<any> {
    return super.callService(RequestOperation.POST, UserConstant.INSERT_USER_IN_THIS_COMPANY, objectToSend);
  }

  public DeleteUserFromSlaveBase(userMail: string): Observable<any> {
    return super.callService(RequestOperation.POST, UserConstant.DELETE_USER_FROM_SLAVE_BASE, userMail);
  }

  public SynchronizeWithMaster(): Observable<any> {
    return super.callService(RequestOperation.POST, UserConstant.SYNCHRONIZE_WITH_MASTER);
  }

  /**
   * upload Users from excel file
   * @param file
   */
  public uploadUsers(file): Observable<any> {
    return super.callService(Operation.POST, UserConstant.IMPORT_FILE_USERS, file);
  }

  /**
   * save excel imported Data
   * @param data
   */
  public saveImportedData(data): Observable<any> {
    return super.callService(Operation.POST, UserConstant.INSERT_USERS_LIST, data);
  }

  public signOut(Email: string): Observable<any> {
    return super.callService(RequestOperation.POST, UserConstant.SIGN_OUT, Email);
  }

  public changeStateOfUser(userId: number): Observable<any> {
    return super.callService(RequestOperation.POST, UserConstant.CHANGE_STATE_OF_USER, userId);
  }

  public getUsersFromListId(objectToSend: Array<number>): Observable<any> {
    return super.callService(RequestOperation.POST, UserConstant.GET_USERS_FROM_LIST_ID, objectToSend);
  }

  public desactivateMassiveUsers(objectToSend: User[]): Observable<any> {
    return super.callService(RequestOperation.POST, UserConstant.DESACTIVATE_MASSIVE_USERS, objectToSend);
  }

  public reactivateMassiveUsers(objectToSend: User[]): Observable<any> {
    return super.callService(RequestOperation.POST, UserConstant.REACTIVATE_MASSIVE_USERS, objectToSend);
  }

  public getUsersListByArray(userArray: number[]) {
    return this.callService(Operation.POST, 'getUsersFromListId', userArray) as Observable<any>;
  }

  public getUsersListWithRole(roles: string[]) {
    return this.callService(Operation.POST, 'getUsersListWithRole', roles) as Observable<any>;
  }

  public changeInactiveStateOfUser(objectToSend: User): Observable<any> {
    return super.callService(RequestOperation.POST, UserConstant.CHANGE_INACTIVE_STATE_OF_USER, objectToSend);
  }

  public updatePicture(fileInfo: FileInfo) {
    return this.callService(Operation.POST, UserConstant.UPDATE_PICTURE, fileInfo) as Observable<any>;
  }

  public removePicture(idUser: number) {
    return this.callService(Operation.POST, UserConstant.REMOVE_PICTURE, idUser) as Observable<any>;
  }

  public getUserPhoneById(id: number): Observable<any> {
    return this.callService(Operation.GET, UserConstant.GET_USER_PHONE_BY_ID.concat(id.toString()));
  }

  public setUserId(id: number[]) {
    this.userId = id;
  }

  public getUserId(): number[] {
    return this.userId;
  }

  public setUserState(state: boolean) {
    this.userState = state;
  }

  public getUserState(): boolean {
    return this.userState;
  }
  public getByEmail(Email: string) {
    return this.callService(Operation.POST, 'getByEmail', Email) as Observable<any>;
  }

  public getUserIdByEmail(Email: string): Observable<any> {
    return this.callService(Operation.POST, UserConstant.GET_USER_ID_BY_EMAIL, Email)
  }
  public getDataDropdownWithPredicate(predicate: PredicateFormat) {
    return this.callService(Operation.POST, 'getDataDropdownWithPredicate', predicate) as Observable<any>;
  }
  public updateProfile(data: User): Observable<User> {
    const object: ObjectToSave = new ObjectToSave();
    object.Model = data;
    object.EntityAxisValues = Array<EntityAxisValues>();
    return this.callService(Operation.PUT, UserConstant.UPDATE_PROFILE, object) as Observable<any>;
  }

}
