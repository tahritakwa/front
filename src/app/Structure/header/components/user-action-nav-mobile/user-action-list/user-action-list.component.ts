import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../../../../../login/services/login.service';
import {SharedConstant} from '../../../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../../../constant/utility/number.constant';
import {Company} from '../../../../../models/administration/company.model';
import {CompanyService} from '../../../../../administration/services/company/company.service';
import {CompanyConstant} from '../../../../../constant/Administration/company.constant';
import {NotificationService} from '../../../../../shared/services/signalr/notification/notification.service';
import {NotificationCrmService} from '../../../../../crm/services/notification-crm/notification-crm.service';
import {BTobService} from '../../../../b-tob-notif/service/b-tob.service';
import {ActionConstant} from '../../../../../constant/crm/action.constant';
import {GrowlService} from '../../../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import { AuthService } from '../../../../../login/Authentification/services/auth.service';
import { UserJavaService } from '../../../../../administration/services/user/user.java.service';
import { Operation } from '../../../../../../COM/Models/operations';
import {LocalStorageService} from '../../../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-user-action-list',
  templateUrl: './user-action-list.component.html',
  styleUrls: ['./user-action-list.component.scss']
})
export class UserActionListComponent implements OnInit {
  public companiesFiltredDataSource: Company[];
  public companiesDataSource: Company[];
  public selectedCompany: string;
  private connectedUser;
  private companyCode;
  public countNotifications = NumberConstant.ZERO;
  public countActionsNotifications = NumberConstant.ZERO;
  public countB2BNotifications = NumberConstant.ZERO;
  public countB2CNotifications = NumberConstant.ZERO;
  public countEmailsNotifications = NumberConstant.ZERO;


  /**
   *
   * @param router
   * @param loginService
   * @param companyService
   * @param notificationService
   * @param notificationCrmSerivce
   * @param bTobService
   * @param growlService
   * @param translateService
   * @param changeDetector
   */
  constructor(private router: Router, private loginService: LoginService,
              private localStorageService : LocalStorageService,
              public notificationService: NotificationService,
              public notificationCrmSerivce: NotificationCrmService,
              public bTobService: BTobService,
              public growlService: GrowlService,
              public translateService: TranslateService,
              private changeDetector: ChangeDetectorRef,
              private authService: AuthService,
              private userJavaService: UserJavaService,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.getConnectedUser();
    this.getCountNotifications();
    this.getCountActionsCrmNotifications();
    this.getCountB2BNotifications();
    this.getCompanyList();
  }

  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
    this.companyCode = this.localStorageService.getCompanyCode();
  }

  onClickProfile() {
    this.router.navigate([SharedConstant.PROFILE_URL]);
  }

  async onClickLogout() {
    const oauthRevokeUrl = 'oauth/revoke/';
    if (this.authService.isRefreshTokenNotNullAndNotExpired()) {
      const deletedToken = await this.authService.loadAccessTokenUsingRefreshToken(true)
        .flatMap(tokenId => this.userJavaService.getJavaGenericService().callService(Operation.POST, oauthRevokeUrl + tokenId));
      if (deletedToken) {
        this.authService.logout(this.translate.instant(SharedConstant.YOU_LOGGED_OUT));
      }
    }

  }

  /**
   * load profil component when screen is gratter than 768 px
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth >= NumberConstant.SEVEN_HUNDRED_SIXTY_EIGHT) {
      this.router.navigateByUrl(SharedConstant.PROFILE_URL);
    }
  }

  public getCompanyList() {
    this.loginService.getCompanyList().subscribe(data => {
      if (data) {
        this.companiesDataSource = data;
        this.selectedCompany = this.companiesDataSource.filter(x => x.Code ===
          this.localStorageService.getCompanyCode())[0].Name;
        this.companiesFiltredDataSource = this.companiesDataSource.filter(c => c.Name !== this.selectedCompany);
        this.changeDetector.detectChanges();
      }
    });
  }

  public selectionChange(company: Company) {
    if (company) {
      this.loginService.changeDataBaseConnection(company.Code).subscribe((result) => {
        if (result && result.Message && result.Message !== CompanyConstant.UNAUTHORIZED_SOCIETY) {
          this.selectedCompany = company.Name;
          this.router.navigateByUrl(CompanyConstant.DASHBOARD);
          this.companiesFiltredDataSource = this.companiesDataSource.filter(c => c.Name !== this.selectedCompany);
          this.changeDetector.detectChanges();
          setTimeout(() => {
            window.location.reload();
          }, NumberConstant.ONE_HUNDRED);
        } else {
          this.growlService.ErrorNotification(this.translateService.instant(CompanyConstant.UNAUTHORIZED_SOCIETY));
        }
      });

    } else {
      this.selectedCompany = '';
    }
  }

  onClickNotification() {
    this.router.navigate([SharedConstant.NOTIFICATIONS_URL], {
      queryParams: {isListMode: true}
    });
  }

  onClickB2BNotification() {
    this.router.navigate([SharedConstant.B2B_URL]);
  }

  onClickActionsNotification() {
    this.router.navigate([SharedConstant.ACTIONS_NOTIFICATIONS_URL], {
      queryParams: {isListMode: true}
    });
  }

  private getCountNotifications() {
    this.notificationService.getUnreadNotificationCount();
    this.notificationService.unreadNotificationCounterSubject.subscribe(value => {
      this.countNotifications = value;
    });
  }

  private getCountActionsCrmNotifications() {
    this.notificationCrmSerivce.getJavaGenericService().getEntityList(ActionConstant.REMINDER_CONNECTED_USER,
      this.connectedUser.IdEmployee).subscribe((listActionsCrmNotifications) => {
      if (listActionsCrmNotifications) {
        this.countActionsNotifications = listActionsCrmNotifications.length;
      }
    });
  }

  private getCountB2BNotifications() {
    this.bTobService.getOrderCount().subscribe(listB2BNotifications => {
      this.countB2BNotifications = listB2BNotifications.objectData;
    });
  }

}
