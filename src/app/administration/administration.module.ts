import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule} from 'ng2-tooltip-directive';
import {SharedModule} from '../shared/shared.module';
import {AdministrationRoutingModule} from './administration-routing.module';
import {TaxeService} from './services/taxe/taxe.service';
import {TaxeGroupService} from './services/taxe-group/taxe-group.service';
import {CurrencyService} from './services/currency/currency.service';
import {DiscountGroupTiersService} from './services/discount-group-tiers/discount-group-tiers.service';
import {DiscountGroupItemService} from './services/discount-group-item/discount-group-item-service';
import {CountryService} from './services/country/country.service';
import {CityService} from './services/city/city.service';
import {UserService} from './services/user/user.service';
import {ListCountryComponent} from './country/list-country/list-country.component';
import {ListCityComponent} from './city/list-city/list-city.component';
import {ListCurrencyComponent} from './currency/list-currency/list-currency.component';
import {AddCurrencyComponent} from './currency/add-currency/add-currency.component';
import {CompanySetupComponent} from './company/company-setup/company-setup.component';
import {ListRoleComponent} from './role/list-role/list-role.component';
import {AddRoleComponent} from './role/add-role/add-role.component';
import {ListRoleAdvancedComponent} from './role-advanced/list-role-advanced/list-role-advanced.component';
import {AddRoleAdvancedComponent} from './role-advanced/add-role-advanced/add-role-advanced.component';
import {CompanyService} from './services/company/company.service';
import {ListUserComponent} from './user/list-user/list-user.component';
import {AddUserComponent} from './user/add-user/add-user.component';
import {ListNatureComponent} from './nature/list-nature/list-nature.component';
import {ListTaxeComponent} from './taxe/list-taxe/list-taxe.component';
import {CompanySkillsComponent} from './company/company-skills/company-skills.component';
import {ListGroupTaxeComponent} from './group-taxe/list-group-taxe/list-group-taxe.component';
import {AddGroupTaxeComponent} from './group-taxe/add-group-taxe/add-group-taxe.component';
import {TaxeDropdownComponent} from './components/taxe-dropdown/taxe-dropdown.component';
import {RoleService} from './services/role/role.service';
import {RoleConfigService} from './services/role-config/role-config.service';
import {ModuleByRoleService, ModuleByUserService} from './services/module/module.service';
import {ModuleConfigService} from './services/module-config/module-config.service';
import {FunctionnalityByRoleService, FunctionnalityByUserService} from './services/functionnality/functionnality.service';
import {SkillsFamilyComponent} from './company/skills-family/skills-family.component';
import {AddTaxeComponent} from './taxe/add-taxe/add-taxe.component';
import {RoleTreeviewComponent} from './components/role-treeview/role-treeview.component';
import {RoleRoleConfigTreeviewComponent} from './components/role-role-config-treeview/role-role-config-treeview.component';
import {RoleConfigTreeviewComponent} from './components/role-config-treeview/role-config-treeview.component';
import {RoleConfigMultiselectComponent} from './components/role-config-multiselect/role-config-multiselect.component';
import {ConfigUserComponent} from './user/config-user/config-user.component';
import {AddPeriodComponent} from './period/add-period/add-period.component';
import {ListPeriodComponent} from './period/list-period/list-period.component';
import {PeriodService} from './services/period/period.service';
import {TaxeTypeComponent} from './components/taxe-type/taxe-type.component';
import {AddRoleConfigComponent} from './role-config/add-role-config/add-role-config.component';
import {ListRoleConfigComponent} from './role-config/list-role-config/list-role-config.component';
import {SearchUserComponent} from './components/search-user/search-user.component';
import {UserB2bSettingsComponent} from './user-b2b/user-b2b-settings/user-b2b-settings.component';
import {AddUserB2bComponent} from './user-b2b/add-user-b2b/add-user-b2b.component';
import {TimeSheetService} from '../rh/services/timesheet/timesheet.service';
import {UserB2bService} from './services/user-b2b/user-b2b.service';
import {OfficeListComponent} from './Office/office-list/office-list.component';
import {OfficeAddComponent} from './Office/office-add/office-add.component';
import {OfficeService} from './services/office/office.service';
import {MasterUserAddRoleComponent} from './components/master-user-add-role/master-user-add-role.component';
import {StarkPermissionsGuard} from '../stark-permissions/stark-permissions.module';
import {RoleConfigCategoryDropdownComponent} from './components/role-config-category-dropdown/role-config-category-dropdown.component';
import {RoleConfigCategoryService} from './services/role-config-category/role-config-category.service';
import {ImportDocumentService} from '../accounting/services/import-document/import-document.service';
import {VersionComponent} from './version/version.component';
import {CrmConfigurationService} from '../crm/services/Configuration/crm-configuration.service';
import {PrivilegeService} from './services/privilege/privilege.service';
import {UserPrivilegeService} from './services/user-privilege/user-privilege.service';
import {ListLanguageComponent} from './language/list-language/list-language.component';
import {CurrencyRateService} from './services/currency-rate/currency-rate.service';
import {BankAccountService} from './services/bank-account/bank-account.service';
import {TaxAccountsResolverService} from '../accounting/resolver/tax-accounts-resolver.service';
import {DesactivateUsersDetailsComponent} from './desactivate-users-details/desactivate-users-details.component';
import {BodyModule} from '@progress/kendo-angular-grid';
import {Ng2TelInputModule} from 'ng2-tel-input';
import {AddNatureComponent} from './nature/add-nature/add-nature.component';
import {SearchPeriodeComponent} from './period/search-periode/search-periode.component';
import {AddCityComponent} from './city/add-city/add-city.component';
import {SearchRoleConfigComponent} from './role/search-role-config/search-role-config.component';
import { MailingConfigurationService } from '../mailing/services/mailing-configuration/mailing-configuration.service';
import { ExchangeRateGridComponent } from './currency/exchange-rate-grid/exchange-rate-grid.component';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { UserResolverService } from '../administration/resolvers/user-resolver.service';
import { GarageSettingsService } from '../garage/services/garage-settings/garage-settings.service';
import { ListPrivilegeComponent } from './privilege/list-privilege/list-privilege.component';
import { RoleConfigCategoryTreeviewComponent } from './components/role-config-category-treeview/role-config-category-treeview.component';
import { RhPayrollSettingsService } from '../rh/services/rh-payroll-settings/rh-payroll-settings.service';
import {ManufacturingConfigurationService} from '../manufacturing/configuration/manufacturing-configuration.service';
import { AuthBuildPropertiesService } from './services/AuthBuildPropertiesService';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule,
    SharedModule,
    AdministrationRoutingModule,
    BodyModule,
    Ng2TelInputModule
  ],
  declarations: [
    ListCountryComponent,
    ListCityComponent,
    ListCurrencyComponent,
    AddCurrencyComponent,
    CompanySetupComponent,
    ListRoleComponent,
    AddRoleComponent,
    AddRoleAdvancedComponent,
    ListRoleAdvancedComponent,
    ListUserComponent,
    ListTaxeComponent,
    AddUserComponent,
    ListNatureComponent,
    CompanySkillsComponent,
    ListGroupTaxeComponent,
    AddGroupTaxeComponent,
    TaxeDropdownComponent,
    SkillsFamilyComponent,
    AddTaxeComponent,
    RoleTreeviewComponent,
    RoleRoleConfigTreeviewComponent,
    RoleConfigTreeviewComponent,
    ConfigUserComponent,
    AddPeriodComponent,
    ListPeriodComponent,
    TaxeTypeComponent,
    AddRoleConfigComponent,
    ListRoleConfigComponent,
    SearchUserComponent,
    RoleConfigMultiselectComponent,
    UserB2bSettingsComponent,
    AddUserB2bComponent,
    OfficeListComponent,
    OfficeAddComponent,
    RoleConfigCategoryDropdownComponent,
    VersionComponent,
    MasterUserAddRoleComponent,
    ListLanguageComponent,
    DesactivateUsersDetailsComponent,
    AddNatureComponent,
    SearchPeriodeComponent,
    AddCityComponent,
    SearchRoleConfigComponent,
    AddCityComponent,
    ExchangeRateGridComponent,
    ListPrivilegeComponent,
    RoleConfigCategoryTreeviewComponent
  ],
  providers: [
    TaxeService,
    CurrencyService,
    BankAccountService,
    DiscountGroupTiersService,
    DiscountGroupItemService,
    TaxAccountsResolverService,
    CountryService,
    CityService,
    UserService,
    TaxeGroupService,
    CompanyService,
    RoleService,
    RoleConfigService,
    ModuleByRoleService,
    ModuleConfigService,
    ModuleByUserService,
    FunctionnalityByRoleService,
    FunctionnalityByUserService,
    PeriodService,
    TimeSheetService,
    UserB2bService,
    OfficeService,
    CurrencyRateService,
    StarkPermissionsGuard,
    RoleConfigCategoryService,
    CrmConfigurationService,
    ImportDocumentService,
    PrivilegeService,
    UserPrivilegeService,
    CanDeactivateGuard,
    CityService,
    MailingConfigurationService,
    GarageSettingsService,
    UserResolverService,
    RhPayrollSettingsService,
    ManufacturingConfigurationService,
    AuthBuildPropertiesService
  ],
  entryComponents: [
    SkillsFamilyComponent,
    RoleTreeviewComponent,
    RoleRoleConfigTreeviewComponent,
    RoleConfigTreeviewComponent,
    MasterUserAddRoleComponent
  ],
  exports: [TaxeTypeComponent, TaxeDropdownComponent, SearchUserComponent, SearchPeriodeComponent]
})
export class AdministrationModule {
}

