import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from '../../../../../node_modules/rxjs';
import {ClaimSideNavService} from './claim-side-nav.service';

@Injectable()
export class SideNavService {

  public showDetailSidNav = new Subject<any>();

  public retournToOrganisation = new Subject<any>();

  public passeContactToUpdateMode = new Subject<any>();

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

  getreturnEventFromContactOpportunity(): Observable<any> {

    return this.retournToOrganisation.asObservable();
  }

  updateContactFromOrganizationDetails(source) {
    this.showDetailSidNav.next({value: true, source: source});
  }

  isContactInOrgFromOppInUpdateMode(): Observable<any> {
    return this.passeContactToUpdateMode.asObservable();
  }

}
