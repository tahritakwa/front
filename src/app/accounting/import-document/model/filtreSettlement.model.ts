export class FiltreSettlement {

  SettlementDate: Date;
  SettlementCode: string;
  TierName: string;
  Amount: number;
  BankName: string;
  PaymentMethod: string;
 
  constructor(SettlementDate?: Date, SettlementCode?: string , TierName?: string, Amount?: number,
    BankName?: string, PaymentMethod?: string) {
    this.SettlementDate = SettlementDate;
    this.SettlementCode = SettlementCode;
    this.TierName = TierName;
    this.Amount = Amount;
    this.BankName = BankName;
    this.PaymentMethod = PaymentMethod;
  }
}
