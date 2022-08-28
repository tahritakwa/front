import {Component, ComponentRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Employee} from '../../../../models/payroll/employee.model';
import {EnumValues} from 'enum-values';
import {ActionTypeEnum} from '../../../../models/crm/enums/actionType.enum';
import {TranslateService} from '@ngx-translate/core';
import {ActionPriorityEnum} from '../../../../models/crm/enums/actionPriority.enum';
import {ActionStateEnum} from '../../../../models/crm/enums/actionState.enum';
import {ActionService} from '../../../services/action/action.service';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {Router} from '@angular/router';
import {ActionConstant} from '../../../../constant/crm/action.constant';
import {
  between,
  dateValueGT,
  dateValueLT,
  isValidDate,
  leavesValidator,
  ValidationService
} from '../../../../shared/services/validation/validation.service';
import {Observable} from 'rxjs/Observable';
import {OpportunityService} from '../../../services/opportunity.service';
import {ContactCrm} from '../../../../models/crm/contactCrm.model';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {Action} from '../../../../models/crm/action.model';
import {ExactDate} from '../../../../shared/helpers/exactDate';
import {Subscription} from 'rxjs/Subscription';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {GenericCrmService} from '../../../generic-crm.service';

import {
  Filter,
  Operation,
  Operator,
  OrderBy,
  OrderByDirection,
  PredicateFormat,
  Relation
} from '../../../../shared/utils/predicate';
import {LeaveRequestConstant} from '../../../../constant/payroll/leave.constant';
import {AdministrativeDocumentConstant} from '../../../../constant/payroll/administrative-document-constant';

import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {TiersConstants} from '../../../../constant/purchase/tiers.constant';
import {Organisation} from '../../../../models/crm/organisation.model';
import {DatePipe} from '@angular/common';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {HttpCrmErrorCodes} from '../../../http-error-crm-codes';
import {PermissionService} from '../../../services/permission/permission.service';
import {Opportunity} from '../../../../models/crm/opportunity.model';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {EventService} from '../../../services/event/event.service';
import {Address} from '../../../../models/crm/address.model';
import {DropdownService} from '../../../services/dropdowns/dropdown.service';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {UserService} from '../../../../administration/services/user/user.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';


@Component({
  selector: 'app-add-action',
  templateUrl: './add-action.component.html',
  styleUrls: ['./add-action.component.scss']
})
export class AddActionComponent implements OnInit, IModalDialog, OnDestroy {

  public addFormGroup: FormGroup;

  public listResponsiblesUsers: Array<Employee>;
  public listResponsiblesUsersFiltred: Array<Employee>;
  public opportunitiesList = [];
  public searchedOpportunitiesList = [];

  public contactsList = new Array<ContactCrm>();
  public searchedContactsList = [];

  public organizationList = [];
  public searchedOrganizationList = [];


  public actionsTypes = [];
  public actionsTypesFilter = [];
  public actionToCheck = [];
  public actionsPriorities = [];
  public actionsPrioritiesFilter = [];

  public actionsStates = [];
  public openFirstCollapse = true;
  public openSecondCollapse = false;

  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);

  public actionInSameRange = false;

  public allActions;
  public parentPermission = 'ADD_ACTION';

  public selectedState;
  public optionDialog: Partial<IModalDialogOptions<any>>;

  public isFormGroupChanged = false;
  leaves: any [];
  public isClientMode: boolean;
  public predicate: PredicateFormat;
  public relatedActionsPermissions: any;
  private actionEntityName = ActionConstant.ACTION;
  public uuid = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND);
  /**
   * to verify if this component is opened in a modal or not
   */
  public isModal;
  @Input() popupCalendar;
  @Input() selectedDate;
  @Input() eventToSaveFromCalendar: Observable<any>;
  @Input() eventToCloseFromCalendar: Observable<any>;

  @Output() saveIsDone = new EventEmitter<boolean>();
  private isOpenedFromOtherComp = false;

  private saveEventSubscription: Subscription;
  private closeEventSubscription: Subscription;


  public actionToSave = new Action();

  public dataToShowInPopup;

  public opportunitiesClientList = [];
  public contactsClientList = new Array<ContactCrm>();
  public organizationClientList = [];
  public sourceType;
  public source;
  public sourceId;
  private actionId: Number;
  private counter = 0;
  private opportunityInitialized = false;
  private organizationInitialized = false;
  private contactInitialized = false;
  options: any;
  overlays: any[];
  dialogVisible: boolean;

  markerTitle: string;

  selectedPosition: any;

  infoWindow: any;

  draggable: boolean;
  actionType: any;
  needLocation = false;
  public listUsers = [];
  public Users = [];
  public listUsersFilter = [];
  private connectedUser: any;
  private assignedTo: any;

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.isModal = true;
    this.openFirstCollapse = false;
    this.sourceType = options.data.dataType;
    this.source = options.data.source;
    this.sourceId = options.data.data;
    if (this.sourceType === ActionConstant.CLIENT_SOURCE_TYPE) {
      this.isClientMode = true;
    }

    if (options.data) {
      this.dataToShowInPopup = options.data;
    }
  }

  private popUpIsClosed() {
    if (this.eventToCloseFromCalendar) {
      this.closeEventSubscription = this.eventToCloseFromCalendar.subscribe((data) => {
        if (data && data.type === ActionConstant.ACTION && data.value === true) {
          this.addFormGroup.reset();
          this.isOpenedFromOtherComp = true;
        }
      });
    }
  }

  /**
   *
   * @param fb
   * @param translate
   * @param actionService
   * @param permissionService
   * @param validationService
   * @param contactService
   * @param opportunitiesService
   * @param viewRef
   * @param modalService
   * @param exactDate
   * @param organizationService
   * @param genericCrmService
   * @param growlService
   * @param router
   * @param formModalDialogService
   * @param leaveService
   * @param datePipe
   * @param translateService
   * @param tiersService
   */



  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              private actionService: ActionService,
              private permissionService: PermissionService,
              private validationService: ValidationService,
              private contactService: ContactCrmService,
              private opportunitiesService: OpportunityService,
              private viewRef: ViewContainerRef,
              private modalService: ModalDialogInstanceService,
              private exactDate: ExactDate,
              private organizationService: OrganisationService,
              public genericCrmService: GenericCrmService,
              private growlService: GrowlService,
              private router: Router,
              private formModalDialogService: FormModalDialogService,
              private datePipe: DatePipe,
              private translateService: TranslateService,
              private tiersService: TiersService,
              private eventService: EventService,
              private dropdownService: DropdownService,
              private userService: UserService,
              private localStorageService: LocalStorageService) {

  }

  ngOnInit() {
    this.getConnectedUser();
    this.loadIndividualUsersList();
    this.selectedPermission();
    this.createAddForm();
    this.initDataLists();
    this.initEnumsDropsDowns();
    if (this.eventToSaveFromCalendar) {
      this.saveEventSubscription = this.eventToSaveFromCalendar.subscribe((data) => {
        if (data && data.type === ActionConstant.ACTION && data.value === true) {
          this.save();
          this.isOpenedFromOtherComp = true;
        }
      });
    }
    this.popUpIsClosed();
    this.initStartDateFromCalender();
  }

  ngOnDestroy(): void {
    if (this.saveEventSubscription) {
      this.saveEventSubscription.unsubscribe();
      this.isOpenedFromOtherComp = false;
    }
  }

  private createAddForm(): void {
    this.addFormGroup = this.fb.group({
      name: ['', [Validators.required]],
      commercialAssignedToId: [''],
      type: [null],
      deadLine: [''],
      startDate: [''],
      startTime: ['', [Validators.required]],
      endDate: [''],
      endTime: ['', [Validators.required]],
      hoursDuration: ['', [Validators.min(0)]],
      minutesDuration: ['', [Validators.max(60), Validators.min(0)]],
      progress: [0, [Validators.min(0), Validators.max(100)]],
      priority: [null],
      state: [''],
      description: [''],
      associatedOpportunityId: [''],
      contactConcernedId: [''],
      organizationId: [''],
      associatedOppClientId: [''],
      contactClientId: [''],
      concernedOrgClientId: [''],
      team: [''],
      employeesPermittedTo: [''],
      parentAction: [''],
      childActions: [''],
      commercialAssignedToEmail: [''],
      reminders: this.fb.array([]),
      city: [''],
      country: [''],
      address_line: [''],
      postal_code: [''],
      lat: [''],
      lng: [''],
      address: ['']

    });
    this.addDatesDependenceControls();
    this.addProgressValidation();
  }

  get reminders(): FormArray {
    return this.addFormGroup.get('reminders') as FormArray;
  }


  addReminder(): void {
    if (this.reminders.length > NumberConstant.ZERO) {
      const reminder = this.reminders.value[this.reminders.length - NumberConstant.ONE];
      this.isValidReminder(reminder);
    } else {
      this.reminders.push(this.buildReminderForm());
    }
  }

  private isValidReminder(reminder) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(reminder.reminderType) &&
      !this.genericCrmService.isNullOrUndefinedOrEmpty(reminder.delayCount) &&
      !this.genericCrmService.isNullOrUndefinedOrEmpty(reminder.delayUnity)) {
      this.reminders.push(this.buildReminderForm());
    }
  }

  private buildReminderForm(): FormGroup {
    return this.fb.group({
      Id: [0],
      reminderType: ['', Validators.required],
      delayCount: ['', [Validators.required, Validators.min(1)]],
      delayUnity: ['', Validators.required],
    });
  }

  deleteReminder(i: number): void {
    this.reminders.removeAt(i);
  }

  public isContactFCReadOnly(): boolean {
    return (this.source && this.source === ActionConstant.CONTACT) || this.isOpportunityFormControlReadOnly();
  }

  public isOrganizationFCReadOnly(): boolean {
    return ((this.source && this.source === ActionConstant.ORGANISATION) || this.isOpportunityFormControlReadOnly()
      || this.isContactFCReadOnly());
  }

  /**
   * get the list of employees to select to whom the action is attributed to
   */

  private checkAllRemindersAreValid(): boolean {
    return this.reminders.valid;
  }

  /**
   * save the action
   */
  save() {
    this.actionInSameRange = false;
    if (this.addFormGroup.valid && this.relatedActionsPermissions.permissionValidForm && this.checkAllRemindersAreValid()) {
      if (this.isClientMode) {
        this.addFormGroup.controls['associatedOppClientId'].setValue(this.addFormGroup.value.associatedOpportunityId);
        this.addFormGroup.controls['contactClientId'].setValue(this.addFormGroup.value.contactConcernedId);
        this.addFormGroup.controls['concernedOrgClientId'].setValue(this.addFormGroup.value.organizationId);
        this.addFormGroup.controls['commercialAssignedToId'].setValue(this.connectedUser.IdUser);
        this.clearField('organizationId');
        this.clearField('contactConcernedId');
      }
      this.setCommercialAssignedToEmail();
      const actionToSave = this.convertActionFormToAction(this.addFormGroup);
      this.actionService.getJavaGenericService().saveEntity(actionToSave, 'check-same-range').subscribe((isSameRange) => {
        if (isSameRange.errorCode === HttpCrmErrorCodes.ANOTHER_ACTION_FOUND_WITHIN_THE_SAME_RANGE) {
          this.actionInSameRange = true;
          this.addFormGroup.controls[ActionConstant.START_DATE_FORM_CONTROL].markAsPending();
          this.addFormGroup.controls[ActionConstant.DEADLINE_FORM_CONTROL].markAsPending();
        } else {
          this.actionService.getJavaGenericService().saveEntity(actionToSave)
            .subscribe((data) => {
              if (data) {
                this.actionId = data.id;
                this.permissionService.savePermission(this.relatedActionsPermissions, this.actionEntityName, this.actionId)
                  .subscribe(() => {
                    this.growlService.successNotification(this.translate.instant(ActionConstant.SUCCESS_OPERATION));
                    this.addFormGroup.reset();
                    if (this.isOpenedFromOtherComp === true) {
                      this.saveIsDone.emit(true);
                    } else {
                      this.onBackToListOrCancel();
                    }
                  });
              }
            }, () => {
              this.growlService.ErrorNotification(this.translate.instant(ActionConstant.FAILURE_OPERATION));
            });
        }
      });
    } else {
      this.validationService.validateAllFormFields(this.addFormGroup);
      this.checkCollapsesOpening();
    }
  }

  private setCommercialAssignedToEmail() {
    this.assignedTo = this.listUsers.filter(user => user.Id ===
      this.addFormGroup.controls['commercialAssignedToId'].value);
    if (this.assignedTo.length > 0) {
      this.addFormGroup.controls['commercialAssignedToEmail'].setValue(this.assignedTo[0].Email);
    }
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
      if (!this.source || this.source === ActionConstant.ORGANISATION) {
        if (!this.isClientMode) {
          this.filterAssociatedProspects();
        } else {
          this.initClientDropsDown();
        }
        this.clearField('contactConcernedId');
      }
      if (!this.source) {
        this.clearField('organizationId');
      }
    }
  }

  private checkOpportunityHaveContact(opportunityId: number): boolean {
    const foundOpp: Opportunity = this.opportunitiesList.find(opp => opp.id === opportunityId);
    if (foundOpp) {
      return !!foundOpp.customerId;
    }
  }

  clearField(fieldName) {
    this.addFormGroup.controls[fieldName].setValue(null);
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

            this.addFormGroup.controls['organizationId'].setValue(opportunity.idClientOrganization);
            this.contactsList = this.contactsClientList.filter(contact => contact.id === opportunity.idClientContact);
            this.searchedContactsList = this.contactsClientList.filter(contact => contact.id === opportunity.idClientContact);
            this.addFormGroup.controls['contactConcernedId'].setValue(opportunity.idClientContact);
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
        this.getOpportunitiesRelatedToOrganization(organization);
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

  private fillOpportunityAndContactFromOrganization(organizationId) {
    this.opportunitiesList = [];
    this.searchedOpportunitiesList = [];

    this.contactsList = [];
    this.searchedContactsList = [];

    this.opportunitiesService.getJavaGenericService().getEntityById(organizationId, CrmConstant.BY_ORGANIZATION_CLIENT_ID).subscribe(
      (opportunities) => {
        if (opportunities) {
          this.opportunitiesList = [];
          this.searchedOpportunitiesList = [];
          this.opportunitiesList = opportunities;
          this.searchedOpportunitiesList = opportunities;
        }
        this.getOrganizationClientContacts(organizationId);
      }
    );
  }

  private getOrganizationClientContacts(organizationId) {
    this.contactsList = this.contactsClientList.filter(cont => cont.IdTiers === organizationId);
    this.searchedContactsList = this.contactsClientList.filter(cont => cont.IdTiers === organizationId);
  }

  changeSelectedContact(contact) {
    if (contact) {
      if (!this.isClientMode) {
        this.getOrganizationRelatedToContact(contact);
      } else {
        this.fillOpportunityAndOrganizationFromContact(contact);
      }
    } else {
      if (!this.source) {
        if (!this.isClientMode) {
          this.filterAssociatedProspects();
        } else {
          this.initClientDropsDown();
        }
        this.clearField('associatedOpportunityId');
        this.clearField('organizationId');
      } else if (this.dataToShowInPopup.data && this.source === ActionConstant.ORGANISATION) {
        if (!this.isClientMode) {
          this.getContactRelatedToOrganization(this.dataToShowInPopup.data);
          this.getOpportunitiesRelatedToOrganization(this.dataToShowInPopup.data);
        } else {
          this.initClientDropsDown();
          this.fillOpportunityAndContactFromOrganization(this.dataToShowInPopup.data);
        }
      }
    }
  }

  fillOpportunityAndOrganizationFromContact(contactId) {
    this.opportunitiesList = [];
    this.searchedOpportunitiesList = [];

    const selectedContact = this.contactsClientList.find(contact => contact.id === contactId);
    if (selectedContact) {
      this.organizationList = this.organizationClientList.filter(org => org.id === selectedContact.IdTiers);
      this.searchedOrganizationList = this.organizationClientList.filter(org => org.id === selectedContact.IdTiers);

      this.addFormGroup.controls['organizationId'].setValue(selectedContact.IdTiers);
    }
    this.opportunitiesService.getJavaGenericService().getEntityById(contactId, CrmConstant.BY_CONTACT_CLIENT_ID).subscribe(
      (opportunities) => {
        if (opportunities) {
          this.opportunitiesList = [];
          this.searchedOpportunitiesList = [];
          opportunities.forEach(opportunity => {
            const opp = this.opportunitiesClientList
              .find(opportunitySelected => opportunitySelected.id === opportunity.id);
            if (opp) {
              this.opportunitiesList.push(opp);
              this.searchedOpportunitiesList.push(opp);

            }
            const relatedOrganization = this.organizationClientList
              .find(organization => organization.id === opportunity.idClientOrganization);
            if (relatedOrganization) {
              this.organizationList = [];
              this.searchedOrganizationList = [];
              this.organizationList.push(relatedOrganization);
              this.searchedOrganizationList.push(relatedOrganization);
              this.addFormGroup.controls['organizationId'].setValue(relatedOrganization.id);
            }
          });
        }
      }
    );
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

  getOpportunitiesRelatedToContact(contactId: number) {
    this.opportunitiesService.getJavaGenericService().getEntityById(contactId, CrmConstant.OPP_BY_CONTACT_ID).subscribe(
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

  getContactRelatedToOrganization(organizationId: number, contactId?: number) {
    this.contactService.getJavaGenericService().getEntityById(organizationId, CrmConstant.BY_ORGANIZATION_ID).subscribe(
      (contacts) => {
        if (contacts) {
          contacts.forEach((contact, index) => {
            this.getContactFullName(contact);
          });
          this.contactsList = contacts;
          this.searchedContactsList = contacts;
          if (contactId) {
            this.addFormGroup.controls['contactConcernedId'].setValue(contactId);
          }
        }
      }
    );
  }

  getOrganizationRelatedToContact(contactId: number) {
    this.opportunitiesList = [];
    this.searchedOpportunitiesList = [];

    this.organizationList = [];
    this.searchedOrganizationList = [];
    this.organizationService.getJavaGenericService().getEntityById(contactId, CrmConstant.BY_CONTACT_ID).subscribe(
      (org) => {
        if (org) {
          this.organizationList.push(org);
          this.searchedOrganizationList.push(org);
          this.getOpportunitiesRelatedToContact(contactId);
          this.addFormGroup.controls['organizationId'].setValue(org.id);
          this.getContactRelatedToOrganization(org.id, contactId);
        }
      }
    );
  }

  getOrganizationRelatedToOpportunity(opportunityId: number) {
    this.organizationService.getJavaGenericService().getEntityById(opportunityId, CrmConstant.BY_OPPORTUNITY_ID).subscribe(
      (org) => {
        if (org) {
          this.organizationList.push(org);
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

          this.addFormGroup.controls['contactConcernedId'].setValue(contact.id);
        }
      });
  }

  fillRelatedDataInForm() {
    if (this.dataToShowInPopup) {
      switch (this.dataToShowInPopup.source) {
        case ActionConstant.OPPORTUNITY :
          this.initOpportunitiesDropDown();
          this.fillRelatedOpportunity(this.dataToShowInPopup.data);
          break;
        case ActionConstant.ORGANISATION :
          this.initOrganizationsDropDown();
          this.fillRelatedOrganization(this.dataToShowInPopup.data);
          break;
        case ActionConstant.CONTACT :
          this.initContactsDropDown();
          this.fillRelatedContact(this.dataToShowInPopup.data);
          break;
      }
    }
  }

  isOpportunityFormControlReadOnly(): boolean {
    return (this.source && this.source === ActionConstant.OPPORTUNITY);
  }

  isClientType() {
    return this.source && this.dataToShowInPopup.dataType === ActionConstant.CLIENT_SOURCE_TYPE;
  }

  fillRelatedOpportunity(opportunityId: number) {
    if (opportunityId) {
      this.addFormGroup.controls['associatedOpportunityId'].setValue(opportunityId);
      this.changeSelectedOpportunity(opportunityId);
    }
  }

  fillRelatedOrganization(organizationId: number) {
    if (organizationId) {
      if (this.sourceType !== ActionConstant.CLIENT_SOURCE_TYPE ||
        this.sourceType !== ActionConstant.PROSPECT_SOURCE_TYPE) {
        this.addFormGroup.controls['organizationId'].setValue(organizationId);
        this.changeSelectedOrganization(organizationId);
      }
    }
  }

  fillRelatedContact(contactId: number) {
    if (contactId) {
      this.addFormGroup.controls['contactConcernedId'].setValue(contactId);
      if (this.sourceType !== ActionConstant.CLIENT_SOURCE_TYPE) {
        this.changeSelectedContact(contactId);
      }
    }
  }

  setAddress(form: FormGroup) {
    let address: Address = new Address();
    address.zipCode = form.value.postal_code;
    address.city = form.value.city;
    address.country = form.value.country;
    address.latitude = form.value.lat;
    address.longitude = form.value.lng;
    address.addressLine = form.value.address_line;
    this.actionToSave.address = address;
  }

  convertActionFormToAction(form: FormGroup) {
    this.actionToSave = form.value;
    this.setAddress(form);
    this.setDates();
    this.setDuration();
    this.setReminders();
    return this.actionToSave;
  }

  setDuration() {
    const start = new Date(this.actionToSave.startDate);
    const end = new Date(this.actionToSave.endDate);
    const diffMs = (end.getTime() - start.getTime());
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    this.actionToSave.duration = (diffDays * 24 * 60) + (diffHrs * 60) + diffMins;
  }

  setStartTime() {
    const startTime = new Date(this.addFormGroup.controls['startTime'].value);
    const startDate = new Date(this.addFormGroup.controls['startDate'].value);
    if (startTime.getDate()) {
      this.actionToSave.startDate = this.exactDate.getDateExact(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(),
        startTime.getHours(), startTime.getMinutes()));
    } else {
      this.actionToSave.startDate = this.exactDate.getDateExact(new Date(startDate.getFullYear(),
        startDate.getMonth(), startDate.getDate()));
    }
  }

  setEndTime() {
    const endTime = new Date(this.addFormGroup.controls['endTime'].value);
    const endDate = new Date(this.addFormGroup.controls['endDate'].value);
    this.actionToSave.endDate = this.exactDate.getDateExact(new Date(endDate.getFullYear(), endDate.getMonth(),
      endDate.getDate(), endTime.getHours(), endTime.getMinutes()));
  }

  private setReminders() {
    this.actionToSave.reminders = this.reminders.value;
  }

  setDeadline() {
    this.actionToSave.deadLine = this.addFormGroup.value.deadLine ?
      this.exactDate.getDateExact(new Date(this.addFormGroup.value.deadLine)) : null;
  }

  setDates() {
    this.setStartTime();
    this.setEndTime();
    this.setDeadline();
  }

  initTypesDropDown() {
    this.dropdownService.getAllFiltreByName('Type', 'ACTION')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.actionsTypes.push(filtreName.name);
              this.actionsTypesFilter.push(filtreName.name);
              this.actionToCheck.push(filtreName);
            }
          );
        }
      });
  }

  checkRequireLocation(filtre) {
    this.actionToCheck.forEach((e) => {
        if (e.name == filtre) {
          this.needLocation = e.location;
        }
      }
    );
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

  /**
   * fill opportunities, organizations and contacts
   */
  private initDataLists() {
    if (this.source && this.sourceId && this.sourceType === ActionConstant.CLIENT_SOURCE_TYPE) {
      this.initOpportunitiesClientDropDown();
      this.initContactsClientDropDown();
      this.initOrganizationsClientDropDown();
    } else if (!(this.source && this.sourceId)) {
      this.initOpportunitiesDropDown();
      this.initContactsDropDown();
      this.initOrganizationsDropDown();
    } else {
      this.fillRelatedDataInForm();
    }
  }

  get deadLine(): FormControl {
    return this.addFormGroup.get(ActionConstant.DEADLINE_FORM_CONTROL) as FormControl;
  }

  get startDate(): FormControl {
    return this.addFormGroup.get(ActionConstant.START_DATE_FORM_CONTROL) as FormControl;
  }

  get endDate(): FormControl {
    return this.addFormGroup.get(ActionConstant.END_DATE_FORM_CONTROL) as FormControl;
  }

  get startTime(): FormControl {
    return this.addFormGroup.get(ActionConstant.START_TIME_FORM_CONTROL) as FormControl;
  }

  get endTime(): FormControl {
    return this.addFormGroup.get(ActionConstant.END_TIME_FORM_CONTROL) as FormControl;
  }


  /*
   * fix the dependence between the start date, the deadline and the end date
   */
  private addDatesDependenceControls(): void {
    this.startDate.setValidators([Validators.required, dateValueLT(new Observable(o => o.next(this.deadLine.value))),
      dateValueLT(new Observable(o => o.next(this.endDate.value)))]);
    this.endDate.setValidators([Validators.required, dateValueLT(new Observable(o => o.next(this.deadLine.value))),
      dateValueGT(new Observable(o => o.next(this.startDate.value)))
    ]);
    this.deadLine.setValidators([
      dateValueGT(new Observable(o => o.next(this.startDate.value))),
      dateValueGT(new Observable(o => o.next(this.endDate.value)))
    ]);
  }

  /**
   * update form controls validity
   */
  updateStartControl(event?) {
    if (event && this.checkFullYear(event)) {
      this.actionInSameRange = false;
      this.deadLine.setValidators([
        dateValueGT(new Observable(o => o.next(this.endDate.value))),
        dateValueGT(new Observable(o => o.next(this.startDate.value))),
        leavesValidator(this.leaves, 'endDate')
      ]);
      this.startDate.setValidators([Validators.required,
        dateValueLT(new Observable(o => o.next(this.deadLine.value))),
        dateValueLT(new Observable(o => o.next(this.endDate.value))),
        leavesValidator(this.leaves, 'startDate')
      ]);
      this.endDate.updateValueAndValidity();
      this.deadLine.updateValueAndValidity();
      this.onChangeDateTime('actionInvalidStartTime');
      this.onChangeDateTime('actionInvalidEndTime');
      this.synchroniseEndDate();
    }
  }

  private checkFullYear(event) {
    return new Date(event).getFullYear() >= new Date().getFullYear();
  }

  updateDeadLineControl() {
    this.actionInSameRange = false;
    this.deadLine.setValidators([
      leavesValidator(this.leaves, 'endDate')
    ]);
    this.startDate.updateValueAndValidity();
    this.endDate.updateValueAndValidity();
  }

  updateEndDateControl() {
    this.deadLine.setValidators([
      dateValueGT(new Observable(o => o.next(this.startDate.value))),
      dateValueGT(new Observable(o => o.next(this.endDate.value))),
      leavesValidator(this.leaves, 'endDate')
    ]);
    this.deadLine.updateValueAndValidity();
    this.startDate.updateValueAndValidity();
    this.incrementEndTime();
    this.onChangeDateTime('actionInvalidStartTime');
    this.onChangeDateTime('actionInvalidEndTime');
    this.synchroniseStartDate();
  }

  private incrementEndTime() {
    if (this.startTime.value && !this.endTime.value) {
      const start = new Date(this.startTime.value);
      start.setHours(start.getHours() + 1);
      this.endTime.setValue(start);
    }
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericCrmService.handleCanDeactivateToLeaveCurrentComponent(this.isActionFormGroupChanged.bind(this));
  }

  isActionFormGroupChanged(): boolean {
    Object.keys(this.addFormGroup.controls).forEach(control => {
      if (control !== 'state' && control !== 'address' && control !== 'progress' && control !== 'contactsConcernedIds'
        && control !== 'associatedToIds' && control !== 'reminders') {
        this.isFormGroupChanged = this.isFormGroupChanged === false ? !!this.addFormGroup.controls[control].value : true;
      }
    });
    return this.isFormGroupChanged;
  }

  initOpportunitiesDropDown() {
    if (this.sourceType !== ActionConstant.CLIENT_SOURCE_TYPE) {

      this.opportunitiesService.getJavaGenericService()
        .getData(ActionConstant.PROSPECT)
        .subscribe(_data => {
          if (_data) {
            this.opportunitiesList = _data;
            this.searchedOpportunitiesList = _data;

            if (this.dataToShowInPopup) {
              if (this.dataToShowInPopup.data && this.source === ActionConstant.CONTACT) {
                this.getOrganizationRelatedToContact(this.dataToShowInPopup.data);
              } else if (this.dataToShowInPopup.data && this.source === ActionConstant.ORGANISATION) {
                this.getOpportunitiesRelatedToOrganization(this.dataToShowInPopup.data);
                this.getContactRelatedToOrganization(this.dataToShowInPopup.data);
                this.addFormGroup.controls['organizationId'].setValue(this.dataToShowInPopup.data);
              }
            }
          }
        }, (error => {

        }), () => {
        });
    }
  }


  initContactsDropDown() {
    if (this.sourceType !== ActionConstant.CLIENT_SOURCE_TYPE) {
      this.contactService.getJavaGenericService().getEntityList()
        .subscribe((contacts: ContactCrm[]) => {
          this.contactsList = contacts;
          this.searchedContactsList = contacts;
          this.searchedContactsList.forEach((contact, index) => {
            this.getContactFullName(contact);
          });
        });
    }
  }

  initOrganizationsDropDown() {
    if (this.sourceType !== ActionConstant.CLIENT_SOURCE_TYPE) {

      this.organizationService.getJavaGenericService().getEntityList().subscribe((list) => {
        this.organizationList = list;
        this.searchedOrganizationList = list;
      });
    }
  }

  getContactFullName(contact: ContactCrm) {
    if (contact.name) {
      contact.name = contact.name.concat(' ').concat(contact.lastName);
    }
  }

  checkCollapsesOpening() {
    for (const control in this.addFormGroup.controls) {
      const collapseNumber = this.getElementCollapseNumber(control);
      if (collapseNumber === 1 && this.openFirstCollapse === false && this.addFormGroup.controls[control].invalid) {
        this.openFirstCollapse = true;
      }
    }
  }


  getElementCollapseNumber(control): number {
    if (control === 'name' || control === 'progress' || control === 'deadLine' || control === 'startDate' || control === 'endDate'
      || control === 'hoursDuration' || control === 'minutesDuration') {
      return 1;
    }
  }

  updateState() {
    const progress: number = this.addFormGroup.controls[ActionConstant.PROGRESS_FIELD].value ?
      (this.addFormGroup.controls[ActionConstant.PROGRESS_FIELD].value as number) : 0;
    switch (true) {
      case (progress === 0) :
        this.selectedState = this.actionsStates[0];
        break;
      case (progress > 0 && progress < 99) :
        this.selectedState = this.actionsStates[1];
        break;
      case (progress === 100) :
        this.selectedState = this.actionsStates[2];
        break;
    }
    this.updateProgressValidation();
  }

  addProgressValidation() {
    if (this.selectedState === this.actionsStates[1] && !(this.addFormGroup.controls[ActionConstant.PROGRESS_FIELD].value in [1, 99])) {
      this.addFormGroup.controls[ActionConstant.PROGRESS_FIELD].setValidators(between(1, 99));
    }
  }

  get progress(): FormControl {
    return this.addFormGroup.get(ActionConstant.PROGRESS_FIELD) as FormControl;
  }

  updateProgressValidation() {
    this.progress.setValidators(null);
    this.progress.updateValueAndValidity();
    switch (this.selectedState) {
      case this.actionsStates[0] : {
        if (this.addFormGroup.controls[ActionConstant.PROGRESS_FIELD].value !== 0) {
          this.addFormGroup.controls[ActionConstant.PROGRESS_FIELD].setValue(0);
        }
      }
        break;

      case  this.actionsStates[1] : {
        if (!((this.addFormGroup.controls[ActionConstant.PROGRESS_FIELD].value > 0)
          && (this.addFormGroup.controls[ActionConstant.PROGRESS_FIELD].value < 100))) {
          this.progress.setValidators(between(1, 99));
          this.addFormGroup.controls[ActionConstant.PROGRESS_FIELD].markAsTouched();
          this.progress.updateValueAndValidity();
        }
      }
        break;
      case this.actionsStates[2] : {
        if (this.addFormGroup.controls[ActionConstant.PROGRESS_FIELD].value !== 100) {
          this.addFormGroup.controls[ActionConstant.PROGRESS_FIELD].setValue(100);
          this.progress.updateValueAndValidity();
        }
      }
        break;
    }
  }

  onBackToListOrCancel() {
    if (!this.isModal) {
      this.router.navigateByUrl(ActionConstant.ACTIONS_LIST);
    } else {
      this.optionDialog.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }
  }

  handleFiltreActionsTypes(value) {
    this.actionsTypes = this.actionsTypesFilter.filter(a => a.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);

  }

  handleFiltreActionsPriorities(value) {
    this.actionsPriorities = this.actionsPrioritiesFilter.filter(a => a.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  getBtnReturnValue() {
    if (this.isModal) {
      return this.translate.instant(ActionConstant.CANCEL);
    } else {
      return this.translate.instant(ActionConstant.BACK_TO_LIST);
    }
  }

  getleaveEvents(employeeId) {
    this.leaves = [];
    this.preparePredicate(employeeId);
          this.updateStartControl();
          this.updateDeadLineControl();
          this.updateEndDateControl();
  }

  public preparePredicate(id): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(LeaveRequestConstant.ID_EMPLOYEE_NAVIGATION),
      new Relation(LeaveRequestConstant.ID_LEAVE_TYPE_NAVIGATION), new Relation(LeaveRequestConstant.TREATED_BY_NAVIGATION)]);
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(LeaveRequestConstant.ID, OrderByDirection.desc));
    this.predicate.Operator = Operator.and;
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Operator = NumberConstant.ZERO;
    this.predicate.pageSize = NumberConstant.TEN;
    this.predicate.page = NumberConstant.ONE;
    this.prepareCollaboraterPredicate(id);
  }

  prepareCollaboraterPredicate(id) {
    this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.EMPLOYEE_ID,
      Operation.eq, id));
  }

  clearFields() {
    this.addFormGroup.controls['associatedOpportunityId'].setValue(null);
    this.addFormGroup.controls['contactConcernedId'].setValue(null);
    this.addFormGroup.controls['organizationId'].setValue(null);
  }

  filterAssociatedProspects() {
    this.isClientMode = false;
    this.clearFields();
    this.initOpportunitiesDropDown();
    this.initContactsDropDown();
    this.initOrganizationsDropDown();
  }

  filterAssociatedClient() {
    this.isClientMode = true;
    this.clearFields();
    this.initOpportunitiesClientDropDown();
    this.initOrganizationsClientDropDown();
    this.initContactsClientDropDown();
  }

  initOpportunitiesClientDropDown() {
    this.opportunitiesList = [];
    this.searchedOpportunitiesList = [];

    this.opportunitiesClientList = [];
    let data;
    this.opportunitiesService.getJavaGenericService()
      .getData(ActionConstant.CLIENT)
      .subscribe(_data => {
        if (_data) {
          data = _data;
        }
      }, () => {

      }, () => {
        this.opportunitiesClientList = data;
        this.opportunitiesList = data;
        this.searchedOpportunitiesList = data;
        this.opportunityInitialized = true;
        if (this.dataToShowInPopup && this.dataToShowInPopup.data) {
          if (this.source === ActionConstant.CONTACT) {
            this.fillOpportunityAndOrganizationFromContact(this.dataToShowInPopup.data);
          }
          if (this.source === ActionConstant.ORGANISATION) {
            this.addFormGroup.controls['organizationId'].setValue(this.dataToShowInPopup.data);
          }
          if (this.source === ActionConstant.OPPORTUNITY) {
            this.addFormGroup.controls['associatedOpportunityId'].setValue(this.dataToShowInPopup.data);
          }
        }
        if (this.opportunityInitialized && this.organizationInitialized && this.contactInitialized) {
          this.fillRelatedDataInForm();
        }
      });
  }

  initContactsClientDropDown() {
    this.contactsList = [];
    this.searchedContactsList = [];

    this.contactsClientList = [];
    this.tiersService.getContactTiers().subscribe((data: any) => {
      data.listData.forEach(contact => {
        contact.name = `${contact.FirstName}  ${contact.LastName}`;
        contact.id = contact.Id;
        this.contactsList.push(contact);
        this.searchedContactsList.push(contact);
        this.contactsClientList.push(contact);
      });
      this.contactInitialized = true;
      if (this.dataToShowInPopup) {
        if (this.dataToShowInPopup.data && this.source === ActionConstant.CONTACT) {
          this.addFormGroup.controls['contactConcernedId'].setValue(this.dataToShowInPopup.data);
          this.fillOpportunityAndOrganizationFromContact(this.dataToShowInPopup.data);
        }
        if (this.dataToShowInPopup.data && this.source === ActionConstant.ORGANISATION) {
          this.addFormGroup.controls['organizationId'].setValue(this.dataToShowInPopup.data);
          this.getOrganizationClientContacts(this.dataToShowInPopup.data);
          this.fillOpportunityAndContactFromOrganization(this.dataToShowInPopup.data);
        }
      }
      if (this.opportunityInitialized && this.organizationInitialized && this.contactInitialized) {
        this.fillRelatedDataInForm();
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
      this.organizationInitialized = true;
      if (this.dataToShowInPopup && this.dataToShowInPopup.data) {
        if (this.source === ActionConstant.ORGANISATION) {
          this.addFormGroup.controls['organizationId'].setValue(this.dataToShowInPopup.data);
        }
        if (this.source === ActionConstant.CONTACT) {
          this.fillOpportunityAndOrganizationFromContact(this.dataToShowInPopup.data);
        }
      }
      if (this.opportunityInitialized && this.organizationInitialized && this.contactInitialized) {
        this.fillRelatedDataInForm();
      }
    });
  }

  convertClientToOrganisation(client): Organisation {
    return new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter,
      this.translateService.instant('CUSTOMER'));
  }

  /**
   * ??????? why
   */
  initClientDropsDown() {
    this.organizationList = this.organizationClientList;
    this.searchedOrganizationList = this.organizationClientList;

    this.contactsList = this.contactsClientList;
    this.searchedContactsList = this.contactsClientList;

    this.opportunitiesList = this.opportunitiesClientList;
    this.searchedOpportunitiesList = this.opportunitiesClientList;

  }

  private initStartDateFromCalender() {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(this.selectedDate)) {
      const date = new Date(this.selectedDate._d.getUTCFullYear(), this.selectedDate._d.getUTCMonth(), this.selectedDate._d.getUTCDate(),
        this.selectedDate._d.getUTCHours(), this.selectedDate._d.getUTCMinutes());
      this.startDate.setValue(date);
      const date2 = new Date(date);
      }
  }

  handleResponsablesFilter(userSearched) {
    this.listUsers = this.listUsersFilter.filter(responsable => responsable.FullName.toLowerCase()
      .includes(userSearched.toLowerCase()));
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
        this.relatedActionsPermissions = data.permission;
      }
    });
  }

  onChangeDateTime(messageToShow?: string) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(this.startDate.value) && !this.genericCrmService.isNullOrUndefinedOrEmpty(this.startTime.value)
      && !this.genericCrmService.isNullOrUndefinedOrEmpty(this.endDate.value) && !this.genericCrmService.isNullOrUndefinedOrEmpty(this.endTime.value)) {
      this.startTime.markAsUntouched();
      this.endTime.markAsUntouched();
      this.startTime.updateValueAndValidity();
      this.endTime.updateValueAndValidity();
      if (messageToShow === 'actionInvalidStartTime') {
        this.startTime.setValidators([Validators.required, isValidDate(this.startDate.value, this.endDate.value, this.startTime, this.endTime, messageToShow)]);
        this.startTime.updateValueAndValidity();
      } else {
        this.endTime.setValidators([Validators.required, isValidDate(this.startDate.value, this.endDate.value, this.startTime, this.endTime, messageToShow)]);
        this.endTime.updateValueAndValidity();

      }

    }
  }

  getAttributeToName(): string {
    const assignedTo = this.listResponsiblesUsers.find(employee => employee.Id ===
      this.addFormGroup.controls['commercialAssignedToId'].value);
    return assignedTo ? assignedTo.FullName : '';
  }

  public synchroniseEndDate() {
    if (!this.endDate.value && this.startDate.value) {
      this.endDate.setValue(this.startDate.value);
    }
  }

  public synchroniseStartDate() {
    if (!this.startDate.value && this.endDate.value) {
      this.startDate.setValue(this.endDate.value);
    }
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
        this.addFormGroup.controls['city'].setValue(e.address.city);
        this.addFormGroup.controls['address_line'].setValue(e.address.region);
        this.addFormGroup.controls['country'].setValue(e.address.country);
        this.addFormGroup.controls['postal_code'].setValue(e.address.postcode);
        this.addFormGroup.controls['lat'].setValue(e.lat);
        this.addFormGroup.controls['lng'].setValue(e.lon);
      }
    );
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
