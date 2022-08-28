import {AfterViewInit, Component, DoCheck, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {DashboardService} from '../../dashboard/services/dashboard.service';
import {Router} from '@angular/router';
import {SideBarComponent} from '../side-bar/side-bar.component';
import {NumberConstant} from '../../constant/utility/number.constant';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {ColorPickerComponent} from '../../dashboard/color-picker/color-picker.component';

import {StatusOpportunityConstant} from '../../constant/crm/status-opportunity.constant';
import {RoleConfigConstant} from '../_roleConfigConstant';
import {StarkPermissionsService, StarkRolesService} from '../../stark-permissions/stark-permissions.module';
import {fullReducedLoadConfigPermissions, notEmptyValue} from '../../stark-permissions/utils/utils';
import {isNullOrUndefined} from 'util';
import {SharedCrmConstant} from '../../constant/crm/sharedCrm.constant';
import {TranslateService} from '@ngx-translate/core';
import {AllSettings} from '../../settings/_settings';
import {PopupAddStatusOpportunityComponent} from '../../crm/components/opportunity/add-status-opportunity/popup-add-status-opportunity.component';
import {NotificationService} from '../../shared/services/signalr/notification/notification.service';
import {NotificationCrmService} from '../../crm/services/notification-crm/notification-crm.service';
import {ActionConstant} from '../../constant/crm/action.constant';
import {GenericAccountingService} from '../../accounting/services/generic-accounting.service';
import {SharedAccountingConstant} from '../../constant/accounting/sharedAccounting.constant';
import {TiersConstants} from '../../constant/purchase/tiers.constant';
import {ActivityAreaEnumerator} from '../../models/enumerators/activity-area.enum';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../permission-constant';
import {ReportingConstant} from '../../constant/accounting/reporting.constant';
import { CompanyService } from '../../administration/services/company/company.service';
import { UserCurrentInformationsService } from '../../shared/services/utility/user-current-informations.service';
import {LocalStorageService} from '../../login/Authentification/services/local-storage-service';
import { NavGlobals } from '../_nav';
import { ReconciliationConstant } from '../../constant/accounting/reconciliation-bank';

@Component({
  selector: 'app-main',
  providers: [NavGlobals, AllSettings],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, DoCheck, AfterViewInit {
  public RoleConfigConstant = RoleConfigConstant;
  DashboardRoute = false;
  DashBoardConfig = SharedConstant.CONFIGURE_THE_DASHBOARD;
  Saved: boolean;
  Class = 'fa fa-cogs fa-lg';
  isDocument: boolean;
  isStockDocument: boolean;
  isReportingAccountingEditions: boolean;
  isReportingAccountingFinancialStates: boolean;
  isReconciliationBankAccounting: boolean;
  isReportingAccountingJournals: boolean;
  isReportingAccounting: boolean;
  isSettlement: boolean;
  @ViewChild(SideBarComponent) sideBarComponent;
  actuelURL: string;
  public showAside: any = 'lg';
  firstAccess = true;
  isEcommerce: boolean;
  isManufacturing: boolean;
  data: any;
  public listRoleConfigs: any;
  public isCrm = false;
  home = '';
  menu: string;
  router_url: string;
  currentpage: string;
  actionpage: string;
  public navItemsList: any;
  public paramItemsList: any;
  NoOnglet = true;
  public isTiers = false;
  public countNotifications = NumberConstant.ZERO;
  public connectedUser;
  public notifications = SharedConstant.NOTIFICATIONS;
  public users_actions = SharedConstant.USERS_ACTIONS;
  public actions_notifications = SharedConstant.ACTIONS_NOTIFICATIONS;
  public isUsersActionsRouter = false;
  isAutoVersion: boolean;
  // Dashboard
  public hasSalesStatePermission = false;
  public hasTopSupplierPermission = false;
  public hasTopCustomersPermission = false;
  public hasSalesPurchasePermission = false;
  public hasStockStatePermission = false;
  public hasSalesPerItemPermission = false;
  public hasStateOrdersPermission = false;

  AddDrag() {

    if (this.Saved) {
      this.Class = 'fa fa-save fa-lg';
      this.dashService.AddDragable();
      this.DashBoardConfig = SharedConstant.SAVE;

    } else {
      this.Class = 'fa fa-cogs fa-lg';
      this.dashService.StopDragable();
      this.DashBoardConfig = SharedConstant.CONFIGURE_THE_DASHBOARD;
    }
    this.Saved = !this.Saved;
  }
  // Array Of Permissions

  public settingsPermission = [
    PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_COMPANY,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_COUNTRY,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_CITY,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANK,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANKACCOUNT
  ];
  public payrollSettingsPermission = [
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BENEFITINKIND,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_BONUS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_CNSS,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYRULE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_VARIABLE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYSTRUCTURE,
    PermissionConstant.SettingsRHAndPaiePermissions.LIST_ADDITIONAL_HOUR
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
  public AnnualReviewSettingsPermission =[
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
    PermissionConstant.SettingsCommercialPermissions.LIST_PRICES,
    PermissionConstant.SettingsCommercialPermissions.LIST_PRICECATEGORY
  ];
  public TreasurySettingsPermissions = [
    PermissionConstant.SettingsTreasuryPermissions.LIST_WITHHOLDING_TAX_TREASURY,
    PermissionConstant.SettingsTreasuryPermissions.SHOW_WITHHOLDING_TAX_TREASURY
  ]
  // Permission Constants

  public hasCompanyUpdatePermission: boolean;
  public hasCountryListPermission: boolean;
  public hasCityListPermission: boolean;
  public hasBankListPermission: boolean;
  public hasBankAccountListPermission: boolean;
  public hasBenefitInKindListPermission: boolean;
  public hasBonusListPermission: boolean;
  public hasCnssListPermission: boolean;
  public hasSalaryRuleListPermission: boolean;
  public hasVariableListPermission: boolean;
  public hasSalaryStructureListPermission: boolean;
  public hasSkillsListPermission: boolean;
  public hasGradeListPermission: boolean;
  public hasJobListPermission: boolean;
  public hasPeriodListPermission: boolean;
  public hasOfficeListPermission: boolean;
  public hasLanguageListPermission: boolean;
  public hasContractTypeListPermission: boolean;
  public hasLeaveTypeListPermission: boolean;
  public hasExpenseReportTypeListPermission: boolean;
  public hasEvaluationCriteriaListPermission: boolean;
  public hasQualificationTypeListPermission: boolean;
  public hasExitReasonListPermission: boolean;
  public hasInterviewTypeListPermission: boolean;
  public hasGeneralSettingsListPermission: boolean;
  public hasShowJobsParametersPermission: boolean;
  public hasUsersListPermission: boolean;
  public hasGroupUserListPermission: boolean;
  public hasRoleListPermission: boolean;
  //Stock_Permissions
  public hasNatureListPermission: boolean;
  public hasFamilyListPermission: boolean;
  public hasSubFamilyListPermission: boolean;
  public hasMeasureUnitListPermission: boolean;
  public hasBrandsListPermission: boolean;
  public hasProductBrandsListPermission: boolean;
  public hasModelsListPermission: boolean;
  public hasSubModelsListPermission: boolean;
//Sales_Permissions
  public hasSettlementModeListPermission: boolean;
  public hasPricesListPermission: boolean ;
  public hasPriceCategoryListPermission: boolean;
//Purchase_permissions
  public hasExpenseListPermission: boolean ;
  public hasB2BSettingPermission : boolean;

//Treasury_Permissions
public hasWithholdingTaxListPermission : boolean;
  //Menu Permisions
  public showSettingsMenu: boolean;
  public showpayrollSettingsMenu: boolean;
  public showpRHSettingsMenu: boolean;
  public showUserSettings: boolean;
  public showAnnualReviewSettingsSubMenu: boolean;
  public showStockSettingsMenu  : boolean;
  public showSalesSettingsMenu : boolean;
  public showPurchaseSettingsMenu  : boolean;
  public showTreasurySettingsMenu
  public hasAdditionalHourListPermission: boolean;
  //Dashboard
  public haveDhashboardPermission = false ;

  public CRMPermissions = PermissionConstant.CRMPermissions;
  public hasCrmPipeline: boolean;
  public hasCrmStatus: boolean;
  public hasCrmCategory: boolean;


  constructor(private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService,
              public dashService: DashboardService, private router: Router, private rolesService: StarkRolesService, public translate: TranslateService,
              private navGlobals: NavGlobals, private allSettings: AllSettings,
              private notificationService: NotificationService, private notificationCRMService: NotificationCrmService,
              public authService: AuthService, private userCurrentInformationsService : UserCurrentInformationsService,private localStorageService : LocalStorageService) {
    this.navItemsList = navGlobals.navItems;
    this.paramItemsList = this.allSettings.ALL_SETTINGS;
    this.isAutoVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Auto;

  }

  ngOnInit() {
    this.Saved = true;
    this.showSettingsMenu = this.authService.hasAuthorities(this.settingsPermission);
    this.showpayrollSettingsMenu = this.authService.hasAuthorities(this.payrollSettingsPermission);
    this.showpRHSettingsMenu = this.authService.hasAuthorities(this.HRSettingsPermission);
    this.showUserSettings = this.authService.hasAuthorities(this.UserSettingsPermission);
    this.showAnnualReviewSettingsSubMenu = this.authService.hasAuthorities(this.AnnualReviewSettingsPermission);
    this.showStockSettingsMenu = this.authService.hasAuthorities(this.StockSettingsPermission);
    this.showSalesSettingsMenu = this.authService.hasAuthorities(this.SalesSettingsPermission);
    this.showPurchaseSettingsMenu = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_EXPENSE) ;
    this.showTreasurySettingsMenu = this.authService.hasAuthorities(this.TreasurySettingsPermissions);
    // Settings SubMenu
    this.hasCompanyUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_COMPANY);
    this.hasCountryListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_COUNTRY);
    this.hasCityListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_CITY);
    this.hasBankListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANK);
    this.hasBankAccountListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_BANKACCOUNT);
    // Payroll Settings SubMenu
    this.hasBenefitInKindListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_BENEFITINKIND);
    this.hasBonusListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_BONUS);
    this.hasCnssListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_CNSS);
    this.hasSalaryRuleListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYRULE);
    this.hasVariableListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_VARIABLE);
    this.hasSalaryStructureListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYSTRUCTURE);
    this.hasAdditionalHourListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_ADDITIONAL_HOUR);
    // HR Settings SubMenu
    this.hasSkillsListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_SKILLS);
    this.hasGradeListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_GRADE);
    this.hasJobListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_JOB);
    this.hasPeriodListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_PERIOD);
    this.hasOfficeListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_OFFICE);
    this.hasLanguageListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_LANGUAGE);
    this.hasContractTypeListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_CONTRACTTYPE);
    this.hasLeaveTypeListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_LEAVETYPE);
    this.hasExpenseReportTypeListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_EXPENSEREPORTDETAILSTYPE);
    this.hasEvaluationCriteriaListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_EVALUATIONCRITERIATHEME);
    this.hasQualificationTypeListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_QUALIFICATIONTYPE);
    this.hasExitReasonListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_EXITREASON);
    this.hasInterviewTypeListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_INTERVIEWTYPE);
    this.hasGeneralSettingsListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_GENERALSETTINGS);
    this.hasShowJobsParametersPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_JOBSPARAMETERS);
    // User Settings SubMenu
    this.hasUsersListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_USER);
    this.hasGroupUserListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_GROUPUSERS);
    this.hasRoleListPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.LIST_ROLE);
    // Stock Settings SubMenu
    this.hasNatureListPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_NATURE);
    this.hasFamilyListPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_FAMILY);
    this.hasSubFamilyListPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_SUBFAMILY);
    this.hasMeasureUnitListPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_MEASUREUNIT);
    this.hasBrandsListPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_VEHICLEBRAND);
    this.hasProductBrandsListPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_PRODUCTITEM);
    this.hasModelsListPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_MODELOFITEM);
    this.hasSubModelsListPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_SUBMODEL);
    //Sales Settings SubMenu
    this.hasSettlementModeListPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_SETTLEMENTMODE);
    this.hasPricesListPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_PRICES);
    this.hasPriceCategoryListPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_PRICECATEGORY);
    //Purchase Settings SubMenu
    this.hasExpenseListPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.LIST_EXPENSE);
    this.hasB2BSettingPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.B2B_SETTINGS);


    //Treasury Settings SubMenu
    this.hasWithholdingTaxListPermission = this.authService.hasAuthorities(this.TreasurySettingsPermissions);

    //Dashboard
    this.haveDhashboardPermission = this.authService.hasAuthorities([
      PermissionConstant.DashboardPermissions.PURCHASE_DASHBOARD,
      PermissionConstant.DashboardPermissions.SALES_DASHBOARD,
      PermissionConstant.DashboardPermissions.TREASURY_SALES_DASHBOARD,
      PermissionConstant.DashboardPermissions.TREASURY_PURCHASE_DASHBOARD
    ]);
    //CRM permissions
    this.hasCrmPipeline = this.authService.hasAuthority(PermissionConstant.CRMPermissions.PIPELINE);
    this.hasCrmStatus = this.authService.hasAuthority(PermissionConstant.CRMPermissions.STATUS_OF_CATEGORIES);
    this.hasCrmCategory = this.authService.hasAuthority(PermissionConstant.CRMPermissions.VIEW_CATEGORY);
  }

  ngAfterViewInit(): void {
   // this.loadConfigPermissions();

  }

  ngDoCheck() {
    if (this.router.url === '/main/dashboard') {
      this.DashboardRoute = true;
      this.home = this.translate.instant(this.navItemsList[0].name);
    } else {
      this.DashboardRoute = false;
    }
    this.checkRoute(this.router.url);
    this.idEcommerceForm();
    this.idDocumentForm();
    this.idStockDocumentForm();
    this.idManufacturingForm();
    this.idCrmForm();
    this.isListTierInterface();
  }

  checkRoute(url_link: string) {
    this.home = null;
    this.menu = null;
    this.currentpage = null;
    this.actionpage = null;
    this.router_url = url_link;
    const listUrl = url_link.split('/');
    listUrl.forEach(data => data.toUpperCase());
    if ((url_link.toLowerCase().indexOf('advancedAdd'.toLowerCase()) > NumberConstant.ZERO) ||
      (url_link.toLowerCase().indexOf('add'.toLowerCase()) > NumberConstant.ZERO)) {
      this.actionpage = this.translate.instant('ADD');
      if (url_link.toLowerCase().indexOf('advancedAdd'.toLowerCase()) > NumberConstant.ZERO) {
        this.router_url = url_link.slice(NumberConstant.ZERO, url_link.length -
          (url_link.length - url_link.indexOf('dvancedAdd')) - NumberConstant.TWO);
      } else {
        this.router_url = url_link.slice(NumberConstant.ZERO, url_link.length -
          (url_link.length - url_link.indexOf('dd')) - NumberConstant.TWO);
      }
    } else if ((url_link.toLowerCase().indexOf('advancedEdit'.toLowerCase()) > NumberConstant.ZERO) ||
      (listUrl.indexOf('edit'.toLowerCase()) > NumberConstant.ZERO)) {
      this.actionpage = this.translate.instant('EDIT');
      if (url_link.toLowerCase().indexOf('advancedEdit'.toLowerCase()) > NumberConstant.ZERO) {
        this.router_url = url_link.slice(NumberConstant.ZERO, url_link.length -
          (url_link.length - url_link.indexOf('dvancedEdit')) - NumberConstant.TWO);
      } else if (url_link.indexOf('Edit') > NumberConstant.ZERO) {
        this.router_url = url_link.slice(NumberConstant.ZERO, url_link.length -
          (url_link.length - url_link.indexOf('Edit')) - NumberConstant.ONE);
      } else {
        this.router_url = url_link.slice(NumberConstant.ZERO, url_link.length -
          (url_link.length - url_link.indexOf('edit')) - NumberConstant.ONE);
      }
    } else if ((url_link.toLowerCase().indexOf(TiersConstants.PROFILE.toLowerCase())) > NumberConstant.ZERO) {
      this.checkIsProfilePage(url_link);
    } else if (this.checkHistoryUrl(url_link)) {
      this.actionpage = this.translate.instant('HISTORY');
      this.getRouterUrlAccounting(url_link);
    } 
    for (let i = NumberConstant.ZERO; i < this.navItemsList.length; i++) {
      if (this.navItemsList[i].children !== undefined) {
        for (let j = NumberConstant.ZERO; j < this.navItemsList[i].children.length; j++) {
          if (this.navItemsList[i].children[j].children !== undefined) {
            for (let k = NumberConstant.ZERO; k < this.navItemsList[i].children[j].children.length; k++) {
              if (url_link.toLowerCase().indexOf(this.navItemsList[i].children[j].children[k].url.toLowerCase()) > NumberConstant.ZERO) {
                this.home = this.translate.instant(this.navItemsList[i].name);
                this.menu = this.translate.instant(this.navItemsList[i].children[j].name);
                this.currentpage = this.translate.instant(this.navItemsList[i].children[j].children[k].name);
                if (this.navItemsList[i].children[j].children.length > NumberConstant.ZERO) {
                  this.NoOnglet = false;
                } else {
                  this.NoOnglet = true;
                }
                break;
              }
            }
          } else {
            if (url_link.toLowerCase().indexOf(this.navItemsList[i].children[j].url.toLowerCase()) > NumberConstant.ZERO) {
              this.home = this.translate.instant(this.navItemsList[i].name);
              this.menu = this.translate.instant(this.navItemsList[i].children[j].name);
              this.NoOnglet = true;
              break;
            }
          }
        }
      } else {
        if (url_link.toLowerCase() === (this.navItemsList[i].url.toLowerCase())) {
          this.home = this.translate.instant(this.navItemsList[i].name);
          break;
        }
      }
    }
    if (this.menu === null && this.home === null || this.menu === null || this.home === null) {
      if (url_link.toLowerCase().indexOf('settings'.toLowerCase()) === -NumberConstant.ONE) {
        const position = '/main/'.length;
        const setting = 'settings/';
        url_link = [url_link.slice(0, position), setting, url_link.slice(position)].join('');
      }
      if (this.router.url === '/main/settings') {
        this.home = this.translate.instant(listUrl[NumberConstant.TWO.toString()].toUpperCase());
      }
      for (let i = NumberConstant.ZERO; i < this.paramItemsList.length; i++) {
        if (this.paramItemsList[i].sub_menus !== undefined) {
          for (let j = NumberConstant.ZERO; j < this.paramItemsList[i].sub_menus.length; j++) {
            if (url_link.toLowerCase().indexOf(this.paramItemsList[i].sub_menus[j].url.toLowerCase()) > -NumberConstant.ONE) {
              this.home = this.translate.instant(listUrl[NumberConstant.TWO.toString()].toUpperCase());
              this.menu = this.translate.instant(this.paramItemsList[i].menu);
              this.currentpage = this.translate.instant(this.paramItemsList[i].sub_menus[j].menu);
              if (this.paramItemsList[i].sub_menus.length > NumberConstant.ZERO) {
                this.NoOnglet = false;
              } else {
                this.NoOnglet = true;
              }
              break;
            }
          }
        }
      }
      this.routerIsUserProfil(listUrl);
      this.routerIsUserAction();
      this.routerIsNotifications();
      this.routerIsActionsNotifications();
    }
    this.routerSubMenuNavItem(url_link);
  }

  public isSupplier() {
    return this.router.url.indexOf(TiersConstants.SUPPLIER.toLowerCase()) > NumberConstant.ZERO;
  }

  public isCustomer() {
    return this.router.url.indexOf(TiersConstants.CUSTOMER.toLowerCase()) > NumberConstant.ZERO;
  }

  public checkIsProfilePage(urlLink: string) {
    this.actionpage = this.isCustomer() ? this.translate.instant(TiersConstants.PROFILE_CUSTOMER) : this.isSupplier()
      ? this.translate.instant(TiersConstants.PROFILE_SUPPLIER) : SharedConstant.EMPTY;
    this.router_url = urlLink.slice(NumberConstant.ZERO, urlLink.length -
      (urlLink.length - urlLink.indexOf(TiersConstants.PROFILE.toLowerCase())) - NumberConstant.ONE);
  }

  private routerIsUserProfil(listUrl: string[]) {
    if (this.router.url === SharedConstant.PROFILE_URL) {
      this.home = this.translate.instant(listUrl[NumberConstant.TWO.toString()].toUpperCase());
    }
  }

  private routerIsUserAction() {
    if (this.router.url.includes(SharedConstant.USERS_ACTIONS_URL)) {
      this.home = this.translate.instant(SharedConstant.USERS_ACTIONS);
      this.isUsersActionsRouter = true;
    } else {
      this.isUsersActionsRouter = false;
    }
  }

  idDocumentForm() {
    if ((this.router.url.indexOf('quotation') > 0
      || this.router.url.indexOf('sales/order') > NumberConstant.ZERO
      || this.router.url.indexOf('purchaseorder') > NumberConstant.ZERO
      || this.router.url.indexOf('purchasefinalorder') > NumberConstant.ZERO
      || this.router.url.indexOf('delivery') > 0
      || this.router.url.indexOf('invoice') > 0
      || this.router.url.indexOf('asset') > 0) && (this.router.url.indexOf('orderProject') < 0)
      && (this.router.url.indexOf('ecommerce') < 0)) {
      this.isDocument = true;
    } else {
      this.isDocument = false;
    }
  }

  idStockDocumentForm() {
    if (this.router.url.indexOf('stockDocuments') > 0) {
      this.isStockDocument = true;
    } else {
      this.isStockDocument = false;
    }
  }

  idEcommerceForm() {
    if (this.router.url.indexOf('ecommerce/log') > 0) {
      this.isEcommerce = true;
    } else {
      this.isEcommerce = false;
    }
  }

  isListTierInterface() {
    this.isTiers = this.router.url.indexOf(TiersConstants.SUPPLIER.toLowerCase()) > NumberConstant.ZERO ||
      this.router.url.indexOf(TiersConstants.CUSTOMER.toLowerCase()) > NumberConstant.ZERO;
  }

  idCrmForm() {
    this.isCrm = this.router.url.indexOf(SharedCrmConstant.CRM_ARCHIVING_URL) > NumberConstant.ZERO ||
      this.router.url.indexOf(SharedCrmConstant.CRM_ORGANISATION_ARCHIVING_URL) > NumberConstant.ZERO ||
      this.router.url.indexOf(SharedCrmConstant.CRM_CONTACT_ARCHIVING_URL) > NumberConstant.ZERO ||
      this.router.url.indexOf(SharedCrmConstant.CRM_OPPORTUNITY_ARCHIVING_URL) > NumberConstant.ZERO ||
      this.router.url.indexOf(SharedCrmConstant.CRM_CLAIM_ARCHIVING_URL) > NumberConstant.ZERO;
  }

  idManufacturingForm() {
    if (
      this.router.url.indexOf(SharedConstant.NOMENCLATURE) > NumberConstant.ZERO
      || this.router.url.indexOf(SharedConstant.GAMME) > NumberConstant.ZERO
      || this.router.url.indexOf(SharedConstant.FABRICATION_ARRANGEMENT) > NumberConstant.ZERO) {
      this.isManufacturing = true;
    } else {
      this.isManufacturing = false;
    }
  }

  public OpenColorPicker(): void {
    const TITLE = 'CHOOSE_PALETTE';
    this.formModalDialogService.openDialog(TITLE, ColorPickerComponent,
      this.viewRef, this.cancel.bind(this)
      , this.data, true, SharedConstant.MODAL_DIALOG_SIZE_S);
  }

  public cancel() {
  }

  SetColor(colorindex: number) {
    this.dashService.SetColor(colorindex);
    this.dashService.refreshwidgets();
  }

  public OpenDialogAddStatusOpportunity(): void {
    const TITLE = StatusOpportunityConstant.NEW_STATUS_OPPORTUNITY;
    this.formModalDialogService.openDialog(TITLE, PopupAddStatusOpportunityComponent,
      this.viewRef, this.cancel.bind(this), this.data, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  checkIfIsOnlyConsultant() {
    if (this.router.url === SharedConstant.DASHBOARD_URL) {
      this.rolesService.hasOnlyRoles(RoleConfigConstant.ConsultantConfig).then(x => {
        if (x === true) {
          this.rolesService.hasOnlyRoles(RoleConfigConstant.AdminConfig).then(y => {
            if (y === false) {
              this.router.navigate([SharedConstant.TIMESHEET_URL]);
            }
          });
        }
      });
    }
  }

  private routerIsNotifications() {
    if (this.router.url.includes(SharedConstant.NOTIFICATIONS_URL)) {
      this.notificationService.unreadNotificationCounterSubject.subscribe(value => {
        this.countNotifications = value;
      });
      this.home = this.translate.instant(SharedConstant.NOTIFICATIONS);
    }
  }

  private routerIsActionsNotifications() {
    if (this.router.url.includes(SharedConstant.ACTIONS_NOTIFICATIONS_URL)) {
      this.userCurrentInformationsService.getConnectedEmployeeId().subscribe(idEmployee => {
      this.getRemindersNotificationsCrm(idEmployee);
      this.home = this.translate.instant(SharedConstant.ACTIONS_NOTIFICATIONS);
      });
    }
  }

  private getRemindersNotificationsCrm(idEmployee: number) {
    this.notificationCRMService.getJavaGenericService().getEntityList(ActionConstant.REMINDER_CONNECTED_USER,
      idEmployee).subscribe((data) => {
      if (data) {
        this.countNotifications = data.length;
      }
    });
  }
  private routerSubMenuNavItem(url_link) {
    if (url_link.indexOf('/accounting/reporting/')  > NumberConstant.ZERO) {
      this.home = this.translate.instant('ACCOUNTING') ;
      this.menu = this.translate.instant('REPORTINGS');
    }
    ReportingConstant.navLinkAccountingReportMenu.filter(data => url_link.includes(data.key))
      .map(item => {
        this.currentpage = this.translate.instant(item.parent);
        this.actionpage = this.translate.instant(item.name);
      });
      if (url_link.indexOf('/accounting/reconciliationBankMenu/')  > NumberConstant.ZERO) {
        this.home = this.translate.instant('ACCOUNTING') ;
        this.menu = this.translate.instant('RECONCILIATION_BANK');
      }
      ReconciliationConstant.navLinkAccountingReconciliationBankMenu.filter(data => url_link.includes(data.key))
        .map(item => {
          this.currentpage = this.translate.instant(item.name);
          if(item.name.includes('HISTORY')){
            this.currentpage = this.translate.instant(item.parent);
            this.actionpage = this.translate.instant('HISTORY');
          }
        });
  }

  private checkHistoryUrl(url_link) {
    return url_link.toLowerCase().includes('history') || url_link.toLowerCase().includes('historic')  ;
  }

  private getRouterUrlAccounting(url_link)
  {
    if (url_link.includes('/SOI')) {
      this.router_url = url_link.replace('historic/SOI', 'stateOfIncome');
    }
    else if (this.router_url.includes('/BS')) {
      this.router_url = url_link.replace('historic/BS', 'balancesheet');
    }
    else if (this.router_url.includes('/CIB')) {
      this.router_url = url_link.replace('historic/CIB', 'intermediaryBalance');
    }
    else if (this.router_url.includes('/CFA')) {
      this.router_url = url_link.replace('historic/CFA', 'cashFlow');
    } else {
      this.getRouterUrlHistoric(url_link);
    }
  }
  getRouterUrlHistoric(url_link) {
    let indexHistory = url_link.indexOf('history');
    if (url_link.indexOf('historic') > NumberConstant.ZERO) {
      indexHistory = url_link.indexOf('historic');
    }
    this.router_url = url_link.slice(NumberConstant.ZERO, url_link.length -
      (url_link.length - indexHistory) - NumberConstant.ONE);
  }
}
