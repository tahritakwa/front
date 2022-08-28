import { Resource } from '../shared/ressource.model';
import { City } from './city.model';

export class Country extends Resource {
  Code: string;
  Alpha2: string;
  Alpha3: string;
  NameEn: string;
  NameFr: string;
  City: City[];
}
