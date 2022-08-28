import { Resource } from '../shared/ressource.model';
import { Country } from './country.model';

export class City extends Resource {
  Code: string;
  Label: string;
  CountryName: string;
  IdCountry: number;
  IdCountryNavigation: Country;
}
