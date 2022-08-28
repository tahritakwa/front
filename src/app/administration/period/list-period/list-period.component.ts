import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PredicateFormat, Filter, OrderBy, OrderByDirection } from '../../../shared/utils/predicate';
import { State } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { PeriodConstant } from '../../../constant/Administration/period.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PeriodService } from '../../services/period/period.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { Router } from '@angular/router';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-period',
  templateUrl: './list-period.component.html',
  styleUrls: ['./list-period.component.scss']
})
export class ListPeriodComponent implements OnInit {

  public actionColumnWidth  = SharedConstant.COLUMN_ACTIONS_WIDTH;
  isModal = false;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: PeriodConstant.LABEL,
      title: PeriodConstant.LABEL_UPPERCASE,
      filterable: false,
      _width: 240
    },
    {
      field: SharedConstant.START_DATE,
      title: SharedConstant.START_DATE_UPPERCASE,
      filterable: false,
      _width: 240,
      format: this.translate.instant(SharedConstant.DATE_FORMAT)
    },
    {
      field: SharedConstant.END_DATE,
      title: SharedConstant.END_DATE_UPPERCASE,
      filterable: false,
      _width: 240,
      format: this.translate.instant(SharedConstant.DATE_FORMAT)
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public hadAddPeriodPermission: boolean;
  public hadDeletePeriodPermission: boolean;
  public hasShowPeriodPermission: boolean;
  public hasUpdatePeriodPermission: boolean;

  private subscriptions: Subscription[]= [];
  constructor(public periodService: PeriodService, private swalWarrings: SwalWarring, private router: Router,
      private authService: AuthService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.hadAddPeriodPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_PERIOD);
    this.hadDeletePeriodPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_PERIOD);
    this.hasShowPeriodPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_PERIOD);
    this.hasUpdatePeriodPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_PERIOD);
    this.preparePredicate();
    this.initGridDataSource();
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(PeriodConstant.PERIOD_DELETE_TEXT_MESSAGE, PeriodConstant.PERIOD_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.subscriptions.push(this.periodService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Init grid with data from the datasource
   */
  initGridDataSource() {
    this.subscriptions.push(this.periodService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe(data => {
      this.gridSettings.gridData = data;
    }));
  }

  private preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.END_DATE, OrderByDirection.asc));
  }

  /**
   * Reload grid data when data is changed
   * @param state
   */
  public dataStateChange(state: State): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.subscriptions.push(this.periodService.reloadServerSideData(state, this.predicate).subscribe(data => this.gridSettings.gridData = data));
  }

  /**
   * edit click row event
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(PeriodConstant.EDIT_URL.concat(String(dataItem.Id)), {skipLocationChange: true});
  }
  public receiveData(event: any) {
    const predicates: PredicateFormat = Object.assign({}, null, event.predicate);
    this.predicate = predicates;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
