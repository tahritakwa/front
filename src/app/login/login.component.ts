import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../COM/Growl/growl.service';
import {SpinnerService} from '../../COM/spinner/spinner.service';
import {AccountingConfigurationService} from '../accounting/services/configuration/accounting-configuration.service';
import {CompanyService} from '../administration/services/company/company.service';
import {UserConstant} from '../constant/Administration/user.constant';
import {LoginConst} from '../constant/login/login.constant';
import {Company} from '../models/administration/company.model';
import {Credentials} from '../models/login/credentials.model';
import {AuthService} from './Authentification/services/auth.service';
import {LoginService} from './services/login.service';
import {Credential} from './Authentification/models/credential';

import {NumberConstant} from '../constant/utility/number.constant';
import {UserJavaService} from '../administration/services/user/user.java.service';
import {LocalStorageService} from './Authentification/services/local-storage-service';
import {UserCurrentInformationsService} from '../shared/services/utility/user-current-informations.service';

const REFRESH_TOKEN_KEY = 'refresh_token';
//import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.components.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, AfterViewInit {
  // Credentials ng model
  model: Credentials = new Credentials();
  // selected company
  public selectedCompany: string;
  // unthorized
  unhotorize = false;
  // copyrights
  copyRightYear = Date.now();
  public companiesFiltredDataSource: Company[];
  public companiesDataSource: Company[];
  public form: FormGroup;
  myelement = false;
  isViewLoaded = false;
  loginError = false;
  //@ViewChild(RecaptchaComponent) recaptcha: RecaptchaComponent;
  passwordFieldAnimation = false;
  loginFieldAnimation = false;
  loginRecaptcha = true;
  public envName: any;
  @Input() allowCustom;

  constructor(private loginService: LoginService, public Service: SpinnerService, public formBuilder: FormBuilder, private companyService: CompanyService, private accountingConfigurationService: AccountingConfigurationService,
              private growlService: GrowlService, private translate: TranslateService, public authService: AuthService, private router: Router,
              private localStorageService : LocalStorageService , private userCurrentInformationsService : UserCurrentInformationsService) {
  }

  get Email(): FormControl {
    return this.form.get(LoginConst.EMAIL) as FormControl;
  }

  get Password(): FormControl {
    return this.form.get(LoginConst.PASSWORD) as FormControl;
  }

  animate() {
    this.myelement = false;
    setTimeout(() => {
      this.myelement = true;
    });
  }

  ngOnInit() {
    if (this.authService.isRefreshTokenNotNullAndNotExpired()) {
      this.router.navigateByUrl('/main/dashboard');
    }
      this.getEnvname();
      this.form = this.formBuilder.group({
        Email: ['', [Validators.required, Validators.email]],
        Password: ['', Validators.required]
      });
  }

  ngAfterViewInit(): void {
    this.isViewLoaded = !this.isViewLoaded;
  }

  onLogin() {
    if (this.authService.isRefreshTokenNotNullAndNotExpired()) {
      this.growlService.ErrorNotification(this.translate.instant('SESSION_ALREADY_OPEN_IN_THIS_BROWSER'));
    }else{
      this.localStorageService.clearAll();
      if (this.form.valid) {
        let credential = new Credential();
        credential.email = this.form.value.Email;
        credential.password = this.form.value.Password;
        this.authService.login(credential, true)
          .subscribe((token: Response)=>{
            
          }, (error) => {
            if (error.error.error_description && error.error.error_description.toString().startsWith(LoginConst.BAD_CREDENTIALS)) {
              this.growlService.ErrorNotification(this.translate.instant(LoginConst.WRONG_PASSWORD));
            } else {
              this.growlService.ErrorNotification(this.translate.instant(LoginConst.THIS_ACCOUNT_HAS_A_PROBLEM));
            }
            this.validatLogin();
          });
      } else {
        this.validatLogin();
      }
    }

  }

  Invalidanimation() {
    this.loginError = false;
    setTimeout(() => {
      this.loginError = true;
    }, 100);
  }

  invalidLoginFieldAnimation() {
    this.loginFieldAnimation = true;
    setTimeout(() => {
      this.loginFieldAnimation = false;
    }, 100);
  }

  invalidPasswordFieldAnimation() {
    this.passwordFieldAnimation = true;
    setTimeout(() => {
      this.passwordFieldAnimation = false;
    }, 100);
  }

  validatLogin() {
    if ((this.form.controls[LoginConst.EMAIL].value === '') || (this.form.controls[LoginConst.PASSWORD].value === '')) {
      this.growlService.ErrorNotification(this.translate.instant(LoginConst.REQUIRED_EMAIL_AND_PASSWORD));
      this.invalidLoginFieldAnimation();
      this.invalidPasswordFieldAnimation();
    } else if (((this.form.controls[LoginConst.EMAIL].errors) && (!this.form.controls[LoginConst.EMAIL].errors.email))
      || (this.form.controls[LoginConst.PASSWORD].errors)) {
      this.growlService.ErrorNotification(this.translate.instant(LoginConst.WRONG_LOGIN_OR_PASSWORD));
      this.invalidLoginFieldAnimation();
      this.invalidPasswordFieldAnimation();
    } else if (this.form.controls[LoginConst.EMAIL].errors && this.form.controls[LoginConst.EMAIL].errors.email) {
      this.growlService.ErrorNotification(this.translate.instant(LoginConst.WRONG_EMAIL));
      this.invalidLoginFieldAnimation();
      this.invalidPasswordFieldAnimation();
    }
    this.Invalidanimation();
  }

  /**
   * validate response from recaptcha api
   * @param captchaResponse
   */
  public resolved(captchaResponse: string) {
    this.loginRecaptcha = true;
    this.loginService.ValidateRecaptchaToken(captchaResponse).subscribe(data => {
      this.loginRecaptcha = data.result;
    });
  }

  public getEnvname(): string {
    this.loginService.getEnvName().subscribe(data => {
      this.envName = data.envName;
    });
    return this.envName;
  }
}
