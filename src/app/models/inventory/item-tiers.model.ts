import { Item } from './item.model';
import { Resource } from '../shared/ressource.model';
import { Tiers } from '../achat/tiers.model';

export class ItemTiers extends Resource {
  IdItem: number;
  IdTiers: number;
  IdItemNavigation: Item;
  IdTiersNavigation: Tiers;
  PurchasePriceCurrency;
  PurchasePrice: number;
  ExchangeRate: number;
  Margin: number;
  Cost: number;
}
