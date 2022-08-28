import {Component, ComponentRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {Opportunity} from '../../../../models/crm/opportunity.model';
import {OpportunityService} from '../../../services/opportunity.service';
import {Employee} from '../../../../models/payroll/employee.model';
import {OpportunityConstant} from '../../../../constant/crm/opportunityConstant';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {CategoryService} from '../../../services/category/category.service';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {Organisation} from '../../../../models/crm/organisation.model';
import {ReducedCurrency} from '../../../../models/administration/reduced-currency.model';
import {CurrencyService} from '../../../../administration/services/currency/currency.service';
import {Router} from '@angular/router';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {UpdateServiceService} from '../../../services/update-service.service';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {OpportunityFilterService} from '../../../services/opportunity-filter.service';
import {Tiers} from '../../../../models/achat/tiers.model';
import {ContactCrm} from '../../../../models/crm/contactCrm.model';
import {ContactDOtNet} from '../../../../models/crm/contactDotNet.model';
import {ItemService} from '../../../../inventory/services/item/item.service';
import {StaffingCategoryCrm} from '../../../../models/crm/categoryCrm.model';
import {ExactDate} from '../../../../shared/helpers/exactDate';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {OpportunityType} from '../../../../models/crm/enums/opportunityType.enum';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {AddNewOpportunityComponent} from '../add-new-opportunity/add-new-opportunity.component';
import {Claim} from '../../../../models/crm/claim.model';
import {ClaimType} from '../../../../models/crm/enums/claimType.enum';
import {ClaimCrmService} from '../../../services/claim/claim.service';
import {PermissionService} from '../../../services/permission/permission.service';
import {GenericCrmService} from '../../../generic-crm.service';
import {EnumValues} from 'enum-values';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {ReasonForChange} from '../../../../models/crm/ReasonForChange.model';
import {UserService} from '../../../../administration/services/user/user.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {SpinnerService} from '../../../../../COM/spinner/spinner.service';


@Component({
  selector: 'app-popup-add-opportinity',
  templateUrl: './popup-add-opportinity.component.html',
  styleUrls: ['./popup-add-opportinity.component.scss'],
})
export class PopupAddOpporttunityComponent implements OnInit, OnChanges, IModalDialog {

  /*
 * Form Group
 */
  public opportunityFormGroup: FormGroup;


  // Format Date
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  public isUpdateMode: boolean;
  public selectedClient;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public rating;
  public categoryData;
  public typeList: Array<string> = [];
  public oppCategoryType: string;
  public objList: Array<string> = [];
  public categoryId: number;
  public showChangeReason = false;
  public employeesByCategory: Employee[] = [];
  public responsableByCategory: Employee[] = [];
  public contactByCategory = [];
  private productIdList: Array<number>;
  public categoryElement;
  private opportunity = new Opportunity();
  public listP: Array<any> = [];
  public restartEmployee = false;
  public categoryFiltredType: Array<string> = [];
  public organisationList: any[];
  public searchedOrganizationsList = [];
  public viewRef;
  public creationDate: Date;
  public endDate: Date;

  public contactList: any[];
  public contactListByOrganization = [];

  public currencyDataSource: Array<ReducedCurrency>;
  public currencyFiltredDataSource: Array<ReducedCurrency>;
  public currency = new ReducedCurrency();

  public relatedResponsable = new Employee();

  public idOpportunity: number;
  public isSuccessStep = false;
  public ifFailureStep = false;
  public opportunityIsBeingLost = false;
  public opportunityIsBeingWon = false;
  public categoryList: StaffingCategoryCrm [];

  public listResponsiblesUsers: Array<Employee>;

  public titleIsAlreadyTaken = false;
  @Input() dataOpp: any;
  @Output() closeModalPopup = new EventEmitter<any>();
  public fromKanban = false;
  public indexStatus: number;
  public closedPositionPipe: number;

  public STAFFING_TYPE = OpportunityConstant.TYPE_STAFFING;
  public PRODUCT_SALE_TYPE = OpportunityConstant.TYPE_PRODUCT_SALE;

  public predicate = new PredicateFormat();
  public allContactTiers = [];
  public organizationFromControlName = OpportunityConstant.ORGANIZATION_FC_NAME;
  public visAvisFormControlName = OpportunityConstant.VIS_A_VIS_FC_NAME;
  private ESPACE = ' ';
  public opportunityIsProspect = true;
  private contactClientListByOrganizationClient = [];
  private allContactsCrm = [];

  public firstCollapseIsOpened: Boolean = true;
  public secondeCollapseIsOpened: Boolean = false;
  public thirdCollapseIsOpened: Boolean = false;
  private listClientToConvert = [];
  public opportunityRelatedPermissions: any;
  private opportunityEntityName = OpportunityConstant.OPPORTUNITY;
  public canUpdatePermission = true;
  public opportunityTypes = [];
  public selectedOppType;
  public isPermittedOrganisationUpdate = false;
  public relatedOrganisation = new Organisation();
  public relatedClientOrganisation;
  public isFromKanbanLastStep = false;
  public isPermittedContact = true;
  public parentPermission = 'POPUP_ADD_OPPORTUNITY';
  public reasonForChange: Array<ReasonForChange>;
  public showHistoricOpportunity = false;

  public listUsers = [];
  public Users = [];
  public listUsersFilter = [];
  public predicateOpportunity: PredicateFormat;

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.opportunityIsProspect = true;
    this.fromKanban = this.optionDialog.data.fromKanban;
    this.indexStatus = this.optionDialog.data.indexStatus;
    this.isSuccessStep = this.optionDialog.data.isSuccessStep;
    this.ifFailureStep = this.optionDialog.data.ifFailureStep;
    this.showChangeReason = this.optionDialog.data.showChangeReason;
    this.categoryId = this.optionDialog.data.categoryId;
    this.categoryElement = this.optionDialog.data.categoryElement;
    this.oppCategoryType = this.optionDialog.data.type;
    this.closedPositionPipe = this.optionDialog.data.closedPositionPipe;
  }

  constructor(private formBuilder: FormBuilder,
              private validationService: ValidationService,
              private currencyService: CurrencyService,
              private contactService: ContactCrmService,
              private opportunityService: OpportunityService,
              private modalService: ModalDialogInstanceService,
              private contactCrmService: ContactCrmService,
              private swallWarning: SwalWarring,
              private categoryService: CategoryService,
              private tiersService: TiersService, private router: Router,
              private  growlService: GrowlService,
              private translate: TranslateService,
              private updateOppService: UpdateServiceService,
              private opportunityFilter: OpportunityFilterService,
              private organisationService: OrganisationService,
              private itemService: ItemService,
              private growilService: GrowlService,
              private spinnerService: SpinnerService,
              private exactDate: ExactDate,
              private claimService: ClaimCrmService,
              private genericCrmService: GenericCrmService,
              private permissionService: PermissionService,
              private localStorageService: LocalStorageService,
              private userService: UserService) {
  }


  ngOnInit() {
    if (this.dataOpp) {
      this.reasonForChange = this.dataOpp.data.opportunity.reasonForChanges;
      if (this.reasonForChange.length > 0) {
        this.showHistoricOpportunity = true;
      }
    }

    this.selectedPermission();
    this.initCategoryTypes();
    this.initTypesList();
    this.getCategoryList();
    this.preparePredicate();
    if (!this.fromKanban) {
      this.initResponsiblesDataSource();
    } else {
      this.createAddOpporttunityForm();
      this.getObjectifList();
      this.getListOfCurrency();
      this.getTiers();
      if (this.dataOpp) {
        this.getOrganizationListProspectType(this.dataOpp.data.opportunity.organisationId);
      } else {

        this.initFiltreOrganisation();
        this.isPermittedOrganisationUpdate = true;
      }
      this.isUpdateMode = false;
      this.checkAndAddReasonForChangeControl();
      this.getOpportunityByCategory(true);
      this.setFormControlsValidators();
    }
  }

  private initTypesList() {
    this.opportunityTypes = EnumValues.getNames(OpportunityType).map((type: any) => {
      return type = {enumValue: type, enumText: this.translate.instant(type)};
    });
    this.selectedOppType = this.opportunityTypes[0];
  }

  public changeOpportunityType(type) {
    if (type === OpportunityType.PROSPECT) {
      this.opportunityIsProspect = true;
      this.switchToProspectList();
    } else if (type === OpportunityType.CLIENT) {
      this.opportunityIsProspect = false;
      this.switchToClientList();
    } else {
      this.initFiltreOrganisation();
    }
  }

  private preparePredicate() {
    this.predicate = this.genericCrmService.preparePredicateForClientsList(this.predicate);
  }

  checkCollapseOppening() {
    if (!this.opportunityFormGroup.valid) {
      if (!this.checkFirstCollapseFCValidity()) {
        this.firstCollapseIsOpened = true;
      }
      if (!this.checkSecondCollapseFCValidity()) {
        this.secondeCollapseIsOpened = true;
      }
      if (!this.checkThirdCollapseFCValidity()) {
        this.thirdCollapseIsOpened = true;
      }
    }
  }

  checkFirstCollapseFCValidity(): boolean {
    return (this.opportunityFormGroup.controls.title.valid && this.opportunityFormGroup.controls.organisationId.valid &&
      this.opportunityFormGroup.controls.customerId.valid && this.opportunityFormGroup.controls.idClientOrganization.valid &&
      this.opportunityFormGroup.controls.idClientContact.valid);
  }

  checkSecondCollapseFCValidity(): boolean {
    return (this.opportunityFormGroup.controls.productIdList.valid && this.opportunityFormGroup.controls.employeeId.valid);
  }

  checkThirdCollapseFCValidity(): boolean {
    return (this.opportunityFormGroup.controls.responsableUserId.valid && this.opportunityFormGroup.controls.IdCurrency.valid);
  }

  /**
   * Create opportunity form
   * @param opportunity
   */
  private createAddOpporttunityForm(opportunity?: Opportunity): void {
    this.opportunityFormGroup = this.formBuilder.group({
      title: [opportunity ? opportunity.title : '', Validators.required],
      rating: [this.rating ? this.rating : 0],
      responsableUserId: [opportunity ? opportunity.responsableUserId : undefined, Validators.required],
      opportunityCreatedDate: [opportunity ? opportunity.opportunityCreatedDate : new Date()],
      opportunityEndDate: [opportunity ? opportunity.opportunityEndDate : undefined],
      estimatedIncome: [opportunity ? opportunity.estimatedIncome : undefined, [Validators.min(0)]],
      IdCurrency: [opportunity ? opportunity.currencyId : undefined],
      employeeId: [opportunity ? opportunity.employeeId : undefined],
      productIdList: [opportunity ? opportunity.productIdList : []],
      description: [opportunity ? opportunity.description : ''],
      customerId: [opportunity ? opportunity.customerId : ''],
      organisationId: [opportunity ? opportunity.organisationId : undefined],
      idClient: [],
      idClientOrganization: [opportunity ? opportunity.idClientOrganization : ''],
      idClientContact: [opportunity ? opportunity.idClientContact : ''],
      currentPositionPipe: [opportunity ? opportunity.currentPositionPipe : ''],
      closedPositionPipe: [opportunity ? opportunity.closedPositionPipe : ''],
      team: [''],
      employeesPermittedTo: [''],
      category: [opportunity ? opportunity.category : '', Validators.required]
    });

  }

  private checkAndAddReasonForChangeControl() {
    if (this.showChangeReason) {
      this.opportunityFormGroup.addControl(CrmConstant.reasonForChange, new FormControl('', Validators.required));
    }
  }

  private isContactFormControlReadOnly(): boolean {
    if (this.fromKanban || this.opportunityIsProspect) {
      return !this.opportunityFormGroup.controls.organisationId.value;
    } else {
      return !this.opportunityFormGroup.controls.idClientOrganization.value;
    }
  }


  private getOpportunityByCategory(initProduct?) {
    this.opportunityService.getOpportunityByCategoryAndIsArchiving(this.categoryId, false)
      .subscribe((data) => {
        if (this.oppCategoryType === OpportunityConstant.TYPE_STAFFING) {
          this.getEmployees(data.categoryUsersId.STAFFING);
          this.getResponsables(data.categoryResponsableIds);
        } else {
          this.checkAndInitProductList(initProduct, data.categoryUsersId.PRODUCT_SALE);
          this.getResponsables(data.categoryResponsableIds);
        }
      });
  }

  private checkAndInitProductList(initProduct, data) {
    if (initProduct) {
      this.initProductList(data);
    }
  }

  ngOnChanges(simpleChange: SimpleChanges): void {
    this.showChangeReason = false;
    if (simpleChange.dataOpp) {
      this.idOpportunity = this.dataOpp.data.opportunity.id;
      this.isSuccessStep = this.dataOpp.data.isSuccessStep;
      this.opportunityIsBeingLost = this.dataOpp.data.opportunityIsBeingLost;
      this.opportunityIsBeingWon = this.dataOpp.data.opportunityIsBeingWon;
      this.getObjectifList();
      this.getListOfCurrency();
      this.getTiers();
      this.createAddOpporttunityForm();
      this.isUpdateMode = false;
      this.categoryId = this.dataOpp.data.categoryId;
      this.categoryElement = this.dataOpp.data.opportunity.category;
      this.oppCategoryType = this.categoryElement.type;
      this.opportunity = this.dataOpp.data.opportunity;
      if (this.dataOpp.data.isUpdated) {
        this.isUpdateMode = true;
        this.showChangeReason = true;
        this.convertRatingToStars(this.opportunity);
        this.createAddOpporttunityForm(this.dataOpp.data.opportunity);
        this.initCategoryProductsList();
        this.initClientsAndProspectsDataByOpportunityType();
        this.getRelatedResponsable(this.dataOpp.data.opportunity.responsableUserId);
        this.opportunityFormGroup.addControl(CrmConstant.reasonForChange, new FormControl('', Validators.required));
        this.categoryId = this.dataOpp.data.opportunity.categoryId;
      }
      this.initEmployeesAndResponsiblesDataByCategoryType();
    }
  }

  private initCategoryProductsList(): void {
    if (this.opportunity.productIdList != null && this.opportunity.productIdList.length > 0) {
      let productIdList = this.dataOpp.data.opportunity.productIdList;
      if (productIdList !== null && productIdList.length > 0) {
        productIdList = productIdList.map(product => product.Id);
        this.productIdList = productIdList;
      }
      this.opportunityFormGroup.controls['productIdList'].setValue(productIdList);
      this.getProductList(this.opportunity);
    }
  }

  private initClientsAndProspectsDataByOpportunityType(): void {
    if (this.dataOpp.data.opportunity.opportunityType === OpportunityType.PROSPECT) {
      this.initAllContactCrm();
      this.opportunityIsProspect = true;
      this.initFomrControlsDataInProspectMode();
      this.getOrganizationListProspectType(this.dataOpp.data.opportunity.organisationId);
      this.getContactListByOrganisation(this.dataOpp.data.opportunity.organisationId, this.dataOpp.data.opportunity.customerId);
    } else if (this.dataOpp.data.opportunity.opportunityType === OpportunityType.CLIENT) {
      this.isPermittedOrganisationUpdate = true;
      this.opportunityIsProspect = false;
      this.initFomrControlsDataInClientMode();
      this.getRelatedClientOrganisation(this.dataOpp.data.opportunity.idClientOrganization);
      this.getTiersContactListByClientId(this.dataOpp.data.opportunity.idClientOrganization);
    }
    this.setFormControlsValidators();
  }

  private initEmployeesAndResponsiblesDataByCategoryType(): void {
    this.opportunityService.getOpportunityByCategory(this.categoryId)
      .subscribe(data => {
        if (this.oppCategoryType === OpportunityConstant.TYPE_STAFFING) {
          this.getEmployees(data.categoryUsersId.STAFFING);
          this.getResponsables(data.categoryResponsableIds);
        } else {
          this.getResponsables(data.categoryResponsableIds);
        }
      });
  }


  private initFomrControlsDataInProspectMode() {
    this.organizationFromControlName = OpportunityConstant.ORGANIZATION_FC_NAME;
    this.visAvisFormControlName = OpportunityConstant.VIS_A_VIS_FC_NAME;
  }

  private initFomrControlsDataInClientMode() {
    this.organizationFromControlName = OpportunityConstant.CLIENT_FC_NAME;
    this.visAvisFormControlName = OpportunityConstant.VIS_A_VIS_CLIENT_FC_NAME;
  }

  public switchToProspectList() {
    if (this.opportunityIsProspect) {
      this.opportunityIsProspect = true;
      this.setFormControlsValues();
      this.opportunityFormGroup.controls[OpportunityConstant.ORGANIZATION_FC_NAME].setValue(null);
      this.opportunityFormGroup.controls[CrmConstant.CUSTOMER_ID].setValue(null);
      if (this.dataOpp) {
        this.getOrganizationListProspectType(this.dataOpp.data.opportunity.organisationId);
      } else {
        this.getOrganizationListProspectType();
      }
    }
  }

  public switchToClientList() {
    if (!this.opportunityIsProspect) {
      this.opportunityIsProspect = false;
      this.setFormControlsValues();
      this.opportunityFormGroup.controls[CrmConstant.CUSTOMER_ID].setValue(null);
      if (this.dataOpp) {
        this.getRelatedClientOrganisation(this.dataOpp.data.opportunity.idClientOrganization);
      } else {
        this.getRelatedClientOrganisation();
      }

    }
  }

  private setFormControlsValidators() {
    if (this.opportunityIsProspect) {
      this.opportunityFormGroup.controls[OpportunityConstant.ORGANIZATION_FC_NAME].setValidators(Validators.required);
      this.opportunityFormGroup.controls[OpportunityConstant.CLIENT_FC_NAME].clearValidators();
    } else {
      this.opportunityFormGroup.controls[OpportunityConstant.CLIENT_FC_NAME].setValidators(Validators.required);
      this.opportunityFormGroup.controls[OpportunityConstant.ORGANIZATION_FC_NAME].clearValidators();
    }
    if (this.oppCategoryType === this.PRODUCT_SALE_TYPE) {
      this.opportunityFormGroup.controls['productIdList'].setValidators(Validators.required);
      this.opportunityFormGroup.controls['employeeId'].clearValidators();
    } else if (this.oppCategoryType === this.STAFFING_TYPE) {
      this.opportunityFormGroup.controls['productIdList'].clearValidators();
      this.opportunityFormGroup.controls['employeeId'].setValidators(Validators.required);
    }
  }

  private setFormControlsValues() {
    if (this.opportunityIsProspect) {
      this.opportunityFormGroup.controls[OpportunityConstant.VIS_A_VIS_CLIENT_FC_NAME].setValue(undefined);
      this.opportunityFormGroup.controls[OpportunityConstant.CLIENT_FC_NAME].setValue(undefined);
    } else {
      this.opportunityFormGroup.controls[CrmConstant.CUSTOMER_ID].setValue(undefined);
      this.opportunityFormGroup.controls[OpportunityConstant.ORGANIZATION_FC_NAME].setValue(undefined);
    }
  }

  initFiltreOrganisation() {
    this.organisationList = [];
    this.searchedOrganizationsList = [];
    let searchedOrganizationsListInter = [];
    let clientsList = [];
    this.organisationService.getJavaGenericService().getEntityList('')
      .subscribe(data => {
        this.organisationList = data;
        this.searchedOrganizationsList = data;

      });
    this.tiersService.processDataServerSide(this.predicate).subscribe(data => {
      clientsList = data.data;
      this.organisationList = clientsList.map((organization) => this.convertClientToOrganisation(organization));
      searchedOrganizationsListInter = clientsList.map((organization) => this.convertClientToOrganisation(organization));
      searchedOrganizationsListInter.forEach(e => {
        this.searchedOrganizationsList.push(e);
      });
    });

  }

  getRelatedClientOrganisation(id?: number) {
    this.organisationList = [];
    this.searchedOrganizationsList = [];
    let clientsList = [];
    this.tiersService.processDataServerSide(this.predicate).subscribe(data => {
      clientsList = data.data;
      this.organisationList = clientsList.map((organization) => this.convertClientToOrganisation(organization));
      this.searchedOrganizationsList = clientsList.map((organization) => this.convertClientToOrganisation(organization));
      if (id) {
        this.relatedClientOrganisation = this.organisationList.find((client) => client.id === id);
      }
    });
  }

  private getTiersContactListByClientId(clientId) {
    this.tiersService.getContactTiers().subscribe((data: any) => {
      this.allContactTiers = data.listData.map((contact) => this.prepareContactTier(contact));
      if (this.allContactTiers.length > NumberConstant.ZERO) {
        this.contactList = this.allContactTiers.filter(contact => contact.IdTiers === clientId);
        this.contactListByOrganization = this.allContactTiers.filter(contact => contact.IdTiers === clientId);

        this.setContactSelectedValue(undefined, clientId);
      }
    });
  }

  convertClientToOrganisation(client): Organisation {
    return new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter,
      this.translate.instant(AddNewOpportunityComponent.TRANSLATE_CUSTOMER));
  }

  prepareContactTier(contactTier) {
    const contact = new ContactCrm();
    contact.fullName = contactTier.FirstName.concat(this.ESPACE).concat(contactTier.LastName);
    contact.id = contactTier.Id;
    contact.IdTiers = contactTier.IdTiers;
    return contact;
  }


  private getResponsables(responsableListId) {
    if (responsableListId) {
      this.userService.getUsersListByArray(responsableListId).subscribe(response => {
        this.responsableByCategory = response;
      });
    }
  }

  private getEmployees(employeeListId) {
    if (employeeListId) {
      this.userService.getUsersListByArray(employeeListId).subscribe(employees => {
        this.employeesByCategory = employees;
      });
    }
  }

  saveOpportunityFromKanban() {
    const valueToSend = this.opportunityFormGroup.value as Opportunity;
    this.productIdList = valueToSend.productIdList;
    if (this.opportunityIsProspect) {
      valueToSend.organisationId = this.opportunityFormGroup.value.organisationId;
      valueToSend.customerId = this.opportunityFormGroup.value.customerId;
      valueToSend.idClientOrganization = null;
      valueToSend.idClientContact = null;
      valueToSend.opportunityType = OpportunityType.PROSPECT;
    } else {
      valueToSend.idClientOrganization = this.opportunityFormGroup.value.organisationId;
      valueToSend.idClientContact = this.opportunityFormGroup.value.customerId;
      valueToSend.organisationId = null;
      valueToSend.customerId = null;
      valueToSend.opportunityType = OpportunityType.CLIENT;
    }
    valueToSend.currencyId = this.opportunityFormGroup.value.IdCurrency;
    valueToSend.categoryId = this.categoryId;
    valueToSend.currentPositionPipe = this.indexStatus;
    valueToSend.closedPositionPipe = this.closedPositionPipe;
    valueToSend.productIdList = this.productIdList;
    valueToSend.responsableUserId = this.relatedResponsable.Id;
    valueToSend.opportunityEndDate = this.opportunityFormGroup.controls['opportunityEndDate'].value ?
      this.exactDate.getDateExact(this.opportunityFormGroup.controls['opportunityEndDate'].value) : null;
    valueToSend.reasonForChange = this.opportunityFormGroup.value.reasonForChange;
    if (this.isSuccessStep) {
      this.saveNewOpportunityFromAddKanban(valueToSend);
    } else {
      this.updateOpportunity(valueToSend);
    }
  }

  save() {
    this.checkCollapseOppening();
    this.titleIsAlreadyTaken = false;
    if (this.fromKanban) {
      if (this.opportunityFormGroup.valid && this.opportunityRelatedPermissions.permissionValidForm) {
        this.saveOpportunityFromKanban();
      } else {
        this.validationService.validateAllFormFields(this.opportunityFormGroup);
      }
    } else {

      const valueToSend = this.opportunityFormGroup.value as Opportunity;
      valueToSend.currencyId = this.opportunityFormGroup.value.IdCurrency;
      valueToSend.categoryId = this.dataOpp.data.opportunity.categoryId;
      valueToSend.currentPositionPipe = this.dataOpp.data.opportunity.currentPositionPipe;
      this.setOpportunityType(valueToSend);
      this.opportunityFormGroup.value.productIdList = this.productIdList;
      if (this.opportunityFormGroup.valid && this.opportunityRelatedPermissions.permissionValidForm) {
        this.checkStapIsLastAndUpdateOpportunity(valueToSend);
      } else {
        this.validationService.validateAllFormFields(this.opportunityFormGroup);
      }
    }
  }


  private setOpportunityType(opportunity: Opportunity) {
    if (this.checkOpportunityTypeProspect(this.opportunity)) {
      opportunity.opportunityType = OpportunityType.PROSPECT;
    } else if (this.checkOpportunityTypeClient(this.opportunity)) {
      opportunity.opportunityType = OpportunityType.CLIENT;
    }
  }

  private checkStapIsLastAndUpdateOpportunity(valueToSend) {
    if (this.isSuccessStep) {

      valueToSend.isDeleted = true;
      if (valueToSend.opportunityType === OpportunityType.PROSPECT) {
        const organisation: Organisation = this.organisationList.find(x => x.id === valueToSend.organisationId);
        if (organisation) {
          this.convertTierOrganisation(organisation, valueToSend);
        } else if (this.relatedOrganisation) {
          this.convertTierOrganisation(this.relatedOrganisation, valueToSend);
        }
      } else if (valueToSend.opportunityType === OpportunityType.CLIENT) {
        valueToSend.idClientOrganization = this.opportunityFormGroup.value.idClientOrganization;
        this.updateOpportunity(valueToSend);
      }

      this.opportunityFormGroup.controls['currentPositionPipe'].setValue(valueToSend.currentPositionPipe);

    } else {
      this.updateOpportunity(valueToSend);
    }
  }

  convertTierOrganisation(organisation, valueToSend) {
    const tiers: Tiers = Organisation.convertToTiers(organisation);
    tiers.Contact = new Array();
    this.contactService.getJavaGenericService().getData(ContactConstants.GET_ALL_BY_ORGANIZATION_URL.concat(organisation.id))
      .subscribe((data) => {
        tiers.Contact = this.convertProppectToContact(data);
        const isNew: boolean = (tiers.Id === 0);
        this.checkExistanceClientAndUpdateOpportunity(organisation, tiers, isNew, valueToSend);
      });
  }

  private checkExistanceClientAndUpdateOpportunity(organisation: Organisation, tiers: Tiers, isNew: boolean, valueToSend) {
    if (organisation.idClient == null) {
      const address: any[] = [];
      if (organisation.addresses !== undefined) {
        organisation.addresses.forEach((e, i) => {
          const adress = {
            country: e.country,
            city: e.city,
            zipCode: e.zipCode,
            extraAddress: e.extraAddress,
            idCountry: e.idCountry,
            idCity: e.idCity
          };
          address.push(adress);
        });
        tiers.Address = [];
        tiers.Address = address;
      }
      const DateToRemember: any[] = [];
      if (tiers.DateToRemember !== null) {

        tiers.DateToRemember.forEach((DTR) => {
          const data = {
            eventName: DTR.eventName,
            date: DTR.createdDate
          };
          DateToRemember.push(data);
        });
      }
      tiers.DateToRemember = [];
      tiers.DateToRemember = DateToRemember;
      this.tiersService.saveTiers(tiers, isNew).subscribe(data => {
        if (isNew) {
          this.getCustomerOfClientConvertedThenConvertAll(data.Id, valueToSend);
        }
      });
    } else {
      this.updateOpportunity(valueToSend);
    }
  }

  convertAllOrganizationOpportunities(organizationId, idClientOrganization, valueToSend: Opportunity) {
    let newContactClientId;
    const opportunitiesToConvert = [];
    this.opportunityService.getJavaGenericService().getEntityById(organizationId, 'byOrganisation')
      .subscribe((opportunities: Opportunity[]) => {
        if (opportunities) {
          opportunities.map((opp, index) => {
            let contactById;
            if (opp.customerId) {
              contactById = this.getOpportunityContactCrm(opp.customerId);
            } else {
              contactById = null;
            }
            newContactClientId = this.setOpportunityDataByContactId(opp, contactById, idClientOrganization, newContactClientId);
            opportunitiesToConvert.push(opp);
          });
          this.convertOpportunitiesThenUpdate(valueToSend, opportunitiesToConvert, newContactClientId, idClientOrganization);
        }
      });
  }

  getOpportunityContactCrm(oppContactId) {
    return this.allContactsCrm.find(contact => contact.id === oppContactId);
  }

  private convertOpportunitiesThenUpdate(valueToSend, opportunities, newContactClientId, idClientOrganization) {
    this.opportunityService.convertAllOpportunitiesToClients(opportunities).subscribe((result) => {
      if (result) {
        valueToSend.idClientContact = newContactClientId;
        valueToSend.idClientOrganization = idClientOrganization;
        valueToSend.opportunityType = OpportunityType.CLIENT;
        valueToSend.organisationId = null;
        valueToSend.customerId = null;
        this.updateOpportunity(valueToSend);
      }
    });
  }

  convertAllOrganizationClaims(organizationId, idClientOrganization, contactId?) {
    if (contactId) {
      this.claimService.getJavaGenericService().getData(OpportunityConstant.BY_OPPORTUNITY + this.opportunity.id +
        OpportunityConstant.BY_ORGANIZATION + organizationId + OpportunityConstant.BY_CONTACT + contactId)
        .subscribe((claims: Claim[]) => {
          this.prepareClaimToConvert(claims, idClientOrganization);
        });
    } else {
      this.claimService.getJavaGenericService().getData(OpportunityConstant.BY_OPPORTUNITY + this.opportunity.id +
        OpportunityConstant.BY_ORGANIZATION + organizationId)
        .subscribe((claims: Claim[]) => {
          this.prepareClaimToConvert(claims, idClientOrganization);
        });
    }

  }

  private prepareClaimToConvert(claims, idClientOrganization) {
    if (claims) {
      claims.forEach((claim: Claim, index) => {
        if (claim.declaredBy) {
          const contactById = this.getOpportunityContactCrm(claim.declaredBy);
          claim.idClientContact = this.setClaimDataByContactIdAndGetNewContactId(contactById).Id;

        } else {
          claim.idClientContact = null;
        }
        claim.idClientOrganization = idClientOrganization;
        claim.claimType = ClaimType.CLIENT;
        claim.declaredBy = null;
        claim.organizationId = null;
        this.convertClaim(claim);
      });
    }
  }

  private convertClaim(claim) {
    this.claimService.getJavaGenericService().updateEntity(claim, claim.id).subscribe();
  }

  private setClaimDataByContactIdAndGetNewContactId(contact) {
    let contactConverted;
    if (contact) {
      contactConverted = this.contactClientListByOrganizationClient.find((client: any) =>
        this.checkContactClientAndProspectEquality(client, contact));
    }
    return contactConverted;
  }

  private setOpportunityDataByContactId(oppToConvert, contact, newIdClientOrganization, newContactClientId) {
    if (contact) {
      const contactConverted = this.contactClientListByOrganizationClient.find((client: any) =>
        this.checkContactClientAndProspectEquality(client, contact));
      if (oppToConvert.id === this.opportunity.id) {
        newContactClientId = contactConverted.Id;
      }
      if (contactConverted) {
        oppToConvert.idClientContact = contactConverted.Id;
      }
    } else {
      oppToConvert.idClientContact = null;
    }
    oppToConvert.idClientOrganization = newIdClientOrganization;

    return newContactClientId;
  }


  private getCustomerOfClientConvertedThenConvertAll(clientId, valueToSend) {
    this.tiersService.getTiersById(clientId).subscribe((data) => {
      this.contactClientListByOrganizationClient = data.Contact;
      this.convertAllOrganizationClaims(this.opportunity.organisationId,
        data.Id, this.opportunity.customerId ? this.opportunity.customerId : undefined);
      this.convertClientsFromOpportunity();
      this.convertAllOrganizationOpportunities(this.opportunity.organisationId, data.Id, valueToSend);

    });
  }

  private convertClientsFromOpportunity() {
    this.contactList.forEach(contact => {
      const contactConverted = this.contactClientListByOrganizationClient.find((client: any) =>
        this.checkContactClientAndProspectEquality(client, contact));
      if (contactConverted) {
        this.listClientToConvert.push({contactId: contact.id, clientId: contactConverted.Id});
      }
    });
    this.opportunityService.convertFromOpportunity(this.listClientToConvert).subscribe(result => {
      this.listClientToConvert = [];
    });
  }

  checkContactClientAndProspectEquality(client: ContactDOtNet, contact: ContactCrm) {
    if (contact && this.opportunity.opportunityType === OpportunityType.PROSPECT) {
      return client.Email === contact.mail && (client.Tel1 && contact.phone[NumberConstant.ZERO]['phone'] ?
        client.Tel1 === contact.phone[NumberConstant.ZERO]['phone'] : true);
    }
  }

  private checkOpportunityTypeProspect(opportunity) {
    return opportunity.opportunityType === OpportunityType.PROSPECT;
  }

  private checkOpportunityTypeClient(opportunity) {
    return opportunity.opportunityType === OpportunityType.CLIENT;
  }

  private convertRatingToStars(data: Opportunity) {
    if (data.rating) {
      this.rating = Number(data.rating) / NumberConstant.TWENTY;
    }
  }

  closePopUp() {
    this.opportunityService.oppSaved.emit(true);
    this.growlService.successNotification(this.translate.instant(CrmConstant.SUCCESS_OPERATION));
    this.isFromKanbanLastStep = false;
    this.updateOppService.update(true);
    this.modalService.closeAnyExistingModalDialog();
    this.closeModalPopup.emit();
  }

  private updateOpportunity(valueToSend) {
    if (!this.fromKanban || this.isFromKanbanLastStep) {
      this.opportunityFormGroup.controls['rating'].setValue(this.rating);
      valueToSend.rating = this.rating;
      this.spinnerService.showLoader();
      this.opportunityService.getJavaGenericService().updateEntity(valueToSend,
        this.idOpportunity).subscribe(data => {
        if (this.canUpdatePermission && !this.fromKanban) {
          this.permissionService.updatePermission(this.opportunityRelatedPermissions, this.opportunityEntityName, this.idOpportunity)
            .subscribe(() => {
                this.spinnerService.hideLaoder();
                this.closePopUp();
            }
            );
        } else {
          this.spinnerService.hideLaoder();
          this.closePopUp();
        }
      });
    } else {
      this.spinnerService.showLoader();
      this.opportunityService.getJavaGenericService().checkTitleAndSaveOpportunity('save', valueToSend)
        .subscribe((resultat) => {
          const data = JSON.parse(resultat);
          if (data != null) {
            if (data.errorCode === OpportunityConstant.OPPORTUNITE_TITLE_ALL_READY_EXIST) {
              this.titleIsAlreadyTaken = true;
              this.opportunityFormGroup.controls[OpportunityConstant.TITLE].markAsPending();
            } else {
              this.opportunityService.oppSaved.emit(true);
              this.opportunityFormGroup.reset();
              this.optionDialog.onClose();
              this.modalService.closeAnyExistingModalDialog();
              this.permissionService.savePermission(this.opportunityRelatedPermissions, this.opportunityEntityName, data.id).subscribe();
              this.growilService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
            }
          }
          this.spinnerService.hideLaoder();

        });
    }
  }


  receiveSupplier($event) {
    this.selectedClient = $event.selectedValue;
  }

  /**
   *  created Date getter
   */
  get opportunityCreatedDate(): FormControl {
    return this.opportunityFormGroup.get(OpportunityConstant.CRERATED_DATE) as FormControl;
  }

  /**
   *  End Date getter
   */
  get opportunityEndDate(): FormControl {
    return this.opportunityFormGroup.get(OpportunityConstant.END_DATE) as FormControl;
  }

  getListOfCurrency() {
    this.currencyService.listdropdown().subscribe((data: any) => {
      this.currencyDataSource = data.listData;
    });
  }

  getContactListByOrganisation(organizationSelected?, contactProspId?: number) {
    if (organizationSelected) {
      this.contactList = [];
      this.contactListByOrganization = [];
      if (this.opportunityIsProspect) {
        this.opportunityFormGroup.controls[CrmConstant.CUSTOMER_ID].setValue(null);
        this.getContactsByProspectOrganizationId(organizationSelected, contactProspId);
      } else {
        this.opportunityFormGroup.controls[OpportunityConstant.VIS_A_VIS_CLIENT_FC_NAME].setValue(null);
        this.getTiersContactListByClientId(organizationSelected);
      }
    } else {
      this.opportunityFormGroup.controls[CrmConstant.CUSTOMER_ID].setValue(null);
      this.opportunityFormGroup.controls[OpportunityConstant.VIS_A_VIS_CLIENT_FC_NAME].setValue(null);
    }
  }

  getContactsByProspectOrganizationId(organizationSelectedId, contactProspId?) {
    this.contactService.getJavaGenericService().getData(ContactConstants.GET_BY_ORGANIZATION_URL.concat(organizationSelectedId))
      .subscribe((data) => {
        if (contactProspId && !data.some(contact => contact.id === contactProspId)) {
          this.contactService.getJavaGenericService().getEntityById(contactProspId).subscribe((contact) => {
            if (contact) {
              this.contactList.push(contact);
              this.contactListByOrganization.push(contact);
              this.isPermittedContact = false;
              this.contactList.concat(data);
              this.contactListByOrganization.concat(data);
              this.setContactsFullName();
              this.setContactSelectedValue(contactProspId);
            }
          });
        } else {
          this.contactList = data;
          this.contactListByOrganization = data;
          this.setContactsFullName();
          this.setContactSelectedValue(contactProspId);
        }
      });
  }

  private initAllContactCrm() {
    this.contactService.getJavaGenericService().getEntityList('get-all-contact').subscribe((contacts) => {
      this.allContactsCrm = contacts;
    });
  }

  setContactsFullName() {
    this.contactList.map(contact => contact.fullName = contact.name.concat(' ').concat(contact.lastName));
  }

  setContactSelectedValue(contactPId?, clienId?) {
    if (this.isUpdateMode) {
      if (this.opportunityIsProspect) {
        this.opportunityFormGroup.controls[CrmConstant.CUSTOMER_ID].setValue(contactPId);
      } else {
        this.opportunityFormGroup.controls[OpportunityConstant.VIS_A_VIS_FC_NAME].setValue(clienId);
      }
    }
  }

  private getOrganizationListProspectType(id?: number) {
    this.organisationList = [];
    this.searchedOrganizationsList = [];
    this.organisationService.getJavaGenericService().getEntityList('')
      .subscribe(data => {
          this.organisationList = data;
          this.searchedOrganizationsList = data;
          if (id) {
            this.getRelatedOrganisation(id);
          }
        }
      );
  }

  getRelatedOrganisation(id: number) {
    this.organisationService.getJavaGenericService().getEntityById(id).subscribe(organization => {
      this.relatedOrganisation = organization;
      this.isPermittedOrganisationUpdate = this.organisationList.some(org => org.id === id);
    });
  }

  getRelatedResponsable(id: number) {
    this.userService.getById(id).subscribe(
      (data) => {
        this.relatedResponsable = data;
      }
    );
  }

  closeModal() {
    if (this.fromKanban) {
      this.opportunityFormGroup.reset();
      this.optionDialog.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }
    this.closeModalPopup.emit();

  }

  convertProppectToContact(contactCrm: ContactCrm[]) {
    const contacts: ContactDOtNet[] = new Array();
    for (const c of contactCrm) {
      const contact: ContactDOtNet = new ContactDOtNet();
      contact.Email = c.mail;
      contact.FirstName = c.name;
      contact.LastName = c.lastName;
      contact.Fonction = c.poste;
      contact.Tel1 = c.phone.length > NumberConstant.ZERO ? c.phone[NumberConstant.ZERO]['phone'] : '';
      contact.Fax1 = c.fax;
      contact.Twitter = c.twitter;
      contact.Facebook = c.facebook;
      contact.Linkedin = c.linkedIn;
      contact.DateToRemember = this.convertDatesToRemember(c);
      contact.Phone = this.convertPhoneJSON(c.phone);
      contacts.push(contact);
    }
    return contacts;
  }

  convertPhoneJSON(phones): any {
    let phone = [];
    phones.forEach(
      (p) => {
        const data = {
          Id: 0,
          Number: p.phone,
          CountryCode: p.countryCode + ' ',
          DialCode: p.dialCode,
          IsDeleted: p.delete
        };
        phone.push(data);
      }
    );
    return phone;
  }

  convertDatesToRemember(contactCrm) {
    const dataToSend = [];
    let data;

    if (contactCrm.datesToRemember.length > 0) {
      contactCrm.datesToRemember.forEach((d) => {
          data = {
            EventName: d.eventName,
            Date: d.date
          };
          dataToSend.push(data);
        }
      );
    }
    return dataToSend;
  }

  private getObjectifList() {
    this.categoryService.getJavaGenericService().getEntityList()
      .subscribe(categoryData => {
        this.categoryData = categoryData;
        categoryData.forEach(objectifTypeList => {
          if (this.objList.indexOf(objectifTypeList.categoryType) < NumberConstant.ZERO) {
            this.objList.push(objectifTypeList.categoryType);
          }
        });
      });
  }

  private getTiers() {
    this.tiersService.getContactTiers().subscribe((data: any) => {

      data.listData.forEach(a => {
        a.name = a.FirstName + a.LastName;
        this.contactByCategory.push(a);

      });
    });
  }

  filterByCategory(event) {
    this.categoryData.forEach(category => {
      if (category.categoryType === event) {
        this.categoryFiltredType.push(category.title);
      }
    });
  }

  restartEmployeeTest() {
    this.restartEmployee = false;
  }

  initCategoryTypes() {
    this.categoryService.getJavaGenericService().getEntityList()
      .subscribe(categoryData => {
        this.categoryData = categoryData;
        categoryData.forEach(categoryTypeList => {
          if (this.typeList.indexOf(categoryTypeList.categoryType) < NumberConstant.ZERO) {
            this.typeList.push(categoryTypeList.categoryType);
          }
        });
      });
  }

  getCategoryList() {
    this.categoryService.getJavaGenericService().getEntityList().subscribe(
      (data) => {
        this.categoryList = data;
      }
    );
  }

  private getProductList(data: Opportunity) {
    const listIdProductCategory = data.category.products.map(x => {
      return x.id;
    });
    this.itemService.getItemsAfterFilter(listIdProductCategory).subscribe(product => {
      this.listP = [];
      product.listData.forEach(p => this.listP.push(p));
    });
  }

  private initProductList(productIds) {
    this.itemService.getItemsAfterFilter(productIds).subscribe(product => {
      this.listP = product.listData;
    });
  }

  listIdProduct(items) {
    this.opportunityFormGroup.controls[CrmConstant.PRODUCT_LIST].setValue(items);
  }

  public initResponsiblesDataSource() {
    this.predicateOpportunity = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicateOpportunity).subscribe(data => {
      this.listUsers = data.data;
      this.listUsersFilter = data.data;
      this.filterUsers();
      this.listResponsiblesUsers = this.listUsers;
    });
  }

  rewriteTitle() {
    this.titleIsAlreadyTaken = false;
  }

  changeResponsable(event) {
    this.opportunityFormGroup.controls['responsableUserId'].setValue(this.relatedResponsable.Id);
    this.opportunityFormGroup.controls['responsableUserId'].updateValueAndValidity();
  }

  handleOrganizationFilter(organization) {
    this.searchedOrganizationsList = this.organisationList.filter(organ => organ.name.toLowerCase()
      .indexOf(organization.toLowerCase()) !== -1);
  }

  handleContactsFilter(searchedContact) {
    if (this.opportunityIsProspect) {
      this.contactListByOrganization = this.contactList.filter(contact => {
        return (contact.name.toLowerCase()
          .indexOf(searchedContact.toLowerCase()) !== -1 || contact.lastName.toLowerCase()
          .indexOf(searchedContact.toLowerCase()) !== -1);
      });
    } else {
      this.contactListByOrganization = this.contactList.filter(contact => {
        return (contact.fullName.toLowerCase()
          .indexOf(searchedContact.toLowerCase()) !== -1);
      });
    }

  }

  selectedPermission() {
    this.permissionService.getResult().subscribe(data => {
      if (data && data.permission && (data.parent === this.parentPermission)) {
        this.opportunityRelatedPermissions = data.permission;
      }
    });
  }

  private loadPermission(canUpdatePermission) {
    this.canUpdatePermission = canUpdatePermission;
  }

  getNameOrganization() {
    if (this.checkOpportunityTypeProspect(this.opportunity)) {
      return (this.relatedOrganisation == null || Object.keys(this.relatedOrganisation).length === 0) ? '' : this.relatedOrganisation.name;
    } else if (this.checkOpportunityTypeClient(this.opportunity)) {
      return (this.relatedClientOrganisation == null || Object.keys(this.relatedClientOrganisation).length === 0) ? '' :
        this.relatedClientOrganisation.name;
    }
  }

  private saveNewOpportunityFromAddKanban(valueToSend) {
    this.spinnerService.showLoader();
    this.opportunityService.getJavaGenericService().checkTitleAndSaveOpportunity('save', valueToSend)
      .subscribe((resultat) => {
        const data = JSON.parse(resultat);
        if (data != null) {
          if (data.errorCode === OpportunityConstant.OPPORTUNITE_TITLE_ALL_READY_EXIST) {
            this.titleIsAlreadyTaken = true;
            this.opportunityFormGroup.controls[OpportunityConstant.TITLE].markAsPending();
          } else {
            this.permissionService.savePermission(this.opportunityRelatedPermissions, this.opportunityEntityName, data.id).subscribe();
            this.opportunity = data;
            this.idOpportunity = this.opportunity.id;
            this.isFromKanbanLastStep = true;
            this.checkStapIsLastAndUpdateOpportunity(valueToSend);
          }
          this.spinnerService.hideLaoder();
        }
      });
  }

  filterUsers() {
    this.listUsersFilter = this.listUsersFilter.filter(responsable => responsable.FullName != null);
    this.removeDuplicateUsers();
    this.listUsers = this.listUsersFilter;
  }

  removeDuplicateUsers() {
    this.listUsersFilter = this.listUsersFilter.reduce((a, b) => {
      if (!a.find(data => data.Email === b.Email)) {
        a.push(b);
      }
      return a;
    }, []);
  }


}
