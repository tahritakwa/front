import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PredicateFormat, Filter, Operation, OrderBy, OrderByDirection } from '../../utils/predicate';
import { Country } from '../../../models/administration/country.model';
import { CityService } from '../../../administration/services/city/city.service';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { ReducedCity } from '../../../models/administration/reduced-city.model';
import { TranslateService } from '@ngx-translate/core';
import { CompanyConstant } from '../../../constant/Administration/company.constant';
import { City } from '../../../models/administration/city.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-city-dropdown',
  templateUrl: './city-dropdown.component.html',
  styleUrls: ['./city-dropdown.component.scss']
})
export class CityDropdownComponent implements OnInit, DropDownComponent {
  @Input() allowCustom;
  @Input() group;
  @Input() disabled;
  @Input() showFooter = false;
  @Input() isFromFilter = false;
  GetCountry = true;
  predicate: PredicateFormat;
  @Output() selected = new EventEmitter<number>();
  @ViewChild(ComboBoxComponent) public city: ComboBoxComponent;

  // data sources
  public cityDataSource: ReducedCity[];
  public cityFiltredDataSource: ReducedCity[];
  @Input() countryId: number;
  private country: Country;
  public selectedCity: City;

  constructor(private translate: TranslateService, private cityService: CityService) { }

  ngOnInit() {
    if (this.isFromFilter) {
      this.GetCountry = false;
      this.initDataSource();
    } else {
      if (!this.selectedCity && this.group) {
        this.selectedCity = this.group.controls[CompanyConstant.ID_CITY].value;
      }
      this.handleCityChange(this.selectedCity);
    }
  }

  public setCity(country: Country) {
    if (country) {
      this.countryId = country.Id;
      this.GetCountry = false;
      this.initDataSource();
    }
  }
  public setCityData(id: number) {
    if (id) {
      this.countryId = id;
      this.GetCountry = false;
      this.initDataSource();
    }
  }
  preparePredicate(id: number): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter('IdCountry', Operation.eq, id));
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.CODE, OrderByDirection.asc));
  }
  initDataSource(): void {
    this.preparePredicate(this.countryId);
    this.cityService.readDropdownPredicateData(this.predicate).subscribe(data => {
      this.cityDataSource = data;
      this.cityDataSource.forEach(cityLabel => {
        cityLabel.Label = `${this.translate.instant(cityLabel.Code)}`;
      });
      this.cityFiltredDataSource = this.cityDataSource.slice(0);
    });
  }

  handleFilter(value: string): void {
    this.cityFiltredDataSource = this.cityDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase()));
  }

  public handleCityChange(event): void {
    this.selected.emit(event);
    if (this.isFromFilter) {
      this.countryId = event ? this.cityDataSource.filter(x => x.Id === event)[0].IdCountry : this.countryId;
      this.cityFiltredDataSource = this.cityDataSource.filter(x => x.IdCountry === this.countryId);
    }
  }

}
