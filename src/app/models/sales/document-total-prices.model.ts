export class DocumentTotalPrices {
  DocumentHtpriceWithCurrency?: number;
  DocumentTotalVatTaxesWithCurrency?: number;
  DocumentTtcpriceWithCurrency?: number;
  DocumentTotalDiscountWithCurrency?: number;
  DocumentPriceIncludeVatWithCurrency?: number;
  DocumentOtherTaxesWithCurrency?: number;
  DocumentTotalExcVatTaxesWithCurrency?: number;


  constructor(init?: Partial<DocumentTotalPrices>) {
    Object.assign(this, init);
  }
}
