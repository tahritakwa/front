import { Component, ComponentRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GridDataResult, PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TrainingConstant } from '../../../constant/rh/training.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TrainingRequest } from '../../../models/rh/training-request.model';
import { TrainingSession } from '../../../models/rh/training-session.model';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { TrainingRequestService } from '../../services/training-request/training-request.service';
import { TrainingSessionService } from '../../services/training-session/training-session.service';

@Component({
  selector: 'app-add-employee-to-training-session',
  templateUrl: './add-employee-to-training-session.component.html',
  styleUrls: ['./add-employee-to-training-session.component.scss']
})
export class AddEmployeeToTrainingSessionComponent implements OnInit, OnDestroy {

  public isModal = false;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  idTraining = 0;
  idTrainingSession = 0;

// pager settings
pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
public predicate: PredicateFormat = new PredicateFormat();
private subscriptions: Subscription[]= [];

public gridState: State = {
  skip: 0,
  take: NumberConstant.FIVE as number,
  // Initial filter descriptor
  filter: {
    logic: SharedConstant.LOGIC_AND,
    filters: []
  }
};
public dateNow: Date = new Date();

// is true if cell is clicked and in edit mode (before closing the cell)
  cellInEditMode = false;
// formGroup used while the cell is still open
  editCellformGroup: FormGroup;
  lastDateCellEdited: any;
  IdEmployeesInTrainingSession: number[] = [];
  public employeeListIdSelected: number[] = [];
  AllEmployeeIds: number[] = [];
  // state of selection
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  AllTrainingRequestList: TrainingRequest[] = [];
  trainingRequestListSelected: TrainingRequest[] = [];
  // input of the grid : observable type
  public view: Observable<GridDataResult>;
  public showErrorMessage: boolean;
  public showBody = true;
  trainingSession: TrainingSession;
  public columnsConfig: ColumnSettings[] = [
    {
      field: TrainingConstant.ID_EMPLOYEE_COLLABORATOR_NAVIGATION_FIRST_NAME,
      title: TrainingConstant.FIRST_NAME,
      filterable: true
    },
    {
      field: TrainingConstant.ID_EMPLOYEE_COLLABORATOR_NAVIGATION_LAST_NAME,
      title: TrainingConstant.LAST_NAME,
      filterable: true
    },
    {
      field: TrainingConstant.EXPECTED_DATE,
      title: TrainingConstant.EXPECTED_DATE_TITLE,
      filterable: false
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private userCurrentInformationsService: UserCurrentInformationsService, private trainingRequestService: TrainingRequestService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalDialogInstanceService,
    private trainingSessionService: TrainingSessionService,
    private formBuilder: FormBuilder, private translate: TranslateService) {
      this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idTraining = +params[TrainingConstant.PARAMS_ID_TRAINING] || NumberConstant.ZERO;
      this.idTrainingSession = +params[TrainingConstant.PARAMS_ID] || NumberConstant.ZERO;
    }));
  }


  ngOnInit() {
    this.initGridDataSource();
  }


  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    if (this.dialogOptions.data && this.dialogOptions.data.length > 0) {
      this.dialogOptions.data.forEach(element => {
        this.IdEmployeesInTrainingSession.push(element.IdEmployeeCollaborator);
      });
    }
    this.isModal = true;
  }

  public initGridDataSource(): void {

    if (this.idTraining === 0) {
      this.subscriptions.push(this.trainingSessionService.getModelByCondition(this.predicateForTrainingSession()).subscribe((data) => {
        this.trainingSession = data;
        // Get the training id in update mode
        this.idTraining = this.trainingSession.IdTraining;
        this.getEmployeeList();
      }));
    } else {
      this.getEmployeeList();
    }
  }

  getEmployeeList() {
    this.subscriptions.push(this.trainingRequestService.getEmployeeListNotIncludedInTrainingSession(this.IdEmployeesInTrainingSession,
      this.idTraining).subscribe(res => {
        this.AllEmployeeIds = new Array<number>();
        res.data.forEach(element => {
          this.AllEmployeeIds.push(element.IdEmployeeCollaborator);
          element.ExpectedDate = new Date(element.ExpectedDate);
          element.IdTraining = this.idTraining;
          this.userCurrentInformationsService.getConnectedEmployeeId().subscribe(idEmployee => {
            element.IdEmployeeAuthor = idEmployee;
          });
        });
        this.gridSettings.gridData = res;
        this.AllTrainingRequestList = res.data;
        this.gridSettings.gridData.data = res.data.slice(this.gridState.skip, this.gridState.take);
        if ((this.AllTrainingRequestList.length === 0)) {
          this.showBody = false;
        }
      }
    ));

  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    const employeeList = Object.assign([], this.AllTrainingRequestList);
    this.gridSettings.gridData = process(employeeList, state);
  }
  /**
   * Add employees to training session
   */
  onClickAddEmployeesToTrainingSession() {
    if (this.trainingRequestListSelected.length > 0) {
      if (this.cellInEditMode) {
        this.lastDateCellEdited.ExpectedDate = this.editCellformGroup.controls[TrainingConstant.EXPECTED_DATE].value;
      }
      this.subscriptions.push(this.trainingRequestService.addSelectedEmployeesToTrainingRequest(this.trainingRequestListSelected)
        .subscribe((result) => {
          this.dialogOptions.onClose();
          this.modalService.closeAnyExistingModalDialog();
        }));
    } else {
      this.showErrorMessage = true;
    }
  }

  /**
   * this method is called once the checkbox in the header is clicked
   */
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
      this.employeeListIdSelected = Object.assign([], this.AllEmployeeIds);
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      this.employeeListIdSelected = [];
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    }
  }

  /**
   * On selected keys change
   * @param e
   */
  public onSelectedKeysChange(e) {
    this.showErrorMessage = false;
    const len = this.employeeListIdSelected.length;
    // Update the training request list selected
    this.trainingRequestListSelected = new Array<TrainingRequest>();
    this.AllTrainingRequestList.forEach(x => this.employeeListIdSelected.forEach(
      (elt) => {
        if (elt === x.IdEmployeeCollaborator) {
          this.trainingRequestListSelected.push(x);
        }
      }));
    if (len === 0) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (len > 0 && len < this.AllEmployeeIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    }
  }

  /**
   * this method will be invoked if the value of the input of the kendo data grid has been changed to change
   * all the value of data grid
   */
  onChange(value: Date) {
    this.AllTrainingRequestList.forEach(
      element => {
        element.ExpectedDate = value;
      });
    this.view = Observable.of(this.gridSettings.gridData);
  }

  /**
   * create form if cell of the grid clicked
   */
  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      'Id': dataItem.Id,
      'ExpectedDate': [new Date(dataItem.ExpectedDate)]
    });
  }

  /**
   * this method is called by clicking on the cells of the grid to prepare the input fields
   */
  public cellClickHandler({sender, rowIndex, column, columnIndex, dataItem, isEdited}) {
    {
      if (!isEdited) {
        this.editCellformGroup = this.createFormGroup(dataItem);
        this.lastDateCellEdited = dataItem;
        this.cellInEditMode = true;
        sender.editCell(rowIndex, columnIndex, this.editCellformGroup);
      }
    }
  }

  /**
   * this method is called by closing the input field of a cell in the grid
   */
  public cellCloseHandler(args: any) {
    const {formGroup, dataItem} = args;
    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else {
      // change the data grid input by the new values
      dataItem.ExpectedDate = formGroup.controls['ExpectedDate'].value;
      this.view = Observable.of(this.gridSettings.gridData);
    }
    this.cellInEditMode = false;
    this.lastDateCellEdited = null;
    this.editCellformGroup = null;
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * Predicate for the training session
   */
  private predicateForTrainingSession(): PredicateFormat {
    const predicate: PredicateFormat = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(TrainingConstant.ID, Operation.eq, this.idTrainingSession));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(TrainingConstant.TRAINING_SEANCE_COLLECTION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(TrainingConstant.ID_TRAINING_NAVIGATION)]);
    return predicate;
  }
}
