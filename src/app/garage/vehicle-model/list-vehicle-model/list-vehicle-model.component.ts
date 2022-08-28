import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { VehicleModelService } from '../../services/vehicle-model/vehicle-model.service';
const MODEL_EDIT_URL = 'main/settings/garage/models/edit/';
const ID_VEHICLE_BRAND_NAVIGATION = 'IdVehicleBrandNavigation';
@Component({
  selector: 'app-list-vehicle-model',
  templateUrl: './list-vehicle-model.component.html',
  styleUrls: ['./list-vehicle-model.component.scss']
})
export class ListVehicleModelComponent implements OnInit {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  // filter properties
  filterValue = '';
  filterFormGroup: FormGroup;
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
    },
    {
      field: GarageConstant.VEHICLE_BRAND_NAME_FROM_ID_BRAND_NAVIGATION,
      title: GarageConstant.BRAND_TITLE,
      filterable: true,
      _width: 240,
      tooltip: GarageConstant.BRAND_TITLE
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
  constructor(private router: Router, public vehicleModelService: VehicleModelService,
    private swalWarrings: SwalWarring, private fb: FormBuilder,
    private authService: AuthService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_VEHICLEMODEL);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_VEHICLEMODEL);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.SHOW_VEHICLEMODEL);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.DELETE_VEHICLEMODEL);
    this.createFilterFormGroup();
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ID_VEHICLE_BRAND_NAVIGATION)]);
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.vehicleModelService.reloadServerSideData(this.gridSettings.state,
      this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  createFilterFormGroup() {
    this.filterFormGroup = this.fb.group({
      IdVehicleBrand: [0]
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
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ID_VEHICLE_BRAND_NAVIGATION)]);
    this.predicate.Filter = new Array<Filter>();
    if (this.IdVehicleBrand.value) {
      this.predicate.Filter.push(new Filter(GarageConstant.ID_VEHICLE_BRAND, Operation.eq, this.IdVehicleBrand.value));
    }
    this.predicate.Filter.push(new Filter(GarageConstant.CODE, Operation.contains, this.filterValue, false, true));
    this.predicate.Filter.push(new Filter(GarageConstant.DESIGNATION, Operation.contains, this.filterValue, false, true));
    this.predicate.Filter.push(new Filter(GarageConstant.VEHICLE_BRAND_NAME_FROM_ID_BRAND_NAVIGATION, Operation.contains, this.filterValue, false, true));
    this.gridSettings.state = this.gridState;
    this.initGridDataSource();
  }

  pictureBrandSource(dataItem) {
    if (dataItem.PictureFileInfo) {
      return SharedConstant.PICTURE_BASE.concat((String)(dataItem.PictureFileInfo.Data));
    }
  }

  goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(MODEL_EDIT_URL.concat(dataItem.Id));
  }

  removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.vehicleModelService.remove(dataItem).subscribe(() => {
          this.gridSettings.state = this.gridState;
          this.initGridDataSource();
        });
      }
    });
  }
  get IdVehicleBrand(): FormControl {
    return this.filterFormGroup.controls.IdVehicleBrand as FormControl;
  }
}
