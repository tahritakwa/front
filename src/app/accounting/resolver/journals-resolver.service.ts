import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import { JournalService } from '../services/journal/journal.service';
import { JournalConstants } from '../../constant/accounting/journal.constant';

@Injectable()
export class JournalsResolverService implements Resolve<Observable<any>> {

  constructor(private journalService: JournalService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.journalService.getJavaGenericService().getEntityList(JournalConstants.FIND_ALL_METHOD_URL);
  }
}
