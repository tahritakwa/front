import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { StringBuilder } from 'typescript-string-operations';
import { SpinnerService } from '../COM/spinner/spinner.service';
import { SharedConstant } from './constant/shared/shared.constant';
import { DashboardService } from './dashboard/services/dashboard.service';
import {LocalStorageService} from './login/Authentification/services/local-storage-service';
import {LoginConst} from './constant/login/login.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  public show: boolean;
  public innerWidth: any;
  private defaultLang='fr';

  /**
   * Contructor
   * @param translate
   * @param service
   * @param localeId
   * @param intlService
   */
  constructor(private translate: TranslateService, public service: SpinnerService, public dashService: DashboardService,
    @Inject(LOCALE_ID) public localeId: string, public intlService: IntlService, private localStorageService : LocalStorageService) {
    this.show = this.service.getLoaderStatus();
    if(this.localStorageService.getLanguage()){
      this.defaultLang=this.localStorageService.getLanguage();
    }
    this.setDefaultCulture(this.defaultLang);
  }

  private generateCulture(lang: string): string {
    const culture: StringBuilder = new StringBuilder(lang);
    culture.Append('-');
    culture.Append(lang.toUpperCase());
    return culture.ToString();
  }


  private setDefaultCulture(culture?: string) {
    const lang = culture ? culture : LoginConst.EN;
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    (this.intlService as CldrIntlService).localeId = this.generateCulture(lang);
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngDoCheck() { this.show = this.service.getLoaderStatus(); }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    if(this.localStorageService.getLanguage()){
      this.defaultLang=this.localStorageService.getLanguage();
    }
    this.setDefaultCulture(this.defaultLang);
  }

}
