import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { MessageService } from '@progress/kendo-angular-l10n';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../../COM/config/app.config';
import { UserJavaService } from '../../../administration/services/user/user.java.service';
import { UserService } from '../../../administration/services/user/user.service';
import { LoginConst } from '../../../constant/login/login.constant';
import { Languages } from '../../../constant/shared/services.constant';
import { Language } from '../../../models/shared/Language.model';
import { KendoGridTranslationService } from '../kendo-grid-translation-service/kendo-grid-translation.service';
import { ResourceService } from '../resource/resource.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Injectable()
export class LanguageService extends ResourceService<Language> {
  /**
   * create new language service
   * @param translate
   * @param intlService
   */

  public lang: string;

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig, private translate: TranslateService,
    public intlService: IntlService, private userService: UserService, private userJavaService: UserJavaService,
    public messages: MessageService, private localStorageService: LocalStorageService) {
    super(httpClient, appConfig, LoginConst.LANGUAGE);
  }

  /**
   * get selected language
   */
  get selectedLang(): string {
    if (this.localStorageService.getLanguage()) {
      return this.localStorageService.getLanguage();
    }
    return Languages.FR.value;
  }



  /**
   * get avialable languages
   */
  get languages(): Array<any> {
    return Object.keys(Languages).map((index) => {
      return Languages[index];
    });
  }

  /**
   * get selected lnguage label
   */
  get selectedLanguageLabel(): Observable<string> {
    return new Observable<string>(observer => observer.next(this.selectedLang.toUpperCase()));
  }

  /**
   * check selected language
   * */
  checkSelectedLang(): void {
    if (this.selectedLang === Languages.EN.value) {
      (this.intlService as CldrIntlService).localeId = Languages.EN.id;
    } else {
      (this.intlService as CldrIntlService).localeId = Languages.FR.id;
    }
    this.setFormatDateWithCulture(this.selectedLang);
  }


  /**
   * update translate language
   * */
  public updateTranslation(): void {
    this.lang = this.localStorageService.getLanguage();
    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);
    this.setFormatDateWithCulture(this.lang);
  }


  /**
   * choose language
   * @param langage
   */
  public chooseLang(language: string, isAuth?: boolean) {
    const kendoGridTranslationService = <KendoGridTranslationService>this.messages;
    kendoGridTranslationService.language = language === 'en' ? 'en' : 'fr';
    const userMail = this.localStorageService.getEmail();
    this.userJavaService.changeUserLanguage(userMail, language).subscribe(data => {
      if (data) {
        this.localStorageService.addLanguage(language);
        this.updateTranslation();
        if (window.location.pathname !== '/login' && !isAuth) {
          window.location.reload();
        }
      }
    });

  }

  public updateUserLang() {
    const userId = this.localStorageService.getUserId();
    const lang = this.localStorageService.getLanguage();
    const data = Array.of({
      [LoginConst.OPERATION]: LoginConst.REPLACE,
      [LoginConst.PATH]: LoginConst.LANG_PATH, [LoginConst.VALUE]: lang
    });
    this.userService.patchValues(userId, data).subscribe(() => {
    });
  }

  /**
   * translate kendo components
   * @param lang
   */
  private setFormatDateWithCulture(lang: string): void {
    if (lang === Languages.EN.value) {
      this.localStorageService.addFormatDate(Languages.EN.format_date);
    } else {
      this.localStorageService.addFormatDate(Languages.FR.format_date);
    }
  }



}
