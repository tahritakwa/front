export enum ActivitySectorsEnum {
  AUTOMOBILE = 1 ,
  INDUSTRIAL = 2,
  ESN = 3,
  PAYMENT_INSTITUTION = 5,
  OTHER = 4

}
export class ActivitySectorsEnumerator {

  public static Esn = 'ESN';
  get Esn() {
    return ActivitySectorsEnumerator.Esn;
  }

  public static Auto = 'AUTOMOBILE';
  get Auto() {
    return ActivitySectorsEnumerator.Auto;
  }

  public static Industrial = 'INDUSTRIAL';
  get Industrial() {
    return ActivitySectorsEnumerator.Industrial;
  }

  public static Other = 'OTHER';
  get Other() {
    return ActivitySectorsEnumerator.Other;
  }

  public static Payment_Institution = 'PAYMENT_INSTITUTION';
  get Payment_Institution() {
    return ActivitySectorsEnumerator.Payment_Institution;
  }
}
