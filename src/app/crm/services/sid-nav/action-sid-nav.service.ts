import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ActionSidNavService {
  public showActionDetails = new Subject<any>();

  constructor() {
  }


  show(data: any, parent?: any) {
    this.showActionDetails.next({value: true, data: data, parent: parent});
  }

  hide() {
    this.showActionDetails.next(false);
  }

  getResult(): Observable<any> {

    return this.showActionDetails.asObservable();
  }

}
