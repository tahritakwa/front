import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataResult, DataSourceRequestState, State} from '@progress/kendo-data-query';
import {ActivatedRoute} from '@angular/router';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {ExitEmployeeConstant} from '../../../constant/payroll/exit-employee.constant';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ExitEmployeePayServiceService} from '../../services/exit-employee-pay/exit-employee-pay-service.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ExitEmployeePayLine} from '../../../models/payroll/ExitEmployeePayLine.model';
import {PayLineStateEnumerator} from '../../../models/enumerators/pay-line-state.enum';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import {isNullOrUndefined} from 'util';
import {notEmptyValue} from '../../../stark-permissions/utils/utils';
import {RoleConfigConstant} from '../../../Structure/_roleConfigConstant';
import {StarkPermissionsService} from '../../../stark-permissions/stark-permissions.module';
import {TranslateService} from '@ngx-translate/core';
import {ExitEmployee} from '../../../models/payroll/exit-employee.model';
import {FileService} from '../../../shared/services/file/file-service.service';
import {ExitEmployeeService} from '../../services/exit-employee/exit-employee.service';
import {ExitEmployeePayEnumerator} from '../../../models/enumerators/exit-employee-pay-state-enum';

@Component({
  selector: 'app-details-pay-exit-employee',
  templateUrl: './details-pay-exit-employee.component.html',
  styleUrls: ['./details-pay-exit-employee.component.scss']
})
export class DetailsPayExitEmployeeComponent implements OnInit {
  @Input() id: number;
  @Input() hide: boolean;
  @Input() exitEmployee: ExitEmployee;
  @Output() updateExitEmployee = new EventEmitter<any>();
  addValidationFormGroup: FormGroup;
  exitEmployeePayLine: ExitEmployeePayLine;
  public isUpdateMode = true;
  public canValidate = true;
  public showValidateButton = true;
  public exitEmployeePayEnumerator = ExitEmployeePayEnumerator;
  /**
   * Enum  Valid , NotValidated
   */
  public payLineStateEnumerator: PayLineStateEnumerator;
  public predicate: PredicateFormat = new PredicateFormat();
  listOfData: any;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.FIVE,
  };
  gridData: DataResult;
  public columnsConfig: any[] = [];

  monthColumn = {
    field: 'startDateToCalculate',
    _width: 150,
    title: ExitEmployeeConstant.MONTH,
    filterable: true,
  };

  detailsColumn = {
    field: '',
    _width: 200,
    title: ExitEmployeeConstant.DETAILS_TITLE,
    filterable: true,
  };
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public pagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  constructor(private activatedRoute: ActivatedRoute, public exitEmployeePayService: ExitEmployeePayServiceService
    , private fb: FormBuilder, private rolesService: StarkRolesService, private permissionsService: StarkPermissionsService, private translate: TranslateService,
              private fileServiceService: FileService, public exitEmployeeService: ExitEmployeeService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || NumberConstant.ZERO;
    });
  }

  get Details(): FormControl {
    return this.addValidationFormGroup.get(ExitEmployeeConstant.DETAILS) as FormControl;
  }

  get State(): FormControl {
    return this.addValidationFormGroup.get(ExitEmployeeConstant.STATE) as FormControl;
  }

  get Id(): FormControl {
    return this.addValidationFormGroup.get(SharedConstant.ID) as FormControl;
  }

  public initializeState(): DataSourceRequestState {
    return {
      skip: NumberConstant.ZERO,
      take: NumberConstant.FIVE,
      filter: { // Initial filter descriptor
        logic: 'and',
        filters: []
      },
    };
  }

  ngOnInit() {
    this.rolesService
      .ListRoleConfigsAsObservable()
      .subscribe((roledata: Array<any>) => {
        if (!isNullOrUndefined(roledata) && notEmptyValue(roledata)) {
          this.rolesService.hasOnlyRoles([RoleConfigConstant.AdminConfig,
            RoleConfigConstant.ConsultantConfig]).then(x => {
            this.canValidate = x;
          });
        }
      });
    this.permissionsService.hasPermission(ExitEmployeeConstant.VALIDATE_EXIT_EMPLOYEE).then(x => {
      this.showValidateButton = x;
    });
    this.preparePredicate();
    this.DetailsPayExitEmployee();
    this.createAddValidationFormGroup();
  }

  /**
   * Get Lines pay for exit employee
   */
  DetailsPayExitEmployee() {
    this.exitEmployeePayService.GetListOfPayForExitEmployee(this.predicate, this.id).subscribe((res: DataResult) => {
      this.gridData = res;
      this.columnsConfig = [];
      if (this.gridData.data.length !== NumberConstant.ZERO) {
        Object.keys(this.gridData.data[NumberConstant.ZERO].RuleListAndValues)
          .forEach(key => {
            this.columnsConfig.push(
              {
                field: key,
                _width: 200,
                title: key,
                filterable: true,
              });
          });
      }
    });
  }

  /**
   * prepare predicate
   */
  preparePredicate() {
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(ExitEmployeeConstant.ID_EXIT_EMPLOYEE, Operation.eq, this.id));
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = this.gridSettings.state.skip / this.gridSettings.state.take + NumberConstant.ONE;
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ExitEmployeeConstant.ID_EXIT_EMPLOYEE_NAVIGATION)]);
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy,
      [new OrderBy(ExitEmployeeConstant.YEAR, OrderByDirection.asc)]);
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange($event: State) {
    this.gridSettings.state = $event;
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = this.gridSettings.state.skip / this.gridSettings.state.take + NumberConstant.ONE;
    this.DetailsPayExitEmployee();
  }

  /**
   *validate payLine
   * @param payLine
   */
  ValidateLineOfPay(payLine: ExitEmployeePayLine) {
    payLine.Details = this.addValidationFormGroup.get(ExitEmployeeConstant.DETAILS).value;
    payLine.State = PayLineStateEnumerator.Valid;
    this.exitEmployeePayService.save(payLine, !this.isUpdateMode).subscribe((res) => {
      this.addValidationFormGroup.disable();
    });
  }

  /**
   * print salary summary
   */
  public onPrintSalarySummary() {
    const params = {
      idExitEmployee: this.exitEmployee.Id
    };
    const documentName = this.translate.instant(ExitEmployeeConstant.SALARY_SUMMARY_UPPERCASE)
      .concat(SharedConstant.UNDERSCORE).concat(this.exitEmployee.IdEmployeeNavigation.FirstName)
      .concat(SharedConstant.UNDERSCORE).concat(this.exitEmployee.IdEmployeeNavigation.LastName);

    const dataToSend = {
      'Id': this.exitEmployee.Id,
      'reportName': ExitEmployeeConstant.SALARY_SUMMARY_REPORT_NAME,
      'documentName': documentName,
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'reportType': 'pdf',
      'reportparameters': params
    };
    this.exitEmployeePayService.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
  }

  validateAllExitEmployeePayline() {
    this.exitEmployeeService.validateAllExitEmployeePayline(this.id).subscribe(() => {
      this.updateExitEmployee.emit();
    });
  }

  /**
   * create FormGroup
   */
  private createAddValidationFormGroup() {
    this.addValidationFormGroup = this.fb.group({
      Id: [NumberConstant.ZERO],
      Details: ['']
    });
  }
}
