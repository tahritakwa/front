import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class TemplateEmailSideNavService {
  public showDetailSidNav = new Subject<any>();

  constructor() {
  }


  show(data: any, parent?: any) {
    this.showDetailSidNav.next({value: true, data: data, parent: parent});
  }

  hide() {
    this.showDetailSidNav.next(false);
  }

  getResult(): Observable<any> {

    return this.showDetailSidNav.asObservable();
  }


}
