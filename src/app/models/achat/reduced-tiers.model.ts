import {Resource} from '../shared/ressource.model';


export class ReducedTiers extends Resource {
  Id: number;
  IdPaymentCondition: number;
  IdTypeTiers: number;
  Name: string;
  Document: Array<Document>;
  CodeTiers: string;
  IdCurrency: number;
}
