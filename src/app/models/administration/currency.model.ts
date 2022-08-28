import { Resource } from '../shared/ressource.model';
import { CurrencyRate } from './currency-rate.model';


export class Currency extends Resource {
  Code: string;
  Symbole: string;
  FloatInLetter: string;
  Precision: number;
  CurrencyRate: Array<CurrencyRate>;
  CurrencyRateDocument: Array<CurrencyRate>;
}
