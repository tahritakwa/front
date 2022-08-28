import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {TiersConstants} from '../../constant/purchase/tiers.constant';

@Injectable()
export class SupplierResolverService implements Resolve<Number> {
  public supplierTypeId = TiersConstants.SUPPLIER_TYPE;

  constructor() {
  }

  resolve(): Number {
    return this.supplierTypeId;
  }

}
