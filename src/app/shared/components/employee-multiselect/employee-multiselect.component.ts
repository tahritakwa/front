import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Employee} from '../../../models/payroll/employee.model';
import {EmployeeService} from '../../../payroll/services/employee/employee.service';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat} from '../../utils/predicate';
import {EmployeeConstant} from '../../../constant/payroll/employee.constant';
import {AdministrativeDocumentConstant} from '../../../constant/payroll/administrative-document-constant';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ComponentsConstant } from '../../../constant/shared/components.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-employee-multiselect',
  templateUrl: './employee-multiselect.component.html',
  styleUrls: ['./employee-multiselect.component.scss']
})
export class EmployeeMultiselectComponent implements OnInit {

  @Input() teams;
  @Input() withTheSuperior;
  @Input() hierarchy;
  @Input() selectedValue;
  @Input() employeesToIgnore: number[];
  @Input() withTeamCollaborater: boolean;
  @Output() selected = new EventEmitter<any>();
  @Input() idSkill;
  @Output() hasNoEmployeeWithSkill = new EventEmitter<boolean>();
  @Input() withTeamManager;
  @Input() disabled = false;
  @Input() idEmployeeCollaborator;
  @Input() selectedValueMultiSelect = [];
  @Input() showFromFilter = false;
  @ViewChild(MultiSelectComponent) public multiSelectComponent: MultiSelectComponent;

  public employeesDataSource: Employee[];
  public employeesFiltredDataSource: Employee[];

  public dropdownSettings = {};

  constructor(public employeeService: EmployeeService, private authService: AuthService, private translate: TranslateService) {
  }

  public onSelect(event): void {
    this.selected.emit(event.selectedValueMultiSelect.map(x => x.Id));
  }

  onDeSelectAll() {
    this.selected.emit();
  }
  /**
   * select all items
   * @param $event
   */
  onSelectAll() {
    const allSelectedIds =  this.employeesDataSource.map(x => x.Id);
    this.selected.emit(allSelectedIds);
  }
  ngOnInit() {
    this.initCheckboxDropdownMode();
    if (this.showFromFilter) {
      this.hierarchy = this.withTheSuperior = this.withTeamCollaborater
        = !this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_LEAVE);
    }
    this.initDataSource();
  }

  preparePredicate(): PredicateFormat {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    if (this.teams && this.teams.length > 0) {
      this.teams.forEach(team => {
        myPredicate.Filter.push(new Filter(AdministrativeDocumentConstant.ID_TEAM, Operation.eq, team, false, true));
      });
    }
    if (this.employeesToIgnore && this.employeesToIgnore.length > 0) {
      this.employeesToIgnore.forEach(x => {
        myPredicate.Filter.push(new Filter(EmployeeConstant.ID, Operation.neq, x));
      });
    }
    if (this.idEmployeeCollaborator) {
      myPredicate.Filter.push(new Filter(EmployeeConstant.ID, Operation.neq, this.idEmployeeCollaborator));
    }
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push(new OrderBy(EmployeeConstant.FULL_NAME, OrderByDirection.asc));
    return myPredicate;
  }

  public initDataSource(): void {
    const predicate = this.preparePredicate();
    if (this.hierarchy) {
      this.employeeService.getEmployeesHierarchicalList(this.withTeamCollaborater, this.withTheSuperior, predicate).subscribe(data => {
        this.employeesDataSource = data;
        this.employeesDataSource.filter(x => {x.FullName = x.FirstName + ' ' + x.LastName; return x; });
        this.employeesFiltredDataSource = this.employeesDataSource.slice(0);
      });
    } else if (this.idSkill) {
      this.employeeService.getEmployeeWithSkill(this.idSkill).subscribe(data => {
        if (data.length > 0) {
          this.employeesDataSource = data;
          this.employeesDataSource.filter(x => {x.FullName = x.FirstName + ' ' + x.LastName; return x; });
          this.employeesFiltredDataSource = this.employeesDataSource;
        } else {
          this.hasNoEmployeeWithSkill.emit(true);
        }
      });
    } else {
      this.employeeService.readPredicateData(predicate).subscribe(data => {
        this.employeesDataSource = data;
        this.employeesDataSource.filter(x => {x.FullName = x.FirstName + ' ' + x.LastName; return x; });
        this.employeesFiltredDataSource = this.employeesDataSource.slice(0);
        if (this.selectedValue) {
          const selectedEmployee = this.employeesDataSource.filter(x => this.selectedValue.includes(x.Id));
          this.selectedValueMultiSelect = selectedEmployee.map(({Id, FullName}) => ({Id, FullName}));
        }
      });
    }
  }

  public SetTeam(teams) {
    if (teams) {
      if (teams.length) {
        // It's an array of teams
        this.teams = teams;
      } else {
        // if it's only one team passed
        this.teams = [];
      }
    }
    this.initDataSource();
  }

  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.employeesFiltredDataSource = this.employeesDataSource.filter((s) =>
      s.FullName.toLowerCase().includes(value.toLowerCase())
    );
  }

  public initialiseEmployeeDropdown(): void {
    this.teams = [];
    this.selectedValueMultiSelect = [];
    this.employeesDataSource = [];
    this.employeesFiltredDataSource = [];
  }

  public initCheckboxDropdownMode() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: ComponentsConstant.ID,
      textField: EmployeeConstant.FULL_NAME,
      selectAllText: this.translate.instant(ComponentsConstant.SELECT_ALL),
      unSelectAllText: this.translate.instant(ComponentsConstant.DESELECT_ALL),
      allowSearchFilter: true
    };
  }

}
