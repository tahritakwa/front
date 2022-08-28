import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GridDataResult, PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { FilterDescriptor, State } from '@progress/kendo-data-query';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { BonusConstant } from '../../../constant/payroll/bonus.constant';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { SessionConstant } from '../../../constant/payroll/session.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Attendance } from '../../../models/payroll/attendance.model';
import { Bonus } from '../../../models/payroll/bonus.model';
import { SessionBonus } from '../../../models/payroll/session-bonus.model';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { BonusService } from '../../services/bonus/bonus.service';
import { ExchangeBonusDataService } from '../../services/exchange-bonus-data/exchange-bonus-data.service';
import { SessionBonusService } from '../../services/session-bonus/session-bonus.service';
import { SessionService } from '../../services/session/session.service';
import { VariableBonusesComponent } from '../../session/variable-bonuses/variable-bonuses.component';
import { VariableBonusesComboboxComponent } from '../variable-bonuses-combobox/variable-bonuses-combobox.component';
const LOGIC_AND = 'and';

@Component({
  selector: 'app-variable-bonuses-section',
  templateUrl: './variable-bonuses-section.component.html',
  styleUrls: ['./variable-bonuses-section.component.scss']
})
export class VariableBonusesSectionComponent implements OnInit {
  // Form Group
  bonusTypeFormGroup: FormGroup;
  allBonusesValueFormGroup: FormGroup;
  // the reference of the courant child
  viewIndex: any;
  // the session Bonus list
  sessionBonusList: SessionBonus[];
  // the reference of the courant child
  viewReference: any;
  // Session Id
  sessionId: number;
  // the sender of the data to the parent
  @Output() sendData = new EventEmitter<any>();
  // the selected bonus sended from the child
  bonusSelected: Bonus;
  // The name of section depend of the state of bonus selection
  BonusIsSelected = false;
  // predicate to prepare call server
  predicate: PredicateFormat;
  // the value of the input type field in the Header of the grid
  bonusValue: number;
  // Boolean Attributs to show data
  public showDetails = true;
  public showGrid = false;
  // List Of Attendances
  public attendancesList: Attendance[] = [];
  // variable to execute or not onSelectionChange method
  public executeSelection = true;
  public sessionBonusToUpdate: SessionBonus;
  /**
   * Corresponding session is closed or not
   */
  @Input()
  public isClosed: boolean;
  /* Grid Attributs*/
  //
  public SessionBonusesList: SessionBonus[] = [];
  // input of the grid : observable type
  public view: Observable<GridDataResult>;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  // Grid state
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: LOGIC_AND,
      filters: []
    }
  };
  // Grid columns Config
  public columnsConfig: ColumnSettings[] = [
    {
      field: BonusConstant.ID_SESSION,
      title: BonusConstant.ID_SESSION,
      filterable: true
    },
    {
      field: BonusConstant.REGISTRATION_NUMBER,
      title: EmployeeConstant.REGISTRATION_NUMBER_UPPERCASE,
      filterable: true
    },

    {
      field: BonusConstant.FULL_NAME,
      title: EmployeeConstant.EMPLOYEE,
      filterable: true
    },
    {
      field: BonusConstant.CONTRACT_CODE,
      title: ContractConstant.CONTRACT_TYPE_UPPERCASE,
      filterable: true
    },
    {
      field: BonusConstant.VALUE,
      title: BonusConstant.VALUE_TITLE,
      filterable: true
    },
  ];
  // Grid Setting (Grid state + Grid columns config)
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  /* Selection Setting*/
  // array of the contracts selected in the grid
  public contractListSelected: number[] = [];
  public sessionBonusesEdited: SessionBonus[] = [];
  // state of selection
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  // array of all the contracts
  public AllContractsArray: number[] = [];
  // Comobox View
  @ViewChild(VariableBonusesComboboxComponent) variableBonusesComboboxComponent;
  isCellValid = true;
  // the sender of the data to the parent
  @Output() sendCellValidation = new EventEmitter<any>();
  // the sender of the bonus selected status to the parent
  @Output() bonusIsSelected = new EventEmitter<any>();
  /*
   * permissions
   */
  public hasUpdatePayrollSessionPermission: boolean;
  /**
   * Constructor
   */
  constructor(private formBuilder: FormBuilder, public variableBonusesComponent: VariableBonusesComponent,
    private exchangeBonusDataService: ExchangeBonusDataService, public validationService: ValidationService,
    public sessionBonusService: SessionBonusService, private sessionService: SessionService, public bonusService: BonusService,
    private growlService: GrowlService, private translate: TranslateService, public authService: AuthService) {
  }

  get Value(): FormControl {
    return this.allBonusesValueFormGroup.get(SharedConstant.VALUE) as FormControl;
  }

  get IdBonusType(): FormControl {
    return this.bonusTypeFormGroup.get(BonusConstant.ID_BONUS_TYPE) as FormControl;
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.hasUpdatePayrollSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_SESSION);
    this.createBonusTypeForm();
    this.createAllBonusValuesForm();
    this.bonusValue = NumberConstant.ZERO;
    this.bonusSelected = new Bonus();
    // call exchange service to retreive data
    const index = this.exchangeBonusDataService.getIndex();
    const sessionBonusSection = Object.assign({}, this.exchangeBonusDataService.getBonusSessionfromPosition(index));
    this.exchangeBonusDataService.incrementIndex();
    const bonusId = +sessionBonusSection.BonusId;
    this.sessionId = sessionBonusSection.sessionId;
    this.viewIndex = sessionBonusSection.index;
    this.sessionBonusList = Object.keys(sessionBonusSection.sessionBonusList).map(i => sessionBonusSection.sessionBonusList[i]);
    this.viewReference = sessionBonusSection.viewReference;
    this.preparePredicate();
    if (this.sessionBonusList.length > NumberConstant.ZERO) {
      // it is an update process
      // prepare selected list from sessionBonus sended from parent
      this.sessionBonusList.forEach(sessionBonus => {
        this.predicate.values = [];
        this.predicate.values.push(sessionBonus.IdBonus);
        this.sessionService.getListOfBonusesForSession(this.predicate, this.sessionId).subscribe(data => {
          this.contractListSelected = [];
          data.SessionBonus.forEach(element => {
            if (element.IdSelected !== NumberConstant.ZERO) {
              this.contractListSelected.push(element.IdContract);
            }
          });
          this.bonusSelected = sessionBonus.IdBonusNavigation;
          this.BonusIsSelected = true;
          this.gridSettings.gridData = data.SessionBonus;
          this.attendancesList = data.SessionBonus;
          this.view = Observable.of(this.gridSettings.gridData);
          this.gridSettings.gridData.data = this.attendancesList.slice(NumberConstant.ZERO, this.gridSettings.state.take);
          this.gridSettings.gridData.total = data.Total;
          this.setSelectionState();
        });
      });
      this.bonusTypeFormGroup.controls[BonusConstant.ID_BONUS_TYPE].setValue(bonusId);
      // If bonusId != 0  => update mode so we had to recover the selected bonus information
      // this.bonusSelected = this.variableBonusesComboboxComponent.getSelectedBonus();
      this.bonusSelected.Id = bonusId;
      // Initialise the settings of the child created in the parent component app-variable-bonuses
      this.onChangeSendSessionBonusesToTheParent(this.sessionBonusList);
    } else {
      // Initialise the settings of the child created in the parent component app-variable-bonuses
      const data = [];
      this.onChangeSendSessionBonusesToTheParent(data);
    }
  }

  /**
   * this method will be called when changing bonus type
   */

  onTypeChangeEventClick(data) {
    // in case we update Bonus Type
    if (this.contractListSelected.length != NumberConstant.ZERO) {
      this.sessionService.updateBonusType(this.sessionId, data.Id, this.bonusSelected.Id).subscribe();
    } else {
      this.sessionService.checkBonusExistanceInSession(this.sessionId, data.Id).subscribe(res => {
        if (!res.model.exist) {
          this.BonusIsSelected = true;
          this.bonusSelected = data;
          this.getAttendancesFromServer(data.Id);

        }
      });
    }
  }

  /**
   * this method will be invoked if the value of the input of the kendo data grid has been changed to change
   * all the value of data grid
   */
  assignDataToTheGrid() {
    if (this.allBonusesValueFormGroup.valid) {
      this.bonusValue = this.Value.value;
      if (this.bonusValue === null || this.bonusValue === undefined) {
        this.bonusValue = NumberConstant.ZERO;
      }
      this.gridSettings.gridData.data.forEach(
        element => {
          element.Value = this.bonusValue;
        });
      this.view = Observable.of(this.gridSettings.gridData);
      let idBonus = this.IdBonusType.value;
      this.sessionService.updateAllBonusValues(this.sessionId, idBonus, this.bonusValue).subscribe();
      // inform the parent about changes
      const data = this.prepareSessionBonusFromItemsSelected();
      this.onChangeSendSessionBonusesToTheParent(data);
    } else {
      this.validationService.validateAllFormFields(this.allBonusesValueFormGroup);
    }
  }

  /**
   * Prepare GridData from server Data
   */
  public prepareDataToBindGridFromServerData(data) {
    this.gridSettings.gridData = data;
    // prepare the list of sessions bonus from attendances
    this.gridSettings.gridData.data = this.prepareBonusObservablesFromttendances(this.gridSettings.gridData.data);
    this.view = Observable.of(this.gridSettings.gridData);
  }

  /**
   *  Prapare Predicate
   */
  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = this.gridSettings.state.skip / this.gridSettings.state.take + NumberConstant.ONE;
  }

  /**
   * this method will be called to get list of bonuses from server
   */

  public getAttendancesFromServer(idBonus) {
    let values = [];
    values.push(idBonus);
    this.predicate.values = values;
    this.sessionService.getListOfBonusesForSession(this.predicate, this.sessionId).subscribe(data => {
      this.contractListSelected = [];
      data.SessionBonus.forEach(element => {
        if (element.IdSelected !== NumberConstant.ZERO) {
          this.contractListSelected.push(element.IdContract);
        }
      });
      this.gridSettings.gridData = data.SessionBonus;
      this.attendancesList = data.SessionBonus;
      this.view = Observable.of(this.gridSettings.gridData);
      this.gridSettings.gridData.data = this.attendancesList.slice(NumberConstant.ZERO, this.gridSettings.state.take);
      this.gridSettings.gridData.total = data.Total;
      this.setSelectionState();
    });
  }

  /**
   * transform array to observables
   */
  public prepareBonusObservablesFromttendances(data: Attendance[]): SessionBonus[] {
    const SessionBonuses: SessionBonus[] = [];
    data.forEach(
      element => {
        let sessionBonus = this.sessionBonusesEdited.filter(x => x.IdContract === element.IdContract)[NumberConstant.ZERO];
        if (sessionBonus === undefined) {
          sessionBonus = new SessionBonus();
          sessionBonus.IdSession = element.IdSession;
          sessionBonus.IdContract = element.IdContract;
          sessionBonus.IdContractNavigation = element.IdContractNavigation;
          if (this.bonusValue === undefined) {
            sessionBonus.Value = 0;
          } else {
            sessionBonus.Value = this.bonusValue;
          }
        }
        SessionBonuses.push(sessionBonus);
      });
    return SessionBonuses;
  }

  /**
   * transform array to observables
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = this.gridSettings.state.skip / this.gridSettings.state.take + NumberConstant.ONE;
    let idBonus = this.IdBonusType.value;
    let filters = state.filter.filters as FilterDescriptor[];
    this.predicate.Filter = new Array<Filter>();
    if (filters.length !== NumberConstant.ZERO) {
      filters.forEach(element => {
        if (element.field.toString() === BonusConstant.REGISTRATION_NUMBER) {
          this.predicate.Filter.push(new Filter(SessionConstant.RESUME_EMPLOYEE_REGISTRATION_NUMBER, Operation.contains, element.value));
        } else if (element.field.toString() === BonusConstant.FULL_NAME) {
          this.predicate.Filter.push(new Filter(SessionConstant.RESUME_EMPLOYEE_EMPLOYEE_FULL_NAME, Operation.contains, element.value));
        } else if (element.field.toString() === BonusConstant.VALUE) {
          this.predicate.Filter.push(new Filter(BonusConstant.VALUE, Operation.gte, element.value));
        }
      });
    }
    this.getAttendancesFromServer(idBonus);

  }

  /**
   * create form if cell of the grid clicked
   */
  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      IdContract: dataItem.IdContract,
      Value: [dataItem.Value,
        [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?(.|,)?(0|[0-9]\d*)?$/), Validators.min(NumberConstant.ZERO)]],
    });
  }

  /**
   * this method is called by clicking on the cells of the grid to prepare the input fields
   */
  public cellClickHandler({sender, rowIndex, column, columnIndex, dataItem, isEdited}) {
      if (this.bonusTypeFormGroup.valid && !this.isClosed && !isEdited && this.isEditableColumn(column.field)) {
      this.isCellValid = false;
      this.sendCellValidation.emit(this.isCellValid);
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    } else {
      this.validationService.validateAllFormFields(this.bonusTypeFormGroup);
    }
  }

  /**
   * this method is called by closing the input field of a cell in the grid
   */
  public cellCloseHandler(args: any) {
    const {formGroup, dataItem} = args;
    if (!formGroup.valid) {
      this.isCellValid = false;
      this.sendCellValidation.emit(this.isCellValid);
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else {
      this.isCellValid = true;
      this.sendCellValidation.emit(this.isCellValid);
      if (formGroup.dirty) {
        // Recovery of data from the formGroup and dataItem
        // test if the contract id of the row edited exists in the list of selected ids
        const exist = this.contractListSelected.indexOf(dataItem.IdContract);
        if (exist < NumberConstant.ZERO) {
          // if the id does not exist so add the id of the row edited to the list
          this.contractListSelected.push(dataItem.IdContract);
        }
        let value = formGroup.controls[BonusConstant.VALUE].value;
        this.sessionService.getListOfBonusesForSession(this.predicate, this.sessionId).subscribe(res => {
          let idSelected = res.SessionBonus.filter(element => element.IdContract === dataItem.IdContract)[NumberConstant.ZERO].IdSelected;
          if (idSelected === NumberConstant.ZERO) {
            this.sessionService.addBonusToContract(dataItem.IdContract, dataItem.IdSession, idSelected, dataItem.IdBonus, value).subscribe(res => {
              this.setSelectionState();
            });

          } else {
            // update bonus value for SessionBonus
            this.sessionBonusService.getById(idSelected).subscribe(data => {
              this.sessionBonusToUpdate = data;
              this.sessionBonusToUpdate.Value = value;
              this.sessionBonusService.save(this.sessionBonusToUpdate, false).subscribe();
            });
          }
        });

        // change the data grid input by the new values
        const index = this.gridSettings.gridData.data.indexOf(dataItem);
        this.gridSettings.gridData.data[index].Value = formGroup.controls[BonusConstant.VALUE].value;
        // add Sessionbonus to sessionBonusesEdited list to save history of changing
        this.sessionBonusesEdited.push(this.gridSettings.gridData.data[index]);
        this.view = Observable.of(this.gridSettings.gridData);
        // send the changes to the parent: VariableBonusComponent
        const data = this.prepareSessionBonusFromItemsSelected();
        this.onChangeSendSessionBonusesToTheParent(data);
      }
    }
  }

  /*
   * this method prepare the data to send it to the parents
   * it returns an array of Session Bonus from the items selected in the data grid
   */
  prepareSessionBonusFromItemsSelected(): SessionBonus[] {
    const result: SessionBonus[] = [];
    this.contractListSelected.forEach(
      element => {
        // the search sessionBonus in the data grid elements
        let sessionBonus = this.gridSettings.gridData.data.filter(x => x.IdContract === element)[NumberConstant.ZERO];
        if (sessionBonus === undefined) {
          // If sessionBonus is undefined
          sessionBonus = this.sessionBonusesEdited.filter(x => x.IdContract === element)[NumberConstant.ZERO];
          if (sessionBonus === undefined) {
            sessionBonus = new SessionBonus();
            sessionBonus.IdContract = element;
            sessionBonus.IdSession = this.sessionId;
            sessionBonus.Value = this.bonusValue;
          }
        }
        sessionBonus.IdBonus = this.bonusSelected.Id;
        result.push(sessionBonus);
      }
    );
    return result;
  }

  /**
   * this method aims to send data to the parent
   */
  onChangeSendSessionBonusesToTheParent(data) {
    this.sendData.emit({'index': this.viewIndex, 'form': this.bonusTypeFormGroup, 'data': data});
  }

  /**
   * this method aims remove the courant child from the parent references
   */
  public RemoveView() {
    if (this.contractListSelected.length !== NumberConstant.ZERO) {
      this.sessionService.deleteBonusFromSession(this.sessionId, this.bonusSelected.Id).subscribe(res => {
        this.variableBonusesComponent.deleteViewFromContainer(this.viewIndex, this.viewReference);
      });
    } else {
      this.variableBonusesComponent.deleteViewFromContainer(this.viewIndex, this.viewReference);
    }
  }

  /**
   * this method is called when selecting one element
   */

  public onSelectionChange(event) {
    if (this.executeSelection) {
      if (this.bonusTypeFormGroup.valid) {
        let idContract;
        let idSelected;
        let value;
        let idBonus = this.IdBonusType.value;
        if (event.deselectedRows.length !== NumberConstant.ZERO) {
          idContract = event.deselectedRows[NumberConstant.ZERO].dataItem.IdContract;
          value = event.deselectedRows[NumberConstant.ZERO].dataItem.Value;
          this.contractListSelected = this.contractListSelected.filter(elt => elt !== idContract);
        }
        if (event.selectedRows.length !== NumberConstant.ZERO) {
          idContract = event.selectedRows[NumberConstant.ZERO].dataItem.IdContract;
          value = event.selectedRows[NumberConstant.ZERO].dataItem.Value;
          if (value !== NumberConstant.ZERO) {
            this.contractListSelected.push(idContract);
          }
        }
        this.sessionService.getListOfBonusesForSession(this.predicate, this.sessionId).subscribe(res => {
          idSelected = res.SessionBonus.filter(element => element.IdContract === idContract)[NumberConstant.ZERO].IdSelected;
          if (value === NumberConstant.ZERO) {
            this.contractListSelected = this.contractListSelected.filter(element => element !== idContract);
          }
          this.sessionService.addBonusToContract(idContract, this.sessionId, idSelected, idBonus, value).subscribe();
        });
        this.setSelectionState();
      }
    } else {
      this.validationService.validateAllFormFields(this.bonusTypeFormGroup);
      this.contractListSelected = [];
    }
  }

  /**
   * this method is called to update the SelectAll state in checkbox grid
   */
  public setSelectionState() {
    const selectionLength = this.contractListSelected.length;
    if (selectionLength === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (selectionLength === this.gridSettings.gridData.total) {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    }
  }

  /**
   * this method is called once the checkbox in the header of the is clicked
   */
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (this.bonusTypeFormGroup.valid) {
      this.executeSelection = false;
      let allIds = [];
      let idBonus = this.IdBonusType.value;
      let value = this.allBonusesValueFormGroup.controls[BonusConstant.VALUE].value;
      let allSelected = checkedState === SharedConstant.CHECKED as SelectAllCheckboxState;
      if (value === NumberConstant.ZERO && allSelected) {
        this.sessionService.getListOfBonusesForSession(this.predicate, this.sessionId).subscribe(data => {
          this.contractListSelected = [];
          data.SessionBonus.forEach(element => {
            if (element.IdSelected !== NumberConstant.ZERO) {
              this.contractListSelected.push(element.IdContract);
            }
          });
          this.growlService.warningNotification(this.translate.instant(BonusConstant.ALL_BONUSES_VALUE_EQUAL_TO_ZERO));
          this.setSelectionState();
          this.executeSelection = true;
        });
      } else {
        this.sessionService.addBonusToAllContracts(this.predicate, allSelected, this.sessionId, idBonus, value).subscribe(res => {
          allIds = res;
          this.executeSelection = true;
          if (allIds.length === NumberConstant.ZERO) {
            this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
            this.contractListSelected = [];
          } else {
            this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
            this.contractListSelected = allIds;
          }
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.bonusTypeFormGroup);
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
      this.contractListSelected = [];
    }
  }

  /**
   * Create Bonus type form group
   */
  private createBonusTypeForm(): void {
    this.bonusTypeFormGroup = this.formBuilder.group({
      IdBonusType: [{value: '', disabled: this.isClosed}, Validators.required],
    });
  }

  /**
   * Create value for all bonuses form group
   */
  private createAllBonusValuesForm(): void {
    this.allBonusesValueFormGroup = this.formBuilder.group({
      Value: [NumberConstant.ZERO, Validators.min(NumberConstant.ZERO)],
    });
  }

  private isEditableColumn(field: string): boolean {
    const readOnlyColumns = ['Value'];
    return readOnlyColumns.indexOf(field) > NumberConstant.MINUS_ONE;
  }
}
