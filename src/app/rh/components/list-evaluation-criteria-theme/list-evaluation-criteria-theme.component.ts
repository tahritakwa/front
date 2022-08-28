import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { EvaluationConstant } from '../../../constant/rh/evaluation.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { EvaluationCriteria } from '../../../models/rh/evaluation-criteria.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { EvaluationCriteriaThemeService } from '../../services/evaluation/evaluation-criteria-theme.service';
import { AddEvaluationCriteriaThemeComponent } from '../add-evaluation-criteria-theme/add-evaluation-criteria-theme.component';

@Component({
  selector: 'app-list-evaluation-criteria-theme',
  templateUrl: './list-evaluation-criteria-theme.component.html',
  styleUrls: ['./list-evaluation-criteria-theme.component.scss']
})
export class ListEvaluationCriteriaThemeComponent implements OnInit, OnDestroy {

  // gridSettings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: EvaluationConstant.LABEL,
      title: EvaluationConstant.LABEL_TITLE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EvaluationConstant.DESCRIPTION,
      title: EvaluationConstant.DESCRIPTION_TITLE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: EvaluationConstant.CRITERE_NUMBER,
      title: EvaluationConstant.CRITERE_NUMBER_TITLE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  // end gridSettings

  public hasAddPermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowPermission: boolean;
  public hasUpdatePermission: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private evaluationCriteriaThemeService: EvaluationCriteriaThemeService,
              private formModalDialogService: FormModalDialogService,
              private viewContainerRef: ViewContainerRef, private swalWarrings: SwalWarring,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_EVALUATIONCRITERIATHEME);
    this.hasDeletePermission =
    this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_EVALUATIONCRITERIATHEME);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_EVALUATIONCRITERIATHEME);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_EVALUATIONCRITERIATHEME);
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.subscriptions.push(this.evaluationCriteriaThemeService.reloadServerSideData(this.gridSettings.state, this.preparePredicate())
      .subscribe(data => this.gridSettings.gridData = data));
  }

  preparePredicate(): PredicateFormat {
    let predicate = new PredicateFormat();
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(EvaluationConstant.EVALUATION_CRITERIA)]);
    return predicate;
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  public editHandler({dataItem}): void {
    this.openEvaluationThemeCriteriaDialog(dataItem);
  }

  public openEvaluationThemeCriteriaDialog(evaluationCriteria?: EvaluationCriteria): void {
    const dataToSend = evaluationCriteria ? evaluationCriteria : undefined;
    const TITLE = evaluationCriteria ? EvaluationConstant.UPDATE_EVALUATION_CRITERIA_THEME
      : EvaluationConstant.ADD_EVALUATION_CRITERIA_THEME;
    this.formModalDialogService.openDialog(TITLE, AddEvaluationCriteriaThemeComponent,
      this.viewContainerRef, this.initGridDataSource.bind(this), dataToSend, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.evaluationCriteriaThemeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
