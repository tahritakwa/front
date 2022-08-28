import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CountryService } from '../../../administration/services/country/country.service';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { LanguageService } from '../../services/language/language.service';
import { Languages, Language } from '../../../constant/shared/services.constant';
import { ReducedCountry } from '../../../models/administration/reduced-country.model';
import { Country } from '../../../models/administration/country.model';
import { OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../utils/predicate';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { UserCurrentInformationsService } from '../../services/utility/user-current-informations.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-country-dropdown',
  templateUrl: './country-dropdown.component.html',
  styleUrls: ['./country-dropdown.component.scss']
})
export class CountryDropdownComponent implements OnInit, DropDownComponent {
  @Input() group: FormGroup;
  @Input() allowCustom;
  @Input() idCountryColName;
  @Output() Selected = new EventEmitter<number>();
  @Output() itemSelected = new EventEmitter<Country>();
  @ViewChild(ComboBoxComponent) public country: ComboBoxComponent;
  public countryDataSource: ReducedCountry[];
  public countryFiltredDataSource: ReducedCountry[];
  public actuelLanguage: string;
  public predicate: PredicateFormat;

  public textName = this.languageService.selectedLang === Languages.FR.value ? 'NameFr' : 'NameEn';

  public SelectedValue: ReducedCountry;
  constructor(private countryService: CountryService, private localStorageService : LocalStorageService, private languageService: LanguageService) { }

  public Onchange(event): void {
    this.Selected.emit(event);
    if (this.countryDataSource) {
      const selectedValue = this.countryDataSource.filter(x => x.Id === event)[0];
      this.itemSelected.emit(selectedValue);
   }
  }
  ngOnInit() {
    if (!this.idCountryColName) {
      this.idCountryColName = SharedConstant.ID_COUNTRY;
    }
    this.initDataSource();
    if (!this.SelectedValue && this.group) {
      this.SelectedValue = this.group.controls[this.idCountryColName].value;
    }
    this.Onchange(this.SelectedValue);
  }

  initDataSource(): void {
    this.preparePredicate();
    this.countryService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
      this.countryDataSource = data.listData;
      this.countryFiltredDataSource = this.countryDataSource.slice(0);
    });
  }

  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(this.textName, OrderByDirection.asc));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push(new Relation('City'));
  }

  handleFilter(value: string): void {
    this.countryFiltredDataSource = this.countryDataSource.filter((s) =>
      this.localStorageService.getLanguage() === Languages.FR.value ?
        (s.Alpha2 != null && s.Alpha2.toLowerCase().includes(value.toLowerCase()) ?
            s.Alpha2.toLowerCase().includes(value.toLowerCase()) :
            (s.NameFr != null ?
                s.NameFr.toLowerCase().includes(value.toLowerCase()) :
                s.Code.toLowerCase().includes(value.toLowerCase())
            )
        ) :
        (s.Alpha3 != null && s.Alpha3.toLowerCase().includes(value.toLowerCase()) ?
            s.Alpha3.toLowerCase().includes(value.toLowerCase()) :
            (s.NameEn != null ?
              s.NameEn.toLowerCase().includes(value.toLowerCase()) :
              s.Code.toLowerCase().includes(value.toLowerCase()))
        )
    );
  }

  addNew(): void {
    throw new Error('Method not implemented.');
  }

  public setCountryData(cityId: number) {
    if (cityId) {
      const countryId = this.countryDataSource.filter(x => x.City)
        .filter(x => x.City.filter(y => y.Id === cityId).length > NumberConstant.ZERO)[NumberConstant.ZERO].Id;
      this.group.controls['IdCountry'].setValue(countryId);
    }
  }
}
