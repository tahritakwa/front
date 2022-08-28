import {TierCategoryDropdownComponent} from './../../tier-category-dropdown/tier-category-dropdown.component';
import {DatePipe} from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {DatePickerComponent} from '@progress/kendo-angular-dateinputs';
import {EnumValues} from 'enum-values';
import {Subscription} from 'rxjs/Subscription';
import {FieldTypeConstant} from '../../../../constant/shared/fieldType.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {TypeConstant} from '../../../../constant/utility/Type.constant';
import {InterventionStateDropdownComponent} from '../../../../garage/components/intervention-state-dropdown/intervention-state-dropdown.component';
import {VehicleModelDropdownComponent} from '../../../../garage/components/vehicle-model-dropdown/vehicle-model-dropdown.component';
import {ClaimTypeDropdownComponent} from '../../../../helpdesk/components/claim-type-dropdown/claim-type-dropdown.component';
import {ClaimTypeService} from '../../../../helpdesk/services/claim-type/claim-type.service';
import {ShelfService} from '../../../../inventory/services/shelf/shelf.service';
import {DocumentEnumerator, InvoicingTypeEnumerator} from '../../../../models/enumerators/document.enum';
import {ClaimType} from '../../../../models/helpdesk/claim-type.model';
import {SessionService} from '../../../../payroll/services/session/session.service';
import {PurchaseRequestStatusDropdownComponent} from '../../../../purchase/components/purchase-request-status-dropdown/purchase-request-status-dropdown.component';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../../stark-permissions/utils/utils';

import {
  Filter,
  Operation,
  OperationBoolean,
  OperationDropDown, OperationProdTypeString,
  OperationTypeDate, OperationTypeDateAcc,
  OperationTypeDropDown,
  OperationTypeNumber,
  OperationTypeString,
  PredicateFormat,
  SpecFilter
} from '../../../utils/predicate';
import {BankDropdownComponent} from '../../bank/bank-dropdown/bank-dropdown.component';
import {BooleanFilterDropDownComponent} from '../../boolean-filter-drop-down/boolean-filter-drop-down.component';
import {ClosingStateComponent} from '../../closing-state/closing-state.component';
import {DepotDropdownComponent} from '../../depot-dropdown/depot-dropdown.component';
import {DocumentStatusComponent} from '../../document-status/document-status.component';
import {DocumentTypeDropdownComponent} from '../../document/document-type-dropdown/document-type-dropdown.component';
import {ItemDropdownComponent} from '../../item-dropdown/item-dropdown.component';
import {ParentPlanAccComponent} from '../../parent-plan-acc/parent-plan-acc.component';
import {PaymentSlipStatusDropdownComponent} from '../../payment-slip-status-dropdown/payment-slip-status-dropdown.component';
import {PaymentStatusDropdownComponent} from '../../payment-status-dropdown/payment-status-dropdown.component';
import {RegistrationNumberOfVehicleDropdwonComponent} from '../../registration-number-of-vehicle-dropdwon/registration-number-of-vehicle-dropdwon.component';
import {SessionStateDropdownComponent} from '../../session-state-dropdown/session-state-dropdown.component';
import {SettlementModeDropDownComponent} from '../../settlement-mode-drop-down/settlement-mode-drop-down.component';
import {ShelfDropdownComponent} from '../../shelf-dropdown/shelf-dropdown.component';
import {SupplierDropdownComponent} from '../../supplier-dropdown/supplier-dropdown.component';
import NumberFormatOptions = Intl.NumberFormatOptions;
import {JournalDropdownComponent} from '../../journal-dropdown/journal-dropdown.component';
import {LoanConstant} from '../../../../constant/payroll/loan.constant';
import {PaymentDropdownComponent} from '../../payment-dropdown/payment-dropdown.component';
import {ProjectTypeDropdownComponent} from '../../../../sales/components/project-type-drop-down/project-type-dropdown.component';
import {CountryDropdownComponent} from '../../country-dropdown/country-dropdown.component';
import {TaxeGroupTiersComponent} from '../../taxe-group-tiers/taxe-group-tiers.component';
import {StatusDropdownComponent} from '../../status-dropdown/status-dropdown.component';
// tslint:disable-next-line:max-line-length
import {InterventionLoanVehicleStatusDropdownComponent} from '../../../../garage/components/intervention-loan-vehicle-status-dropdown/intervention-loan-vehicle-status-dropdown.component';
import {CityDropdownComponent} from '../../city-dropdown/city-dropdown.component';
import {CurrencyDropdownComponent} from '../../currency-dropdown/currency-dropdown.component';
import {PriceStateEnumerator} from '../../../../models/enumerators/price-state.enum';
import {EmployeeDropdownComponent} from '../../employee-dropdown/employee-dropdown.component';
import {PriceTypeEnumerator} from '../../../../models/enumerators/price-type.enum';
import {AccountingConfigurationConstant} from '../../../../constant/accounting/accounting-configuration.constant';
import {AccountingConfigurationService} from '../../../../accounting/services/configuration/accounting-configuration.service';
import {claimStatusCode} from '../../../../models/enumerators/claim.enum';
import {FundsTransferTypeDropdownComponent} from '../../../../treasury/components/funds-transfer-type-dropdown/funds-transfer-type-dropdown.component';
import {FundsTransferStateDropdownComponent} from '../../../../treasury/components/funds-transfer-state-dropdown/funds-transfer-state-dropdown.component';
import {CashRegisterSourceDropdownComponent} from '../../../../treasury/components/cash-register-source-dropdown/cash-register-source-dropdown.component';
import {CashRegisterDestinationDropdownComponent} from '../../../../treasury/components/cash-register-destination-dropdown/cash-register-destination-dropdown/cash-register-destination-dropdown.component';
import {RepairOrderStatusDropdownComponent} from '../../../../garage/components/repair-order-status-dropdown/repair-order-status-dropdown.component';
import {GarageDropdownComponent} from '../../../../garage/components/garage-dropdown/garage-dropdown.component';
import {ContractTypeDropdownComponent} from '../../contract-type-dropdown/contract-type-dropdown/contract-type-dropdown.component';
import {SalaryStructureDropdownComponent} from '../../salary-structure-dropdown/salary-structure-dropdown.component';
import {ContractConstant} from '../../../../constant/payroll/Contract.constant';
import {ExitReasonDropdownComponent} from '../../exit-reason-dropdown/exit-reason-dropdown.component';
import {ExitEmployeeConstant} from '../../../../constant/payroll/exit-employee.constant';
import {ExitEmployeeStatusEnum} from '../../../../models/enumerators/exit-employee-status-enum';
import {DocumentRequestTypeDropdownComponent} from '../../document-request-type-dropdown/document-request-type-dropdown.component';
import {DocumentRequestConstant} from '../../../../constant/payroll/document-request.constant';
import {PriorityDropdwonComponent} from '../../priority-dropdwon/priority-dropdwon.component';
import {RecruitmentConstant} from '../../../../constant/rh/recruitment.constant';
import {JobDropdownComponent} from '../../job-dropdown/job-dropdown.component';
import {RecruitmentOfferStatus} from '../../../../models/enumerators/recruitment-offer-status.enum';
import {RecruitmentRequestStateEnumerator, RecruitmentState} from '../../../../models/enumerators/recruitment-state.enum';
import {CandidateComboboxComponent} from '../../candidate-combobox/candidate-combobox.component';
import {TeamMultiselectComponent} from '../../team-multiselect/team-multiselect.component';
import {EmployeeMultiselectComponent} from '../../employee-multiselect/employee-multiselect.component';
import {CrmDropdownComponent} from '../../crm-dropdown/crm-dropdown.component';
import {LaunchOfStatusDropdownComponent} from '../../manufactoring/launch-of-dropdown/launch-of-status-dropdown.component';
import {LaunchOfArticleDropdownComponent} from '../../manufactoring/launch-of-dropdown/launch-of-article-dropdown.component';
import { UserDropdownComponent } from '../../user-dropdown/user-dropdown.component';
import { ComponentsConstant } from '../../../../constant/shared/components.constant';

const INPUT_TEXT = 'inputText';
const PROP = 'prop';
const FILTRES = 'filtres';
const IS_DATE_FILTRE_BETWEEN = 'isDateFiltreBetween';
const SPECIFIC_FILTRE = 'SpecificFiltre';
const SPECIFIC_FILTRE_TO_DELETE = 'SpecificFiltreToDelete';

@Component({
  selector: 'app-filtre-predicate',
  templateUrl: './filtre-predicate.component.html',
  styleUrls: ['./filtre-predicate.component.scss']
})
export class FiltrePredicateComponent implements OnInit, OnChanges {
  /**
   * decorator to identify the label
   */
  @Input() label;
  /**
   * decorator to identify the field type
   */
  @Input() type;
  /**
   * decorator to identify the column name
   */
  @Input() columnName;
  /**
   * decorator to identify if the field is a specific filtre
   */
  @Input() isSpecificFiltre = false;
  /**
   * decorator to identify the field module
   */
  @Input() module;
  /**
   * decorator to identify the field model
   */
  @Input() model;
  /**
   * decorator to identify the field propertyOfParentEntity
   */
  @Input() propertyOfParentEntity;
  /**
   * decorator to identify the field property
   */
  @Input() filtreProp;
  /**
   * decorator to reset field value
   */
  @Input() resetFieldValue;
  /**
   * decorator to identify the document type
   */
  @Input() documentType;
  /**
   * decorator to identify the place holder of the filtre value
   */
  @Input() filtreValuePlaceHolder;
  /**
   * decorator to get other filter states
   */
  @Input() parentID;
  /**
   * decorator to emit the filtre operator value to prarent component
   */
  @Output() filtreOperatorEvent = new EventEmitter<any>();
  /**
   * decorator to emit the state of the filtre value after reset
   */
  @Output() filtreValueResetEvent = new EventEmitter<any>();
  /**
   * decorator to emit the state of the filtre value after reset
   */
  @Output() handleOtherFilterEvent = new EventEmitter<any>();
  /**
   * Decorator to identify the input element
   */
  @ViewChild(INPUT_TEXT) public inputText: ElementRef;
  /**
   * Decorator to identify kendo date picket input
   */
  @ViewChildren(DatePickerComponent) inputDate: QueryList<DatePickerComponent>;
  /**
   * Decorator to identify shelf dropdown Component
   */
  @ViewChild(ShelfDropdownComponent) shelfStorageDropdownComponent: ShelfDropdownComponent;
  /**
   * Decorator to identify warehouse dropdown Component
   */
  @ViewChild(DepotDropdownComponent) depotDropdownComponent: DepotDropdownComponent;
  /**
   * Decorator to identify document status dropdown Component
   */
  @ViewChild(DocumentStatusComponent) documentStatusDropdownComponent: DocumentStatusComponent;
  /**
   * Decorator to identify purchase request status dropdown  Component
   */
  @ViewChild(PurchaseRequestStatusDropdownComponent) purchaseRequestStatusDropdownComponent: PurchaseRequestStatusDropdownComponent;
  /**
   * Decorator to identify item dropdown  Component
   */
  @ViewChild(ItemDropdownComponent) itemDropdownComponent: ItemDropdownComponent;
  /**
   * Decorator to identify tiers dropdown  Component
   */
  @ViewChild(SupplierDropdownComponent) supplierDropdownComponent: SupplierDropdownComponent;
  /**
   * Decorator to identify settlement mode dropdown  Component
   */
  @ViewChild(SettlementModeDropDownComponent) settlementModeDropDownComponent: SettlementModeDropDownComponent;
  /**
   * Decorator to identify claim type dropdown  Component
   */
  @ViewChild(ClaimTypeDropdownComponent) claimTypeDropdownComponent: ClaimTypeDropdownComponent;
  /**
   * Decorator to identify bank dropdown  Component
   */
  @ViewChild(BankDropdownComponent) bankDropdownComponent: BankDropdownComponent;
  /**
   * Decorator to identify status payment Slip dropdown  Component
   */
  @ViewChild(PaymentSlipStatusDropdownComponent) paymentSlipStatusDropdownComponent: PaymentSlipStatusDropdownComponent;
  /**
   * Decorator to identify document type dropdown  Component
   */
  @ViewChild(DocumentTypeDropdownComponent) documentTypeDropdownComponent: DocumentTypeDropdownComponent;

  /**
   * Decorator to identify stayt type dropdown  Component
   */
  @ViewChild(PaymentStatusDropdownComponent) paymentStatusDropdownComponent: PaymentStatusDropdownComponent;

  @ViewChild(SessionStateDropdownComponent) sessionStateDropdownComponent: SessionStateDropdownComponent;

  @ViewChild(PaymentDropdownComponent) paymentDropdownComponent: PaymentDropdownComponent;


  subscription: Subscription;
  /**
   * date format (year month)
   */
  public monthFormat = SharedConstant.MONTH_FORMAT;
  public yearFormat = SharedConstant.YEAR_FORMAT;
  /**
   *  Decorator to identify registrationNumberOfVehicleDropdwonComponent
   */
  @ViewChild(RegistrationNumberOfVehicleDropdwonComponent) registrationNumberOfVehicleDropdwonComponent:
    RegistrationNumberOfVehicleDropdwonComponent;
  /**
   *  Decorator to identify interventionStateDropdownComponent
   */
  @ViewChild(InterventionStateDropdownComponent) interventionStateDropdownComponent: InterventionStateDropdownComponent;
  /**
   *  Decorator to identify interventionLoanVehicleStatusDropdownComponent
   */
  @ViewChild(InterventionLoanVehicleStatusDropdownComponent) interventionLoanVehicleStatusDropdownComponent:
    InterventionLoanVehicleStatusDropdownComponent;
  /**
   *  Decorator to identify garageDropdownComponent
   */
  @ViewChild(GarageDropdownComponent) garageDropdownComponent:
    GarageDropdownComponent;
  /**
   *  Decorator to identify repairOrderStateDropdownComponent
   */
  @ViewChild(RepairOrderStatusDropdownComponent) repairOrderStateDropdownComponent: RepairOrderStatusDropdownComponent;
  /**
   /**
   *  Decorator to identify VehicleModelDropdownComponent
   */
  @ViewChild(VehicleModelDropdownComponent) vehicleModelDropdownComponent: VehicleModelDropdownComponent;

  /**
   * Decorator to identify parentPlan value dropdown  Component
   */
  @ViewChild(ParentPlanAccComponent) parentPlanDropdownComponent: ParentPlanAccComponent;
  /**
   * Decorator to identify boolean component value dropdown  Component
   */
  @ViewChild(BooleanFilterDropDownComponent) booleanFilterDropDownComponent: BooleanFilterDropDownComponent;
  /**
   * Decorator to identify closing state component value dropdown  Component
   */
  @ViewChild(ClosingStateComponent) closingStateComponent: ClosingStateComponent;

  /**
   *  Decorator to identify VehicleModelDropdownComponent
   */
  @ViewChild(JournalDropdownComponent) JournalDropdownComponent: JournalDropdownComponent;

  @ViewChild(ProjectTypeDropdownComponent) projectTypeComponent: ProjectTypeDropdownComponent;
  /**
   *  Decorator to identify CountryDropdownComponent
   */
  @ViewChild(CountryDropdownComponent) CountryDropdownComponent: CountryDropdownComponent;
  /**
   *  Decorator to identify TaxeGroupTiersComponent
   */
  @ViewChild(TaxeGroupTiersComponent) TaxeGroupTiersComponent: TaxeGroupTiersComponent;
  /**
   *  Decorator to identify TierCategoryDropdownComponent
   */
  @ViewChild(TierCategoryDropdownComponent) TierCategoryDropdownComponent: TierCategoryDropdownComponent;
  /**
   *  Decorator to identify StatusDropdownComponent
   */
  @ViewChild(StatusDropdownComponent) StatusDropdownComponent: StatusDropdownComponent;
  @ViewChild(CityDropdownComponent) CityDropdownComponent: CityDropdownComponent;
  @ViewChild(CurrencyDropdownComponent) CurrencyDropdownComponent: CurrencyDropdownComponent;
  @ViewChild(EmployeeDropdownComponent) EmployeeDropdownComponent: EmployeeDropdownComponent;
  @ViewChild(ContractTypeDropdownComponent) ContractTypeDropdownComponent: ContractTypeDropdownComponent;
  @ViewChild(SalaryStructureDropdownComponent) SalaryStructureDropdownComponent: SalaryStructureDropdownComponent;
  @ViewChild(ExitReasonDropdownComponent) ExitReasonDropdownComponent: ExitReasonDropdownComponent;
  @ViewChild(DocumentRequestTypeDropdownComponent) DocumentRequestTypeDropdownComponent: DocumentRequestTypeDropdownComponent;
  @ViewChild(PriorityDropdwonComponent) PriorityDropdwonComponent: PriorityDropdwonComponent;
  @ViewChild(JobDropdownComponent) JobDropdownComponent: JobDropdownComponent;
  @ViewChild(CandidateComboboxComponent) CandidateDropdownComponent: CandidateComboboxComponent;
  @ViewChild(TeamMultiselectComponent) TeamMultiselectComponent: TeamMultiselectComponent;
  @ViewChild(EmployeeMultiselectComponent) EmployeeMultiselectComponent: EmployeeMultiselectComponent;

  @ViewChild(FundsTransferTypeDropdownComponent) FundsTransferTypeDropdownComponent: FundsTransferTypeDropdownComponent;
  @ViewChild(FundsTransferStateDropdownComponent) FundsTransferStateDropdownComponent: FundsTransferStateDropdownComponent;
  @ViewChild(CashRegisterSourceDropdownComponent) CashRegisterSourceDropdownComponent: CashRegisterSourceDropdownComponent;
  @ViewChild(CashRegisterDestinationDropdownComponent) CashRegisterDestinationDropdownComponent: CashRegisterDestinationDropdownComponent;
  @ViewChild(CrmDropdownComponent) CrmDropdownComponent: CrmDropdownComponent;
  @ViewChild(LaunchOfStatusDropdownComponent) launchOfStatusDropdownComponent: LaunchOfStatusDropdownComponent;
  @ViewChild(LaunchOfArticleDropdownComponent) launchOfArticleDropdownComponent: LaunchOfArticleDropdownComponent;
  @ViewChild(UserDropdownComponent) UserDropdownComponent: UserDropdownComponent;

  /**
   * list of filtre operations
   */
  public filtreOperations = [];
  public filtreOperation: Operation = NumberConstant.ONE;
  public defaultOperation = NumberConstant.ONE;
  public inputTypeText = TypeConstant.string;
  public inputTypeBoolean = FieldTypeConstant.BOOLEAN;
  public inputTypeDate = TypeConstant.date;
  public inputTypeDayDate = TypeConstant.dayDate;
  public inputTypeMonthDate = TypeConstant.monthDate;
  public inputTypeYearDate = TypeConstant.yearDate;
  public inputTypeRefundStartDate = FieldTypeConstant.inputTypeRefundStartDate;
  public inputTypeYearSourceDeduction = TypeConstant.yearSourceDeductionDate;
  public documentStatusComponentType = FieldTypeConstant.documentStatusComponent;
  public itemDropdownComponentType = FieldTypeConstant.itemDropDownComponent;
  public purchaseRequestDropdownComponentType = FieldTypeConstant.purchaseRequestDropdownComponent;
  public supplierComponentType = FieldTypeConstant.supplierComponent;
  public customerComponentType = FieldTypeConstant.customerComponent;
  public numerictexbox_type = FieldTypeConstant.numerictexbox_type;
  public invoiceTypeDropdownComponentType = FieldTypeConstant.invoiceTypeDropdownComponent;
  public warehouseTypeDropdownComponentType = FieldTypeConstant.warehouseTypeDropdownComponent;
  public storageSourceDropdownComponentType = FieldTypeConstant.storageSourceDropdownComponent;
  public storageDestinationDropdownComponentType = FieldTypeConstant.storageDestinationDropdownComponent;
  public natureDropdownComponent = FieldTypeConstant.natureDropdownComponent;
  public paymentSlipStatusComponent = FieldTypeConstant.paymentSlipStatusComponent;
  public paymentStatusComponent = FieldTypeConstant.paymentStatusComponent;
  public registrationNumberOfVehicleDropdownComponentType = FieldTypeConstant.REGISTRATION_NUMBER_OF_VEHICLE_DROPDWON_COMPONENT;
  public interventionStateDropdownComponentType = FieldTypeConstant.INTERVENTION_STATE_DROPDOWN_COMPONENT;
  public repairOrderStateDropdownComponentType = FieldTypeConstant.REPAIR_ORDER_STATE_DROPDOWN_COMPONENT;
  public garageDropdownComponentType = FieldTypeConstant.GARAGE_DROPDOWN_COMPONENT;
  public interventionLoanVehicleStatusDropdownComponentType = FieldTypeConstant.INTERVENTION_LOAN_VEHICLE_STATUS_DROPDOWN_COMPONENT;
  public vehicleModelDropdownComponentType = FieldTypeConstant.VEHICLE_MODEL_DROPDOWN_COMPONENT;
  public sessionStateComponent = FieldTypeConstant.sessionStateComponent;
  public transferOderStateComponent = FieldTypeConstant.transferOderStateComponent;
  public trimesterComponent = FieldTypeConstant.trimesterComponent;
  public cnssDropdownComponent = FieldTypeConstant.cnssDropdownComponent;
  public employeeDropdownComponent = FieldTypeConstant.employeeDropdownComponent;
  public creditTypeDropdown = FieldTypeConstant.CREDIT_TYPE_DROPDOWN;
  public documentTypeDropdownComponentType = FieldTypeConstant.documentTypeDropdownComponent;
  public tiersComponentType = FieldTypeConstant.tiersComponentType;
  public planCodeComponent = FieldTypeConstant.planCodeComponent;
  public closingComponentState = FieldTypeConstant.closingStateComponent;
  public inputTypeDateACC = FieldTypeConstant.DATE_TYPE_ACC;
  public inputTypeTextProduction = FieldTypeConstant.PROD_ARTICLE_TEXT;
  public loanStateComponent = FieldTypeConstant.loanStateComponent;
  public taxeGroupTiersComponent = FieldTypeConstant.TAXE_GROUP_TIERS_DROPDOWN;
  public countryDropdownComponent = FieldTypeConstant.COUNTRY_COMPONENT_DROPDOWN;
  public tierCategoryDropdownComponent = FieldTypeConstant.CATEGORY_COMPONENT_DROPDOWN;
  public projectTypeDropdownComponent = FieldTypeConstant.PROJECT_DROPDOWN_COMPONENT;
  public billingSessionDropdownComponent = FieldTypeConstant.BILLING_SESSION_DROPDOWN;
  public statusTeamCode = FieldTypeConstant.statusTeamCode;
  public cityDropdownComponent = FieldTypeConstant.CITY_DROPDOWN_COMPONENT;
  public currencyDropdownComponent = FieldTypeConstant.CURRENCY_DROPDOWN_COMPONENT;
  public fundsTransferTypeDropdownComponent = FieldTypeConstant.FUNDS_TRANSFER_TYPE_DROPDOWN_COMPONENT;
  public fundsTransferStateDropdownComponent = FieldTypeConstant.FUNDS_TRANSFER_STATE_DROPDOWN_COMPONENT;
  public cashRegisterSourceDropdownComponent = FieldTypeConstant.CASH_REGISTER_SOURCE_DROPDOWN_COMPONENT;
  public cashRegisterDestinationDropdownComponent = FieldTypeConstant.CASH_REGISTER_DESTINATION_DROPDOWN_COMPONENT;
  public userDropdownComponent = FieldTypeConstant.userDropdownComponent;


  public filtreValue: any;
  public filtreGteValue: any;
  public filtreLteValue: any;
  public isBetweenFiltreType = false;
  public formGroupFilter: FormGroup;
  public formatNumberOptions: NumberFormatOptions;
  public claimTypeDropDown = TypeConstant.claimTypeDropDown;
  public bankDropdown = FieldTypeConstant.bankDropdownComponent;

  public journalComponent = FieldTypeConstant.journalComponent;
  public statusAccountedComponent = FieldTypeConstant.statusAccountedComponent;
  public paymentMethodeComponent = FieldTypeConstant.paymentMethodeComponent;
  public priceState = FieldTypeConstant.priceState;
  public priceType = FieldTypeConstant.priceType;
  public claimStatusCode = FieldTypeConstant.claimStatusCode;
  public contractTypeDropdownComponent = FieldTypeConstant.CONTRACT_TYPE_DROPDOWN_COMPONENT;
  public salaryStructureDropdownComponent = FieldTypeConstant.SALARY_STRUCTURE_DROPDOWN_COMPONENT;
  public contractStateDropdown = FieldTypeConstant.CONTRACT_STATE_DROPDOWN;
  public exitReasonDropdownComponent = FieldTypeConstant.EXIT_REASON_DROPDOWN_COMPONENT;
  public exitEmployeeStatusDropdown = FieldTypeConstant.EXIT_EMPLOYEE_STATUS_COMPONENT;
  public documentRequestTypeDropdownComponent = FieldTypeConstant.DOCUMENT_REQUEST_TYPE_DROPDOWN_COMPONENT;
  public recruitmentRequestStateDropdown = FieldTypeConstant.RECRUITMENT_REQUEST_STATE_DROPDOWN;
  public priorityDropdownComponent = FieldTypeConstant.PRIORITY_DROPDOWN_COMPONENT;
  public jobDropdownComponent = FieldTypeConstant.JOB_DROPDOWN_COMPONENT;
  public recruitmentOfferStateDropdown = FieldTypeConstant.RECRUITMENT_OFFER_STATE_DROPDOWN_COMPONENT;
  public recruitmentStateDropdown = FieldTypeConstant.RECRUITMENT_STATE_DROPDOWN_COMPONENT;
  public candidateDropdownComponent = FieldTypeConstant.CANDIDATE_DROPDOWN_COMPONENT;
  public monthType = FieldTypeConstant.MONTH;
  public teamMultiselectComponent = FieldTypeConstant.TEAM_MULTISELECT_COMPONENT;
  public employeeMultiselectComponent = FieldTypeConstant.EMPLOYEE_MULTISELECT_COMPONENT;
  public crmDropdownComponent = FieldTypeConstant.CRM_DROPDOWN_MULTISELECT_COMPONENT;
  public prodStatusDropDownLaunchOf = FieldTypeConstant.PROD_STATUS_DROPDOWN;
    public prodArticleDropDownLaunchOf = FieldTypeConstant.PROD_ARTICLE_DROPDOWN;
  /**
   * List of claim types to be shown in case we filter by type in claim list
   */
  public claimTypeDropdownSource: Array<ClaimType>;
  public isMovementDoc = false;
  public selectedOperator = NumberConstant.ZERO;
  public selectedIdWarehouse = NumberConstant.ZERO;
  public priceStateDataSource = [];
  public priceTypeDataSource = [];
  public claimStatusDataSource = [];
  public exitEmployeeStatusDataSource = [];
  public recruitmentRequestStateDataSource = [];
  public recruitmentOfferStateDataSource = [];
  public recruitmentStateDataSource = [];
  exitReasonStatus = ExitEmployeeStatusEnum;
  recruitmentRequestState = RecruitmentRequestStateEnumerator;
  recruitmentOfferState = RecruitmentOfferStatus;
  recruitmentState = RecruitmentState;
  /**
   *
   * @param translate
   * @param claimTypeServices
   * @param shelfService
   * @param viewRef
   */

  public currentFiscalYearStartDate = new Date();
  public currentFiscalYearEndDate = new Date();

  public formatDateAcc = this.translate.instant(SharedConstant.DATE_FORMAT);
  public invoicingTypeEnum ;
  public invoicingDataSource : any;

  constructor(private translate: TranslateService, public claimTypeServices: ClaimTypeService, private shelfService: ShelfService,
              public viewRef: ViewContainerRef, private sessionService: SessionService, public datepipe: DatePipe,
              public accountingConfigurationService: AccountingConfigurationService) {
    this.createFiltreFormGroup();
    this.preparePriceStateDropdown();
    this.preparePriceTypeDropdown();
    this.prepareClaimStatusDropdown();
    this.prepareExitEmployeeStatusDropdown();
    this.prepareAdministrativeStateDropdown();
    this.prepareRecruitmentOfferStateDropdown();
    this.prepareRecruitmentStateDropdown();
  }

  private createFiltreFormGroup() {
    this.formGroupFilter = new FormGroup({
      Status: new FormControl(),
      IdTiers: new FormControl(),
      IdSettlementMode: new FormControl(),
      IdItem: new FormControl(),
      IdWarehouse: new FormControl(),
      IdShelfSource: new FormControl(),
      IdShelfDestination: new FormControl(),
      IdNature: new FormControl(),
      IdBank: new FormControl(),
      State: new FormControl(),
      IdPaymentStatus: new FormControl(),
      IdVehicle: new FormControl(),
      IdInterventionState: new FormControl(),
      IdVehicleModel: new FormControl(),
      IdGarage: new FormControl(),
      IdRepairOrderState: new FormControl(),
      DocumentCode: new FormControl(),
      planId: new FormControl(),
      IdEmployee: new FormControl(),
      CreditType: new FormControl(),
      IdPaymentMethod: new FormControl(),
      IdTaxeGroupTiers: new FormControl(),
      IdCountry: new FormControl(),
      ProjectType: new FormControl(),
      IdCity: new FormControl(),
      IdCurrency: new FormControl(),
      isActif: new FormControl(),
      priceType: new FormControl(),
      claimStatus: new FormControl(),
      Type: new FormControl(),
      IdSourceCash: new FormControl(),
      IdDestinationCash: new FormControl(),
      IdContractType: new FormControl(),
      IdSalaryStructure: new FormControl(),
      IdExitReason: new FormControl(),
      IdDocumentRequestType: new FormControl(),
      Priority: new FormControl(),
      IdJob: new FormControl(),
      IdCandidate: new FormControl(),
      IdTierCategory: new FormControl(),
      crmDropdown: new FormControl(),
      productionOfStatusDropdown: new FormControl(),
      productionOfArticleDropdown: new FormControl(),
      invoicingType : new FormControl(),
      IdUser : new FormControl()
    });
  }

  /**
   * init operations list by enums
   * @private
   */
  private initFiltrePredicateOperations() {
    switch (this.type) {
      case FieldTypeConstant.TEXT_TYPE:
        this.filtreOperations = EnumValues.getNamesAndValues(OperationTypeString);
        break;
      case FieldTypeConstant.paymentSlipStatusComponent:
      case FieldTypeConstant.paymentStatusComponent:
      case FieldTypeConstant.sessionStateComponent:
      case FieldTypeConstant.transferOderStateComponent:
      case FieldTypeConstant.trimesterComponent:
      case FieldTypeConstant.planCodeComponent:
      case FieldTypeConstant.closingStateComponent:
      case FieldTypeConstant.journalComponent:
      case FieldTypeConstant.loanStateComponent:
      case FieldTypeConstant.paymentMethodeComponent:
      case FieldTypeConstant.NUMBER_TYPE:
      case FieldTypeConstant.numerictexbox_type:
        this.filtreOperations = EnumValues.getNamesAndValues(OperationTypeNumber);
        break;
      case FieldTypeConstant.DATE_MONTH_TYPE:
      case FieldTypeConstant.DATE_YEAR_TYPE:
      case FieldTypeConstant.DATE_YEAR_SOURCEDEDUCTION_TYPE:
      case FieldTypeConstant.DATE_TYPE:
      case FieldTypeConstant.DAY_DATE_TYPE:
      case FieldTypeConstant.inputTypeRefundStartDate:
        this.filtreOperations = EnumValues.getNamesAndValues(OperationTypeDate);
        break;
      case FieldTypeConstant.PROD_ARTICLE_TEXT:
      case FieldTypeConstant.PROD_ARTICLE_DROPDOWN:
      case FieldTypeConstant.PROD_STATUS_DROPDOWN:
        this.filtreOperations = EnumValues.getNamesAndValues(OperationProdTypeString);
        break;
      case TypeConstant.claimTypeDropDown:
      case FieldTypeConstant.invoiceTypeDropdownComponent:
      case FieldTypeConstant.itemDropDownComponent:
      case FieldTypeConstant.claim_type_dropdown:
      case FieldTypeConstant.warehouseTypeDropdownComponent:
      case FieldTypeConstant.storageSourceDropdownComponent:
      case FieldTypeConstant.storageDestinationDropdownComponent:
      case FieldTypeConstant.documentTypeDropdownComponent:
      case FieldTypeConstant.natureDropdownComponent:
      case FieldTypeConstant.cnssDropdownComponent:
      case FieldTypeConstant.CREDIT_TYPE_DROPDOWN:
      case FieldTypeConstant.TAXE_GROUP_TIERS_DROPDOWN:
      case FieldTypeConstant.COUNTRY_COMPONENT_DROPDOWN:
      case FieldTypeConstant.PROJECT_DROPDOWN_COMPONENT:
      case FieldTypeConstant.BILLING_SESSION_DROPDOWN:
      case FieldTypeConstant.CITY_DROPDOWN_COMPONENT:
      case FieldTypeConstant.CURRENCY_DROPDOWN_COMPONENT:
      case FieldTypeConstant.REGISTRATION_NUMBER_OF_VEHICLE_DROPDWON_COMPONENT:
      case FieldTypeConstant.VEHICLE_MODEL_DROPDOWN_COMPONENT:
      case FieldTypeConstant.INTERVENTION_STATE_DROPDOWN_COMPONENT:
      case FieldTypeConstant.FUNDS_TRANSFER_TYPE_DROPDOWN_COMPONENT:
      case FieldTypeConstant.FUNDS_TRANSFER_STATE_DROPDOWN_COMPONENT:
      case FieldTypeConstant.CASH_REGISTER_SOURCE_DROPDOWN_COMPONENT:
      case FieldTypeConstant.CASH_REGISTER_DESTINATION_DROPDOWN_COMPONENT:
      case FieldTypeConstant.CONTRACT_TYPE_DROPDOWN_COMPONENT:
      case FieldTypeConstant.PRIORITY_DROPDOWN_COMPONENT:
      case FieldTypeConstant.employeeDropdownComponent:
      case FieldTypeConstant.JOB_DROPDOWN_COMPONENT:
      case FieldTypeConstant.RECRUITMENT_OFFER_STATE_DROPDOWN_COMPONENT:
      case FieldTypeConstant.RECRUITMENT_STATE_DROPDOWN_COMPONENT:
      case FieldTypeConstant.RECRUITMENT_REQUEST_STATE_DROPDOWN:
      case FieldTypeConstant.CANDIDATE_DROPDOWN_COMPONENT:
      case FieldTypeConstant.SALARY_STRUCTURE_DROPDOWN_COMPONENT:
      case FieldTypeConstant.CONTRACT_STATE_DROPDOWN:
      case FieldTypeConstant.EXIT_REASON_DROPDOWN_COMPONENT:
      case FieldTypeConstant.EXIT_EMPLOYEE_STATUS_COMPONENT:
      case FieldTypeConstant.documentStatusComponent:
      case FieldTypeConstant.priceState:
      case FieldTypeConstant.priceType:
      case FieldTypeConstant.customerComponent:
      case FieldTypeConstant.supplierComponent:
      case FieldTypeConstant.purchaseRequestDropdownComponent:
      case FieldTypeConstant.bankDropdownComponent:
      case FieldTypeConstant.CRM_DROPDOWN_MULTISELECT_COMPONENT:
      case FieldTypeConstant.CATEGORY_COMPONENT_DROPDOWN:
      case FieldTypeConstant.userDropdownComponent:
        this.filtreOperations = EnumValues.getNamesAndValues(OperationDropDown);
        break;
      case FieldTypeConstant.BOOLEAN:
        this.filtreOperations = EnumValues.getNamesAndValues(OperationBoolean);
        break;
      case FieldTypeConstant.DATE_TYPE_ACC:
        this.filtreOperations = EnumValues.getNamesAndValues(OperationTypeDateAcc);
        break;
      case FieldTypeConstant.MONTH:
      case FieldTypeConstant.TEAM_MULTISELECT_COMPONENT:
      case FieldTypeConstant.EMPLOYEE_MULTISELECT_COMPONENT:
        this.filtreOperations = EnumValues.getNamesAndValues(OperationBoolean);
        break;
      default:
        this.filtreOperations = EnumValues.getNamesAndValues(Operation);
        break;
    }
    this.translateFiltreOperations();
  }

  /**
   * prepare filtre by filtre type(specific/Non specific)
   * operation with type between (date ) --> enumValue = 10
   * @param operator
   */
  handleFiltreOperatorChange(operator) {
    this.selectedOperator = operator;
    this.filtreOperation = operator;
    if (this.isSpecificFiltre) {
      this.prepareSpecificFiltre();
    } else if (this.isTypeDateAndOpertBetw(operator)) {
      this.prepareFiltreFieldTypeDateAndOperationBetween();
    } else {
      this.prepareNonSpecificFiltre();
    }
    if (!this.filtreOperation) {
      this.resetFiltreValues();
    }
  }

  private isTypeDateAndOpertBetw(operator) {
    return (this.type === this.inputTypeDate || this.type === this.inputTypeMonthDate || this.type === this.inputTypeYearDate || this.type === this.inputTypeDayDate
      || this.type === this.inputTypeYearSourceDeduction || this.type === this.inputTypeRefundStartDate) && operator === OperationTypeDate.betw;
  }

  /**
   * prepare SpecificFiltre to send
   * @private
   */
  private prepareSpecificFiltre() {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Filter.push(new Filter(this.filtreProp, this.filtreOperation, this.filtreValue));
    const specificFiltre: SpecFilter = new SpecFilter(this.module, this.model,
      this.propertyOfParentEntity, myPredicate, this.filtreProp);
    const predicateToSend = {[SPECIFIC_FILTRE]: specificFiltre, [SPECIFIC_FILTRE_TO_DELETE]: false};
    if (!isNotNullOrUndefinedAndNotEmptyValue(this.filtreOperation) ||
      !isNotNullOrUndefinedAndNotEmptyValue(this.filtreValue)) {
      predicateToSend.SpecificFiltreToDelete = true;
    }
    this.filtreOperatorEvent.emit(predicateToSend);
  }

  /**
   * prepare NonSpecificFiltre to send
   * @private
   */
  private prepareNonSpecificFiltre() {
    this.isBetweenFiltreType = false;
    this.filtreValue = new Date(Date.UTC(this.filtreValue.getFullYear(), this.filtreValue.getMonth(), this.filtreValue.getDate()));
    const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, this.filtreValue);
    this.filtreOperatorEvent.emit(filterToSend);
    this.filtreValueResetEvent.emit(false);
  }

  /**
   * prepare filtre type date  (operation between 2 dates) to send
   * @private
   */
  private prepareFiltreFieldTypeDateAndOperationBetween() {
    this.isBetweenFiltreType = true;
    const filterGteToSend: Filter = new Filter(this.columnName, NumberConstant.SEVEN,
      this.filtreGteValue ? this.filtreValue = new Date(Date.UTC(this.filtreGteValue.getFullYear(), this.filtreGteValue.getMonth(), this.filtreGteValue.getDate())) : null, false, false, true);
    const filterLteToSend: Filter = new Filter(this.columnName, NumberConstant.NINE,
      this.filtreLteValue ? this.formatDate(new Date(Date.UTC(this.filtreLteValue.getFullYear(), this.filtreLteValue.getMonth(), this.filtreLteValue.getDate())) ) : undefined, false, false, true);
    const filters: Filter[] = [filterLteToSend, filterGteToSend];
    this.filtreOperatorEvent.emit({[IS_DATE_FILTRE_BETWEEN]: true, [PROP]: this.columnName, [FILTRES]: filters});
  }

  /**
   * on filtre value changes
   */
  handleFiltreValueChange(isBetweenFiltreType?) {
    if (isBetweenFiltreType) {
      this.prepareFiltreFieldTypeDateAndOperationBetween();
    } else if (this.isSpecificFiltre) {
      this.prepareSpecificFiltre();
    } else {
      this.prepareNonSpecificFiltre();
    }
  }

  handleDateFilterAcc(valueDate) {
    const valueDateFYFormatted = this.datepipe.transform(valueDate, 'yyyy-MM-dd');
    this.filtreValue = valueDateFYFormatted;
    this.prepareNonSpecificFiltre();
  }

  /**
   * on mouseOut blur the input filtre
   * @param inputDate
   */
  handleFiltreForResetValue(inputDate?) {
    if (inputDate) {
      this.inputDate.forEach(item => {
        item.blur();
      });
    } else {
      this.inputText.nativeElement.blur();
    }
    this.filtreValueResetEvent.emit(false);
  }

  /**
   * translate filtre operations
   * @private
   */
  private translateFiltreOperations() {
    this.filtreOperations = this.filtreOperations.map((filtreOperator) => {
      filtreOperator.name = this.translate.instant(filtreOperator.name.toUpperCase());
      return filtreOperator;
    });
  }

  /**
   * To be used when we filter by type
   * @param $event
   */
  public onClaimTypeFilterChange($event) {
    if ($event) {
      const value = this.getClaimTypeSelectedValue($event.ExternalDataSource, $event.ClaimTypeSelected);
      const filterLteToSend: Filter = new Filter(this.columnName, this.filtreOperation, value);
      this.filtreOperatorEvent.emit(filterLteToSend);
    }
    this.filtreValueResetEvent.emit(false);
  }

  private getListOfClaimTypes() {
    this.claimTypeServices.listdropdown().subscribe(
      (data: any) => {
        this.claimTypeDropdownSource = new Array<ClaimType>();
        this.claimTypeDropdownSource = data.listData;
        this.claimTypeDropdownSource.forEach(x => {
          x.CodeType = x.TranslationCode;
          x.TranslationCode = this.translate.instant(x.TranslationCode);
        });
      });
  }

  private getClaimTypeSelectedValue(claimTypeDropdownSource: any[], ClaimTypeSelected): string {
    return claimTypeDropdownSource.find(claim => claim.Type === ClaimTypeSelected).CodeType;
  }

  /**
   * reset the filtre values
   * @private
   */
  private resetFiltreValues() {
    this.resetComboBoxValues();
    this.filtreValue = SharedConstant.EMPTY;
    this.filtreGteValue = SharedConstant.EMPTY;
    this.filtreLteValue = SharedConstant.EMPTY;
  }

  getDocumentStatus(selectedStatus) {
    this.filtreValue = selectedStatus;
    this.prepareNonSpecificFiltre();
  }

  getSelectedTiers(selectedTiers) {
    this.filtreValue = selectedTiers.IdTiers.value;
    this.prepareNonSpecificFiltre();
  }

  getSelectedInvoiceType(selectedInvoiceType) {
    this.filtreValue = selectedInvoiceType;
    this.prepareNonSpecificFiltre();
  }

  getSelectedBank(SelectedBank) {
    this.filtreValue = SelectedBank.Id;
    this.prepareNonSpecificFiltre();
  }

  getSelectedItem(selectedIdItem) {
    if (selectedIdItem) {
      this.filtreValue = selectedIdItem.itemForm.value.IdItem;
      this.prepareSpecificFiltre();
    }
  }

  getWarehouseSelect(selectedWharehouse) {
    if (selectedWharehouse.combobox && selectedWharehouse.combobox.dataItem) {
      this.filtreValue = selectedWharehouse.combobox.dataItem.Id;
      this.shelfService.idWarehouseChange.next(this.filtreValue);
    } else {
      this.filtreValue = undefined;
      this.shelfService.idWarehouseChange.next(this.filtreValue);
    }
    this.prepareNonSpecificFiltre();
  }

  getStorageSelect(selectedStorage) {
    if (selectedStorage) {
      this.filtreValue = selectedStorage;
    }
    this.prepareNonSpecificFiltre();
  }

  getSelectedDocumentCode(selectedDocumentCode) {
    this.filtreValue = selectedDocumentCode.selectedValue;
    this.prepareNonSpecificFiltre();
  }

  getSelectedNature(selectedNature) {
    if (selectedNature) {
      this.filtreValue = selectedNature;
    }
    this.prepareNonSpecificFiltre();
  }

  vehicleRegistrationNumberValueChange(registrationNumberSelected) {
    this.filtreValue = registrationNumberSelected ? registrationNumberSelected.RegistrationNumber : undefined;
    this.prepareNonSpecificFiltre();
  }

  interventionOrderValueChanged(interventionOrderSelected) {
    this.filtreValue = interventionOrderSelected ? interventionOrderSelected.value : undefined;
    this.prepareNonSpecificFiltre();
  }

  repairOrderValueChanged(repairOrderSelected) {
    this.filtreValue = repairOrderSelected ? repairOrderSelected.value : undefined;
    this.prepareNonSpecificFiltre();
  }

  garageValueChanged(garageSelected) {
    this.filtreValue = garageSelected ? garageSelected.Id : undefined;
    this.prepareNonSpecificFiltre();
  }

  interventionLoanVehicleStatusValueChanged(loanVehicleStatusSelected) {
    this.filtreValue = loanVehicleStatusSelected ? loanVehicleStatusSelected.value : undefined;
    this.prepareNonSpecificFiltre();
  }

  vehicleModelValueChanged(vehicleModelSelected) {
    this.filtreValue = vehicleModelSelected ? vehicleModelSelected.Id : undefined;
    this.prepareNonSpecificFiltre();
  }

  getFilterLTEValueDate(): Date {
    if (isNotNullOrUndefinedAndNotEmptyValue(this.filtreLteValue)) {
      return new Date(this.filtreLteValue);
    }
  }

  getFilterGTEValueDate(): Date {
    if (isNotNullOrUndefinedAndNotEmptyValue(this.filtreGteValue)) {
      return new Date(this.filtreGteValue);
    }
  }

  getPaymentSlipStatus(selectesStatus) {
    if (selectesStatus) {
      this.filtreValue = selectesStatus;
    }
    this.prepareNonSpecificFiltre();
  }

  getSelectedPaymentStatus(selectesStatus) {
    if (selectesStatus) {
      this.filtreValue = selectesStatus;
    }
    this.prepareNonSpecificFiltre();
  }

  /**
   * Accounting Component
   */
  public getplanParent(selectedValue) {
    this.filtreValue = selectedValue;
    this.prepareNonSpecificFiltre();
  }

  public getBooleanValue(selectedBooleanValue) {
    if (selectedBooleanValue) {
      this.filtreValue = selectedBooleanValue;
    }
    this.prepareNonSpecificFiltre();
  }

  public getClosingState(closingState) {
    if (closingState) {
      this.filtreValue = closingState.value;
    } else {
      this.filtreValue = undefined;
    }

    this.prepareNonSpecificFiltre();
  }

  getSelectedJournalValue(selectedjournal) {
    if (isNotNullOrUndefinedAndNotEmptyValue(selectedjournal)) {
      this.filtreValue = selectedjournal.id;
    } else {
      this.filtreValue = undefined;
    }
    this.prepareNonSpecificFiltre();
  }

  getSelectedStatusAccountedValue(selectedAccounted) {
    this.filtreValue = selectedAccounted;
    this.prepareNonSpecificFiltre();
  }

  getSelectedPaymentMethodeValue(selectedPaymentMethod) {
    this.filtreValue = selectedPaymentMethod.Id;
    this.prepareNonSpecificFiltre();
  }

  getTransferTypeData(selectedTransferType) {
    this.filtreValue = selectedTransferType;
    this.prepareNonSpecificFiltre();
  }

  getTransferStateData(selecetedStatus) {
    this.filtreValue = selecetedStatus;
    this.prepareNonSpecificFiltre();
  }

  getSourceCashData(selectedSource) {
    this.filtreValue = selectedSource;
    this.prepareNonSpecificFiltre();
  }

  getDestinationCashData(selectedDestination) {
    this.filtreValue = selectedDestination;
    this.prepareNonSpecificFiltre();
  }

  /**
   *
   * @param selectedDate
   */
  handleDateFiltreValueChange(selectedDate) {
    if (this.filtreValue) {
      this.filtreValue = new Date(Date.UTC(this.filtreValue.getFullYear(), this.filtreValue.getMonth(), this.filtreValue.getDate()));
    }
    this.isDateTypeAndOperatorEq();
    this.isDateAndOperatorLtOrGt();
    if (!selectedDate) {
     // selectedDate = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, selectedDate);
      this.filtreOperatorEvent.emit(filterToSend);
    }
    this.filtreValueResetEvent.emit(false);
  }

  private isDateTypeAndOperatorEq() {
    if (this.filtreOperation === Operation.eq) {
      const filtreGtToSend = this.filtreValue ? new Date(this.filtreValue) : null;
      let filtreLtToSend = this.filtreValue ? new Date(this.filtreValue) : null;
      filtreLtToSend = filtreLtToSend ? this.formatDate(filtreLtToSend) : undefined;
      const filterGteToSend: Filter = new Filter(this.columnName, NumberConstant.SEVEN, filtreGtToSend, false, false, true);
      const filterLteToSend: Filter = new Filter(this.columnName, NumberConstant.NINE, filtreLtToSend, false, false, true);
      const filters: Filter[] = [filterLteToSend, filterGteToSend];
      this.filtreOperatorEvent.emit({[IS_DATE_FILTRE_BETWEEN]: true, [PROP]: this.columnName, [FILTRES]: filters});
    }
  }

  private isDateAndOperatorLtOrGt() {
    let dateToSend = this.filtreValue ? new Date(this.filtreValue) : null;
    dateToSend = dateToSend ? this.formatDate(dateToSend) : undefined;
    if (this.filtreOperation === Operation.lt || this.filtreOperation === Operation.gt) {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, dateToSend);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  /**
   * set date hours,minutes,secondes
   * @param dateToSend
   * @private
   */
  private formatDate(dateToSend: Date): Date {
    dateToSend.setHours(NumberConstant.TWENTY_THREE);
    dateToSend.setMinutes(NumberConstant.FIFTY_NINE);
    dateToSend.setSeconds(NumberConstant.FIFTY_NINE);
    return dateToSend;
  }

  private resetComboBoxValues() {
    switch (this.type) {
      case FieldTypeConstant.documentStatusComponent:
        this.documentStatusDropdownComponent ? this.documentStatusDropdownComponent.documentStatusComboBoxComonent.reset() : '';
        break;
      case FieldTypeConstant.customerComponent:
      case FieldTypeConstant.supplierComponent:
      case FieldTypeConstant.tiersComponentType:
        this.supplierDropdownComponent ? this.supplierDropdownComponent.resetTiersComboBox() : '';
        break;
      case FieldTypeConstant.purchaseRequestDropdownComponent:
        this.purchaseRequestStatusDropdownComponent ? this.purchaseRequestStatusDropdownComponent.purchaseRequestStatusComponent.reset() : '';
        break;
      case FieldTypeConstant.invoiceTypeDropdownComponent:
        this.settlementModeDropDownComponent ? this.settlementModeDropDownComponent.settlementComboBoxComponent.reset() : '';
        break;
      case FieldTypeConstant.itemDropDownComponent:
        this.itemDropdownComponent ? this.itemDropdownComponent.itemComponent.reset() : '';
        break;
      case FieldTypeConstant.warehouseTypeDropdownComponent:
        this.depotDropdownComponent ? this.depotDropdownComponent.depotComboBoxComponent.reset() : '';
        break;
      case FieldTypeConstant.claim_type_dropdown:
        this.claimTypeDropdownComponent ? this.claimTypeDropdownComponent.typeComboBox.reset() : '';
        break;
      case FieldTypeConstant.storageSourceDropdownComponent:
      case FieldTypeConstant.storageDestinationDropdownComponent:
        this.shelfStorageDropdownComponent ? this.shelfStorageDropdownComponent.shelfComboBoxComponent.reset() : '';
        break;
      case FieldTypeConstant.documentTypeDropdownComponent:
        this.documentTypeDropdownComponent ? this.documentTypeDropdownComponent.documentTypeComboBox.reset() : '';
        break;
      case FieldTypeConstant.bankDropdownComponent:
        this.bankDropdownComponent.bankComboBoxComponent.reset();
        break;
      case FieldTypeConstant.paymentSlipStatusComponent:
        this.paymentSlipStatusDropdownComponent.statusSlipComboBoxComponent.reset();
        break;
      case FieldTypeConstant.paymentStatusComponent:
        this.paymentStatusDropdownComponent.statusComboBoxComponent.reset();
        break;
      case FieldTypeConstant.REGISTRATION_NUMBER_OF_VEHICLE_DROPDWON_COMPONENT:
        this.registrationNumberOfVehicleDropdwonComponent ?
          this.registrationNumberOfVehicleDropdwonComponent.resetRegistrationNumberComboBox() : '';
        break;
      case FieldTypeConstant.INTERVENTION_STATE_DROPDOWN_COMPONENT:
        this.interventionStateDropdownComponent ? this.interventionStateDropdownComponent.resetInterventionOrderStateComboBox() : '';
        break;
      case FieldTypeConstant.REPAIR_ORDER_STATE_DROPDOWN_COMPONENT:
        this.repairOrderStateDropdownComponent ? this.repairOrderStateDropdownComponent.resetRepairOrderStateComboBox() : '';
        break;
      case FieldTypeConstant.INTERVENTION_LOAN_VEHICLE_STATUS_DROPDOWN_COMPONENT:
        this.interventionLoanVehicleStatusDropdownComponent ?
          this.interventionLoanVehicleStatusDropdownComponent.resetLoanComboBox() : '';
        break;
      case FieldTypeConstant.GARAGE_DROPDOWN_COMPONENT:
        this.garageDropdownComponent ?
          this.garageDropdownComponent.reset() : '';
        break;
      case FieldTypeConstant.VEHICLE_MODEL_DROPDOWN_COMPONENT:
        this.vehicleModelDropdownComponent ? this.vehicleModelDropdownComponent.resetVehicleModelComboBox() : '';
        break;
      case FieldTypeConstant.planCodeComponent:
        this.parentPlanDropdownComponent ? this.parentPlanDropdownComponent.parentPlan.reset() : '';
        break;
      case FieldTypeConstant.BOOLEAN:
        this.booleanFilterDropDownComponent ? this.booleanFilterDropDownComponent.booleanFilter.reset() : '';
        break;
      case FieldTypeConstant.closingStateComponent:
        this.closingStateComponent ? this.closingStateComponent.closingState.reset() : '';
        break;
      case FieldTypeConstant.journalComponent:
        this.JournalDropdownComponent ? this.JournalDropdownComponent.journalComponent.reset() : '';
        break;
      case FieldTypeConstant.COUNTRY_COMPONENT_DROPDOWN:
        this.CountryDropdownComponent ? this.CountryDropdownComponent.country.reset() : '';
      case FieldTypeConstant.CATEGORY_COMPONENT_DROPDOWN:
        this.TierCategoryDropdownComponent ? this.TierCategoryDropdownComponent.tierCategoryComboBoxComponent.reset() : '';
        break;
      case FieldTypeConstant.paymentMethodeComponent:
        this.paymentDropdownComponent ? this.paymentDropdownComponent.paymentDropdownComponentComboBox.reset() : '';
        break;
      case FieldTypeConstant.TAXE_GROUP_TIERS_DROPDOWN:
        this.TaxeGroupTiersComponent ? this.TaxeGroupTiersComponent.taxe.reset() : '';
        break;
      case FieldTypeConstant.BILLING_SESSION_DROPDOWN:
        this.StatusDropdownComponent ? this.StatusDropdownComponent.status.reset() : '';
        break;
      case FieldTypeConstant.PROJECT_DROPDOWN_COMPONENT:
        this.projectTypeComponent ? this.projectTypeComponent.project.reset() : '';
        break;
      case FieldTypeConstant.CITY_DROPDOWN_COMPONENT:
        this.CityDropdownComponent ? this.CityDropdownComponent.city.reset() : '';
        break;
      case FieldTypeConstant.CURRENCY_DROPDOWN_COMPONENT:
        this.CurrencyDropdownComponent ? this.CurrencyDropdownComponent.comboboxComponent.reset() : '';
        break;
      case FieldTypeConstant.employeeDropdownComponent:
        this.EmployeeDropdownComponent ? this.EmployeeDropdownComponent.comboboxComponent.reset() : '';
        break;
      case FieldTypeConstant.FUNDS_TRANSFER_TYPE_DROPDOWN_COMPONENT:
        this.FundsTransferTypeDropdownComponent ? this.FundsTransferTypeDropdownComponent.transferType.reset() : '';
        break;
      case FieldTypeConstant.FUNDS_TRANSFER_STATE_DROPDOWN_COMPONENT:
        this.FundsTransferStateDropdownComponent ? this.FundsTransferStateDropdownComponent.status.reset() : '';
        break;
      case FieldTypeConstant.CASH_REGISTER_SOURCE_DROPDOWN_COMPONENT:
        this.CashRegisterSourceDropdownComponent ? this.CashRegisterSourceDropdownComponent.sourceCash.reset() : '';
        break;
      case FieldTypeConstant.CASH_REGISTER_DESTINATION_DROPDOWN_COMPONENT:
        this.CashRegisterDestinationDropdownComponent ? this.CashRegisterDestinationDropdownComponent.destinationCash.reset() : '';
        break;
      case FieldTypeConstant.CONTRACT_TYPE_DROPDOWN_COMPONENT:
        this.ContractTypeDropdownComponent ? this.ContractTypeDropdownComponent.contractTypeDropdownComponent.reset() : '';
        break;
      case FieldTypeConstant.SALARY_STRUCTURE_DROPDOWN_COMPONENT:
        this.SalaryStructureDropdownComponent ? this.SalaryStructureDropdownComponent.salaryStructureDropdownComponent.reset() : '';
        break;
      case FieldTypeConstant.EXIT_REASON_DROPDOWN_COMPONENT:
        this.ExitReasonDropdownComponent ? this.ExitReasonDropdownComponent.exitReasonDropdownComponent.reset() : '';
        break;
      case FieldTypeConstant.DOCUMENT_REQUEST_TYPE_DROPDOWN_COMPONENT:
        this.DocumentRequestTypeDropdownComponent ?
          this.DocumentRequestTypeDropdownComponent.documentRequestTypeDropdownComponent.reset() : '';
        break;
      case FieldTypeConstant.PRIORITY_DROPDOWN_COMPONENT:
        this.PriorityDropdwonComponent ? this.PriorityDropdwonComponent.priorityDropdownComponent.reset() : '';
        break;
      case FieldTypeConstant.JOB_DROPDOWN_COMPONENT:
        this.JobDropdownComponent ? this.JobDropdownComponent.jobDropdownComponent.reset() : '';
        break;
      case FieldTypeConstant.CANDIDATE_DROPDOWN_COMPONENT:
        this.CandidateDropdownComponent ? this.CandidateDropdownComponent.comboboxComponent.reset() : '';
        break;
      case FieldTypeConstant.TEAM_MULTISELECT_COMPONENT:
        this.TeamMultiselectComponent ? this.TeamMultiselectComponent.selectedValueMultiSelect = [] : '';
        break;
      case FieldTypeConstant.EMPLOYEE_MULTISELECT_COMPONENT:
        this.EmployeeMultiselectComponent ? this.EmployeeMultiselectComponent.selectedValueMultiSelect = [] : '';
        break;
      case FieldTypeConstant.CRM_DROPDOWN_MULTISELECT_COMPONENT:
        if ( this.CrmDropdownComponent !== undefined ) {
        this.CrmDropdownComponent.comboboxComponent.reset(); }
        break;
      case FieldTypeConstant.PROD_STATUS_DROPDOWN:
        this.launchOfStatusDropdownComponent ? this.launchOfStatusDropdownComponent.ofStatusDropdownComponent.reset() : '';
        break;
      case FieldTypeConstant.PROD_ARTICLE_DROPDOWN:
        this.launchOfArticleDropdownComponent ? this.launchOfArticleDropdownComponent.ofArticleDropdownComponent.itemComponent.reset() : '';
        break;
      case FieldTypeConstant.userDropdownComponent:
        this.UserDropdownComponent ? this.UserDropdownComponent.comboboxComponent.reset() : '';
        break;
    }
  }


  loadListSessionDefaultDateValue() {
    this.isBetweenFiltreType = true;
    this.selectedOperator = OperationTypeDate.betw;
    this.subscription = this.sessionService.defaultStartEndDateSearchSession.subscribe(data => {
      this.filtreValue = new Date(data[0].getFullYear(), NumberConstant.ZERO, NumberConstant.SHIFT_FIRST_DATE);
      this.filtreGteValue = new Date(data[0].getFullYear(), NumberConstant.ZERO, NumberConstant.SHIFT_FIRST_DATE);
      this.filtreLteValue = new Date(data[1].getFullYear(), NumberConstant.TWELVE, NumberConstant.ZERO);
    });
  }

  loadFiscalYearDateValue() {
    this.isBetweenFiltreType = true;
    this.selectedOperator = OperationTypeDate.betw;
    this.subscription = this.accountingConfigurationService.getJavaGenericService().getData(
      AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL).subscribe(data => {
      this.currentFiscalYearStartDate = new Date(data.startDate);
      this.currentFiscalYearEndDate = new Date(data.endDate);
    });
  }

  loadlistCnssDeclarationYear() {
    this.subscription = this.sessionService.defaultStartEndDateSearchSession.subscribe(data => {
      this.filtreValue = new Date(data[0].getFullYear(), NumberConstant.ZERO, NumberConstant.SHIFT_FIRST_DATE);
    });
  }

  ngOnDestroy() {
    if ((this.type === FieldTypeConstant.DATE_MONTH_TYPE || this.type === FieldTypeConstant.DATE_YEAR_TYPE
      || this.type === FieldTypeConstant.DATE_YEAR_SOURCEDEDUCTION_TYPE || this.type === FieldTypeConstant.MONTH)
      && this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    if (this.type === FieldTypeConstant.DATE_MONTH_TYPE || this.type === FieldTypeConstant.DATE_YEAR_SOURCEDEDUCTION_TYPE) {
      this.loadListSessionDefaultDateValue();
    }
    if (this.type === FieldTypeConstant.DATE_YEAR_TYPE) {
      this.loadlistCnssDeclarationYear();
    }
    if (this.type === FieldTypeConstant.DATE_TYPE_ACC) {
      this.loadFiscalYearDateValue();
    }
    if (this.type === FieldTypeConstant.MONTH) {
      this.selectedOperator = OperationTypeDate.eq;
    }
    this.initFiltrePredicateOperations();
    if (this.type === this.claimTypeDropDown) {
      this.getListOfClaimTypes();
    }
    if (this.type === FieldTypeConstant.DAY_DATE_TYPE) {
      this.isBetweenFiltreType = true;
      this.selectedOperator = OperationTypeDate.betw;
    }
    if (this.type === FieldTypeConstant.TEXT_TYPE) {
      this.filtreOperation = Operation.contains;
    }
    if (this.type === FieldTypeConstant.PROD_STATUS_DROPDOWN) {
      this.filtreOperation = Operation.contains;
    }
    if(this.type == FieldTypeConstant.invoiceTypeDropdownComponent){
      this.invoicingDataSource = [];
       this.invoicingTypeEnum = EnumValues.getNamesAndValues(InvoicingTypeEnumerator);
      this.invoicingTypeEnum.forEach(element => {
        const elem = element;
        elem.name = this.translate.instant(elem.name.toUpperCase());
        this.invoicingDataSource.push(elem);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetFiltreValues();
    if (changes.documentType && changes.documentType.currentValue === DocumentEnumerator.StockTransfert ||
      changes.filtreValuePlaceHolder && changes.filtreValuePlaceHolder.currentValue === DocumentEnumerator.StockTransfert) {
      this.isMovementDoc = true;
    }
  }

  // Set the selected trimesters
  selectedTrimester(selectedTrimesters) {
    if (selectedTrimesters) {
      this.filtreValue = selectedTrimesters;
    }
    this.prepareNonSpecificFiltre();
  }

  public selectedEmployee() {
    const employeeId = this.formGroupFilter.controls[LoanConstant.ID_EMPLOYEE].value;
    if (employeeId) {
      this.filtreValue = employeeId;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  public getSelectedUser() {
    const userId = this.formGroupFilter.controls[ComponentsConstant.ID_USER].value;
    if (userId) {
      this.filtreValue = userId;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }


  getSelectedSessionState(selectesState) {
    if (selectesState && selectesState === NumberConstant.FIVE && this.type === FieldTypeConstant.loanStateComponent) {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    } else {
      this.filtreValue = selectesState;
      this.prepareNonSpecificFiltre();
    }
  }

  selectedCnssType(selectedCnssType) {
    if (selectedCnssType) {
      this.filtreValue = selectedCnssType.Label;
    }
    this.prepareNonSpecificFiltre();
  }

  selectedCreditType(selectedCreditType) {
    if (selectedCreditType && selectedCreditType !== NumberConstant.THREE) {
      this.filtreValue = selectedCreditType;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  getSelectedTaxeGroup() {
    const grpTaxeId = this.formGroupFilter.controls['IdTaxeGroupTiers'].value;
    if (grpTaxeId) {
      this.filtreValue = grpTaxeId;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  getSelectedCountry() {
    const countryId = this.formGroupFilter.controls['IdCountry'].value;
    this.filtreValue = countryId;
    if (this.isSpecificFiltre) {
      this.prepareSpecificFiltre();
    } else {
      this.prepareNonSpecificFiltre();
    }
    this.handleOtherFilterEvent.emit({filter: 'cityDropdownComponent', value: countryId});
  }

  getSelectedCity() {
    const cityId = this.formGroupFilter.controls['IdCity'].value;
    this.filtreValue = cityId;
    if (this.isSpecificFiltre) {
      this.prepareSpecificFiltre();
    } else {
      this.prepareNonSpecificFiltre();
    }
    this.handleOtherFilterEvent.emit({filter: 'countryDropdownComponent', value: cityId});
  }

  getSelectedCategory() {
    const IdTierCategory = this.formGroupFilter.controls['IdTierCategory'].value;
    this.filtreValue = IdTierCategory;
    if (this.isSpecificFiltre) {
      this.prepareSpecificFiltre();
    } else {
      this.prepareNonSpecificFiltre();
    }
    this.handleOtherFilterEvent.emit({filter: 'tierCategoryDropdownComponent', value: IdTierCategory});
  }

  getSelectedCurrency() {
    const currencyId = this.formGroupFilter.controls['IdCurrency'].value;
    this.filtreValue = currencyId;
    if (this.isSpecificFiltre) {
      this.prepareSpecificFiltre();
    } else {
      this.prepareNonSpecificFiltre();
    }
  }

  getSelectedProject() {
    const projectId = this.formGroupFilter.controls['ProjectType'].value;
    if (projectId) {
      this.filtreValue = projectId;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  getSelectedState() {
    const state = this.formGroupFilter.controls[SharedConstant.STATE].value;
    const status = this.formGroupFilter.controls[SharedConstant.STATUS].value;
    const stateId = state ? state : status;
    if (stateId) {
      this.filtreValue = stateId;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  getSelectedStatusTeam() {
    const status = this.formGroupFilter.controls['Status'].value;
    if (status >= 0) {
      this.filtreValue = status;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  private preparePriceStateDropdown() {
    const priorityEnumValues = EnumValues.getNamesAndValues(PriceStateEnumerator);
    priorityEnumValues.forEach(priority => {
      const element = priority;
      element.name = this.translate.instant(element.name.toUpperCase());
      this.priceStateDataSource.push(element);
    });
  }

  onSelectPriceState() {
    const isActif = this.formGroupFilter.controls['isActif'].value;
    if (isActif) {
      this.filtreValue = isActif.value;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  private preparePriceTypeDropdown() {
    const priorityEnumValues = EnumValues.getNamesAndValues(PriceTypeEnumerator);
    priorityEnumValues.forEach(priority => {
      const element = priority;
      element.name = this.translate.instant(element.name.toUpperCase());
      this.priceTypeDataSource.push(element);
    });
  }

  onSelectPriceType() {
    const priceType = this.formGroupFilter.controls['priceType'].value;
    if (priceType) {
      this.filtreValue = priceType.value;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  private prepareClaimStatusDropdown() {
    const priorityEnumValues = EnumValues.getNamesAndValues(claimStatusCode);
    priorityEnumValues.forEach(priority => {
      const element = priority;
      element.name = this.translate.instant(element.name.toUpperCase());
      this.claimStatusDataSource.push(element);
    });
  }

  private prepareExitEmployeeStatusDropdown() {
    const priorityEnumValues = EnumValues.getNamesAndValues(this.exitReasonStatus);
    priorityEnumValues.forEach(priority => {
      const element = priority;
      element.name = this.translate.instant(element.name.toUpperCase());
      this.exitEmployeeStatusDataSource.push(element);
    });
  }

  private prepareAdministrativeStateDropdown() {
    const priorityEnumValues = EnumValues.getNamesAndValues(this.recruitmentRequestState);
    priorityEnumValues.forEach(priority => {
      const element = priority;
      element.name = this.translate.instant(element.name.toUpperCase());
      this.recruitmentRequestStateDataSource.push(element);
    });
  }

  private prepareRecruitmentOfferStateDropdown() {
    const priorityEnumValues = EnumValues.getNamesAndValues(this.recruitmentOfferState);
    priorityEnumValues.forEach(priority => {
      const element = priority;
      element.name = this.translate.instant(element.name.toUpperCase());
      this.recruitmentOfferStateDataSource.push(element);
    });
  }

  private prepareRecruitmentStateDropdown() {
    const priorityEnumValues = EnumValues.getNamesAndValues(this.recruitmentState);
    priorityEnumValues.forEach(priority => {
      const element = priority;
      element.name = this.translate.instant(element.name.toUpperCase());
      this.recruitmentStateDataSource.push(element);
    });
  }

  onSelectClaimStatus() {
    const claimStatus = this.formGroupFilter.controls['claimStatus'].value;
    if (claimStatus) {
      this.filtreValue = claimStatus.value;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  public selectedContractType() {
    const contractTypeId = this.formGroupFilter.controls[ContractConstant.ID_CONTRACT_TYPE].value;
    if (contractTypeId) {
      this.filtreValue = contractTypeId;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  public selectedSalaryStructure() {
    const salaryStructureId = this.formGroupFilter.controls[ContractConstant.ID_SALARY_STRUCTURE].value;
    if (salaryStructureId) {
      this.filtreValue = salaryStructureId;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  public selectedExitEmployeeReason() {
    const exitReasonId = this.formGroupFilter.controls[ExitEmployeeConstant.ID_exit_REASON].value;
    if (exitReasonId) {
      this.filtreValue = exitReasonId;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  public selectedDocumentRequestType() {
    const documentRequestId = this.formGroupFilter.controls[DocumentRequestConstant.ID_DOCUMENT_REQUEST_TYPE].value;
    if (documentRequestId) {
      this.filtreValue = documentRequestId;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  public selectExitEmployeeStatus() {
    const status = this.formGroupFilter.controls[SharedConstant.STATUS].value;
    if (status && (status.value || status.value == NumberConstant.ZERO)) {
      this.filtreValue = status.value;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  public selectedPriority() {
    const priority = this.formGroupFilter.controls[RecruitmentConstant.PRIORITY].value;
    if (priority) {
      this.filtreValue = priority;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  selectedJob() {
    const jobId = this.formGroupFilter.controls[SharedConstant.ID_JOB].value;
    if (jobId) {
      this.filtreValue = jobId;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  selectRecruitmentState() {
    const state = this.formGroupFilter.controls[SharedConstant.STATE].value;
    if (state && state.value) {
      this.filtreValue = state.value;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  selectedCandidate() {
    const candidateId = this.formGroupFilter.controls[SharedConstant.ID_CANDIDATE].value;
    if (candidateId) {
      this.filtreValue = candidateId;
      this.prepareNonSpecificFiltre();
    } else {
      const filterToSend: Filter = new Filter(this.columnName, this.filtreOperation, undefined);
      this.filtreOperatorEvent.emit(filterToSend);
    }
  }

  selectedMonth() {
    this.prepareNonSpecificFiltre();
  }

  teamsSelected(event) {
    this.filtreValue = event;
    this.prepareNonSpecificFiltre();
  }

  selectedMultipleEmployees(event) {
    this.filtreValue = event;
    this.prepareNonSpecificFiltre();
  }

  getSelectedCrmDropdownFiltre($event) {
    const crmDropdown = this.formGroupFilter.controls['crmDropdown'].value;
    this.filtreValue = crmDropdown;
    this.prepareNonSpecificFiltre();
  }
  getSelectedProdStatusOfDropdownFiltre() {
    this.filtreValue = this.formGroupFilter.controls['productionOfStatusDropdown'].value;
    this.prepareNonSpecificFiltre();
  }
  getSelectedProdArticleOfDropdownFiltre(event) {
    this.filtreValue = event;
    this.prepareNonSpecificFiltre();
  }
}

function RepairOrderStateDropdownComponent(RepairOrderStateDropdownComponent: any) {
  throw new Error('Function not implemented.');
}
