import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { EnumValues } from 'enum-values';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { TypeUnitEnumerator } from '../../../models/enumerators/type-unit.enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { UnitService } from '../../services/unit/unit.service';
const All_Types = EnumValues.getNamesAndValues(TypeUnitEnumerator).length + 1;
@Component({
  selector: 'app-list-unit',
  templateUrl: './list-unit.component.html',
  styleUrls: ['./list-unit.component.scss']
})
export class ListUnitComponent implements OnInit {

  pagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS_REDUCED;
  typeUnitEnumerator = TypeUnitEnumerator;
  unitTypeDataSource = EnumValues.getNamesAndValues(this.typeUnitEnumerator);
  predicate: PredicateFormat;
  public filterValue = '';
  public filterFormGroup: FormGroup;
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
      title: GarageConstant.NAME_TITLE,
      filterable: true,
      tooltip: GarageConstant.NAME_TITLE
    },
    {
      field: GarageConstant.QUANTITY,
      title: GarageConstant.QUANTITY_TITLE,
      filterable: true,
      tooltip: GarageConstant.QUANTITY_TITLE
    },
    {
      field: GarageConstant.TYPE,
      title: GarageConstant.TYPE_TITLE,
      filterable: true,
      tooltip: GarageConstant.TYPE_TITLE
    }
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
  constructor(public unitService: UnitService, private swalWarrings: SwalWarring, private router: Router, private fb: FormBuilder,
      private authService: AuthService, private translateService: TranslateService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_UNIT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_UNIT);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.SHOW_UNIT);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.DELETE_UNIT);
    this.createFilterFormGroup();
    this.unitTypeDataSource.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translateService.get(elem.name).subscribe(trans => elem.name = trans);
    });
    this.initGridDataSource();
  }

  createFilterFormGroup() {
    this.filterFormGroup = this.fb.group({
      Type: [All_Types]
    });
  }

  initGridDataSource() {
    this.unitService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe((data) => {
      this.gridSettings.gridData = data;
    });
  }

  dataStateChange($event: State) {
    this.gridSettings.state = $event;
    this.initGridDataSource();
  }

  goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(GarageConstant.UPDATE_UNIT_URL.concat(dataItem.Id));
  }

  public doFilter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (this.Type.value && (this.Type.value !== All_Types)) {
      this.predicate.Filter.push(new Filter(GarageConstant.TYPE, Operation.eq, this.Type.value));
    }
    if (this.filterValue) {
      this.filterValue = this.filterValue ? this.filterValue.replace(/\s+/g, SharedConstant.BLANK_SPACE) : this.filterValue;
      this.predicate.Filter.push(new Filter(GarageConstant.NAME, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.QUANTITY, Operation.contains, this.filterValue, false, true));

      const unitTypeFiltered = this.unitTypeDataSource
        .filter(x => x.name.toLowerCase().indexOf(this.filterValue.toLowerCase()) !== -1);
      if (unitTypeFiltered) {
        const unitTypeValue: any[] = unitTypeFiltered.map(x => x.value);
        unitTypeValue.forEach((x) => {
          this.predicate.Filter.push(new Filter(GarageConstant.TYPE, Operation.eq, x, false, true));
        });
      }
    }
    this.gridSettings.state = this.gridState;
    this.initGridDataSource();
  }

  removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.unitService.remove(dataItem).subscribe(() => {
          this.gridSettings.state = this.gridState;
          this.initGridDataSource();
        });
      }
    });
  }

  get Type(): FormControl {
    return this.filterFormGroup.get(GarageConstant.TYPE) as FormControl;
  }

}
