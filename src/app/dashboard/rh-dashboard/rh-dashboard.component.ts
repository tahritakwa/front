import {Component, ElementRef, OnInit} from '@angular/core';
import {DashboardConstant} from '../../constant/dashboard/dashboard.constant';
import {NumberConstant} from '../../constant/utility/number.constant';
import {CompanyService} from '../../administration/services/company/company.service';
import {IntlService} from '@progress/kendo-angular-intl';
import {AuthService} from '../../login/Authentification/services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from '../../login/Authentification/services/local-storage-service';
import {PermissionConstant} from '../../Structure/permission-constant';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HrDashboardService} from '../services/hr-dashboard/hr-dashboard.service';


@Component({
  selector: 'app-rh-dashboard',
  templateUrl: './rh-dashboard.component.html',
  styleUrls: ['./rh-dashboard.component.scss']
})
export class RhDashboardComponent implements OnInit {

  public FORMAT_NUMBER = '{0:##,#.###}';
  public dateformat = 'dd/MM/yyyy';

  dragula = '';
  ClickedClass = 'card h-100 with-shadow';
  public shouldRefresh = false;

  genderList = [`${this.translate.instant('FEMALE')}`, `${this.translate.instant('MALE')}`];
  activeEmpLastYear: number;
  activeEmpCurrentYear: number;
  staffTurnoverRateLastYear: number;
  staffTurnoverRateCurrentYear: number;
  officeRecruitmentLastYear: number;
  officeRecruitmentCurrentYear: number;
  officeLeaveLastYear: number;
  officeLeaveCurrentYear: number;
  averageAgeLastYear: number;
  averageAgeCurrentYear: number;
  showEmployeeTab = true;
  showCandidatureTab = false;
  candidacyNumberLastYear: number;
  candidacyNumberCurrentYear: number;
  numberOfOfferLastYear: number;
  numberOfOfferCurrentYear: number;
  expectedCandidateLastYear: number;
  expectedCandidateCurrentYear: number;
  leaveRateLastYear: number;
  leaveRateCurrentYear: number;
  employeeFilterForm: FormGroup;
  candidatureOfficeList: any[];
  yearOfExperienceList: any;
  seniorityList: any[];
  employeeContractList: any[];
  candidatureContractList: any;
  clearEmployeeSelectedFilters = false;
  clearCandidatureSelectedFilters = false;
  totalDayOffYTD: number;
  totalDayOffYTD_1: number;
  totalWorkDaysYTD: number;
  totalWorkDaysYTD_1: number;
  hasHRPermission = false;
  candidatureFilterForm: FormGroup;
  candidatureRecruitmentDescriptionList: any[];
  employeeTeamList: any[];
  employeeAgeList: any[];
  employeeOfficeList: any[];
  officeLeaveToday: number;
  officeLeaveCurrentWeek: number;

  constructor(public el: ElementRef,
              public companyService: CompanyService,
              public dashService: HrDashboardService, public intl: IntlService, private authService: AuthService,
              private translate: TranslateService, private localStorageService: LocalStorageService, private fb: FormBuilder) {
  }


  ngOnInit(): void {
    this.hasHRPermission = this.authService.hasAuthority(PermissionConstant.DashboardPermissions.RH_DASHBOARD);
    this.FORMAT_NUMBER = '{0:##,#.###}';
    this.dateformat = this.translate.instant(SharedConstant.DATE_FORMAT);
    if (this.hasHRPermission) {
      this.createEmployeeForm();
      this.getEmployeeFiltersList();
      this.getEmployeeCardData();
      this.createCandidatureForm();
      this.getCandidatureFiltersList();
      this.getCandidatureCardData();
    }
  }

  createEmployeeForm() {
    this.employeeFilterForm = this.fb.group({
      Sex: [],
      Seniority: [],
      Office: [],
      Age: [],
      Contract: [],
      Team: []
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngDoCheck() {
    this.dragula = this.dashService.dragula;
    this.ClickedClass = this.dashService.Clicked;
    this.shouldRefresh = this.dashService.shouldRefresh;
    if (this.shouldRefresh === true) {
      this.dashService.shouldRefresh = false;
      this.ngOnInit();
    }
  }

  clearEmployeeFilter() {
    this.clearEmployeeSelectedFilters = !this.clearEmployeeSelectedFilters;
    this.employeeFilterForm.reset();
    this.employeeFilterForm.markAsPristine();
    this.getEmployeeCardData();
  }

  clearRecruitmentFilter() {
    this.clearCandidatureSelectedFilters = !this.clearCandidatureSelectedFilters;
    this.candidatureFilterForm.reset();
    this.candidatureFilterForm.markAsPristine();
    this.getCandidatureCardData();
  }

  onSelectCandidatureGender(sex: any[]) {
    if (sex.length) {
      const x = [];
      sex.forEach(s => s[NumberConstant.ZERO] === 'F' ? x.push('Femme') : x.push('Homme'));
      this.candidatureFilterForm.controls['Sex'].patchValue(x);
      this.candidatureFilterForm.markAsDirty();
    } else {
      this.candidatureFilterForm.controls['Sex'].patchValue(null);
      this.checkForm(this.candidatureFilterForm);
    }
    this.getCandidatureCardData();
  }

  onSelectCandidatureTeam(recruitmentDescriptions: any[]) {
    if (recruitmentDescriptions.length) {
      this.candidatureFilterForm.controls['RecruitmentDescription'].patchValue(recruitmentDescriptions);
      this.candidatureFilterForm.markAsDirty();
    } else {
      this.candidatureFilterForm.controls['RecruitmentDescription'].patchValue(null);
      this.checkForm(this.candidatureFilterForm);
    }
    this.getCandidatureCardData();
  }

  onSelectYearOfExperience(yearOfExperience: any[]) {
    if (yearOfExperience.length) {
      this.candidatureFilterForm.controls['YearOfExperience'].patchValue(yearOfExperience);
      this.candidatureFilterForm.markAsDirty();
    } else {
      this.candidatureFilterForm.controls['YearOfExperience'].patchValue(null);
      this.checkForm(this.candidatureFilterForm);
    }
    this.getCandidatureCardData();
  }

  onSelectCandidatureOffice(office: any[]) {
    if (office.length) {
      this.candidatureFilterForm.controls['Office'].patchValue(office);
      this.candidatureFilterForm.markAsDirty();
    } else {
      this.candidatureFilterForm.controls['Office'].patchValue(null);
      this.checkForm(this.candidatureFilterForm);
    }
    this.getCandidatureCardData();
  }

  onSelectCandidatureContract(contract: any[]) {
    if (contract.length) {
      this.candidatureFilterForm.controls['Contract'].patchValue(contract);
      this.candidatureFilterForm.markAsDirty();
    } else {
      this.candidatureFilterForm.controls['Contract'].patchValue(null);
      this.checkForm(this.candidatureFilterForm);
    }
    this.getCandidatureCardData();
  }

  onSelectEmployeeGender(sex: any[]) {
    if (sex.length) {
      const x = [];
      sex.forEach(s => s[NumberConstant.ZERO] === 'F' ? x.push('Femme') : x.push('Homme'));
      this.employeeFilterForm.controls['Sex'].patchValue(x);
      this.employeeFilterForm.markAsDirty();
    } else {
      this.employeeFilterForm.controls['Sex'].patchValue(null);
      this.checkForm(this.employeeFilterForm);
    }
    this.getEmployeeCardData();
  }

  onSelectEmployeeTeam(teams: any[]) {
    if (teams.length) {
      this.employeeFilterForm.controls['Team'].patchValue(teams);
      this.employeeFilterForm.markAsDirty();
    } else {
      this.employeeFilterForm.controls['Team'].patchValue(null);
      this.checkForm(this.employeeFilterForm);
    }
    this.getEmployeeCardData();
  }

  onSelectSeniorityRange(seniorityRange: any[]) {
    if (seniorityRange.length) {
      this.employeeFilterForm.controls['Seniority'].patchValue(seniorityRange);
      this.employeeFilterForm.markAsDirty();
    } else {
      this.employeeFilterForm.controls['Seniority'].patchValue(null);
      this.checkForm(this.employeeFilterForm);
    }
    this.getEmployeeCardData();
  }

  onSelectEmployeeOffice(office: any[]) {
    if (office.length) {
      this.employeeFilterForm.controls['Office'].patchValue(office);
      this.employeeFilterForm.markAsDirty();
    } else {
      this.employeeFilterForm.controls['Office'].patchValue(null);
      this.checkForm(this.employeeFilterForm);
    }
    this.getEmployeeCardData();
  }

  onSelectEmployeeContract(contract: any[]) {
    if (contract.length) {
      this.employeeFilterForm.controls['Contract'].patchValue(contract);
      this.employeeFilterForm.markAsDirty();
    } else {
      this.employeeFilterForm.controls['Contract'].patchValue(null);
      this.checkForm(this.employeeFilterForm);
    }
    this.getEmployeeCardData();
  }

  onSelectEmployeeAge(age: any[]) {
    if (age.length) {
      this.employeeFilterForm.controls['Age'].patchValue(age);
      this.employeeFilterForm.markAsDirty();
    } else {
      this.employeeFilterForm.controls['Age'].patchValue(null);
      this.checkForm(this.employeeFilterForm);
    }
    this.getEmployeeCardData();
  }

  getEmployeeFiltersList() {
    this.dashService.getEmployeeFilters().subscribe(data => {
      this.employeeTeamList = data.Teams;
      this.employeeAgeList = data.Age;
      this.employeeOfficeList = data.Office;
      this.seniorityList = data.Seniority;
      this.employeeContractList = data.Contract;
    });
  }

  getEmployeeCardData() {
    this.dashService.getEmployeeCardData(this.employeeFilterForm.getRawValue()).subscribe(data => {
      data.forEach(employeeCard => {
        switch (employeeCard.Item1) {
          case DashboardConstant.GET_KPI_NUMBER_OF_ACTIVE_EMPLOYEES:
            if (employeeCard.Item2.length) {
              this.activeEmpCurrentYear = NumberConstant.ZERO;
              this.activeEmpLastYear = NumberConstant.ZERO;
              employeeCard.Item2.forEach(x => {
                this.activeEmpCurrentYear += Number(x.Employee_Number_YTD);
                this.activeEmpLastYear += Number(x.Employee_Number_YTD_1);
              });
            }
            break;
          case DashboardConstant.GET_KPI_STAFF_TURNOVER_RATE:
            if (employeeCard.Item2.length) {
              this.staffTurnoverRateCurrentYear = NumberConstant.ZERO;
              this.staffTurnoverRateLastYear = NumberConstant.ZERO;
              employeeCard.Item2.forEach(x => {
                this.staffTurnoverRateCurrentYear += Number(x.Taux_Turnover_YTD);
                this.staffTurnoverRateLastYear += Number(x.Taux_Turnover_YTD_1);
              });
            }
            break;
          case DashboardConstant.GET_KPI_AVERAGE_AGE :
            if (employeeCard.Item2.length) {
              this.averageAgeCurrentYear = NumberConstant.ZERO;
              this.averageAgeLastYear = NumberConstant.ZERO;
              employeeCard.Item2.forEach(x => {
                this.averageAgeCurrentYear += Number(x.Age_Moyen_YTD);
                this.averageAgeLastYear += Number(x.Age_Moyen_YTD_1);
              });
              this.averageAgeCurrentYear = this.averageAgeCurrentYear / employeeCard.Item2.length;
              this.averageAgeLastYear = this.averageAgeLastYear / employeeCard.Item2.length;
            }
            break;
          case DashboardConstant.GET_KPI_TOTAL_WORK_DAYS_TOTAL_DAY_OFF:
            if (employeeCard.Item2.length) {
              this.totalDayOffYTD = NumberConstant.ZERO;
              this.totalDayOffYTD_1 = NumberConstant.ZERO;
              this.totalWorkDaysYTD = NumberConstant.ZERO;
              this.totalWorkDaysYTD_1 = NumberConstant.ZERO;
              employeeCard.Item2.forEach(x => {
                this.totalDayOffYTD += Number(x.TotalDayOffYTD);
                this.totalDayOffYTD_1 += Number(x.TotalDayOffYTD_1);
                this.totalWorkDaysYTD += Number(x.TotalWorkDaysYTD);
                this.totalWorkDaysYTD_1 += Number(x.TotalWorkDaysYTD_1);
              });
            }
            break;
          case DashboardConstant.GET_KPI_PAID_UNPAID_VACATION_LEAVE :
            if (employeeCard.Item2.length) {
              this.leaveRateCurrentYear = NumberConstant.ZERO;
              this.leaveRateLastYear = NumberConstant.ZERO;
              employeeCard.Item2.forEach(x => {
                this.leaveRateCurrentYear += Number(x.Taux_Conges_YTD);
                this.leaveRateLastYear += Number(x.Taux_Conges_YTD_1);
              });
            }
            break;
          case DashboardConstant.GET_KPI_OFFICE_LEAVE:
            if (employeeCard.Item2.length) {
              this.officeLeaveCurrentYear = NumberConstant.ZERO;
              this.officeLeaveLastYear = NumberConstant.ZERO;
              employeeCard.Item2.forEach(x => {
                this.officeLeaveCurrentYear += Number(x.Leavers_Number_YTD);
                this.officeLeaveLastYear += Number(x.Leavers_Number_YTD_1);
              });
            }
            break;
          case DashboardConstant.GET_KPI_TOTAL_ON_LEAVE_PER_DAY_WEEK:
            if (employeeCard.Item2.length) {
              this.officeLeaveCurrentWeek = NumberConstant.ZERO;
              this.officeLeaveToday = NumberConstant.ZERO;
              employeeCard.Item2.forEach(x => {
                this.officeLeaveCurrentWeek += Number(x.WeeklyNumber);
                this.officeLeaveToday += Number(x.DailyNumber);
              });
            }
            break;
        }
      });
    });
  }

  getCandidatureCardData() {
    this.dashService.getCandidatureCardData(this.candidatureFilterForm.getRawValue()).subscribe(data => {
      data.forEach(candidatureCard => {
        switch (candidatureCard.Item1) {
          case DashboardConstant.GET_KPI_CANDIDACY_NUMBER:
            if (candidatureCard.Item2.length) {
              this.candidacyNumberCurrentYear = NumberConstant.ZERO;
              this.candidacyNumberLastYear = NumberConstant.ZERO;
              candidatureCard.Item2.forEach(x => {
                this.candidacyNumberCurrentYear += Number(x.NombreCandidatureYTD);
                this.candidacyNumberLastYear += Number(x.NombreCandidatureYTD_1);
              });
            }
            break;
          case DashboardConstant.GET_KPI_NUMBER_OF_OFFER_EXPECTED_CANDIDATE:
            if (candidatureCard.Item2.length) {
              this.numberOfOfferCurrentYear = NumberConstant.ZERO;
              this.numberOfOfferLastYear = NumberConstant.ZERO;
              this.expectedCandidateCurrentYear = NumberConstant.ZERO;
              this.expectedCandidateLastYear = NumberConstant.ZERO;
              candidatureCard.Item2.forEach(x => {
                this.numberOfOfferCurrentYear += Number(x.NombreOffreYTD);
                this.numberOfOfferLastYear += Number(x.NombreOffreYTD_1);
                this.expectedCandidateCurrentYear += Number(x.PosteAPrevoirYTD);
                this.expectedCandidateLastYear += Number(x.PosteAPrevoirYTD_1);
              });
            }
            break;
          case DashboardConstant.GET_KPI_NUMBER_OF_HIRES :
            if (candidatureCard.Item2.length) {
              this.officeRecruitmentCurrentYear = NumberConstant.ZERO;
              this.officeRecruitmentLastYear = NumberConstant.ZERO;
              candidatureCard.Item2.forEach(x => {
                this.officeRecruitmentCurrentYear += Number(x.YTDTotalNumberHires);
                this.officeRecruitmentLastYear += Number(x.LYTDTotalNumberHires);
              });
            }
            break;
        }
      });
    });
  }

  private checkForm(fg: FormGroup) {
    if (!Object.keys(fg.value).some(k => !!fg.value[k])) {
      fg.markAsPristine();
    }
  }

  showEmployeeCard() {
    if (!this.showEmployeeTab) {
      this.showEmployeeTab = true;
      this.showCandidatureTab = false;
    }
  }

  showCandidaturesCard() {
    if (!this.showCandidatureTab) {
      this.showCandidatureTab = true;
      this.showEmployeeTab = false;
    }
  }

  clearFilter() {
    if (this.showCandidatureTab) {
      this.clearRecruitmentFilter();
    } else {
      this.clearEmployeeFilter();
    }
  }

  createCandidatureForm() {
    this.candidatureFilterForm = this.fb.group({
      Sex: [],
      YearOfExperience: [],
      Office: [],
      RecruitmentDescription: [],
      Contract: []
    });
  }

  getCandidatureFiltersList() {
    this.dashService.getCandidatureFilters().subscribe(data => {
      this.candidatureRecruitmentDescriptionList = data.RecruitmentDescription;
      this.candidatureOfficeList = data.Office;
      this.yearOfExperienceList = data.YearOfExperience;
      this.candidatureContractList = data.Contract;
    });
  }
}
