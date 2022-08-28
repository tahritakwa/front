import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CompanyService } from '../../administration/services/company/company.service';
import { DashboardConstant } from '../../constant/dashboard/dashboard.constant';
import { GarageConstant } from '../../constant/garage/garage.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { NumberConstant } from '../../constant/utility/number.constant';
import { AppointmentService } from '../../garage/services/appointment/appointment.service';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { LocalStorageService } from '../../login/Authentification/services/local-storage-service';
import { ReducedCurrency } from '../../models/administration/reduced-currency.model';
import { Appointment } from '../../models/garage/appointment.model';
import { LanguageService } from '../../shared/services/language/language.service';
import { Filter, Operation, PredicateFormat } from '../../shared/utils/predicate';
import { PermissionConstant } from '../../Structure/permission-constant';
import { DashboardService } from '../services/dashboard.service';
import { GarageDashboardService } from '../services/garage-dashboard/garage-dashboard.service';




@Component({
  selector: 'app-garage-dashboard',
  templateUrl: './garage-dashboard.component.html',
  styleUrls: ['./garage-dashboard.component.scss']
})
export class GarageDashboardComponent implements OnInit {
  public currency: ReducedCurrency;
  public userCurrencySymbol: any;
  public FORMAT_NUMBER = '{0:##,#.###}';
  public dateformat = 'dd/MM/yyyy';
  dragula = '';
  ClickedClass = 'card h-100 with-shadow';
  public shouldRefresh = false;
  public listLoanVehicle: any;
  public listIntervention: any;
  public listDailyAppointment: Appointment;
  public dateTimeFormat = 'HH:mm';
  public hasOneGarage = false;
  public hasGaragePermission = false;




  constructor(public companyService: CompanyService, private langService: LanguageService,
    public dashService: DashboardService, public appointmentService: AppointmentService,
      public dashGarageService: GarageDashboardService, private authService: AuthService, private translate: TranslateService, private localStorageService : LocalStorageService) { }

  ngOnInit(): void {
    this.hasGaragePermission = this.authService.hasAuthority(PermissionConstant.DashboardPermissions.GARAGE_DASHBOARD);
    this.getSelectedCurrency();
    this.FORMAT_NUMBER = '{0:##,#.###}';
      this.dateformat = this.translate.instant(SharedConstant.DATE_FORMAT);
      if (this.hasGaragePermission) {
          this.getDailyAppointment();
          this.getListOfInProgressIntervention();
          this.getListOfAvailableVehicle();
      }

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
  getSelectedCurrency() {
    this.userCurrencySymbol = this.localStorageService.getCurrencySymbol(); 
  }

  getListOfAvailableVehicle() {
    this.dashGarageService.getListAvailableLoanVehicle().subscribe(data => {
      this.listLoanVehicle = data;
    });
  }

  getListOfInProgressIntervention() {
    this.dashGarageService.getListOfInterventionInProgress().subscribe(data => {
      this.listIntervention = data;
    });
  }
  getDailyAppointment() {
    const starDate = new Date();
    const endDate = new Date();
    starDate.setHours(NumberConstant.EIGHT, NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO);
    endDate.setHours(NumberConstant.NINETEEN, NumberConstant.ZERO, NumberConstant.ZERO, NumberConstant.ZERO);
    this.dashGarageService.getDailyAppointmentList(starDate, endDate).subscribe(res => {
      res.forEach(x => {
        if (x.IsAllDay) {
          x.StartDate = null;
          x.EndDate = null;
        }
      });
      this.listDailyAppointment = res;
    });
  }

  userHasOneGarage($event) {
    this.hasOneGarage = $event;
  }

}
