import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GarageConstant } from '../../constant/garage/garage.constant';
import { GarageService } from '../services/garage/garage.service';

@Injectable()
export class GarageResolverService implements Resolve<Observable<any>> {

  constructor(private garageService: GarageService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.garageService.getById(+route.paramMap.get(GarageConstant.ID));
  }
}
