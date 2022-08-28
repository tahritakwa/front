import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { VehicleBrandService } from '../../services/vehicle-brand/vehicle-brand.service';
const BRAND_EDIT_URL = 'main/settings/garage/brands/edit/';
@Component({
  selector: 'app-list-vehicle-brand',
  templateUrl: './list-vehicle-brand.component.html',
  styleUrls: ['./list-vehicle-brand.component.scss']
})
export class ListVehicleBrandComponent implements OnInit {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  // filter properties
  filterValue = '';
  public predicate: PredicateFormat;
  public columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.CODE,
      title: GarageConstant.CODE_TITLE,
      filterable: true,
      _width: 240,
      tooltip: GarageConstant.CODE_TITLE
    },
    {
      field: GarageConstant.DESIGNATION,
      title: GarageConstant.DESIGNATION_TITLE,
      filterable: true,
      _width: 240,
      tooltip: GarageConstant.DESIGNATION_TITLE
    }
  ];
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: SharedConstant.DEFAULT_ITEMS_NUMBER,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  constructor(private router: Router, private swalWarrings: SwalWarring, public vehicleBrandService: VehicleBrandService,
    private authService: AuthService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_VEHICLE_BRAND);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_VEHICLE_BRAND);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.SHOW_VEHICLE_BRAND);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.DELETE_VEHICLE_BRAND);
    this.predicate = new PredicateFormat();
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.vehicleBrandService.reloadServerSideData(this.gridSettings.state,
      this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  doFilter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(GarageConstant.CODE, Operation.contains, this.filterValue, false, true));
    this.predicate.Filter.push(new Filter(GarageConstant.DESIGNATION, Operation.contains, this.filterValue, false, true));
    this.gridSettings.state = this.gridState;
    this.initGridDataSource();
  }

  pictureBrandSource(dataItem) {
    if (dataItem.PictureFileInfo) {
      return SharedConstant.PICTURE_BASE.concat((String)(dataItem.PictureFileInfo.Data));
    }
  }

  goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(BRAND_EDIT_URL.concat(dataItem.Id));
  }

  removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.vehicleBrandService.remove(dataItem).subscribe(() => {
          this.gridSettings.state = this.gridState;
          this.initGridDataSource();
        });
      }
    });
  }

}
