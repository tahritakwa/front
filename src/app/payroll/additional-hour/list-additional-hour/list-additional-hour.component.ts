import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { AdditionalHourConstant } from '../../../constant/payroll/additional-hour.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TranslationKeysConstant } from '../../../constant/shared/translation-keys.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AdditionalHourService } from '../../services/additional-hour/additional-hour.service';
import { AddAdditionalHourComponent } from '../add-additional-hour/add-additional-hour.component';

@Component({
    selector: 'app-list-additional-hour',
    templateUrl: './list-additional-hour.component.html',
    styleUrls: ['./list-additional-hour.component.scss']
  })
  export class ListAdditionalHourComponent implements OnInit, OnDestroy {

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
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
      field: AdditionalHourConstant.CODE,
      title: AdditionalHourConstant.CODE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: AdditionalHourConstant.NAME,
      title: AdditionalHourConstant.NAME_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: AdditionalHourConstant.INCREASE_PERCENTAGE,
      title: AdditionalHourConstant.INCREASE_PERCENTAGE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: AdditionalHourConstant.WORKED,
      title: AdditionalHourConstant.WORK_DAY_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  private subscriptions: Subscription[] = [];
  public hasShowPermission: boolean;
  public hasUpdatePermission: boolean;

  constructor(public additionalHourService: AdditionalHourService, private authService: AuthService,
      private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef) { }

  ngOnInit() {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_ADDITIONAL_HOUR);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_ADDITIONAL_HOUR);
    this.preparePredicate();
    this.initGridDataSource();
  }

    /**
   * Get the additional hour list from the server
   */
  public initGridDataSource(): void {
    this.subscriptions.push(this.additionalHourService.reloadServerSideData(this.gridSettings.state, this.predicate)
    .subscribe(data => {
      this.gridSettings.gridData = data;
      }
    ));
  }

  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(AdditionalHourConstant.ADDITIONAL_HOUR_SLOT)]);
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  /**
   * Edit additional hour
   * @param dataItem
   */
  public editHandler(dataItem): void {
    const TITLE = TranslationKeysConstant.UPDATE_ADDITIONAL_HOUR;
    this.formModalDialogService.openDialog(TITLE, AddAdditionalHourComponent,
      this.viewRef, this.initGridDataSource.bind(this), dataItem.dataItem, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
  }
