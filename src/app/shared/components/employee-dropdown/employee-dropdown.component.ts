import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EmployeeService} from '../../../payroll/services/employee/employee.service';
import {DropDownComponent} from '../../interfaces/drop-down-component.interface';
import {EmployeeConstant} from '../../../constant/payroll/employee.constant';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat} from '../../utils/predicate';
import {ReducedEmployee} from '../../../models/payroll/reduced-employee.model';
import {RoleConfigConstant} from '../../../Structure/_roleConfigConstant';
import {AddEmployeeComponent} from '../../../payroll/employee/add-employee/add-employee.component';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {InterviewConstant} from '../../../constant/rh/interview.constant';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { EmployeeState } from '../../../models/enumerators/employee-state.enum';

@Component({
  selector: 'app-employee-dropdown',
  templateUrl: './employee-dropdown.component.html',
  styleUrls: ['./employee-dropdown.component.scss']
})
export class EmployeeDropdownComponent implements OnInit, DropDownComponent, OnChanges {
  @ViewChild(ComboBoxComponent) public comboboxComponent: ComboBoxComponent;
  @Input() allowCustom;
  @Input() form: FormGroup;
  @Input() idEmployeeColName: string;
  @Input() disabled;
  @Input() hierarchy;
  @Input() withTheSuperior;
  @Input() withTeamCollaborater: boolean;
  @Input() IdEmployee: number;
  @Input() isDisabled: boolean;
  @Input() readonly: boolean;
  @Output() Selected = new EventEmitter<boolean>();
  @Output() hasNotInferior = new EventEmitter<boolean>();
  @Input() selectedEmployee: number;
  @Input() idSkill;
  @Input() idEmployeeCollaborator;
  @Input() requiredInterviewersIds: number[];
  @Input() isForInterview: boolean;
  @Output() hasNoEmployeeWithSkill = new EventEmitter<boolean>();
  @Input() showAddButton: boolean;
  @Input() getNotAssociatedEmployees: boolean;
  @Input() isFromExitEmployee: boolean;
  public employeeDataSource: ReducedEmployee[];
  public employeeFiltredDataSource: ReducedEmployee[];
  public predicate: PredicateFormat;
  public RoleConfigConstant: RoleConfigConstant;

  constructor(private employeeService: EmployeeService, public authService: AuthService,
              private formModalDialogService: FormModalDialogService, private viewContainerRef: ViewContainerRef) {
  }

  get IdSupervisor(): FormControl {
    return this.form.get(InterviewConstant.ID_SUPERVISOR) as FormControl;
  }

  ngOnInit() {
    if (!this.idEmployeeColName) {
      this.idEmployeeColName = EmployeeConstant.ID_EMPLOYEE;
    }
    this.preparePredicate();
    this.initDataSource();
    if (!this.idEmployeeColName) {
      this.idEmployeeColName = EmployeeConstant.ID_EMPLOYEE;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isDisabled && this.IdEmployee) {
      this.employeeService.getById(this.IdEmployee).subscribe((data) => {
        this.employeeDataSource = new Array();
        this.employeeDataSource.push(data);
        this.employeeFiltredDataSource = this.employeeDataSource;
      });
    }
    if (changes && changes.requiredInterviewersIds &&
      (changes.requiredInterviewersIds.previousValue !== changes.requiredInterviewersIds.currentValue)) {
      if (changes.requiredInterviewersIds.currentValue.filter(x => x === this.IdSupervisor.value)
        .length === NumberConstant.ZERO) {
        this.IdSupervisor.setValue('');
      }
      this.initDataSource();
    }
  }

  /**
   * prepare Employee Predicate
   * */
  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy,
      [new OrderBy(EmployeeConstant.FIRST_NAME, OrderByDirection.asc),
        new OrderBy(EmployeeConstant.LAST_NAME, OrderByDirection.asc)]);
    this.predicate.Filter = new Array<Filter>();
    if (this.idEmployeeCollaborator && !this.isFromExitEmployee) {
      this.predicate.Filter.push(new Filter(EmployeeConstant.ID, Operation.neq, this.idEmployeeCollaborator));
    }
    if (this.isFromExitEmployee) {
      this.predicate.Filter.push(new Filter(EmployeeConstant.STATUS, Operation.eq, EmployeeState.Active, false, true));
      this.predicate.Filter.push(new Filter(EmployeeConstant.ID, Operation.eq, this.idEmployeeCollaborator, false, true));
      if (!this.disabled) {
        this.predicate.Filter.push(new Filter(EmployeeConstant.RESIGNED_FROM_EXIT_EMPLOYEE, Operation.eq, false));
      }
    }
  }

  /**
   * init Data Source
   * */
  initDataSource(): void {
    if (this.hierarchy) {
      this.employeeService.getEmployeesHierarchicalList(this.withTeamCollaborater, this.withTheSuperior, this.predicate).subscribe(data => {
        this.employeeDataSource = data;
        this.employeeDataSource.filter(x => {x.FullName = x.FirstName + ' ' + x.LastName; return x; });
        this.employeeFiltredDataSource = this.employeeDataSource;
        if (this.withTheSuperior && this.employeeFiltredDataSource.length === NumberConstant.ONE) {
          // the employee has not inferior
          this.hasNotInferior.emit(true);
        }
      });
    } else if (this.idSkill) {
      this.employeeService.getEmployeeWithSkill(this.idSkill).subscribe(data => {
        if (data.length > NumberConstant.ZERO) {
          this.employeeDataSource = data;
          this.employeeDataSource.filter(x => {x.FullName = x.FirstName + ' ' + x.LastName; return x; });
          this.employeeFiltredDataSource = this.employeeDataSource;
        } else {
          this.hasNoEmployeeWithSkill.emit(true);
        }
      });
    } else if (this.isForInterview) {
      this.employeeService.getEmployeesDetails(this.requiredInterviewersIds ? this.requiredInterviewersIds : []).subscribe((res) => {
        this.employeeFiltredDataSource = res;
        this.employeeFiltredDataSource.filter(x => {x.FullName = x.FirstName + ' ' + x.LastName; return x; });
      });
    } else if (this.getNotAssociatedEmployees) {
      this.employeeService.getNotAssociatedEmployees().subscribe(dataResult => {
        this.employeeDataSource = dataResult.listData;
        this.employeeDataSource.filter(x => {x.FullName = x.FirstName + ' ' + x.LastName; return x; });
        this.employeeFiltredDataSource = this.employeeDataSource.slice(NumberConstant.ZERO);
      });
    } else {
      this.employeeService.getEmployeeDropdownWithPredicate(this.predicate).subscribe(dataResult => {
        this.employeeDataSource = dataResult.listData;
        this.employeeDataSource.filter(x => {x.FullName = x.FirstName + ' ' + x.LastName; return x; });
        this.employeeFiltredDataSource = this.employeeDataSource.slice(NumberConstant.ZERO);
      });
    }
  }

  /**
   * Dropdown front filter
   * @param value
   */
  handleFilter(value: string): void {
    this.employeeFiltredDataSource = value && value !== '' ?
      this.employeeDataSource.filter((s) => s.FirstName.concat(' ', s.LastName).toLowerCase().includes(value.toLowerCase()))
        : this.employeeDataSource;
  }

  /**
   * Add new employee
   */
  addNew(): void {
    const TITLE = EmployeeConstant.ADD_EMPLOYEE;
    this.formModalDialogService.openDialog(TITLE,
      AddEmployeeComponent,
      this.viewContainerRef, this.initDataSource.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  /**
   * Select employee in dropdown
   * @param $event
   */
  onSelect($event) {
    this.Selected.emit($event);
  }
}
