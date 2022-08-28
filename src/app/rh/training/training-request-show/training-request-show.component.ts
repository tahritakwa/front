import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { TrainingConstant } from '../../../constant/rh/training.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { TrainingRequestState } from '../../../models/enumerators/training-request-state.enum';
import { TrainingRequest } from '../../../models/rh/training-request.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TrainingRequestService } from '../../services/training-request/training-request.service';
import { TrainingAddRequestComponent } from '../training-add-request/training-add-request.component';

@Component({
  selector: 'app-training-request-show',
  templateUrl: './training-request-show.component.html',
  styleUrls: ['./training-request-show.component.scss']
})
export class TrainingRequestShowComponent implements OnInit, OnDestroy {

  trainingRequest: TrainingRequest;
  predicate: PredicateFormat;
  trainingRequestState = TrainingRequestState;
  formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public hasShowTrainingRequestPermission: boolean;
  public hasDeleteTrainingRequestPermission: boolean;
  /**
   * grid state
   */
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  /**
   * grid column config
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: TrainingConstant.ID_EMPLOYEE_COLLABORATOR_NAVIGATION_FULL_NAME,
      title: TrainingConstant.USER,
      filterable: true
    },
    {
      field: TrainingConstant.ID_TRAINING_NAVIGATION_NAME,
      title: TrainingConstant.TRAINING,
      filterable: true
    },
    {
      field: TrainingConstant.EXPECTED_DATE,
      title: TrainingConstant.AVAILABILITY_DATE,
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
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  private subscriptions: Subscription[] = [];

  constructor(private swalWarrings: SwalWarring, public trainingRequestService: TrainingRequestService,
              private formModalDialogService: FormModalDialogService, private authService: AuthService,
      private viewContainerRef: ViewContainerRef, private translate: TranslateService) {
  }

  ngOnInit() {
    this.hasShowTrainingRequestPermission =  this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_TRAINING_REQUEST);
    this.hasDeleteTrainingRequestPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_TRAININGREQUEST);
    this.initGridDataSource();
  }

  /**
   * init grid data source
   */
  initGridDataSource() {
    this.preparePredicate();
    this.subscriptions.push(this.trainingRequestService.getTrainingRequestListByHierarchy(this.gridSettings.state, this.predicate).subscribe(data => {
        this.gridSettings.gridData = data;
      }
    ));
  }

  /**
   * grid state change
   * @param state
   */
  dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  /**
   * remove trainingRequest
   * @param param0
   */
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.trainingRequestService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * updateTrainingRequest in modal window
   * @param dataItem
   */
  public updateTrainingRequest(dataItem) {
    this.trainingRequest = dataItem;
    const dataToSend = this.trainingRequest;
    const TITLE = TrainingConstant.UPDATE_TRAINING_REQUEST;
    this.formModalDialogService.openDialog(TITLE, TrainingAddRequestComponent,
      this.viewContainerRef, this.initGridDataSource.bind(this), dataToSend, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  /**
   * doSearch using filter
   * @param predicate
   */
  public doSearch(predicate) {
    if (predicate && predicate.Filter) {
      this.predicate.Filter = new Array<Filter>();
      predicate.Filter.forEach(element => {
        if (element.prop === TrainingConstant.ID_EMPLOYEE) {
          this.predicate.Filter.push(new Filter(TrainingConstant.ID_EMPLOYEE_COLLABORATOR, Operation.eq, element.value));
        }
        if (element.prop === TrainingConstant.STATUS) {
          this.predicate.Filter.push(new Filter(TrainingConstant.STATUS, Operation.eq, element.value));
        }
        if (element.prop === TrainingConstant.ID_EMPLOYEE_COLLABORATOR_NAVIGATION_TEAM) {
          this.predicate.Filter.push(new Filter(TrainingConstant.ID_EMPLOYEE_COLLABORATOR_NAVIGATION_TEAM, Operation.eq, element.value));
        }
      });
    }
    this.initGridDataSource();
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * prepare predicate for the list grid
   */
  private preparePredicate() {
    if (!this.predicate) {
      this.predicate = new PredicateFormat();
    }
  }
}
