import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {DocumentAccountService} from './document-account.service';

@Injectable()
export class DocumentAccountDetailResolverService implements Resolve<Observable<any>> {

  constructor(private  documentAccountService: DocumentAccountService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.documentAccountService.getJavaGenericService().getEntityById(route.params['id']);
  }
}
