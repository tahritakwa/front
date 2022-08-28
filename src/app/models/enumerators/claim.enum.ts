export class ClaimEnumerator {

  public static Deffective = 'D';
  get Defective() {
    return ClaimEnumerator.Deffective;
  }

  public static Missing = 'M';
  get Missing() {
    return ClaimEnumerator.Missing;
  }

  public static Remaining = 'R';
  get Remaining() {
    return ClaimEnumerator.Remaining;
  }

  public static Shortage = 'S';
  get Shortage() {
    return ClaimEnumerator.Shortage;
  }

  public static Extra = 'E';
  get Extra() {
    return ClaimEnumerator.Extra;
  }
}


// export enum claimTypeCode {
//   Deffective = 1,
//   Extra = 2,
//   Missing = 3,
//   Remaining = 4,
//   Shortage = 5,
  
// }

export enum claimStatusCode {
  NEW_CLAIM = 1,
  SUBMITTED_CLAIM = 2,
  ACCEPTED_CLAIM = 3,
  REFUSED_CLAIM = 4,
  CLOSED_CLAIM = 5,
}

export enum claimStateCode {

  IN_PROGRESS = 1,
  TREATED_REQUEST = 2,
  NOT_TREATED_REQUEST = 3,
  ALL_DOCUMENT_REQUESTS = 4

}
