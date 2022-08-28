import { Component, OnInit, Output, EventEmitter, Input, ViewChild, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PredicateFormat, Filter, Operation, Operator } from '../../../shared/utils/predicate';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import { Employee } from '../../../models/payroll/employee.model';
import { AdministrativeDocumentConstant } from '../../../constant/payroll/administrative-document-constant';
import { EmployeeMultiselectComponent } from '../../../shared/components/employee-multiselect/employee-multiselect.component';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { EnumValues } from 'enum-values';
import { TimeSheetStatusEnumerator } from '../../../models/enumerators/timeSheet-status-enumerator.enum';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { SharedConstant } from '../../../constant/shared/shared.constant';
@Component({
  selector: 'app-search-section',
  templateUrl: './search-section.component.html',
  styleUrls: ['./search-section.component.scss']
})
export class SearchSectionComponent implements OnInit {
  @ViewChild(EmployeeMultiselectComponent) childEmployeesDropDown;
  @Input() statusList;
  @Input() showAllEmployee;
  @Output() filterChanged = new EventEmitter<any>();
  @Input() isTimeSheetStatus;
  @Input() date: Date;
  @Input() maxDate;
  @Input() withTeamManager;
  @Output() filterEmitter = new EventEmitter<any>();
  @Output() dateEmitter = new EventEmitter<any>();
  @Input() mandatoryMonth;
  /**
   * Team checkbox
   */
  public team = false;

  /**
   * status checkbox
   */
  public status = false;

  /**
   * collaborater checkbox
   */
  public collaborater = false;


  public selectedCollaboraters: number[] = [];

  public selectedTeams: number[] = [];

  public searchFormGroup: FormGroup;

  public predicate: PredicateFormat;
  hideCardBody = false;
  public selectedTeamManagers: number[] = [];
  /**
   * Grid state
   */
  public gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  // The connected Employee
  public connectedEmployee: Employee;

  constructor(public translate: TranslateService, private fb: FormBuilder , public employeeService: EmployeeService) { }
  /**
   * initialize component
   */
  ngOnInit() {
    this.employeeService.getConnectedEmployee().subscribe(
      (res: Employee) => {
        this.connectedEmployee = res;
    });
    this.createSearchForm();
    this.preparePredicate();
  }

  // Get the latest value from input
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {
    this.showAllEmployee = changes.showAllEmployee;
  }

  /**
   * Create resignation form
   */
  private createSearchForm(): void {
    this.searchFormGroup = this.fb.group({
      Status: ''
    });
  }
   /**
   * When user choose specific teams
   * @param $event
   */
  teamSelected($event) {
    this.selectedTeams = $event.selectedValueMultiSelect;
    const teams = [];
    this.selectedTeamManagers = [];
    if (this.childEmployeesDropDown) {
      if (this.selectedTeams.length > 0) {
        this.selectedTeams.forEach(id => {
          teams.push($event.teamDataSource.find(x => x.Id === id));
        });
        this.childEmployeesDropDown.initialiseEmployeeDropdown();
        this.selectedCollaboraters = [];
      }
      this.childEmployeesDropDown.SetTeam(this.selectedTeams);
      this.preparePredicate();
      this.filterEmitter.emit(this.predicate);
    }
  }

  /**
   * When user choose specific employees
   * @param $event
   */
  employeeSelected($event) {
    this.selectedCollaboraters = $event.selectedValueMultiSelect;
    this.preparePredicate();
    this.filterEmitter.emit(this.predicate);
  }

  /**
   * When user choose a specific date
   * @param $event
   */
  selectedDate() {
    this.preparePredicate();
    if (!this.isTimeSheetStatus) {
      this.dateEmitter.emit(this.date);
    } else {
      this.filterEmitter.emit(this.predicate);
    }
  }
  /**
   * make collaborater checkbox checked
   */
  setCollaboraterCheckboxToTrue(event) {
    if (event.target.checked) {
      this.collaborater = true;
    } else {
      this.collaborater = false;
    }
  }

  /**
   * make team checkbox checked
   */
  setTeamCheckboxToTrue(event) {
    if (event.target.checked) {
      this.team = true;
    } else {
      this.team = false;
    }
  }

  /**
   * make status checkbox checked
   */
  setStatusCheckboxToTrue(event) {
    if (event.target.checked) {
      this.status = true;
    } else {
      this.status = false;
      this.Status.setValue(undefined);
    }
  }

  /**
   * prepare predicate and notice parent with the changement
   */
  public onSearch() {
    this.preparePredicate();
    this.filterChanged.emit(this.predicate);
  }

  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Operator = Operator.and;
    this.predicate.Filter = new Array<Filter>();
    if (!this.date) {
      this.prepareStatusPredicate();
    }
    this.prepareCollaboraterPredicate();
    this.prepareTeamPredicate();
    this.prepareMonthPredicate();
  }

  public prepareStatusPredicate() {
      if ((this.Status.value) || (this.isTimeSheetStatus && this.Status.value === NumberConstant.ZERO)) {
        let statusName = '';
        if (this.isTimeSheetStatus) {
          statusName = EnumValues.getNameFromValue(TimeSheetStatusEnumerator, this.Status.value);
        } else {
          statusName =  EnumValues.getNameFromValue(AdministrativeDocumentStatusEnumerator, this.Status.value);
        }
        if (statusName !== SharedConstant.ALL) {
          this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.STATUS, Operation.eq, this.Status.value));
        }
      }
  }
  public prepareCollaboraterPredicate() {
    if (this.selectedCollaboraters.length > 0) {
      this.selectedCollaboraters.forEach(Id => {
        this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.EMPLOYEE_ID, Operation.eq, Id, false, true));
      });
    }
  }

  public prepareTeamPredicate() {
    if (this.selectedTeams.length > 0 && this.selectedCollaboraters.length === 0) {
      this.selectedTeams.forEach(Id => {
        this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.ID_TEAM, Operation.eq, Id, false, true));
      });
    }
  }

  public prepareMonthPredicate() {
    if (this.date) {
      this.date = new Date( this.date.getFullYear(), this.date.getMonth(), 1);
      if (this.isTimeSheetStatus) {
        this.predicate.Filter.push(new Filter(SharedConstant.MONTH, Operation.eq, this.date));
      }
    }
  }

  get Status(): FormControl {
    return this.searchFormGroup.get(AdministrativeDocumentConstant.STATUS) as FormControl;
  }

  onKeydown(event) {
      if (!this.mandatoryMonth) {
          return true;
      } else {
        return false;
      }
  }
}
