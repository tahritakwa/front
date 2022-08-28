import { TierCategory } from './../sales/tier-category.model';
import { Tiers } from "../achat/tiers.model";
import { City } from "../administration/city.model";
import { Company } from "../administration/company.model";
import { Country } from "../administration/country.model";
import { ZipCode } from "../shared/zip-code";

export class Address {
  Id: number;
  id:number;
  country: string;
  city: string;
  zipCode: string;
  extraAddress: string;
  Label:string;
  ExtraAdress:string;
  IdTiers:number;
  PrincipalAddress:string;
  IdCountry:number;
  IdCompany:number;
  IdCity:number;
  IdZipCode:number;
  IdCityNavigation:City;
  IdCompanyNavigation:Company;
  IdCountryNavigation:Country;
  IdTiersNavigation:Tiers;
  IdZipCodeNavigation:ZipCode;
  IsDeleted: boolean;
  Region:string;
  CodeZip:string;
  latitude:number;
  longitude:number;
  addressLine:String;
  idCountry:number;
  idCity:number;
  region: string;
  principalAddress: string;
  label: string;
  constructor() {

  }
}
