import {Component, ComponentRef, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {Action} from '../../../../models/crm/action.model';
import {ActionConstant} from '../../../../constant/crm/action.constant';
import {ActionService} from '../../../services/action/action.service';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {OpportunityService} from '../../../services/opportunity.service';
import {ContactCrm} from '../../../../models/crm/contactCrm.model';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {ExactDate} from '../../../../shared/helpers/exactDate';
import {ActivatedRoute, Router} from '@angular/router';
import {between, ValidationService} from '../../../../shared/services/validation/validation.service';
import {ActionSidNavService} from '../../../services/sid-nav/action-sid-nav.service';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {OpportunityConstant} from '../../../../constant/crm/opportunityConstant';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {TiersConstants} from '../../../../constant/purchase/tiers.constant';
import {Organisation} from '../../../../models/crm/organisation.model';
import {OpportunityType} from '../../../../models/crm/enums/opportunityType.enum';
import {DatePipe} from '@angular/common';
import {HttpCrmErrorCodes} from '../../../http-error-crm-codes';
import {PermissionService} from '../../../services/permission/permission.service';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {GenericCrmService} from '../../../generic-crm.service';
import {Opportunity} from '../../../../models/crm/opportunity.model';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {UrlServicesService} from '../../../services/url-services.service';
import {EventService} from '../../../services/event/event.service';
import {Address} from '../../../../models/crm/address.model';
import {DropdownService} from '../../../services/dropdowns/dropdown.service';
import {AuthService} from 'app/login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {UserService} from '../../../../administration/services/user/user.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {ContactConstants} from '../../../../constant/crm/contact.constant';

@Component({
  selector: 'app-detail-action',
  templateUrl: './detail-action.component.html',
  styleUrls: ['./detail-action.component.scss']
})
export class DetailActionComponent implements OnInit, OnChanges, IModalDialog {

  public relatedItemSource = ActionConstant.ACTION_SOURCE;

  /**
   * data of the formGroup
   */
  public deadLine: Date;
  public startDate: Date;
  public endDate: Date;

  public actionInSameRange = false;
  public steps: any = {hour: 0, minute: 30};

  public selectedState;

  public updateActionForm: FormGroup;
  public minDeadLineDate = new Date();

  private pageSize = NumberConstant.TEN;
  public showButtonModify = true;
  actionData = new Action();
  public idAction;
  public DETAILS = 'DETAILS';
  public actionsTypes = [];
  public actionsTypesFilter = [];
  public actionsPriorities = [];
  public actionsPrioritiesFilter = [];
  public actionsStates = [];
  public dataArray: any = [];

  public listCommercialAssignedTo;
  public formatDate: string = this.translateService.instant(SharedConstant.DATE_FORMAT);
  public opportunitiesList = [];
  public searchedOpportunitiesList = [];

  public contactsList = new Array<ContactCrm>();
  public searchedContactsList = [];

  public organizationList = [];
  public searchedOrganizationList = [];
  public openFirstCollapse = true;
  public openSecondCollapse = false;
  public allActions;
  public isClientMode: boolean;
  public predicate: PredicateFormat;

  public nbDays;
  public nbWeeks;
  public nbMonths;
  public nb;
  public nbHours;
  public nbMinutes;
  @Input() isArchivingMode = false;
  @Input() isFromArchive = false;
  @Input() actionDataFromActionsList;
  @Output() backToList = new EventEmitter<void>();
  @Output() passeToUpdateMode = new EventEmitter<any>();
  public commercialFullName: string;
  public source;
  public actionEntityName = ActionConstant.ACTION_ENTITY;
  public opportunitiesClientList = [];
  public contactsClientList = new Array<ContactCrm>();
  public organizationClientList = [];
  public connectedUser: any;
  public canUpdatePermission = true;
  public permission: any;
  private actionRelatedPermissions: any;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public isUpdateFromCalendarModal = false;
  private idsRemindersToDelete: number [] = [];
  public invalidStartEndTime = false;
  public duration = 0;
  public parentPermission = 'DETAIL_ACTION';
  options: any;
  overlays: any[];
  dialogVisible: boolean;

  markerTitle: string;

  selectedPosition: any;

  infoWindow: any;

  draggable: boolean;
  actionType: any;
  needLocation = false;
  public addFormGroup: FormGroup;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  public listUsers = [];
  public listUsersFilter = [];

  /***
   *
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.actionData = this.optionDialog.data.actionData;
    this.isUpdateFromCalendarModal = true;
    this.openFirstCollapse = false;
  }

  /***
   *
   * @param actionService
   * @param growlService
   * @param translateService
   * @param validationService
   * @param contactService
   * @param datePipe
   * @param sidNavService
   * @param fb
   * @param employeeService
   * @param organizationService
   * @param exactDate
   * @param router
   * @param modalService
   * @param genericCrmService
   * @param opportunitiesService
   * @param tiersService
   * @param permissionService
   */
  constructor(private actionService: ActionService,
              private growlService: GrowlService,
              private translateService: TranslateService,
              private validationService: ValidationService,
              private contactService: ContactCrmService,
              private datePipe: DatePipe,
              private sidNavService: ActionSidNavService,
              private fb: FormBuilder,
              private urlService: UrlServicesService,
              private organizationService: OrganisationService,
              private exactDate: ExactDate,
              private router: Router,
              private modalService: ModalDialogInstanceService,
              private activatedRoute: ActivatedRoute,
              private genericCrmService: GenericCrmService,
              private opportunitiesService: OpportunityService,
              private tiersService: TiersService,
              private permissionService: PermissionService,
              private eventService: EventService,
              private dropdownService: DropdownService,
              public authService: AuthService,
              private userService: UserService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    this.getDataFromUrl();
    this.selectedPermission();
    this.initEnumsDropsDowns();
    if (!this.updateActionForm) {
      this.createAddForm();
    }
    this.getDataToUpdate();
    this.getConnectedUser();
    this.loadIndividualUsersList();
  }

  getDataFromUrl() {
    this.activatedRoute.params.subscribe(params => {
      this.idAction = +params['id'] || 0;
    });
    if (this.isUpdateFromCalendarModal) {
      this.idAction = this.actionData.id;
    }
  }

  getDataToUpdate() {
    if (this.idAction) {
      this.actionService.getJavaGenericService().getEntityById(this.idAction).subscribe((data) => {
        this.fillGridSettings(data);
        this.idsRemindersToDelete = [];
      });
    }
  }

  /**
   * Initialize Dropdowns :
   * Opportunity, Contact and Organization
   */
  private initDropDownsAssignedTo() {
    this.initOpportunitiesDropDown();
    this.initContactsDropDown();
    this.initOrganizationsDropDown();
  }

  setDatesValues() {
    if (this.actionData.deadLine) {
      this.updateActionForm.controls['deadLine'].setValue(new Date(this.actionData.deadLine));
    }
  }

  checkDateValidity() {
    this.actionInSameRange = false;
    const startDateValue = this.startDate ?
      new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate(), this.startDate.getHours(),
        this.startDate.getMinutes()) : null;
    const endDateValue = this.endDate ?
      new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate(), this.endDate.getHours(),
        this.endDate.getMinutes()) : null;
    const deadLineDateValue = this.deadLine ?
      new Date(this.deadLine.getFullYear(), this.deadLine.getMonth(), this.deadLine.getDate()) : null;
    const startDateWithoutTime = startDateValue ? startDateValue.setHours(0, 0, 0, 0) : null;
    const endDateWithoutTime = endDateValue ? endDateValue.setHours(0, 0, 0, 0) : null;
    this.makeFieldIncorrect('deadLine', false);
    this.makeFieldIncorrect('startDate', false);
    this.makeFieldIncorrect('endDate', false);
    this.updateActionForm.patchValue({'startDate': this.startDate});
    this.updateActionForm.patchValue({'endDate': this.endDate});
    this.updateDateValidation();
    this.invalidStartEndTime = false;
    if (endDateValue && startDateValue) {
      this.calculateDuration(this.startDate, this.endDate);
    } else {
      this.duration = 0;
    }
    if (startDateValue && deadLineDateValue && (deadLineDateValue < startDateValue)) {
      this.makeFieldIncorrect('deadLine', true);
      this.makeFieldIncorrect('startDate', true);
    }
    if (endDateValue && startDateValue && (startDateValue > endDateValue)) {
      this.makeFieldIncorrect('startDate', true);
      this.makeFieldIncorrect('endDate', true);
    }
    if (endDateValue && deadLineDateValue && (endDateValue > deadLineDateValue)) {
      this.makeFieldIncorrect('deadLine', true);
      this.makeFieldIncorrect('endDate', true);
    }
    this.checkStartTimeValidation(startDateValue, endDateValue, startDateWithoutTime, endDateWithoutTime);
  }


  private makeFieldIncorrect(field, value) {
    if (value) {
      this.updateActionForm.controls[field].setErrors({'incorrect': true});
    } else {
      this.updateActionForm.controls[field].setErrors(null);
    }
  }

  private minDates(date1?: any, date2?: any): Date {
    if (!date1) {
      return date2;
    } else if (!date2) {
      return date1;
    } else {
      return date1 < date2 ? date1 : date2;
    }
  }

  private maxDates(date1?: any, date2?: any): Date {
    return date1 > date2 ? date1 : date2;
  }

  update() {
    this.checkDateValidity();
    if (this.updateActionForm.valid && this.actionRelatedPermissions.permissionValidForm && !this.invalidStartEndTime) {
      if (this.isClientMode) {
        this.updateActionForm.controls['associatedOppClientId'].setValue(this.updateActionForm.value.associatedOpportunityId);
        this.updateActionForm.controls['contactClientId'].setValue(this.updateActionForm.value.contactConcernedId);
        this.updateActionForm.controls['concernedOrgClientId'].setValue(this.updateActionForm.value.organizationId);
        this.clearField('organizationId');
        this.clearField('contactConcernedId');
      }
      const actionToUpdate = this.convertActionFormToAction(this.updateActionForm);
      this.actionService.getJavaGenericService().updateEntity(actionToUpdate, this.actionData.id, 'check-same-range')
        .subscribe((isSameRange) => {
          if (isSameRange.errorCode === HttpCrmErrorCodes.ANOTHER_ACTION_FOUND_WITHIN_THE_SAME_RANGE) {
            this.actionInSameRange = true;
          } else {
            this.actionService.getJavaGenericService().updateEntity(actionToUpdate,
              this.actionData.id).subscribe((data) => {
              if (data) {
                this.growlService.successNotification(this.translateService.instant(ActionConstant.SUCCESS_OPERATION));
                if (!this.isUpdateFromCalendarModal) {
                  this.sidNavService.hide();
                  this.router.navigateByUrl(ActionConstant.ACTIONS_LIST);
                } else if (this.isUpdateFromCalendarModal) {
                  this.onCancel();
                }
              }
            }, () => {
              this.growlService.ErrorNotification(this.translateService.instant(SharedCrmConstant.FAILURE_OPERATION));
            }, () => {
              if (this.canUpdatePermission) {
                this.permissionService.updatePermission(this.actionRelatedPermissions, this.actionEntityName, this.actionData.id)
                  .subscribe();
              }
              if (this.idsRemindersToDelete.length > 0) {
                this.actionService.getJavaGenericService().sendData(ActionConstant.DELETE_REMINDERS_URL, this.idsRemindersToDelete)
                  .subscribe();
              }
            });
          }
        });
    } else {
      this.checkCollapsesOpening();
      this.validationService.validateAllFormFields(this.updateActionForm);
      this.checkDateValidity();
    }
  }

  onCancel() {
    this.optionDialog.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }

  initOrganizationsDropDown(organisationId?) {
    this.organizationService.getJavaGenericService().getEntityList().subscribe((list) => {
      this.organizationList = list;
      this.searchedOrganizationList = list;
      if (organisationId && !list.some(org => org.id === organisationId)) {
        this.organizationService.getJavaGenericService().getEntityById(organisationId).subscribe(organization => {
          this.searchedOrganizationList.push(organization);
          this.updateActionForm.controls['organizationId'].setValue(organisationId);
        });
      }
    });
  }

  changeSelectedOpportunity(opp) {
    if (opp) {
      this.contactsList = [];
      this.searchedContactsList = [];

      this.organizationList = [];
      this.searchedOrganizationList = [];

      if (!this.isClientMode) {
        this.getOrganizationRelatedToOpportunity(opp);
        this.getContactRelatedToOpportunity(opp);
      } else {
        this.fillOrganizationAndContactFromOpportunity(opp);
      }
    } else {
      if (!this.isClientMode) {
        this.filterAssociatedProspects();
      } else {
        this.initClientDropsDown();
      }
      this.clearField('organizationId');
      this.clearField('contactConcernedId');
    }
  }

  private checkOpportunityHaveContact(opportunityId: number): boolean {
    const foundOpp: Opportunity = this.opportunitiesList.find(opp => opp.id === opportunityId);
    return !!foundOpp.customerId;
  }


  fillOrganizationAndContactFromOpportunity(oppId) {
    this.opportunitiesService.getJavaGenericService().getEntityById(oppId).subscribe(
      (opportunities) => {
        if (opportunities) {
          opportunities.forEach(opportunity => {
            this.organizationList = this.organizationClientList
              .filter(organization => organization.id === opportunity.idClientOrganization);
            this.searchedOrganizationList = this.organizationClientList
              .filter(organization => organization.id === opportunity.idClientOrganization);

            this.updateActionForm.controls['organizationId'].setValue(opportunity.idClientOrganization);
            this.contactsList = this.contactsClientList.filter(contact => contact.id === opportunity.idClientContact);
            this.searchedContactsList = this.contactsClientList.filter(contact => contact.id === opportunity.idClientContact);

            this.updateActionForm.controls['contactConcernedId'].setValue(opportunity.idClientContact);
          });
        }
      }
    );
  }

  changeSelectedOrganization(organization) {
    if (organization) {
      this.contactsList = [];
      this.searchedContactsList = [];

      this.opportunitiesList = [];
      this.searchedOpportunitiesList = [];

      if (!this.isClientMode) {
        this.getOpportunityRelatedToOrganization(organization);
        this.getContactRelatedToOrganization(organization);
      } else {
        this.fillOpportunityAndContactFromOrganization(organization);
      }
    } else {
      if (!this.isClientMode) {
        this.filterAssociatedProspects();
      } else {
        this.initClientDropsDown();
      }
      this.clearField('associatedOpportunityId');
      this.clearField('contactConcernedId');
    }
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

            this.contactsList = this.contactsClientList.filter(contact => contact.id === opportunity.idClientContact);
            this.searchedContactsList = this.contactsClientList.filter(contact => contact.id === opportunity.idClientContact);

            this.updateActionForm.controls['contactConcernedId'].setValue(opportunity.idClientContact);
          });
        }
      }
    );
  }

  getContactRelatedToOrganization(organizationId: number) {
    this.contactService.getJavaGenericService().getEntityById(organizationId, CrmConstant.BY_ORGANIZATION_ID).subscribe(
      (contacts) => {
        if (contacts) {
          contacts.forEach((contact, index) => {
            this.getContactFullName(contact);
          });
          this.contactsList = this.contactsList.concat(contacts);
          this.searchedContactsList = this.searchedContactsList.concat(contacts);
        }
      }
    );
  }

  getOpportunityRelatedToOrganization(organizationId: number) {
    this.opportunitiesService.getJavaGenericService().getEntityById(organizationId, CrmConstant.BY_ORGANIZATION_ID).subscribe(
      (opportunity) => {
        if (opportunity) {
          this.opportunitiesList = this.opportunitiesList.concat(opportunity);
          this.searchedOpportunitiesList = this.searchedOpportunitiesList.concat(opportunity);

        }
      }
    );
  }

  getOrganizationRelatedToOpportunity(opportunityId: number) {
    this.organizationService.getJavaGenericService().getEntityById(opportunityId, CrmConstant.BY_OPPORTUNITY_ID).subscribe(
      (result) => {
        if (result.errorCode === OpportunityConstant.NULL_OPPORTUNITY_FOUND) {
          this.organizationList = [];
          this.searchedOrganizationList = [];

        } else {
          this.organizationList.push(result);
          this.searchedOrganizationList.push(result);

          this.updateActionForm.controls['organizationId'].setValue(result.id);
        }
      }
    );
  }

  getContactRelatedToOpportunity(opportunityId: number) {
    this.contactService.getJavaGenericService().getEntityById(opportunityId, CrmConstant.BY_OPPORTUNITY_ID)
      .subscribe((result) => {
        if (result.errorCode === OpportunityConstant.NULL_OPPORTUNITY_FOUND) {
          this.contactsList = [];
          this.searchedContactsList = [];

        } else {
          this.getContactFullName(result);
          this.contactsList.push(result);
          this.searchedContactsList.push(result);

          this.updateActionForm.controls['contactConcernedId'].setValue(result.id);
        }

      });
  }

  changeSelectedContact(contact) {
    if (contact) {
      if (!this.isClientMode) {
        this.getOrganizationRelatedToContact(contact);
      } else {
        this.fillOpportunityAndOrganizationFromContact(contact);
      }
    } else {
      if (!this.isClientMode) {
        this.filterAssociatedProspects();
      } else {
        this.initClientDropsDown();
      }
      this.clearField('associatedOpportunityId');
      this.clearField('organizationId');
    }
  }

  clearField(fieldName) {
    this.updateActionForm.controls[fieldName].setValue(null);
  }

  fillOpportunityAndOrganizationFromContact(contactId) {
    this.opportunitiesList = [];
    this.searchedOpportunitiesList = [];

    this.organizationList = [];
    this.searchedOrganizationList = [];

    this.opportunitiesService.getJavaGenericService().getEntityById(contactId, CrmConstant.BY_CONTACT_CLIENT_ID).subscribe(
      (opportunities) => {
        if (opportunities) {
          opportunities.forEach(opportunity => {
            this.opportunitiesList = this.opportunitiesClientList
              .filter(opportunitySelected => opportunitySelected.id === opportunity.id);
            this.searchedOpportunitiesList = this.opportunitiesClientList
              .filter(opportunitySelected => opportunitySelected.id === opportunity.id);

            this.organizationList = this.organizationClientList
              .filter(organization => organization.id === opportunity.idClientOrganization);
            this.searchedOrganizationList = this.organizationClientList
              .filter(organization => organization.id === opportunity.idClientOrganization);
          });
        }
      }
    );
  }

  getOrganizationRelatedToContact(contactId: number) {
    this.organizationList = [];
    this.searchedOrganizationList = [];

    this.opportunitiesList = [];
    this.searchedOpportunitiesList = [];

    this.organizationService.getJavaGenericService().getEntityById(contactId, CrmConstant.BY_CONTACT_ID).subscribe(
      (org) => {
        if (org) {
          this.getOpportunityRelatedToOrganization(org.id);
          this.organizationList.push(org);
          this.searchedOrganizationList.push(org);

        }
      }
    );
  }

  getContactFullName(contact: ContactCrm) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(contact.name) &&
      !this.genericCrmService.isNullOrUndefinedOrEmpty(contact.lastName)) {
      contact.name = contact.name.concat(' ').concat(contact.lastName);
    }
  }

  ngOnChanges() {
    this.fillGridSettings(this.actionDataFromActionsList.data.dataItem ? this.actionDataFromActionsList.data.dataItem
      : this.actionDataFromActionsList.data);
    this.setSourceSwitchData(this.actionDataFromActionsList);
    this.idsRemindersToDelete = [];
  }

  private createAddForm(): void {
    this.updateActionForm = this.fb.group({
      name: ['', [Validators.required]],
      commercialAssignedToId: [''],
      type: [''],
      deadLine: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      progress: [0, [Validators.min(0), Validators.max(100)]],
      priority: [''],
      state: [''],
      description: [''],
      contactConcernedId: [''],
      associatedOpportunityId: [''],
      organizationId: [''],
      associatedOppClientId: [''],
      contactClientId: [''],
      concernedOrgClientId: [''],
      team: [''],
      employeesPermittedTo: [''],
      parentAction: [''],
      childActions: [''],
      reminders: this.fb.array([]),
      city: [''],
      country: [''],
      address_line: [''],
      postal_code: [''],
      lat: [''],
      lng: ['']
    });
    this.addProgressValidation();
  }


  addProgressValidation() {
    if (this.selectedState === this.actionsStates[1] && !(this.updateActionForm.controls[ActionConstant.PROGRESS_FIELD].value in [1, 99])) {
      this.updateActionForm.controls[ActionConstant.PROGRESS_FIELD].setValidators(between(1, 99));
    }
  }


  returnToParent() {
    if (!this.isUpdateFromCalendarModal) {
      this.router.navigateByUrl(this.urlService.getPreviousUrl());
    } else if (this.isUpdateFromCalendarModal) {
      this.onCancel();
    }
  }

  returnToList() {
    if (!this.isUpdateFromCalendarModal) {
    const previousURL = this.urlService.getPreviousUrl() ? this.urlService.getPreviousUrl().toString() : '';
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
        this.router.navigateByUrl(ActionConstant.ACTIONS_ARCHIVING_LIST
          , {skipLocationChange: true});
        break;
      default :
        this.router.navigateByUrl(ActionConstant.ACTIONS_LIST
          , {skipLocationChange: true});
    }
    } else if (this.isUpdateFromCalendarModal) {
      this.onCancel();
    }
  }


  getValueButton(): string {
    return this.urlService.getBackMessage();
  }

  fillGridSettings(data) {
    this.passeToUpdateMode.emit({'isUpdate': false});
    this.actionData = data;
    this.idAction = data.id;
    this.duration = data.duration;
    this.loadIndividualUsersList();
    this.createAddForm();
    this.initDates();
    this.dataArray = [];
    this.dataArray.push(this.actionData);

    this.selectedState = this.actionData.state;
    this.setDatesValues();
    this.isClientMode = !!this.checkIsClient();
    if (this.isClientMode) {
      this.updateActionForm.patchValue(this.actionData);
      this.filterAssociatedClient();
    } else if (this.actionData.associatedOpportunityId) {
      this.updateActionForm.patchValue(this.actionData);
      this.fillActionFromAssociated();
    } else {
      this.initAssociatedToDropDowns();
      this.updateActionForm.patchValue(this.actionData);
    }
    this.patchActionReminders(this.actionData);
  }

  private patchActionReminders(action: Action) {
    if (action.reminders.length !== 0) {
      action.reminders.forEach(reminder => {
        this.addReminder(reminder);
      });
    }
  }

  fillActionFromAssociated() {
    this.opportunitiesService.getJavaGenericService().getEntityById(this.actionData.associatedOpportunityId, CrmConstant.DETAILS)
      .subscribe(oppo => {
        if (oppo.opportunityType === OpportunityType.CLIENT) {
          this.actionData.associatedOppClientId = this.actionData.associatedOpportunityId;
          this.actionData.concernedOrgClientId = oppo.idClientOrganization;
          this.actionData.contactClientId = oppo.idClientContact;
          this.actionData.contactConcernedId = null;
          this.actionData.organizationId = null;
          this.updateActionForm.patchValue(this.actionData);
          this.filterAssociatedClient();
        } else {
          this.initAssociatedToDropDowns();
          this.updateActionForm.patchValue(this.actionData);
        }
      });
  }

  private checkIsClient() {
    return this.actionData.associatedOppClientId || this.actionData.contactClientId ||
      this.actionData.concernedOrgClientId;
  }

  private initAssociatedToDropDowns() {
    if (this.actionData.associatedOpportunityId) {
      this.initOpportunitiesDropDown(this.actionData.associatedOpportunityId);
      this.changeSelectedOpportunity(this.actionData.associatedOpportunityId);
    } else if (this.actionData.organizationId) {
      this.initOrganizationsDropDown(this.actionData.organizationId);
      this.changeSelectedOrganization(this.actionData.organizationId);
    } else if (this.actionData.contactConcernedId) {
      this.initContactsDropDown(this.actionData.contactConcernedId);
      this.changeSelectedContact(this.actionData.contactConcernedId);
    } else {
      this.initDropDownsAssignedTo();
    }
  }

  getAttributedToName(id: number) {
    if (id) {
      this.commercialFullName = this.listCommercialAssignedTo.find(employee => employee.Id === id).FullName;
    }
  }

  setSourceSwitchData(data) {
    if (data.parent) {
      this.source = data.parent;
      this.showButtonModify = this.source === ActionConstant.ACTION;
    }
  }

  getReturnLabel(): string {
    if (this.isUpdateFromCalendarModal) {
      return ActionConstant.CANCEL_POP_UP;
    } else {
      return this.urlService.getBackMessage();
    }
  }

  setAddress(form: FormGroup, action: Action) {
    const address: Address = new Address();
    address.zipCode = form.value.postal_code;
    address.city = form.value.city;
    address.country = form.value.country;
    address.latitude = form.value.lat;
    address.longitude = form.value.lng;
    address.addressLine = form.value.address_line;
    action.address = address;
  }

  convertActionFormToAction(form: FormGroup) {
    const action: Action = form.value;
    this.setAddress(form, action);
    this.setDuration(action, this.startDate, this.endDate);
    this.setCommercialAssignedToEmail(action);
    this.setDates(action);
    return action;
  }

  private setCommercialAssignedToEmail(action: Action) {
    const assignedTo = this.listUsers.find(user => user.Id ===
      this.updateActionForm.controls['commercialAssignedToId'].value);
    action.commercialAssignedToEmail = assignedTo ? assignedTo.Email : '';
  }

  get progress(): FormControl {
    return this.updateActionForm.get(ActionConstant.PROGRESS_FIELD) as FormControl;
  }

  updateState() {
    const progress: number = this.updateActionForm.controls[ActionConstant.PROGRESS_FIELD].value ?
      (this.updateActionForm.controls[ActionConstant.PROGRESS_FIELD].value as number) : 0;
    const progressValue = +progress;
    switch (true) {
      case (progressValue === 0) :
        this.selectedState = this.actionsStates[0];
        break;
      case (progressValue > 0 && progress < 99) :
        this.selectedState = this.actionsStates[1];
        break;
      case (progressValue === 100) :
        this.selectedState = this.actionsStates[2];
        break;
    }
    this.updateProgressValidation();
  }


  updateProgressValidation() {
    this.progress.setValidators(null);
    this.progress.updateValueAndValidity();
    switch (this.selectedState) {
      case this.actionsStates[0] : {
        if (this.updateActionForm.controls[ActionConstant.PROGRESS_FIELD].value !== 0) {
          this.updateActionForm.controls[ActionConstant.PROGRESS_FIELD].setValue(0);
        }
      }
        break;

      case  this.actionsStates[1] : {
        if (!((this.updateActionForm.controls[ActionConstant.PROGRESS_FIELD].value > 0)
          && (this.updateActionForm.controls[ActionConstant.PROGRESS_FIELD].value < 100))) {
          this.progress.setValidators(between(1, 99));
          this.updateActionForm.controls[ActionConstant.PROGRESS_FIELD].markAsTouched();
          this.progress.updateValueAndValidity();
        }
      }
        break;
      case this.actionsStates[2] : {
        if (this.updateActionForm.controls[ActionConstant.PROGRESS_FIELD].value !== 100) {
          this.updateActionForm.controls[ActionConstant.PROGRESS_FIELD].setValue(100);
          this.progress.updateValueAndValidity();
        }
      }
        break;
    }
  }


  setDuration(action: Action, startDateTime, endDateTime) {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const diffMs = (end.getTime() - start.getTime());
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    action.duration = Math.abs((diffDays * 24 * 60) + (diffHrs * 60) + diffMins);
  }

  calculateDuration(startDateTime, endDateTime) {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const diffMs = (end.getTime() - start.getTime());
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    this.duration = Math.abs((diffDays * 24 * 60) + (diffHrs * 60) + diffMins);
  }

  setDates(action: Action) {
    action.startDate = this.startDate ? this.exactDate.getDateExact(this.startDate) : null;
    action.deadLine = this.deadLine ? this.exactDate.getDateExact(this.deadLine) : null;
    action.endDate = this.endDate ? this.exactDate.getDateExact(this.endDate) : null;
  }

  deleteReminder(i: number, reminder): void {
    this.reminders.removeAt(i);
    this.remindersIdsToDelete(reminder.value.id);
  }

  get reminders(): FormArray {
    return this.updateActionForm.get('reminders') as FormArray;
  }


  addReminder(reminder?): void {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(reminder)) {
      this.reminders.push(this.buildReminderForm(reminder));
    } else {
      if (this.reminders.length > NumberConstant.ZERO) {
        const reminderToAdd = this.reminders.value[this.reminders.length - NumberConstant.ONE];
        this.isValidReminder(reminderToAdd);
      } else {
        this.reminders.push(this.buildReminderForm());
      }
    }
  }

  private isValidReminder(reminder) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(reminder.reminderType) &&
      !this.genericCrmService.isNullOrUndefinedOrEmpty(reminder.delayCount) &&
      !this.genericCrmService.isNullOrUndefinedOrEmpty(reminder.delayUnity)) {
      this.reminders.push(this.buildReminderForm());
    }
  }

  private buildReminderForm(reminder?): FormGroup {
    return this.fb.group({
      id: [reminder ? reminder.id : ''],
      reminderType: [reminder ? reminder.reminderType : '', Validators.required],
      delayCount: [reminder ? reminder.delayCount : '', Validators.required],
      delayUnity: [reminder ? reminder.delayUnity : '', Validators.required],
    });
  }


  initDates() {

    if (this.actionData.startDate) {
      this.startDate = new Date(this.actionData.startDate);
    }
    if (this.actionData.endDate) {
      this.endDate = new Date(this.actionData.endDate);
    }
    this.deadLine = this.actionData.deadLine ? new Date(this.actionData.deadLine) : this.actionData.deadLine;
  }

  getElementCollapseNumber(control): number {
    if (control === 'name' || control === 'progress' || control === 'deadLine' || control === 'startDate') {
      return 1;
    }
  }

  checkCollapsesOpening() {
    for (const control in this.updateActionForm.controls) {
      const collapseNumber = this.getElementCollapseNumber(control);
      if (collapseNumber === 1 && this.openFirstCollapse === false && this.updateActionForm.controls[control].invalid) {
        this.openFirstCollapse = true;
      }
    }
  }


  initTypesDropDown() {
    this.dropdownService.getAllFiltreByName('Type', 'ACTION')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.actionsTypes.push(filtreName.name);
              this.actionsTypesFilter.push(filtreName.name);
            }
          );
        }
      });
  }

  initPrioritiesDropDown() {
    this.dropdownService.getAllFiltreByName('PRIORITY', 'ACTION')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.actionsPriorities.push(filtreName.name);
              this.actionsPrioritiesFilter.push(filtreName.name);
            }
          );
        }
      });
  }

  initStateDropDown() {
    this.dropdownService.getAllFiltreByName('STATE', 'ACTION')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.actionsStates.push(filtreName.name);
              this.selectedState = this.actionsStates[0];
            }
          );
        }
      });
  }


  initEnumsDropsDowns() {
    this.initTypesDropDown();
    this.initPrioritiesDropDown();
    this.initStateDropDown();
  }

  initOpportunitiesDropDown(associatedOpportunityId?) {
    this.opportunitiesService.getJavaGenericService()
      .getData(ActionConstant.PROSPECT)
      .subscribe(_data => {
        if (_data) {
          this.opportunitiesList = _data;
          this.searchedOpportunitiesList = _data;
          if (associatedOpportunityId
            && !_data.some(opp => opp.id === associatedOpportunityId)) {
            this.opportunitiesService.getJavaGenericService().getEntityById(associatedOpportunityId)
              .subscribe(opportunityToAdd => {
                if (opportunityToAdd && opportunityToAdd[0]) {
                  this.opportunitiesList.push(opportunityToAdd[0]);
                }
                this.updateActionForm.controls['associatedOpportunityId'].setValue(associatedOpportunityId);
              });
          }
        }
      });
  }


  getDuration(duration) {
    return this.genericCrmService.getDuration(Math.abs(duration));

  }

  handleFiltreActionsTypes(value) {
    this.actionsTypes = this.actionsTypesFilter.filter(a => a.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handleFiltreActionsPriorities(value) {
    this.actionsPriorities = this.actionsPrioritiesFilter.filter(a => a.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  initContactsDropDown(contactId?) {
    this.contactService.getJavaGenericService().getEntityList()
      .subscribe((contacts: ContactCrm[]) => {
        this.contactsList = contacts;
        this.searchedContactsList = contacts;

        this.searchedContactsList.forEach((contact, index) => {
          this.getContactFullName(contact);
        });
        if (contactId && !contacts.some(cont => cont.id === contactId)) {
          this.contactService.getJavaGenericService().getEntityById(contactId).subscribe(contact => {
            this.getContactFullName(contact);
            this.searchedContactsList.push(contact);
            this.updateActionForm.controls['contactConcernedId'].setValue(contactId);
          });
        }
      });
  }

  clearFields() {
    this.clearField('associatedOpportunityId');
    this.clearField('contactConcernedId');
    this.clearField('organizationId');
  }

  clearFieldsClient() {
    this.clearField('associatedOppClientId');
    this.clearField('contactClientId');
    this.clearField('concernedOrgClientId');
  }

  filterAssociatedProspects() {
    this.isClientMode = false;
    this.clearFields();
    this.clearFieldsClient();
    this.initOpportunitiesDropDown();
    this.initContactsDropDown();
    this.initOrganizationsDropDown();
  }

  filterAssociatedClient() {
    this.isClientMode = true;
    this.clearFields();
    this.initOrganizationsClientDropDown();
    this.initOpportunitiesClientDropDown();
    this.initContactsClientDropDown();
  }

  initOpportunitiesClientDropDown() {
    this.opportunitiesList = [];
    this.searchedOpportunitiesList = [];

    this.opportunitiesClientList = [];
    const associatedOpportunityId = this.actionData.associatedOppClientId;
    this.opportunitiesService.getJavaGenericService()
      .getData(ActionConstant.CLIENT)
      .subscribe(_data => {
        if (_data) {
          this.opportunitiesClientList = _data;
          this.opportunitiesList = _data;
          this.searchedOpportunitiesList = _data;
          if (associatedOpportunityId
            && !_data.some(opp => opp.id === associatedOpportunityId)) {
            this.opportunitiesService.getJavaGenericService().getEntityById(associatedOpportunityId)
              .subscribe(opportunityToAdd => {
                if (opportunityToAdd && opportunityToAdd[0]) {
                  this.opportunitiesList.push(opportunityToAdd[0]);
                }
                this.updateActionForm.controls['associatedOpportunityId'].setValue(associatedOpportunityId);
              });
          }
          if (this.actionData.associatedOppClientId) {
            this.updateActionForm.controls['associatedOpportunityId'].setValue(this.actionData.associatedOppClientId);
          }
        }
      });
  }

  initContactsClientDropDown() {
    this.contactsList = [];
    this.searchedContactsList = [];

    this.contactsClientList = [];
    this.tiersService.getContactTiers().subscribe((data: any) => {
      data.listData.forEach(contact => {
        contact.name = contact.FirstName + contact.LastName;
        contact.id = contact.Id;
        this.contactsList.push(contact);
        this.searchedContactsList.push(contact);

        this.contactsClientList.push(contact);
      });
      if (this.actionData.contactClientId) {
        this.updateActionForm.controls['contactConcernedId'].setValue(this.actionData.contactClientId);
      }
    });
  }

  initOrganizationsClientDropDown() {
    this.organizationList = [];
    this.searchedOrganizationList = [];

    this.organizationClientList = [];
    this.predicate = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    this.tiersService.processDataServerSide(this.predicate).subscribe(data => {
      data.data.forEach((client) => {
        this.organizationList.push(this.convertClientToOrganisation(client));
        this.searchedOrganizationList.push(this.convertClientToOrganisation(client));
        this.organizationClientList.push(this.convertClientToOrganisation(client));
      });
      if (this.actionData.concernedOrgClientId &&
        this.organizationClientList.some(org => org.id === this.actionData.concernedOrgClientId)) {
        this.updateActionForm.controls['organizationId'].setValue(this.actionData.concernedOrgClientId);
      }
    });
  }

  convertClientToOrganisation(client): Organisation {
    return new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter,
      this.translateService.instant('CUSTOMER'));
  }

  initClientDropsDown() {
    this.organizationList = this.organizationClientList;
    this.searchedOrganizationList = this.organizationClientList;

    this.contactsList = this.contactsClientList;
    this.searchedContactsList = this.contactsClientList;

    this.opportunitiesList = this.opportunitiesClientList;
    this.searchedOpportunitiesList = this.opportunitiesClientList;

  }

  public handleOpportunityFilter(searchedOpp) {
    this.searchedOpportunitiesList = this.opportunitiesList.filter(org => {
      return (org.title.toLowerCase()
        .indexOf(searchedOpp.toLowerCase()) !== -1);
    });
  }

  public handleContactFilter(searchedContact) {
    this.searchedContactsList = this.contactsList.filter(contact => {
      return (contact.name.toLowerCase()
        .indexOf(searchedContact.toLowerCase()) !== -1);
    });
  }

  public handleOrganizationFilter(searchedOrganization) {
    this.searchedOrganizationList = this.organizationList.filter(org => {
      return (org.name.toLowerCase()
        .indexOf(searchedOrganization.toLowerCase()) !== -1);
    });
  }

  selectedPermission() {
    this.permissionService.getResult().subscribe(data => {
      if (data && data.permission && (data.parent === this.parentPermission)) {
        this.actionRelatedPermissions = data.permission;
      }
    });
  }

  private loadPermission(canUpdatePermission) {
    this.canUpdatePermission = canUpdatePermission;
  }

  private remindersIdsToDelete(id) {
    this.idsRemindersToDelete.push(id);
  }

  /**
   * check is startTime equals to endTime
   * @param startTime
   * @param endTime
   */
  private isStartTimeEqualsToEndTime(startTime: Date, endTime: Date) {
    if (startTime.getTime() >= endTime.getTime()) {
      this.updateActionForm.setErrors({'actionInvalidStartTime': true});
      this.invalidStartEndTime = true;
    } else {
      this.updateActionForm.setErrors(null);
      this.invalidStartEndTime = false;
    }
  }

  /**
   * check is startDate equals to endDate
   * @param startDateValue
   * @param endDateValue
   * @param startDateWithoutTime
   * @param endDateWithoutTime
   */
  private checkStartTimeValidation(startDateValue: Date, endDateValue: Date, startDateWithoutTime: number, endDateWithoutTime: number) {
    if (startDateValue && endDateValue && (startDateWithoutTime === endDateWithoutTime)) {
      const startTime = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate(), this.startDate.getHours(),
        this.startDate.getMinutes());
      const endTime = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate(), this.endDate.getHours(),
        this.endDate.getMinutes());
      this.isStartTimeEqualsToEndTime(startTime, endTime);
      this.updateActionForm.patchValue({'startDate': this.startDate});
      this.updateActionForm.patchValue({'endDate': this.endDate});
    }
  }

  private updateDateValidation() {
    this.updateActionForm.setErrors(null);
    this.updateActionForm.updateValueAndValidity();
  }

  getAttributeToName(): string {
    const assignedTo = this.listUsers.find(employee => employee.Id ===
      this.updateActionForm.controls['commercialAssignedToId'].value);
    return assignedTo.FullName;
  }

  handleMapClick(event) {
    this.dialogVisible = true;
    this.selectedPosition = event.latLng;
    this.addMarker();
  }

  handleOverlayClick(event) {

    // tslint:disable-next-line:triple-equals
    const isMarker = event.overlay.getTitle != undefined;

    if (isMarker) {
      const title = event.overlay.getTitle();
      this.infoWindow.setContent('' + title + '');
      this.infoWindow.open(event.map, event.overlay);
      event.map.setCenter(event.overlay.getPosition());

    } else {
    }
  }

  addMarker() {
    this.clear();
    this.overlays.push(new google.maps.Marker({
      position: {
        lat: this.selectedPosition.lat(),
        lng: this.selectedPosition.lng()
      }, title: this.markerTitle, draggable: this.draggable
    }));
    this.markerTitle = null;
    this.dialogVisible = false;
    this.eventService.getAllAddress(this.selectedPosition.lat(), this.selectedPosition.lng()).subscribe(
      (e) => {
        this.updateActionForm.controls['city'].setValue(e.address.city);
        this.updateActionForm.controls['address_line'].setValue(e.address.region);
        this.updateActionForm.controls['country'].setValue(e.address.country);
        this.updateActionForm.controls['postal_code'].setValue(e.address.postcode);
        this.updateActionForm.controls['lat'].setValue(e.lat);
        this.updateActionForm.controls['lng'].setValue(e.lon);
      }
    );
  }

  initMarker() {
    this.clear();
    if (this.actionData.address.country != '') {
      this.needLocation = true;
      this.overlays.push(new google.maps.Marker({
        position: {
          lat: this.actionData.address.latitude,
          lng: this.actionData.address.longitude
        }, title: this.markerTitle, draggable: this.draggable
      }));
      this.markerTitle = null;
      this.dialogVisible = false;
      this.eventService.getAllAddress(this.actionData.address.latitude, this.actionData.address.longitude).subscribe(
        (e) => {
          this.updateActionForm.controls['city'].setValue(e.address.city);
          this.updateActionForm.controls['address_line'].setValue(e.address.region);
          this.updateActionForm.controls['country'].setValue(e.address.country);
          this.updateActionForm.controls['postal_code'].setValue(e.address.postcode);
          this.updateActionForm.controls['lat'].setValue(e.lat);
          this.updateActionForm.controls['lng'].setValue(e.lon);
        }
      );
    } else {
      this.needLocation = false;
    }
  }

  initOverlays() {
    if (!this.overlays || !this.overlays.length) {
      this.overlays = [];
    }
  }


  clear() {
    this.overlays = [];
  }

  handleDragEnd(event) {
  }

  loadIndividualUsersList() {
    this.predicate = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicate).subscribe(data => {
      this.listUsers = data.data.filter(user => user.Id !== this.connectedUser.IdUser);
      this.listUsersFilter = data.data.filter(user => user.Id !== this.connectedUser.IdUser);
      this.filterUsers();
      if (this.actionData.commercialAssignedToId) {
        this.listCommercialAssignedTo = this.listUsers;
        this.getAttributedToName((this.actionData.commercialAssignedToId !== this.connectedUser.IdUser) ? this.actionData.commercialAssignedToId : undefined);
      }
    }, () => {
      this.growlService.ErrorNotification(this.translateService.instant(SharedCrmConstant.FAILURE_OPERATION));
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
