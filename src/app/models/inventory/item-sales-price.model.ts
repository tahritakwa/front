import { Item } from './item.model';
import { Resource } from '../shared/ressource.model';
import { SalesPrice } from '../sales/sales-price.model';

export class ItemSalesPrice extends Resource {
  IdItem: number;
  IdSalesPrice: number;
  IdItemNavigation: Item;
  Percentage: number;
  IdSalesPriceNavigation: SalesPrice
  Price: number;
}
