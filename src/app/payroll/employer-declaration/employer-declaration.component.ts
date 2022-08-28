import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { EmployeeConstant } from '../../constant/payroll/employee.constant';
import { State } from '@progress/kendo-data-query';
import { NumberConstant } from '../../constant/utility/number.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { PredicateFormat, Filter, OrderBy, Operation, OrderByDirection, Relation } from '../../shared/utils/predicate';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { EmployerDeclarationConstant } from '../../constant/payroll/employer-declaration.constant';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SourceDeductionService } from '../services/source-deduction/source-deduction.service';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { AttendanceConstant } from '../../constant/payroll/attendance.constant';
import { BenefitInKindConstant } from '../../constant/payroll/benefit-in-kind.constant';
import { MaritalStatusEnumerator } from '../../models/enumerators/marital-status-enum';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-employer-declaration',
  templateUrl: './employer-declaration.component.html',
  styleUrls: ['./employer-declaration.component.scss']
})
export class EmployerDeclarationComponent implements OnInit, OnDestroy {

  employerDeclarationFormGroup: FormGroup;
  year = new Date(new Date().getFullYear(), NumberConstant.ZERO, NumberConstant.ONE);
  showGrid = false;
  showButton = false;
  public predicate: PredicateFormat;
  public maritalStatus = MaritalStatusEnumerator;
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.FIFTY,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: EmployeeConstant.FULL_NAME,
      title: EmployeeConstant.EMPLOYEE_FULL_NAME_UPPERCASE,
      tooltip: EmployeeConstant.EMPLOYEE_FULL_NAME_UPPERCASE,
      width: 200,
      locked: true,
      filterable: true
    },
    {
      field: EmployerDeclarationConstant.WORK_TIME,
      title: EmployerDeclarationConstant.WORK_TIME_UPPERCASE,
      tooltip: EmployerDeclarationConstant.WORK_TIME_UPPERCASE,
      width: 200,
      filterable: true
    },
    {
      field: EmployeeConstant.DEPENDENT_CHILDREN_NUMBER,
      title: EmployeeConstant.NUMBER_OF_CHILDREEN_UPPERCASE,
      tooltip: EmployeeConstant.DEPENDENT_CHILDREN_NUMBER_UPPERCASE,
      width: 200,
      isnumeric: true,
      filterable: true
    },
    {
      field: EmployeeConstant.MARITAL_STATUS,
      title: EmployeeConstant.MARITAL_STATUS_UPPERCASE,
      tooltip: EmployeeConstant.MARITAL_STATUS_UPPERCASE,
      width: 100,
      filterable: true
    },
    {
      field: EmployeeConstant.LAST_ADDRESS,
      title: EmployeeConstant.ADDRESS_UPPERCASE,
      tooltip: EmployeeConstant.LAST_ADDRESS_UPPERCASE,
      width: 200,
      filterable: true
    },
    {
      field: EmployerDeclarationConstant.JOB,
      title: EmployerDeclarationConstant.JOB.toUpperCase(),
      tooltip: EmployerDeclarationConstant.JOB.toUpperCase(),
      width: 200,
      filterable: true
    },
    {
      field: EmployeeConstant.IDENTITY_PIECE_NUMBER,
      title: EmployeeConstant.CIN_PASSEPORT,
      tooltip: EmployeeConstant.IDENTITY_PIECE_NUMBER_UPPERCASE,
      width: 200,
      filterable: true
    },
    {
      field: EmployeeConstant.IDENTIFIER_OF_IDENTITY_PIECE,
      title: EmployeeConstant.TYPE_OF_IDENTITY_PIECE_UPPERCASE,
      tooltip: EmployeeConstant.TYPE_OF_IDENTITY_PIECE_UPPERCASE,
      width: 150,
      isnumeric: true,
      filterable: true
    },
    {
      field: EmployeeConstant.REGISTRATION_NUMBER,
      title: EmployeeConstant.REGISTRATION_NUMBER_UPPERCASE,
      tooltip: EmployeeConstant.REGISTRATION_NUMBER_UPPERCASE,
      width: 150,
      filterable: true
    },
    {
      field: AttendanceConstant.NETTOPAY,
      title: AttendanceConstant.NETTOPAY_UPPERCASE,
      tooltip: AttendanceConstant.NETTOPAY_UPPERCASE,
      width: 200,
      isnumeric: true,
      filterable: true
    },
    {
      field: AttendanceConstant.CSS,
      title: AttendanceConstant.CSS_UPPERCASE,
      tooltip: AttendanceConstant.SOCIAL_SOLIDARITY_CONTRIBUTION,
      width: 200,
      isnumeric: true,
      filterable: true
    },
    {
      field: EmployerDeclarationConstant.REDUCED_AMOUNT_TWENTY_PER_CENT,
      title: EmployerDeclarationConstant.REDUCED_AMOUNT_TWENTY_PER_CENT_UPPERCASE,
      tooltip: EmployerDeclarationConstant.REDUCED_AMOUNT_TWENTY_PER_CENT_UPPERCASE,
      width: 200,
      isnumeric: true,
      filterable: true
    },
    {
      field: EmployerDeclarationConstant.REDUCED_AMOUNT,
      title: EmployerDeclarationConstant.REDUCED_AMOUNT_UPPERCASE,
      tooltip: EmployerDeclarationConstant.REDUCED_AMOUNT_UPPERCASE,
      width: 200,
      isnumeric: true,
      filterable: true
    },
    {
      field: EmployerDeclarationConstant.RETAINED_REINVESTED,
      title: EmployerDeclarationConstant.RETAINED_REINVESTED_UPPERCASE,
      tooltip: EmployerDeclarationConstant.RETAINED_REINVESTED_UPPERCASE,
      width: 200,
      isnumeric: true,
      filterable: true,
    },
    {
      field: EmployerDeclarationConstant.GROSS_TAXABLE,
      title: EmployerDeclarationConstant.GROSS_TAXABLE_UPPERCASE,
      tooltip: EmployerDeclarationConstant.GROSS_TAXABLE_UPPERCASE,
      width: 200,
      isnumeric: true,
      filterable: true
    },
    {
      field: BenefitInKindConstant.BENEFIT_IN_KIND,
      title: BenefitInKindConstant.BENEFIT_IN_KIND_UPPERCASE,
      tooltip: BenefitInKindConstant.BENEFIT_IN_KIND_UPPERCASE,
      width: 200,
      isnumeric: true,
      filterable: true
    },
    {
      field: AttendanceConstant.TAXABLE_WAGES,
      title: AttendanceConstant.TAXABLE_WAGES_UPPERCASE,
      tooltip: AttendanceConstant.TAXABLE_WAGES_UPPERCASE,
      width: 200,
      isnumeric: true,
      filterable: true
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  private subscription: Subscription;

  public constructor(private fb: FormBuilder, private sourceDeductionService: SourceDeductionService,
    private translate: TranslateService) {
  }

  /**
   * Year getter
   */
  get Year(): FormControl {
    return this.employerDeclarationFormGroup.get(SharedConstant.YEAR) as FormControl;
  }

  ngOnInit() {
    this.createFormGroup();
    this.preparePredicate();
  }

  initGridDataSource() {
    this.subscription = this.sourceDeductionService.getEmployerDeclaration(this.gridSettings.state, this.predicate).subscribe(result => {
      this.showGrid = true;
      this.gridSettings.gridData = result;
    });
  }

  changeYear() {
    // Set date formcontrol value with systeme date if the specified date is invalid
    if (this.Year.value === null || this.Year.value === undefined) {
      this.Year.setValue(new Date());
    }
  }

  generate() {
    this.showGrid = false;
    this.preparePredicate();
    this.initGridDataSource();
  }

  filterChange(event: any) {
  }

  /**
   * Reload grid data when data is changed
   * @param state
   */
  dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  private createFormGroup() {
    this.employerDeclarationFormGroup = this.fb.group({
      Year: [this.year, [Validators.required]]
    });
  }

  private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter.push(new Filter(SharedConstant.YEAR, Operation.eq, this.Year.value.getFullYear()));
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(EmployeeConstant.ID_EMPLOYEE_NAVIGATION)]);
    // this.predicate.OrderBy.push(new OrderBy(SharedConstant.START_DATE, OrderByDirection.asc));
  }
}
