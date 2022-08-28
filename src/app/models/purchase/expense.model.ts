import { Resource } from '../shared/ressource.model';
import { Currency } from '../administration/currency.model';
import { Item } from '../inventory/item.model';

export class Expense extends Resource {
    Code: string;
    Description: string;
    IdItem: number;
    IdCurrency: number;
    IdSupplier: number;
    IdCurrencyNavigation: Currency;
    IdItemNavigation: Item;
}
