import {Component, ComponentRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from '../../../../payroll/services/employee/employee.service';
import {TranslateService} from '@ngx-translate/core';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {Router} from '@angular/router';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {Organisation} from '../../../../models/crm/organisation.model';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {ContactCrm} from '../../../../models/crm/contactCrm.model';
import {Opportunity} from '../../../../models/crm/opportunity.model';
import {OpportunityService} from '../../../services/opportunity.service';
import {ClaimCrmService} from '../../../services/claim/claim.service';
import {Observable} from 'rxjs/Observable';
import {Claim} from '../../../../models/crm/claim.model';
import {ClaimConstants} from '../../../../constant/crm/claim.constant';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {GenericCrmService} from '../../../generic-crm.service';
import {AddNewOpportunityComponent} from '../../opportunity/add-new-opportunity/add-new-opportunity.component';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {TiersConstants} from '../../../../constant/purchase/tiers.constant';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {ClaimType} from '../../../../models/crm/enums/claimType.enum';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {ClaimConstant} from '../../../../constant/helpdesk/claim.constant';
import {ActionConstant} from '../../../../constant/crm/action.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {Employee} from '../../../../models/payroll/employee.model';
import {DropdownService} from '../../../services/dropdowns/dropdown.service';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import {UserService} from '../../../../administration/services/user/user.service';

@Component({
  selector: 'app-add-claim',
  templateUrl: './add-claim.component.html',
  styleUrls: ['./add-claim.component.scss']
})
export class AddClaimComponent implements OnInit, IModalDialog {
  public addFormGroup: FormGroup;
  public claimsCategoriesList = [];
  public claimsCategoriesListFiltred = [];
  public organizationsList: Array<Organisation>;
  public contactsList: Array<ContactCrm>;
  public prospectContactsList: Array<ContactCrm>;
  public tiersContactList = [];
  public organizationClientList = [];
  public opportunitiesClientList = [];
  public opportunitiesList: Array<Opportunity>;
  public gravitiesList = [];
  public stateList = [];
  public gravitiesListFiltred = [];
  public stateListFiltred = [];
  public minDeadLine: Date = new Date();
  public clickedProspectOnce = true;
  public clickedClientOnce = true;
  public prospectType = true;
  public predicate: PredicateFormat;
  public openFirstCollapse = true;
  public openSecondCollapse = false;
  public isModal;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  private source: string;
  private sourceId: number;
  private isProspect: boolean;
  public contactReadOnly: boolean;
  public organisationReadOnly: boolean;
  public opportunityReadOnly: boolean;
  private claimId: Number;
  private claimEntityName = ClaimConstants.CLAIM;

  public searchedOpportunitiesList = [];
  public searchedContactsList = [];
  public searchedOrganizationList = [];
  public listRespUser: Array<Employee> = [];
  public listRespUserFiltred: Array<Employee> = [];
  public listConcernedEmployees: Array<Employee> = [];
  public listConcernedEmployeesFiltred: Array<Employee> = [];

  public listUsers = [];
  public Users = [];
  public listUsersFilter = [];
  private connectedUser: any;
  public predicateResClaim: PredicateFormat;

  /**
   * @param fb
   * @param employeeService
   * @param translate
   * @param claimService
   * @param validationService
   * @param contactService
   * @param genericCrmService
   * @param organizationService
   * @param opportunitiesService
   * @param growlService
   * @param tiersService
   * @param router
   * @param modalService
   */
  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              private claimService: ClaimCrmService,
              private validationService: ValidationService,
              private contactService: ContactCrmService,
              private genericCrmService: GenericCrmService,
              private organizationService: OrganisationService,
              private opportunitiesService: OpportunityService,
              private growlService: GrowlService,
              private tiersService: TiersService,
              private router: Router,
              private modalService: ModalDialogInstanceService,
              private dropdownService: DropdownService,
              private localStorageService: LocalStorageService,
              private userService: UserService) {
    this.predicate = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
  }

  ngOnInit() {
    this.getConnectedUser();
    this.loadIndividualUsersListReclamation();
    this.createAddForm();
    this.initGravitiesDropDowns();
    this.initStateDropDowns();
    this.initCategoriesDropDown();
    if (!this.isModal) {
      this.initProspectDropdowns();
    } else {
      this.initClaimModel();
    }
  }

  private initProspectDropdowns() {
    this.initOrganizationsDropDown();
    this.initOpportunitiesDropDown();
  }

  private createAddForm(): void {
    this.addFormGroup = this.fb.group({
      topic: ['', [Validators.required]],
      category: [null],
      organizationId: [''],
      declaredBy: [''],
      deadline: [''],
      gravity: [null],
      state: [null],
      assignedTo: [''],
      description: [''],
      idClientOrganization: [''],
      idClientContact: [''],
      responsablesUsersId: ['', Validators.required],
    });
  }

  convertClaimFormToClaim(form: FormGroup) {
    let claim: Claim;
    claim = form.value;
    claim.claimType = this.prospectType ? ClaimType.PROSPECT : ClaimType.CLIENT;
    claim.idClientContact = (!this.prospectType) ? form.value.declaredBy : null;
    claim.idClientOrganization = (!this.prospectType) ? form.value.organizationId : null;
    claim.declaredBy = this.prospectType ? form.value.declaredBy : null;
    claim.organizationId = this.prospectType ? form.value.organizationId : null;
    return claim;
  }

  save() {
    if (this.addFormGroup.valid) {
      this.claimService.getJavaGenericService().saveEntity(this.convertClaimFormToClaim(this.addFormGroup))
        .subscribe((_data) => {
          if (_data) {
            this.addFormGroup.reset();
            this.claimId = _data.id;
            this.growlService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
            if (!this.isModal) {
              this.router.navigate([ClaimConstants.CLAIM_LIST_URL]);
            } else {
              this.closeModale();
            }
          }
        }, () => {
          this.growlService.ErrorNotification(this.translate.instant(ActionConstant.FAILURE_OPERATION));
        });
    } else {
      this.validationService.validateAllFormFields(this.addFormGroup);
    }
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
        }
      });
  }


  initGravitiesDropDowns() {
    this.dropdownService.getAllFiltreByName('GRAVITY', 'CLAIM')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.gravitiesList.push(filtreName.name);
              this.gravitiesListFiltred.push(filtreName.name);
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
    this.organizationsList = [];
    this.searchedOrganizationList = [];
    this.organizationService.getJavaGenericService().getEntityList()
      .subscribe(data => {
          if (data) {
            this.organizationsList = data;
            this.searchedOrganizationList = data;
            this.setValueModel(ClaimConstant.ORGANISATION, 'organizationId');
          }
        }
      );
  }

  initContactsDropDown(event) {
    if (event) {
      this.addFormGroup.controls['declaredBy'].setValue(null);
      this.checkTypeAndSetContacts(event);
    } else {
      if (this.prospectType) {
        this.filterAssociatedProspects();
      } else {
        this.clearFields();
        this.initClientDropsDown();
      }
    }
  }

  private checkTypeAndSetContacts(event) {
    if (this.prospectType) {
      this.getOpportunitiesRelatedToOrganization(event);
      this.getContactsByProspectOrganizationId(event);
    } else {
      this.fillOpportunityAndContactFromOrganization(event);
      this.getContactsByClientOrganizationId(event);
    }
  }

  getOpportunitiesRelatedToOrganization(organizationId: number) {
    this.opportunitiesService.getJavaGenericService().getEntityById(organizationId, CrmConstant.BY_ORGANIZATION_ID).subscribe(
      (opportunity) => {
        if (opportunity) {
          this.opportunitiesList = [];
          this.opportunitiesList = this.opportunitiesList.concat(opportunity);

          this.searchedOpportunitiesList = [];
          this.searchedOpportunitiesList = this.searchedOpportunitiesList.concat(opportunity);
        }
      }
    );
  }

  private getContactsByClientOrganizationId(event) {
    this.contactsList = [];
    this.contactsList = this.tiersContactList.filter(contact => contact.IdTiers === event);

    this.searchedContactsList = [];
    this.searchedContactsList = this.tiersContactList.filter(contact => contact.IdTiers === event);
  }

  private getTiersContactList() {
    this.tiersContactList = [];
    this.contactsList = [];
    this.searchedContactsList = [];
    this.tiersService.getContactTiers().subscribe((data: any) => {
      data.listData.forEach(a => {
        a.fullName = a.FirstName.concat(' ', a.LastName);
        a.id = a.Id;
        this.tiersContactList.push(a);
      });
      this.contactsList = this.tiersContactList;
      this.searchedContactsList = this.tiersContactList;

      this.setValueModel(ClaimConstant.CONTACT, 'declaredBy');
      this.selectDefaultValue();
    });
  }

  private getContactsByProspectOrganizationId(event) {
    this.contactsList = [];
    this.searchedContactsList = [];

    this.contactService.getJavaGenericService().getData(CrmConstant.BY_ORGANISATION_URL.concat('/').concat(event))
      .subscribe((contacts: ContactCrm[]) => {
        contacts.forEach((contact, index) => {
          this.getContactFullName(contact);
        });
        this.contactsList = contacts;
        this.searchedContactsList = contacts;

      });
  }

  initOpportunitiesDropDown() {
    this.opportunitiesList = [];
    this.searchedOpportunitiesList = [];

    this.prospectType ? this.getProspectTypeOpportunities() : this.getClientTypeOpportunities();
  }

  private getProspectTypeOpportunities() {
    this.opportunitiesService.getJavaGenericService().getEntityList('prospect').subscribe((data) => {
      this.opportunitiesList = data;
      this.searchedOpportunitiesList = data;

      this.setValueModel(ClaimConstant.OPPORTUNITY, 'assignedTo');
    }, () => {

    }, () => {
      this.getDefaultContactList();
    });
  }

  private getClientTypeOpportunities() {
    this.opportunitiesClientList = [];
    this.opportunitiesService.getJavaGenericService().getEntityList('client').subscribe((data) => {
      this.opportunitiesClientList = data;
      this.opportunitiesList = data;
      this.searchedOpportunitiesList = data;

      this.setValueModel(ClaimConstant.OPPORTUNITY, 'assignedTo');
    }, () => {

    }, () => {
      this.getDefaultContactList();
    });
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericCrmService.handleCanDeactivateToLeaveCurrentComponent(this.isClaimFormGroupChanged.bind(this));
  }

  isClaimFormGroupChanged(): boolean {
    let isChanged = false;
    Object.keys(this.addFormGroup.controls).forEach(control => {
      isChanged = isChanged === false ? !!this.addFormGroup.controls[control].value : true;
    });
    return isChanged;
  }

  getContactFullName(contact: ContactCrm) {
    contact.fullName = contact.name.concat(' ').concat(contact.lastName);
  }

  getDefaultContactList() {
    this.contactsList = [];
    this.searchedContactsList = [];

    this.contactService.getJavaGenericService().getEntityList()
      .subscribe((contacts: ContactCrm[]) => {
        contacts.forEach((contact, index) => {
          this.getContactFullName(contact);
        });
        this.prospectContactsList = contacts;
        this.contactsList = contacts;
        this.searchedContactsList = contacts;

        this.setValueModel(ClaimConstant.CONTACT, 'declaredBy');
        this.selectDefaultValue();
      });
  }


  handleFiltreClaimsCategories(value) {
    // this.claimsCategoriesList = this.claimsCategoriesListFiltred.filter(c => c.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);

  }

  handleFiltreGravities(value) {
    // this.gravitiesList = this.gravitiesListFiltred.filter(c => c.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);

  }

  handleFiltreState(value) {
    // this.stateList = this.stateListFiltred.filter(c => c.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);

  }

  public switchToProspectList() {
    if (this.clickedProspectOnce) {
      this.setControlsToNull();
      this.prospectType = !this.prospectType;
      this.initProspectDropdowns();
    }
    this.clickedProspectOnce = false;
    this.clickedClientOnce = true;
  }

  public switchToClientList() {
    if (this.clickedClientOnce) {
      this.setControlsToNull();
      this.prospectType = !this.prospectType;
      this.getTiersListCustomerType();
      this.getTiersContactList();
      this.initOpportunitiesDropDown();
    }
    this.clickedClientOnce = false;
    this.clickedProspectOnce = true;
  }

  private setControlsToNull() {
    this.addFormGroup.controls['idClientOrganization'].setValue(null);
    this.addFormGroup.controls['idClientContact'].setValue(null);
    this.addFormGroup.controls['organizationId'].setValue(null);
    this.addFormGroup.controls['declaredBy'].setValue(null);
  }

  private getTiersListCustomerType() {
    this.organizationsList = [];
    this.searchedOrganizationList = [];

    this.organizationClientList = [];
    this.tiersService.processDataServerSide(this.predicate).subscribe(data => {
      data.data.forEach((client) => {
        this.organizationClientList.push(this.convertClientToOrganisation(client));
      });
      this.organizationsList = this.organizationClientList;
      this.searchedOrganizationList = this.organizationClientList;

      this.setValueModel(ClaimConstant.ORGANISATION, 'organizationId');
    });
  }

  convertClientToOrganisation(client): Organisation {
    return new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter,
      this.translate.instant(AddNewOpportunityComponent.TRANSLATE_CUSTOMER));
  }

  changeSelectedOpportunity(opp) {
    if (opp) {
      this.contactsList = [];
      this.searchedContactsList = [];

      this.organizationsList = [];
      this.searchedOrganizationList = [];

      if (this.prospectType) {
        this.getOrganizationRelatedToOpportunity(opp);
        if (this.checkOpportunityHaveContact(opp)) {
          this.getContactRelatedToOpportunity(opp);
        } else {
          this.addFormGroup.controls['declaredBy'].setValue(null);
        }
      } else {
        this.fillOrganizationAndContactFromOpportunity(opp);
      }
    } else {
      if (this.prospectType) {
        this.filterAssociatedProspects();
      } else {
        this.initClientDropsDown();
      }
    }

  }

  private checkOpportunityHaveContact(opportunityId: number): boolean {
    const foundOpp: Opportunity = this.opportunitiesList.find(opp => opp.id === opportunityId);
    return !!foundOpp.customerId;
  }

  clearField(fieldName) {
    this.addFormGroup.controls[fieldName].setValue(null);
  }

  fillOrganizationAndContactFromOpportunity(oppId) {
    this.opportunitiesService.getJavaGenericService().getEntityById(oppId).subscribe(
      (opportunities) => {
        if (opportunities) {
          opportunities.forEach(opportunity => {
            this.organizationsList = this.organizationClientList
              .filter(organization => organization.id === opportunity.idClientOrganization);
            this.searchedOrganizationList = this.organizationClientList
              .filter(organization => organization.id === opportunity.idClientOrganization);

            this.addFormGroup.controls['organizationId'].setValue(opportunity.idClientOrganization);
            this.contactsList = this.tiersContactList.filter(contact => contact.id === opportunity.idClientContact);
            this.searchedContactsList = this.tiersContactList.filter(contact => contact.id === opportunity.idClientContact);

            this.addFormGroup.controls['declaredBy'].setValue(opportunity.idClientContact);
          });
        }
      }
    );
  }

  getOrganizationRelatedToOpportunity(opportunityId: number) {
    this.organizationService.getJavaGenericService().getEntityById(opportunityId, CrmConstant.BY_OPPORTUNITY_ID).subscribe(
      (org) => {
        if (org) {
          this.organizationsList.push(org);
          this.searchedOrganizationList.push(org);

          this.addFormGroup.controls['organizationId'].setValue(org.id);
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
          this.searchedContactsList.push(contact);

          this.addFormGroup.controls['declaredBy'].setValue(contact.id);
        }
      });
  }

  filterAssociatedProspects() {
    this.clearFields();
    this.initProspectDropdowns();
  }

  clearFields() {
    this.addFormGroup.controls['assignedTo'].setValue(null);
    this.addFormGroup.controls['declaredBy'].setValue(null);
    this.addFormGroup.controls['organizationId'].setValue(null);
  }

  initClientDropsDown() {
    this.organizationsList = this.organizationClientList;
    this.searchedOrganizationList = this.organizationClientList;

    this.contactsList = this.tiersContactList;
    this.searchedContactsList = this.tiersContactList;

    this.opportunitiesList = this.opportunitiesClientList;
    this.searchedOpportunitiesList = this.opportunitiesClientList;

  }

  fillOpportunityAndContactFromOrganization(organizationId) {
    this.opportunitiesService.getJavaGenericService().getEntityById(organizationId, CrmConstant.BY_ORGANIZATION_CLIENT_ID).subscribe(
      (opportunities) => {
        if (opportunities) {
          opportunities.forEach(opportunity => {
            this.opportunitiesList = this.opportunitiesClientList
              .filter(opportunitySelected => opportunitySelected.id === opportunity.id);
            this.searchedOpportunitiesList = this.opportunitiesClientList
              .filter(opportunitySelected => opportunitySelected.id === opportunity.id);
          });
        }
      }
    );
  }

  changeSelectedContact(contact) {
    if (contact) {
      if (this.prospectType) {
        this.getOrganizationRelatedToContact(contact);
      } else {
        this.fillOpportunityAndOrganizationFromContact(contact);
      }
    } else {
      if (this.prospectType) {
        this.filterAssociatedProspects();
      } else {
        this.clearFields();
        this.initClientDropsDown();
      }
      this.clearField('declaredBy');
    }
  }

  getOrganizationRelatedToContact(contactId: number) {
    this.opportunitiesList = [];
    this.searchedOpportunitiesList = [];

    this.organizationsList = [];
    this.searchedOrganizationList = [];
    this.organizationService.getJavaGenericService().getEntityById(contactId, CrmConstant.BY_CONTACT_ID).subscribe(
      (org) => {
        if (org) {
          this.organizationsList.push(org);
          this.searchedOrganizationList.push(org);
          if (org.id) {
            this.addFormGroup.controls['organizationId'].setValue(org.id);
          }
        }
      }
    );
    this.opportunitiesService.getJavaGenericService().getData(`by-prospect-contact/${contactId}`).subscribe((opportunity) => {
      if (opportunity) {
        this.opportunitiesList = [];
        this.opportunitiesList = this.opportunitiesList.concat(opportunity);

        this.searchedOpportunitiesList = [];
        this.searchedOpportunitiesList = this.searchedOpportunitiesList.concat(opportunity);
      }
    });
  }

  fillOpportunityAndOrganizationFromContact(contactId) {
    this.opportunitiesList = [];
    this.searchedOpportunitiesList = [];

    this.organizationsList = [];
    this.searchedOrganizationList = [];

    const selectedContact = this.tiersContactList.find(contact => contact.id === contactId);
    if (selectedContact) {
      this.organizationsList = this.organizationClientList.filter(org => org.id === selectedContact.IdTiers);
      this.searchedOrganizationList = this.organizationClientList.filter(org => org.id === selectedContact.IdTiers);

      this.addFormGroup.controls['organizationId'].setValue(selectedContact.IdTiers);
    }
    this.opportunitiesService.getJavaGenericService().getEntityById(contactId, CrmConstant.BY_CONTACT_CLIENT_ID).subscribe(
      (opportunities) => {
        if (opportunities) {
          opportunities.forEach(opportunity => {
            this.opportunitiesList = this.opportunitiesClientList
              .filter(opportunitySelected => opportunitySelected.id === opportunity.id);
            this.searchedOpportunitiesList = this.opportunitiesClientList
              .filter(opportunitySelected => opportunitySelected.id === opportunity.id);

            const relatedOrganization = this.organizationClientList
              .find(organization => organization.id === opportunity.idClientOrganization);
            if (relatedOrganization) {
              this.organizationsList = [];
              this.organizationsList.push(relatedOrganization);

              this.searchedOrganizationList = [];
              this.searchedOrganizationList.push(relatedOrganization);
              this.addFormGroup.controls['organizationId'].setValue(relatedOrganization.id);
            }
          });
        }
      }
    );
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.source = this.optionDialog.data.source;
    this.sourceId = this.optionDialog.data.sourceId;
    this.isProspect = this.optionDialog.data.isProspect;
    this.isModal = true;
  }

  closeModale() {
    this.optionDialog.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }

  switchClientListModel() {
    if (!this.isProspect) {
      this.switchToClientList();
    } else {
      this.initProspectDropdowns();
    }
  }

  initClaimModel() {
    if (this.source && this.sourceId) {
      this.switchClientListModel();
    }
  }

  setValueModel(source, field) {
    if (this.source === source && this.isModal) {
      this.addFormGroup.controls[field].setValue(this.sourceId);
    }
  }

  selectDefaultValue() {
    switch (this.source) {
      case ClaimConstant.CONTACT:
        this.changeSelectedContact(this.sourceId);
        this.organisationReadOnly = true;
        this.contactReadOnly = true;
        break;
      case ClaimConstant.OPPORTUNITY:
        this.changeSelectedOpportunity(this.sourceId);
        this.opportunityReadOnly = true;
        this.organisationReadOnly = true;
        this.contactReadOnly = true;
        break;
      case ClaimConstant.ORGANISATION:
        this.initContactsDropDown(this.sourceId);
        this.organisationReadOnly = true;
        break;
      default :
        break;
    }
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

  onBackToListOrCancel() {
    if (this.isModal) {
      this.closeModale();
    } else {
      this.router.navigateByUrl(ClaimConstants.CLAIM_LIST_URL);
    }
  }



  handleResponsablesFilter(userSearched) {
    this.listUsers = this.listUsersFilter.filter(responsable => responsable.FullName.toLowerCase()
      .includes(userSearched.toLowerCase()));
  }


  loadIndividualUsersListReclamation() {
    this.predicateResClaim = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicate).subscribe(data => {
      this.listUsers = data.data;
      this.listUsersFilter = data.data;
      this.filterUsers();
    }, () => {
      this.growlService.ErrorNotification(this.translate.instant(SharedCrmConstant.FAILURE_OPERATION));
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
