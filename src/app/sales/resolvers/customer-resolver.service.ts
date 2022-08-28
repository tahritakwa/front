import { Injectable } from '@angular/core';
import {TiersConstants} from '../../constant/purchase/tiers.constant';

@Injectable()
export class CustomerResolverService {
  public customerTypeId = TiersConstants.CUSTOMER_TYPE;

  constructor() {
  }

  resolve(): Number {
    return this.customerTypeId;
  }

}
