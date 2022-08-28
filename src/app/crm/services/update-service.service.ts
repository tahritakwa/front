import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UpdateServiceService {

  public goToUpdates = new Subject<any>();

  constructor() {
  }

  update(value) {
    this.goToUpdates.next({value: value});
  }

  getResult(): Observable<any> {
    return this.goToUpdates.asObservable();
  }

}
