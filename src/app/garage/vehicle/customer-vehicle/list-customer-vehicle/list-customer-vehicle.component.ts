import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, DataSourceRequestState, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { isNullOrUndefined } from 'util';
import { GarageConstant } from '../../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { CustomerCategoryEnumerator } from '../../../../models/enumerators/customer-category.enum';
import { TiersTypeEnumerator } from '../../../../models/enumerators/tiers-type.enum';
import { VehicleCategoryEnumerator } from '../../../../models/enumerators/vehicle-category.enum';
import { Vehicle } from '../../../../models/garage/vehicle.model';
import { FileInfo } from '../../../../models/shared/objectToSend';
import { SupplierDropdownComponent } from '../../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { SwalWarring } from '../../../../shared/components/swal/swal-popup';
import { FileService } from '../../../../shared/services/file/file-service.service';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../../shared/utils/predicate';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { VehicleService } from '../../../services/vehicle/vehicle.service';

@Component({
  selector: 'app-list-customer-vehicle',
  templateUrl: './list-customer-vehicle.component.html',
  styleUrls: ['./list-customer-vehicle.component.scss']
})
export class ListCustomerVehicleComponent implements OnInit {
  @ViewChild('customerViewChild') customerViewChild: SupplierDropdownComponent;
  searchFormGroup: FormGroup;
  public formGroup: FormGroup;
  public vehicleCategoryEnum = VehicleCategoryEnumerator;
  customerTiers = TiersTypeEnumerator.Customer;
  vehicleSerachFormGroup: FormGroup;
  public filterValue = '';
  predicate: PredicateFormat = new PredicateFormat();
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public customerCategoryEnum = CustomerCategoryEnumerator;
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  forSearch = true;
  private importFileEmployes: FileInfo;
  dataImported: boolean;
  importData: Array<Vehicle>;
  private subscriptions: Subscription[] = [];

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
      field: GarageConstant.LAST_INTERVENTION_DATE,
      title: GarageConstant.LAST_INTERVENTION_DATE_TITLE,
      filterable: true,
      tooltip: GarageConstant.LAST_INTERVENTION_DATE_TOOTLIP
    },
    {
      field: GarageConstant.ID_TIERS,
      title: GarageConstant.CUSTOMER,
      filterable: true,
      tooltip: GarageConstant.CUSTOMER
    },
    {
      field: GarageConstant.TIERS_CLASSIFICATION,
      title: GarageConstant.CUSTOMER_CLASSIFICATION,
      filterable: true,
      tooltip: GarageConstant.CUSTOMER_CLASSIFICATION_TOOLTIP
    }
  ];

  gridSettings: GridSettings = {
    state: this.initialiseState(),
    columnsConfig: this.columnsConfig
  };
  // import columns config
  public importColumnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.REGISTRATION_NUMBER,
      title: GarageConstant.REGISTRATION_NUMBER_TITLE,
      filterable: true,
      tooltip: GarageConstant.REGISTRATION_NUMBER_TITLE
    },
    {
      field: GarageConstant.ID_VEHICLE_BRAND,
      title: GarageConstant.BRAND_TITLE,
      filterable: true,
      tooltip: GarageConstant.BRAND_TITLE
    },
    {
      field: GarageConstant.ID_VEHICLE_MODEL,
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
      field: GarageConstant.POWER,
      title: GarageConstant.POWER_TITLE,
      filterable: true,
      tooltip: GarageConstant.POWER_TITLE
    },
    {
      field: GarageConstant.ID_TIERS,
      title: GarageConstant.CUSTOMER,
      filterable: true,
      tooltip: GarageConstant.CUSTOMER
    },
  ];

      // Permission Parameters
      public hasAddPermission: boolean;
      public hasUpdatePermission: boolean;
      public hasShowPermission: boolean;
      public hasDeletePermission: boolean;
  constructor(public vehicleService: VehicleService, private router: Router, private swalWarrings: SwalWarring,
      public fb: FormBuilder, private authService: AuthService, private translate: TranslateService,
      protected fileService: FileService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.ADD_CUSTOMER_VEHICLE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.UPDATE_CUSTOMER_VEHICLE);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.SHOW_CUSTOMER_VEHICLE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.DELETE_CUSTOMER_VEHICLE);
    this.initialiseState();
    this.initGridDataSource();
    this.createImportVehicleFormGroup();
    this.createSearchForm();
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
  createSearchForm() {
    this.searchFormGroup = this.fb.group({
      IdTiers: [undefined]
    });
  }
  initGridDataSource() {
    if (!this.predicate.Filter) {
      this.predicate.Filter = new Array<Filter>();
    }
    this.predicate.Filter.push(new Filter(GarageConstant.CATEGORY, Operation.eq, this.vehicleCategoryEnum.Customer));
    this.vehicleService.getVehicleListWithTiers(this.gridSettings.state, this.predicate).subscribe(result => {
      this.gridSettings.gridData = new Object() as DataResult;
      this.gridSettings.gridData.data = result.listData;
      this.gridSettings.gridData.total = result.total;
      });
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  goToAdvancedEdit(id: number) {
    this.router.navigateByUrl(GarageConstant.NAVIGATE_TO_EDIT_CUSTOMERS_VEHICLES.concat(id.toString()));
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
    const formGroupData = this.searchFormGroup.getRawValue();
    if (formGroupData && formGroupData.IdTiers) {
      this.predicate.Filter.push(new Filter(GarageConstant.ID_TIERS, Operation.eq, formGroupData.IdTiers));
    }
    if (this.filterValue) {
      this.filterValue = this.filterValue ? this.filterValue.replace(/\s+/g, SharedConstant.BLANK_SPACE) : this.filterValue;
      this.predicate.Filter.push(new Filter(GarageConstant.REGISTRATION_NUMBER, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.CHASSIS_NUMBER, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.VEHICLE_BRAND_CODE_FROM_ID_BRAND_NAVIGATION,
        Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.VEHICLE_MODEL_CODE_FROM_ID_BRAND_NAVIGATION,
        Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ID_VEHICLE_MODEL_NAVIGATION_TO_DESIGNATION,
        Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.BRAND_NAME_FROM_ID_BRAND_NAVIGATION,
        Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ID_VEHICLE_ENERGY_NAVIGATION_TO_NAME,
        Operation.contains, this.filterValue, false, true));
      if (this.customerViewChild) {
        const customerFilteredData = this.customerViewChild.supplierDataSource.filter((s) =>
          s.Name.toLowerCase().includes(this.filterValue.toLowerCase())
          || s.CodeTiers.toLowerCase().includes(this.filterValue.toLowerCase()));
        if (customerFilteredData) {
          const customerFilteredIds = customerFilteredData.map(x => x.Id);
          customerFilteredIds.forEach((x) => {
            this.predicate.Filter.push(new Filter(GarageConstant.ID_TIERS, Operation.eq, x, false, true));
          });
        }
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
  public downLoadFile() {
    this.vehicleService.downloadCustomerVehicleExcelTemplate().subscribe(
      res => {
        this.fileService.downLoadFile(res);
      });
  }

  public createImportVehicleFormGroup() {
    this.formGroup = this.fb.group({
      IdTiers: [{value: '', disabled: true}, Validators.required],
      IdVehicleBrand: [undefined],
      IdVehicleModel: [undefined],
      RegistrationNumber: [{value: '', disabled: true}, Validators.required],
      ChassisNumber: [undefined],
      Power: [undefined],
      IdVehicleEnergy: [undefined],
    });
  }

  public incomingFile(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.importFileEmployes = FileInfo.generateFileInfoFromFile(file, reader);
        this.subscriptions.push(this.vehicleService.uploadVehicle(this.importFileEmployes).subscribe((res: Array<Vehicle>) => {
          this.dataImported = true;
          this.importData = res;
        }));
      };
    }
  }

  /**
   * on Close Popup Import
   * */
   onClosePopupImport() {
    this.dataImported = false;
  }
  /**
   * save Imported Date
   * @param myData
   */
   public saveImportedData(myData: Array<Vehicle>) {
    if (myData.length !== NumberConstant.ZERO || !isNullOrUndefined(myData)) {
      this.subscriptions.push(this.vehicleService.saveImportedData(myData).subscribe(res => {
      this.dataImported = false;
      this.initGridDataSource();
    }));
  }
  }

}
