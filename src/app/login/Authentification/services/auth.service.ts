import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LanguageService } from '../../../shared/services/language/language.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { UserJavaService } from '../../../administration/services/user/user.java.service';
import { Operation } from '../../../../COM/Models/operations';
import { LoginConst } from '../../../constant/login/login.constant';
import { Credential } from '../models/credential';
import { TranslateService } from '@ngx-translate/core';
import { JwtService } from './jwt-service';
import { RefreshToken } from '../models/refresh-token';
import {LocalStorageService} from './local-storage-service';
import {UserRequestDto} from '../models/user-request-dto';
import { UserConstant } from '../../../constant/Administration/user.constant';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { StringBuilder } from 'typescript-string-operations';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const AUTHORIZATION_KEY = 'Authorization';
const TOKEN_TO_REVOKE = 'TokenToRevoke';

@Injectable()
export class AuthService {

  constructor(private httpClient: HttpClient, private userCurrentInformationsService: UserCurrentInformationsService,
    private router: Router, private languageService: LanguageService, private route: ActivatedRoute, private jwtService: JwtService, public intlService: IntlService,
    private userJavaService: UserJavaService, private growlService: GrowlService, private translate: TranslateService, private localStorageService: LocalStorageService) {
  }

  public static addTokenToRequestHeader(token: string, req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({ headers: req.headers.set(AUTHORIZATION_KEY, `Bearer ${token}`) });
  }

  isLoginUrl(req: HttpRequest<any>): boolean {
    return req.url.includes('/auth/users/token');
  }

  login(credential: Credential, resetLocalStorageUtilData: boolean): Observable<any> {
    return this.loadAccessToken(credential, resetLocalStorageUtilData, null);
  }

  loadAccessTokenUsingRefreshToken(resetLocalStorageUtilData: boolean): Observable<string> {
    const storedRefreshToken = this.localStorageService.getRefreshToken();
    if (storedRefreshToken) {
      const timeZoneDifference = this.localStorageService.getTimeZoneDifference();
      if (this.jwtService.isTokenExpired(storedRefreshToken, +timeZoneDifference)) {
        this.logout(this.translate.instant('SESSION_EXPIRED'));
      }
      let refreshToken: RefreshToken = new RefreshToken();
      refreshToken.refreshToken = storedRefreshToken;
      return this.loadAccessToken(null, resetLocalStorageUtilData, refreshToken);
    }
  }

  isLoggedIn(): boolean {
    return this.isRefreshTokenNotNullAndNotExpired();
  }

  isTokenNotNullAndNotExpired(): boolean {
    const accessToken = this.localStorageService.getAccessToken();
    const timeZoneDifference = this.localStorageService.getTimeZoneDifference();
    return accessToken && !this.jwtService.isTokenExpired(accessToken, +timeZoneDifference);
  }

  isTokenExpired(): boolean {
    const accessToken = this.localStorageService.getAccessToken();
    const timeZoneDifference = this.localStorageService.getTimeZoneDifference();
    return this.jwtService.isTokenExpired(accessToken, +timeZoneDifference);
  }

  isRefreshTokenNotNullAndNotExpired(): boolean {
    const refreshToken = this.localStorageService.getRefreshToken();
    const timeZoneDifference = this.localStorageService.getTimeZoneDifference();
    return refreshToken && !this.jwtService.isTokenExpired(refreshToken, +timeZoneDifference);
  }


  logout(message?: string, userMailToDisconnect?: string) {
    let userUtilInfo = new UserRequestDto();
    if (userMailToDisconnect){
      userUtilInfo.email=userMailToDisconnect;
      userUtilInfo.accessToken=null;
      this.userJavaService.getJavaGenericService().callService(Operation.POST, LoginConst.REVOKE_TOKEN ,userUtilInfo)
        .subscribe();
    }else{
      const email = this.localStorageService.getEmail();
      const accessToken = this.localStorageService.getAccessToken();
      if(email && accessToken){
        userUtilInfo.email = email;
        userUtilInfo.accessToken = accessToken;
        this.userJavaService.getJavaGenericService().callService(Operation.POST, LoginConst.REVOKE_TOKEN,userUtilInfo)
          .subscribe();
        }
      this.localStorageService.clearAll();
      if (message) {
        this.growlService.ErrorNotification(message);
      }
      this.router.navigate(['login']);
      }
  }

  public getAuthorities() {
    if (this.router.routerState.root.firstChild != null) {
      return this.router.routerState.root.firstChild.snapshot.data['permissions'];
    } else {
      return null;
    }
  }

  public async hasPermissionGard(permissionName: any[]) {
    const authorities = await this.getPermissions();
    if (authorities != null) {
      if (permissionName.length === 1) {
        return authorities.includes(permissionName[0]);
      } else {
        let authoritie = false;
        for (let i = 0; i < permissionName.length; i++) {
          authoritie = authoritie || authorities.includes(permissionName[i]);
        }
        return authoritie;
      }
    } else {
      return false;
    }
  }

  public async hasPermissionsGard(permissions: any[]) {
    let hasAuthorities = this.hasPermissionGard(permissions[0]);
    for (let i = 1; i < permissions.length; i++) {
      hasAuthorities = hasAuthorities || this.hasPermissionGard(permissions[i]);
    }
    return hasAuthorities;
  }

  public hasAuthority(permissionName: any): boolean {
    const authorities = this.getAuthorities();
    if (authorities != null) {
      return this.getAuthorities().includes(permissionName);
    } else {
      return false;
    }
  }

  public hasAuthorities(permissions: any[]): boolean {
    let hasAuthorities = this.hasAuthority(permissions[0]);
    for (let i = 1; i < permissions.length; i++) {
      hasAuthorities = hasAuthorities || this.hasAuthority(permissions[i]);
    }
    return hasAuthorities;
  }

  private async getPermissions(): Promise<string[]> {
    if (this.router.routerState.root.firstChild != null) {
      return this.router.routerState.root.firstChild.snapshot.data['permissions'];
    } else {
      return await this.userJavaService.getJavaGenericService().getEntityList('authorities').toPromise();
    }
  }

  private loadAccessToken(credentials: Credential, resetLocalStorageUtilData: boolean, refreshToken?: RefreshToken): Observable<any> {
    let result: Observable<any>;
    if (refreshToken) {
      result = this.userJavaService.getJavaGenericService().callService(Operation.POST, LoginConst.RETRIEVE_TOKEN_USING_REFRESH_TOKEN, refreshToken);
    } else {
      result = this.userJavaService.getJavaGenericService().callService(Operation.POST, LoginConst.RETRIEVE_TOKEN, credentials);
    }
    return result.pipe(map(jwt => {
      return this.storeToken(jwt, resetLocalStorageUtilData);
    }), catchError(error => {
      if (refreshToken) {
        this.logout(this.translate.instant('SESSION_EXPIRED'));
      }
      throw error;
    }));
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


  private storeToken(token: any, resetLocalStorageUtilData: boolean): string {
    if (token && token[ACCESS_TOKEN_KEY]) {
      const accessToken = token[ACCESS_TOKEN_KEY];
      if (token[REFRESH_TOKEN_KEY]) {
        const refreshToken = token[REFRESH_TOKEN_KEY];
        this.localStorageService.addRefreshToken(refreshToken);
      }
      this.localStorageService.addAccessToken(accessToken);
      if( resetLocalStorageUtilData ){
        this.localStorageService.addUtilData(LocalStorageService.convertTokenAdditionalInfoToUtilData(token['user'], new Date(token['token_create_date']), token['language']));
        this.languageService.chooseLang(token['language'], true);
        this.setDefaultCulture(token['language']);
        this.userCurrentInformationsService.getCurrentCompanyActivityAreaAndCurrency()
          .subscribe((currencyDetails) => {
            this.localStorageService.addCurrencyDetails(currencyDetails);
            this.router.navigateByUrl(UserConstant.MAIN_URL);
          });

      }
      return accessToken;
    }
    return null;
  }

  isTokenExpiredNowOrAfterOneMinute(): boolean {
    const accessToken = this.localStorageService.getAccessToken();
    const timeZoneDifference = this.localStorageService.getTimeZoneDifference();
    return this.jwtService.isTokenExpiredNowOrAfterOneMinute(accessToken, +timeZoneDifference);
  }
}
