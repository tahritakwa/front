import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {SharedConstant} from '../../constant/shared/shared.constant';

@Injectable()
export class UrlServicesService {

  private previousUrl: string;
  private currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }

  public getBackMessage(): string {
    const BACK_TO = 'BACK_TO_';
    const detailsEndPoint = this.getPreviousUrl() ? this.getPreviousUrl().indexOf('/', 10) : undefined;
    if (detailsEndPoint !== -1 && detailsEndPoint) {
      return BACK_TO.concat(this.getPreviousUrl().substring(10, detailsEndPoint).toUpperCase());
    } else {
      return 'BACK_TO_LIST';
    }
  }
}
