import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { OfficeConstant } from '../../../constant/shared/office.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { State } from '@progress/kendo-data-query';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { Router } from '@angular/router';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { OfficeService } from '../../services/office/office.service';
import { Filter, Operation, PredicateFormat, Relation, SpecFilter } from '../../../shared/utils/predicate';
import { TranslateService } from '@ngx-translate/core';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-office-list',
  templateUrl: './office-list.component.html',
  styleUrls: ['./office-list.component.scss']
})
export class OfficeListComponent implements OnInit, OnDestroy {
   public api = SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
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
      field: OfficeConstant.OFFICE_NAME,
      title: OfficeConstant.NAME,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
    },
    {
      field: OfficeConstant.RESPONSIBLE_NAME,
      title: OfficeConstant.RESPONSIBLE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED,
    },
    {
      field: OfficeConstant.COUNTRY,
      title: OfficeConstant.COUNTRY_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
    },
    {
      field: OfficeConstant.CITY_NAME,
      title: OfficeConstant.CITY_TITLE,
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  myPredicateList = [];
  public predicate = new PredicateFormat();
  office: string;
  public hasAddPermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowOfficePermission: boolean;
  public hasUpdateOfficePermission: boolean;


  private subscriptions: Subscription[]= [];

  constructor(private swalWarrings: SwalWarring,
    public officeService: OfficeService, private translate: TranslateService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_OFFICE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_OFFICE);
    this.hasShowOfficePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_OFFICE);
    this.hasUpdateOfficePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_OFFICE);
    this.initGridDataSource();
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.subscriptions.push(this.officeService.reloadServerSideDataWithListPredicate(this.gridSettings.state,
      this.getPredicatesWithRelations(),
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER)
      .subscribe(data => {
        this.gridSettings.gridData = data;
        this.gridSettings.gridData.data.forEach(OfficeCity => {
          if (OfficeCity.IdCityNavigation) {
            OfficeCity.IdCityNavigation.Label = `${this.translate.instant(OfficeCity.IdCityNavigation.Code)}`;
          }
          OfficeCity.OfficeName = `${this.translate.instant(OfficeCity.OfficeName)}`;
        });
      }
      ));
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(OfficeConstant.DELETE_TEXT_OFFICE, OfficeConstant.DELETE_TITLE_OFFICE).then((result) => {
      if (result.value) {
        this.subscriptions.push(this.officeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  public goToAdvancedEdit(id) {
    this.router.navigateByUrl(OfficeConstant.URL_Office_EDIT.concat(id));
  }

  public getPredicatesWithRelations() {

    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation,
    [new Relation(OfficeConstant.RESPONSIBLE_NAVIGATION)]);
    this.predicate.IsDefaultPredicate = true;
    this.gridSettings.state.filter.logic = SharedConstant.LOGIC_OR;
    this.myPredicateList = [];
    this.myPredicateList.push(this.predicate);
    return this.myPredicateList;
  }
  public filter() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(OfficeConstant.FILTER_VALUE, Operation.contains, this.office));
    this.initGridDataSource();
  }

  getCountriesForTooltip(countries) {
    let countriesTooltip = SharedConstant.EMPTY;
    if (isNotNullOrUndefinedAndNotEmptyValue(countries) && countries.length > 0) {
      countries.forEach(country => {
        if (isNotNullOrUndefinedAndNotEmptyValue(country.IdCountryNavigation)) {
          countriesTooltip += `${country.IdCountryNavigation.NameFr}<br>`;
        }
      });
      return countriesTooltip;
    }
  }

  getCitiesForTooltip(cities) {
    let citiesTooltip = SharedConstant.EMPTY;
    if (isNotNullOrUndefinedAndNotEmptyValue(cities) && cities.length > 0) {
      cities.forEach(city => {
        if (isNotNullOrUndefinedAndNotEmptyValue(city.IdCityNavigation)) {
          citiesTooltip += `${city.IdCityNavigation.Label}<br>`;
        }
      });
      return citiesTooltip;
    }
  }
  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

}
