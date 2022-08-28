import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {ClaimConstants} from '../../../../constant/crm/claim.constant';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {ContactCrm} from '../../../../models/crm/contactCrm.model';
import {Organisation} from '../../../../models/crm/organisation.model';
import {Opportunity} from '../../../../models/crm/opportunity.model';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {OpportunityService} from '../../../services/opportunity.service';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {ClaimCrmService} from '../../../services/claim/claim.service';
import {Claim} from '../../../../models/crm/claim.model';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ExactDate} from '../../../../shared/helpers/exactDate';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {ClaimSideNavService} from '../../../services/sid-nav/claim-side-nav.service';
import {ClaimType} from '../../../../models/crm/enums/claimType.enum';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {TiersConstants} from '../../../../constant/purchase/tiers.constant';
import {AddNewOpportunityComponent} from '../../opportunity/add-new-opportunity/add-new-opportunity.component';
import {ContactDOtNet} from '../../../../models/crm/contactDotNet.model';
import {PermissionService} from '../../../services/permission/permission.service';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {PermissionConstant} from '../../../../constant/crm/permission.constant';
import {PermissionType} from '../../../../models/crm/enums/PermissionType';
import {OpportunityConstant} from '../../../../constant/crm/opportunityConstant';
import {UrlServicesService} from '../../../services/url-services.service';
import {DropdownService} from '../../../services/dropdowns/dropdown.service';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {Employee} from '../../../../models/payroll/employee.model';
import {EmployeeService} from '../../../../payroll/services/employee/employee.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import {UserService} from '../../../../administration/services/user/user.service';

@Component({
  selector: 'app-detail-claim',
  templateUrl: './detail-claim.component.html',
  styleUrls: ['./detail-claim.component.scss']
})
export class DetailClaimComponent implements OnInit {

  public predicate: PredicateFormat;
  public claimsCategoriesList = [];
  public claimsCategoriesListFiltred = [];
  public organizationsList: Array<Organisation>;
  public organizationsListFiltred: Array<Organisation>;
  public opportunitiesList: Array<Opportunity>;
  public opportunitiesListFiltred: Array<Opportunity>;
  public contactsList: Array<ContactCrm>;
  public tiersContactList = [];
  public organizationClientList = [];
  public opportunitiesClientList = [];
  public contactsListFiltred: Array<ContactCrm>;
  public actionsGravities = [];
  public actionsGravitiesFiltred = [];
  public stateList = [];
  public stateListFiltred = [];
  public deadLine;
  public formatDate: string = this.translateService.instant(SharedConstant.DATE_FORMAT);
  public updateClaimForm: FormGroup;
  public BACK_TO_LIST = 'BACK_TO_LIST';
  private pageSize = NumberConstant.TEN;
  public showButtonModify = true;
  public claimData;
  public idClaim;
  public DETAILS = 'DETAILS';
  public dataArray: any = [];
  public organisation;
  public contact;
  public opportunity;
  public organizationFromControlName = ClaimConstants.ORGANIZATION_FC_NAME;
  public declaredByFromControlName = ClaimConstants.DECLARED_BY_FC_NAME;
  public searchedOpportunitiesList = [];
  public searchedContactsList = [];
  public searchedOrganizationList = [];
  public claimTypeProspect = ClaimType.PROSPECT;
  public claimTypeClient = ClaimType.CLIENT;
  public dataDropdownFromServer = false;
  @Input() isArchivingMode = false;
  @Input() fromRelatedArchiving = false;

  @Input() claimDataFromClaimsList;
  @Input() source;
  @Output() backToList = new EventEmitter<void>();

  @Output() passeToUpdateMode = new EventEmitter<any>();

  showBackButtonToOrganisation = false;
  showBackButtonToOpportunity = false;
  public isPermittedOrganisationUpdate = false;
  public isPermittedContactUpdate = false;
  public isPermittedOpportunityUpdate = false;
  public listRespUser: Array<Employee> = [];
  public listRespUserFiltred: Array<Employee> = [];
  public listConcernedEmployees: Array<Employee> = [];
  public listConcernedEmployeesFiltred: Array<Employee> = [];

  public listUsers = [];
  public Users = [];
  public listUsersFilter = [];
  private connectedUser: any;
  public predicateResClaim: PredicateFormat;

  constructor(private translateService: TranslateService,
              private activatedRoute: ActivatedRoute,
              private swallWarning: SwalWarring,
              private validationService: ValidationService,
              private urlService: UrlServicesService,
              private sidNavService: ClaimSideNavService,
              private fb: FormBuilder,
              private organizationService: OrganisationService,
              private opportunitiesService: OpportunityService,
              private contactService: ContactCrmService,
              private claimService: ClaimCrmService,
              private growlService: GrowlService,
              private router: Router,
              private exactDate: ExactDate,
              private tiersService: TiersService,
              private permissionService: PermissionService,
              public authService: AuthService,
              private dropdownService: DropdownService,
              private employeeService: EmployeeService,
              private localStorageService: LocalStorageService,
              private userService: UserService) {
    this.predicate = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
  }

  ngOnInit() {
    this.getDataFromUrl();
    this.initCategoriesDropDown();
    this.initGravitiesDropDowns();
    this.initStateDropDowns();
    if (this.isArchivingMode) {
      this.updateClaimForm.disabled;
    }
    if (!this.updateClaimForm) {
      this.createAddForm();
    }
    this.getDataToUpdate();
    this.getConnectedUser();
    this.loadIndividualUsersListReclamation();
  }

  getDataFromUrl() {
    this.activatedRoute.params.subscribe(params => {
      this.idClaim = +params['id'] || 0;
    });
  }


  getDataToUpdate() {
    this.claimService.getJavaGenericService().getEntityById(this.idClaim).subscribe((data) => {
      this.fillGridSettings(data);
    });
  }


  private createAddForm(): void {
    this.updateClaimForm = this.fb.group({
      topic: ['', [Validators.required]],
      category: [''],
      organizationId: [''],
      declaredBy: [''],
      deadline: [''],
      gravity: [''],
      state: [''],
      assignedTo: [''],
      description: [''],
      idClientOrganization: [''],
      idClientContact: [''],
      responsablesUsersId: ['', Validators.required],
    });
  }


  isUpdateButtonIsShown(): boolean {
    return this.source ? false : this.showButtonModify;
  }

  returnToParent() {
    this.router.navigateByUrl(this.urlService.getPreviousUrl());
  }

  returnToList() {
    const previousURL = this.urlService.getPreviousUrl().toString();
    const entity = previousURL.substring(10, previousURL.indexOf('/', 10)).toUpperCase();
    switch (entity) {
      case  'OPPORTUNITY':
        this.router.navigateByUrl(this.urlService.getPreviousUrl()
          , {skipLocationChange: true});
        break;
      case  'CONTACT':
        this.router.navigateByUrl(this.urlService.getPreviousUrl()
          , {skipLocationChange: true});
        break;
      case 'ORGANISATION' :
        this.router.navigateByUrl(this.urlService.getPreviousUrl()
          , {skipLocationChange: true});
        break;
      case 'ARCHIVING' :
        this.router.navigateByUrl(ClaimConstants.CLAIM_ARCHIVING_URL
          , {skipLocationChange: true});
        break;
      default :
        if (this.isArchivingMode) {
          this.router.navigateByUrl(ClaimConstants.CLAIM_ARCHIVING_URL
            , {skipLocationChange: true});
        } else {
          this.router.navigateByUrl(ClaimConstants.CLAIM_LIST_URL
            , {skipLocationChange: true});
        }
    }
  }

  validateAndReturn() {
    this.passeToUpdateMode.emit({'isUpdate': false});
    this.backToList.emit();
    this.router.navigateByUrl(ClaimConstants.CLAIM_LIST_URL);
  }

  getValueButton(): string {
    return this.urlService.getBackMessage();
  }

  fillGridSettings(data) {
    this.createAddForm();
    this.getClaimDetails(data);
  }

  clearSelection() {
    this.organisation = null;
    this.contact = null;
    this.opportunity = null;
  }

  getClaimDetails(claim) {
    this.clearSelection();
    this.claimData = claim;
    this.isArchivingMode = claim.archived;
    this.deadLine = this.claimData.deadline ? new Date(this.claimData.deadline) : this.claimData.deadline;
    if (this.checkClaimType(ClaimType.PROSPECT)) {
      this.initOrganizationsDropDown();
      this.getProspectTypeOpportunities();
      this.initFormControlsDataInProspectMode();
      if (claim.organizationId) {
        this.initContactsDropDown(this.claimData.organizationId);
        this.getOrganisation(this.claimData.organizationId);
      } else {
        this.setPermission();
        this.getDefaultContactList();
      }

    } else if (this.checkClaimType(ClaimType.CLIENT)) {
      this.setPermission();
      this.getClientTypeOpportunities();
      this.initFormControlsDataInClientMode();
      this.getTiersContactList();
      this.getTiersOrganisationList();
    }
    if (this.claimData.assignedTo) {
      this.getAssignedTo(this.claimData.assignedTo);
    } else {
      this.isPermittedOpportunityUpdate = true;
    }
    this.dataArray = [];
    this.dataArray.push(this.claimData);
    this.updateClaimForm.patchValue(claim);
  }

  private setPermission() {
    this.isPermittedOrganisationUpdate = true;
    this.isPermittedContactUpdate = true;
    this.isPermittedOpportunityUpdate = true;
  }

  initCategoriesDropDown() {
    this.dropdownService.getAllFiltreByName('Type', 'CLAIM')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.claimsCategoriesList.push(filtreName.name);
              this.claimsCategoriesListFiltred.push(filtreName.name);
            }
          );
          this.dataDropdownFromServer = true;
        }
      });
  }

  initGravitiesDropDowns() {
    this.dropdownService.getAllFiltreByName('GRAVITY', 'CLAIM')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.actionsGravities.push(filtreName.name);
              this.actionsGravitiesFiltred.push(filtreName.name);
            }
          );
        }
      });
  }

  initStateDropDowns() {
    this.dropdownService.getAllFiltreByName('STATE', 'CLAIM')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.stateList.push(filtreName.name);
              this.stateListFiltred.push(filtreName.name);
            }
          );
        }
      });
  }


  initOrganizationsDropDown() {
    this.organizationService.getJavaGenericService().getEntityList()
      .subscribe(data => {
          if (data) {
            this.organizationsList = data;
            this.organizationsListFiltred = data;
          }
        }
      );
  }

  getDefaultContactList() {
    this.contactService.getJavaGenericService().getEntityList()
      .subscribe((contacts: ContactCrm[]) => {
        contacts.forEach((contact, index) => {
          this.getContactFullName(contact);
        });
        this.contactsList = contacts;
        this.contactsListFiltred = contacts;
      });
  }

  checkClaimType(type) {
    return this.claimData.claimType === type;
  }

  initContactsDropDown(event) {
    if (event) {
      this.updateClaimForm.controls[this.declaredByFromControlName].setValue(null);
      if (this.checkClaimType(ClaimType.PROSPECT)) {
        this.getProspectContactList(event);
      } else if (this.checkClaimType(ClaimType.CLIENT)) {
        this.initClientContactsDropDown(event);
        if (this.contactsList.length > NumberConstant.ZERO) {
          this.getClientDeclaredBy(this.contactsList[NumberConstant.ZERO].id);
        }
      }
    } else {
      this.clearField(ClaimConstants.CLIENT_DECLARED_BY_FC_NAME);
      this.clearFields();
      this.initClientDropsDown();
    }
  }

  changeSelectedContact(contact) {
    if (contact) {
      if (this.checkClaimType(ClaimType.PROSPECT)) {
        this.getOrganizationRelatedToContact(contact);
      } else if (this.checkClaimType(ClaimType.CLIENT)) {
        this.fillOpportunityAndOrganizationFromContact(contact);
      }
    } else {
      if (this.checkClaimType(ClaimType.PROSPECT)) {
        this.filterAssociatedProspects();
      } else if (this.checkClaimType(ClaimType.CLIENT)) {
        this.clearField(ClaimConstants.CLIENT_ORGANIZATION_FC_NAME);
        this.clearField('assignedTo');
        this.initClientDropsDown();
      }
      this.clearField('declaredBy');
    }
  }

  filterAssociatedProspects() {
    this.clearFields();
    this.initProspectDropdowns();
  }

  private initProspectDropdowns() {
    this.initOrganizationsDropDown();
    this.getProspectTypeOpportunities();
    this.getDefaultContactList();
  }

  clearFields() {
    this.updateClaimForm.controls['assignedTo'].setValue(null);
    this.updateClaimForm.controls['declaredBy'].setValue(null);
    this.updateClaimForm.controls['organizationId'].setValue(null);
  }

  fillOpportunityAndOrganizationFromContact(contactId) {
    this.opportunitiesList = [];
    this.organizationsList = [];
    this.fillOrganizationFromContact(contactId);
    this.opportunitiesService.getJavaGenericService().getEntityById(contactId, CrmConstant.BY_CONTACT_CLIENT_ID).subscribe(
      (opportunities) => {
        if (opportunities) {
          opportunities.forEach(opportunity => {
            this.opportunitiesList = this.opportunitiesClientList
              .filter(opportunitySelected => opportunitySelected.id === opportunity.id);
            this.updateClaimForm.controls['assignedTo'].setValue(opportunities.id);
          });
        }
      }
    );
  }

  private fillOrganizationFromContact(contactId) {
    const contact: ContactDOtNet = this.tiersContactList.find(tier => tier.id === contactId);
    if (contact) {
      const relatedOrganization = this.organizationClientList
        .find(organization => organization.id === contact.IdTiers);
      if (relatedOrganization) {
        this.organizationsList.push(relatedOrganization);
        this.updateClaimForm.controls[ClaimConstants.CLIENT_ORGANIZATION_FC_NAME].setValue(relatedOrganization.id);
      }
    }
  }

  getOrganizationRelatedToContact(contactId: number) {
    this.opportunitiesList = [];
    this.organizationsList = [];
    this.organizationService.getJavaGenericService().getEntityById(contactId, CrmConstant.BY_CONTACT_ID).subscribe(
      (org) => {
        if (org) {
          this.organizationsList.push(org);
          this.getOpportunitiesRelatedToOrganization(org.id);
          this.updateClaimForm.controls['organizationId'].setValue(org.id);
        }
      }
    );
  }

  clearField(fieldName) {
    this.updateClaimForm.controls[fieldName].setValue(null);
  }

  getOpportunitiesRelatedToOrganization(organizationId: number) {
    this.opportunitiesService.getJavaGenericService().getEntityById(organizationId, CrmConstant.BY_ORGANIZATION_ID).subscribe(
      (opportunity) => {
        if (opportunity) {
          this.opportunitiesList = [];
          this.opportunitiesList = this.opportunitiesList.concat(opportunity);
        }
      }
    );
  }

  changeSelectedOpportunity(opp) {
    if (opp) {
      this.contactsList = [];
      this.organizationsList = [];
      if (this.checkClaimType(ClaimType.PROSPECT)) {
        this.getOrganizationRelatedToOpportunity(opp);
        this.getContactRelatedToOpportunity(opp);
      } else if (this.checkClaimType(ClaimType.CLIENT)) {
        this.fillOrganizationAndContactFromOpportunity(opp);
      }
    } else {
      if (this.checkClaimType(ClaimType.PROSPECT)) {
        this.filterAssociatedProspects();
      } else if (this.checkClaimType(ClaimType.CLIENT)) {
        this.initClientDropsDown();
        this.clearField(ClaimConstants.CLIENT_ORGANIZATION_FC_NAME);
        this.clearField(ClaimConstants.CLIENT_DECLARED_BY_FC_NAME);

      }
    }

  }

  fillOrganizationAndContactFromOpportunity(oppId) {
    this.opportunitiesService.getJavaGenericService().getEntityById(oppId).subscribe(
      (opportunities) => {
        const opportunity = opportunities[0];
        if (opportunity) {
          const org = this.organizationClientList
            .filter(organization => organization.id === opportunity.idClientOrganization);
          this.organizationsList = this.organizationClientList
            .filter(organization => organization.id === opportunity.idClientOrganization);
          this.updateClaimForm.controls[ClaimConstants.CLIENT_ORGANIZATION_FC_NAME].setValue(opportunity.idClientOrganization);
          this.contactsList = this.tiersContactList.filter(contact => contact.id === opportunity.idClientContact);
          this.updateClaimForm.controls[ClaimConstants.CLIENT_DECLARED_BY_FC_NAME].setValue(opportunity.idClientContact);
        }
      }
    );
  }

  getOrganizationRelatedToOpportunity(opportunityId: number) {
    this.organizationService.getJavaGenericService().getEntityById(opportunityId, CrmConstant.BY_OPPORTUNITY_ID).subscribe(
      (org) => {
        if (org) {
          this.organizationsList.push(org);
          this.updateClaimForm.controls['organizationId'].setValue(org.id);
        }
      }
    );
  }

  getContactRelatedToOpportunity(opportunityId: number) {
    this.contactService.getJavaGenericService().getEntityById(opportunityId, CrmConstant.BY_OPPORTUNITY_ID)
      .subscribe((contact: ContactCrm) => {
        if (contact) {
          this.getContactFullName(contact);
          this.contactsList.push(contact);
          this.updateClaimForm.controls['declaredBy'].setValue(contact.id);
        }
      });
  }

  initClientDropsDown() {
    this.organizationsList = this.organizationClientList;
    this.contactsList = this.tiersContactList;
    this.opportunitiesList = this.opportunitiesClientList;
  }

  private getProspectContactList(event) {
    this.contactService.getJavaGenericService().getData(CrmConstant.BY_ORGANIZATION_URL.concat('/').concat(event))
      .subscribe((contacts: ContactCrm[]) => {
        contacts.forEach((contact, index) => {
          this.getContactFullName(contact);
        });
        this.contactsList = contacts;
        this.contactsListFiltred = contacts;
      }, () => {
      }, () => {
        if (this.claimData.declaredBy) {
          this.getDeclaredBy(this.claimData.declaredBy);
        } else {
          this.isPermittedContactUpdate = true;
        }
      });
  }

  checkAndSetField(formField) {
    if (formField) {
      return formField.id ? formField.id : formField;
    }
  }

  checkAndSetFieldName(formField) {
    if (formField) {
      return formField.name ? formField.name : formField;
    }
  }

  convertClaimFormToClaim(form: FormGroup) {
    let claim: Claim;
    claim = form.value;
    claim.claimType = this.claimData.claimType;
    claim.idClientOrganization = this.checkAndSetField(form.value.idClientOrganization);
    claim.idClientContact = this.checkAndSetField(form.value.idClientContact);
    claim.organizationId = this.checkAndSetField(form.value.organizationId);
    claim.declaredBy = this.checkAndSetField(form.value.declaredBy);
    claim.assignedTo = this.checkAndSetField(form.value.assignedTo);
    if (this.deadLine) {
      claim.deadline = this.exactDate.getDateExact(this.deadLine);
    }
    claim.gravity = this.checkAndSetFieldName(form.value.gravity);
    claim.state = this.checkAndSetFieldName(form.value.state);
    claim.category = this.checkAndSetFieldName(form.value.category);
    return claim;
  }

  update() {
    if (this.updateClaimForm.valid) {
      this.claimService.getJavaGenericService().updateEntity(this.convertClaimFormToClaim(this.updateClaimForm), this.claimData.id)
        .subscribe((_data) => {
          if (_data) {
            this.growlService.successNotification(this.translateService.instant(OrganisationConstant.SUCCESS_OPERATION));
            this.validateAndReturn();
          }
        }, () => {
          this.growlService.ErrorNotification(this.translateService.instant(SharedCrmConstant.FAILURE_OPERATION));
        });
    } else {
      this.validationService.validateAllFormFields(this.updateClaimForm);
    }
  }

  getOrganisation(id: number) {
    const entityName = OrganisationConstant.ORGANISATION_ENTITY;
    forkJoin(this.organizationService.getJavaGenericService().getEntityById(id),
      this.permissionService.getJavaGenericService().getData(PermissionConstant.PERMISSION_BY_ENTITY_URL + '/entityName/' +
        entityName + '/entityId/' + id)).subscribe(data => {
      this.organisation = data[NumberConstant.ZERO];
      this.isPermittedOrganisationUpdate = data[NumberConstant.ONE].type !== PermissionType.NOT_ALLOWED_TO_UPDATE;
    });
  }

  getDeclaredBy(id: number) {
    const entityName = ContactConstants.CONTACT_ENTITY_NAME;
    forkJoin(this.contactService.getJavaGenericService().getEntityById(id),
      this.permissionService.getJavaGenericService().getData(PermissionConstant.PERMISSION_BY_ENTITY_URL + '/entityName/' +
        entityName + '/entityId/' + id)).subscribe(data => {
      this.contact = data[NumberConstant.ZERO];
      this.isPermittedContactUpdate = data[NumberConstant.ONE].type !== PermissionType.NOT_ALLOWED_TO_UPDATE;
    });
  }

  getAssignedTo(id: number) {
    const entityName = OpportunityConstant.OPPORTUNITY_ENTITY;
    forkJoin(this.opportunitiesService.getJavaGenericService().getEntityById(id, 'details'),
      this.permissionService.getJavaGenericService().getData(PermissionConstant.CHECK_PERMISSION_BY_ENTITY_URL + '/entityName/' +
        entityName + '/entityId/' + id)).subscribe(data => {
      this.opportunity = data[NumberConstant.ZERO];
      this.checkCurrentUserAllowedPermissionInUpdateCase(data[NumberConstant.ONE]);
    });
  }

  private checkCurrentUserAllowedPermissionInUpdateCase(data) {
    if (data.type === PermissionType.OWNER_PERMSSION || data.createdBy === this.connectedUser.IdUser.toString()) {
      this.isPermittedOpportunityUpdate = true;
    } else {
      this.isPermittedOpportunityUpdate = false;
    }
  }

  changeEndDate(event) {
    this.deadLine = new Date(event);
  }

  getContactFullName(contact: ContactCrm) {
    contact.fullName = contact.name.concat(' ').concat(contact.lastName);
  }

  handleFiltreClaimsCategories(value) {
    // this.claimsCategoriesList = this.claimsCategoriesListFiltred.filter(c => c.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handleFiltreGravities(value) {
    this.actionsGravities = this.actionsGravitiesFiltred.filter(a => a.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handleFiltreState(value) {
    this.stateList = this.stateListFiltred.filter(c => c.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);

  }

  handleFiltreOrganisation(value) {
    this.organizationsList = this.organizationsListFiltred.filter(o => o.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handleFiltreContact(value) {
    this.contactsList = this.contactsListFiltred.filter(c => c.fullName.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handleFilterOpportunities(value) {
    this.opportunitiesList = this.opportunitiesListFiltred.filter(o => o.title.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  initFormControlsDataInProspectMode() {
    this.organizationFromControlName = ClaimConstants.ORGANIZATION_FC_NAME;
    this.declaredByFromControlName = ClaimConstants.DECLARED_BY_FC_NAME;
  }

  initFormControlsDataInClientMode() {
    this.organizationFromControlName = ClaimConstants.CLIENT_ORGANIZATION_FC_NAME;
    this.declaredByFromControlName = ClaimConstants.CLIENT_DECLARED_BY_FC_NAME;
  }

  private getTiersContactList() {
    this.tiersContactList = [];
    this.contactsList = [];
    this.tiersService.getContactTiers().subscribe((data: any) => {
      this.getClientContactsFullName(data);
      if (this.claimData.idClientContact) {
        this.getClientDeclaredBy(this.claimData.idClientContact);
      }
      this.contactsList = this.tiersContactList;
      this.contactsListFiltred = this.contactsList;
      if (this.claimData.idClientOrganization) {
        this.initClientContactsDropDown(this.claimData.idClientOrganization);
      }
    });
  }

  private getClientContactsFullName(data: any) {
    data.listData.forEach(a => {
      a.fullName = a.FirstName.concat(' ', a.LastName);
      a.id = a.Id;
      this.tiersContactList.push(a);
    });
  }

  initClientContactsDropDown(id) {
    this.contactsList = [];
    this.contactsList = this.tiersContactList.filter(contact => contact.IdTiers === id);
  }

  private getTiersOrganisationList() {
    this.organizationsList = [];
    this.organizationClientList = [];
    this.tiersService.processDataServerSide(this.predicate).subscribe(data => {
      this.organizationClientList = data.data.map((organization) => this.convertClientToOrganisation(organization));
      this.organizationsListFiltred = this.organizationClientList;
      this.organizationsList = this.organizationClientList;
      if (this.claimData.idClientOrganization) {
        this.getClientOrganisation(this.claimData.idClientOrganization);
      }
    });
  }

  getClientOrganisation(idClientOrganization) {
    this.organisation = this.organizationsList.find((client) => client.id === idClientOrganization);
  }

  getClientDeclaredBy(idClientContact) {
    this.contact = this.tiersContactList.find((client) => client.Id === idClientContact);
  }

  convertClientToOrganisation(client): Organisation {
    return new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter,
      this.translateService.instant(AddNewOpportunityComponent.TRANSLATE_CUSTOMER));
  }

  private getClientTypeOpportunities() {
    this.opportunitiesClientList = [];
    this.opportunitiesList = [];
    this.opportunitiesService.getJavaGenericService().getEntityList('client').subscribe((data) => {
      this.opportunitiesClientList = data;
      this.opportunitiesList = data;
      this.opportunitiesListFiltred = data;
    });
  }

  private getProspectTypeOpportunities() {
    this.opportunitiesService.getJavaGenericService().getEntityList('prospect').subscribe((data) => {
      this.opportunitiesList = data;
      this.opportunitiesListFiltred = data;
    });
  }

  public handleOpportunityFilter(searchedOpp) {
    this.searchedOpportunitiesList = this.opportunitiesList.filter(org => {
      return (org.title.toLowerCase()
        .indexOf(searchedOpp.toLowerCase()) !== -1);
    });
  }

  public handleContactFilter(searchedContact) {
    this.searchedContactsList = this.contactsList.filter(contact => {
      return (contact.fullName.toLowerCase()
        .indexOf(searchedContact.toLowerCase()) !== -1);
    });
  }

  public handleOrganizationFilter(searchedOrganization) {
    this.searchedOrganizationList = this.organizationsList.filter(org => {
      return (org.name.toLowerCase()
        .indexOf(searchedOrganization.toLowerCase()) !== -1);
    });
  }


  handleResponsablesFilter(responsableSearched) {
    this.listRespUser = this.listRespUserFiltred.filter(responsable => responsable.FullName.toLowerCase()
      .indexOf(responsableSearched.toLowerCase()) !== -1);
  }

  loadIndividualUsersListReclamation() {
    this.predicateResClaim = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicate).subscribe(data => {
      this.listUsers = data.data;
      this.listUsersFilter = data.data;
      this.filterUsers();
    }, () => {
    }, () => {
    });
  }

  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
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
