import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatButtonModule, MatDialogModule, MatInputModule, MatStepperModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownButtonModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule, DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { ComboBoxModule, DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { BodyModule, ExcelModule, GridModule, HeaderModule, PDFModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { UploadModule } from '@progress/kendo-angular-upload';
import { TelerikReportingModule } from '@progress/telerik-angular-report-viewer';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { QRCodeModule } from 'angularx-qrcode';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NumberPickerModule } from 'ng-number-picker';
import { OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { TooltipModule } from 'ng2-tooltip-directive';
import { Ng5SliderModule } from 'ng5-slider';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CollapseModule } from 'ngx-bootstrap/collapse';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { ColorPickerModule } from 'ngx-color-picker';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { AccordionModule } from 'primeng/accordion';
import { CarouselModule } from 'primeng/carousel';
import { DataViewModule } from 'primeng/dataview';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PickListModule } from 'primeng/picklist';
import { routes } from '../../app.route';
import { SpinnerComponent } from '../../COM/spinner/spinner.component';
import { SpinnerService } from '../../COM/spinner/spinner.service';
import { AddAccountComponent } from '../accounting/account/add-account/add-account.component';
import { CurrentFiscalYearHeaderComponent } from '../accounting/components/current-fiscal-year-header/current-fiscal-year-header.component';
import { AccountingReportingMenuEditionsComponent } from '../accounting/reporting-menu/accounting-reporting-menu-editions/accounting-reporting-menu-editions.component';
import { AccountingReportingMenuFinancialStatesComponent } from '../accounting/reporting-menu/accounting-reporting-menu-financial-states/accounting-reporting-menu-financial-states.component';
import { AccountingReportingMenuJournalsComponent } from '../accounting/reporting-menu/accounting-reporting-menu-journals/accounting-reporting-menu-journals.component';
import { ReconciliationBankMenuComponent } from '../accounting/reporting/reconciliation-bank-menu/reconciliation-bank-menu.component';
import { BankAccountsResolverService } from '../accounting/resolver/bank-accounts-resolver.service';
import { AccountService } from '../accounting/services/account/account.service';
import { ChartAccountService } from '../accounting/services/chart-of-accounts/chart-of-account.service';
import { AccountingConfigurationService } from '../accounting/services/configuration/accounting-configuration.service';
import { FiscalYearService } from '../accounting/services/fiscal-year/fiscal-year.service';
import { GenericAccountingService } from '../accounting/services/generic-accounting.service';
import { JournalService } from '../accounting/services/journal/journal.service';
import { ReportingService } from '../accounting/services/reporting/reporting.service';
import { TemplateAccountingService } from '../accounting/services/template/template.service';
import { AddItemSearchToDocumentComponent } from '../add-item-search-to-document/add-item-search-to-document.component';
import { ListCurrencyComponent } from '../administration/currency/list-currency/list-currency.component';
import { BankAccountService } from '../administration/services/bank-account/bank-account.service';
import { CityService } from '../administration/services/city/city.service';
import { CountryService } from '../administration/services/country/country.service';
import { CurrencyService } from '../administration/services/currency/currency.service';
import { DiscountGroupItemService } from '../administration/services/discount-group-item/discount-group-item-service';
import { DiscountGroupTiersService } from '../administration/services/discount-group-tiers/discount-group-tiers.service';
import { OfficeService } from '../administration/services/office/office.service';
import { PeriodService } from '../administration/services/period/period.service';
import { TaxeService } from '../administration/services/taxe/taxe.service';
import { UserService } from '../administration/services/user/user.service';
import { AppModule } from '../app.module';
import { StatusAccountedDropdownComponent } from '../app/shared/components/status-accounted-dropdown/status-accounted-dropdown.component';
import { SharedConstant } from '../constant/shared/shared.constant';
import { CategoryService } from '../crm/services/category/category.service';
import { OpportunityService } from '../crm/services/opportunity.service';
import { ColorPickerComponent } from '../dashboard/color-picker/color-picker.component';
import { EcommerceProductService } from '../ecommerce/services/ecommerce-product/ecommerce-product.service';
// tslint:disable-next-line:max-line-length
import { InterventionLoanVehicleStatusDropdownComponent } from '../garage/components/intervention-loan-vehicle-status-dropdown/intervention-loan-vehicle-status-dropdown.component';
import { InterventionStateDropdownComponent } from '../garage/components/intervention-state-dropdown/intervention-state-dropdown.component';
import { VehicleModelDropdownComponent } from '../garage/components/vehicle-model-dropdown/vehicle-model-dropdown.component';
import { ClaimTypeDropdownComponent } from '../helpdesk/components/claim-type-dropdown/claim-type-dropdown.component';
import { ClaimTypeService } from '../helpdesk/services/claim-type/claim-type.service';
import { ClaimService } from '../helpdesk/services/claim/claim.service';
import { FetchProductsComponent } from '../inventory/components/fetch-products/fetch-products.component';
import { PolicyComboBoxComponent } from '../inventory/components/policy-combo-box/policy-combo-box.component';
import { QuickSearchItemComponent } from '../inventory/components/quick-search-item/quick-search-item.component';
import { ListNegotiationComponent } from '../inventory/list-negotiation/list-negotiation.component';
import { MovementHistoryComponent } from '../inventory/movement-history/movement-history.component';
import { BrandService } from '../inventory/services/brand/brand.service';
import { FamilyService } from '../inventory/services/family/family.service';
import { ItemService } from '../inventory/services/item/item.service';
import { ModelOfItemService } from '../inventory/services/model-of-item/model-of-item.service';
import { MovementHistoryService } from '../inventory/services/movement-history/movement-history.service';
import { ShelfService } from '../inventory/services/shelf/shelf.service';
import { StockDocumentsService } from '../inventory/services/stock-documents/stock-documents.service';
import { SubFamilyService } from '../inventory/services/sub-family/sub-family.service';
import { SubModelService } from '../inventory/services/sub-model/sub-model.service';
import { TecdocService } from '../inventory/services/tecdoc/tecdoc.service';
import { WarehouseItemService } from '../inventory/services/warehouse-item/warehouse-item.service';
import { WarehouseService } from '../inventory/services/warehouse/warehouse.service';
import { ModulesSettings } from '../models/shared/ModulesSettings.model';
import { PaymentModeService } from '../payment/services/payment-method/payment-mode.service';
import { SettlementMethodService } from '../payment/services/payment-method/settlement-method.service';
import { PaymentTypeService } from '../payment/services/payment-type/payment-type.service';
import { RatingPerSkillsComponent } from '../payroll/components/rating-per-skills/rating-per-skills.component';
import { SearchSessionComponent } from '../payroll/components/search-session/search-session.component';
import { AddContractTypeComponent } from '../payroll/contract-type/add-contract-type/add-contract-type.component';
import { CreditTypeDropdownComponent } from '../payroll/credit-type-dropdown/credit-type-dropdown.component';
import { ListGradeComponent } from '../payroll/grade/list-grade/list-grade.component';
import { AddJobComponent } from '../payroll/job/add-job/add-job.component';
import { ListQualificationTypeComponent } from '../payroll/qualification-type/list-qualification-type/list-qualification-type.component';
import { BenefitInKindService } from '../payroll/services/benefit-in-kind/benefit-in-kind.service';
import { BonusService } from '../payroll/services/bonus/bonus.service';
import { CnssService } from '../payroll/services/cnss/cnss.service';
import { DocumentRequestTypeService } from '../payroll/services/document-request-type/document-request-type.service';
import { EmployeeService } from '../payroll/services/employee/employee.service';
import { GradeService } from '../payroll/services/grade/grade.service';
import { JobService } from '../payroll/services/job/job.service';
import { SalaryStructureService } from '../payroll/services/salary-structure/salary-structure.service';
import { SessionService } from '../payroll/services/session/session.service';
import { TeamService } from '../payroll/services/team/team.service';
import { ListTeamTypeComponent } from '../payroll/team-type/list-team-type/list-team-type.component';
import { AdvencedListProvisionnigComponent } from '../purchase/components/advenced-list-provisionnig/advenced-list-provisionnig.component';
import { CostPriceComponent } from '../purchase/components/cost-price/cost-price.component';
import { ExpenseDropdownComponent } from '../purchase/components/expense-dropdown/expense-dropdown.component';
import { ExpenseGridComponent } from '../purchase/components/expense-grid/expense-grid.component';
import { PurchaseRequestStatusDropdownComponent } from '../purchase/components/purchase-request-status-dropdown/purchase-request-status-dropdown.component';
import { AddExpenseComponent } from '../purchase/expense/add-expense/add-expense.component';
import { PurchaseOrderListComponent } from '../purchase/purchase-order/purchase-order-list/purchase-order-list.component';
import { ContactService } from '../purchase/services/contact/contact.service';
import { ExpenseService } from '../purchase/services/expense/expense.service';
import { OrderProjectService } from '../purchase/services/order-project/order-project.service';
import { ProvisioningService } from '../purchase/services/order-project/provisioning-service.service';
import { PurchaseSettingsService } from '../purchase/services/purchase-settings/purchase-settings.service';
import { TiersService } from '../purchase/services/tiers/tiers.service';
import { OfficeDropdownlistComponent } from '../rh/components/office-dropdownlist/office-dropdownlist.component';
import { CandidateService } from '../rh/services/candidate/candidate.service';
import { DeadLineDocumentComponent } from '../sales/components/dead-line-document/dead-line-document.component';
import { FinancialCommitmentComponent } from '../sales/components/financial-commitment/financial-commitment.component';
import { GridSalesInvoiceAssestsComponent } from '../sales/components/grid-sales-invoice-assests/grid-sales-invoice-assests.component';
import { ImportOrderDocumentLinesComponent } from '../sales/components/import-order-document-lines/import-order-document-lines.component';
import { ProjectTypeDropdownComponent } from '../sales/components/project-type-drop-down/project-type-dropdown.component';
import { SettlementComponent } from '../sales/components/settlement/settlement.component';
import { ShowDetailSettlementComponent } from '../sales/components/show-detail-settlement/show-detail-settlement.component';
import { TermBillingGridComponent } from '../sales/components/term-billing-grid/term-billing-grid.component';
import { DeliveryFormsListComponent } from '../sales/delivery-forms/delivery-forms-list/delivery-forms-list.component';
import { GridImportBsComponent } from '../sales/invoice/grid-import-bs/grid-import-bs.component';
import { InvoiceComponent } from '../sales/invoice/invoice-add/invoice.component';
import { InvoiceListComponent } from '../sales/invoice/invoice-list/invoice-list.component';
import { QuotationSalesListComponent } from '../sales/quotation/quotation-sales-list/quotation-sales-list.component';
import { DeadLineDocumentService } from '../sales/services/dead-line-document/dead-line-document.service';
import { DeliveryTypeService } from '../sales/services/delivery-type/delivery-type.service';
import { DocumentLineService } from '../sales/services/document-line/document-line.service';
import { DocumentService } from '../sales/services/document/document.service';
import { FinancialCommitmentService } from '../sales/services/financial-commitment/financial-commitment.service';
import { SalesSettingsService } from '../sales/services/sales-settings/sales-settings.service';
import { SearchItemService } from '../sales/services/search-item/search-item.service';
import { SettlementModeService } from '../sales/services/settlement-mode/settlement-mode.service';
import { TaxeGroupTiersService } from '../sales/services/taxe-group-tiers/sale-group-tiers.service';
import { ChangePasswordComponent } from '../Structure/header/components/user-actions-dropdown/change-password/change-password.component';
import { AmountFormatService } from '../treasury/services/amount-format.service';
import { BankService } from '../treasury/services/bank.service';
import { ReconciliationService } from '../treasury/services/reconciliation/reconciliation.service';
import { AccountsDropdownComponent } from './components/accounts-dropdown/accounts-dropdown.component';
import { ActionDropdownComponent } from './components/action-dropdown/action-dropdown.component';
import { AddBandComponent } from './components/add-band/add-band.component';
import { AddDiscountGroupTiersComponent } from './components/add-discount-group-tiers/add-discount-group-tiers.component';
import { AddModelComponent } from './components/add-model/add-model.component';
import { AddTiersComponent } from './components/add-tiers/add-tiers.component';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';
import { FiltreInputComponent } from './components/advanced-search/filtre-input/filtre-input.component';
import { FiltrePredicateComponent } from './components/advanced-search/filtre-predicate/filtre-predicate.component';
import { AgencyDropdownComponent } from './components/agency-dropdown/agency-dropdown.component';
import { BankReconciliationComponent } from './components/bank-reconciliation/bank-reconciliation.component';
import { AddBankAccountComponent } from './components/bank/bank-account/add-bank-account/add-bank-account.component';
import { BankAccountDropdownComponent } from './components/bank/bank-account/bank-account-dropdown/bank-account-dropdown.component';
import { ManageBankAccountComponent } from './components/bank/bank-account/manage-bank-account/manage-bank-account.component';
import { BankDropdownComponent } from './components/bank/bank-dropdown/bank-dropdown.component';
import { BenefitInKindDropdownComponent } from './components/benefit-in-kind-dropdown/benefit-in-kind-dropdown.component';
import { BenefitInKindValidityComponent } from './components/benefit-in-kind-validity/benefit-in-kind-validity.component';
import { BonusDropdownComponent } from './components/bonus-dropdown/bonus-dropdown.component';
import { BooleanFilterDropDownComponent } from './components/boolean-filter-drop-down/boolean-filter-drop-down.component';
import { BrandComboBoxComponent } from './components/brand-combo-box/brand-combo-box.component';
import { BtnGridComponent } from './components/btn-grid/btn-grid.component';
import { ChatGroupComponent } from './components/chat-group/chat-group.component';
import { ChatComponent } from './components/chat/chat.component';
import { CityDropdownComponent } from './components/city-dropdown/city-dropdown.component';
import { ClosingStateComponent } from './components/closing-state/closing-state.component';
import { CnssDropdownComponent } from './components/cnss/cnss-dropdown.component';
import { CommentComponent } from './components/comment/comment.component';
import { CommissionTypeDropdownComponent } from './components/commission-type-dropdown/commission-type-dropdown.component';
import { CompanyComboboxComponent } from './components/company-combobox/company-combobox.component';
import { ContactDropdownComponent } from './components/contact-dropdown/contact-dropdown.component';
import { ContactComponent } from './components/contact/contact.component';
import { ContractBonusValidityComponent } from './components/contract-bonus-validity/contract-bonus-validity.component';
import { ContractTypeDropdownComponent } from './components/contract-type-dropdown/contract-type-dropdown/contract-type-dropdown.component';
import { ControlMessageGridCellComponent } from './components/control-message-grid-cell/control-message-grid-cell.component';
import { ControlMessagesComponent } from './components/control-messages/control-messages.component';
import { CountryDropdownComponent } from './components/country-dropdown/country-dropdown.component';
import { CurrencyDropdownComponent } from './components/currency-dropdown/currency-dropdown.component';
import { DayofweekDropdownComponent } from './components/dayofweek-dropdown/dayofweek-dropdown.component';
import { DayofweekMultiselectComponent } from './components/dayofweek-multiselect/dayofweek-multiselect.component';
import { DeliveryTypeDropdownComponent } from './components/delivery-type-dropdown/delivery-type-dropdown.component';
import { DepotDropdownComponent } from './components/depot-dropdown/depot-dropdown.component';
import { DiscountGroupItemDropDownComponent } from './components/discount-group-item-drop-down/discount-group-item-drop-down.component';
import { DiscountGroupTiersDropDownComponent } from './components/discount-group-tiers-drop-down/discount-group-tiers-drop-down.component';
import { DocumentControlTypeComponent } from './components/document-control-type/document-control-type.component';
import { DocumentRequestTypeDropdownComponent } from './components/document-request-type-dropdown/document-request-type-dropdown.component';
import { DocumentRequestTypeComponent } from './components/document-request-type/document-request-type.component';
import { DocumentStatusComponent } from './components/document-status/document-status.component';
import { DocumentHeaderComponent } from './components/document/document-header/document-header.component';
import { DocumentListComponent } from './components/document/document-list/document-list.component';
import { DocumentTypeDropdownComponent } from './components/document/document-type-dropdown/document-type-dropdown.component';
import { DocumentWithholdingTaxComponent } from './components/document/document-withholding-tax/document-withholding-tax.component';
import { DocumentsAssociatedComponent } from './components/document/documents-associated/documents-associated.component';
import { MassValidationComponent } from './components/document/mass-validation/mass-validation.component';
import { SearchDocumentComponent } from './components/document/search-document/search-document.component';
import { TermBillingListComponent } from './components/document/term-billing-list/term-billing-list.component';
import { DropDownFooterComponent } from './components/drop-down-footer/drop-down-footer.component';
import { DropdownFilterComponent } from './components/dropdown-filter/dropdown-filter.component';
import { EmployeeDropdownComponent } from './components/employee-dropdown/employee-dropdown.component';
import { EmployeeMultiselectComponent } from './components/employee-multiselect/employee-multiselect.component';
import { EndTimeDropdownComponent } from './components/end-time-dropdown/end-time-dropdown.component';
import { EntityHistoryComponent } from './components/entity-history/entity-history.component';
import { ExcelExportComponent } from './components/excel-export/excel-export.component';
import { ExitReasonDropdownComponent } from './components/exit-reason-dropdown/exit-reason-dropdown.component';
import { FamilyComboBoxComponent } from './components/family-combo-box/family-combo-box.component';
import { FiscalYearDropdownComponent } from './components/fiscal-year-dropdown/fiscal-year-dropdown.component';
import { GalleryCardComponent } from './components/gallery-card/gallery-card.component';
import { GradeDropdownComponent } from './components/grade-dropdown/grade-dropdown.component';
// tslint:disable-next-line:max-line-length
import { GridCellCheckboxTemplateComponent } from './components/grid-cell-input-template/grid-cell-checkbox-template/grid-cell-checkbox-template.component';
import { GridCellInputTemplateComponent } from './components/grid-cell-input-template/grid-cell-input-template.component';
import { GridExportComponent } from './components/grid-export/grid-export.component';
import { GridImportComponent } from './components/grid-import/grid-import.component';
import { HistoryComponent } from './components/history/history.component';
import { HtmlToPlaintextPipe } from './components/html-to-plaintext/html-to-plaintext.pipe';
import { ItemAdvancedSearchComponent } from './components/item-advanced-search/item-advanced-search.component';
import { ItemFiltreListComponent } from './components/item-advanced-search/item-filtre-list/item-filtre-list.component';
import { ItemDropdownComponent } from './components/item-dropdown/item-dropdown.component';
import { DetailsProductComponent } from './components/item/details-product/details-product.component';
import { JobDropdownComponent } from './components/job-dropdown/job-dropdown.component';
import { JobMultiselectComponent } from './components/job-multiselect/job-multiselect.component';
import { JournalDropdownComponent } from './components/journal-dropdown/journal-dropdown.component';
import { KendoPagerComponent } from './components/kendo-pager/kendo-pager.component';
import { LanguageknowledgeDropdownComponent } from './components/language-knowledge-dropdown/language-knowledge-dropdown.component';
import { LevelDropdownComponent } from './components/level-dropdown/level-dropdown.component';
import { MaritalStatusDropdownComponent } from './components/marital-status-dropdown/marital-status-dropdown.component';
import { ModelOfItemComboBoxComponent } from './components/model-of-item-combo-box/model-of-item-combo-box.component';
import { MultiselectDropdownComponent } from './components/multiselect-dropdown/multiselect-dropdown.component';
import { NatureDropdownComponent } from './components/nature-dropdown/nature-dropdown.component';
import { PagerComponent } from './components/pager/pager.component';
import { ParentPlanAccComponent } from './components/parent-plan-acc/parent-plan-acc.component';
import { PaymentDropdownComponent } from './components/payment-dropdown/payment-dropdown.component';
import { PaymentMethodDropdownComponent } from './components/payment-method-dropdown/payment-method-dropdown.component';
import { PaymentSlipStatusDropdownComponent } from './components/payment-slip-status-dropdown/payment-slip-status-dropdown.component';
import { PaymentStatusDropdownComponent } from './components/payment-status-dropdown/payment-status-dropdown.component';
import { PaymentTypeDropdownComponent } from './components/payment-type-dropdown/payment-type-dropdown.component';
import { PhoneComponent } from './components/phone/phone.component';
import { PopUpFinancialCommitmentPaymentHistoryComponent } from './components/pop-up-financial-commitment-payment-history/pop-up-financial-commitment-payment-history.component';
import { PopUpSettlementDisposalComponent } from './components/pop-up-settlement-disposal/pop-up-settlement-disposal.component';
import { PricesTypeComponent } from './components/prices-type/prices-type.component';
import { PriorityDropdwonComponent } from './components/priority-dropdwon/priority-dropdwon.component';
import { PrivilegeComponent } from './components/privilege/privilege.component';
import { ProductDropdownComponent } from './components/product-dropdown/product-dropdown.component';
import { ProfileTierActivitiesComponent } from './components/profile-tier/profile-tier-activities/profile-tier-activities.component';
import { ProfileTierGeneralComponent } from './components/profile-tier/profile-tier-general/profile-tier-general.component';
import { ProfileTierLastArticlesComponent } from './components/profile-tier/profile-tier-last-articles/profile-tier-last-articles.component';
import { ProfileTierComponent } from './components/profile-tier/profile-tier.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ProjectDropdownComponent } from './components/project-dropdown/project-dropdown.component';
import { ProjectTimesheetDropdownComponent } from './components/project-timesheet-dropdown/project-timesheet-dropdown.component';
import { QualificationTypeDropdownComponent } from './components/qualification-type-dropdown/qualification-type-dropdown.component';
import { AddQualificationComponent } from './components/qualification/add-qualification/add-qualification.component';
import { ManageQualificationComponent } from './components/qualification/manage-qualification/manage-qualification.component';
import { RegistrationNumberOfVehicleDropdwonComponent } from './components/registration-number-of-vehicle-dropdwon/registration-number-of-vehicle-dropdwon.component';
import { ReportingInModalComponent } from './components/reports/reporting-in-modal/reporting-in-modal.component';
import { ReportingInUrlComponent } from './components/reports/reporting-in-url/reporting-in-url.component';
import { RoleMultiselectComponent } from './components/role-multiselect/role-multiselect.component';
import { SafePipe } from './components/safe-pipe/safe-pipe.pipe';
import { RuleCategoryComponent } from './components/salary-rule/rule-category/rule-category.component';
import { RuleTypeComponent } from './components/salary-rule/rule-type/rule-type.component';
import { SalaryStructureDropdownComponent } from './components/salary-structure-dropdown/salary-structure-dropdown.component';
import { SalesSettingComboComponent } from './components/sales-setting-combo/sales-setting-combo.component';
import { SearchItemReduicedComponent } from './components/search-item-reduiced/search-item-reduiced.component';
import { SearchSectionComponent } from './components/search-section/search-section.component';
import { SearchTiersComponent } from './components/search-tiers/search-tiers.component';
import { SessionStateDropdownComponent } from './components/session-state-dropdown/session-state-dropdown.component';
import { SettlementModeDropDownComponent } from './components/settlement-mode-drop-down/settlement-mode-drop-down.component';
import { SexDropdownComponent } from './components/sex-dropdown/sex-dropdown.component';
import { ShelfDropdownComponent } from './components/shelf-dropdown/shelf-dropdown.component';
import { SkillsDropdownComponent } from './components/skills-dropdown/skills-dropdown.component';
import { SkillsFamilyDropdownComponent } from './components/skills-family-dropdown/skills-family-dropdown.component';
import { SkillsFamilyMultiselectComponent } from './components/skills-family-multiselect/skills-family-multiselect.component';
import { SkillsMultiselectComponent } from './components/skills-multiselect/skills-multiselect.component';
import { StartTimeDropdownComponent } from './components/start-time-dropdown/start-time-dropdown.component';
import { StatusDropdownComponent } from './components/status-dropdown/status-dropdown.component';
import { SubFamilyComboBoxComponent } from './components/sub-family-combo-box/sub-family-combo-box.component';
import { SubModelComboBoxComponent } from './components/sub-model-combo-box/sub-model-combo-box.component';
import { SupplierDropdownComponent } from './components/supplier-dropdown/supplier-dropdown.component';
import { SwalWarring } from './components/swal/swal-popup';
import { TaxeDropdownComponent } from './components/taxe-dropdown/taxe-dropdown.component';
import { TaxeGroupTiersComponent } from './components/taxe-group-tiers/taxe-group-tiers.component';
import { TaxeMultiselectComponent } from './components/taxe-multiselect/taxe-multiselect.component';
import { TeamDropdownComponent } from './components/team-dropdown/team-dropdown.component';
import { TeamMultiselectComponent } from './components/team-multiselect/team-multiselect.component';
import { TeamTypeDropdownComponent } from './components/team-type-dropdown/team-type-dropdown.component';
import { TecDocComponent } from './components/tec-doc/tec-doc.component';
import { TiersAddressComponent } from './components/tiers-address/tiers-address.component';
import { TiersContactComponent } from './components/tiers-contact/tiers-contact.component';
import { TimePipe } from './components/time-pipe/time-pipe.component';
import { TrimesterDropdownComponent } from './components/trimester-dropdown/trimester-dropdown.component';
import { TrimesterMultiSelectComponent } from './components/trimester-multi-select/trimester-multi-select.component';
import { UnitSalesComponent } from './components/unit-sales/unit-sales.component';
import { UnitStockComponent } from './components/unit-stock/unit-stock.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { UserDropdownComponent } from './components/user-dropdown/user-dropdown.component';
import { UserLanguagesDropdownComponent } from './components/user-languages-dropdown/user-languages-dropdown.component';
import { WrongPayslipListComponent } from './components/wrong-payslip-list/wrong-payslip-list.component';
import { ZipCodeDropdownComponent } from './components/zip-code-dropdown/zip-code-dropdown.component';
import { AfterValueChangedDirective } from './directives/after-value-changed/after-value-changed.directive';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { DialogService } from './services/dialog/confirm-dialog/dialog.service';
import { FormModalDialogService } from './services/dialog/form-modal-dialog/form-modal-dialog.service';
import { DocumentFormService } from './services/document/document-grid.service';
import { DocumentTypeService } from './services/document/document-type.service';
import { ListDocumentService } from './services/document/list-document.service';
import { EmailService } from './services/email/email.service';
import { FileService } from './services/file/file-service.service';
import { GeneralSettingsService } from './services/general-settings/general-settings.service';
import { LanguageKnowledgeService } from './services/language-knowledge/language-knowledge.service';
import { MeasureUnitService } from './services/mesure-unit/measure-unit.service';
import { ModulesSettingsService } from './services/modulesSettings/modules-settings.service';
import { NatureService } from './services/nature/nature.service';
import { ProductItemService } from './services/product-item/product-item.service';
import { QualificationTypeService } from './services/qualification-type/qualification-type.service';
import { ReportTemplateService } from './services/report-template/report-template.service';
import { ReportingServiceService } from './services/reporting/reporting-service.service';
import { ChatService } from './services/signalr/chat/chat.service';
import { CommentService } from './services/signalr/comment/comment.service';
import { InformationService } from './services/signalr/information/information.service';
import { MailingService } from './services/signalr/mailing/mailing.service';
import { MessageAdministrativeDocumentsService } from './services/signalr/message-administrative-documents/message-administrative-documents.service';
import { MessageService } from './services/signalr/message/message.service';
import { NotificationService } from './services/signalr/notification/notification.service';
import { ProgressService } from './services/signalr/progress/progress.service';
import { SignalrHubService } from './services/signalr/signalr-hub/signalr-hub.service';
import { StyleConfigService } from './services/styleConfig/style-config.service';
import { TeamTypeService } from './services/team-type/team-type.service';
import { UserCurrentInformationsService } from './services/utility/user-current-informations.service';
import { UtilityService } from './services/utility/utility.service';
import { ValidationService } from './services/validation/validation.service';
import { ZipCodeService } from './services/zip-code/zip-code.service';
import { TimelineComponent } from './timeline/timeline.component';
import { SetPickerLabels } from './utils/set-picker-labels';
import { FundsTransferTypeDropdownComponent } from '../treasury/components/funds-transfer-type-dropdown/funds-transfer-type-dropdown.component';
import { FundsTransferStateDropdownComponent } from '../treasury/components/funds-transfer-state-dropdown/funds-transfer-state-dropdown.component';
import { CashRegisterSourceDropdownComponent } from '../treasury/components/cash-register-source-dropdown/cash-register-source-dropdown.component';
import { CashRegisterDestinationDropdownComponent } from '../treasury/components/cash-register-destination-dropdown/cash-register-destination-dropdown/cash-register-destination-dropdown.component';
// tslint:disable-next-line:max-line-length
import { RepairOrderStatusDropdownComponent } from '../garage/components/repair-order-status-dropdown/repair-order-status-dropdown.component';
import { GarageDropdownComponent } from '../garage/components/garage-dropdown/garage-dropdown.component';
import {TabViewModule} from 'primeng/tabview';
import { CandidateComboboxComponent } from './components/candidate-combobox/candidate-combobox.component';
import { SalesPriceDropdownComponent } from './components/sales-price-dropdown/sales-price-dropdown.component';
import { SalesPriceService } from '../sales/services/sales-price/sales-price.service';
import { TiersvehicleComponent } from './components/tiers-vehicle/tiers-vehicle.component';
import { VehicleEnergyService } from './services/vehicle-energy/vehicle-energy.service';
import { EnergyComboBoxComponent } from './components/energyComboBoxComponent/energy-combo-box.component';
import { VehicleService } from './services/vehicle/vehicle.service';
import { ModelDropdownComponent } from '../garage/components/model-dropdown/model-dropdown.component';
import { BrandDropdownComponent } from '../garage/components/brand-dropdown/brand-dropdown.component';
import { TierCategoryDropdownComponent } from './components/tier-category-dropdown/tier-category-dropdown.component';
import { CompanyService } from '../administration/services/company/company.service';
import { LocalizationService } from '@progress/kendo-angular-l10n';
import {CrmDropdownComponent} from './components/crm-dropdown/crm-dropdown.component';
import {LaunchOfStatusDropdownComponent} from './components/manufactoring/launch-of-dropdown/launch-of-status-dropdown.component';
import {LaunchOfArticleDropdownComponent} from './components/manufactoring/launch-of-dropdown/launch-of-article-dropdown.component';
import {DropdownProductItemsComponent} from '../manufacturing/dropdown-product-items/dropdown-product-items.component';
import { ListTransferMovementComponent } from '../inventory/stock-documents/transfer-movement/list-transfer-movement/list-transfer-movement.component';
import { UserWarehouseService } from '../inventory/services/user-warehouse/user-warehouse.service';

@NgModule({
  imports: [
    MatIconModule,
    MatMenuModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    GridModule,
    PDFModule,
    ExcelModule,
    InputsModule,
    DropDownsModule,
    DatePickerModule,
    HttpClientJsonpModule,
    TranslateModule,
    ReactiveFormsModule,
    DropDownListModule,
    ComboBoxModule,
    CollapseModule,
    DateInputsModule,
    UploadModule,
    ScrollViewModule,
    AccordionModule,
    FieldsetModule,
    DropDownButtonModule,
    PickListModule,
    QRCodeModule,
    TelerikReportingModule,
    TreeViewModule,
    OrganizationChartModule,
    CarouselModule,
    DataViewModule,
    PanelModule,
    ColorPickerModule,
    PopupModule,
    ModalDialogModule.forRoot(),
    EditorModule,
    Ng5SliderModule,
    PaginatorModule,
    TooltipModule,
    PaginatorModule,
    VirtualScrollModule,
    MatDialogModule,
    NumberPickerModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    Ng2TelInputModule,
    HeaderModule,
    BodyModule,
    NgMultiSelectDropDownModule,
    TabViewModule
  ],

  declarations: [
    DropdownProductItemsComponent,
    LaunchOfArticleDropdownComponent,
    LaunchOfStatusDropdownComponent,
    GridImportComponent,
    CurrentFiscalYearHeaderComponent,
    SearchSectionComponent,
    TeamMultiselectComponent,
    StatusDropdownComponent,
    ChatComponent,
    SpinnerComponent,
    DepotDropdownComponent,
    PricesTypeComponent,
    DeadLineDocumentComponent,
    GridExportComponent,
    BtnGridComponent,
    FinancialCommitmentComponent,
    SettlementComponent,
    UserDropdownComponent,
    AddBankAccountComponent,
    ManageBankAccountComponent,
    ExpenseGridComponent,
    ExpenseDropdownComponent,
    TaxeDropdownComponent,
    MovementHistoryComponent,
    DocumentListComponent,
    ImportOrderDocumentLinesComponent,
    CostPriceComponent,
    ReportingInModalComponent,
    ReportingInUrlComponent,
    TrimesterDropdownComponent,
    DropdownFilterComponent,
    GridCellCheckboxTemplateComponent,
    EmployeeMultiselectComponent,
    TeamDropdownComponent,
    SkillsMultiselectComponent,
    SkillsDropdownComponent,
    SkillsFamilyDropdownComponent,
    SkillsFamilyMultiselectComponent,
    AccountsDropdownComponent,
    AddAccountComponent,
    SexDropdownComponent,
    QualificationTypeDropdownComponent,
    JobDropdownComponent,
    PriorityDropdwonComponent,
    FiscalYearDropdownComponent,
    ColorPickerComponent,
    SalaryStructureDropdownComponent,
    CommissionTypeDropdownComponent,
    StartTimeDropdownComponent,
    EndTimeDropdownComponent,
    CnssDropdownComponent,
    NatureDropdownComponent,
    TaxeMultiselectComponent,
    ControlMessagesComponent,
    CurrencyDropdownComponent,
    TaxeGroupTiersComponent,
    ItemDropdownComponent,
    PaymentDropdownComponent,
    BankAccountDropdownComponent,
    ContactDropdownComponent,
    HistoryComponent,
    CountryDropdownComponent,
    CityDropdownComponent,
    EmployeeDropdownComponent,
    DiscountGroupTiersDropDownComponent,
    DiscountGroupItemDropDownComponent,
    UnitStockComponent,
    UnitSalesComponent,
    ChangePasswordComponent,
    AddDiscountGroupTiersComponent,
    GridCellInputTemplateComponent,
    ControlMessageGridCellComponent,
    SettlementModeDropDownComponent,
    SalesSettingComboComponent,
    DropDownFooterComponent,
    InvoiceListComponent,
    DeliveryFormsListComponent,
    AddTiersComponent,
    UploadFileComponent,
    ContactComponent,
    InvoiceComponent,
    PurchaseOrderListComponent,
    QuotationSalesListComponent,
    CommentComponent,
    PaymentTypeDropdownComponent,
    GridSalesInvoiceAssestsComponent,
    PaymentMethodDropdownComponent,
    DocumentHeaderComponent,
    DocumentRequestTypeDropdownComponent,
    DocumentRequestTypeComponent,
    RatingPerSkillsComponent,
    JobMultiselectComponent,
    GradeDropdownComponent,
    EntityHistoryComponent,
    TimePipe,
    ProjectTimesheetDropdownComponent,
    ProgressBarComponent,
    DocumentStatusComponent,
    ChatComponent,
    AddQualificationComponent,
    ManageQualificationComponent,
    ProjectDropdownComponent,
    ProgressBarComponent,
    OfficeDropdownlistComponent,
    LevelDropdownComponent,
    DocumentStatusComponent,
    AddItemSearchToDocumentComponent,
    DetailsProductComponent,
    SearchTiersComponent,
    SearchItemReduicedComponent,
    BrandComboBoxComponent,
    FamilyComboBoxComponent,
    ModelOfItemComboBoxComponent,
    SubModelComboBoxComponent,
    SubFamilyComboBoxComponent,
    TecDocComponent,
    UserLanguagesDropdownComponent,
    AddBandComponent,
    BrandComboBoxComponent,
    ModelOfItemComboBoxComponent,
    SubModelComboBoxComponent,
    AddModelComponent,
    TermBillingListComponent,
    DeliveryTypeDropdownComponent,
    TermBillingGridComponent,
    DocumentControlTypeComponent,
    GridImportBsComponent,
    PolicyComboBoxComponent,
    AddExpenseComponent,
    AdvencedListProvisionnigComponent,
    BankDropdownComponent,
    ProductDropdownComponent,
    ListNegotiationComponent,
    AfterValueChangedDirective,
    PopUpSettlementDisposalComponent,
    DocumentStatusComponent,
    AddItemSearchToDocumentComponent,
    PricesTypeComponent,
    RuleCategoryComponent,
    PaymentDropdownComponent,
    SpinnerComponent,
    CompanyComboboxComponent,
    LanguageknowledgeDropdownComponent,
    ContractTypeDropdownComponent,
    SupplierDropdownComponent,
    ExitReasonDropdownComponent,
    BenefitInKindDropdownComponent,
    MaritalStatusDropdownComponent,
    BenefitInKindValidityComponent,
    TeamTypeDropdownComponent,
    SafePipe,
    HtmlToPlaintextPipe,
    AccountingReportingMenuEditionsComponent,
    AccountingReportingMenuFinancialStatesComponent,
    AccountingReportingMenuJournalsComponent,
    ReconciliationBankMenuComponent,
    RuleTypeComponent,
    PopUpSettlementDisposalComponent,
    ListNegotiationComponent,
    ChatGroupComponent,
    DayofweekDropdownComponent,
    DocumentsAssociatedComponent,
    PopUpFinancialCommitmentPaymentHistoryComponent,
    DocumentWithholdingTaxComponent,
    ActionDropdownComponent,
    GridImportComponent,
    MassValidationComponent,
    ExcelExportComponent,
    BankReconciliationComponent,
    PaymentStatusDropdownComponent,
    AgencyDropdownComponent,
    PagerComponent,
    TrimesterMultiSelectComponent,
    RoleMultiselectComponent,
    RegistrationNumberOfVehicleDropdwonComponent,
    ConfirmationModalComponent,
    TiersAddressComponent,
    TiersvehicleComponent,
    TiersContactComponent,
    PhoneComponent,
    ZipCodeDropdownComponent,
    ProfileTierComponent,
    ProfileTierGeneralComponent,
    ProfileTierLastArticlesComponent,
    ProfileTierActivitiesComponent,
    AdvancedSearchComponent,
    FiltrePredicateComponent,
    FiltreInputComponent,
    KendoPagerComponent,
    TrimesterMultiSelectComponent,
    PagerComponent,
    SearchDocumentComponent,
    TimelineComponent,
    MultiselectDropdownComponent,
    ClaimTypeDropdownComponent,
    BonusDropdownComponent,
    ContractBonusValidityComponent,
    PurchaseRequestStatusDropdownComponent,
    PrivilegeComponent,
    ZipCodeDropdownComponent,
    DayofweekMultiselectComponent,
    ShelfDropdownComponent,
    ItemAdvancedSearchComponent,
    ItemFiltreListComponent,
    WrongPayslipListComponent,
    QuickSearchItemComponent,
    GalleryCardComponent,
    PaymentSlipStatusDropdownComponent,
    InterventionStateDropdownComponent,
    InterventionLoanVehicleStatusDropdownComponent,
    VehicleModelDropdownComponent,
    DocumentTypeDropdownComponent,
    ParentPlanAccComponent,
    BooleanFilterDropDownComponent,
    ClosingStateComponent,
    DocumentTypeDropdownComponent,
    SessionStateDropdownComponent,
    JournalDropdownComponent,
    CreditTypeDropdownComponent,
    SearchSessionComponent,
    StatusAccountedDropdownComponent,
    ProjectTypeDropdownComponent,
    FundsTransferTypeDropdownComponent,
    FundsTransferStateDropdownComponent,
    CashRegisterSourceDropdownComponent,
    CashRegisterDestinationDropdownComponent,
    RepairOrderStatusDropdownComponent,
    GarageDropdownComponent,
    CandidateComboboxComponent,
    SalesPriceDropdownComponent,
    EnergyComboBoxComponent,
    ModelDropdownComponent,
    BrandDropdownComponent,
    CandidateComboboxComponent,
    TierCategoryDropdownComponent,
    CrmDropdownComponent,
    ListTransferMovementComponent

  ],
  exports: [
    DropdownProductItemsComponent,
    LaunchOfArticleDropdownComponent,
    LaunchOfStatusDropdownComponent,
    TierCategoryDropdownComponent,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    AdvencedListProvisionnigComponent,
    MatStepperModule, MatInputModule, MatButtonModule, MatAutocompleteModule,
    CommonModule,
    CurrentFiscalYearHeaderComponent,
    SpinnerComponent,
    ChangePasswordComponent,
    SearchSectionComponent,
    ActionDropdownComponent,
    StatusDropdownComponent,
    TeamMultiselectComponent,
    ChatComponent,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    GridModule,
    ComboBoxModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    DropDownListModule,
    CollapseModule,
    DropDownButtonModule,
    DepotDropdownComponent,
    NatureDropdownComponent,
    InputsModule,
    AccountsDropdownComponent,
    FiscalYearDropdownComponent,
    AddAccountComponent,
    TaxeMultiselectComponent,
    ControlMessagesComponent,
    CurrencyDropdownComponent,
    PricesTypeComponent,
    TaxeGroupTiersComponent,
    TranslateModule,
    DatePickerModule,
    SupplierDropdownComponent,
    ItemDropdownComponent,
    PaymentDropdownComponent,
    BankAccountDropdownComponent,
    ContactDropdownComponent,
    HistoryComponent,
    CountryDropdownComponent,
    CityDropdownComponent,
    EmployeeDropdownComponent,
    DateInputsModule,
    DiscountGroupTiersDropDownComponent,
    UnitStockComponent,
    UnitSalesComponent,
    GridCellInputTemplateComponent,
    ControlMessageGridCellComponent,
    DropDownsModule,
    SettlementModeDropDownComponent,
    SalesSettingComboComponent,
    InfiniteScrollModule,
    PDFModule,
    ManageBankAccountComponent,
    EditorModule,
    SkillsDropdownComponent,
    SkillsFamilyMultiselectComponent,
    SexDropdownComponent,
    ScrollViewModule,
    AccordionModule,
    FieldsetModule,
    QualificationTypeDropdownComponent,
    JobDropdownComponent,
    PriorityDropdwonComponent,
    SalaryStructureDropdownComponent,
    CommissionTypeDropdownComponent,
    CnssDropdownComponent,
    EndTimeDropdownComponent,
    QRCodeModule,
    UploadModule,
    DropDownFooterComponent,
    DeliveryFormsListComponent,
    InvoiceComponent,
    ContactComponent,
    PurchaseOrderListComponent,
    CommentComponent,
    InvoiceListComponent,
    QuotationSalesListComponent,
    InfiniteScrollModule,
    UploadFileComponent,
    PaymentTypeDropdownComponent,
    DeadLineDocumentComponent,
    ExcelModule,
    SkillsMultiselectComponent,
    GridExportComponent,
    BtnGridComponent,
    TelerikReportingModule,
    UserDropdownComponent,
    FinancialCommitmentComponent,
    SettlementComponent,
    ExpenseGridComponent,
    ExpenseDropdownComponent,
    TreeViewModule,
    DocumentListComponent,
    ImportOrderDocumentLinesComponent,
    CostPriceComponent,
    ReportingInModalComponent,
    ReportingInUrlComponent,
    TrimesterDropdownComponent,
    DropdownFilterComponent,
    GridCellCheckboxTemplateComponent,
    OrganizationChartModule,
    EmployeeMultiselectComponent,
    TeamDropdownComponent,
    TaxeDropdownComponent,
    CarouselModule,
    DataViewModule,
    PanelModule,
    ColorPickerModule,
    ColorPickerComponent,
    DocumentRequestTypeDropdownComponent,
    DocumentRequestTypeComponent,
    JobMultiselectComponent,
    DiscountGroupItemDropDownComponent,
    DocumentHeaderComponent,
    GridSalesInvoiceAssestsComponent,
    AddTiersComponent,
    SkillsFamilyDropdownComponent,
    StartTimeDropdownComponent,
    PickListModule,
    RatingPerSkillsComponent,
    TimePipe,
    EntityHistoryComponent,
    ProjectTimesheetDropdownComponent,
    ProgressBarComponent,
    GradeDropdownComponent,
    ManageQualificationComponent,
    ChatComponent,
    ProjectDropdownComponent,
    PaginatorModule,
    OfficeDropdownlistComponent,
    LevelDropdownComponent,
    AddItemSearchToDocumentComponent,
    TooltipModule,
    DetailsProductComponent,
    SearchTiersComponent,
    SearchItemReduicedComponent,
    BrandComboBoxComponent,
    FamilyComboBoxComponent,
    ModelOfItemComboBoxComponent,
    SubModelComboBoxComponent,
    SubFamilyComboBoxComponent,
    TecDocComponent,
    UserLanguagesDropdownComponent,
    AddItemSearchToDocumentComponent,
    AddBandComponent,
    BrandComboBoxComponent,
    ModelOfItemComboBoxComponent,
    SubModelComboBoxComponent,
    AddModelComponent,
    PaginatorModule,
    MovementHistoryComponent,
    DeliveryTypeDropdownComponent,
    DocumentControlTypeComponent,
    DocumentStatusComponent,
    TermBillingGridComponent,
    GridImportBsComponent,
    PolicyComboBoxComponent,
    AddExpenseComponent,
    BankDropdownComponent,
    ProductDropdownComponent,
    AfterValueChangedDirective,
    PopUpSettlementDisposalComponent,
    RuleTypeComponent,
    RuleCategoryComponent,
    LevelDropdownComponent,
    DayofweekDropdownComponent,
    OfficeDropdownlistComponent,
    SpinnerComponent,
    CurrentFiscalYearHeaderComponent,
    CompanyComboboxComponent,
    ExitReasonDropdownComponent,
    ContractTypeDropdownComponent,
    LanguageknowledgeDropdownComponent,
    BenefitInKindDropdownComponent,
    MaritalStatusDropdownComponent,
    BenefitInKindValidityComponent,
    TeamTypeDropdownComponent,
    SafePipe,
    HtmlToPlaintextPipe,
    AccountingReportingMenuEditionsComponent,
    AccountingReportingMenuFinancialStatesComponent,
    AccountingReportingMenuJournalsComponent,
    PopUpFinancialCommitmentPaymentHistoryComponent,
    ReconciliationBankMenuComponent,
    DocumentWithholdingTaxComponent,
    AddBankAccountComponent,
    GridImportComponent,
    ExcelExportComponent,
    BankReconciliationComponent,
    PaymentStatusDropdownComponent,
    AgencyDropdownComponent,
    PagerComponent,
    TrimesterDropdownComponent,
    RoleMultiselectComponent,
    RegistrationNumberOfVehicleDropdwonComponent,
    MatSlideToggleModule,
    MatMenuModule,
    MatIconModule,
    NumberPickerModule,
    ConfirmationModalComponent,
    ZipCodeDropdownComponent,
    TiersAddressComponent,
    TiersContactComponent,
    TiersvehicleComponent,
    AdvancedSearchComponent,
    KendoPagerComponent,
    PagerComponent,
    TrimesterDropdownComponent,
    PhoneComponent,
    MultiselectDropdownComponent,
    ClaimTypeDropdownComponent,
    BonusDropdownComponent,
    ContractBonusValidityComponent,
    PrivilegeComponent,
    ZipCodeDropdownComponent,
    DayofweekMultiselectComponent,
    WrongPayslipListComponent,
    ShelfDropdownComponent,
    ItemAdvancedSearchComponent,
    ShelfDropdownComponent,
    ItemAdvancedSearchComponent,
    QuickSearchItemComponent,
    GalleryCardComponent,
    PaymentSlipStatusDropdownComponent,
    InterventionStateDropdownComponent,
    InterventionLoanVehicleStatusDropdownComponent,
    VehicleModelDropdownComponent,
    TimelineComponent,
    CreditTypeDropdownComponent,
    SearchSessionComponent,
    ProjectTypeDropdownComponent,
    FundsTransferTypeDropdownComponent,
    FundsTransferStateDropdownComponent,
    CashRegisterSourceDropdownComponent,
    CashRegisterDestinationDropdownComponent,
    RepairOrderStatusDropdownComponent,
    GarageDropdownComponent,
    TabViewModule,
    CandidateComboboxComponent,
    EnergyComboBoxComponent,
    SalesPriceDropdownComponent,
    ModelDropdownComponent,
    BrandDropdownComponent,
    ListTransferMovementComponent,

  ],
  providers: [
    LocalizationService,
    ModulesSettingsService,
    DocumentTypeService,
    ShelfService,
    ZipCodeService,
    ClaimTypeService,
    FamilyService,
    ModelOfItemService,
    SubModelService,
    SubFamilyService,
    BrandService,
    TaxeService,
    TecdocService,
    ContactService,
    PurchaseSettingsService,
    TiersService,
    EmployeeService,
    PaymentModeService,
    BankAccountService,
    ProvisioningService,
    ItemService,
    TeamTypeService,
    StyleConfigService,
    UserService,
    WarehouseService,
    WarehouseItemService,
    DocumentService,
    FinancialCommitmentService,
    DocumentLineService,
    DiscountGroupTiersService,
    TaxeGroupTiersService,
    DiscountGroupItemService,
    QualificationTypeService,
    ListDocumentService,
    DialogService,
    FormModalDialogService,
    CountryService,
    CityService,
    SettlementModeService,
    ChartAccountService,
    AccountingConfigurationService,
    FiscalYearService,
    AccountService,
    SalesSettingsService,
    DocumentFormService,
    DeliveryTypeService,
    {
      provide: IntlService,
      useExisting: CldrIntlService,
    },
    SwalWarring,
    ValidationService,
    NotificationService,
    MailingService,
    ChatService,
    MessageService,
    InformationService,
    CommentService,
    ProgressService,
    ReportingServiceService,
    FileService,
    ReportTemplateService,
    EmailService,
    MessageAdministrativeDocumentsService,
    CategoryService,
    CurrencyService,
    OpportunityService,
    DatePipe,
    ClaimService,
    CandidateService,
    PeriodService,
    TeamService,
    DocumentRequestTypeService,
    GradeService,
    JobService,
    CnssService,
    SalaryStructureService,
    PaymentTypeService,
    TemplateAccountingService,
    JournalService,
    GenericAccountingService,
    OfficeService,
    SearchItemService,
    SpinnerService,
    AccountingConfigurationService,
    LanguageKnowledgeService,
    BenefitInKindService,
    GeneralSettingsService,
    OrderProjectService,
    SettlementMethodService,
    MovementHistoryService,
    ExpenseService,
    BankService,
    NatureService,
    MeasureUnitService,
    ProductItemService,
    TemplateAccountingService,
    JournalService,
    ReportingService,
    AmountFormatService,
    BankAccountsResolverService,
    ReconciliationService,
    DeadLineDocumentService,
    PagerComponent,
    UtilityService,
    RoleMultiselectComponent,
    DeadLineDocumentService,
    CanDeactivateGuard,
    ZipCodeService,
    BonusService,
    ModulesSettings,
    GridImportComponent,
    StockDocumentsService,
    SessionService,
    EcommerceProductService,
    VehicleEnergyService,
    VehicleService,
    SalesPriceService,
    CompanyService,
    {
      provide: OwlDateTimeIntl,
      useClass: SetPickerLabels
    },
    UserCurrentInformationsService,
    UserWarehouseService
  ],
  entryComponents: [
    AddTiersComponent,
    AddBankAccountComponent,
    AddAccountComponent,
    AddDiscountGroupTiersComponent,
    ColorPickerComponent,
    DocumentRequestTypeComponent,
    FetchProductsComponent,
    DetailsProductComponent,
    ChangePasswordComponent,
    ReportingInModalComponent,
    ShowDetailSettlementComponent,
    AddBandComponent,
    AddModelComponent,
    ImportOrderDocumentLinesComponent,
    ReportingInModalComponent,
    ContactComponent,
    AddExpenseComponent,
    PopUpSettlementDisposalComponent,
    ListCurrencyComponent,
    AddQualificationComponent,
    ReportingInModalComponent,
    ListGradeComponent,
    ListQualificationTypeComponent,
    ListTeamTypeComponent,
    AddJobComponent,
    PopUpFinancialCommitmentPaymentHistoryComponent,
    DocumentsAssociatedComponent,
    ChatGroupComponent,
    AddContractTypeComponent,
    PrivilegeComponent,
    WrongPayslipListComponent,

  ]
})

export class SharedModule {

  constructor() { }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [SignalrHubService],
    };
  }
}
