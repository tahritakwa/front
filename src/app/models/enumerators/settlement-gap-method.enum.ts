export enum SettlementGapMethod {
    NoGap = 1,
    LossGap = 2,
    GainGap = 3
}
export class SettlementGapMethodEnumerator {

    get NoGap() {
      return SettlementGapMethod.NoGap;
    }

    get LossGap() {
      return SettlementGapMethod.LossGap;
    }

    get GainGap() {
      return SettlementGapMethod.GainGap;
    }

  }
