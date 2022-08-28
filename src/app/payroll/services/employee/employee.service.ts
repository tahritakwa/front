import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Employee} from '../../../models/payroll/employee.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {EmployeeConstant} from '../../../constant/payroll/employee.constant';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {ObjectToSend} from '../../../models/sales/object-to-save.model';
import {ObjectToSave} from '../../../models/shared/objectToSend';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class EmployeeService extends ResourceServiceRhPaie<Employee> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(
      httpClient, appConfig, 'employee', 'Employee', 'PayRoll');
  }


  /**
   * upload Employees from excel file
   * @param file
   */
  public uploadEmployee(file): Observable<any> {
    return super.callService(Operation.POST, EmployeeConstant.IMPORT_FILE_EMPLOYEES, file);
  }

  /**
   * save excel imported Data
   * @param data
   */
  public saveImportedData(data): Observable<any> {
    return super.callService(Operation.POST, EmployeeConstant.INSERT_EMPLOYEES_LIST, data);
  }

  public getEmployeesHierarchicalList(withTeamCollaborater?: boolean, withTheSuperior?: boolean,
                                      predicate?: PredicateFormat): Observable<any> {
    const data: any = {};
    data[EmployeeConstant.WITH_TEAM_COLLABORATER] = withTeamCollaborater;
    data[EmployeeConstant.WITH_THE_SUPERIOR] = withTheSuperior;
    data[SharedConstant.PREDICATE] = predicate;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, EmployeeConstant.GET_EMPLOYEES_HIERARCHICAL_LIST, objectToSend);
  }

  /**
   * Get employee connected
   */
  public getConnectedEmployee(): Observable<any> {
    return this.callService(Operation.GET, EmployeeConstant.GET_CONNECTED_EMPLOYEE);
  }

  public GetSuperiorsEmployeeAsUsers(idEmployee: number, withTheCurrentEmployee?: boolean): Observable<any> {
    const data: any = {};
    data['EmployeeId'] = idEmployee;
    data['WithTheCurrentEmployee'] = withTheCurrentEmployee;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, EmployeeConstant.GET_SUPERIORS_EMPLOYEE_AS_USERS, objectToSave);

  }

  public getEmployeesDetails(idEmployees: Array<number>): Observable<any> {
    return this.callService(Operation.POST, EmployeeConstant.GET_EMPLOYEE_DETAILS, idEmployees);
  }

  public getEmployeeById(idEmployee: number): Observable<any> {
    return this.callService(Operation.GET, 'getById/' + idEmployee, idEmployee);
  }

  public getEmployeeByEmail(email: string): Observable<any> {
    return this.callService(Operation.POST, EmployeeConstant.GET_EMPLOYEE_BY_EMAIL, email);
  }

  public IsUserInSuperHierarchicalEmployeeList(employee: Employee): Observable<any> {
    return this.callService(Operation.POST, EmployeeConstant.IS_USER_IN_SUPER_HIERARCHICAL_EMPLOYEE_LIST, employee);
  }

  public GenerateAndSendSharedDocumentsPassword(employeeId: number): Observable<any> {
    return this.callService(Operation.POST, EmployeeConstant.GENERATE_AND_SEND_SHARED_DOCUMENTS_PASSWORD, employeeId);
  }

  public getEmployeeWithSkill(idSkill: number): Observable<any> {
    return this.callService(Operation.GET, EmployeeConstant.EMPLOYEES_WITH_SKILL + idSkill);
  }

  public getEmployeeForProfile(id: number): Observable<any> {
    return this.callService(Operation.GET, EmployeeConstant.EMPLOYEE_PROFILE.concat(id.toString()));
  }

  public GetEmployeesHasPayslip(year: number): Observable<any> {
    return this.callService(Operation.POST, EmployeeConstant.GET_EEMPLOYEES_HAS_PAYSLIP, year);
  }

  public synchronizeEmployees(): Observable<any> {
    return this.callService(Operation.POST, EmployeeConstant.SYNCHRONIZE_EMPLOYEES);
  }

  // Get connected user privileges
  public getConnectedEmployeePrivileges(id: number): Observable<any> {
    return this.callService(Operation.GET, EmployeeConstant.GET_CONNECTED_EMPLOYEE_PRIVILEGES.concat(id.toString()));
  }

  public getEmployeeDropdownWithPredicate(predicate: PredicateFormat): Observable<any> {
    return this.callService(Operation.POST, EmployeeConstant.GET_EMPLOYEE_DROPDOWN_WITH_PREDICATE, predicate);
  }

  public getNotAssociatedEmployees(): Observable<any> {
    return this.callService(Operation.GET, EmployeeConstant.GET_NOT_ASSOCIATED_EMPLOYEES);
  }

  public IsInConnectedUserHierarchy(connectedEmployeeId: number, selectedEmployeeId: number): Observable<boolean> {
    const data: any = {};
    data[EmployeeConstant.CONNECTED_EMPLOYEE_ID] = connectedEmployeeId;
    data[EmployeeConstant.SELECTED_EMPLOYEE_ID] = selectedEmployeeId;
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = data;
    return this.callService(Operation.POST, EmployeeConstant.IS_IN_CONNECTED_USER_HIERARCHY, objectToSave) as Observable<boolean>;
  }

  public getAllEmployeesWithInferiors(): Observable<any> {
    return this.callService(Operation.GET, EmployeeConstant.GET_ALL_EMPLOYEES_WITH_INFERIORS);
  }

  public selectedEmployeesWithInferiors(selectedEmployeeId: number): Observable<any> {
    return this.callService(Operation.GET, EmployeeConstant.SELECTED_EMPLOYEE_ORGANIZATION_CHART.concat(selectedEmployeeId.toString()));
  }
  public isConnectedUserTeamManagerOrHierarchic(selectedEmployeeId: number): Observable<any> {
    return this.callService(Operation.GET, EmployeeConstant.IS_CONNECTED_USER_TEAM_MANAGER_OR_HIERARCHIC
      .concat(selectedEmployeeId.toString()));
  }
}
