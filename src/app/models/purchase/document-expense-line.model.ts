import { Resource } from '../shared/ressource.model';
import { Expense } from './expense.model';
import { Taxe } from '../administration/taxe.model';
import { Currency } from '../administration/currency.model';
import { Tiers } from '../achat/tiers.model';

export class DocumentExpenseLine extends Resource {
  Designation: string;
  CodeExpenseLine: string;
  IdDocument: number;
  IdExpense: number;
  IdTaxe: number;
  HtAmoutLine: number;
  TtcAmoutLine: number;
  HtAmountLineWithCurrency: number;
  HtAmountLineWithCurrencyPercentage: number;
  TtcAmountLineWithCurrency: number;
  IdCurrency: number;
  IdTiers: number;
  IdDocumentNavigation: Document;
  IdExpenseNavigation: Expense;
  IdTaxeNavigation: Taxe;
  IdCurrencyNavigation: Currency;
  IdTiersNavigation: Tiers;
  TaxeAmoun: number;
  TaxeAmount = 0;
}
