import { Resource } from '../shared/ressource.model';

export class ReducedCurrency extends Resource {
  Code: string;
  Symbole: string;
  Description: string;
  Precision: number
}
