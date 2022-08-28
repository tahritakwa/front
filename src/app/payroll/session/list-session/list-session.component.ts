import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { EnumValues } from 'enum-values';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AttendanceConstant } from '../../../constant/payroll/attendance.constant';
import { BonusConstant } from '../../../constant/payroll/bonus.constant';
import { PayslipConstant } from '../../../constant/payroll/payslip.constant';
import { SessionConstant } from '../../../constant/payroll/session.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { DayOfWeek } from '../../../models/enumerators/day-of-week.enum';
import { PayrollSessionState } from '../../../models/enumerators/session-state.enum';
import { Attendance } from '../../../models/payroll/attendance.model';
import { Payslip } from '../../../models/payroll/payslip.model';
import { SessionBonus } from '../../../models/payroll/session-bonus.model';
import { Session } from '../../../models/payroll/session.model';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, Operator, PredicateFormat } from '../../../shared/utils/predicate';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SearchSessionComponent } from '../../components/search-session/search-session.component';
import { PayslipService } from '../../services/payslip/payslip.service';
import { SessionService } from '../../services/session/session.service';

@Component({
  selector: 'app-list-session',
  templateUrl: './list-session.component.html',
  styleUrls: ['./list-session.component.scss']
})
export class ListSessionComponent implements OnInit, AfterViewInit {
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];

  isModal = false;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat[] = [];
  @ViewChild(SearchSessionComponent) searchSessionComponent: SearchSessionComponent;
  /**
* advanced search predicate
*/
  public predicateAdvancedSearch: PredicateFormat;
  /**
    * quick search predicate
    */
  public predicateQuickSearch: PredicateFormat;

  /**
  * flag to identify the searchType
  * advanced search = 0 ,quick search = 1
  */
  public searchType = NumberConstant.ONE;

  value = new Date();
  public valueStartDate: Date = new Date(this.value.getFullYear(), NumberConstant.ZERO, NumberConstant.SHIFT_FIRST_DATE);
  public valueEndDate: Date = new Date(this.value.getFullYear(), NumberConstant.TWELVE, NumberConstant.ZERO);

  canNotUpdatePays = false;
  public payrollSessionState = PayrollSessionState;
  dayOfWeekEnum = EnumValues.getNamesAndValues(DayOfWeek);
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: SharedConstant.CODE,
      title: SharedConstant.CODE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: SessionConstant.TITLE,
      title: SessionConstant.TITLE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: SessionConstant.MONTH,
      title: SessionConstant.MONTH_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: SessionConstant.DEPEND_ON_TIMESHEET,
      title: SessionConstant.DEPEND_ON_TIMESHEET_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: SessionConstant.DAYS_OF_WORK,
      title: SessionConstant.NUMBER_OF_DAYS_WORKED_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: SharedConstant.STATE,
      title: SharedConstant.STATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  sessionInfos: Session = new Session();
  attendancesList: Array<Attendance> = [];
  payslipList: Array<Payslip> = [];
  sessionBonusesList: Array<SessionBonus> = [];
    private subscriptions: Subscription[] = [];
  /** Permissions */
  public hasOpenSessionPermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowPayrollSessionPermission: boolean;

  public state: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.NINE,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  constructor(public sessionService: SessionService, private swalWarrings: SwalWarring,
     public authService: AuthService, public router: Router, public translate: TranslateService, private payslipSession: PayslipService) {
  }
  ngAfterViewInit(): void {
    this.sessionService.defaultStartEndDateSearchSession = new Observable((observer) => {
      // observable execution
      observer.next([new Date(this.valueStartDate), this.valueEndDate])
      observer.complete()
    })
  }

  ngOnInit() {
    this.initSessionFilreConfig();
    this.initAdvancedSearchPredicate();
    this.initPredicateQuickSearch();
    this.initGridDataSource(true);
    this.hasOpenSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.OPEN_PAYROLL_SESSION);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_SESSION);
    this.hasShowPayrollSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_PAYROLL_SESSION);

  }
  
  initAdvancedSearchPredicate() {    
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateAdvancedSearch.Filter = new Array<Filter>();
    this.predicateAdvancedSearch.Filter.push(new Filter(SharedConstant.MONTH, Operation.gte, this.valueStartDate));
    this.predicateAdvancedSearch.Filter.push(new Filter(SharedConstant.MONTH, Operation.lte, this.valueEndDate));
  }

  private initPredicateQuickSearch() {
    this.predicateQuickSearch = new PredicateFormat();
    this.predicateQuickSearch.Filter = new Array<Filter>();
  }
  
  private initSessionFilreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(SessionConstant.DATE), FieldTypeConstant.DATE_MONTH_TYPE, SharedConstant.MONTH));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(SharedConstant.CODE, FieldTypeConstant.TEXT_TYPE, SharedConstant.CODE));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(this.translate.instant(SessionConstant.TITLE), FieldTypeConstant.TEXT_TYPE, SessionConstant.TITLE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(this.translate.instant(SharedConstant.STATE_UPPERCASE), FieldTypeConstant.sessionStateComponent, SharedConstant.STATE));
  }

  
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.payslipSession.checkIfThereAreSourceDeductionsToDelete(dataItem.Id).toPromise().then(res => {
          if (res) {
            this.swalWarrings.CreateSwal(SessionConstant.DELETE_SOURCE_DEDUCTION_WITH_SESSION, undefined,
              SharedConstant.YES, SharedConstant.NO).then((confirmation) => {
              if (confirmation.value) {
                this.removeSession(dataItem);
              }
            });
          } else {
            this.removeSession(dataItem);
          }
        });
      }
    });
    };

  removeSession(dataItem) {
    this.subscriptions.push(this.sessionService.remove(dataItem).subscribe(() => {
      this.initGridDataSource();
    }));
  }

  /**
   * Init grid with data from the datasource
   */
  initGridDataSource(isQuickSearch?: boolean) {
    this.setPredicateFiltre(isQuickSearch);
    if (isQuickSearch) {
      this.gridSettings.state.skip = NumberConstant.ZERO;
    }
    this.loadData(this.gridSettings.state);
  }

  private setPredicateFiltre(isQuickSearch) {
    this.predicate = [];
    if (isQuickSearch) {
      this.state.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicateQuickSearch.Filter.push(new Filter(SharedConstant.MONTH, Operation.gte, this.valueStartDate));
      this.predicateQuickSearch.Filter.push(new Filter(SharedConstant.MONTH, Operation.lte, this.valueEndDate));
      this.predicate.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.state.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicate.push(this.predicateAdvancedSearch);
    }
  }


  /**
   * Reload grid data when data is changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.loadData(state);
  }
  private loadData(state: State) {
    this.subscriptions.push(this.sessionService.reloadServerSideDataWithListPredicate(state, this.predicate, SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(data => {
        data.data.forEach(element => {
          if (element.DaysOfWeekWorked != null) {
            const dataSource = new Array<string>();
            element.DaysOfWeekWorked.forEach(result => {
              result = this.translate.get(this.dayOfWeekEnum[result].name.toUpperCase());
              dataSource.push(result.value);
            });
            element.DaysOfWeekWorked = dataSource;
          }
        });
        this.gridSettings.gridData = data;
      }));
  }


  /**
   * Opens the session in the interface corresponding to its state
   * @param id
   */
  public getSession(id: number, state: number) {
    switch (state) {
      case PayrollSessionState.New: {
        this.router.navigateByUrl(SessionConstant.SESSION_EMPLOYEE_URL.concat(id.toString()), {skipLocationChange: true});
        break;
      }
      case PayrollSessionState.Attendance: {
        this.router.navigateByUrl(AttendanceConstant.ATTENDANCE_URL.concat(id.toString()), {skipLocationChange: true});
        break;
      }
      case PayrollSessionState.Bonus: {
        this.router.navigateByUrl(BonusConstant.BONUS_URL.concat(id.toString()), {skipLocationChange: true});
        break;
      }
      case PayrollSessionState.Loan: {
        this.router.navigateByUrl(SessionConstant.LOAN_SESSION_URL.concat(id.toString()), {skipLocationChange: true});
        break;
      }
      default: {
        this.router.navigateByUrl(PayslipConstant.PAYSLIP_URL.concat(id.toString()), {skipLocationChange: true});
      }
    }
  }

  public receiveData(event: any) {
    this.predicateQuickSearch = event.predicate;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }

  /**
 * identify the predicate operator AND|OR
 * @param operator
 */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  /**
 * get array<Filtre> from advancedSearchComponenet
 * remove old filter property from the predicate filter list
 * case filtre type date between
 * @param filtre
 */
  getFiltrePredicate(filtre) {
    this.searchType = NumberConstant.ZERO;
    this.prepareFiltreFromAdvancedSearch(filtre);
  }

  /**
 * case filtre date between : we don't remove the old filtre date value
 * @param filtreFromAdvSearch
 * @private
 */
  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop == filtreFromAdvSearch.prop);
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    } else if (filtreFromAdvSearch.operation && isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
  }
/**
   * Reset dataGrid
   */
  resetClickEvent() {
    this.predicateQuickSearch.Filter = [];
    this.predicateAdvancedSearch.Filter = [];
    this.searchSessionComponent.sessionString = SharedConstant.EMPTY;
    this.initGridDataSource(true);
  }
  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
  } 
  }
}
