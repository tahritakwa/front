export class PaymentMethodEnumerator {

  public static BankTransfer = 'VIR';
  get BankTransfer() {
    return PaymentMethodEnumerator.BankTransfer;
  }

  public static CashPayment = 'ESP';
  get CashPayment() {
    return PaymentMethodEnumerator.CashPayment;
  }

  public static BankCard = 'CB';
  get BankCard() {
    return PaymentMethodEnumerator.BankCard;
  }

  public static BankCheck = 'CHQ';
  get BankCheck() {
    return PaymentMethodEnumerator.BankCheck;
  }

  public static DraftBank = 'TRT';
  get DraftBank() {
    return PaymentMethodEnumerator.DraftBank;
  }
}

