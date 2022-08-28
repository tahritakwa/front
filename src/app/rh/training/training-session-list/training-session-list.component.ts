import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { TrainingConstant } from '../../../constant/rh/training.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { TrainingSessionState } from '../../../models/enumerators/training-session-state.enum';
import { TrainingSession } from '../../../models/rh/training-session.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TrainingSessionService } from '../../services/training-session/training-session.service';

@Component({
  selector: 'app-training-session-list',
  templateUrl: './training-session-list.component.html',
  styleUrls: ['./training-session-list.component.scss']
})
export class TrainingSessionListComponent implements OnInit, OnDestroy {

  predicate: PredicateFormat;
  trainingSessionState = TrainingSessionState;
  formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  public statusFilter: Array<any> = [{'id': this.trainingSessionState.Open, 'name': this.translate.instant(TrainingConstant.OPEN)},
    {
      'id': this.trainingSessionState.Closed,
      'name': this.translate.instant(TrainingConstant.CLOSED)
    }];
  public defaultStatus: any = {'id': NumberConstant.ZERO, 'name': this.translate.instant(TrainingConstant.ALL_STATUS)};
  public statusSelected: number = NumberConstant.ZERO;
  public readCareerPermission = false;
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
      field: TrainingConstant.NAME,
      title: TrainingConstant.TRAINING_SESSION_NAME,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: TrainingConstant.ID_TRAINING_NAVIGATION,
      title: TrainingConstant.TRAINING,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: TrainingConstant.NUMBER_OF_SEANCE,
      title: TrainingConstant.NUMBER_OF_SEANCE_TITLE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: TrainingConstant.NUMBER_OF_PARTICIPANT,
      title: TrainingConstant.NUMBER_OF_PARTICIPANT_TITLE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: TrainingConstant.STATUS,
      title: TrainingConstant.STATUS_TITLE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  /**
   * grid setting
   */
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public hasDeletePermission: boolean;
  public hasShowPermission: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private swalWarrings: SwalWarring, public trainingSessionService: TrainingSessionService,
              private translate: TranslateService, private router: Router, public authService: AuthService) {
  }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_TRAININGSESSION);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_TRAINING_SESSION);
    this.preparePredicate();
    this.subscriptions.push(this.trainingSessionService.getTrainingSessionList(this.gridSettings.state, this.predicate)
      .subscribe((data) => {
        this.gridSettings.gridData = data;
      }));
  }

  removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.trainingSessionService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  onStatusFilterChanged($event) {
    this.statusSelected = $event.id;
    this.initGridDataSource();
  }

  goToAdvancedEdit(dataItem: TrainingSession) {
    this.router.navigateByUrl(TrainingConstant.TRAINING_SESSION_EDIT_URL.concat(String(dataItem.Id)));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (this.statusSelected === this.trainingSessionState.Open) {
      this.predicate.Filter.push(new Filter(TrainingConstant.STATUS, Operation.eq, this.trainingSessionState.Open));
    } else if (this.statusSelected === this.trainingSessionState.Closed) {
      this.predicate.Filter.push(new Filter(TrainingConstant.STATUS, Operation.eq, this.trainingSessionState.Closed));
    }
  }
}
