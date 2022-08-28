import { Resource } from '../shared/ressource.model';

export class CurrencyRate extends Resource {
  StartDate: Date;
  EndDate: Date;
  Coefficient: number;
  Rate: number;
  IdCurrency: number;
  IsDeleted: boolean;
}
