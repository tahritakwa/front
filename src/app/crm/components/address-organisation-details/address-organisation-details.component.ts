import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Filter, Operation, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {CountryService} from '../../../administration/services/country/country.service';
import {CityService} from '../../../administration/services/city/city.service';

@Component({
  selector: 'app-address-organisation-details',
  templateUrl: './address-organisation-details.component.html',
  styleUrls: ['./address-organisation-details.component.scss']
})
export class AddressOrganisationDetailsComponent implements OnInit {
  @Input() address: FormGroup;

  private predicate: PredicateFormat = new PredicateFormat();
  public countries = [];
  public countriesFiltred = [];
  public cities = [];
  public citiesFiltred = [];

  constructor(private countryService: CountryService,
              private cityService: CityService) {
  }

  preparePredicateToGetCountry(idCountry: number): PredicateFormat {
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(
      new Filter('IdCountry', Operation.eq, idCountry));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation('IdCountryNavigation')]);
    return this.predicate;
  }

  fillRelatedCities(event) {
    if (this.city.value) {
      this.city.setValue(null);
    }
    if (event) {
      this.preparePredicateToGetCountry(event.Id);
      this.cityService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
        this.cities = data.listData;
        this.citiesFiltred = data.listData;
      });
      this.country.setValue(event.NameFr);
    }
  }

  ngOnInit() {
    this.getCountriesList();
  }

  getCountriesList() {
    this.countryService.listdropdown().subscribe((data: any) => {
      this.countries = data.listData;
      this.countriesFiltred = data.listData;
    });
  }

  get country(): FormGroup {
    return this.address.get('country') as FormGroup;
  }

  get city(): FormGroup {
    return this.address.get('city') as FormGroup;
  }

  get zipCode(): FormGroup {
    return this.address.get('zipCode') as FormGroup;
  }

  get extraAddress(): FormGroup {
    return this.address.get('extraAddress') as FormGroup;
  }

  handleCityFilter(citySearched) {
    this.citiesFiltred = this.cities.filter(city => city.Label.toLowerCase().indexOf(citySearched.toLowerCase()) !== -1);
  }
  handleCountryFilter(countrySearched) {
    this.countriesFiltred = this.countries.filter(country => country.NameFr.toLowerCase()
        .indexOf(countrySearched.toLowerCase()) !== -1 || country.NameEn.toLowerCase()
        .indexOf(countrySearched.toLowerCase()) !== -1);
  }
}
