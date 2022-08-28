import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, Inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatDialogModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
const { version: appVersion } = require('../../package.json');

//#region  angular modules
import { Router } from '@angular/router';
import { AppAsideModule } from '@coreui/angular/aside/app-aside.module';
import { AppBreadcrumbModule } from '@coreui/angular/breadcrumb/app-breadcrumb.module';
import { AppBreadcrumbService } from '@coreui/angular/breadcrumb/app-breadcrumb.service';
//#endregion
//#region  core ui module
import { AppFooterModule } from '@coreui/angular/footer/app-footer.module';
import { AppHeaderModule } from '@coreui/angular/header/app-header.module';
import { AppSidebarModule } from '@coreui/angular/sidebar/app-sidebar.module';
import { ApmErrorHandler, ApmService } from '@elastic/apm-rum-angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// Imports the AutoComplete module
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
/**DatePicker internalization */
import '@progress/kendo-angular-intl/locales/en/all';
import '@progress/kendo-angular-intl/locales/fr/all';
import { MessageService } from '@progress/kendo-angular-l10n';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { ChartsModule } from 'ng2-charts';
import { DragulaModule } from 'ng2-dragula';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { BarRatingModule } from 'ngx-bar-rating';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CookieService } from 'ngx-cookie-service';
import { EmbedVideo } from 'ngx-embed-video/dist';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AppRoutingModule } from '../app.route';
import { AppConfig } from '../COM/config/app.config';
import { GrowlService } from '../COM/Growl/growl.service';
import { ErrorInterceptor } from '../COM/Interceptors/error.interceptor';
import { RequestInterceptor } from '../COM/Interceptors/request.interceptor';
import { ResponseInterceptor } from '../COM/Interceptors/response.interceptors';
import { ErrorHandlerService } from '../COM/services/error-handler-service';
import { SuccessHandlerService } from '../COM/services/success-handler.service';
import { SpinnerService } from '../COM/spinner/spinner.service';
import { environment } from '../environments/environment';
import { AccountingUserConfigurationComponent } from './accounting/accounting-configuration/accounting-user-configuration/accounting-user-configuration.component';
import { CompanyService } from './administration/services/company/company.service';
import { ModuleServiceJava } from './administration/services/role/module-service-java.service';
import { RoleJavaService } from './administration/services/role/role.java.service';
import { UserB2bService } from './administration/services/user-b2b/user-b2b.service';
import { UserRoleService } from './administration/services/user-role/user-role.service';
import { UserJavaService } from './administration/services/user/user.java.service';
import { AppComponent } from './app.component';
import { ArchivingMenuComponent } from './crm/components/archiving/archiving-menu/archiving-menu.component';
import { AddDateToRememberComponent } from './crm/components/date-to-remember/add-date-to-remember/add-date-to-remember.component';
import { PopupAddStatusOpportunityComponent } from './crm/components/opportunity/add-status-opportunity/popup-add-status-opportunity.component';
import { ActionService } from './crm/services/action/action.service';
import { StatusOpportunityService } from './crm/services/list-status-opportunity/status-opportunity.service';
import { NotificationCrmService } from './crm/services/notification-crm/notification-crm.service';
import { ReminderEventService } from './crm/services/reminder-event/reminder-event.service';
import { SideNavService } from './crm/services/sid-nav/side-nav.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardService } from './dashboard/services/dashboard.service';
import { CandidaciesByRecruitmentComponent } from './dashboard/widgets/candidacies-by-recruitment/candidacies-by-recruitment.component';
import { EmployeeByOfficeComponent } from './dashboard/widgets/employee-by-office/employee-by-office.component';
import { GendreByMonthComponent } from './dashboard/widgets/gendre-by-month/gendre-by-month.component';
import { ItemPurchaseComponent } from './dashboard/widgets/item-purchase/item-purchase.component';
import { ItemSaleComponent } from './dashboard/widgets/item-sale/item-sale.component';
import { LeaveByEmployeeComponent } from './dashboard/widgets/leave-by-employee/leave-by-employee.component';
import { NumberPickerFilterComponent } from './dashboard/widgets/number-picker-filter/number-picker-filter.component';
import { PeriodFilterComponent } from './dashboard/widgets/period-filter/period-filter.component';
import { RecruitmentByOfficeComponent } from './dashboard/widgets/recruitment-by-office/recruitment-by-office.component';
import { SaleStateComponent } from './dashboard/widgets/sale-state/sale-state.component';
import { SalesPurchasesVolumeComponent } from './dashboard/widgets/sales-purchases-volume/sales-purchases-volume.component';
import { ToogleBtnFilterComponent } from './dashboard/widgets/toogle-btn-filter/toogle-btn-filter.component';
import { TopCostumersComponent } from './dashboard/widgets/top-costumers/top-costumers.component';
import { TopSupliersComponent } from './dashboard/widgets/top-supliers/top-supliers.component';
import { TotalWorkDayByEmployeeComponent } from './dashboard/widgets/total-work-day-by-employee/total-work-day-by-employee.component';
import { MenuEcommerceComponent } from './ecommerce/menu-ecommerce/menu-ecommerce.component';
import { httpLoaderFactory } from './httpLoaderFactory';
import { ActiveAssignmentService } from './immobilization/services/active-assignment/active-assignment.service';
import { FetchProductsComponent } from './inventory/components/fetch-products/fetch-products.component';
import { AuthGuard } from './login/Authentification/services/auth.guard';
import { AuthService } from './login/Authentification/services/auth.service';
import { JwtService } from './login/Authentification/services/jwt-service';
import { PermissionsResolverService } from './login/Authentification/services/permissions-resolver.service';
import { LoginService } from './login/services/login.service';
import { DataTransferService } from './payment/services/payment-method/data-transfer.service';
import { BonusService } from './payroll/services/bonus/bonus.service';
import { SessionService } from './payroll/services/session/session.service';
import { GalleryCardComponent } from './shared/components/gallery-card/gallery-card.component';
import { OrganisationDropdownComponent } from './shared/components/organisation/organisation-dropdown/organisation-dropdown.component';
import { ExactDate } from './shared/helpers/exactDate';
import { KendoGridTranslationService } from './shared/services/kendo-grid-translation-service/kendo-grid-translation.service';
import { LanguageService } from './shared/services/language/language.service';
import { DataTransferShowSpinnerService } from './shared/services/spinner/data-transfer-show-spinner.service';
import { WebSocketService } from './shared/services/webSocket/web-socket.service';
import { SharedModule } from './shared/shared.module';
import { StarkPermissionsModule, StarkPermissionsService, StarkRolesService } from './stark-permissions/stark-permissions.module';
import { BTobNotifComponent } from './Structure/b-tob-notif/b-tob-notif.component';
import { BTobService } from './Structure/b-tob-notif/service/b-tob.service';
import { CustomerOutstandingMenuComponent } from './Structure/customer-outstanding-menu/customer-outstanding-menu.component';
import { DocumentMenuComponent } from './Structure/document-menu/document-menu.component';
import { FooterComponent } from './Structure/footer/footer.component';
import { HeaderShortcutComponent } from './Structure/header-shortcut/header-shortcut.component';
import { ChatNotificationDropDownComponent } from './Structure/header/components/chat-notification-drop-down/chat-notification-drop-down.component';
import { CompanyDropdownComponent } from './Structure/header/components/company-dropdown/company-dropdown.component';
import { LanguageDropdownComponent } from './Structure/header/components/language-dropdown/language.dropdown.component';
import { NotificationDropdownComponent } from './Structure/header/components/notification-dropdown/notification.dropdown.component';
import { ReminderDropdownComponent } from './Structure/header/components/reminder-dropdown/reminder-dropdown.component';
import { UserActionListComponent } from './Structure/header/components/user-action-nav-mobile/user-action-list/user-action-list.component';
import { UserActionNavMobileComponent } from './Structure/header/components/user-action-nav-mobile/user-action-nav-mobile.component';
import { ProfileComponent } from './Structure/header/components/user-actions-dropdown/profile/profile.component';
import { UserActionsDropdownComponent } from './Structure/header/components/user-actions-dropdown/user-actions-dropdown.component';
import { HeaderComponent } from './Structure/header/header.component';
import { MainComponent } from './Structure/main/main.component';
import { ManufacturingMenuComponent } from './Structure/manufacturing-menu/manufacturing-menu.component';
import { SideBarComponent } from './Structure/side-bar/side-bar.component';
import { SkillsCareerMenuComponent } from './Structure/skills-career-menu/skills-career-menu.component';
import { StockDocumentMenuComponent } from './Structure/stock-document-menu/stock-document-menu.component';
import { OrderStateComponent } from './dashboard/widgets/order-state/order-state.component';
import { TurnoverGarageComponent } from './dashboard/widgets/turnover-garage/turnover-garage.component';
import { InterventionGarageComponent } from './dashboard/widgets/intervention-garage/intervention-garage.component';
import { GarageDashboardComponent } from './dashboard/garage-dashboard/garage-dashboard.component';
import { TurnoverGarageByMonthComponent } from './dashboard/widgets/turnover-garage-by-month/turnover-garage-by-month.component';
import { RhDashboardComponent } from './dashboard/rh-dashboard/rh-dashboard.component';
import { GarageDashboardService } from './dashboard/services/garage-dashboard/garage-dashboard.service';
import { GarageService } from './garage/services/garage/garage.service';
import { AppointmentService } from './garage/services/appointment/appointment.service';
import { TurnoverOperationComponent } from './dashboard/widgets/turnover-operation/turnover-operation.component';
import { CustomErrorComponent } from './custom-error/custom-error.component';
import { TurnoverSalePerYearComponent } from './dashboard/widgets/turnover-sale-per-year/turnover-sale-per-year.component';

import jwt_decode from "jwt-decode";
import { CompanyJavaService } from './administration/services/company-java/company-java.service';
import {LocalStorageService} from './login/Authentification/services/local-storage-service';
import {CacheService} from '../COM/services/cache-service';
import { TierCategoryService } from './sales/services/tier-category/tier-category.service';
import { MultiselectFilterComponent } from './dashboard/widgets/multiselect-filter/multiselect-filter.component';
import { ComboboxFilterComponent } from './dashboard/widgets/combobox-filter/combobox-filter.component';
import { DayOffPerFamilyTypeComponent } from './dashboard/widgets/day-off-per-family-type/day-off-per-family-type.component';
import { RateSuccessfulSubmittedCandidaciesComponent } from './dashboard/widgets/rate-successful-submitted-candidacies/rate-successful-submitted-candidacies.component';
import { WorkStateComponent } from './dashboard/widgets/work-state/work-state.component';
import { HrDashboardService} from './dashboard/services/hr-dashboard/hr-dashboard.service';
import { TotalStartersExitsComponent } from './dashboard/widgets/total-starters-exits/total-starters-exits.component';
import { TopEmployeeDayOffComponent } from './dashboard/widgets/top-employee-day-off/top-employee-day-off.component';
import { StaffTurnoverComponent } from './dashboard/widgets/staff-turnover/staff-turnover.component';
import { AvgTtfComponent } from './dashboard/widgets/avg-ttf/avg-ttf.component';
import {CostPriceComponent} from './manufacturing/calculate-cost-price/cost-price.component';

//#endregion

//#region app components

export let browserRefresh = false;

export function initConfig(config: AppConfig) {
  return () => config.load();
}



@NgModule({
  declarations: [
    CostPriceComponent,
    AppComponent,
    HeaderComponent,
    MainComponent,
    SideBarComponent,
    FooterComponent,
    DashboardComponent,
    LanguageDropdownComponent,
    NotificationDropdownComponent,
    UserActionsDropdownComponent,
    UserActionNavMobileComponent,
    ChatNotificationDropDownComponent,
    DocumentMenuComponent,
    CustomerOutstandingMenuComponent,
    SkillsCareerMenuComponent,
    StockDocumentMenuComponent,
    ItemPurchaseComponent,
    ItemSaleComponent,
    PeriodFilterComponent,
    NumberPickerFilterComponent,
    ToogleBtnFilterComponent,
    ReminderDropdownComponent,
    SaleStateComponent,
    RecruitmentByOfficeComponent,
    CandidaciesByRecruitmentComponent,
    TopSupliersComponent,
    TopCostumersComponent,
    LeaveByEmployeeComponent,
    GendreByMonthComponent,
    SalesPurchasesVolumeComponent,
    ManufacturingMenuComponent,
    BTobNotifComponent,
    MenuEcommerceComponent,
    AccountingUserConfigurationComponent,
    OrganisationDropdownComponent,
    CompanyDropdownComponent,
    ArchivingMenuComponent,
    AddDateToRememberComponent,
    ProfileComponent,
    ReminderDropdownComponent,
    UserActionNavMobileComponent,
    UserActionListComponent,
    HeaderShortcutComponent,
    TotalWorkDayByEmployeeComponent,
    EmployeeByOfficeComponent,
    OrderStateComponent,
    TurnoverGarageComponent,
    InterventionGarageComponent,
    GarageDashboardComponent,
    TurnoverGarageByMonthComponent,
    RhDashboardComponent,
    TurnoverOperationComponent,
    TurnoverSalePerYearComponent,
    CustomErrorComponent,
    MultiselectFilterComponent,
    ComboboxFilterComponent,
    DayOffPerFamilyTypeComponent,
    RateSuccessfulSubmittedCandidaciesComponent,
    WorkStateComponent,
    TotalStartersExitsComponent,
    TopEmployeeDayOffComponent,
    StaffTurnoverComponent,
    AvgTtfComponent
  ],
  imports: [
    BrowserAnimationsModule,
    // tslint:disable-next-line: deprecation
    HttpModule,
    BrowserModule,
    SnotifyModule,
    GridModule,
    DragulaModule.forRoot(),
    FormsModule,
    DropDownsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      },
      useDefaultLang: true
    }),
    CollapseModule.forRoot(),
    AppRoutingModule,
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    AppBreadcrumbModule,
    AppAsideModule,
    SharedModule.forRoot(),
    NoopAnimationsModule,
    SortableModule,
    StarkPermissionsModule.forRoot(),
    BarRatingModule,
    MatDialogModule,
    Ng2TelInputModule,
    EmbedVideo.forRoot(),
    ChartsModule
  ],
  providers: [
    TierCategoryService,
    ReminderEventService,
    FetchProductsComponent,
    AppBreadcrumbService,
    ReminderEventService,
    SuccessHandlerService,
    AuthGuard,
    {
      provide: ApmService,
      useClass: ApmService,
      deps: [Router]
    },
    {
      provide: ErrorHandler,
      useClass: ApmErrorHandler
    },
    AuthService,
    JwtService,
    DashboardService,
    GarageDashboardService,
    GarageService,
    AppointmentService,
    CompanyService,
    LoginService,
    LanguageService,
    SpinnerService,
    ErrorHandlerService,
    GrowlService,
    UserB2bService,
    { provide: MessageService, useClass: KendoGridTranslationService },
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService,
    CookieService,
    StatusOpportunityService,
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    CldrIntlService, {
      provide: IntlService,
      useExisting: CldrIntlService
    },
    DataTransferShowSpinnerService,
    DataTransferService,
    StarkPermissionsService,
    StarkRolesService,
    BTobService,
    NotificationCrmService,
    ActionService,
    WebSocketService,
    ExactDate,
    SideNavService,
    UserRoleService,
    BonusService,
    ActiveAssignmentService,
    NgxImageCompressService,
    GalleryCardComponent,
    SessionService,
    PermissionsResolverService,
    UserJavaService,
    RoleJavaService,
    ModuleServiceJava,
    CompanyJavaService,
    LocalStorageService,
    CacheService,
    HrDashboardService
  ],
  entryComponents: [PopupAddStatusOpportunityComponent, GalleryCardComponent],
  bootstrap: [AppComponent],
  exports: [CollapseModule, StarkPermissionsModule]
})
export class AppModule {

  constructor(@Inject(ApmService) service: ApmService, private appConfig: AppConfig) {
    if (this.appConfig.getEnvName() === 'qa') {
      const apm = service.init({
        serviceName: 'Stark-Front',
        serverUrl: 'http://192.168.1.89:7200',
        environment: 'QA'
      })
      apm.setUserContext({
        'username': 'foo',
        'id': 'bar'
      })
    }
  }

}
