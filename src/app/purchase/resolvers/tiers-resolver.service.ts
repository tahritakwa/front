import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { TiersService } from '../services/tiers/tiers.service';
import { TiersConstants } from '../../constant/purchase/tiers.constant';

@Injectable()
export class TiersResolverService implements Resolve<Observable<any>> {

  constructor(private tiersService: TiersService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.tiersService.getTiersById(+route.paramMap.get(TiersConstants.PARAM_ID));
  }
}
