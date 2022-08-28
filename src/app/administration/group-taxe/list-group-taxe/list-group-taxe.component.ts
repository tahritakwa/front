import { Component, OnInit } from '@angular/core';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { Router } from '@angular/router';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TaxeGroupService } from '../../services/taxe-group/taxe-group.service';
import { TaxeGroupConstant } from '../../../constant/Administration/taxe-group.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import {Filter, Operation, PredicateFormat} from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-group-taxe',
  templateUrl: './list-group-taxe.component.html',
  styleUrls: ['./list-group-taxe.component.scss']
})
export class ListGroupTaxeComponent implements OnInit {
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  /**
   * button Advanced Edit visibility
   */
  private btnEditVisible: boolean;

  /**
   * Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: TaxeGroupConstant.Code,
      title: TaxeGroupConstant.CODE,
      filterable: false,
      _width : 240
    },
    {
      field: TaxeGroupConstant.Label,
      title: TaxeGroupConstant.DESIGNATION,
      filterable: false,
      _width : 300
    }
  ];
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  groupTaxe: string;
  public hasAddGroupTaxPermission: boolean;
  public hasShowGroupTaxPermission: boolean;
  public hasDeleteGroupTaxPermission: boolean;
  public hasUpdateGroupTaxPermission: boolean;

  constructor(private router: Router, public taxeGroupService: TaxeGroupService, public authService: AuthService,
    private swalWarrings: SwalWarring) {
    this.btnEditVisible = true;
  }

  /**
   * ng init
   */
  ngOnInit() {
    this.hasAddGroupTaxPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_GROUP_TAX);
    this.hasShowGroupTaxPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_GROUP_TAX);
    this.hasDeleteGroupTaxPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_GROUP_TAX);
    this.hasUpdateGroupTaxPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_GROUP_TAX);
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.taxeGroupService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => this.gridSettings.gridData = data);
  }
  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(SharedConstant.GROUP_TAX_DELETE_TEXT_MESSAGE, SharedConstant.GROUP_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.taxeGroupService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  /**
   * edit click row event
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(TaxeGroupConstant.GROUP_TAXE_URL + dataItem.Id);
  }

  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(TaxeGroupConstant.Code, Operation.contains, this.groupTaxe, false, true));
    this.predicate.Filter.push(new Filter(TaxeGroupConstant.Label, Operation.contains, this.groupTaxe, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
}
