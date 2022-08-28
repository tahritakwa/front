export class HelpDeskEnumerator {

  public static Deffective = 'D';
  get Deffective() {
    return HelpDeskEnumerator.Deffective;
  }

  public static Missing = 'M';
  get Missing() {
    return HelpDeskEnumerator.Missing;
  }

  public static Remaining = 'R';
  get Remaining() {
    return HelpDeskEnumerator.Remaining;
  }

  public static Shortage = 'S';
  get Shortage() {
    return HelpDeskEnumerator.Shortage;
  }

  public static Extra = 'E';
  get Extra() {
    return HelpDeskEnumerator.Extra;
  }
}

export enum ClaimStatusEnumerator
    {
        Provisional = 1,
        Valid = 2,
        InProgress = 3,
        Refused = 4,
        ToUpdate = 5,
        Terminated = 6,
        Treated = 7,
        PartiallyTreated = 8,
        NotTreated = 9,
    }