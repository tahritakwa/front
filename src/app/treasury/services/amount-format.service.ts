import { Injectable } from '@angular/core';
import { TiersTypeEnumerator } from '../../models/enumerators/tiers-type.enum';
import { Currency } from '../../models/administration/currency.model';

@Injectable()
export class AmountFormatService {

  private tiersTypeEnum = TiersTypeEnumerator;
  constructor() { }

  format(currency: Currency, amount): number {
    if (currency) {
      const precision = currency.Precision;
      const multiplier = Math.pow(10, precision || 0);
      return Math.round(amount * multiplier) / multiplier;
    }
    return amount;
  }
}
