import { Component, OnInit } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Router } from '@angular/router';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { GarageService } from '../../services/garage/garage.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-list-garage',
  templateUrl: './list-garage.component.html',
  styleUrls: ['./list-garage.component.scss']
})
export class ListGarageComponent implements OnInit {

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat = new PredicateFormat();
  public searchValue: string;
  garageList: any[];

  public columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.NAME,
      title: GarageConstant.NAME.toUpperCase(),
      filterable: true,
      tooltip: GarageConstant.NAME.toUpperCase()
    },
    {
      field: GarageConstant.PHONE_NUMBER,
      title: GarageConstant.PHONE.toUpperCase(),
      filterable: true,
      tooltip: GarageConstant.PHONE.toUpperCase()
    },
    {
      field: GarageConstant.NB_POSTE,
      title: GarageConstant.NB_POSTE_TITTLE.toUpperCase(),
      filterable: true,
      tooltip: GarageConstant.NB_POSTE_TITTLE.toUpperCase()
    },
    {
      field: GarageConstant.ID_WAREHOUSE,
      title: GarageConstant.WAREHOUSE_TTILE.toUpperCase(),
      filterable: true,
      tooltip: GarageConstant.WAREHOUSE_TTILE.toUpperCase()
    },
    {
      field: GarageConstant.ID_CITY,
      title: GarageConstant.CITY_TTILE.toUpperCase(),
      filterable: true,
      tooltip: GarageConstant.CITY_TTILE.toUpperCase()
    },
    {
      field: GarageConstant.ID_RESPONSIBLE,
      title: GarageConstant.RESPONSIBLE.toUpperCase(),
      filterable: true,
      tooltip: GarageConstant.RESPONSIBLE.toUpperCase()
    },
  ];

  public gridState: State = {
    skip: 0,
    take: 20,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

// Permission Parameters
public hasAddPermission: boolean;
public hasUpdatePermission: boolean;
public hasShowPermission: boolean;
public hasDeletePermission: boolean;
  constructor(private swalWarrings: SwalWarring, private router: Router,
    public garageService: GarageService, private authService: AuthService) {
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_GARAGE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_GARAGE);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.SHOW_GARAGE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.DELETE_GARAGE);
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.preparePredicate();
    this.garageService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe(data => {
      this.gridSettings.gridData = data;
    }
  );
  }

  preparePredicate() {
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(GarageConstant.POST_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(GarageConstant.ID_RESPONSIBLE_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(GarageConstant.ID_PHONE_NAVIGATION)]);

  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(GarageConstant.GARAGE_EDIT_URL.concat(dataItem.Id));
  }

  public removeHandler(dataItem ) {
    this.swalWarrings.CreateSwal(GarageConstant.DELETE_MESSAGE).then((result) => {
      if (result.value) {
        this.garageService.remove(dataItem).subscribe(() => {
          this.gridSettings.state = this.gridState;
          this.initGridDataSource();
        });
      }
    });
  }
  filter() {
    if (this.searchValue) {
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(new Filter(GarageConstant.NAME, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ID_PHONE_NAVIGATION_TO_NUMBER, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ID_PHONE_NAVIGATION_TO_DIAL_CODE, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ID_RESPONSIBLE_NAVIGATION_FIRST_NAME,
        Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(GarageConstant.ID_RESPONSIBLE_NAVIGATION_LAST_NAME,
          Operation.contains, this.searchValue, false, true));
    } else {
      this.predicate.Filter = new Array<Filter>();
    }
    this.gridSettings.state = this.gridState;
    this.initGridDataSource();
  }
}
