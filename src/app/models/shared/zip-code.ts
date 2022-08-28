import {City} from '../administration/city.model';
import {Resource} from './ressource.model';

export class ZipCode extends Resource {
  region: string;
  Code: string;
  IdCity?: number;
  IdCityNavigation: City;
  }
