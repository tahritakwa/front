import { Resource } from '../shared/ressource.model';

export class ItemKit extends Resource {
  Code: string;
  Description: string;
  IdKit: number;
  IdItem: number;
  Quantity: number;
}
