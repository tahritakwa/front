import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { VariableConstant } from '../../../constant/payroll/variable.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { VariableService } from '../../services/variable/variable.service';

@Component({
  selector: 'app-list-variable',
  templateUrl: './list-variable.component.html',
  styleUrls: ['./list-variable.component.scss']
})
export class ListVariableComponent implements OnInit, OnDestroy {
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
      field: VariableConstant.REFERENCE_NAVIGATION,
      title: VariableConstant.REFERENCE.toUpperCase(),
      filterable: true
    },
    {
      field: VariableConstant.NAME,
      title: VariableConstant.NAME.toUpperCase(),
      tooltip: VariableConstant.NAME.toUpperCase(),
      filterable: true
    },
    {
      field: VariableConstant.DESCRIPTION,
      title: VariableConstant.DESCRIPTION.toUpperCase(),
      tooltip: VariableConstant.DESCRIPTION.toUpperCase(),
      filterable: true
    },
    {
      field: VariableConstant.FORMULE,
      title: VariableConstant.FORMULE.toUpperCase(),
      tooltip: VariableConstant.FORMULE.toUpperCase(),
      filterable: true
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  private subscriptions: Subscription[] = [];

  public hasAddPermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowPermission: boolean;
  public hasUpdatePermission: boolean;

  constructor(public variableService: VariableService, private swalWarrings: SwalWarring , private router: Router,
              private authService: AuthService) { }

  /**
   * Get the variable list from the server
   */
  public initGridDataSource(): void {
    this.subscriptions.push(this.variableService.reloadServerSideData(this.gridSettings.state, this.predicate)
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
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(VariableConstant.RULE_UNIQUE_REFERENCE_NAVIGATION)]);
  }


  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_VARIABLE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_VARIABLE);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_VARIABLE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_VARIABLE);
    this.preparePredicate();
    this.initGridDataSource();
  }
  /**
   * this method is invoked if the page number or filter has changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.subscriptions.push(this.variableService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
          this.gridSettings.gridData = data;
        }
      ));
  }

  /**
   * remove a variable
   * @param dataItem
   */
  public removeHandler(dataItem): void {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.variableService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  public goTOAddVariable() {
    this.router.navigateByUrl(VariableConstant.ADD_URL);
  }

  public goTOEditVariable(dataItem): void {
    this.router.navigateByUrl(VariableConstant.EDIT_URL.concat(dataItem.Id),
      { queryParams: dataItem, skipLocationChange: false });
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
