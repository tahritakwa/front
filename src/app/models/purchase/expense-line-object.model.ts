import { DocumentExpenseLine } from './document-expense-line.model';

export class ExpenseLineObject {
  Id: number;
  IdLine: number;
  IdExpense: number;
  CodeExpense: string;
  IdTiers: number;
  TiersName: string;
  IdCurrency: number;
  CodeCurrency: string;
  Designation: string;
  IdDocument: number;
  IdTaxe: number;
  CodeTaxe: string;
  HtAmountLineWithCurrency: number;
  TtcAmountLineWithCurrency: number;
  IsDeleted: boolean;
  TaxeAmoun: number;
  constructor(line?: DocumentExpenseLine) {
    if (line) {
      this.Id = line.Id;
      this.IdDocument = line.IdDocument;
      this.IdExpense = line.IdExpense;
      this.CodeExpense = line.IdExpenseNavigation.Code;
      this.Designation = line.Designation;
      this.IdTiers = line.IdTiers;
      this.TiersName = line.IdTiersNavigation ? line.IdTiersNavigation.Name : undefined;
      this.IdCurrency = line.IdCurrency;
      this.CodeCurrency = line.IdCurrencyNavigation ? line.IdCurrencyNavigation.Code : undefined;
      this.CodeTaxe = line.IdTaxeNavigation.CodeTaxe;
      this.IdTaxe = line.IdTaxe;
      this.HtAmountLineWithCurrency = line.HtAmountLineWithCurrency;
      this.TtcAmountLineWithCurrency = line.TtcAmountLineWithCurrency;
      this.IsDeleted = line.IsDeleted;
      this.TaxeAmoun = line.TaxeAmoun;
    }
  }
}
