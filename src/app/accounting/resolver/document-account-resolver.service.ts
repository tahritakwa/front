import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {DocumentAccountService} from '../services/document-account/document-account.service';
import {DocumentAccountConstant} from '../../constant/accounting/document-account.constant';

@Injectable()
export class DocumentAccountResolverService implements Resolve<Observable<any>> {

  constructor(private documentAccountService: DocumentAccountService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.documentAccountService.getJavaGenericService()
      .getEntityList(DocumentAccountConstant.DOCUMENTS_IN_FISCAL_YEAR + '?page=0&size=10');
  }


}
