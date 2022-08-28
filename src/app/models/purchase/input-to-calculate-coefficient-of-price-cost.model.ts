import { skip } from "rxjs/operator/skip";

export class InputToCalculateCoefficientOfPriceCost {
  TotalDocumentPrice: number;
  TotalDocumentTtcPrice: number;
  TotalExpensePrice: number;
  IdCurrency: number;
  DocumentDate: Date;
  IdDocument: number;
  Margin: number;
  HtAmountLineWithCurrency?: any;
  HtAmountLineWithCurrencyPercentage?: any;
  constructor(IdCurrency: number, TotalDocumentTtcPrice: number, TotalDocumentPrice: number,
    TotalExpensePrice: number, DocumentDate: Date, IdDocument: number, Margin: number,
    HtALineWithCurrency: number, HtALineWithCurrencyPercentage: number) {
    this.TotalDocumentPrice = TotalDocumentPrice;
    this.TotalDocumentTtcPrice = TotalDocumentTtcPrice;
    this.TotalExpensePrice = TotalExpensePrice;
    this.IdCurrency = IdCurrency;
    this.DocumentDate = DocumentDate;
    this.IdDocument = IdDocument;
    this.Margin = Margin;
    this.HtAmountLineWithCurrency = HtALineWithCurrency;
    this.HtAmountLineWithCurrencyPercentage = HtALineWithCurrencyPercentage;
  }
}
