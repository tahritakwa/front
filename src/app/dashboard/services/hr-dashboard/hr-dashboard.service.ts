import {Inject, Injectable} from '@angular/core';
import {ResourceServiceRhPaie} from '../../../shared/services/resource/resource.service.rhpaie';
import {Dashboard} from '../../../models/dashboard/dashboard.model';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {DataTransferShowSpinnerService} from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {DashboardConstant} from '../../../constant/dashboard/dashboard.constant';
import {ObjectToSend} from '../../../models/sales/object-to-save.model';

@Injectable()
export class HrDashboardService extends ResourceServiceRhPaie<Dashboard> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
              @Inject(DataTransferShowSpinnerService) dataTransferShowSpinnerService) {
    super(httpClient, appConfig, 'hrDashboard', null, null, dataTransferShowSpinnerService);
  }


  dragula = '';
  Clicked = 'period-filter with-shadow card h-100';
  colorset;
  shouldRefresh = false;

  getEmployeeFilters(): Observable<any> {
    return super.callService(Operation.GET, DashboardConstant.GET_EMPLOYEE_FILTERS, null, null, true);
  }

  getEmployeeCardData(filter: any): Observable<any> {
    const data = {};
    data['Sex'] = filter.Sex;
    data['Team'] = filter.Team;
    data['Seniority'] = filter.Seniority;
    data['Office'] = filter.Office;
    data['Age'] = filter.Age;
    data['Contract'] = filter.Contract;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, DashboardConstant.GET_EMPLOYEE_CARD_DATA, objectToSend, null, true);
  }

  getKPIFromWorkStateStoredProcedure(periodEnum: number, gender: string[], teamName: string[], ageRange: string[], seniorityRange: string[],
                                     contract: string[], office: string[], employeeName: string): Observable<any> {
    const data = {};
    data['Sex'] = gender;
    data['Team'] = teamName;
    data['Seniority'] = seniorityRange;
    data['Office'] = office;
    data['Age'] = ageRange;
    data['Contract'] = contract;
    data['periodEnum'] = periodEnum;
    data['employeeName'] = employeeName;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, DashboardConstant.GET_KPI_WORK_STATE, objectToSend, null, true);
  }

  getKPIFromDayOffPerFamilyTypeStoredProcedure(periodEnum: number, gender: string[], teamName: string[], ageRange: string[],
                                               seniorityRange: string[], contract: string[], office: string[]): Observable<any> {
    const data = {};
    data['Sex'] = gender;
    data['Team'] = teamName;
    data['Seniority'] = seniorityRange;
    data['Office'] = office;
    data['Age'] = ageRange;
    data['Contract'] = contract;
    data['periodEnum'] = periodEnum;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, DashboardConstant.GET_KPI_DAY_OFF_PER_FAMILY_TYPE, objectToSend, null, true);
  }

  getCandidatureFilters(): Observable<any> {
    return super.callService(Operation.GET, DashboardConstant.GET_CANDIDATURE_FILTERS, null, null, true);
  }

  getCandidatureCardData(filter: any): Observable<any> {
    const data = {};
    data['Sex'] = filter.Sex;
    data['RecruitmentDescription'] = filter.RecruitmentDescription;
    data['YearOfExperience'] = filter.YearOfExperience;
    data['Office'] = filter.Office;
    data['Contract'] = filter.Contract;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, DashboardConstant.GET_CANDIDATURE_CARD_DATA, objectToSend, null, true);
  }

  getKPIFromRateSuccessfulSubmittedCandidaciesStoredProcedure(periodEnum: number, filter: any): Observable<any> {
    const data = {};
    data['Contract'] = filter.Contract;
    data['Office'] = filter.Office;
    data['Sex'] = filter.Sex;
    data['periodEnum'] = periodEnum;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, DashboardConstant.GET_KPI_RATE_SUCCESSFUL_SUBMITTED_CANDIDACIES, objectToSend, null, true);

  }


  getKPIFromTotalStartersExitsStoredProcedure(periodEnum: number, gender: string[], teamName: string[], ageRange: string[],
                                              seniorityRange: string[], contract: string[], office: string[]): Observable<any> {
    const data = {};
    data['Sex'] = gender;
    data['Team'] = teamName;
    data['Seniority'] = seniorityRange;
    data['Office'] = office;
    data['Age'] = ageRange;
    data['Contract'] = contract;
    data['periodEnum'] = periodEnum;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, DashboardConstant.GET_KPI_TOTAL_STARTERS_EXITS, objectToSend, null, true);
  }

  getKPIDayOffPerFamilyTypeEmployeePerPeriod(periodEnum: number, gender: string[], teamName: string[], ageRange: string[],
                                             seniorityRange: string[], contract: string[], office: string[], numberOfRows: number,
                                             dayOffType: string[]): Observable<any> {
    const data = {};
    data['Sex'] = gender;
    data['Team'] = teamName;
    data['Seniority'] = seniorityRange;
    data['Office'] = office;
    data['Age'] = ageRange;
    data['Contract'] = contract;
    data['DayOffType'] = dayOffType;
    data['numberOfRows'] = numberOfRows;
    data['periodEnum'] = periodEnum;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, DashboardConstant.GET_KPI_DAY_OFF_PER_FAMILY_TYPE_EMPLOYEE_PER_PERIOD, objectToSend,
      null, true);
  }

  getDayOffType(): Observable<any> {
    return super.callService(Operation.GET, DashboardConstant.GET_DAY_OFF_TYPE, null, null, true);
  }

  getKPIFromStaffTurnoverStoredProcedure(periodEnum: number, gender: string[], teamName: string[], ageRange: string[],
                                         seniorityRange: string[], contract: string[], office: string[]): Observable<any>  {
    const data = {};
    data['Sex'] = gender;
    data['Team'] = teamName;
    data['Seniority'] = seniorityRange;
    data['Office'] = office;
    data['Age'] = ageRange;
    data['Contract'] = contract;
    data['periodEnum'] = periodEnum;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, DashboardConstant.GET_KPI_STAFF_TURNOVER_RATE_PER_PERIOD, objectToSend, null, true);
  }

  getKPIFromAverageTimeToFillStoredProcedure(periodEnum: number, filter: any): Observable<any> {
    const data = {};
    data['RecruitmentDescription'] = filter.RecruitmentDescription;
    data['Office'] = filter.Office;
    data['Sex'] = filter.Sex;
    data['periodEnum'] = periodEnum;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return super.callService(Operation.POST, DashboardConstant.GET_KPI_AVERAGE_TIME_TO_FILL, objectToSend, null, true);
  }
}
