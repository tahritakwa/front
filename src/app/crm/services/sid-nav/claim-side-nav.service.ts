import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ClaimSideNavService {
  public sendData = new Subject<any>();

  constructor() {
  }


  show(data: any, parent?: any) {
    this.sendData.next({value: true, data: data, parent: parent});
  }

  hide() {
    this.sendData.next(false);
  }

  getResult(): Observable<any> {

    return this.sendData.asObservable();
  }

}
