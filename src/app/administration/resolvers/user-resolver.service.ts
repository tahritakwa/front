import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { UserService } from '../services/user/user.service';

@Injectable()
export class UserResolverService implements Resolve<any> {

  constructor(private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot): any {
    return this.userService.getUserPhoneById(+route.paramMap.get(SharedConstant.ID_LOWERCASE));
  }

}
