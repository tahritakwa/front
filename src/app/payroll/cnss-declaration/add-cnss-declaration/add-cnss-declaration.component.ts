import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CnssDeclarationService } from '../../services/cnss-declaration/cnss-declaration.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { CnssDeclarationConstant } from '../../../constant/payroll/cnss-declaration.constant';
import { CnssDeclaration } from '../../../models/payroll/cnss-declaration.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../services/session/session.service';
import { SessionConstant } from '../../../constant/payroll/session.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { process, State } from '@progress/kendo-data-query';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Session } from '../../../models/payroll/session.model';
import { FileService } from '../../../shared/services/file/file-service.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { CnssDeclarationSession } from '../../../models/payroll/cnss-declaration-session.model';
import { PayrollSessionState } from '../../../models/enumerators/session-state.enum';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { EnumValues } from 'enum-values';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-add-cnss-declaration',
  templateUrl: './add-cnss-declaration.component.html',
  styleUrls: ['./add-cnss-declaration.component.scss']
})
export class AddCnssDeclarationComponent implements OnInit, OnDestroy {
  public cnssDeclarationForm: FormGroup;
  public isUpdateMode = false;
  public isModal: boolean;
  public showErrorMessage: boolean;
  public first = true;
  public cnssDeclarationToUpdate: CnssDeclaration;
  sessionList: Session[];
  State = true;
  /**
   * Show cnss declaration unique message or not
   */
  public showDeclarationUniqueErrorMessage = false;
  datePipe = new DatePipe('en-US');
  /**
   * pager settings
   */
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public payrollSessionState = PayrollSessionState;
  stateSearchDropdownFormGroup: FormGroup;
  selectedState = false;
  public stateEnum = EnumValues.getNamesAndValues(PayrollSessionState);
  validatedState: string;
  public dependOnTimeSheetFilter: Array<any> = [
    { id: true, name: this.translate.instant(SessionConstant.YES) },
    { id: false, name: this.translate.instant(SessionConstant.NO) }
  ];
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
      filterable: false,
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
  /**
   * Grid state
   */
  public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  // The list of selected sessions
  public sessionIdsSelected: number[] = [];
  public AllSessionsIds: number[] = [];
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  predicate: PredicateFormat;
  /**
   * permissions
   */
  public hasPrintPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasShowPermission: boolean;
  public hasAddPermission: boolean;
  public hasPrintSummuryPermission: boolean;
  public hasPrintTeledeclarationPermission: boolean;
  public hasRegeneratePermission: boolean;
  public hasClosePermission: boolean;
  private subscriptions: Subscription[] = [];
  /**
   * IdCnssDeclaration in update mode
   */
  private idCnssDeclaration: number;

  constructor(private fb: FormBuilder, public cnssDeclarationService: CnssDeclarationService, private authService: AuthService,
    private sessionService: SessionService, private validationService: ValidationService, private translate: TranslateService,
    private activatedRoute: ActivatedRoute, private fileServiceService: FileService,
    private router: Router, private growlService: GrowlService, private swalWarrings: SwalWarring) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idCnssDeclaration = params[SharedConstant.ID_LOWERCASE] || 0;
    }));
  }

  /**
   * get Code formcontrol
   */
  get Code(): FormControl {
    return this.cnssDeclarationForm.get(SharedConstant.CODE) as FormControl;
  }

  /**
   * get Title formcontrol
   */
  get Title(): FormControl {
    return this.cnssDeclarationForm.get(CnssDeclarationConstant.TITLE) as FormControl;
  }

  /**
   * get Year formcontrol
   */
  get Year(): FormControl {
    return this.cnssDeclarationForm.get(CnssDeclarationConstant.YEAR) as FormControl;
  }

  /**
   * get Trimester formcontrol
   */
  get Trimester(): FormControl {
    return this.cnssDeclarationForm.get(CnssDeclarationConstant.TRIMESTER) as FormControl;
  }

  /**
   * get IdCnss formcontrol
   */
  get IdCnss(): FormControl {
    return this.cnssDeclarationForm.get(CnssDeclarationConstant.ID_CNSS) as FormControl;
  }

  /**
   * get Id formcontrol
   */
  get Id(): FormControl {
    return this.cnssDeclarationForm.get(SharedConstant.ID) as FormControl;
  }

  get FilterState(): FormControl {
    return this.stateSearchDropdownFormGroup.get(SharedConstant.STATE) as FormControl;
  }

  ngOnInit() {
    this.hasPrintPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.PRINT_CNSSDECLARATION);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_CNSSDECLARATION);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_CNSSDECLARATION);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_CNSSDECLARATION);
    this.hasPrintSummuryPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.PRINT_CNSS_DECLARATION_SUMMURY);
    this.hasPrintTeledeclarationPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.PRINT_TELE_DECLARATION);
    this.hasRegeneratePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.REGENERATE_CNSS_DECLARATION);
    this.hasClosePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CLOSE_CNSSDECLARATION);
    this.sessionList = new Array<Session>();
    this.createStatusSearchDropdownForm();
    this.preparePredicate();
    this.isUpdateMode = this.idCnssDeclaration > NumberConstant.ZERO;
    this.createCnssDeclarationForm();
    if (this.isUpdateMode) {
      this.subscriptions.push(this.cnssDeclarationService.getById(this.idCnssDeclaration).subscribe(data => {
        this.cnssDeclarationToUpdate = data;
        this.patchValue();
        this.initGridDataSource();
        if (this.cnssDeclarationToUpdate) {
          this.State = this.cnssDeclarationToUpdate.State;
          if (!this.cnssDeclarationToUpdate.State) {
            this.cnssDeclarationForm.disable();
          }
        }
      }));
    } else {
      this.Year.setValue(new Date());
      this.initGridDataSource();
    }
  }

  createCnssDeclarationForm(): void {
    this.cnssDeclarationForm = this.fb.group({
      Id: [0],
      Code: [''],
      Title: [{ value: '', disabled: this.isUpdateMode && !this.hasUpdatePermission }, Validators.required],
      Trimester: [{ value: '', disabled: this.isUpdateMode && !this.hasUpdatePermission }, Validators.required],
      Year: [{ value: '', disabled: this.isUpdateMode && !this.hasUpdatePermission }, Validators.required],
      IdCnss: [{ value: '', disabled: this.isUpdateMode && !this.hasUpdatePermission }, Validators.required],
      State: [true]
    });
  }

  save(): void {
    if (this.cnssDeclarationForm.valid && this.sessionList.length > NumberConstant.ZERO
      && this.showDeclarationUniqueErrorMessage === false && this.sessionIdsSelected.length > NumberConstant.ZERO) {
      const data = Object.assign({}, this.cnssDeclarationToUpdate, this.cnssDeclarationForm.value);
      if (this.Year.disabled) {
        data.Year = this.cnssDeclarationToUpdate.Year;
      }
      else {
        data.Year = (data.Year).getFullYear();
      }
      data.CnssDeclarationSession = new Array<CnssDeclarationSession>();
      this.sessionIdsSelected.forEach(element => {
        data.CnssDeclarationSession.push({ IdSession: element, idCnssDeclaration: 0 });
      });
      this.subscriptions.push(this.cnssDeclarationService.generateDeclaration(data).subscribe(result => {
        if (this.hasShowPermission) {
          this.router.navigateByUrl(CnssDeclarationConstant.CNSS_DECLARATION_EDIT_URL.concat(result.Id.toString()));
        }
        else {
          this.router.navigateByUrl(CnssDeclarationConstant.CNSS_DECLARATION_LIST_URL);
        }
      }));
    } else {
      this.validationService.validateAllFormFields(this.cnssDeclarationForm);
      if (this.sessionList.length > NumberConstant.ZERO && this.sessionIdsSelected.length > NumberConstant.ZERO) {
        this.showErrorMessage = false;
      } else {
        this.showErrorMessage = true;
      }
    }
  }

  /**
   * Reload grid data when data is changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.predicate.Filter = new Array<Filter>();
    //let filters = state.filter.filters as FilterDescriptor[];
    // if(filters.length !== NumberConstant.ZERO){
    //   filters.forEach(element => {
    //     if(element.field.toString() === SessionConstant.TITLE){
    //       this.predicate.Filter.push(new Filter(SessionConstant.TITLE, Operation.contains, element.value));
    //     } else if (element.field.toString() === SessionConstant.MONTH){
    //       const firstDayOfMonth = new Date(element.value.getFullYear(), element.value.getMonth(), 1);
    //       this.predicate.Filter.push(new Filter(SessionConstant.MONTH, Operation.gte, firstDayOfMonth));
    //     } else if(element.field.toString() === SessionConstant.DAYS_OF_WORK){
    //       this.predicate.Filter.push(new Filter(SessionConstant.DAYS_OF_WORK, Operation.gte, element.value));
    //     }else if(element.field.toString() === SessionConstant.CODE){
    //       this.predicate.Filter.push(new Filter(SessionConstant.CODE, Operation.contains, element.value));
    //     }
    //   });
    // }
    // this.stateFilter();
    // if(state.filter.filters.length !== NumberConstant.ZERO){
    //   this.AllSessionsIds = this.gridSettings.gridData.data.map(x => x.Id);
    // }
    //this.initGridDataSource();
    this.gridSettings.gridData = process(this.sessionList, state);
  }

  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
  }

  /**
   * check the state of the select all checkbox in the kendo grid
   */
  public onSelectedKeysChange(e) {
    this.gridSettings.gridData.data.forEach(element => {
      this.sessionIdsSelected.forEach(item => {
        if (element.Id === item) {
          if (element.State !== PayrollSessionState.Closed) {
            this.sessionIdsSelected.splice(this.sessionIdsSelected.indexOf(item), NumberConstant.ONE);
            this.growlService.warningNotification(this.translate.instant(SessionConstant.SESSION_NOT_CLOSED));
          }
        }
      });
    });
    const selectionLength = this.sessionIdsSelected.length;
    selectionLength === NumberConstant.ZERO ? this.showErrorMessage = true : this.showErrorMessage = false;
    if (selectionLength === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (selectionLength > NumberConstant.ZERO && selectionLength < this.AllSessionsIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    }
  }

  /**
   * this method aims to select all elements of the grid or deselect it
   */
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
      this.sessionIdsSelected = Object.assign([], this.AllSessionsIds);
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      this.sessionIdsSelected = [];
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    }
  }

  /**
   * Receive the value send by Trimester type dropdown component
   * @param $event
   */
  receivedMessage($event) {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  /**
   * For print the current transfer order in modal
   * @param id
   */
  public onPrintDeclarationClick(): void {
    const params = {
      idCnssDeclaration: this.idCnssDeclaration
    };
    const documentName = this.translate.instant(CnssDeclarationConstant.CNSS_DECLARATION_UPPERCASE)
      .concat(SharedConstant.UNDERSCORE).concat(this.Title.value)
      .concat(SharedConstant.UNDERSCORE).concat(CnssDeclarationConstant.TRIMESTER)
      .concat(SharedConstant.UNDERSCORE).concat(this.Trimester.value)
      .concat(SharedConstant.UNDERSCORE).concat(this.datePipe.transform(new Date(this.Year.value), 'yyyy'));
    const dataToSend = {
      'Id': 1,
      'reportName': CnssDeclarationConstant.CNSS_DECLARATION_REPORT_NAME,
      'documentName': documentName,
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'reportType': 'pdf',
      'reportparameters': params
    };
    this.subscriptions.push(this.cnssDeclarationService.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      }));
  }

  /**
   * For print the current transfer order in modal
   * @param id
   */
  public onPrintSummaryClick(): void {
    const params = {
      idCnssDeclaration: this.idCnssDeclaration
    };
    const documentName = this.translate.instant(CnssDeclarationConstant.CNSS_SUMMARY_UPPERCASE)
      .concat(SharedConstant.UNDERSCORE).concat(this.Title.value)
      .concat(SharedConstant.UNDERSCORE).concat(CnssDeclarationConstant.TRIMESTER)
      .concat(SharedConstant.UNDERSCORE).concat(this.Trimester.value)
      .concat(SharedConstant.UNDERSCORE).concat(this.datePipe.transform(new Date(this.Year.value), 'yyyy'));
    const dataToSend = {
      'Id': 1,
      'reportName': CnssDeclarationConstant.CNSS_SUMMARY_REPORT_NAME,
      'documentName': documentName,
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'reportType': 'pdf',
      'reportparameters': params
    };
    this.subscriptions.push(this.cnssDeclarationService.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      }));
  }

  /**
   * close the cnss declaration
   */

  public closeDeclarationClick(): void {
    this.swalWarrings.CreateSwal(CnssDeclarationConstant.CLOSE_CNSS_DECLARATION_MESSAGE, SharedConstant.WARNING,
      SharedConstant.OKAY, SharedConstant.CANCEL).then((result) => {
        if (result.value) {
          this.cnssDeclarationToUpdate.State = false;
          this.subscriptions.push(this.cnssDeclarationService.closeCnssDeclaration(this.cnssDeclarationToUpdate).subscribe(() => {
            this.router.navigate([CnssDeclarationConstant.CNSS_DECLARATION_LIST_URL]);
          }));
        }
      });
  }

  /**
   * Get tele declaration
   */
  public getTeleDeclaration() {
    this.subscriptions.push(this.cnssDeclarationService.GetTeleDeclaration(this.idCnssDeclaration).subscribe(data => {
      this.fileServiceService.downLoadFile(data);
    }));
  }

  activateFilter(state: number) {
    this.selectedState = true;
    this.stateEnum.forEach(element => {
      if (element.value === state) {
        this.validatedState = element.name;
      }
    });
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.dataStateChange(this.gridSettings.state);
  }

  stateFilter() {
    if (this.FilterState.value >= NumberConstant.ZERO && this.FilterState.value !== '') {
      this.predicate.Filter.push(new Filter(CnssDeclarationConstant.STATE, Operation.eq,
        this.FilterState.value));
    } else {
      this.selectedState = false;
    }
  }

  onValueChange(selectedState) {
    if (selectedState !== undefined) {
      this.predicate.Filter = this.predicate.Filter.filter(element => element.prop !== SessionConstant.DEPEND_ON_TIMESHEET);
      this.predicate.Filter.push(new Filter(SessionConstant.DEPEND_ON_TIMESHEET, Operation.eq, selectedState));
      this.initGridDataSource();
    }
  }

  handleFilter(value: string): void {
    this.predicate.Filter = this.predicate.Filter.filter(element => element.prop !== SessionConstant.DEPEND_ON_TIMESHEET);
    this.initGridDataSource();
  }

  translateToday() {
    const todayElement = document.getElementsByClassName(SharedConstant.TODAY_CLASS)[NumberConstant.ZERO];
    if (todayElement) {
      todayElement.innerHTML = this.translate.instant(SharedConstant.TODAY);
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * Init grid with data from the datasource
   */
  private initGridDataSource() {
    if ((this.Trimester.valid || this.Trimester.disabled) && (this.Year.valid || this.Year.disabled)) {
      const year = new Date(this.Year.value).getFullYear();
      const month = NumberConstant.THREE * this.Trimester.value - NumberConstant.TWO;
      const date = new Date(year, month - NumberConstant.ONE, NumberConstant.SHIFT_FIRST_DATE);
      this.subscriptions.push(this.sessionService.getSessionOfTrimester(this.predicate, date).subscribe(result => {
        this.sessionList = result;
        if (this.sessionList.length <= NumberConstant.ZERO && !this.first) {
          this.showErrorMessage = true;
        } else {
          this.first = false;
          this.showErrorMessage = false;
        }
        const closedSession = this.sessionList.filter(x => x.State === PayrollSessionState.Closed);
        if (closedSession.length > NumberConstant.ZERO) {
          this.AllSessionsIds = closedSession.map(x => x.Id);
        }
        if (this.isUpdateMode) {
          this.sessionIdsSelected = this.cnssDeclarationToUpdate.CnssDeclarationSession.map(x => x.IdSession);
          this.selectAllState = this.sessionIdsSelected.length === this.AllSessionsIds.length ?
            SharedConstant.CHECKED as SelectAllCheckboxState : SharedConstant.INDETERMINATE as SelectAllCheckboxState;
        }
        this.gridSettings.gridData = result;
        this.gridSettings.gridData.data = result.slice(this.gridSettings.state.skip, this.gridSettings.state.take);
        this.gridSettings.gridData.total = result.length;
      }));
    } else if (!this.first) {
      this.validationService.validateAllFormFields(this.cnssDeclarationForm);
      this.showErrorMessage = true;
    }
  }

  private patchValue() {
    this.Year.patchValue(new Date(this.cnssDeclarationToUpdate.Year, NumberConstant.ONE, NumberConstant.SHIFT_FIRST_DATE));
    this.Code.patchValue(this.cnssDeclarationToUpdate.Code);
    this.Title.patchValue(this.cnssDeclarationToUpdate.Title);
    this.Trimester.patchValue(this.cnssDeclarationToUpdate.Trimester);
    this.IdCnss.patchValue(this.cnssDeclarationToUpdate.IdCnss);
    this.Id.patchValue(this.cnssDeclarationToUpdate.Id);
  }

  private createStatusSearchDropdownForm(): void {
    this.stateSearchDropdownFormGroup = this.fb.group({
      State: ''
    });
  }
}
