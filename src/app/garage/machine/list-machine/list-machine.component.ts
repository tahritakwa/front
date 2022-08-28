import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { EnumValues } from 'enum-values';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { MachineStateEnumerator } from '../../../models/enumerators/machine-state-enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { MachineService } from '../../services/machine/machine.service';

const All_State = NumberConstant.THREE;
@Component({
  selector: 'app-list-machine',
  templateUrl: './list-machine.component.html',
  styleUrls: ['./list-machine.component.scss']
})
export class ListMachineComponent implements OnInit {

  public filterFormGroup: FormGroup;

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public machineStateEnumerator = MachineStateEnumerator;
  machineStateDataSource = EnumValues.getNamesAndValues(this.machineStateEnumerator);
  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.NAME,
      title: GarageConstant.MACHINE_NAME_TITLE,
      filterable: true,
      tooltip: GarageConstant.MACHINE_NAME_TITLE
    },
    {
      field: GarageConstant.CONSTRUCTOR,
      title: GarageConstant.CONSTRUCTOR_TITLE,
      filterable: true,
      tooltip: GarageConstant.CONSTRUCTOR_TITLE
    },
    {
      field: GarageConstant.MODEL,
      title: GarageConstant.MODEL_TITLE,
      filterable: true,
      tooltip: GarageConstant.MODEL_TITLE
    },
    {
      field: GarageConstant.STATE,
      title: GarageConstant.STATE_TITLE,
      filterable: true,
      tooltip: GarageConstant.STATE_TITLE
    }
  ];

  public filterValue = '';
  public gridSettings: GridSettings = {
    state: this.initialiseState(),
    columnsConfig: this.columnsConfig,
  };

  predicate: PredicateFormat = new PredicateFormat();

  initialiseState(): State {
    return {
      skip: 0,
      take: 20,
      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      }
    };
  }

  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  constructor(private router: Router, private swalWarrings: SwalWarring,
    private fb: FormBuilder, public machineService: MachineService,
      private authService: AuthService, private translateService: TranslateService) { }

  /**
   * Intialise the component
   */
  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_MACHINE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_MACHINE);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.SHOW_MACHINE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.DELETE_MACHINE);
    this.createFilterFormGroup();
    this.machineStateDataSource.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translateService.get(elem.name).subscribe(trans => elem.name = trans);
    });
    this.initGridDataSource();
  }

  createFilterFormGroup() {
    this.filterFormGroup = this.fb.group({
      State: [All_State]
    });
  }

  /**
   * Intialise Grid with intial state
   */
  initGridDataSource() {
    this.machineService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe(data => {
      this.gridSettings.gridData = data;
    }
    );
  }

  /**
   * change grid data while changing
   * @param state
   */
  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  /**
   * Search with key
   */
  public doFilter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (this.filterValue) {
      this.filterValue = this.filterValue ? this.filterValue.replace(/\s+/g, SharedConstant.BLANK_SPACE) : this.filterValue;
      this.predicate.Filter.push(new Filter(GarageConstant.NAME, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.CONSTRUCTOR, Operation.contains, this.filterValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.MODEL, Operation.contains, this.filterValue, false, true));

      const machineStateFiltered = this.machineStateDataSource
        .filter(x => x.name.toLowerCase() === this.filterValue.toLowerCase());
      if (machineStateFiltered) {
        const machineStateValue: any[] = machineStateFiltered.map(x => x.value);
        machineStateValue.forEach((x) => {
          this.predicate.Filter.push(new Filter(GarageConstant.STATE, Operation.eq, x, false, true));
        });
      }
    }
    if (this.State.value && this.State.value !== All_State) {
      this.predicate.Filter.push(new Filter(GarageConstant.STATE, Operation.eq, this.State.value));
    }
    this.gridSettings.state = this.initialiseState();
    this.initGridDataSource();
  }

  /**
   * Remove a machine in list
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(GarageConstant.DELETE_MESSAGE).then((result) => {
      if (result.value) {
        this.machineService.remove(dataItem).subscribe(() => {
          this.gridSettings.state = this.initialiseState();
          this.initGridDataSource();
        });
      }
    });
  }

  /**
   * Navigate to Edit Page
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(GarageConstant.MACHINE_EDIT_URL.concat(dataItem.Id), { queryParams: dataItem, skipLocationChange: true });
  }

  get State(): FormControl {
    return this.filterFormGroup.controls.State as FormControl;
  }
}
