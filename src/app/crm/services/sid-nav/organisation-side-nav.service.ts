import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Organisation} from '../../../models/crm/organisation.model';

@Injectable()
export class OrganisationSideNavService {


  public showDetailSidNav = new Subject<any>();

  constructor() {
  }


  show(data: any, isToUpdate: boolean, prospectType?: boolean) {
    this.showDetailSidNav.next({value: true, data: data, isToUpdate: isToUpdate, prospectType: prospectType});
  }

  hide(prospectType: boolean) {
    this.showDetailSidNav.next({value: false, prospectType: prospectType});
  }

  getResult(): Observable<any> {

    return this.showDetailSidNav.asObservable();
  }

}
