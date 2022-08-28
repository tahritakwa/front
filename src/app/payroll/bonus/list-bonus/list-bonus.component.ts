import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { BonusConstant } from '../../../constant/payroll/bonus.constant';
import { CnssConstant } from '../../../constant/payroll/cnss.constant';
import { SalaryRuleConstant } from '../../../constant/payroll/salary-rule.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TranslationKeysConstant } from '../../../constant/shared/translation-keys.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Bonus } from '../../../models/payroll/bonus.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { BonusService } from '../../services/bonus/bonus.service';
import { AddBonusComponent } from '../add-bonus/add-bonus.component';
@Component({
  selector: 'app-list-bonus',
  templateUrl: './list-bonus.component.html',
  styleUrls: ['./list-bonus.component.scss']
})
export class ListBonusComponent implements OnInit, OnDestroy {
  // pager settings
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
      field: BonusConstant.CODE,
      title: BonusConstant.CODE_UPPERCASE,
      filterable: true
    },
    {
      field: BonusConstant.NAME,
      title: BonusConstant.NAME_UPPERCASE,
      filterable: true
    },
    {
      field: BonusConstant.DESCRIPTION,
      title: BonusConstant.DESCRIPTION_UPPERCASE,
      filterable: true
    },
    {
      field: BonusConstant.IS_FIXE,
      title: BonusConstant.TYPE,
      filterable: true
    },
    {
      field: CnssConstant.CNSS_LABEL_FROM_CNSS_NAVIGATION,
      title: CnssConstant.CNSS_TYPE,
      tooltip: CnssConstant.TYPE_CNSS,
      filterable: true
    },
    {
      field: BonusConstant.IS_TAXABLE,
      title: BonusConstant.TAXABLE,
      filterable: true
    },
    {
      field: SalaryRuleConstant.DEPEND_NUMBER_DAYS_WORKED,
      title: SalaryRuleConstant.DEPEND_NUMBER_DAYS_WORKED_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public hasAddPermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowPermission: boolean;
  public hasUpdatePermission: boolean;
  private subscriptions: Subscription[] = [];

  constructor(public bonusService: BonusService, private swalWarrings: SwalWarring,
    private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService,
    private authService: AuthService) { }

  /**
   * Initialise Component
   */
  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_BONUS);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_BONUS);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_BONUS);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_BONUS);
    this.preparePredicate();
    this.initGridDataSource();
  }

  /**
   * remove a bonus
   * @param dataItem
   */
  public removeHandler(dataItem): void {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.bonusService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Get the bonuses list from the server
   */
  public initGridDataSource(): void {
    this.subscriptions.push(this.bonusService.reloadServerSideData(this.gridSettings.state, this.predicate)
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
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(BonusConstant.BONUS_VALIDITY_PERIOD)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(BonusConstant.CNSS_NAVIGATION)]);
  }

  /**
   * this method fis invoked if the page number or filter has changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.subscriptions.push(this.bonusService.reloadServerSideData(state, this.predicate).subscribe(data => this.gridSettings.gridData = data));
  }

  /**
   * Edit Bonus
   * @param dataItem
   */
  public editHandler(dataItem): void {
    this.addNewBonus(dataItem);
  }

  /**
   * Add New Bonus : load the add bonus component into a modal
   * @param data
   */
  public addNewBonus(data?: Bonus): void {
    const dataToSend = data ? data : undefined;
    const TITLE = data ? TranslationKeysConstant.UPDATE_BONUS : TranslationKeysConstant.ADD_BONUS;
    this.formModalDialogService.openDialog(TITLE, AddBonusComponent,
      this.viewRef, this.initGridDataSource.bind(this), dataToSend, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
