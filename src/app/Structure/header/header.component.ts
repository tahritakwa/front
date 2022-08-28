import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { RoleConfigConstant } from '../_roleConfigConstant';
import { User } from '../../models/administration/user.model';
import { DashboardService } from '../../dashboard/services/dashboard.service';
import { SearchItemService } from '../../sales/services/search-item/search-item.service';
import { NotificationDropdownComponent } from './components/notification-dropdown/notification.dropdown.component';
import { ReminderDropdownComponent } from './components/reminder-dropdown/reminder-dropdown.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { ModulesSettingsService } from '../../shared/services/modulesSettings/modules-settings.service';
import { CompanyService } from '../../administration/services/company/company.service';
import { NumberConstant } from '../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../permission-constant';
import { UserService } from '../../administration/services/user/user.service';
import {LocalStorageService} from '../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-head',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  public RoleConfigConstant = RoleConfigConstant;
  public notifications = SharedConstant.NOTIFICATIONS;
  public users_actions = SharedConstant.USERS_ACTIONS;
  public actions_notifications = SharedConstant.ACTIONS_NOTIFICATIONS;


  @Input() DashboardRoute = false;
  @Input() DashBoardConfig = SharedConstant.CONFIGURE_THE_DASHBOARD;
  @Input() Saved: boolean;
  Class = 'fa fa-cogs fa-lg';
  @ViewChild(SideBarComponent) sideBarComponent;

  firstAccess = true;
  isEcommerce: boolean;
  isManufacturing: boolean;
  data: any;
  public listRoleConfigs: any;
  public isCrm = false;
  @Input() home: string = '';
  @Input() menu: string;
  @Input() router_url: string;
  @Input() currentpage: string;
  @Input() actionpage: string;
  @Input() public navItemsList: any;
  @Input() public paramItemsList: any;
  @Input() NoOnglet = true;
  @Input() public countNotifications = NumberConstant.ZERO;
  @Input() public connectedUser;

  @Output() OpenColorPicker = new EventEmitter<any>();
  @Output() AddDrag = new EventEmitter<any>();

  @ViewChild(NotificationDropdownComponent) public notificaitonDropdown: NotificationDropdownComponent;
  @ViewChild(ReminderDropdownComponent) public reminderDropdownComponent: ReminderDropdownComponent;
  public showAside: any = false;
  public showSideBarButton: any = false;
  public user: User;
  innerWidth = window.innerWidth;
  private isVisibleNotificationComponent = true;
  public isNavBarShown = false;
  public showReminderCRM: any = false;
  public isEsnSector = false;

  public quotationAddPermission = false;
  public deliveryAddPermission = false;
  public deliveryListPermission = false;
  public assetAddPermission = false;
  public quickSalesPermission = false;
  public orderListPermissions = false;
  public showSideBar = false;
  public activeListPermission = false;
  public showSettingsMenu: boolean;
  public showpayrollSettingsMenu: boolean;
  public showpRHSettingsMenu: boolean;
  public showUserSettings: boolean;
  public showAnnualReviewSettingsSubMenu: boolean;
  public showStockSettingsMenu: boolean;
  public showSalesSettingsMenu: boolean;
  public showPurchaseSettingsMenu: boolean;
  public showTreasurySettingsMenu: boolean;
  public settingsPermission = [
    PermissionConstant.SettingsCommercialPermissions.LIST_FAMILY,
    PermissionConstant.SettingsCommercialPermissions.LIST_MEASUREUNIT,
    PermissionConstant.SettingsCommercialPermissions.LIST_MODELOFITEM,
    PermissionConstant.SettingsCommercialPermissions.LIST_NATURE,
    PermissionConstant.SettingsCommercialPermissions.LIST_PRODUCTITEM,
    PermissionConstant.SettingsCommercialPermissions.LIST_SUBFAMILY,
    PermissionConstant.SettingsCommercialPermissions.LIST_SUBMODEL,
    PermissionConstant.SettingsCommercialPermissions.LIST_VEHICLEBRAND,
    PermissionConstant.SettingsCommercialPermissions.LIST_SETTLEMENTMODE,
    PermissionConstant.SettingsCommercialPermissions.LIST_PRICES,
    PermissionConstant.SettingsCommercialPermissions.LIST_EXPENSE,
    PermissionConstant.SettingsCommercialPermissions.B2B_SETTINGS,
    PermissionConstant.SettingsTreasuryPermissions.LIST_WITHHOLDING_TAX_TREASURY,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_COUNTRY,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_CITY,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANK,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANKACCOUNT,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BENEFITINKIND,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BONUS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_CNSS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYRULE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_VARIABLE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYSTRUCTURE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_SKILLS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_GRADE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_JOB,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_PERIOD,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_OFFICE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_LANGUAGE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_CONTRACTTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_LEAVETYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_EXPENSEREPORTDETAILSTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_EVALUATIONCRITERIATHEME,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_QUALIFICATIONTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_EXITREASON,
    PermissionConstant.SettingsRHAndPaiePermissions.SHOW_JOBSPARAMETERS,
    PermissionConstant.SettingsRHAndPaiePermissions.SHOW_GENERALSETTINGS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_USER,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_GROUPUSERS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_ROLE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_INTERVIEWTYPE
  ];
  public payrollSettingsPermission = [
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BENEFITINKIND,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BONUS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_CNSS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYRULE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_VARIABLE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYSTRUCTURE
  ];
  public HRSettingsPermission = [
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_SKILLS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_GRADE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_JOB,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_PERIOD,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_OFFICE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_LANGUAGE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_CONTRACTTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_LEAVETYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_QUALIFICATIONTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_EXPENSEREPORTDETAILSTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_EVALUATIONCRITERIATHEME,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_INTERVIEWTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_EXITREASON,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_INTERVIEWTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.SHOW_GENERALSETTINGS,
    PermissionConstant.SettingsRHAndPaiePermissions.SHOW_JOBSPARAMETERS
  ];
  public UserSettingsPermission = [
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_USER,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_GROUPUSERS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_ROLE
  ];
  public AnnualReviewSettingsPermission = [
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_INTERVIEWTYPE,
    PermissionConstant.SettingsRHAndPaiePermissions.SHOW_GENERALSETTINGS,
    PermissionConstant.SettingsRHAndPaiePermissions.SHOW_JOBSPARAMETERS
  ];
  public StockSettingsPermission = [
    PermissionConstant.SettingsCommercialPermissions.LIST_FAMILY,
    PermissionConstant.SettingsCommercialPermissions.LIST_MEASUREUNIT,
    PermissionConstant.SettingsCommercialPermissions.LIST_MODELOFITEM,
    PermissionConstant.SettingsCommercialPermissions.LIST_NATURE,
    PermissionConstant.SettingsCommercialPermissions.LIST_PRODUCTITEM,
    PermissionConstant.SettingsCommercialPermissions.LIST_SUBFAMILY,
    PermissionConstant.SettingsCommercialPermissions.LIST_SUBMODEL,
    PermissionConstant.SettingsCommercialPermissions.LIST_VEHICLEBRAND
  ];
  public SalesSettingsPermission = [
    PermissionConstant.SettingsCommercialPermissions.LIST_SETTLEMENTMODE,
    PermissionConstant.SettingsCommercialPermissions.LIST_PRICES
  ];
  public TreasurySettingsPermissions = [
    PermissionConstant.SettingsTreasuryPermissions.LIST_WITHHOLDING_TAX_TREASURY,
    PermissionConstant.SettingsTreasuryPermissions.SHOW_WITHHOLDING_TAX_TREASURY
  ];


  constructor(private router: Router, public dashService: DashboardService,
    public searchItemService: SearchItemService, private serviceModulesSettings: ModulesSettingsService,
    private companyService: CompanyService, public authService: AuthService, private localStorageService : LocalStorageService,
    public userService: UserService, public translate: TranslateService) {
  }

  ngOnInit() {
    this.userService.getByEmail(this.localStorageService.getEmail()).subscribe(user => {
      this.user = user;
    });
    this.checkCRM();
    this.companyService.getCurrentCompany().subscribe(data => {
      this.isEsnSector = data.ActivityArea === NumberConstant.TWO ? true : false;
    });
    this.quotationAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_QUOTATION_SALES);
    this.deliveryAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_DELIVERY_SALES);
    this.deliveryListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_DELIVERY_SALES);
    this.assetAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ASSET_SALES);
    this.quickSalesPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_QUICK_SALES);
    this.orderListPermissions = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ORDER_SALES);
    this.activeListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ACTIVE);
    this.showSideBar = this.authService.hasAuthorities(this.settingsPermission);
    this.showpayrollSettingsMenu = this.authService.hasAuthorities(this.payrollSettingsPermission);
    this.showpRHSettingsMenu = this.authService.hasAuthorities(this.HRSettingsPermission);
    this.showUserSettings = this.authService.hasAuthorities(this.UserSettingsPermission);
    this.showAnnualReviewSettingsSubMenu = this.authService.hasAuthorities(this.AnnualReviewSettingsPermission);
    this.showTreasurySettingsMenu = this.authService.hasAuthorities(this.TreasurySettingsPermissions);

    this.showStockSettingsMenu = this.authService.hasAuthorities(this.StockSettingsPermission);
    this.showSalesSettingsMenu = this.authService.hasAuthorities(this.SalesSettingsPermission);
    this.showPurchaseSettingsMenu = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_EXPENSE);
  }

  checkCRM() {
    this.serviceModulesSettings.getModulesSettings().subscribe(data => {
      if (data[SharedConstant.CRM] && data[SharedConstant.RH] ) {
        this.showReminderCRM = true;
      }
    });
  }

  ngOnDestroy() {
    this.showAside = false;
    this.showSideBarButton = false;
  }

  ngAfterViewInit(): void {
    if (this.showSideBar || this.showpRHSettingsMenu || this.showUserSettings ||
      this.showpayrollSettingsMenu || this.showAnnualReviewSettingsSubMenu || this.showStockSettingsMenu
      || this.showSalesSettingsMenu || this.showPurchaseSettingsMenu || this.showTreasurySettingsMenu) {
      this.showAside = 'lg';
    }
    if (this.showSettingsMenu || this.showpRHSettingsMenu || this.showUserSettings || this.showUserSettings ||
      this.showpayrollSettingsMenu || this.showAnnualReviewSettingsSubMenu || this.showStockSettingsMenu
      || this.showSalesSettingsMenu || this.showPurchaseSettingsMenu || this.showTreasurySettingsMenu) {
      this.showSideBarButton = 'lg';
    }

  }

  public showNavBar() {
    this.isNavBarShown = true;

  }

  public goToQuotation() {
    if (this.router.url.includes('sales/quotation/add') === true) {
      this.router.navigateByUrl(SharedConstant.QUOTATION_URL_NEW);
    } else {
      this.router.navigateByUrl(SharedConstant.QUOTATION_URL);
    }
  }

  public goToDelivery() {
    if (this.router.url.includes('sales/delivery/add') === true) {
      this.router.navigateByUrl(SharedConstant.DELIVERY_URL_NEW);
    } else {
      this.router.navigateByUrl(SharedConstant.DELIVERY_URL);
    }
  }

  public goToDeliveryList() {
    this.router.navigateByUrl(SharedConstant.DELIVERY_LIST_URL);
  }

  public goToCounterSales() {
    this.router.navigateByUrl(SharedConstant.COUNTER_SALES_URL);
  }

  public goToAddAsset() {
    if (this.router.url.includes('sales/asset/add') === true) {
      this.router.navigateByUrl(SharedConstant.ADD_ASSET_URL_NEW);
    } else {
      this.router.navigateByUrl(SharedConstant.ADD_ASSET_URL);
    }
  }

  public goToSearchItem() {
    this.searchItemService.typeSupplier = 2;
    if (this.router.url.includes(SharedConstant.SEARCH_ITEM_EDIT_URL) === true) {
      this.router.navigateByUrl(SharedConstant.SEARCH_ITEM_ADD_URL);
    } else {
      this.router.navigateByUrl(SharedConstant.SEARCH_ITEM_EDIT_URL);
    }
  }
  public goToInvoice() {
    if (this.router.url.includes('sales/invoice/add') === true) {
      this.router.navigateByUrl(SharedConstant.INVOICE_URL_NEW);
    } else {
      this.router.navigateByUrl(SharedConstant.INVOICE_URL);
    }
  }
  public goToCRA() {
    if (this.router.url.includes('rh/timesheet') === true) {
      this.router.navigateByUrl(SharedConstant.TIMESHEET_LIST_URL);
    } else {
      this.router.navigateByUrl(SharedConstant.TIMESHEET_URL);
    }
  }
  public goToLeave() {
    if (this.router.url.includes('payroll/leave/add') === true) {
      this.router.navigateByUrl(SharedConstant.LEAVE_URL);
    } else {
      this.router.navigateByUrl(SharedConstant.LEAVE_ADD_URL);
    }
  }
  public goToDashboard() {
    this.router.navigateByUrl(SharedConstant.DASHBOARD_URL);
  }

  public SendOpenColorPickerEvent() {
    this.OpenColorPicker.emit();
  }

  public SendAddDragEvent() {
    this.AddDrag.emit();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
    if (this.innerWidth < NumberConstant.SEVEN_HUNDRED_SIXTY_EIGHT && this.isVisibleNotificationComponent) {
      this.isVisibleNotificationComponent = false;
      this.notificaitonDropdown.ngOnDestroy();
    } else if (this.innerWidth > NumberConstant.SEVEN_HUNDRED_SIXTY_EIGHT && !this.isVisibleNotificationComponent) {
      this.isVisibleNotificationComponent = true;
      if (this.notificaitonDropdown) {
        this.notificaitonDropdown.ngOnInit();
      }
      if (this.reminderDropdownComponent) {
        this.reminderDropdownComponent.ngOnInit();
      }
    }
  }
}
