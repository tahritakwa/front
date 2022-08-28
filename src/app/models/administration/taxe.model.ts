import { Resource } from '../shared/ressource.model';
import { Item } from '../../models/inventory/item.model';

export class Taxe extends Resource {
  Label: string;
  CodeTaxe: string;
  TaxeTypeLabel: string;
  TaxeType: number;
  TaxeValue?: number;
  Item: Array<Item>;
  IdTaxeTypeNavigationId;
  idAccountingAccountSales: number;
  idAccountingAccountPurchase: number;
  IdTaxeTypeNavigation;
  IsCalculable: boolean;
  constructor(Id: number) {
    super();
    this.Id = Id;
  }
}
