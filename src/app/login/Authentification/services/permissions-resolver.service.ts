import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {UserJavaService} from '../../../administration/services/user/user.java.service';

@Injectable()
export class PermissionsResolverService implements Resolve<Observable<any>> {

  constructor(private userJavaService: UserJavaService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.userJavaService.getJavaGenericService().getEntityList('authorities');
  }
}
