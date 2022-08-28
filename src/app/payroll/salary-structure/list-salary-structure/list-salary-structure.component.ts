import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { SalaryStructureConstant } from '../../../constant/payroll/salary-structure.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SalaryStructureService } from '../../services/salary-structure/salary-structure.service';
@Component({
  selector: 'app-list-salary-structure',
  templateUrl: './list-salary-structure.component.html',
  styleUrls: ['./list-salary-structure.component.scss']
})
export class ListSalaryStructureComponent implements OnInit, OnDestroy {
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  public readOnlyPaySetting = false;
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
      field: SalaryStructureConstant.SALARY_STRUCTURE_REFERENCE,
      title: SalaryStructureConstant.REFERENCE.toUpperCase(),
      filterable: true
    },
    {
      field: SalaryStructureConstant.SALARY_STRUCTURE_NAME,
      title: SalaryStructureConstant.SALARY_STRUCTURE_NAME.toUpperCase(),
      tooltip: SalaryStructureConstant.SALARY_STRUCTURE_NAME.toUpperCase(),
      filterable: true
    },
    {
      field: SalaryStructureConstant.SALARY_STRUCTURE_ORDER,
      title: SalaryStructureConstant.TITLE_ORDER,
      tooltip: SalaryStructureConstant.TITLE_ORDER,
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

  constructor(public salaryStructureService: SalaryStructureService, private router: Router, private swalWarrings: SwalWarring,
    private authService: AuthService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_SALARYSTRUCTURE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_SALARYSTRUCTURE);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_SALARYSTRUCTURE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_SALARYSTRUCTURE);
    this.preparePredicate();
    this.initGridDataSource();
  }
  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
  }

  /**
 * Get the Salary Structure list from the server
 */
  public initGridDataSource(): void {
    this.subscriptions.push(this.salaryStructureService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      }
    ));
  }

  /**
     * this method is invoked if the page number or filter has changed
     * @param state
     */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.subscriptions.push(this.salaryStructureService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      }
    ));
  }

  /**
 * remove a salary structure
 * @param dataItem
 */
  public removeHandler(dataItem): void {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.salaryStructureService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  public goToAddSalaryStructure() {
    this.router.navigateByUrl(SalaryStructureConstant.ADD_URL);
  }

  public goToEditSalaryStructure(dataItem): void {
    this.router.navigateByUrl(SalaryStructureConstant.EDIT_URL.concat(dataItem.Id),
      { queryParams: dataItem, skipLocationChange: false });
  }

  public colneItem(id) {
    window.open(SalaryStructureConstant.DUPLICATE_SALARYSTRUCTURE_URL.concat(id));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
