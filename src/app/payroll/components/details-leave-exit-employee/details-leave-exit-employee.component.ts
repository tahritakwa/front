import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ExitEmployeeLeaveService} from '../../services/exit-employee-leave/exit-employee-leave.service';
import {Filter, Operation, PredicateFormat} from '../../../shared/utils/predicate';
import {ExitEmployeeConstant} from '../../../constant/payroll/exit-employee.constant';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {State} from '@progress/kendo-data-query';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {LeaveRequestConstant} from '../../../constant/payroll/leave.constant';
import {TranslateService} from '@ngx-translate/core';
import {FileService} from '../../../shared/services/file/file-service.service';
import {ExitEmployeeService} from '../../services/exit-employee/exit-employee.service';
import {ExitEmployee} from '../../../models/payroll/exit-employee.model';

@Component({
  selector: 'app-details-leave-exit-employee',
  templateUrl: './details-leave-exit-employee.component.html',
  styleUrls: ['./details-leave-exit-employee.component.scss']
})
export class DetailsLeaveExitEmployeeComponent implements OnInit {
  @Input() id: number;
  @Input() hide: boolean;
  public predicate: PredicateFormat = new PredicateFormat();
  public listOfData: any;
  public exitEmployee: ExitEmployee;
  public pagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: LeaveRequestConstant.ID_LEAVE_TYPE_NAVIGATION_LABEL,
      title: 'LEAVE_TYPE',
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.MONTH_FIELD,
      title: ExitEmployeeConstant.MONTH,
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.DAY_TAKEN_PER_MONTH,
      title: ExitEmployeeConstant.DAY_TAKEN_PER_MONTH_TITLE,
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.TOTAL_TAKEN_PER_MONTH,
      title: ExitEmployeeConstant.TOTAL_TAKEN_PER_MONTH_TITLE,
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.ACQUIRED_PER_MONTH,
      title: ExitEmployeeConstant.ACQUIRED_PER_MONTH_TITLE,
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.CUMULATIVE_TAKEN,
      title: ExitEmployeeConstant.CUMULATIVE_TAKEN_TITLE,
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.CUMULATIVE_ACQUIRED,
      title: ExitEmployeeConstant.CUMULATIVE_ACQUIRED_TITLE,
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.BALANCE_PER_MONTH,
      title: ExitEmployeeConstant.BALANCE_PER_MONTH_TITLE,
      _width: 150,
      filterable: true
    }
  ];
  public secondColumnsConfig: ColumnSettings[] = [
    {
      field: LeaveRequestConstant.ID_LEAVE_TYPE_NAVIGATION_LABEL,
      title: 'LEAVE_TYPE',
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.YEAR_FIELD,
      title: 'YEAR',
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.DAY_TAKEN_PER_YEAR,
      title: ExitEmployeeConstant.DAY_TAKEN_PER_YEAR_TITLE,
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.TOTAL_TAKEN_PER_YEAR,
      title: ExitEmployeeConstant.TOTAL_TAKEN_PER_YEAR_TITLE,
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.ACQUIRED_PER_YEAR,
      title: ExitEmployeeConstant.ACQUIRED_PER_YEAR_TITLE,
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.CUMULATIVE_TAKEN,
      title: ExitEmployeeConstant.CUMULATIVE_TAKEN_TITLE,
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.CUMULATIVE_ACQUIRED,
      title: ExitEmployeeConstant.CUMULATIVE_ACQUIRED_TITLE,
      _width: 150,
      filterable: true
    },
    {
      field: ExitEmployeeConstant.BALANCE_PER_YEAR,
      title: ExitEmployeeConstant.BALANCE_PER_YEAR_TITLE,
      _width: 150,
      filterable: true
    }
  ];
  /**
   * Grid  settings
   */
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public secondGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.secondColumnsConfig,
  };

  constructor(private activatedRoute: ActivatedRoute, public exitEmployeeLeaveService: ExitEmployeeLeaveService, private translate: TranslateService,
              private fileServiceService: FileService, public exitEmployeeService: ExitEmployeeService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.DetailsMonthlyLeaveExitEmployee();
    this.DetailsAnnualLeaveExitEmployee();
    this.getExitEmployeeInformation();
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.DetailsMonthlyLeaveExitEmployee();
  }

  dataStateChangeSecondGrid(state: State) {
    this.secondGridSettings.state = state;
    this.DetailsAnnualLeaveExitEmployee();
  }

  /**
   *get the resume leave of Monthly Type
   */
  DetailsMonthlyLeaveExitEmployee() {
    this.preparePredicate();
    this.exitEmployeeLeaveService.GetListOfLeave(this.predicate).subscribe((data) => {
      this.gridSettings.gridData = data;
    });

  }

  /**
   * prepare Monthly predicate
   */
  preparePredicate() {
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(ExitEmployeeConstant.ID_EXIT_EMPLOYEE, Operation.eq, this.id));
    this.predicate.Filter.push(new Filter(ExitEmployeeConstant.PERIOD_FROM_LEAVE_TYPE_NAVIGATION, Operation.eq, NumberConstant.ONE));
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = this.gridSettings.state.skip / this.gridSettings.state.take + NumberConstant.ONE;
  }

  /**
   *get the resume leave of Annual Type
   */
  DetailsAnnualLeaveExitEmployee() {
    this.prepareAnnualPredicate();
    this.exitEmployeeLeaveService.GetListOfLeave(this.predicate).subscribe((data) => {
      this.secondGridSettings.gridData = data;
    });
  }

  /**
   * prepare Annual predicate
   */
  prepareAnnualPredicate() {
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(ExitEmployeeConstant.ID_EXIT_EMPLOYEE, Operation.eq, this.id));
    this.predicate.Filter.push(new Filter(ExitEmployeeConstant.PERIOD_FROM_LEAVE_TYPE_NAVIGATION, Operation.eq, NumberConstant.TWO));
    this.predicate.pageSize = this.secondGridSettings.state.take;
    this.predicate.page = this.secondGridSettings.state.skip / this.secondGridSettings.state.take + NumberConstant.ONE;
  }

  /**
   *get the Exit Employee information
   */
  getExitEmployeeInformation() {
    this.exitEmployeeService.getById(this.id).subscribe((data) => {
      this.exitEmployee = data;
    });
  }

  /**
   *get the Exit Employee leave Summary
   */
  onPrintLeaveSummary() {
    this.exitEmployeeLeaveService.downloadAllLeaveResume(this.exitEmployee.Id).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
  }
}
