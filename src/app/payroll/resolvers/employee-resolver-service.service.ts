import { Injectable } from '@angular/core';
import { EmployeeService } from '../services/employee/employee.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EmployeeConstant } from '../../constant/payroll/employee.constant';

@Injectable()
export class EmployeeResolverServiceService implements Resolve<Observable<any>> {

  constructor(private employeeService: EmployeeService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.employeeService.getById(+route.paramMap.get(EmployeeConstant.PARAM_ID));
  }
}
