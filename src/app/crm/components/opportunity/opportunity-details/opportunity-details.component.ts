import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Opportunity} from '../../../../models/crm/opportunity.model';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {SideNavService} from '../../../services/sid-nav/side-nav.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {StaffingCategoryCrm} from '../../../../models/crm/categoryCrm.model';
import {CategoryService} from '../../../services/category/category.service';
import {OpportunityService} from '../../../services/opportunity.service';
import {Organisation} from '../../../../models/crm/organisation.model';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {ContactCrm} from '../../../../models/crm/contactCrm.model';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {ItemService} from '../../../../inventory/services/item/item.service';
import {CurrencyService} from '../../../../administration/services/currency/currency.service';
import {ReducedCurrency} from '../../../../models/administration/reduced-currency.model';
import {Employee} from '../../../../models/payroll/employee.model';
import {StatusCrm} from '../../../../models/crm/statusCrm.model';
import {OpportunityConstant} from '../../../../constant/crm/opportunityConstant';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {SpinnerService} from '../../../../../COM/spinner/spinner.service';
import {Tiers} from '../../../../models/achat/tiers.model';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {ContactDOtNet} from '../../../../models/crm/contactDotNet.model';
import {ExactDate} from '../../../../shared/helpers/exactDate';
import {ActivatedRoute, Router} from '@angular/router';
import {FileConstant} from '../../../../constant/crm/file.constant';
import {OpportunityType} from '../../../../models/crm/enums/opportunityType.enum';
import {AddNewOpportunityComponent} from '../add-new-opportunity/add-new-opportunity.component';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {TiersConstants} from '../../../../constant/purchase/tiers.constant';
import {ClaimCrmService} from '../../../services/claim/claim.service';
import {Claim} from '../../../../models/crm/claim.model';
import {ClaimType} from '../../../../models/crm/enums/claimType.enum';
import {PipelineService} from '../../../services/pipeline/pipeline.service';
import {Pipeline} from '../../../../models/crm/Pipeline';
import {PipelineStep} from '../../../../models/crm/PipelineStep';
import {EnumValues} from 'enum-values';
import {PipelineState} from '../../../../models/crm/enums/PipelineState';
import {PermissionService} from '../../../services/permission/permission.service';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {PermissionConstant} from '../../../../constant/crm/permission.constant';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {UrlServicesService} from '../../../services/url-services.service';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {ReasonForChange} from '../../../../models/crm/ReasonForChange.model';
import {UserService} from '../../../../administration/services/user/user.service';
import {PermissionConstant as CRM_PERMISSION} from '../../../../Structure/permission-constant';

@Component({
  selector: 'app-opportunity-details',
  templateUrl: './opportunity-details.component.html',
  styleUrls: ['./opportunity-details.component.scss']
})
export class OpportunityDetailsComponent implements OnInit {

  /**
   * the id in the url
   */
  public opportunityId: number;


  public opportunity = new Opportunity();
  public minCreatedDate: Date;
  public minOpportunityEndDate = new Date(this.minCreatedDate);
  public todayDate = new Date();
  public maxCreationDate;
  public opportunityEndDateIsInvalid = false;
  public opportunityCreatedDateIsInvalid = false;
  private pageSize = NumberConstant.TEN;
  public titleIsAlreadyTaken = false;
  public isStepChanged = false;
  public relatedClientContactDetail;
  public isPermittedContact = true;
  public listProducts;

  /**
   constants to be used in the html file
   */
  public NAV_DETAILS_OPPORTUNITY = OpportunityConstant.NAV_DETAILS_OPPORTUNITY;


  public responsableByCategory: Employee[] = [];

  public categoryType: any;
  public employeesByCategory: any[];

  public categoriesTypes: Array<string> = [];

  public category;

  public rating;

  public organisationList: any[];
  public searchedOrganizationsList = [];

  public categoriesList: StaffingCategoryCrm [];

  public opportunityFormGroup: FormGroup;

  public creationDate = new Date();

  public endDate = new Date();

  public relatedOrganisation = new Organisation();

  public relatedClientOrganisation;

  public relatedContact = new ContactCrm();

  public relatedClientContact;

  public contactList = [];
  public contactListByOrganization = [];

  public currencyDataSource: Array<ReducedCurrency>;
  public currencyFiltredDataSource: Array<ReducedCurrency>;
  public currency = new ReducedCurrency();

  public relatedResponsable = new Employee();
  public listStatus: StatusCrm[] = [];
  public currentPositionPipe: number;
  public currentStatus: StatusCrm;
  private relatedStatus: StatusCrm;
  public selectedItemContact;
  public stepCollapse = false;
  public isCaseToConvertOpportunity = false;
  public opportunityIsBeingLost = false;
  public opportunityIsBeingWon = false;
  public opportunityRelatedPermissions: any;
  private opportunityEntityName = OpportunityConstant.OPPORTUNITY;
  public canUpdatePermission = true;
  public opportunityTypes = [];
  public selectedOppType;
  public parentPermission = 'DETAIL_OPPORTUNITY';

  @Input() isArchivingMode = false;
  @Input() detailsData;
  @Input() source: string;
  @Input() isUpdate;
  @Output() showDetailOrganisationEvent = new EventEmitter<any>();
  @Output() showDetailContactEvent = new EventEmitter<any>();
  @Output() componentIsUpdade = new EventEmitter<void>();
  @Output() passeToUpdateMode = new EventEmitter<any>();

  uuid = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND);
  public opportunitySource = OpportunityConstant.OPPORTUNITY_ENTITY;


  public organizationFromControlName = OpportunityConstant.ORGANIZATION_FC_NAME;
  public visAvisFromControlName = OpportunityConstant.VIS_A_VIS_FC_NAME;
  public predicate: PredicateFormat;


  public STAFFING_TYPE = OpportunityConstant.TYPE_STAFFING;
  public PRODUCT_SALE_TYPE = OpportunityConstant.TYPE_PRODUCT_SALE;

  public isProspectType = true;
  public allContactTiers = [];
  private contactClientListByOrganizationClient = [];
  private listClientToConvert = [];

  private allContactsCrm = [];
  private relatedPipeline: Pipeline;
  public isPermittedOrganisationUpdate = false;
  public organisation: any;
  public reasonForChange: Array<ReasonForChange>;
  public showHistoricOpportunity = false;
  public CRMPermissions = CRM_PERMISSION.CRMPermissions;

  constructor(private sideNavService: SideNavService,
              private categoryService: CategoryService,
              private urlService: UrlServicesService,
              private contactService: ContactCrmService,
              private itemService: ItemService,
              private opportunityService: OpportunityService,
              private organisationService: OrganisationService,
              private tiersService: TiersService,
              private exactDate: ExactDate,
              private pipelineService: PipelineService,
              private currencyService: CurrencyService,
              private  growlService: GrowlService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private spinnerService: SpinnerService,
              private translateService: TranslateService,
              private router: Router,
              private claimService: ClaimCrmService,
              private permissionService: PermissionService,
              public authService: AuthService,
              private userService: UserService) {

  }

  ngOnInit() {
    this.getDataFromUrl();
    this.initTypesList();
    this.getOpportunityToUpdate();
    this.predicate = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    this.selectedPermission();
  }

  getDataFromUrl() {
    this.activatedRoute.params.subscribe(params => {
      this.opportunityId = +params['id'] || 0;
    });
  }

  getOpportunityToUpdate() {
    this.opportunityService.getJavaGenericService().getEntityById(this.opportunityId, '/details/').subscribe((data) => {
      this.detailsData = data;
      this.fillOpportunityData();
      this.reasonForChange = data.reasonForChanges;
      if (this.reasonForChange.length > 0) {
        this.showHistoricOpportunity = true;
      }
    });
  }

  initComponent() {
    this.createForme();
    this.getListOfCurrency();
    this.getCategoryList();
  }

  initFomrControlsDataInProspectMode() {
    this.organizationFromControlName = OpportunityConstant.ORGANIZATION_FC_NAME;
    this.visAvisFromControlName = OpportunityConstant.VIS_A_VIS_FC_NAME;
  }

  initTypesList() {
    this.opportunityTypes = EnumValues.getNames(OpportunityType).map((type: any) => {
      return type = {enumValue: type, enumText: this.translateService.instant(type)};
    });
  }

  initFomrControlsDataInClientMode() {
    this.organizationFromControlName = OpportunityConstant.CLIENT_FC_NAME;
    this.visAvisFromControlName = OpportunityConstant.VIS_A_VIS_CLIENT_FC_NAME;
  }

  fillOpportunityData() {
    if (this.detailsData) {
      this.isCaseToConvertOpportunity = false;
      this.opportunityIsBeingLost = false;
      this.opportunityIsBeingWon = false;
      this.stepCollapse = false;
      this.isStepChanged = false;
      this.currentPositionPipe = this.detailsData.currentPositionPipe;
      this.spinnerService.showLoader();
      this.relatedContact = null;
      this.relatedClientContact = null;
      this.relatedOrganisation = null;
      this.relatedClientOrganisation = null;
      this.initComponent();
      this.opportunity = this.detailsData;
      this.selectedOppType = this.detailsData.opportunityType;
      this.createForme(this.opportunity);
      this.getOpportunityDetails();
      this.creationDate = new Date(this.opportunityFormGroup.value.opportunityCreatedDate);
      this.endDate = this.opportunityFormGroup.value.opportunityEndDate != null ?
        new Date(this.opportunityFormGroup.value.opportunityEndDate) : null;

      if (this.opportunityFormGroup.value.opportunityEndDate != null) {
        this.endDate = new Date(this.opportunityFormGroup.value.opportunityEndDate);
      } else {
        this.endDate = null;
        this.maxCreationDate = new Date();
      }
    }

  }


  createForme(opportunity?: Opportunity) {
    this.opportunityFormGroup = this.fb.group({
      id: [opportunity ? opportunity.id : 0],
      title: [opportunity ? opportunity.title : '', Validators.required],
      rating: [opportunity ? Number(opportunity.rating) : undefined],
      responsableUserId: [opportunity ? opportunity.responsableUserId : undefined],
      opportunityCreatedDate: [opportunity ? opportunity.opportunityCreatedDate : undefined, Validators.required],
      opportunityEndDate: [opportunity ? opportunity.opportunityEndDate : undefined],
      estimatedIncome: [opportunity ? opportunity.estimatedIncome : undefined, [Validators.min(0)]],
      currencyId: [opportunity ? opportunity.currencyId : undefined],
      employeeId: [opportunity ? opportunity.employeeId : undefined],
      productIdList: [opportunity ? opportunity.productIdList : []],
      description: [opportunity ? opportunity.description : ''],
      customerId: [opportunity && this.checkOpportunityTypeProspect(opportunity) ? opportunity.customerId : ''],
      idClientContact: [opportunity && this.checkOpportunityTypeClient(opportunity) ? opportunity.idClientContact : ''],
      organisationId: [opportunity && this.checkOpportunityTypeProspect(opportunity) ? opportunity.organisationId : ''],
      idClientOrganization: [opportunity && this.checkOpportunityTypeClient(opportunity) ? opportunity.idClientOrganization : ''],
      category: [opportunity ? opportunity.category : '', Validators.required],
      currentPositionPipe: [opportunity ? opportunity.currentPositionPipe : ''],
      closedPositionPipe: [opportunity ? opportunity.closedPositionPipe : ''],
      reasonForChange: [opportunity ? opportunity.reasonForChange : ''],
    });
  }

  setFormControlsValidators() {
    if (this.isProspectType) {
      this.opportunityFormGroup.controls[OpportunityConstant.ORGANIZATION_FC_NAME].setValidators(Validators.required);
      this.opportunityFormGroup.controls[OpportunityConstant.CLIENT_FC_NAME].clearValidators();
    } else {
      this.opportunityFormGroup.controls[OpportunityConstant.CLIENT_FC_NAME].setValidators(Validators.required);
      this.opportunityFormGroup.controls[OpportunityConstant.ORGANIZATION_FC_NAME].clearValidators();
    }
  }

  get opportunityEndDate(): FormControl {
    return this.opportunityFormGroup.get(OpportunityConstant.END_DATE) as FormControl;
  }

  isContactComboxIsRedOnly(): boolean {
    return ((!this.opportunityFormGroup.controls.organisationId.value)
      && (!this.opportunityFormGroup.controls.idClientOrganization.value));
  }

  backToList() {
    const previousURL = this.urlService.getPreviousUrl().toString();
    const entity = previousURL.substring(10, previousURL.indexOf('/', 10)).toUpperCase();
    switch (entity) {
      case  'CONTACT':
        this.router.navigateByUrl(this.urlService.getPreviousUrl()
          , {skipLocationChange: true});
        break;
      case 'ORGANISATION' :
        this.router.navigateByUrl(this.urlService.getPreviousUrl()
          , {skipLocationChange: true});
        break;
      case 'ARCHIVING' :
        this.router.navigateByUrl(OpportunityConstant.OPPORTUNITY_ARCHIVING_URL
          , {skipLocationChange: true});
        break;
      default :
        this.router.navigateByUrl(OpportunityConstant.LIST_OPPORTUNITIES_URL
          , {skipLocationChange: true});
    }
  }

  checkBackInterface() {
    return this.urlService.getBackMessage();
  }

  getCategoryList() {
    this.categoryService.getJavaGenericService().getEntityList().subscribe(
      (data) => {
        this.categoriesList = data;
        this.fillCategoriesTypes();
      });
  }

  private fillCategoriesTypes() {
    this.categoriesList.forEach(categoryTypeList => {
      if (this.categoriesTypes.indexOf(categoryTypeList.categoryType) < NumberConstant.ZERO) {
        this.categoriesTypes.push(categoryTypeList.categoryType);
      }
    });
  }

  getOpportunityDetails() {
    const data = this.detailsData;
    this.maxCreationDate = data.opportunityEndDate != null ? new Date(data.opportunityEndDate) : new Date();
    this.minCreatedDate = new Date(data.opportunityCreatedDate);
    this.minOpportunityEndDate = new Date(data.opportunityCreatedDate);
    this.opportunity.statusList = data.statusList;
    this.convertRatingToStars(data);
    if (data.productIdList != null && data.productIdList.length > 0) {
      this.getProductList(data);
    }
    this.initDetailForm(data);
  }

  private convertRatingToStars(data: Opportunity) {
    this.rating = Number(data.rating) / NumberConstant.TWENTY;
  }

  private getProductList(data: Opportunity) {
    const listIdProductCategory = data.category.products.map(x => {
      return x.id;
    });
    this.itemService.getItemsAfterFilter(listIdProductCategory).subscribe(product => {
      this.listProducts = [];
      product.listData.forEach(p => this.listProducts.push(p));
    });
  }

  private initDetailForm(opportunity) {
    this.categoriesList = [];
    this.categoriesList.push(opportunity.category);
    this.categoryType = opportunity.category.type;

    this.category = opportunity.category;
    this.fillStatusList(opportunity);
    this.getRelatedPipeline(opportunity);
    this.filterByCategoryList(opportunity.categoryId, opportunity.responsableUserId);
    this.getRelatedCurrency(opportunity.currencyId);
    if (this.checkOpportunityTypeProspect(opportunity)) {
      this.isProspectType = true;
      this.initAllContactCrm();
      this.getContactsByProspectOrganizationId(opportunity.organisationId, opportunity.customerId ? opportunity.customerId : undefined);
      this.initFomrControlsDataInProspectMode();
      this.getOrganizationListProspectType(opportunity.organisationId);
    } else if (this.checkOpportunityTypeClient(opportunity)) {
      this.isProspectType = false;
      this.isPermittedOrganisationUpdate = true;
      this.initFomrControlsDataInClientMode();
      this.getRelatedClientOrganisation(opportunity.idClientOrganization);
      this.getAllTiersContactList(opportunity.idClientOrganization, opportunity.idClientContact ? opportunity.idClientContact : undefined);
    }
    this.setFormControlsValidators();
    return opportunity;
  }

  private fillStatusList(opprtunity) {
    this.listStatus = [];
    this.listStatus = opprtunity.statusList;
  }

  private getCurentStatus(opportunity: Opportunity) {
    const pipeStep: PipelineStep =
      this.relatedPipeline.pipelineSteps.find(pipelineStep => pipelineStep.order - 1 === opportunity.currentPositionPipe);
    if (pipeStep) {
      this.currentStatus = pipeStep.relatedStatus;
      this.relatedStatus = pipeStep.relatedStatus;
    }
  }

  private getRelatedPipeline(opportunity: Opportunity) {
    this.relatedPipeline = this.category.pipeline;
    this.getCurentStatus(opportunity);
  }

  private initAllContactCrm() {
    this.contactService.getJavaGenericService().getEntityList().subscribe((contacts) => {
      this.allContactsCrm = contacts;
    });
  }

  getRelatedOrganisation(id: number) {
    const entityName = OrganisationConstant.ORGANISATION_ENTITY;
    forkJoin(this.organisationService.getJavaGenericService().getEntityById(id),
      this.permissionService.getJavaGenericService().getData(PermissionConstant.PERMISSION_BY_ENTITY_URL + '/entityName/' +
        entityName + '/entityId/' + id)).subscribe(data => {
      this.relatedOrganisation = data[NumberConstant.ZERO];
      this.isPermittedOrganisationUpdate = this.organisationList.some(org => org.id === id);
    });
  }

  private getOrganizationListProspectType(id: number) {
    this.organisationList = [];
    this.searchedOrganizationsList = [];
    this.organisationService.getJavaGenericService().getEntityList('')
      .subscribe(data => {
          this.organisationList = data;
          this.searchedOrganizationsList = data;
          this.getRelatedOrganisation(id);
        }
      );
  }

  getRelatedContact(id: number) {
    this.contactService.getJavaGenericService().getEntityById(id).subscribe((contact) => {
      if (contact) {
        this.relatedContact = contact;
        this.selectedItemContact = contact;
      }
    });
  }


  getRelatedClientOrganisation(id: number) {
    this.organisationList = [];
    this.searchedOrganizationsList = [];
    let clientsList = [];
    this.tiersService.processDataServerSide(this.predicate).subscribe(data => {
      clientsList = data.data;
      this.organisationList = clientsList.map((organization) => this.convertClientToOrganisation(organization));
      this.searchedOrganizationsList = clientsList.map((organization) => this.convertClientToOrganisation(organization));
      this.relatedClientOrganisation = this.organisationList.find((client) => client.id === id);
    });
  }

  private getAllTiersContactList(orgClientId: number, contactId?: number) {
    this.contactList = [];
    this.contactListByOrganization = [];
    this.tiersService.getContactTiers().subscribe((data: any) => {
      this.relatedClientContactDetail = data.listData.find((contact) => contact.Id === contactId);
      this.allContactTiers = data.listData.map((contact) => this.prepareContactTier(contact));
      this.contactList = this.allContactTiers.filter(contact => contact.IdTiers === orgClientId);
      this.contactListByOrganization = this.allContactTiers.filter(contact => contact.IdTiers === orgClientId);

      if (this.contactList.length > NumberConstant.ZERO && contactId) {
        this.relatedClientContact = this.contactList.find((contact) => contact.id === contactId);
        this.selectedItemContact = this.relatedClientContact;
      }
    });
  }

  prepareContactTier(contactTier) {
    const contact = new ContactCrm(contactTier.Email, contactTier.Phone, contactTier.HomePhone,
      contactTier.OtherPhone, contactTier.AssistantName, contactTier.AssistantPhone, contactTier.Fax1,
      contactTier.Facebook, contactTier.Twitter, contactTier.Name, contactTier.Linkedin, contactTier.LastName,
      contactTier.Function, contactTier.DateOfBirth, contactTier.Description, contactTier.Adress);
    contact.fullName = `${contactTier.FirstName}  ${contactTier.LastName}`;
    contact.id = contactTier.Id;
    contact.IdTiers = contactTier.IdTiers;
    return contact;
  }

  convertClientToOrganisation(client): Organisation {
    return new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter,
      this.translateService.instant(AddNewOpportunityComponent.TRANSLATE_CUSTOMER));
  }

  filterByCategoryList(id: number, responsableId) {
    this.opportunityService.getOpportunityByCategoryAndIsArchiving(id, this.isArchivingMode)
      .subscribe(data => {

        const responsableListId = data.categoryResponsableIds;

        if (this.categoryType === OpportunityConstant.TYPE_STAFFING) {
          const employeeListId = data.categoryUsersId.STAFFING;
          let listEmployeesResponsables = [];
          listEmployeesResponsables = listEmployeesResponsables.concat(responsableListId)
            .concat(employeeListId)
            .concat(responsableId);
          if (listEmployeesResponsables.length > NumberConstant.ZERO) {
            this.userService.getUsersListByArray(listEmployeesResponsables).subscribe(list => {
              const listEmployeesDetails = [];
              const listResponsablesDetails = [];
              employeeListId.forEach(employeeId => {
                listEmployeesDetails.push(list.find(emp => emp.Id === employeeId));
              });
              responsableListId.forEach(responseId => {
                listResponsablesDetails.push(list.find(resp => resp.Id === responseId));
              });
              this.employeesByCategory = listEmployeesDetails;
              this.responsableByCategory = listResponsablesDetails;
              this.relatedResponsable = list.find(employee => employee.Id === responsableId);
            });
          }
        } else {
          this.userService.getUsersListByArray(responsableListId).subscribe(list => {
            const listResponsablesDetails = [];
            responsableListId.forEach(responseId => {
              listResponsablesDetails.push(list.find(resp => resp.Id === responseId));
            });
            this.responsableByCategory = listResponsablesDetails;
            this.relatedResponsable = list.find(employee => employee.Id === responsableId);
          });
        }
      });
  }

  getListOfCurrency() {
    this.currencyService.listdropdown().subscribe((data: any) => {
      this.currencyDataSource = data.listData;
      this.currencyFiltredDataSource = this.currencyDataSource;
    });
  }

  getRelatedCurrency(id: number) {
    if (id !== 0) {
      this.currencyService.getById(id).subscribe((data) => {
        this.currency = data;
      });
    }
  }

  checkTiersAndUpdate() {
    if (this.isCaseToConvertOpportunity) {
      this.prepareClientsAndContactsToSaveInDotNet();
    } else {
      this.update();
    }
  }

  createTiersAndConvert(tiers) {
    if (this.checkValidateAttributs() && this.opportunityFormGroup.valid && this.opportunityRelatedPermissions.permissionValidForm) {
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
      this.tiersService.saveTiers(tiers, true).subscribe(data => {
        if (data) {
          this.getCustomerOfClientConverted(data.Id);
          this.isCaseToConvertOpportunity = false;
          this.opportunityIsBeingWon = false;
          this.opportunityIsBeingLost = false;
        }
      });
    } else if (this.opportunityFormGroup.controls['reasonForChange'].invalid) {
      this.stepCollapse = true;
      this.opportunityFormGroup.controls[CrmConstant.REASON_OF_CHANGE].markAsTouched();
      this.opportunityFormGroup.controls[CrmConstant.REASON_OF_CHANGE].updateValueAndValidity();
    }
  }

  prepareClientsAndContactsToSaveInDotNet() {
    const organisation: Organisation = this.organisationList.find(x => x.id === this.opportunity.organisationId);
    if (organisation) {
      return this.convertTierOrganisation(organisation);
    } else if (this.relatedOrganisation) {
      return this.convertTierOrganisation(this.relatedOrganisation);
    }
  }

  convertTierOrganisation(organisation) {
    const tiers: Tiers = Organisation.convertToTiers(organisation);
    tiers.Contact = new Array();
    this.contactService.getJavaGenericService().getData(ContactConstants.GET_ALL_BY_ORGANIZATION_URL.concat(organisation.id))
      .subscribe((data) => {
        tiers.Contact =  this.convertProppectToContact(data);
        this.createTiersAndConvert(tiers);
      });
  }

  private getCustomerOfClientConverted(clientId) {
    this.tiersService.getTiersById(clientId).subscribe((data) => {
      this.contactClientListByOrganizationClient = [];
      this.contactClientListByOrganizationClient = data.Contact;
      this.convertAllOrganizationClaims(this.detailsData.organisationId,
        data.Id, this.detailsData.customerId ? this.detailsData.customerId : undefined);
      this.convertClientsFromOpportunity();
      this.convertAllOrganizationOpportunities(this.opportunity.organisationId, data.Id);
    });
  }

  checkContactClientAndProspectEquality(client: ContactDOtNet, contact: ContactCrm) {
    if (contact && this.opportunity.opportunityType === OpportunityType.PROSPECT) {
      return client.Email === contact.mail && (client.Tel1 && contact.phone[NumberConstant.ZERO]['phone'] ?
        client.Tel1 === contact.phone[NumberConstant.ZERO]['phone'] : true);
    }
  }

  private convertAllOrganizationOpportunities(organizationId, idClientOrganization) {
    let newContactClientId;
    const opportunitiesToConvert = [];
    this.opportunityService.getJavaGenericService().getEntityById(organizationId, 'byOrganisation')
      .subscribe((opportunities: Opportunity[]) => {
        if (opportunities) {
          opportunities.forEach((opp, index) => {
            let contactById;
            if (opp.customerId) {
              contactById = this.getOpportunityContactCrm(opp.customerId);
            } else {
              contactById = null;
            }
            newContactClientId = this.setOpportunityDataByContactIdAndGetNewContactId(opp, contactById,
              idClientOrganization, newContactClientId);
            opportunitiesToConvert.push(opp);
          });
          this.convertOpportunitiesThenUpdate(opportunitiesToConvert, newContactClientId, idClientOrganization);
        }
      });
  }

  convertAllOrganizationClaims(organizationId, idClientOrganization, contactId?) {
    if (contactId) {

      this.claimService.getJavaGenericService().getData(OpportunityConstant.BY_OPPORTUNITY + this.detailsData.id +
        OpportunityConstant.BY_ORGANIZATION + organizationId + OpportunityConstant.BY_CONTACT + contactId)
        .subscribe((claims: Claim[]) => {
          this.prepareClaimToConvert(claims, idClientOrganization);
        });
    } else {
      this.claimService.getJavaGenericService().getData(OpportunityConstant.BY_OPPORTUNITY + this.detailsData.id +
        OpportunityConstant.BY_ORGANIZATION + organizationId)
        .subscribe((claims: Claim[]) => {
          this.prepareClaimToConvert(claims, idClientOrganization);
        });
    }
  }

  private prepareClaimToConvert(claims, idClientOrganization) {
    if (claims) {
      claims.forEach((claim, index) => {
        if (claim.declaredBy) {
          const contactById = this.getOpportunityContactCrm(claim.declaredBy);
          claim.idClientContact = this.setClaimDataByContactIdAndGetNewContactId(contactById).Id;
        } else {
          claim.idClientContact = null;
        }
        claim.declaredBy = null;
        claim.organizationId = null;
        claim.idClientOrganization = idClientOrganization;
        claim.claimType = ClaimType.CLIENT;
        this.convertClaim(claim);
      });
    }
  }

  private convertClaim(claim) {
    this.claimService.getJavaGenericService().updateEntity(claim, claim.id).subscribe();
  }

  private convertOpportunitiesThenUpdate(opportunities, newContactClientId, idClientOrganization) {
    this.opportunityService.convertAllOpportunitiesToClients(opportunities).subscribe((result) => {
      if (result) {
        this.opportunityFormGroup.controls[OpportunityConstant.CLIENT_FC_NAME].setValue(idClientOrganization);
        this.opportunityFormGroup.controls[OpportunityConstant.VIS_A_VIS_CLIENT_FC_NAME].setValue(newContactClientId);
        this.update(OpportunityType.CLIENT);
      }
    });
  }

  private setOpportunityDataByContactIdAndGetNewContactId(oppToConvert, contact, newIdClientOrganization, newContactClientId) {
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

  private setClaimDataByContactIdAndGetNewContactId(contact) {
    let contactConverted;
    if (contact) {
      contactConverted = this.contactClientListByOrganizationClient.find((client: any) =>
        this.checkContactClientAndProspectEquality(client, contact));
    }
    return contactConverted;
  }

  getOpportunityContactCrm(oppContactId) {
    return this.allContactsCrm.find(contact => contact.id === oppContactId);
  }


  update(opportunityType?) {
    this.titleIsAlreadyTaken = false;
    const estimatedIncome = this.opportunityFormGroup.value.estimatedIncome;
    // tslint:disable-next-line:max-line-length
    if (this.checkValidateAttributs() && this.opportunityFormGroup.valid && this.opportunityRelatedPermissions.permissionValidForm && this.opportunityCreatedDateIsInvalid === false && this.opportunityEndDateIsInvalid === false) {
      this.opportunityFormGroup.controls[CrmConstant.RATING].setValue(this.rating);
      // tslint:disable-next-line:radix
      this.opportunityFormGroup.controls[CrmConstant.ESTIMATED_INCCOME].setValue(parseInt(estimatedIncome));
      this.opportunityFormGroup.controls[CrmConstant.RESPONSABLE_ID].setValue(this.relatedResponsable.Id);
      const valueToSend: Opportunity = this.opportunityFormGroup.value;
      this.checkOpportunityTypeAndSetControl(valueToSend, opportunityType);
      this.endDate ? valueToSend.opportunityEndDate = this.exactDate.getDateExact(this.endDate) : valueToSend.opportunityEndDate = null;
      valueToSend.opportunityCreatedDate = this.exactDate.getDateExact(this.creationDate);
      this.checkTitleAndUpdate(valueToSend);
    } else if (this.opportunityFormGroup.controls['reasonForChange'].invalid) {
      this.stepCollapse = true;
      this.opportunityFormGroup.controls[CrmConstant.REASON_OF_CHANGE].markAsTouched();
      this.opportunityFormGroup.controls[CrmConstant.REASON_OF_CHANGE].updateValueAndValidity();
    }
  }

  private checkTitleAndUpdate(valueToSend: Opportunity) {
    this.opportunityService.getJavaGenericService().checkTitleAndUpdateOpportunity(valueToSend,
      this.opportunity.id).subscribe(result => {
      const data = JSON.parse(result);
      if (data != null) {
        this.checkTitleErrorCode(data);
      }
      this.backToList();
    });
  }

  private checkTitleErrorCode(data) {
    if (data.errorCode === OpportunityConstant.OPPORTUNITE_TITLE_ALL_READY_EXIST) {
      this.titleIsAlreadyTaken = true;
      this.opportunityFormGroup.controls[OpportunityConstant.TITLE].markAsPending();
    } else {
      this.passeToUpdateMode.emit({'isUpdate': false});
      this.isStepChanged = false;
      this.stepCollapse = false;
      if (this.canUpdatePermission) {
        this.permissionService.updatePermission(this.opportunityRelatedPermissions, this.opportunityEntityName, data.id).subscribe();
      }
      this.growlService.successNotification(this.translateService.instant(OrganisationConstant.SUCCESS_OPERATION));
      this.backToList();
      this.componentIsUpdade.emit();
      this.opportunity = data;
    }
  }

  private checkOpportunityTypeAndSetControl(valueToSend: Opportunity, opportunityType) {
    if (!opportunityType) {
      if (this.checkOpportunityTypeProspect(this.opportunity)) {
        valueToSend.opportunityType = OpportunityType.PROSPECT;
      } else if (this.checkOpportunityTypeClient(this.opportunity)) {
        valueToSend.opportunityType = OpportunityType.CLIENT;
      }
    } else {
      valueToSend.opportunityType = opportunityType;
      if (opportunityType === OpportunityType.CLIENT) {
        valueToSend.organisationId = null;
        valueToSend.customerId = null;
      }
    }
  }

  checkValidateAttributs() {
    if (this.opportunityFormGroup.value.category.type === OpportunityConstant.TYPE_PRODUCT_SALE) {
      this.opportunityFormGroup.controls[CrmConstant.PRODUCT_LIST].setValidators([Validators.required]);

    } else if (this.opportunityFormGroup.value.category.type === OpportunityConstant.TYPE_STAFFING) {
      this.opportunityFormGroup.controls[CrmConstant.PRODUCT_LIST].clearValidators();
    } else {
      return false;
    }
    this.opportunityFormGroup.controls[CrmConstant.PRODUCT_LIST].updateValueAndValidity();

    return true;
  }

  showOrganisationComponent() {
    if (this.checkOpportunityTypeProspect(this.opportunity) && this.isPermittedOrganisationUpdate) {
      this.showDetailOrganisationEvent.emit({isProspect: true, data: this.relatedOrganisation.id});
    } else if (this.relatedClientOrganisation) {
      this.showDetailOrganisationEvent.emit({isProspect: false, data: this.relatedClientOrganisation.id});
    }
  }

  showContactComponent() {
    if (this.checkOpportunityTypeProspect(this.opportunity) && this.isPermittedContact) {
      this.showDetailContactEvent.emit({value: true, data: this.relatedContact});
    } else {
      this.relatedClientContactDetail.organisationName = this.relatedClientOrganisation.name;
      this.showDetailContactEvent.emit({value: true, data: this.relatedClientContactDetail});
    }
  }

  changeOrganizationSelection(organizationSelected) {
    if (organizationSelected) {
      this.selectedItemContact = null;
      this.contactList = [];
      this.contactListByOrganization = [];
      if (this.isProspectType) {
        this.opportunityFormGroup.controls[CrmConstant.CUSTOMER_ID].setValue(null);
        this.getContactsByProspectOrganizationId(organizationSelected.id);
        this.getRelatedOrganisation(organizationSelected.id);
      } else {
        this.opportunityFormGroup.controls[OpportunityConstant.VIS_A_VIS_CLIENT_FC_NAME].setValue(null);
        this.getAllTiersContactList(organizationSelected.id);
      }
    } else {
      if (this.isProspectType) {
        this.opportunityFormGroup.controls[CrmConstant.CUSTOMER_ID].setValue(null);
      } else {
        this.opportunityFormGroup.controls[OpportunityConstant.VIS_A_VIS_CLIENT_FC_NAME].setValue(null);
      }
    }
  }


  private getContactsByProspectOrganizationId(organizationId: number, idContact?) {
    this.contactList = [];
    this.contactListByOrganization = [];
    this.contactService.getJavaGenericService().getEntityById(organizationId, CrmConstant.BY_ORGANISATION_URL)
      .subscribe((contacts: ContactCrm[]) => {
        this.contactList = contacts;
        this.contactListByOrganization = contacts;
        this.setContactFullName();
        if (this.contactList.length > NumberConstant.ZERO && idContact) {
          this.getContactById(idContact);
          this.getRelatedContact(idContact);
        } else if (idContact && !this.contactList.some(contact => contact.id === idContact)) {
          this.contactService.getJavaGenericService().getEntityById(idContact).subscribe((contact) => {
            if (contact) {
              this.relatedContact = contact;
              this.isPermittedContact = false;
            }
          });
        }
      });
  }

  setContactFullName() {
    this.contactListByOrganization.map((contact) => {
      contact.fullName = contact.name.concat(' ').concat(contact.lastName);
    });
  }

  private getContactById(idContact) {
    this.selectedItemContact = this.contactList.find(x => x.id === idContact);
    if (this.selectedItemContact) {
      this.opportunityFormGroup.controls[CrmConstant.CUSTOMER_ID].setValue(this.selectedItemContact.id);
    }
  }

  getCompleteNameContact() {
    if (this.checkOpportunityTypeProspect(this.opportunity)) {
      return (this.relatedContact == null || Object.keys(this.relatedContact).length === 0) ? '' :
        this.relatedContact.name.concat(' ').concat(this.relatedContact.lastName);
    } else if (this.checkOpportunityTypeClient(this.opportunity)) {
      return (this.relatedClientContact == null || Object.keys(this.relatedClientContact).length === 0) ? '' :
        this.relatedClientContact.fullName;
    }
  }

  getNameOrganization() {
    if (this.checkOpportunityTypeProspect(this.opportunity)) {
      return (this.relatedOrganisation == null || Object.keys(this.relatedOrganisation).length === 0) ? '' : this.relatedOrganisation.name;
    } else if (this.checkOpportunityTypeClient(this.opportunity)) {
      return (this.relatedClientOrganisation == null || Object.keys(this.relatedClientOrganisation).length === 0) ? '' :
        this.relatedClientOrganisation.name;
    }
  }

  private checkOpportunityTypeProspect(opportunity) {
    return opportunity.opportunityType === OpportunityType.PROSPECT;
  }

  private checkOpportunityTypeClient(opportunity) {
    return opportunity.opportunityType === OpportunityType.CLIENT;
  }

  chooseStep(event) {
    const selectedStep = this.relatedPipeline.pipelineSteps.find(step => step.relatedStatus.id === event.id);
    const currentStep = this.relatedPipeline.pipelineSteps.find(step => step.relatedStatus.id === this.relatedStatus.id);

    if (this.isProspectType && selectedStep) {
      this.isCaseToConvertOpportunity = (selectedStep.state === EnumValues.getNameFromValue(PipelineState, PipelineState.SUCCESS_FINAL_STATE));
    } else if (!this.isProspectType && selectedStep) {
      this.opportunityIsBeingWon = (selectedStep.state === EnumValues.getNameFromValue(PipelineState, PipelineState.SUCCESS_FINAL_STATE));
    }
    if (selectedStep) {
      this.opportunityFormGroup.controls['currentPositionPipe'].setValue(selectedStep.order - 1);
      this.opportunityIsBeingLost = (selectedStep.state === EnumValues.getNameFromValue(PipelineState, PipelineState.FAILURE_FINAL_STATE));
    }
    this.opportunityFormGroup.controls['reasonForChange'].setValue('');
    this.isStepChanged = !(currentStep.id === selectedStep.id);
    if (!this.isStepChanged) {
      this.opportunityFormGroup.controls[CrmConstant.REASON_OF_CHANGE].clearValidators();
    } else {
      this.opportunityFormGroup.controls[CrmConstant.REASON_OF_CHANGE].setValidators([Validators.required]);
    }
    this.opportunityFormGroup.controls[CrmConstant.REASON_OF_CHANGE].updateValueAndValidity();
    this.currentStatus = event;

  }

  listIdProduct(items) {
    this.opportunityFormGroup.controls[CrmConstant.PRODUCT_LIST].setValue(items);
  }

  changeEndDate(event) {
    this.opportunityEndDateIsInvalid = (event < this.opportunityFormGroup.controls['opportunityCreatedDate'].value) ? true : false;
    this.endDate = new Date(event);
    if (this.endDate < this.creationDate) {
      this.opportunityEndDateIsInvalid = true;
    } else {
      this.opportunityEndDateIsInvalid = false;
    }
  }

  changeCreatedDate(event) {
    this.creationDate = new Date(event);
    if (this.endDate < this.creationDate) {
      this.opportunityCreatedDateIsInvalid = true;
    } else {
      this.opportunityCreatedDateIsInvalid = false;
    }
  }

  convertProppectToContact(contactCrm: ContactCrm[]) {
    const contacts: ContactDOtNet[] = new Array();
    for (const c of contactCrm) {
      const contact: ContactDOtNet = new ContactDOtNet();
      contact.Email = c.mail;
      contact.FirstName = c.name;
      contact.LastName = c.lastName;
      contact.Fonction = c.poste;
      contact.Tel1 = c.phone > NumberConstant.ZERO ? c.phone[NumberConstant.ZERO]['phone'] : '';
      contact.Fax1 = c.fax;
      contact.Twitter = c.twitter;
      contact.Facebook = c.facebook;
      contact.Linkedin = c.linkedIn;
      contact.DateToRemember = this.convertDatesToRemember(c);
      contact.Phone = this.convertPhone(c.phone);
      contact.Adress = c.adress ? (c.adress.country && c.adress.city) ? `${c.adress.country} ${c.adress.city} ${c.adress.country} ${c.adress.zipCode}` : ' ' : '';
      contacts.push(contact);
    }
    return contacts;
  }

  convertPhone(phones): any {
    const phone = [];
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

  getValueButton(): string {
    switch (this.source) {
      case  FileConstant.CONTACT:
        return this.translateService.instant(OpportunityConstant.BACK_TO_CONTACT);
      case FileConstant.ORGANISATION :
        return this.translateService.instant(OpportunityConstant.BACK_TO_ORGANIZATION);
      default :
        return this.translateService.instant(OpportunityConstant.BACK_TO_LIST);
    }

  }

  get currencyId(): FormControl {
    return this.opportunityFormGroup.get('currencyId') as FormControl;
  }

  changeEstimatedIncome(event) {
    if (this.opportunityFormGroup.controls['currencyId'].value === 0) {
      this.opportunityFormGroup.controls['currencyId'].setValue(undefined);
    }
    if (this.opportunityFormGroup.controls[CrmConstant.ESTIMATED_INCCOME].value &&
      this.opportunityFormGroup.controls[CrmConstant.ESTIMATED_INCCOME].value > 0) {
      this.currencyId.setValidators([Validators.required]);
      this.currencyId.updateValueAndValidity();
    } else {
      this.opportunityFormGroup.controls['currencyId'].setValue(undefined);
      this.currencyId.clearValidators();
      this.currencyId.updateValueAndValidity();
    }
  }

  handleOrganizationFilter(organization) {
    this.searchedOrganizationsList = this.organisationList.filter(organ => organ.name.toLowerCase()
      .indexOf(organization.toLowerCase()) !== -1);
  }

  handleContactsFilter(searchedContact) {
    if (this.isProspectType) {
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


}
