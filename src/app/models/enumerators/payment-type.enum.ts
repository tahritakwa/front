export class PaymentTypeEnumerator {
  public static ESP = 'ESP';
  get ESP() {
    return PaymentTypeEnumerator.ESP;
  }

  public static CHQ = 'CHQ';
  get CHQ() {
    return PaymentTypeEnumerator.CHQ;
  }

  public static VIR = 'VIR';
  get VIR() {
    return PaymentTypeEnumerator.VIR;
  }

  public static CB = 'CB';
  get CB() {
    return PaymentTypeEnumerator.CB;
  }

  public static TRT = 'TRT';
  get TRT() {
    return PaymentTypeEnumerator.TRT;
  }
}
