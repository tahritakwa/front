import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, DataSourceRequestState, State } from '@progress/kendo-data-query';
import { EnumValues } from 'enum-values';
import { GarageConstant } from '../../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { CustomerCategoryEnumerator } from '../../../../models/enumerators/customer-category.enum';
import { TiersTypeEnumerator } from '../../../../models/enumerators/tiers-type.enum';
import { VehicleCategoryEnumerator } from '../../../../models/enumerators/vehicle-category.enum';
import { Vehicle } from '../../../../models/garage/vehicle.model';
import { SwalWarring } from '../../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../../shared/utils/predicate';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { VehicleService } from '../../../services/vehicle/vehicle.service';

@Component({
  selector: 'app-list-loan-vehicle',
  templateUrl: './list-loan-vehicle.component.html',
  styleUrls: ['./list-loan-vehicle.component.scss']
})
export class ListLoanVehicleComponent implements OnInit {
  public vehicleCategoryEnum = VehicleCategoryEnumerator;
  customerTiers = TiersTypeEnumerator.Customer;
  vehicleSerachFormGroup: FormGroup;
  public filterValue = '';
  predicate: PredicateFormat = new PredicateFormat();
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public customerCategoryEnum = CustomerCategoryEnumerator;
  dateFormat = this.translateService.instant(SharedConstant.DATE_FORMAT);
  selectedIdTiers: number;
  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.REGISTRATION_NUMBER,
      title: GarageConstant.REGISTRATION_NUMBER_TITLE,
      filterable: true,
      tooltip: GarageConstant.REGISTRATION_NUMBER_TITLE
    },
    {
      field: GarageConstant.ID_MODEL,
      title: GarageConstant.MODEL_TITLE,
      filterable: true,
      tooltip: GarageConstant.MODEL_TITLE
    },
    {
      field: GarageConstant.CHASSIS_NUMBER,
      title: GarageConstant.CHASSI_NUMBER_TTILE,
      filterable: true,
      tooltip: GarageConstant.CHASSI_NUMBER_TTILE
    },
    {
      field: GarageConstant.ID_ENERGY,
      title: GarageConstant.ENERGY_TITLE,
      filterable: true,
      tooltip: GarageConstant.ENERGY_TITLE
    },
    {
      field: GarageConstant.IS_AVAILABLE,
      title: GarageConstant.AVAILABLE_TITLE,
      filterable: true,
      tooltip: GarageConstant.AVAILABLE_TITLE
    }
  ];

  gridSettings: GridSettings = {
    state: this.initialiseState(),
    columnsConfig: this.columnsConfig
  };

// Permission Parameters
public hasAddPermission: boolean;
public hasUpdatePermission: boolean;
public hasShowPermission: boolean;
public hasDeletePermission: boolean;
  public vehicleLoanStatusEnumerator = EnumValues.getNamesAndValues({
    NotAvailable: 0,
    Available: 1
  });
  constructor(public vehicleService: VehicleService, private router: Router, private swalWarrings: SwalWarring,
      private translateService: TranslateService, private authService: AuthService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.ADD_LOAN_VEHICLE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.UPDATE_LOAN_VEHICLE);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.SHOW_LOAN_VEHICLE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.DELETE_LOAN_VEHICLE);
    this.initialiseState();
    this.initGridDataSource();
  }

  initialiseState(): DataSourceRequestState {
    return {
      skip: 0,
      take: 20,
      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      },
      sort: [
        {
          field: 'Id',
          dir: 'desc'
        }
      ],
      group: []
    };
  }

  initGridDataSource() {
    if (!this.predicate.Filter) {
      this.predicate.Filter = new Array<Filter>();
    }
    this.vehicleLoanStatusEnumerator.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translateService.get(elem.name).subscribe(trans => elem.name = trans);
    });
    this.predicate.Filter.push(new Filter(GarageConstant.CATEGORY, Operation.eq, this.vehicleCategoryEnum.Loan));
    this.vehicleService.getVehicleListWithTiers(this.gridSettings.state, this.predicate).subscribe(data => {
      this.gridSettings.gridData = new Object() as DataResult;
      this.gridSettings.gridData.data = data.listData;
      this.gridSettings.gridData.total = data.total;
    });
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  goToAdvancedEdit(id: number) {
    this.router.navigateByUrl(GarageConstant.NAVIGATE_TO_EDIT_LOAN_VEHICLES.concat(id.toString()));
  }

  public removeHandler(dataItem: any) {
    this.swalWarrings.CreateSwal().then((result: { value: any; }) => {
      if (result.value) {
        this.vehicleService.remove(dataItem).subscribe(() => {
          this.gridSettings.state = this.initialiseState();
          this.initGridDataSource();
        });
      }
    });
  }

  public doFilter($event?) {
    this.predicate.Filter = new Array<Filter>();
    if (this.filterValue) {
      this.filterValue = this.filterValue ? this.filterValue.replace(/\s+/g, SharedConstant.BLANK_SPACE) : this.filterValue;
      this.predicate.Filter.push(new Filter(GarageConstant.REGISTRATION_NUMBER, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.CHASSIS_NUMBER, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.VEHICLE_BRAND_NAME_FROM_ID_BRAND_NAVIGATION,
        Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ID_VEHICLE_MODEL_NAVIGATION_TO_DESIGNATION,
        Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.VEHICLE_BRAND_CODE_FROM_ID_BRAND_NAVIGATION,
        Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.VEHICLE_MODEL_CODE_FROM_ID_BRAND_NAVIGATION,
        Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ID_VEHICLE_ENERGY_NAVIGATION_TO_NAME,
        Operation.contains, this.filterValue, false, true));
      const vehicleLoanStatusFiltered = this.vehicleLoanStatusEnumerator
        .filter(x => x.name.toLowerCase() === this.filterValue.toLowerCase());
      if (vehicleLoanStatusFiltered) {
        const loanVehicleStatusValue: any[] = vehicleLoanStatusFiltered.map(x => x.value);
        loanVehicleStatusValue.forEach((x) => {
          this.predicate.Filter.push(new Filter(GarageConstant.IS_AVAILABLE, Operation.eq, x, false, true));
        });
      }
    }
    this.gridSettings.state = this.initialiseState();
    this.initGridDataSource();
  }

  vehicleBrandPictureSrc(dataItem: Vehicle) {
    if (dataItem.IdVehicleBrandNavigation && dataItem.IdVehicleBrandNavigation.PictureFileInfo) {
      return SharedConstant.PICTURE_BASE + dataItem.IdVehicleBrandNavigation.PictureFileInfo.Data;
    }
  }
}
