import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GarageConstant } from '../../constant/garage/garage.constant';
import { WorkerService } from '../services/worker/worker.service';

@Injectable()
export class WorkerResolverService implements Resolve<Observable<any>> {

  constructor(private workerService: WorkerService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.workerService.getById(+route.paramMap.get(GarageConstant.ID));
  }
}
