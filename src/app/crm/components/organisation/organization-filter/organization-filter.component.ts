import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {EnumValues} from 'enum-values';
import {OrganizationFilterTypeEnum} from '../../../../models/crm/enums/organizationFilterType.enum';
import {ActivitySectorsEnum} from '../../../../models/shared/enum/activitySectors.enum';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {OrganizationListParams} from '../../../../models/crm/organizationListParams';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {Filter, Operation, PredicateFormat, Relation} from '../../../../shared/utils/predicate';
import {CountryService} from '../../../../administration/services/country/country.service';
import {CityService} from '../../../../administration/services/city/city.service';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {TiersConstants} from '../../../../constant/purchase/tiers.constant';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {StyleConstant} from '../../../../constant/utility/style.constant';
import {FiltrePredicateModel} from '../../../../models/shared/filtrePredicate.model';
import {DropdownService} from '../../../services/dropdowns/dropdown.service';

@Component({
  selector: 'app-organization-filter',
  templateUrl: './organization-filter.component.html',
  styleUrls: ['./organization-filter.component.scss']
})
export class OrganizationFilterComponent implements OnInit, OnChanges {

  // this object will contain object to be send to the backend side to do the filter or search or both
  private organizationFilterParams = new OrganizationListParams();
  @Input()
  actions;

  @Input() paramsFromOrgList;
  @Input() prospectType;
  @Input() isArchivingMode;
  @Input() gridSettings: GridSettings;

  public searchValue = '';

  public selectedFilter = OrganisationConstant.ALL_ORGANIZATIONS;
  public organizationsFilter = OrganizationFilterTypeEnum;
  public chosenFilterNumber = this.organizationsFilter.ALL_ORGANIZATIONS;


  public activitySectors = [];

  // the sender of the data to the parent
  @Output() sendData = new EventEmitter<any>();


  public finalResult;

  public actSectorDefaultItem = 'ALL_ACTIVITY_SECTOR';
  private predicate: PredicateFormat = new PredicateFormat();
  private predicateClient: PredicateFormat = new PredicateFormat();


  public selectedCountry;
  public selectedCity;
  public countries = [];
  public countriesFilter = [];
  public cities = [];
  public citiesFilter = [];
  public showCountryCityCol = true;
  public isContentVisible = false;
  public fieldsetBorderShowed = StyleConstant.BORDER_SOLID;
  public fieldsetBorderHidden = StyleConstant.BORDER_NONE;
  public fieldsetBorderStyle: string;
  public isBtnSearchDisabled = false;
  @Output() public resetClickEvent = new EventEmitter<boolean>();
  @Output() public filterFieldsInputsChange = new EventEmitter<any>();
  public activitySectorsFiltred = [];
  public activitySectorFromFilter =  'ALL_ACTIVITY_SECTOR';
  public countrySelected = false;
  public citySelected = false;
  public activitySector = false;
  ngOnInit(): void {
    this.fillActivitySectors();
    this.getCountriesList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.organizationFilterParams.pageNumber = this.paramsFromOrgList.pageNumber;
    this.organizationFilterParams.isArchived = this.isArchivingMode;
    this.organizationFilterParams.pageSize = this.paramsFromOrgList.pageSize;
    this.organizationFilterParams.searchValue = this.searchValue;

    if (this.prospectType) {
  this.initGridDataSource();
    }

  }


  preparePredicateToGetCountry(idCountry: number): PredicateFormat {
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(
      new Filter('IdCountry', Operation.eq, idCountry));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation('IdCountryNavigation')]);
    return this.predicate;
  }

  getCountriesList() {
    this.cities = [];
    this.selectedCity = null;
    this.selectedCountry = null;
    this.countries = [];
    this.countryService.listdropdown().subscribe((data: any) => {
      this.countries = data.listData;
      this.countriesFilter = data.listData;
    });
  }

  fillRelatedCities(event) {
    if (event) {
      this.cities = [];
      this.preparePredicateToGetCountry(event.Id);
      this.cityService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
        this.cities = data.listData;
        this.citiesFilter = data.listData;
      });
      this.filterByCountry(event.NameFr);
    } else {
      if (this.selectedCity) {
        this.selectedCity = null;
      }
      this.organizationFilterParams.filterValue = null;
      this.organizationFilterParams.filterType = null;
      this.showCountryCityCol = true;
      this.initGridDataSource();
    }
  }

  constructor(private organizationService: OrganisationService,
              private countryService: CountryService,
              private cityService: CityService,
              public tiersService: TiersService,
              private dropdownService: DropdownService) {
  }

  /**
   * filter the kendo data grid with the chosen index filter
   * @param chosenFilter
   */
  filterOrganization(chosenFilter) {
    this.chosenFilterNumber = chosenFilter;

    this.organizationFilterParams.filterValue = null;
    this.organizationFilterParams.filterType = null;
    this.showCountryCityCol = true;
    switch (chosenFilter) {

      case this.organizationsFilter.ALL_ORGANIZATIONS : {

        this.selectedFilter = OrganisationConstant.ALL_ORGANIZATIONS;

      }
        break;
      case this.organizationsFilter.BY_CITY_COUNTRY: {
        this.getCountriesList();
        this.selectedFilter = OrganisationConstant.BY_CITY_COUNTRY;

      }
        break;

      case this.organizationsFilter.BY_ACTIVITY_SECTOR : {
        this.fillActivitySectors();
        this.selectedFilter = OrganisationConstant.BY_ACTIVITY_SECTOR;
      }
        break;

    }
    this.initGridDataSource();
  }

  filterByActivitySector(event) {
    this.activitySector = true;
  }

  search() {
    this.resetPageNumberAndSkip();
    this.organizationFilterParams.searchValue = this.searchValue ? this.searchValue : '';
    if (this.prospectType) {
      this.initGridDataSource();
    } else {
      this.checkSearchValueAndSearch();
    }
  }

  private resetPageNumberAndSkip() {
    if (this.searchValue !== this.organizationFilterParams.searchValue) {
      this.organizationFilterParams.pageNumber = 1;
      this.gridSettings.state.skip = 0;
    }
  }

  private checkSearchValueAndSearch() {
    if (this.searchValue) {
      this.searchClientOrganization();
    } else {
      this.sendFilterAndSearchValues(null);
    }
  }

  private searchClientOrganization() {
    this.initSearchClientOrganizationPredicate();
    this.tiersService.reloadServerSideData(this.gridSettings.state, this.predicateClient,
      TiersConstants.GET_DATASOURCE_PREDICATE_TIERS).subscribe(data => {
      if (data) {
        this.finalResult = {
          data: data
        };
      }
      this.sendFilterAndSearchValues(this.finalResult);
    });
  }

  private initSearchClientOrganizationPredicate() {
    this.predicateClient = new PredicateFormat();
    this.predicateClient.Filter = new Array<Filter>();
    this.predicateClient.Filter.push(new Filter('Name', Operation.contains, this.searchValue, false, true));
    this.predicateClient.Filter.push(new Filter('CodeTiers', Operation.contains, this.searchValue, false, true));
    this.predicateClient.Relation = new Array<Relation>();
    this.predicateClient.Relation.push(new Relation(TiersConstants.ID_CURRENCY_NAVIGATION));
    this.predicateClient.Relation.push(new Relation(TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION));
    this.predicateClient.Filter.push(new Filter(TiersConstants.ID_TYPE_TIERS, Operation.eq, TiersConstants.CUSTOMER_TYPE));
  }

  /**
   * Fill the kendo with data
   */
  initGridDataSource() {
    this.organizationService.getOrganizationByParam(this.organizationFilterParams).subscribe((data) => {
      if (data) {
        this.finalResult = {
          data: data.organisationDtoList,
          total: data.totalElements
        };
      }
      this.sendFilterAndSearchValues(this.finalResult);
    });
  }

  sendFilterAndSearchValues(filterAndSearchObject) {
    this.sendData.emit({
      'value': filterAndSearchObject,
      'showCityCountry': this.showCountryCityCol,
      'showColActSector': true
    });
  }

  filterByCountry(event) {
    if (event) {
      this.countrySelected = true;
    }
    else {
      this.countrySelected = false;
    }
  }

  filterByCity(event) {
    if (event) {
      this.citySelected = true;
    }
    else {
      this.citySelected = false;
    }
    /*else {
      this.organizationFilterParams.filterType = OrganizationFilterTypeEnum[OrganizationFilterTypeEnum.BY_CITY_COUNTRY];
      this.organizationFilterParams.filterValue = this.selectedCountry.NameFr;
    }*/

  }

  handleCountriesFilter(value) {
    this.countries = this.countriesFilter.filter((s) => s.NameFr.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handleCitiesFilter(value) {
    this.cities = this.citiesFilter.filter((s) => s.Code.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  showContent() {
    this.isContentVisible = true;
    this.fieldsetBorderStyle = this.fieldsetBorderShowed;
  }

  hideContent() {
    this.isContentVisible = false;
    this.fieldsetBorderStyle = this.fieldsetBorderHidden;

  }

  fillActivitySectors() {
    this.dropdownService.getAllFiltreByName('ACTIVITY_SECTOR', 'ORGANIZATION')
      .subscribe(data => {
        if (data) {
          this.activitySectors.push(this.actSectorDefaultItem);
          data.forEach((filtreName) => {
              this.activitySectors.push(filtreName.name);
              this.activitySectorsFiltred.push(filtreName.name);
            }
          );
        }
      });
  }

  searchFilter() {
    if (this.activitySector && !this.citySelected && !this.countrySelected) {
      if (this.activitySectorFromFilter === this.actSectorDefaultItem) {
        this.organizationFilterParams.filterValue = null;
        this.organizationFilterParams.filterType = null;
      } else {
        this.organizationFilterParams.filterValue = this.activitySectorFromFilter;
        this.organizationFilterParams.filterType = OrganizationFilterTypeEnum[OrganizationFilterTypeEnum.BY_ACTIVITY_SECTOR];
      }
    }
    if (!this.activitySector && this.citySelected && this.countrySelected) {
      this.organizationFilterParams.filterValue = this.selectedCity;
      this.organizationFilterParams.filterType = OrganizationFilterTypeEnum[OrganizationFilterTypeEnum.BY_CITY_COUNTRY];
      this.showCountryCityCol = false;
    }
    if (!this.activitySector && !this.citySelected && this.countrySelected) {
      this.organizationFilterParams.filterValue = this.selectedCountry.NameFr;
      this.organizationFilterParams.filterType = OrganizationFilterTypeEnum[OrganizationFilterTypeEnum.BY_CITY_COUNTRY];
      this.showCountryCityCol = false;
    }
    if (this.activitySector && this.citySelected && this.countrySelected) {
      const value = [];
      value.push(this.activitySectorFromFilter);
      value.push(this.selectedCity);
      this.organizationFilterParams.filterValue = value;
      this.organizationFilterParams.filterType = OrganizationFilterTypeEnum[OrganizationFilterTypeEnum.BY_ACTIVITY_SECTOR_AND_BY_CITY_COUNTRY];
      this.showCountryCityCol = false;
    }

    if (this.activitySector && !this.citySelected && this.countrySelected) {
      const value = [];
      value.push(this.activitySectorFromFilter);
      value.push(this.selectedCountry.NameFr);
      this.organizationFilterParams.filterValue = value;
      this.organizationFilterParams.filterType = OrganizationFilterTypeEnum[OrganizationFilterTypeEnum.BY_ACTIVITY_SECTOR_AND_BY_CITY_COUNTRY];
      this.showCountryCityCol = false;
    }
    this.organizationFilterParams.pageNumber = 1;
    this.initGridDataSource();
  }

  resetFieldValues() {
    this.selectedCity = null;
    this.selectedCountry = null;
    this.activitySectorFromFilter = this.actSectorDefaultItem;
    this.activitySector = false;
    this.citySelected = false;
    this.countrySelected = false;
    this.organizationFilterParams.filterValue = null;
    this.organizationFilterParams.filterType = null;
    this.showCountryCityCol = true;
    this.initGridDataSource();
  }
}
