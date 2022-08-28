import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';
import { TiersAddressConstants } from '../../../constant/purchase/tiersAddress.constant';
import { ValidationService } from '../../services/validation/validation.service';
import { SwalWarring } from '../swal/swal-popup';
import { CountryService } from '../../../administration/services/country/country.service';
import { CityService } from '../../../administration/services/city/city.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../utils/predicate';
import { CompanyConstant } from '../../../constant/Administration/company.constant';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import {isNullOrEmptyString} from '@progress/kendo-data-query/dist/npm/utils';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';


@Component({
  selector: 'app-tiers-address',
  templateUrl: './tiers-address.component.html',
  styleUrls: ['./tiers-address.component.scss']
})

export class TiersAddressComponent implements OnInit, OnChanges {
  /**
   * Decorator to identify the country template reference
   */
  @ViewChildren(ComboBoxComponent) public countryComboBox: QueryList<ComboBoxComponent>;

  /**
   * Decorator to identify the city template reference
   */
  @ViewChildren(ComboBoxComponent) public cityComboBox: QueryList<ComboBoxComponent>;

  /**
   * Decorator to identify the tiersFormGroup from addTiersComponenet
   */
  @Input()
  public tiersFormGroup: FormGroup;
  /**
   * Decorator to identify the tiersAddress addTiersComponenet
   */
  @Input()
  public tiersAddressToUpdate: any;
  /**
   * Decorator to identify collapse "open" action
   */
  @Input()
  public collapseOnOpenAction: boolean;
  /**
   * Decorator to update contact permission action
   */
  @Input()
  public hasUpdateAdressPermission: boolean;
  /**
   * Decorator to office action
   */
  @Input()
  public isOffice: boolean;
  /**
   * Decorator to company setup action
   */
  @Input()
  public isCompanySetup: boolean;
  /**
   * countries dropdown
   */
  public countries = [];
  public countriesFiltred = [];
  /**
   * cities dropdown
   */
  public cities: any[][] = [];
  public citiesFiltred: any[][] = [];
  /**
   * array of address label with boolean flag
   */
  public adressLabelEditable: boolean[] = [];

  public isUpdate: boolean[] = [];
  /**
   *
   * predicate
   */
  private predicate: PredicateFormat = new PredicateFormat();
  @Input()
  public isCountryAndCityRequired: boolean;
  public hasUpdateCustomerPermission = false;
  public hasUpdateSupplierPermission = false;
  idTiers = NumberConstant.ZERO;
  @Input()
  public typeTier;
  @Input()
  public hasUpdateCrmPermission = false;
  @Input()
  public isMultiple = true;
/**
   * Decorator to identify the address label
   */
 public addressLabel = this.translate.instant(TiersAddressConstants.HEADQUARTERS_ADDRESS);

  public static isEmptyAdressFields(adress) {
    return isNullOrEmptyString(adress.PrincipalAddress) && isNullOrEmptyString(adress.CodeZip)
      && isNullOrEmptyString(adress.Region) && isNullOrEmptyString(adress.IdCountry) && (isNullOrEmptyString(adress.IdCity));
  }
  /**
   *
   * @param fb
   * @param validationService
   * @param countryService
   * @param cityService
   * @param swalWarring
   * @param translate
   */
  constructor(private fb: FormBuilder, private validationService: ValidationService,
    private countryService: CountryService, private cityService: CityService,
    private swalWarring: SwalWarring, private translate: TranslateService, private authService: AuthService) {
  }


  private prepareCountriesPredicate(idCountry: number): PredicateFormat {
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(
      new Filter(CompanyConstant.IDCOUNTRY, Operation.eq, idCountry));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation('IdCountryNavigation')]);
    return this.predicate;
  }

  public get address(): FormArray {
    return this.tiersFormGroup.get(TiersConstants.ADDRESSES_FORM) as FormArray;
  }

  public prepareAddress(tiersAddress?) {
    if (tiersAddress) {
      if (tiersAddress.Label == null ){
        tiersAddress.Label = this.addressLabel;
      }
      this.adressLabelEditable.push(false);
      this.address.push(this.buildAddresseForm(tiersAddress));
    } else {
      this.isUpdate[this.isUpdate.length + NumberConstant.ONE] = false;
      this.addEmptyAddress();
    }
  }

  /**
   * add empty address by click in the add button
   * @private
   */
  private addEmptyAddress() {
    if (this.address.valid) {
      this.adressLabelEditable.push(false);
      this.address.push(this.buildAddresseForm());
    } else {
      this.validationService.validateAllFormFields(this.tiersFormGroup);
    }
  }

  public deleteAddresse(address: AbstractControl, index) {
    this.swalWarring.CreateDeleteSwal(TiersAddressConstants.ADDRESS_ELEMENT, TiersAddressConstants.PRONOUN).then((result) => {
      if (result.value) {
        this.checkIsNewAddress(address.value.Id, index);
        this.adressLabelEditable.splice(index, NumberConstant.ONE);
      }
    });
  }

  private buildAddresseForm(tiersAddress?): FormGroup {
    const myForm = this.fb.group({
      Id: [tiersAddress ? tiersAddress.Id : NumberConstant.ZERO],
      Label: [tiersAddress ? tiersAddress.Label : this.addressLabel
        , Validators.required],
      PrincipalAddress: [tiersAddress ? tiersAddress.PrincipalAddress : SharedConstant.EMPTY, Validators.required],
      IdCountry: [tiersAddress ? tiersAddress.IdCountry : undefined],
      IdCity: [tiersAddress ? tiersAddress.IdCity : undefined],
      Country: [tiersAddress  &&  tiersAddress.Country ? tiersAddress.Country : ''],
      City: [tiersAddress  &&  tiersAddress.City ? tiersAddress.City : ''],
      CodeZip: [tiersAddress && tiersAddress.IdZipCodeNavigation ? tiersAddress.IdZipCodeNavigation.Code : SharedConstant.EMPTY],
      ExtraAdress: [tiersAddress ? tiersAddress.ExtraAdress : SharedConstant.EMPTY],
      Region: [tiersAddress && tiersAddress.IdZipCodeNavigation ? tiersAddress.IdZipCodeNavigation.Region : SharedConstant.EMPTY],
      IsDeleted: [false]
    });
    if (this.isCountryAndCityRequired) {
      myForm.controls[TiersAddressConstants.ID_COUNTRY].setValidators([Validators.required]);
      myForm.controls[TiersAddressConstants.ID_CITY].setValidators([Validators.required]);
    }
    return myForm;
  }

  handleFiltreCountry(country, i) {
    this.address.at(i).get(TiersAddressConstants.ID_CITY).setValue('');
    this.countries = this.countriesFiltred.filter((s) => s.NameFr.toLowerCase().indexOf(country.toLowerCase()) !== -1);
  }

  handleFiltreCity(city, index) {
    this.cities[index] = this.citiesFiltred[index].filter((s) => s.Code.toLowerCase().indexOf(city.toLowerCase()) !== -1);
  }

  /**
   * change address flag
   * @param index
   * @param value
   */
  editAddressLabel(index, value) {
    if (this.address.at(index).get('Label').value != ""){
    this.adressLabelEditable[index] = value;
    this.isUpdate[index] = true;
  }
  }


  private updateCase(changes: SimpleChanges) {
    changes.tiersAddressToUpdate.currentValue.forEach((value, index) => {
      this.isUpdate[index] = true;
      this.fillRelatedCities(value.IdCountry, index);
      this.prepareAddress(value);
    });
  }

  /**
   * check if TiersAddress is new by Id
   * @param id
   * @param index
   * @private
   */
  private checkIsNewAddress(id, index) {
    if (id !== NumberConstant.ZERO) {
      this.address.at(index).get(TiersAddressConstants.IS_DELETED).setValue(true);
      Object.keys((this.address.at(index) as FormGroup).controls).forEach(key => {
        (this.address.at(index) as FormGroup).get(key).setErrors(null);
      });
    } else {
      this.address.removeAt(index);
    }
  }

  public fillCountriesList() {
    this.countryService.listdropdown().toPromise().then((result: any) => {
      this.countries = result.listData;
      this.countriesFiltred = result.listData;
    });
  }
    fillRelatedCitiesName(event, index) {
        if (this.hasUpdateCrmPermission && this.Address && this.Address.length > 0 && this.cities[index] && this.cities[index].length > 0) {
            let city = '';
            if (event ) {
                // @ts-ignore
                city =  this.cities[index].filter(r => r.Id === event)[0].Label;
            } else  city = '';
            this.Address.at(index).get('City').setValue(city);
        }
    }

    get Address(): FormArray {
        return this.tiersFormGroup.get(TiersConstants.ADDRESS) as FormArray;
    }
  public fillRelatedCities(event, index) {
      if (this.hasUpdateCrmPermission && this.Address && this.Address.length > 0 && this.countries && this.countries.length > 0) {
          let country = '';
          if (event ) {
              country =  this.countries.filter(r => r.Id === event)[0].NameFr;
          } else  country = '';
              this.Address.at(index).get('Country').setValue(country);
      }

    if (event) {
      this.prepareCountriesPredicate(event);
      this.cityService.listdropdownWithPerdicate(this.predicate, false).subscribe((data: any) => {
        this.cities[index] = data.listData;
        this.citiesFiltred[index] = data.listData;
      });
    } else {
      this.cities[index] = [];
      this.citiesFiltred[index] = [];
    }
  }

  /**
   * check if address is visible by IsDeleted field
   * @param address
   */
  isAddressRowVisible(address) {
    return !address.value.IsDeleted;
  }

  /**
   * open the country combobox on focus event
   */
  openCountryCombobox(i) {
    const countryTemplateReference = this.getCountryTemplateReference(i);
    countryTemplateReference.toggle(true);
    countryTemplateReference.data = this.countriesFiltred;
  }

  /**
   * open the city combobox on focus event
   */
  openCityCombobox(i) {
    this.getCityTemplateReference(i).toggle(true);
  }

  private getCityTemplateReference(i) {
    return this.cityComboBox.find((value, index) => index === ((i * NumberConstant.TWO) + NumberConstant.ONE));
  }

  private getCountryTemplateReference(i) {
    return this.countryComboBox.find((value, index) => index === (i * NumberConstant.TWO));
  }


  /**
   * onInit life cycle
   */
  ngOnInit() {
    this.idTiers = this.tiersFormGroup.value.Id;
    this.hasUpdateCustomerPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.hasUpdateSupplierPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER);
    if (this.tiersFormGroup.value.Id > NumberConstant.ZERO && !this.hasUpdateCustomerPermission && !this.hasUpdateSupplierPermission && !this.hasUpdateCrmPermission) {
      this.address.disable();
    }
    this.fillCountriesList();
  }

  /**
   * onChanges life cycle
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.collapseOnOpenAction !== undefined && changes.collapseOnOpenAction.currentValue) {
      this.prepareAddress();
    } else if (changes.tiersAddressToUpdate !== undefined && changes.tiersAddressToUpdate.currentValue !== undefined
      && changes.tiersAddressToUpdate.currentValue.length > NumberConstant.ZERO) {
      this.updateCase(changes);
    }
  }
}
