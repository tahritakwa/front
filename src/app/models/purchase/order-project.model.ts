export class OrderProjectObject {
  ItemCode = '';
  ItemDescription = '';
  IdItem = 0;
  IdTiers = 0;
  TiersName = '';
  AvailableQuantity = 0;
  MinQuantity = 0;
  DeleveryDelay = 0;
  AverageSalesPerDay = 0;
  MouvementQuantity = 0;
  OnOrderQuantity = 0;
  IdCurrency = 0;
  LastPrice = 0;
  CurrencyPrecision = 0;
  CurrencySymnbol = '';
  IdLine = 0;
  notModfied = true;
  formatOptions = '';
  constructor(dataItem?: OrderProjectObject) {
    if (dataItem) {
      Object.assign(this, dataItem);
    }
  }
}
export class ProvisionningViewModel {
  StartDatePurchase: Date;
  EndDatePurchase: Date;
  SatrtDateSales: Date;
  EndDateSales: Date;
  IdTiers: Array<number>;
  HistorySales: boolean;
  HistoryPurchase: boolean;
  QunatitytMinMax: boolean;
  IdItem: number;
  /**
   *constructor
   */
  constructor(IdTiers: Array<number>,
    HistorySales: boolean, HistoryPurchase: boolean, QtMin_Max: boolean, SatrtDatePurchase: Date,
    EndDatePurchase: Date, SatrtDateSales: Date, EndDateSales: Date, IdItem?: number) {
    this.StartDatePurchase = SatrtDatePurchase;
    this.EndDatePurchase = EndDatePurchase;
    this.SatrtDateSales = SatrtDateSales;
    this.EndDateSales = EndDateSales;
    this.IdTiers = IdTiers;
    this.HistorySales = HistorySales;
    this.HistoryPurchase = HistoryPurchase;
    this.QunatitytMinMax = QtMin_Max;
    this.IdItem = IdItem;
  }
}
