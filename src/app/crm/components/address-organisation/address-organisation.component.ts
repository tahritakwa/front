import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {CountryService} from '../../../administration/services/country/country.service';
import {Filter, Operation, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {CityService} from '../../../administration/services/city/city.service';
import {GenericCrmService} from '../../generic-crm.service';
import {Address} from '../../../models/crm/address.model';

@Component({
  selector: 'app-address-organisation',
  templateUrl: './address-organisation.component.html',
  styleUrls: ['./address-organisation.component.scss']
})
export class AddressOrganisationComponent implements OnInit {
  @Input() address: FormGroup;
  @Input() isUpdateMode = true;
  @Input() indexAdress: number;
  public adressToSend = new Address();
  public addresses: Address[] = [];
  public countries = [];
  public countriesFilter = [];
  public cities = [];
  public citiesFilter = [];
  private predicate: PredicateFormat = new PredicateFormat();
  public cityName: string;
  public idCountrySaved: number;

  preparePredicateToGetCountry(idCountry: number): PredicateFormat {
    this.adressToSend.IdCountry = idCountry;
    this.idCountrySaved = idCountry;
    this.address.patchValue({
      idCountry: idCountry
    });
    const Adrss = new Address();
    const size = this.addresses.length;
    if (this.addresses[this.indexAdress] === undefined) {
    }
    // this.addresses[this.indexAdress].IdCountry = idCountry ;
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
        this.citiesFilter = data.listData;
      });
      this.country.setValue(event.NameFr);
    }
  }

  /**
   *
   * @param countryService
   * @param cityService
   * @param genericCrmService
   */
  constructor(private countryService: CountryService,
              private cityService: CityService,
              private genericCrmService: GenericCrmService) {
  }

  ngOnInit() {
    this.getCountriesList();
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

  getCountriesList() {
    this.countryService.listdropdown().subscribe((data: any) => {
      this.countries = data.listData;
      this.countriesFilter = data.listData;
    });
  }

  handleCountriesFilter(value) {
    this.countries = this.countriesFilter.filter((s) => s.NameFr.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handleCitiesFilter(value) {
    this.cities = this.citiesFilter.filter((s) => s.Code.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handleCityName(value) {
    this.preparePredicateToGetCountry(this.idCountrySaved);
    this.cityService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
      this.cities = data.listData;
      this.citiesFilter = data.listData;
      this.cities.forEach((e) => {
        if (e.Code === value) {
          this.address.patchValue({
            idCity: e.Id
          });
        }

      });
    });
    this.cityName = value;
  }
}
