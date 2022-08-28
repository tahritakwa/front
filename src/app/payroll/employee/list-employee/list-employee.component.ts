import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';
import { UserConstant } from '../../../constant/Administration/user.constant';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { EmployeeState } from '../../../models/enumerators/employee-state.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SearchEmployeeComponent } from '../../components/search-employee/search-employee.component';
import { MediaConstant } from '../../../constant/utility/Media.constant';
import { EmployeeService } from '../../services/employee/employee.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { LeaveBalanceRemainingService } from '../../services/leave-balance-remaining/leave-balance-remaining.service';
import { LeaveBalanceRemainingFilter } from '../../../models/payroll/LeaveBalanceRemainingFilter';
import { ProgressBar } from '../../../models/payroll/progress-bar.model';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { ProgressService } from '../../../shared/services/signalr/progress/progress.service';
import { ProgressBarState } from '../../../models/enumerators/progress-bar-state.enum';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.scss']
})
export class ListEmployeeComponent implements OnInit, OnDestroy {
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  // private DisplayEmployeeByFilter: number = NumberConstant.ZERO;
  public predicate: PredicateFormat = new PredicateFormat();
  public employeeStateEnumerator = EmployeeState;
  dataImported: boolean;
  importData: Array<Employee>;
  public formGroup: FormGroup;
  public formGroupContract: FormGroup;
  @ViewChild(SearchEmployeeComponent)
  searchEmployeeComponent;
  choosenFilter = NumberConstant.ONE;
  public employeeState = EmployeeState;
  leaveBalanceRemainingFilter: LeaveBalanceRemainingFilter;
  progression: ProgressBar;
  public showProgress = false;
  /** Permissions */
  public hasAddPermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowEmployeePermission: boolean;
  public hasUpdatePermission: boolean;
  public hasImportPermission: boolean;
  public hasViewOrganizationChartPermission: boolean;
  public hasListViewResignedEmployeesPermission: boolean;
  public hasShowResignedEmployeePermission: boolean;
  public hasCalculatePermission = false;
  protected subscriptions: Subscription[] = [];
  isCardView = true;
  private importFileEmployes: FileInfo;
  employeeStates = [];
  stateValue = EmployeeState.Active;

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
      field: EmployeeConstant.FULL_NAME,
      title: EmployeeConstant.EMPLOYEE_UPPERCASE,
      filterable: false,
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: EmployeeConstant.REGISTRATION_NUMBER,
      title: EmployeeConstant.REGISTRATION_NUMBER_UPPERCASE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED
    },
    {
      field: EmployeeConstant.EMAIL,
      title: EmployeeConstant.EMAIL_UPPERCASE,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.PERSONAL_PHONE,
      title: EmployeeConstant.PHONE,
      filterable: false,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: SharedConstant.STATE,
      title: SharedConstant.STATE_UPPERCASE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED
    }
  ];

  importColumnsConfig: ColumnSettings[] = [
    {
      field: EmployeeConstant.REGISTRATION_NUMBER,
      title: EmployeeConstant.REGISTRATION_NUMBER_UPPERCASE,
      filterable: true,
      width: 100
    },
    {
      field: EmployeeConstant.FIRST_NAME,
      title: EmployeeConstant.FIRST_NAME_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.LAST_NAME,
      title: EmployeeConstant.LAST_NAME_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.CIN,
      title: EmployeeConstant.CIN.toUpperCase(),
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.SOCIAL_SECURITY_NUMBER,
      title: EmployeeConstant.SOCIAL_SECURITY_NUMBER_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.GENDRE,
      title: EmployeeConstant.GENDRE_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.ID_CITIZEN_SHIP,
      title: EmployeeConstant.NATIONALITY,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.DEPENDENT_CHILDREN_NUMBER,
      title: EmployeeConstant.DEPENDENT_CHILDREN_NUMBER_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.PERSONAL_PHONE,
      title: EmployeeConstant.PERSONAL_PHONE_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.PROFESSIONAL_PHONE,
      title: EmployeeConstant.PROFESSIONAL_PHONE_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.BIRTH_DATE,
      title: EmployeeConstant.BIRTH_DATE_UPPERCASE,
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.BIRTH_PLACE,
      title: EmployeeConstant.BIRTH_PLACE_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.ADDRESS_LINE_1,
      title: EmployeeConstant.ADDRESS_LINE_1_UPPERCASE,
      filterable: true,
      width: NumberConstant.FIVE_HUNDRED
    },
    {
      field: EmployeeConstant.ADDRESS_LINE_2,
      title: EmployeeConstant.ADDRESS_LINE_2_UPPERCASE,
      filterable: true,
      width: NumberConstant.FIVE_HUNDRED
    },
    {
      field: EmployeeConstant.ADDRESS_LINE_3,
      title: EmployeeConstant.ADDRESS_LINE_3_UPPERCASE,
      filterable: true,
      width: NumberConstant.FIVE_HUNDRED
    },
    {
      field: EmployeeConstant.ADDRESS_LINE_4,
      title: EmployeeConstant.ADDRESS_LINE_4_UPPERCASE,
      filterable: true,
      width: NumberConstant.FIVE_HUNDRED
    },
    {
      field: EmployeeConstant.ADDRESS_LINE_5,
      title: EmployeeConstant.ADDRESS_LINE_5_UPPERCASE,
      filterable: true,
      width: NumberConstant.FIVE_HUNDRED
    },
    {
      field: EmployeeConstant.ZIP_CODE,
      title: EmployeeConstant.ZIP_CODE_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.EMAIL,
      title: EmployeeConstant.EMAIL.toUpperCase(),
      filterable: true,
      width: NumberConstant.FIVE_HUNDRED
    },
    {
      field: EmployeeConstant.FACEBOOK,
      title: EmployeeConstant.FACEBOOK,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.LINKEDIN,
      title: EmployeeConstant.LINKEDIN,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.ECHELON,
      title: EmployeeConstant.ECHELON.toUpperCase(),
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.HOME_LOAN,
      title: EmployeeConstant.HOME_LOAN_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.CHILDREN_NO_SCHOLAR,
      title: EmployeeConstant.CHILDREN_NO_SCHOLAR_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.CHILDREN_DISABLED,
      title: EmployeeConstant.CHILDREN_DISABLED_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.IS_FOREIGN,
      title: EmployeeConstant.IS_FOREIGN_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.DEPENDENT_PARENT_NUMBER,
      title: EmployeeConstant.DEPENDENT_PARENT_NUMBER_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.RIB,
      title: EmployeeConstant.RIB.toUpperCase(),
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.ID_BANK,
      title: EmployeeConstant.BANK.toUpperCase(),
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.CATEGORY,
      title: EmployeeConstant.CATEGORY.toUpperCase(),
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EmployeeConstant.FAMILY_LEADER,
      title: EmployeeConstant.FAMILY_LEADER_UPPERCASE,
      filterable: true,
      width: NumberConstant.TWO_HUNDRED
    }
  ];
  importColumnsContractConfig: ColumnSettings[] = [
    {
      field: ContractConstant.ID_CONTRACT_TYPE,
      title: ContractConstant.CONTRACT_TYPE_UPPERCASE,
      filterable: true,
      width: NumberConstant.TEN
    },
    {
      field: ContractConstant.START_DATE,
      title: ContractConstant.START_DATE_UPPERCASE,
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      width: NumberConstant.TEN
    },
    {
      field: ContractConstant.END_DATE,
      title: ContractConstant.END_DATE_UPPERCASE,
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      width: NumberConstant.TEN
    },
    {
      field: ContractConstant.ID_SALARY_STRUCTURE,
      title: ContractConstant.SALARY_STRUCTURE,
      filterable: true,
      width: NumberConstant.TEN
    },
    {
      field: ContractConstant.ID_CNSS_TYPE,
      title: ContractConstant.CNSS_TYPE,
      filterable: true,
      width: NumberConstant.TEN
    },
    {
      field: ContractConstant.WORKING_TIME,
      title: ContractConstant.WORKING_TIME_UPPERCASE,
      filterable: true,
      width: NumberConstant.TEN
    },
    {
      field: ContractConstant.CONTRACT_BASE_SALARY_VALUE,
      title: ContractConstant.BASE_SALARY_VALUE_UPPERCASE,
      filterable: true,
      width: NumberConstant.TEN
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public sort: SortDescriptor[] = [{
    field: EmployeeConstant.REGISTRATION_NUMBER,
    dir: SharedConstant.DESC
  }];
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.initGridDataSource();
  }

  constructor(public employeeService: EmployeeService,
    public leaveBalanceRemainingService: LeaveBalanceRemainingService,
    public router: Router,
    public fb: FormBuilder,
    public swalWarrings: SwalWarring,
    public translate: TranslateService,
    public dataTransferShowSpinnerService: DataTransferShowSpinnerService,
    public progressService: ProgressService,
    public authService: AuthService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_EMPLOYEE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_EMPLOYEE);
    this.hasShowEmployeePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_EMPLOYEE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_EMPLOYEE);
    this.hasViewOrganizationChartPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VIEW_ORGANIZATIONCHART);
    this.hasImportPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.IMPORT_EMPLOYEE);
    this.hasShowResignedEmployeePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_RESIGNED_EMPLOYEE);
    this.hasListViewResignedEmployeesPermission =
      this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.LIST_RESIGNED_EMPLOYEES);
    this.hasCalculatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CALCULATE_LEAVE_REMAINING_BALANCE);
    this.progression = new ProgressBar();
    this.progressService.initLeaveBalanceRemainingProgressHubConnection();
    this.progressService.registerOnLeaveBalanceRemainingProgressBarProgressionEvent();
    this.progressService.leaveBalanceRemainingProgressionSubject.subscribe((data: ProgressBar) => {
      if (data != null) {
        this.progression = data;
        this.showProgress = this.progression != null ? true : false;
        if (this.progression.State === ProgressBarState.Completed) {
          this.initGridDataSource();
          setTimeout(() => {
            this.showProgress = false;
          }, 500);
          this.progressService.destroyLeaveBalanceRemainingProgressHubConnection();
        }
      }
    });

    this.setEmployeeStates();
    this.dataImported = false;
    this.choosenFilter = this.employeeState.Active;
    this.initGridDataSource();
    this.createImportEmployeeFormGroup();
  }


  setEmployeeStates() {
    this.employeeStates.push( {text : this.translate.instant(EmployeeConstant.ACTIVE_EMPLOYEES), value : this.employeeState.Active});
    if (this.hasListViewResignedEmployeesPermission) {
      this.employeeStates.push( {text : this.translate.instant(EmployeeConstant.RESIGNING_EMPLOYEES),
        value : this.employeeState.Resigning});
      this.employeeStates.push( {text : this.translate.instant(EmployeeConstant.RESIGNED_EMPLOYEES), value : this.employeeState.Resigned});
      this.employeeStates.push({ text: this.translate.instant(EmployeeConstant.ALL_EMPLOYEES), value: this.employeeState.AllEmployees });
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  public createImportEmployeeFormGroup() {
    this.formGroup = this.fb.group({
      Matricule: [''],
      FirstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      Cin: [''],
      SocialSecurityNumber: ['', Validators.compose([Validators.minLength(NumberConstant.ELEVEN),
      Validators.maxLength(NumberConstant.ELEVEN), Validators.pattern('^[0-9]{10}$')])],
      Sex: new FormControl('', [Validators.required]),
      ChildrenNumber: ['', Validators.compose([Validators.min(NumberConstant.ZERO),
      Validators.max(NumberConstant.NINETY_NINE), Validators.pattern('^[0-9]*')])],
      PersonalPhone: [''],
      ProfessionalPhone: [''],
      BirthDate: [''],
      BirthPlace: [''],
      AddressLine1: [''],
      AddressLine2: [''],
      AddressLine3: [''],
      AddressLine4: [''],
      AddressLine5: [''],
      ZipCode: [''],
      HiringDate: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Facebook: [''],
      Linkedin: [''],
      Echelon: [''],
      HomeLoan: [''],
      ChildrenNoScholar: ['', Validators.compose([Validators.min(NumberConstant.ZERO),
      Validators.max(NumberConstant.NINETY_NINE), Validators.pattern('^[0-9]*')])],
      ChildrenDisabled: ['', Validators.compose([Validators.min(NumberConstant.ZERO),
      Validators.max(NumberConstant.NINETY_NINE), Validators.pattern('^[0-9]*')])],
      IsForeign: new FormControl('', [Validators.required]),
      DependentParent: ['', Validators.compose([Validators.min(NumberConstant.ZERO),
      Validators.max(NumberConstant.TWO), Validators.pattern('^[0-9]*')])],
      Rib: ['', Validators.compose([Validators.maxLength(NumberConstant.FIFTEEN), Validators.pattern('^[0-9]{1,20}$')])],
      IdBank: [''],
      Category: [''],
      FamilyLeader: [''],
      IdCitizenship: new FormControl('', [Validators.required]),
      Contract: this.fb.array([])
    });
    this.formGroupContract = this.fb.group({
      StartDate: ['', Validators.required],
      EndDate: [''],
      WorkingTime: ['', Validators.compose([Validators.min(NumberConstant.ZERO),
      Validators.max(NumberConstant.SIXTY), Validators.pattern('^[0-9]*')])],
      IdSalaryStructure: ['', Validators.required],
      IdCnss: ['', Validators.required],
      IdContractType: ['', Validators.required],
      BaseSalaryValue: ['', Validators.required]
    });
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal(EmployeeConstant.DELETE_EMPLOYEE).then((result) => {
      if (result.value) {
        this.subscriptions.push(this.employeeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Grid data source initiation, and filter
   * */
  public initGridDataSource(predicate?: PredicateFormat, isFromSearch?: boolean) {
    if (isFromSearch) {
      this.gridSettings.state.skip = NumberConstant.ZERO;
    }
    this.predicate = predicate ? predicate : this.predicate;
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [new OrderBy(EmployeeConstant.ID, OrderByDirection.desc)]);
    if (this.choosenFilter) {
      if (!this.predicate.Filter) {
        this.predicate.Filter = new Array<Filter>();
        this.predicate.Filter.push(new Filter(EmployeeConstant.WITH_TEAM_MEMBERS, Operation.eq, true));
      }
      this.predicate.Filter = this.predicate.Filter.filter(item => item.prop !== EmployeeConstant.STATUS);
      if (this.choosenFilter !== this.employeeState.AllEmployees) {
        this.predicate.Filter.push(new Filter(EmployeeConstant.STATUS, Operation.eq, this.choosenFilter, false, true));
      }
    } else {
      this.predicate.Filter = this.predicate.Filter.filter(item => item.prop !== EmployeeConstant.STATUS);
    }
    this.subscriptions.push(this.employeeService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe((data) => {
        this.gridSettings.gridData = data;
        this.prepareList(this.gridSettings.gridData);
      }));
  }

  /**
   * edit click row event
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(EmployeeConstant.EMPLOYEE_EDIT_URL.concat(dataItem.Id), {queryParams: dataItem, skipLocationChange: true});
  }

  public goToProfil(dataItem) {
    this.router.navigateByUrl(EmployeeConstant.EMPLOYEE_PROFIL_URL.concat(dataItem.Id),
      { queryParams: dataItem, skipLocationChange: true });
  }

  /**
   * incomming excel file
   * @param event
   */
  public incomingFile(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.importFileEmployes = FileInfo.generateFileInfoFromFile(file, reader);
        this.subscriptions.push(this.employeeService.uploadEmployee(this.importFileEmployes).subscribe((res: Array<Employee>) => {
          this.dataImported = true;
          this.importData = res;
        }));
      };
    }
  }
  public downLoadFile(event) {
    const link = document.createElement('a');
    link.download = EmployeeConstant.NAME_EXCEL_MODEL_EMPLOYEE;
    link.href = EmployeeConstant.IMPORT_EXCEL_MODEL_EMPLOYEE;
    link.click();
  }

  /**
   * on Close Popup Import
   * */
  onClosePopupImport() {
    this.dataImported = false;
  }

  /**
   * save Imported Date
   * @param myData
   */
  public saveImportedData(myData: Array<Employee>) {
    if (myData.length !== NumberConstant.ZERO || !isNullOrUndefined(myData)) {
      this.subscriptions.push(this.employeeService.saveImportedData(myData).subscribe(res => {
        this.dataImported = false;
        this.initGridDataSource();
      }));
    }
  }

  public onCheckAllEmployees(state?: number) {
    this.choosenFilter = state ? state : undefined;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.gridSettings.state.take = NumberConstant.TWENTY;
    this.initGridDataSource();
  }

  public receiveData(event: any) {
    this.initGridDataSource(Object.assign({}, null, event.predicate), true);
  }

  // Synchronize employees hierarchical level
  public synchronizeEmployees() {
    this.subscriptions.push(this.employeeService.synchronizeEmployees().subscribe(result => {
      if (result) {
        const message = this.translate.instant(UserConstant.SUCCESSFUL_SYNCHRONIZATION);
        swal.fire({
          icon: SharedConstant.SUCCESS,
          html: message,
          confirmButtonColor: SharedConstant.STARK_DEFAULT_COLOR
        });
      }
      this.gridSettings.state.skip = NumberConstant.ZERO;
      this.initGridDataSource();
    }));
  }
  /**
   * get pictures
   */
  public prepareList(result) {
    // get first picture
    if (result) {
      const data = result.data;
      this.loadTiersPicture(data);
      data.forEach(employee => {
        employee.image = MediaConstant.PLACEHOLDER_PICTURE;
      });
    }
    this.gridSettings.gridData = result;
  }

  private loadTiersPicture(employeeList: Employee[]) {
    const employeePicturesUrls = [];
    employeeList.forEach((employee: Employee) => {
      employeePicturesUrls.push(employee.Picture);
    });
    if (employeePicturesUrls.length > NumberConstant.ZERO) {
      this.employeeService.getPictures(employeePicturesUrls, false).subscribe(employeePictures => {
        this.fillEmployeePictures(employeeList, employeePictures);
      });
    }
  }
  private fillEmployeePictures(employeeList, employeePictures) {
    employeeList.map((employee: Employee) => {
      if (employee.Picture) {
        const dataPicture = employeePictures.objectData.find(value => value.FulPath === employee.Picture);
        if (dataPicture) {
          employee.image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }


  changeViewToCard() {
    this.isCardView = true;
  }

  changeViewToList() {
    this.isCardView = false;
  }

  paginate(event) {
    this.gridSettings.state.skip = event.skip;
    this.gridSettings.state.take = event.take;
    this.initGridDataSource();
  }
  public async calculateLeaveBalanceRemaining(): Promise<void> {
    this.progression.Progression = NumberConstant.ZERO;
    this.showProgress = true;
    this.dataTransferShowSpinnerService.setShowSpinnerValue(this.showProgress);
    this.leaveBalanceRemainingFilter = new LeaveBalanceRemainingFilter();
    this.leaveBalanceRemainingFilter.EmployeesId = [];
    await this.leaveBalanceRemainingService.calculateLeaveBalanceRemaining(this.leaveBalanceRemainingFilter).toPromise();
    this.initGridDataSource();
    this.showProgress = false;
  }
}
