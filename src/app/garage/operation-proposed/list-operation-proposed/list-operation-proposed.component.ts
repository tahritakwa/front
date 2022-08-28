import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridDataResult, PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { MileageService } from '../../services/mileage/mileage.service';

@Component({
  selector: 'app-list-operation-proposed',
  templateUrl: './list-operation-proposed.component.html',
  styleUrls: ['./list-operation-proposed.component.scss']
})
export class ListOperationProposedComponent implements OnInit {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  predicate: PredicateFormat = new PredicateFormat();

  public searchValue: string;

  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      filters: [],
      logic: 'and'
    },
    group: []
  };

  gridData: GridDataResult = new Object() as GridDataResult;

  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.NAME,
      title: GarageConstant.MILEAGE_NAME_TITLE,
      filterable: true,
      tooltip: GarageConstant.MILEAGE_NAME_TITLE
    },
    {
      field: GarageConstant.MILEAGE_VALUE,
      title: GarageConstant.MILEAGE_VALUE_TITLE,
      filterable: true,
      tooltip: GarageConstant.MILEAGE_VALUE_TITLE
    },
  ];

  gridSettings: GridSettings = {
    state: this.gridState,
    gridData: this.gridData,
    columnsConfig: this.columnsConfig
  };

    // Permission Parameters
    public hasAddPermission: boolean;
    public hasUpdatePermission: boolean;
    public hasShowPermission: boolean;
    public hasDeletePermission: boolean;
  constructor(public mileageService: MileageService, private router: Router, private swalWarrings: SwalWarring,
    private authService: AuthService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_OPERATION_PROPOSED);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_OPERATION_PROPOSED);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.SHOW_OPERATION_PROPOSED);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.DELETE_OPERATION_PROPOSED);
    this.initGridDataSource();
  }
  initGridDataSource() {
    this.mileageService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe((data) => {
      this.gridSettings.gridData = data;
    });
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }


  public doFilter() {
    if (this.searchValue) {
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(new Filter(GarageConstant.NAME, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.MILEAGE_VALUE, Operation.contains, this.searchValue, false, true));
    } else {
      this.predicate.Filter = new Array<Filter>();
    }
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.gridSettings.state.take = NumberConstant.TWENTY;
    this.initGridDataSource();
  }

  goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(GarageConstant.OPERATION_PROPOSED_EDIT_URL.concat(dataItem.Id));
  }
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(GarageConstant.DELETE_MESSAGE).then((result) => {
      if (result.value) {
        this.mileageService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }
}
