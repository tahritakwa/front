import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {TrainingConstant} from '../../../constant/rh/training.constant';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {AddEmployeeToTrainingSessionComponent} from '../../training/add-employee-to-training-session/add-employee-to-training-session.component';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TrainingRequest} from '../../../models/rh/training-request.model';
import {process, State} from '@progress/kendo-data-query';
import {PagerSettings, SelectAllCheckboxState} from '@progress/kendo-angular-grid';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {Router} from '@angular/router';
import {TrainingRequestState} from '../../../models/enumerators/training-request-state.enum';
import {TrainingSessionService} from '../../services/training-session/training-session.service';
import {TrainingRequestService} from '../../services/training-request/training-request.service';
import {TrainingSession} from '../../../models/rh/training-session.model';
import {isNullOrUndefined} from 'util';
import {Filter, Operation, Operator, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {EmployeeMultiselectComponent} from '../../../shared/components/employee-multiselect/employee-multiselect.component';

@Component({
  selector: 'app-selecting-employee-for-training-session',
  templateUrl: './selecting-employee-for-training-session.component.html',
  styleUrls: ['./selecting-employee-for-training-session.component.scss']
})
export class SelectingEmployeeForTrainingSessionComponent implements OnInit {
  hideCardBody = false;
  AllTrainingRequestList: TrainingRequest[] = [];
  @Input() trainingSession: TrainingSession;
  @Input() hasUpdatePermission: boolean;
  @Input() hasAddPermission: Boolean;
  trainingName: string;
  AllTrainingRequestIds: number[] = [];
  trainingRequestIdsSelected: number[] = [];
  trainingRequestListSelected: TrainingRequest[] = [];
  selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;

  trainingRequestState = TrainingRequestState;
  oldTrainingRequestListSelected: TrainingRequest[] = [];
  newTrainingRequestListSelected: TrainingRequest[] = [];
  trainingRequestSelectedToUnSelectedList: TrainingRequest[] = [];

  @Input() isUpdateMode: boolean;
  @Input() idTraining: number;
  @Input() idTrainingSession: number;

  predicate: PredicateFormat;
  selectedTeams: number[] = [];
  selectedCollaboraters: number[] = [];
  selectedRate = NumberConstant.ZERO;
  trainingRequestToSendToModal: TrainingRequest[] = [];
  isClosed = false;

  @ViewChild(EmployeeMultiselectComponent) employeeMultiSelect;
  /**
   * Team checkbox
   */
  public team = false;
  /**
   * collaborater checkbox
   */
  public collaborater = false;
  /**
   * Skill checkbox
   */
  public skill = false;
  /**
   * grid pager settings
   */
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  /**
   * grid column config
   */
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
      filterable: true
    },
    {
      field: TrainingConstant.STATUS,
      title: TrainingConstant.STATUS_TITLE,
      filterable: true
    }
  ];

  /**
   * grid setting
   */
  public gridSettings: GridSettings = {
    state: this.gridState(),
    columnsConfig: this.columnsConfig,
  };

  constructor(private formModalDialogService: FormModalDialogService, private viewContainerRef: ViewContainerRef,
              private trainingSessionService: TrainingSessionService, private trainingRequestService: TrainingRequestService,
              private router: Router) {
  }

  /**
   * grid state
   */
  public gridState(): State {
    return {
      skip: NumberConstant.ZERO,
      take: NumberConstant.TEN as number,
      filter: {
        logic: SharedConstant.LOGIC_AND,
        filters: []
      }
    };
  }

  ngOnInit() {
    this.initGridDataSource();
    this.AllTrainingRequestIds = new Array<number>();
    this.oldTrainingRequestListSelected = new Array<TrainingRequest>();
    this.trainingRequestListSelected = new Array<TrainingRequest>();
    this.trainingRequestIdsSelected = new Array<number>();
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
   * make skill checkbox checked
   */
  setSkillCheckboxToTrue(event) {
    if (event.target.checked) {
      this.skill = true;
    } else {
      this.skill = false;
    }
  }

  /**
   * Init grid data source in no update mode
   */
  public initGridDataSource() {
    if (this.isClosed) {
      this.predicate = new PredicateFormat();
    }
    if (this.isUpdateMode) {
      this.trainingRequestService.getTrainingRequestListInUpdateMode(this.trainingSession.IdTraining,
        this.trainingSession.Id, this.predicate).subscribe(result => {
        // Initiate the old training request and the training request list selected Id
        if (result.total > NumberConstant.ZERO) {
          this.AllTrainingRequestIds = result.data.map(element => element.Id);
          this.oldTrainingRequestListSelected = result.data
            .filter(element => element.IdTrainingSession === this.trainingSession.Id);
          Object.assign(this.trainingRequestListSelected, this.oldTrainingRequestListSelected);
          this.trainingRequestIdsSelected = this.trainingRequestListSelected.map(selectedElement => selectedElement.Id);
          // initiate the grid data
          this.gridSettings.gridData = result;
          this.AllTrainingRequestList = Object.assign([], result.data);
          this.gridSettings.gridData.data = result.data.slice(this.gridState().skip, this.gridState().take);
          // Check the selected state of the grid
          this.checkSelectedState();
          if (this.trainingRequestToSendToModal.length === NumberConstant.ZERO || this.isClosed) {
            this.trainingRequestToSendToModal = this.AllTrainingRequestList;
          }
        } else {
          this.gridSettings.gridData = result;
        }
      });
    } else {
      this.trainingRequestService.getTrainingRequestListForPanifing(this.trainingSession.IdTraining, this.predicate).subscribe(res => {
          if (res.total > NumberConstant.ZERO) {
            this.AllTrainingRequestIds = new Array<number>();
            this.AllTrainingRequestIds = res.data.map(element => element.Id);
            this.gridSettings.gridData = res;
            this.AllTrainingRequestList = res.data;
            if (this.AllTrainingRequestList.length > NumberConstant.ZERO) {
              this.trainingName = this.AllTrainingRequestList[NumberConstant.ZERO].IdTrainingNavigation ?
                this.AllTrainingRequestList[NumberConstant.ZERO].IdTrainingNavigation.Name : '';
            }
            this.gridSettings.gridData.data = res.data.slice(this.gridState().skip, this.gridState().take);
            if (this.trainingRequestToSendToModal.length === NumberConstant.ZERO || this.isClosed) {
              this.trainingRequestToSendToModal = this.AllTrainingRequestList;
            }
          } else {
            this.gridSettings.gridData = res;
          }
        }
      );
    }
  }

  /**
   * Check selected state, method call in update mode
   */
  checkSelectedState() {
    if (this.AllTrainingRequestIds.length > NumberConstant.ZERO &&
      this.AllTrainingRequestIds.length === this.trainingRequestIdsSelected.length) {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      if (this.trainingRequestIdsSelected.length > NumberConstant.ZERO) {
        this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
      } else {
        this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
      }
    }
  }

  /*
    Add employees to training session
  */
  public addEmployeeToTraining() {
      this.isClosed = false;
      const TITLE = TrainingConstant.ADD_EMPLOYEE_TO_TRAINING_REQUEST;
      this.formModalDialogService.openDialog(TITLE,
        AddEmployeeToTrainingSessionComponent,
        this.viewContainerRef, this.closeModal.bind(this), this.trainingRequestToSendToModal, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  public closeModal() {
    this.isClosed = true;
    this.initGridDataSource();
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    const trainingList = Object.assign([], this.AllTrainingRequestList);
    this.gridSettings.gridData = process(trainingList, state);
  }

  /**
   * On selected keys change
   * @param e
   */
  public onSelectedKeysChange(e) {
    const len = this.trainingRequestIdsSelected.length;
    this.trainingRequestListSelected = new Array<TrainingRequest>();
    this.AllTrainingRequestList.forEach(x => this.trainingRequestIdsSelected.forEach(
      (elt) => {
        if (elt === x.Id) {
          this.trainingRequestListSelected.push(x);
        }
      }));
    if (len === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (len > NumberConstant.ZERO && len < this.AllTrainingRequestIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    }
  }

  /**
   * On select all change
   * @param checkedState
   */
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
      this.trainingRequestIdsSelected = Object.assign([], this.AllTrainingRequestIds);
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      this.trainingRequestIdsSelected = [];
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    }
  }

  saveTrainingRequests() {
    if (!this.isUpdateMode) {
      this.trainingSessionService.addTrainingRequestsWithTrainingSession(this.idTraining, this.trainingRequestListSelected)
        .subscribe((result) => {
          this.router.navigate([TrainingConstant.NAVIGATE_TO_TRAINING_SESSSION_LIST]);
        });
    } else {
      // Get the newTraining request selected
      this.trainingRequestListSelected.forEach((elt) => {
        const newSelected = this.oldTrainingRequestListSelected.find(y => y.Id === elt.Id);
        if (isNullOrUndefined(newSelected)) {
          this.newTrainingRequestListSelected.push(elt);
        }
      });
      // Get the training request which pass from selected to unselected
      this.oldTrainingRequestListSelected.forEach((elt) => {
        const newUnSelected = this.trainingRequestListSelected.find(y => y.Id === elt.Id);
        if (isNullOrUndefined(newUnSelected)) {
          this.trainingRequestSelectedToUnSelectedList.push(elt);
        }
      });
      this.trainingSessionService.updateTrainingRequestsWithTrainingSession(this.idTrainingSession, this.newTrainingRequestListSelected,
        this.trainingRequestSelectedToUnSelectedList)
        .subscribe((result) => {
          this.router.navigate([TrainingConstant.NAVIGATE_TO_TRAINING_SESSSION_LIST]);
        });
    }
  }


  teamSelected(event) {
    this.selectedTeams = event.selectedValueMultiSelect;
    this.selectedCollaboraters = [];
    if (this.employeeMultiSelect) {
      this.employeeMultiSelect.initialiseEmployeeDropdown();
      this.employeeMultiSelect.SetTeam(this.selectedTeams);
    }
  }

  employeeSelected(event) {
    this.selectedCollaboraters = event.selectedValueMultiSelect;
  }

  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Operator = Operator.and;
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.prepareCollaboraterPredicate();
    this.prepareTeamPredicate();
    if (this.predicate.Filter.length > NumberConstant.ZERO) {
      this.predicate.Filter.push(new Filter(TrainingConstant.ID_TRAINING, Operation.eq, this.idTraining));
    }
    this.predicate.Relation.push(new Relation(TrainingConstant.ID_EMPLOYEE_COLLABORATOR_NAVIGATION));
  }

  public prepareCollaboraterPredicate() {
    if (this.collaborater && this.selectedCollaboraters.length > NumberConstant.ZERO) {
      this.selectedCollaboraters.forEach(Id => {
        this.predicate.Filter.push(new Filter(TrainingConstant.ID_EMPLOYEE_COLLABORATOR, Operation.eq, Id, false, true));
      });
    }
  }

  public prepareTeamPredicate() {
    if (this.team && this.selectedTeams.length > NumberConstant.ZERO && this.selectedCollaboraters.length === NumberConstant.ZERO) {
      this.selectedTeams.forEach(Id => {
        this.predicate.Filter.push(new Filter(TrainingConstant.ID_EMPLOYEE_COLLABORATOR_NAVIGATION_TEAM, Operation.eq, Id, false, true));
      });
    }
  }

  /**
   * Search training requests by filter
   */
  public onSearch() {
    this.isClosed = false;
    if (!this.collaborater && !this.team) {
      this.predicate = new PredicateFormat();
      this.initGridDataSource();
    } else {
      this.preparePredicate();
      this.gridState();
      this.gridSettings.state.skip = NumberConstant.ZERO;
      this.initGridDataSource();
    }
  }

  hideBody() {
    this.hideCardBody = !this.hideCardBody;
    if (this.hideCardBody) {
      this.predicate = new PredicateFormat();
      this.initGridDataSource();
    }
  }
}
