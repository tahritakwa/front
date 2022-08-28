import { Resource } from '../shared/ressource.model';
import { Country } from '../administration/country.model';
import { Bank } from './bank.model';
import { City } from '../administration/city.model';
import { Currency } from '../administration/currency.model';

export class BankAccount extends Resource {
  Code: string;
  Rib: string;
  Iban: string;
  Bic: string;
  Agence: string;
  Locality: string;
  InitialBalance: number;
  CurrentBalance: number;
  Entitled: string;
  Email: string;
  Telephone?: string;
  Fax?: string;
  Pic: string;
  TypeAccount?: number;
  IdCountry?: number;
  IdCountryNavigation: Country;
  IdCity?: number;
  IdCityNavigation: City;
  ZipCode: string;
  IdCurrency: number;
  IdCurrencyNavigation: Currency;
  IdBank: number;
  DeletedToken: string;
  Document: Array<any>;
  IdBankNavigation: Bank;
  IsLinked: boolean;
  bankIdAccountingAccount: number;
  Agency: string;
}
