import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ActionConstant} from '../../../../constant/crm/action.constant';
import {ActionFilterTypeEnum} from '../../../../models/crm/enums/actionFilterType.enum';
import {Opportunity} from '../../../../models/crm/opportunity.model';
import {ActionService} from '../../../services/action/action.service';
import {TranslateService} from '@ngx-translate/core';
import {OpportunityService} from '../../../services/opportunity.service';
import {ActionsListParams} from '../../../../models/crm/actionsListParams';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../../COM/Models/operations';
import {ContactCrm} from '../../../../models/crm/contactCrm.model';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {Organisation} from '../../../../models/crm/organisation.model';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {Subscription} from 'rxjs/Subscription';
import {AddNewOpportunityComponent} from '../../opportunity/add-new-opportunity/add-new-opportunity.component';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {ContactService} from '../../../../purchase/services/contact/contact.service';
import {Employee} from '../../../../models/payroll/employee.model';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {DropdownService} from '../../../services/dropdowns/dropdown.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import {UserService} from '../../../../administration/services/user/user.service';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';

@Component({
  selector: 'app-search-action',
  templateUrl: './search-action.component.html',
  styleUrls: ['./search-action.component.scss']
})
export class SearchActionComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  actions;

  @Input() paramsFromActionList;

  public searchValue = '';

  public filterAndSearchObject = new ActionsListParams();

  public selectedFilter = ActionConstant.ALL_ACTIONS;
  public actionsList = [];
  public associatedToFilter = ActionConstant.ASSOCIATED_TO_TITLE;
  public showModeMyActions = true;
  public showColCollaborater = true;
  public actionsFilter = ActionFilterTypeEnum;
  public chosenFilterNumber = this.actionsFilter.ACTION_ALL;

  public showColState = true;
  public showColPriority = true;
  public showColType = true;
  public filterByType = false;
  public filterByAssignedTo = false;
  public showColOrganization = true;
  public actionsTypes = [];
  public actionsStates = [];
  public actionsPriorities = [];
  public opportunitiesList: Array<Opportunity> = [];
  public organizationsList: Array<Organisation> = [];
  public contactsList: Array<ContactCrm> = [];

  private selectAllType = ActionConstant.ALL_TYPES;

  public ALL_STATES = this.translate.instant('ALL_STATES');
  public ALL_PRIORITIES = this.translate.instant('ALL_PRIORITIES');

  public connectedUser;

  public isByUserConnectedShowMode = false;
  // the sender of the data to the parent
  @Output() sendData = new EventEmitter<any>();
  @Input() isProspect;
  @Input() source: string;
  @Input() sourceId: number;
  @Input() related = false;

  @Input() reloadData: Observable<any>;

  @Output() stopSendingEvent = new EventEmitter<any>();
  private eventsSubscription: Subscription;
  public finalResult;
  private isClient: boolean;
  public listResponsablesUsers: Array<Employee>;
  public listResponsablesUsersFiltred: Array<Employee>;
  public searchedState;
  public searchedType;
  public searchedPriority;
  private connectedUserId: any;
  public predicate: PredicateFormat;
  public sortParams = SharedCrmConstant.DEFAULT_SORT;
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getConnectedUser();
    this.initResponsiblesDataSource();
    this.reloadDataAfterEventFromActionList();
    this.stopSendingEvent.emit();
    if (this.paramsFromActionList) {
      this.filterAndSearchObject.pageNumber = this.paramsFromActionList.pageNumber;
      this.filterAndSearchObject.pageSize = this.paramsFromActionList.pageSize;
      this.filterAndSearchObject.searchValue = this.searchValue;
      this.filterAndSearchObject.isArchived = this.paramsFromActionList.isArchived;
      this.filterAndSearchObject.sort = this.paramsFromActionList.sort;
      this.finalSearchAndFilter();
    } else {
      this.filterAndSearchObject = new ActionsListParams(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize, this.searchValue, this.paramsFromActionList.sort, false);
    }
    this.getUserByEmail();
  }

  constructor(private actionsService: ActionService,
              private contactService: ContactCrmService,
              private organizationService: OrganisationService,
              private translate: TranslateService,
              private opportunityService: OpportunityService,
              private tiersService: TiersService,
              private contactClientService: ContactService,
              private dropdownService: DropdownService,
              private localStorageService: LocalStorageService,
              private userService: UserService) {
  }

  handleFilterResponsables(responsableSearched) {
    this.listResponsablesUsers = this.listResponsablesUsers.filter(responsable => responsable.FullName.toLowerCase()
      .indexOf(responsableSearched.toLowerCase()) !== -1);

  }

  /**
   * remove the current connected user from the reponsables list
   */
  private removeCurrentUserFromListResponsables() {
    this.listResponsablesUsers = this.listResponsablesUsers.filter(responsable => responsable.Id !== this.connectedUserId);
    this.listResponsablesUsersFiltred = this.listResponsablesUsersFiltred.filter(responsable => responsable.Id !== this.connectedUserId);
  }

  /**
   * get the list of employees to select to whom the action is attributed to
   */

  /*public initResponsiblesDataSource() {
    this.teamService.getEmployeesOfTeamType([SharedConstant.CRM]).subscribe(data => {
      this.listResponsablesUsers = data.objectData;
      this.listResponsablesUsersFiltred = data.objectData;
    }, () => {

    }, () => {
      this.removeCurrentUserFromListResponsables();
    });
  }*/
  filterUsers() {
    this.listResponsablesUsersFiltred = this.listResponsablesUsersFiltred.filter(responsable => responsable.FullName != null);
    this.removeDuplicateUsers();
    this.listResponsablesUsers = this.listResponsablesUsersFiltred;
  }

  removeDuplicateUsers() {
    this.listResponsablesUsersFiltred = this.listResponsablesUsersFiltred.reduce((a, b) => {
      if (!a.find(data => data.Email === b.Email)) {
        a.push(b);
      }
      return a;
    }, []);
  }

  initResponsiblesDataSource() {
    this.predicate = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicate).subscribe(data => {
      this.listResponsablesUsers = data.data.filter(user => user.Email !== this.connectedUser.Email);
      this.listResponsablesUsersFiltred = data.data.filter(user => user.Email !== this.connectedUser.Email);
      this.filterUsers();
    }, () => {
    }, () => {
    });
  }

  reloadDataAfterEventFromActionList() {
    if (this.reloadData) {
      this.eventsSubscription = this.reloadData.subscribe((data) => {
        if (data && data.reloadData === true) {
          this.finalSearchAndFilter();
        }
      });
    }
  }

  finalSearchAndFilterByState() {
    switch (this.filterAndSearchObject.filterValue) {
      case ActionConstant.ACTION_PREVIOUS :
        this.finalSearchAndFilterPreviousActions();
        break;
      case ActionConstant.ACTION_UPCOMING :
        this.finalSearchAndFilterUpcomingActions();
        break;
      case ActionConstant.ACTIONS_NOT_STARTED :
      case ActionConstant.ACTION_IN_PROGRESS :
      case ActionConstant.ACTIONS_COMPLETED : {
        this.finalSearchAndFilterByStateActions();
      }
        break;
    }
  }

  finalSearchAndFilterByPriority() {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getSearchedAndFilteredByPriorityAndCommercialIdActions(this.filterAndSearchObject.filterValue);
      } else {
        this.getSearchedAndFilteredByPriorityActions(this.filterAndSearchObject.filterValue);
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getFilteredByPriorityAndCommercialIdActions(this.filterAndSearchObject.filterValue);
      } else {
        this.getFilteredByPriorityActions(this.filterAndSearchObject.filterValue);
      }
    }
  }

  finalSearchAndFilterByContact() {
    if (this.isClient) {
      this.finalSearchAndFilterByContactClientActions(this.filterAndSearchObject.filterValue);
    } else {
      this.finalSearchAndFilterByContactActions(this.filterAndSearchObject.filterValue);
    }
  }

  finalSearchAndFilterByOrganization() {
    if (this.isClient) {
      this.finalSearchAndFilterByOrganizationClientActions(this.filterAndSearchObject.filterValue);
    } else {
      this.finalSearchAndFilterByOrganizationActions(this.filterAndSearchObject.filterValue);
    }
  }

  public finalSearchAndFilter() {
    if (!this.related) {
      switch (this.filterAndSearchObject.filterType) {
        case ActionConstant.BY_STATE :
          this.finalSearchAndFilterByState();
          break;
        case ActionConstant.ACTION_BY_PRIORITY :
          this.finalSearchAndFilterByPriority();
          break;
        case ActionConstant.BY_TYPE :
          this.finalSearchAndFilterByTypeActions();
          break;
        case ActionConstant.BY_OPPORTUNITY_ID :
          this.finalSearchAndFilterByOpportunityActions(this.filterAndSearchObject.filterValue);
          break;
        case ActionConstant.ACTION_BY_CONTACT :
          this.finalSearchAndFilterByContact();
          break;
        case ActionConstant.ACTION_BY_ORGANIZATION :
          this.finalSearchAndFilterByOrganization();
          break;
        case ActionConstant.BY_COLLABORATER :
          this.finalSearchActionByCollaborater();
          break;
        default : {
          this.finalSearchWithoutFilter();
        }
      }
    } else {
      this.initRelatedActionsGridDataSource();
    }
  }

  initRelatedActionsGridDataSource() {
    switch (this.source) {
      case ActionConstant.CONTACT :
        if (this.isProspect) {
          this.finalSearchRelatedAndFilterByContactActions();
        } else {
          this.finalSearchRelatedAndFilterByContactClientActions(this.sourceId);
        }
        break;
      case ActionConstant.ORGANISATION :
        if (this.isProspect) {
          this.finalSearchRelatedAndFilterByOrganizationActions(this.sourceId);
        } else {
          this.finalSearchRelatedAndFilterByOrganizationClientActions(this.sourceId);
        }
        break;
      case ActionConstant.OPPORTUNITY :
        if (this.isProspect) {
          this.finalSearchRelatedAndFilterByOpportunityActions(this.sourceId);
        } else {
          this.finalSearchRelatedAndFilterByOpportunityClientActions(this.sourceId);
        }

        break;
      default:
        return;
    }
  }

  finalSearchWithoutFilter() {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode === true) {
        this.getSearchedActionsByCommercial(this.connectedUserId);
      } else {
        this.getAllActionsBySearchValue();
      }
    } else {
      if (this.isByUserConnectedShowMode === true) {
        this.getAllActionsByCommercial(this.connectedUserId);
      } else {
        this.getAllActions();
      }
    }
  }

  finalSearchActionByCollaborater() {
    if (this.searchValue) {
      this.getSearchedActionsByCommercial(this.filterAndSearchObject.filterValue);
    } else {
      this.getAllActionsByCommercial(this.filterAndSearchObject.filterValue);
    }
  }

  finalSearchAndFilterPreviousActions() {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getPreviousActionsBySearchValueAndCommercialId();
      } else {
        this.getPreviousActionBySearchValue();
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getPreviousActionsByCommercial();
      } else {
        this.getPreviousActions();
      }
    }
  }

  finalSearchAndFilterUpcomingActions() {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getUpComingActionsBySearchValueAndCommercialId();
      } else {
        this.getUpcomingActionBySearchValue();
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getUpcomingActionByCommercial();
      } else {
        this.getUpcomingActions();
      }
    }
  }

  finalSearchAndFilterByOpportunityActions(opportunityId) {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getSearchedAndFilteredByOpportunityIdAndCommercialIdActions(opportunityId);
      } else {
        this.getSearchedAndFilteredByOpportunityIdActions(opportunityId);
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getFilteredByOpportunityIdAndCommercialIdActions(opportunityId);
      } else {
        this.getFilteredByOpportunityIdActions(opportunityId);
      }
    }
  }

  finalSearchAndFilterByContactActions(contactId) {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getSearchedAndFilteredByContactIdAndCommercialIdActions(contactId);
      } else {
        this.getSearchedAndFilteredByContactIdActions(contactId);
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getFilteredByContactIdAndCommercialIdActions(contactId);
      } else {
        this.getFilteredByContactIdActions(contactId);
      }
    }
  }

  finalSearchAndFilterByOrganizationActions(organizationId) {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getSearchedAndFilteredByOrganizationIdAndCommercialIdActions(organizationId);
      } else {
        this.getSearchedAndFilteredByOrganizationIdActions(organizationId);
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getFilteredOrganizationIdAndCommercialIdActions(organizationId);
      } else {
        this.getFilteredByOrganizationIdActions(organizationId);
      }
    }
  }

  finalSearchAndFilterByTypeActions() {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getSearchedAndFilteredByTypeAndCommercialIdActions(this.filterAndSearchObject.filterValue);
      } else {
        this.getSearchedAndFilteredByTypeActions(this.filterAndSearchObject.filterValue);
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getFilteredByTypeAndCommercialIdActions(this.filterAndSearchObject.filterValue);
      } else {
        this.getFilteredByTypeActions(this.filterAndSearchObject.filterValue);
      }
    }
  }

  finalSearchAndFilterByStateActions() {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getSearchedAndFilteredByStateAndCommercialIdActions(this.filterAndSearchObject.filterValue);
      } else {
        this.getSearchedAndFilteredByStateActions(this.filterAndSearchObject.filterValue);
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getFilteredByStateAndCommercialIdActions(this.filterAndSearchObject.filterValue);
      } else {
        this.getFilteredByStateActions(this.filterAndSearchObject.filterValue);
      }
    }
  }

  returnToAllActionMode() {
    this.showModeMyActions = true;
    this.isByUserConnectedShowMode = false;
    this.filterAndSearchObject.commercialConcernedId = null;
    this.finalSearchAndFilter();
  }


  initStateDropDown() {
    this.actionsStates = [];
    this.dropdownService.getAllFiltreByName('STATE', 'ACTION')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.actionsStates.push(filtreName.name);
            }
          );
        }
      });
  }

  initPriorityDropDown() {
    this.actionsPriorities = [];
    this.dropdownService.getAllFiltreByName('PRIORITY', 'ACTION')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.actionsPriorities.push(filtreName.name);
            }
          );
        }
      });
  }

  getNotStartedActions() {
    this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
      this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.BY_STATE, this.searchedState);
    this.initFilterByStates();
  }

  getInProgressActions() {
    this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
      this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.BY_STATE, ActionConstant.ACTION_IN_PROGRESS);
    this.initFilterByStates();
  }

  getComletedActions() {
    this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
      this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.BY_STATE, ActionConstant.ACTIONS_COMPLETED);
    this.initFilterByStates();
  }

  getUrgentPriorityActions() {
    this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
      this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.ACTION_BY_PRIORITY, this.searchedPriority);
    this.initFilterByPriorities();
  }

  getHighPriorityActions() {
    this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
      this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.ACTION_BY_PRIORITY, ActionConstant.ACTION_HIGH);
    this.initFilterByPriorities();
  }

  getMediumPriorityActions() {
    this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
      this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.ACTION_BY_PRIORITY, ActionConstant.ACTION_MEDIUM);
    this.initFilterByPriorities();
  }

  getLowPriorityActions() {
    this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
      this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.ACTION_BY_PRIORITY, ActionConstant.ACTION_LOW);
    this.initFilterByPriorities();
  }

  filterUpcomingActions(chosenFilter) {
    this.initStateDropDown();
    this.selectedFilter = ActionConstant.ACTION_UPCOMING;
    this.chosenFilterNumber = chosenFilter;
    this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
      this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.BY_STATE, ActionConstant.ACTION_UPCOMING, this.sourceId);
    this.finalSearchAndFilter();
  }

  filterPreviousActions(chosenFilter) {
    this.initStateDropDown();
    this.selectedFilter = ActionConstant.ACTION_PREVIOUS;
    this.chosenFilterNumber = chosenFilter;
    this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
      this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.BY_STATE, ActionConstant.ACTION_PREVIOUS, this.sourceId);

    this.finalSearchAndFilter();
  }

  /**
   * filter the kendo data grid with the chosen index filter
   * @param chosenFilter
   */
  filterAction(chosenFilter) {
    this.initColsAndButtons(false, true, true, false, true, true);
    switch (chosenFilter) {
      case this.actionsFilter.ACTION_ALL : {
        this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
          this.searchValue, this.paramsFromActionList.isArchived, null, null, this.sourceId);
        this.selectedFilter = ActionConstant.ALL_ACTIONS;
        this.initColsAndButtons(false, true, true, false, true, true);
        this.chosenFilterNumber = chosenFilter;
        this.finalSearchAndFilter();
      }
        break;
      case this.actionsFilter.ACTION_UPCOMING: {
        this.filterUpcomingActions(chosenFilter);
      }
        break;
      case this.actionsFilter.ACTION_PREVIOUS: {
        this.filterPreviousActions(chosenFilter);

      }
        break;
      case this.actionsFilter.ACTION_BY_CONTACT : {
        this.initContactsDropDown();
        this.selectedFilter = ActionConstant.ACTION_BY_CONTACT;
        this.initFilter();
        this.chosenFilterNumber = chosenFilter;
        this.finalSearchAndFilter();
      }
        break;

      case this.actionsFilter.ACTION_BY_ORGANIZATION : {
        this.initOrganizationsDropDown();
        this.selectedFilter = ActionConstant.ACTION_BY_ORGANIZATION;
        this.initFilter();
        this.chosenFilterNumber = chosenFilter;
        this.finalSearchAndFilter();
      }
        break;
      case this.actionsFilter.ACTION_ASSIGNED_TO : {
        this.initOpportunitiesDropDown();
        this.selectedFilter = this.associatedToFilter;
        this.initFilter();
        this.initColsAndButtons(false, true, true, true, true, true);
        if (this.isByUserConnectedShowMode === true) {
          this.showModeMyActions = false;
        }
        this.chosenFilterNumber = chosenFilter;
        this.finalSearchAndFilter();
      }
        break;
      case this.actionsFilter.ACTION_BY_STATE: {
        this.initStateDropDown();
        this.selectedFilter = ActionConstant.ACTION_BY_STATE;
        this.chosenFilterNumber = chosenFilter;
        this.initFilter();
        this.finalSearchAndFilter();
      }
        break;
      case this.actionsFilter.ACTION_BY_PRIORITY: {
        this.initPriorityDropDown();
        this.selectedFilter = ActionConstant.ACTION_BY_PRIORITY;
        this.chosenFilterNumber = chosenFilter;
        this.initFilter();
        this.finalSearchAndFilter();
        break;
      }
      case this.actionsFilter.ACTION_BY_TYPE : {
        this.selectedFilter = ActionConstant.BY_TYPE;
        this.initTypesDropDown();
        this.initColsAndButtons(true, true, true, false, true, true);
        this.initFilter();
        this.chosenFilterNumber = chosenFilter;
        this.finalSearchAndFilter();
      }
        break;
      case this.actionsFilter.ACTION_MY_ACTIONS : {
        if (this.selectedFilter === ActionConstant.BY_COLLABORATER) {
          this.chosenFilterNumber = this.actionsFilter.ACTION_ALL;
          this.filterAndSearchObject.filterType = ActionConstant.ALL_ACTIONS;
          this.selectedFilter = ActionConstant.ALL_ACTIONS;
        }
        this.passeToMyActionsMode();
      }
        break;
      case this.actionsFilter.ACTION_BY_COMMERCIAL : {
        this.selectedFilter = ActionConstant.BY_COLLABORATER;
        this.initFilter();
        this.chosenFilterNumber = chosenFilter;
        this.finalSearchAndFilter();
      }
        break;
    }
  }

  passeToMyActionsMode() {
    this.isByUserConnectedShowMode = true;
    this.filterAndSearchObject.commercialConcernedId = this.connectedUserId;
    this.showModeMyActions = false;
    this.finalSearchAndFilter();
  }

  initFilterByStates() {
    this.initColsAndButtons(false, false, true, false, true, true);
  }

  initFilterByPriorities() {
    this.initColsAndButtons(false, true, true, false, true, true,
      false);
  }

  initColsAndButtons(filterByType?, showColState?, showColType?, filterByAssignedTo?,
                     showColCollaborater?, showColOrganization?, showColPriority?) {
    this.filterByType = filterByType;
    this.showColState = showColState;
    this.showColPriority = showColPriority;
    this.showColType = showColType;
    this.filterByAssignedTo = filterByAssignedTo;
    this.showColCollaborater = showColCollaborater;
    this.showColOrganization = showColOrganization;
  }

  initTypesDropDown() {
    this.actionsTypes = [];
    this.dropdownService.getAllFiltreByName('Type', 'ACTION')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.actionsTypes.push(filtreName.name);
            }
          );
        }
      });

  }

  filterActionsByType(type) {
    if (type === this.selectAllType) {
      this.showColType = true;
      this.initFilter();
      this.filterAction(this.actionsFilter.ACTION_BY_TYPE);
    } else {
      this.showColType = false;
      this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
        this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.BY_TYPE, type);
      this.finalSearchAndFilter();
    }
  }

  filterActionsByCostumer(custumerId) {
    if (custumerId) {
      this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
        this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.BY_COLLABORATER, custumerId);
      this.finalSearchAndFilter();
      this.initColsAndButtons(false, true, true, false, false, true);
    } else {
      this.initColsAndButtons(false, true, true, false, true, true);
      this.initFilter();
      this.filterAction(this.actionsFilter.ACTION_BY_COMMERCIAL);
    }
  }

  filterActionsByState(state) {
    this.searchedState = state;
    if (state === this.ALL_STATES) {
      this.initColsAndButtons(false, true, true, false, true, true);
      this.initFilter();
      this.filterAction(this.actionsFilter.ACTION_BY_STATE);
    } else {
      this.getNotStartedActions();
      this.getFilteredByStateActions(this.searchedState);
    }
    this.finalSearchAndFilter();
  }

  filterActionsByPriority(priority) {
    this.searchedPriority = priority;
    if (priority === this.ALL_PRIORITIES) {
      this.initColsAndButtons(false, true, true,
        false, true, true, false);
      this.initFilter();
      this.filterAction(this.actionsFilter.ACTION_BY_PRIORITY);
    } else {

      this.getUrgentPriorityActions();
      this.getFilteredByPriorityActions(this.searchedPriority);
    }
    this.finalSearchAndFilter();
  }

  filterActionsByOpportunity(opportunity) {
    this.initColsAndButtons(false, true, true, true, true, true);

    if (opportunity) {
      this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
        this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.BY_OPPORTUNITY_ID, opportunity.id);
      this.finalSearchAndFilter();
    } else {
      this.initFilter();
      this.finalSearchAndFilter();
    }
  }

  filterActionsByContact(contact) {
    this.initColsAndButtons(false, true, true, false, true, true);
    if (contact) {
      this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
        this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.ACTION_BY_CONTACT, contact.id);
      this.isClient = !this.related && contact.isClient ? contact.isClient : false;
      this.finalSearchAndFilter();
    } else {
      this.initFilter();
      this.filterAction(this.actionsFilter.ACTION_BY_CONTACT);
    }
  }

  filterActionsByOrganization(organization) {
    if (organization) {
      this.initColsAndButtons(false, true, true, false, true, false);
      this.prepareSearchAndFilterObject(this.paramsFromActionList.pageNumber, this.paramsFromActionList.pageSize,
        this.searchValue, this.paramsFromActionList.isArchived, ActionConstant.ACTION_BY_ORGANIZATION, organization.id);
      this.isClient = !this.related && organization.isClient ? organization.isClient : false;
      this.finalSearchAndFilter();
    } else {
      this.initColsAndButtons(false, true, true, false, true, true);
      this.initFilter();
      this.filterAction(this.actionsFilter.ACTION_BY_ORGANIZATION);
    }
  }

  prepareSearchAndFilterObject(pageNumber, pageSize, searchValue, isArchived, filterType, filterValue, contactId?) {
    if (this.isByUserConnectedShowMode === true) {
      this.filterAndSearchObject = new ActionsListParams(pageNumber, pageSize, searchValue, isArchived, filterType, filterValue,
        this.connectedUserId, contactId);
      this.showModeMyActions = false;
    } else {
      this.filterAndSearchObject = new ActionsListParams(pageNumber, pageSize, searchValue, isArchived, filterType, filterValue, null,
        contactId);
    }
  }

  initFilter() {
    this.filterAndSearchObject.filterType = null;
    this.filterAndSearchObject.filterValue = null;
  }

  initOpportunitiesDropDown() {
    this.opportunitiesList = [];
    this.opportunityService.getJavaGenericService().getEntityList(ActionConstant.RELATED_TO_ACTIONS).subscribe((data) => {
      this.opportunitiesList = this.opportunitiesList.concat(data);
    });
  }

  initOrganizationsDropDown() {
    this.organizationsList = [];
    this.organizationService.getJavaGenericService().getEntityList(ActionConstant.RELATED_TO_ACTIONS).subscribe((data) => {
      this.organizationsList = this.organizationsList.concat(data);
    });
    this.getIdsClientOrganizationRelatedToClientOpportunity();
  }

  initContactsDropDown() {
    this.contactsList = [];
    this.contactService.getJavaGenericService().getEntityList(ActionConstant.RELATED_TO_ACTIONS).subscribe((data) => {
      this.contactsList = this.contactsList.concat(data);
      this.contactsList.forEach((contact) => {
        this.getContactFullName(contact);
      });
    });
    this.getIdsClientContactRelatedToClientOpportunity();
  }

  getContactFullName(contact: ContactCrm) {
    contact.name = contact.name.concat(' ').concat(contact.lastName);
  }

  sendFilterAndSearchValues(filterAndSearchObject) {
    this.sendData.emit({
      'value': filterAndSearchObject, 'showColState': this.showColState,
      'filterByType': this.filterByType, 'showColType': this.showColType, 'filterByAssignedTo': this.filterByAssignedTo,
      'selectedFilter': this.selectedFilter, 'showModeMyActions': this.showModeMyActions, 'showColCollaborater': this.showColCollaborater,
      'showColOrganization': this.showColOrganization
    });
  }

  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
  }

  getAllActionsBySearchValue() {
    this.actionsService.getActionsBySearchValue(this.searchValue, this.filterAndSearchObject.pageNumber,
      this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  getAllActions() {
    this.actionsService.getAllActions(this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived,this.filterAndSearchObject.sort ? this.filterAndSearchObject.sort: this.sortParams ).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  getSearchedActionsByCommercial(costumerId) {
    this.actionsService.getSearchedActionsByCommercial(this.searchValue, costumerId, this.filterAndSearchObject.pageNumber
      , this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  getAllActionsByCommercial(costumerId) {
    this.actionsService.getAllActionsByCommercial(costumerId, this.filterAndSearchObject.pageNumber
      , this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  getUpComingActionsBySearchValueAndCommercialId() {
    this.actionsService.getUpcomingActionBySearchValueAndCommercial(this.searchValue, this.filterAndSearchObject.pageNumber,
      this.filterAndSearchObject.pageSize, this.connectedUserId, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  getContactUpComingActionsBySearchValueAndCommercialId() {
    this.actionsService.getContactUpcomingActionBySearchValueAndCommercial(this.searchValue, this.filterAndSearchObject.pageNumber,
      this.filterAndSearchObject.pageSize, this.connectedUserId,
      this.sourceId, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  getUpcomingActionBySearchValue() {
    this.actionsService.getUpcomingActionBySearchValue(this.searchValue, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
      this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  getContactUpcomingActionBySearchValue() {
    this.actionsService.getContactUpcomingActionBySearchValue(this.searchValue, this.sourceId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  getPreviousActionsBySearchValueAndCommercialId() {
    this.actionsService.getPreviousActionBySearchValueAndCommercial(this.searchValue, this.filterAndSearchObject.pageNumber,
      this.filterAndSearchObject.pageSize, this.connectedUserId, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  getContactPreviousActionsBySearchValueAndCommercialId() {
    this.actionsService.getContactPreviousActionBySearchValueAndCommercial(this.searchValue, this.filterAndSearchObject.pageNumber,
      this.filterAndSearchObject.pageSize, this.connectedUserId, this.sourceId, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  getPreviousActionBySearchValue() {
    this.actionsService.getPreviousActionBySearchValue(this.searchValue, this.filterAndSearchObject.pageNumber,
      this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  getPreviousContactActionBySearchValue() {
    this.actionsService.getPreviousContactActionBySearchValue(this.searchValue, this.sourceId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  fillAndSendDataInPageAction(data) {
    if (data) {
      this.initActionsByClientOrganisationName(data);
    } else {
      this.sendFilterAndSearchValues(this.finalResult);
    }
  }

  private initActionsByClientOrganisationName(data) {
    const tiersId = [];
    for (const action of data.actionDtoList) {
      if (action.concernedOrgClientId) {
        tiersId.push(action.concernedOrgClientId);
      }
    }
    this.setClientActionOrganizationName(data, tiersId);
  }

  private setClientActionOrganizationName(data, tierdIds) {
    this.tiersService.getTiersListByArray(tierdIds).subscribe((tiers) => {
      this.setClientName(data, tiers);
      this.actionsList = data.actionDtoList;
      this.finalResult = {
        data: data.actionDtoList,
        total: data.totalElements
      };
      this.sendFilterAndSearchValues(this.finalResult);
    });
  }

  private setClientName(data, tiers) {
    for (const action of data.actionDtoList) {
      if (tiers.length > NumberConstant.ZERO) {
        const organisationTiers = tiers.find(tier => tier.Id === action.concernedOrgClientId);
        if (organisationTiers) {
          action.organizationName = organisationTiers.Name;
        }
      }
    }
  }

  public getUpcomingActions() {
    this.actionsService.getUpcomingActions(this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
      this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getContactUpcomingActions() {
    this.actionsService.getContactUpcomingActions(this.sourceId, this.filterAndSearchObject.pageNumber,
      this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getUpcomingActionByCommercial() {
    this.actionsService.getUpcomingActionByCommercial(this.connectedUserId, this.filterAndSearchObject.pageNumber,
      this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getContactUpcomingActionByCommercial() {
    this.actionsService.getContactUpcomingActionByCommercial(this.connectedUserId, this.sourceId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getPreviousActions() {
    this.actionsService.getPreviousActions(this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getContactPreviousActions() {
    this.actionsService.getContactPreviousActions(this.sourceId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
      this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getPreviousActionsByCommercial() {
    this.actionsService.getPreviousActionsCommercial(this.connectedUserId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
      this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getContactPreviousActionsByCommercial() {
    this.actionsService.getPreviousContactActionsCommercial(this.connectedUserId, this.sourceId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByOpportunityIdActions(opportunityId) {
    this.actionsService
      .getSearchedAndFilteredByOpportunityIdActions(this.searchValue, opportunityId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByOpportunityIdActionsContact(opportunityId) {
    this.actionsService.getSearchedAndFilteredByOpportunityIdActionsContact(this.searchValue, opportunityId,
      this.sourceId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByOpportunityIdActions(opportunitytId) {
    this.actionsService.getFilteredByOpportunityIdActions(opportunitytId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
      this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByOpportunityIdActionsContact(opportunityId) {
    this.actionsService.getFilteredByOpportunityIdActionsContact(opportunityId,
      this.sourceId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByOpportunityIdAndCommercialIdActions(opportunityId) {
    this.actionsService
      .getSearchedAndFilteredByOpportunityIdAndCommercialIdActions(this.searchValue, opportunityId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByOpportunityIdAndCommercialIdActionsContact(opportunityId) {
    this.actionsService.getSearchedAndFilteredByOpportunityIdAndCommercialIdActionsContact(this.searchValue, opportunityId,
      this.connectedUserId, this.sourceId, this.filterAndSearchObject.pageNumber,
      this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByOpportunityIdAndCommercialIdActions(opportunityId) {
    this.actionsService.getFilteredByOpportunityIdAndCommercialIdActions(opportunityId, this.connectedUserId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByOpportunityIdAndCommercialIdActionsContact(opportunityId) {
    this.actionsService.getFilteredByOpportunityIdAndCommercialIdActionsContact(opportunityId, this.connectedUserId,
      this.sourceId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
      this.filterAndSearchObject.isArchived).subscribe((data) => {
      this.fillAndSendDataInPageAction(data);
    });
  }

  public getSearchedAndFilteredByContactIdActions(contactId) {
    this.actionsService.getSearchedAndFilteredByContactIdActions(this.searchValue, contactId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByContactIdActions(contactId) {
    this.actionsService.getFilteredByContactIdActions(contactId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
      this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByContactIdAndCommercialIdActions(contactId) {
    this.actionsService.getSearchedAndFilteredByContactIdAndCommercialIdActions(this.searchValue, contactId, this.connectedUserId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByContactIdAndCommercialIdActions(contactId) {
    this.actionsService.getFilteredByContactIdAndCommercialIdActions(contactId, this.connectedUserId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByOrganizationIdActions(organizationId) {
    this.actionsService.getSearchedAndFilteredByOrganizationIdActions(this.searchValue, organizationId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByOrganizationIdActions(organizationId) {
    this.actionsService.getFilteredByOrganizationIdActions(organizationId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
      this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByOrganizationIdAndCommercialIdActions(organizationId) {
    this.actionsService.getSearchedAndFilteredByOrganizationIdAndCommercialIdActions(this.searchValue, organizationId,
      this.connectedUserId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredOrganizationIdAndCommercialIdActions(organizationId) {
    this.actionsService.getFilteredOrganizationIdAndCommercialIdActions(organizationId, this.connectedUserId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByStateActions(state) {
    return this.actionsService.getSearchedAndFilteredByStateActions(this.searchValue, state,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByPriorityActions(priority) {
    return this.actionsService.getSearchedAndFilteredByPriorityActions(this.searchValue, priority,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByStateContactActions(state) {
    return this.actionsService.getSearchedAndFilteredByStateContactActions(this.searchValue, state,
      this.sourceId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByPriorityContactActions(priority) {
    return this.actionsService.getSearchedAndFilteredByPriorityContactActions(this.searchValue, priority,
      this.sourceId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByStateActions(state) {
    return this.actionsService.getFilteredByStateActions(state, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
      this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByPriorityActions(priority) {
    return this.actionsService.getFilteredByPriorityActions(priority, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
      this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByStateContactActions(state) {
    return this.actionsService.getFilteredByStateContactActions(state, this.sourceId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByPriorityContactActions(priority) {
    return this.actionsService.getFilteredByPriorityContactActions(priority, this.sourceId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByStateAndCommercialIdActions(state) {
    this.actionsService.getSearchedAndFilteredByStateAndCommercialIdActions(this.searchValue, state, this.connectedUserId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByPriorityAndCommercialIdActions(priority) {
    this.actionsService.getSearchedAndFilteredByPriorityAndCommercialIdActions(this.searchValue, priority, this.connectedUserId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByStateAndCommercialIdActionsContact(state) {
    this.actionsService.getSearchedAndFilteredByStateAndCommercialIdActionsContact(this.searchValue, state, this.connectedUserId,
      this.sourceId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByPriorityAndCommercialIdActionsContact(priority) {
    this.actionsService.getSearchedAndFilteredByPriorityAndCommercialIdActionsContact(this.searchValue, priority, this.connectedUserId,
      this.sourceId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByStateAndCommercialIdActions(state) {
    this.actionsService.getFilteredByStateAndCommercialIdActions(state, this.connectedUserId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByPriorityAndCommercialIdActions(priority) {
    this.actionsService.getFilteredByPriorityAndCommercialIdActions(priority, this.connectedUserId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByStateAndCommercialIdActionsContact(state) {
    this.actionsService.getFilteredByStateAndCommercialIdActionsContact(state, this.connectedUserId, this.sourceId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByPriorityAndCommercialIdActionsContact(priority) {
    this.actionsService.getFilteredByPriorityAndCommercialIdActionsContact(priority, this.connectedUserId, this.sourceId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByTypeActions(type) {
    this.actionsService.getSearchedAndFilteredByTypeActions(this.searchValue, type, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
      this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByTypeActionsContact(type) {
    this.actionsService.getSearchedAndFilteredByTypeActionsContact(this.searchValue, type, this.sourceId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByTypeActions(type) {
    this.actionsService.getFilteredByTypeActions(type, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByTypeActionsContact(type) {
    this.actionsService.getFilteredByTypeActionsContact(type, this.sourceId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
      this.filterAndSearchObject.isArchived)
      .subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByTypeAndCommercialIdActions(type) {
    this.actionsService.getSearchedAndFilteredByTypeAndCommercialIdActions(this.searchValue, type, this.connectedUserId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getSearchedAndFilteredByTypeAndCommercialIdActionsContact(type) {
    this.actionsService.getSearchedAndFilteredByTypeAndCommercialIdActionsContact(this.searchValue, type, this.connectedUserId,
      this.sourceId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByTypeAndCommercialIdActions(type) {
    this.actionsService.getFilteredByTypeAndCommercialIdActions(type, this.connectedUserId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));
  }

  public getFilteredByTypeAndCommercialIdActionsContact(type) {
    this.actionsService.getFilteredByTypeAndCommercialIdActionsContact(type, this.connectedUserId, this.sourceId,
      this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe((data) => this.fillAndSendDataInPageAction(data));

  }

  finalSearchRelatedAndFilterByOpportunityAndByStatusActions(opportunityId, search) {
    switch (this.filterAndSearchObject.filterValue) {
      case ActionConstant.ACTION_PREVIOUS :
        this.finalSearchAndFilterPreviousAndByOpportunityActions(opportunityId, search);
        break;
      case ActionConstant.ACTION_UPCOMING :
        this.finalSearchAndFilterUpcomingAndByOpportunityActions(opportunityId, search);
        break;
      case ActionConstant.ACTIONS_NOT_STARTED :
      case ActionConstant.ACTION_IN_PROGRESS :
      case ActionConstant.ACTIONS_COMPLETED :
        this.finalSearchAndFilterByStateAndByOpportunityActions(opportunityId, search);
        break;
    }
  }

  finalSearchRelatedAndFilterByOpportunityAndByPriorityActions(opportunityId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionByPriorityAndByOpportunityAndUserConnected(search, opportunityId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionByPriorityAndByOpportunity(search, opportunityId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchRelatedAndFilterByOpportunityActions(opportunityId) {
    const search = this.searchValue ? this.searchValue : '';
    switch (this.filterAndSearchObject.filterType) {
      case ActionConstant.BY_STATE :
        this.finalSearchRelatedAndFilterByOpportunityAndByStatusActions(opportunityId, search);
        break;
      case ActionConstant.ACTION_BY_PRIORITY :
        this.finalSearchRelatedAndFilterByOpportunityAndByPriorityActions(opportunityId, search);
        break;
      case ActionConstant.BY_TYPE :
        this.finalSearchAndFilterByTypeAndByOpportunityActions(opportunityId, search);
        break;
      case ActionConstant.ACTION_BY_CONTACT :
        this.finalSearchAndFilterByContactAndByOpportunityActions(opportunityId, this.filterAndSearchObject.filterValue, search);
        break;
      case ActionConstant.ACTION_BY_ORGANIZATION :
        this.finalSearchAndFilterByOrganizationAndByOpportunityActions(opportunityId, this.filterAndSearchObject.filterValue, search);
        break;
      default :
        this.finalSearchAndFilterByOpportunityActions(opportunityId);
    }
  }

  finalSearchRelatedAndFilterByOrganizationClientAndByStatus(organizationId, search) {
    switch (this.filterAndSearchObject.filterValue) {
      case ActionConstant.ACTION_PREVIOUS :
        this.finalSearchAndFilterPreviousAndByOrganizationClientActions(organizationId, search);
        break;
      case ActionConstant.ACTION_UPCOMING :
        this.finalSearchAndFilterUpcomingAndByOrganizationClientActions(organizationId, search);
        break;
      case ActionConstant.ACTIONS_NOT_STARTED :
      case ActionConstant.ACTION_IN_PROGRESS :
      case ActionConstant.ACTIONS_COMPLETED :
        this.finalSearchAndFilterByStateAndByOrganizationClientActions(organizationId, search);
        break;
    }
  }

  finalSearchRelatedAndFilterByOrganizationClientAndByPriority(organizationId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByPriorityAndByOrganizationClientAndUserConnected(search, organizationId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue
        , this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByPriorityAndByOrganizationClient(search, organizationId, this.filterAndSearchObject.pageNumber,
        this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchRelatedAndFilterByOrganizationClientActions(organizationId) {
    const search = this.searchValue ? this.searchValue : '';
    switch (this.filterAndSearchObject.filterType) {
      case ActionConstant.BY_STATE :
        this.finalSearchRelatedAndFilterByOrganizationClientAndByStatus(organizationId, search);
        break;
      case ActionConstant.ACTION_BY_PRIORITY :
        this.finalSearchRelatedAndFilterByOrganizationClientAndByPriority(organizationId, search);
        break;
      case ActionConstant.BY_TYPE :
        this.finalSearchAndFilterByTypeAndByOrganizationClientActions(organizationId, search);
        break;
      case ActionConstant.ACTION_BY_CONTACT :
        this.finalSearchAndFilterByContactAndByOrganizationClientActions(organizationId, this.filterAndSearchObject.filterValue, search);
        break;
      case ActionConstant.BY_OPPORTUNITY_ID :
        this.finalSearchAndFilterByOpportunityAndByOrganizationClientActions(organizationId,
          this.filterAndSearchObject.filterValue, search);
        break;
      default :
        this.finalSearchAndFilterByOrganizationClientActions(organizationId);
    }
  }

  finalSearchRelatedAndFilterByOrganizationAndByStatus(organizationId, search) {
    switch (this.filterAndSearchObject.filterValue) {
      case ActionConstant.ACTION_PREVIOUS :
        this.finalSearchAndFilterPreviousAndByOrganizationActions(organizationId, search);
        break;
      case ActionConstant.ACTION_UPCOMING :
        this.finalSearchAndFilterUpcomingAndByOrganizationActions(organizationId, search);
        break;
      case ActionConstant.ACTIONS_NOT_STARTED :
      case ActionConstant.ACTION_IN_PROGRESS :
      case ActionConstant.ACTIONS_COMPLETED :
        this.finalSearchAndFilterByStateAndByOrganizationActions(organizationId, search);
        break;
    }
  }

  finalSearchRelatedAndFilterByOrganizationAndByPriority(organizationId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionByPriorityAndByOrganizationAndUserConnected(search, organizationId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionByPriorityAndByOrganization(search, organizationId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchRelatedAndFilterByOrganizationActions(organizationId) {
    const search = this.searchValue ? this.searchValue : '';
    switch (this.filterAndSearchObject.filterType) {
      case ActionConstant.BY_STATE :
        this.finalSearchRelatedAndFilterByOrganizationAndByStatus(organizationId, search);
        break;
      case ActionConstant.ACTION_BY_PRIORITY :
        this.finalSearchRelatedAndFilterByOrganizationAndByPriority(organizationId, search);
        break;
      case ActionConstant.BY_TYPE :
        this.finalSearchAndFilterByTypeAndByOrganizationActions(organizationId, search);
        break;
      case ActionConstant.BY_OPPORTUNITY_ID :
        this.finalSearchAndFilterByOpportunityAndByOrganizationActions(organizationId, this.filterAndSearchObject.filterValue, search);
        break;
      case ActionConstant.ACTION_BY_CONTACT :
        this.finalSearchAndFilterByContactAndByOrganizationActions(organizationId, this.filterAndSearchObject.filterValue, search);
        break;
      default :
        this.finalSearchAndFilterByOrganizationActions(organizationId);
    }
  }

  finalSearchAndFilterPreviousAndByOrganizationActions(organizationId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getPreviousActionsAndByOrganizationAndUserConnected(search, organizationId,
        this.connectedUserId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getPreviousActionsAndByOrganization(search, organizationId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterUpcomingAndByOrganizationActions(organizationId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getUpcomingActionsAndByOrganizationAndUserConnected(search, organizationId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getUpcomingActionsAndByOrganization(search, organizationId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByStateAndByOrganizationActions(organizationId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionByStateAndByOrganizationAndUserConnected(search, organizationId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionByStateAndByOrganization(search, organizationId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByTypeAndByOrganizationActions(organizationId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionByTypeAndByOrganizationActionsAndUserConnected(search, organizationId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionByTypeAndByOrganizationActions(search, organizationId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByOpportunityAndByOrganizationActions(organizationId, opportunityId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionByOpportunityAndByOrganizationAndUserConnected(search, organizationId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, opportunityId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionByOpportunityAndByOrganization(search, organizationId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, opportunityId,
        this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }

  }

  finalSearchAndFilterByContactAndByOrganizationActions(organizationId, contactId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByContactAndByOrganizationAndUserConnected(search, organizationId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, contactId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByContactAndByOrganization(search, organizationId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, contactId
        , this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterPreviousAndByOpportunityActions(opportunityId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getPreviousActionsByOpportunityAndUserConnected(search, opportunityId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getPreviousActionsByOpportunity(search, opportunityId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterUpcomingAndByOpportunityActions(opportunityId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getUpcomingActionAndByOpportunityAndUserConnected(search, opportunityId, this.connectedUserId,
        (this.filterAndSearchObject.pageNumber), this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getUpcomingActionAndByOpportunity(search, opportunityId, (this.filterAndSearchObject.pageNumber), this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByStateAndByOpportunityActions(opportunityId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionByStateAndByOpportunityAndUserConnected(search, opportunityId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionByStateAndByOpportunity(search, opportunityId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByTypeAndByOpportunityActions(opportunityId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByTypeAndByOpportunityAndUserConnected(search, opportunityId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByTypeAndByOpportunity(search, opportunityId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByOrganizationAndByOpportunityActions(opportunityId, organizationId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByOrganizationAndByOpportunityAndUserConnected(search, opportunityId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, organizationId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByOrganizationAndByOpportunity(search, opportunityId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        organizationId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByContactAndByOpportunityActions(opportunityId, contactId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByContactAndByOpportunityAndUserConnected(search, opportunityId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, contactId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByContactAndByOpportunity(search, opportunityId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        contactId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterPreviousAndByOrganizationClientActions(organizationId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getPreviousActionsByOrganizationClientAndUserConnected(search, organizationId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getPreviousActionsByOrganizationClient(search, organizationId, this.filterAndSearchObject.pageNumber,
        this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterUpcomingAndByOrganizationClientActions(organizationId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getUpcomingActionsByOrganizationClientActionsAndUserConnected(search, organizationId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getUpcomingActionsByOrganizationClientActions(search, organizationId, this.filterAndSearchObject.pageNumber
        , this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByStateAndByOrganizationClientActions(organizationId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByStateAndByOrganizationClientAndUserConnected(search, organizationId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue
        , this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByStateAndByOrganizationClient(search, organizationId, this.filterAndSearchObject.pageNumber,
        this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByTypeAndByOrganizationClientActions(organizationId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByTypeAndByOrganizationClientAndUserConnected(search, organizationId,
        this.connectedUserId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue
        , this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByTypeAndByOrganizationClient(search, organizationId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByOpportunityAndByOrganizationClientActions(organizationId, opportunityId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByOpportunityAndByOrganizationClientAndUserConnected(search, organizationId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, opportunityId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByOpportunityAndByOrganizationClient(search, organizationId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        opportunityId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByContactAndByOrganizationClientActions(organizationId, contactId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionByContactAndByOrganizationClientAndUserConnected(search, organizationId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, contactId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionByContactAndByOrganizationClient(search, organizationId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        contactId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByOrganizationClientActions(organizationId) {
    const search = this.searchValue ? this.searchValue : '';
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByOrganizationClientAndConnectedUser(search, organizationId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByOrganizationClient(search, organizationId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchRelatedAndFilterByOpportunityClientAndByStatus(opportunityId, search) {
    switch (this.filterAndSearchObject.filterValue) {
      case ActionConstant.ACTION_PREVIOUS :
        this.finalSearchAndFilterPreviousAndByOpportunityActions(opportunityId, search);
        break;
      case ActionConstant.ACTION_UPCOMING :
        this.finalSearchAndFilterUpcomingAndByOpportunityActions(opportunityId, search);
        break;
      case ActionConstant.ACTIONS_NOT_STARTED :
      case ActionConstant.ACTION_IN_PROGRESS :
      case ActionConstant.ACTIONS_COMPLETED :
        this.finalSearchAndFilterByStateAndByOpportunityActions(opportunityId, search);
        break;
    }
  }

  finalSearchRelatedAndFilterByOpportunityClientAndByPriority(opportunityId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionByPriorityAndByOpportunityAndUserConnected(search, opportunityId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionByPriorityAndByOpportunity(search, opportunityId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchRelatedAndFilterByOpportunityClientActions(opportunityId) {
    const search = this.searchValue ? this.searchValue : '';
    switch (this.filterAndSearchObject.filterType) {
      case ActionConstant.BY_STATE :
        this.finalSearchRelatedAndFilterByOpportunityClientAndByStatus(opportunityId, search);
        break;
      case ActionConstant.ACTION_BY_PRIORITY :
        this.finalSearchRelatedAndFilterByOpportunityClientAndByPriority(opportunityId, search);
        break;
      case ActionConstant.BY_TYPE :
        this.finalSearchAndFilterByTypeAndByOpportunityActions(opportunityId, search);
        break;
      case ActionConstant.ACTION_BY_CONTACT :
        this.finalSearchAndFilterByContactAndByOpportunityClientActions(opportunityId, this.filterAndSearchObject.filterValue, search);
        break;
      case ActionConstant.ACTION_BY_ORGANIZATION :
        this.finalSearchAndFilterByOrganizationAndByOpportunityClientActions(opportunityId, this.filterAndSearchObject.filterValue, search);
        break;
      default :
        this.finalSearchAndFilterByOpportunityActions(opportunityId);
    }
  }

  finalSearchAndFilterByContactAndByOpportunityClientActions(opportunityId, contactId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionByContactAndByOpportunityClientAndConnectedUser(search, opportunityId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, contactId
        , this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionByContactAndByOpportunityClient(search, opportunityId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        contactId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByOrganizationAndByOpportunityClientActions(opportunityId, organizationId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionByOrganizationAndByOpportunityClientAndConnectedUser(search, opportunityId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, organizationId
        , this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionByOrganizationAndByOpportunityClient(search, opportunityId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        organizationId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchRelatedAndFilterByContactAndStatus() {
    switch (this.filterAndSearchObject.filterValue) {
      case ActionConstant.ACTION_PREVIOUS : {
        this.finalSearchContactAndFilterPreviousActions();
      }
        break;
      case ActionConstant.ACTION_UPCOMING : {
        this.finalSearchAndFilterUpcomingActionsByContact();

      }
        break;
      case ActionConstant.ACTIONS_NOT_STARTED :
      case ActionConstant.ACTION_IN_PROGRESS :
      case ActionConstant.ACTIONS_COMPLETED : {
        this.finalSearchAndFilterByStateActionsByContact();
      }
        break;
    }
  }

  finalSearchRelatedAndFilterByContactActions() {
    switch (this.filterAndSearchObject.filterType) {
      case ActionConstant.BY_STATE :
        this.finalSearchRelatedAndFilterByContactAndStatus();
        break;
      case ActionConstant.ACTION_BY_PRIORITY :
        this.finalSearchRelatedAndFilterByContactAndPriority();
        break;
      case ActionConstant.BY_TYPE :
        this.finalSearchAndFilterByTypeActionsAndContact();
        break;
      case ActionConstant.BY_OPPORTUNITY_ID :
        this.finalSearchAndFilterByOpportunityAndContactActions(this.filterAndSearchObject.filterValue);
        break;
      case ActionConstant.ACTION_BY_ORGANIZATION :
        const search = this.searchValue ? this.searchValue : '';
        this.finalSearchAndFilterByContactAndByOrganizationActions(this.filterAndSearchObject.filterValue, this.sourceId, search);
        break;
      default :
        this.finalSearchAndFilterByContactActions(this.sourceId);
    }
  }

  finalSearchContactAndFilterPreviousActions() {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getContactPreviousActionsBySearchValueAndCommercialId();
      } else {
        this.getPreviousContactActionBySearchValue();
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getContactPreviousActionsByCommercial();
      } else {
        this.getContactPreviousActions();
      }
    }
  }

  finalSearchAndFilterUpcomingActionsByContact() {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getContactUpComingActionsBySearchValueAndCommercialId();
      } else {
        this.getContactUpcomingActionBySearchValue();
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getContactUpcomingActionByCommercial();
      } else {
        this.getContactUpcomingActions();
      }
    }
  }

  finalSearchAndFilterByStateActionsByContact() {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getSearchedAndFilteredByStateAndCommercialIdActionsContact(this.filterAndSearchObject.filterValue);
      } else {
        this.getSearchedAndFilteredByStateContactActions(this.filterAndSearchObject.filterValue);
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getFilteredByStateAndCommercialIdActionsContact(this.filterAndSearchObject.filterValue);
      } else {
        this.getFilteredByStateContactActions(this.filterAndSearchObject.filterValue);
      }
    }
  }

  finalSearchAndFilterByTypeActionsAndContact() {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getSearchedAndFilteredByTypeAndCommercialIdActionsContact(this.filterAndSearchObject.filterValue);
      } else {
        this.getSearchedAndFilteredByTypeActionsContact(this.filterAndSearchObject.filterValue);
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getFilteredByTypeAndCommercialIdActionsContact(this.filterAndSearchObject.filterValue);
      } else {
        this.getFilteredByTypeActionsContact(this.filterAndSearchObject.filterValue);
      }
    }
  }


  finalSearchRelatedAndFilterByContactAndPriority() {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getSearchedAndFilteredByPriorityAndCommercialIdActionsContact(this.filterAndSearchObject.filterValue);
      } else {
        this.getSearchedAndFilteredByPriorityContactActions(this.filterAndSearchObject.filterValue);
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getFilteredByPriorityAndCommercialIdActionsContact(this.filterAndSearchObject.filterValue);
      } else {
        this.getFilteredByPriorityContactActions(this.filterAndSearchObject.filterValue);
      }
    }
  }

  finalSearchAndFilterByOpportunityAndContactActions(opportunityId) {
    if (this.searchValue) {
      if (this.isByUserConnectedShowMode) {
        this.getSearchedAndFilteredByOpportunityIdAndCommercialIdActionsContact(opportunityId);
      } else {
        this.getSearchedAndFilteredByOpportunityIdActionsContact(opportunityId);
      }
    } else {
      if (this.isByUserConnectedShowMode) {
        this.getFilteredByOpportunityIdAndCommercialIdActionsContact(opportunityId);
      } else {
        this.getFilteredByOpportunityIdActionsContact(opportunityId);
      }
    }
  }

  finalSearchRelatedAndFilterByContactClientAndStatus(contactId, search) {
    switch (this.filterAndSearchObject.filterValue) {
      case ActionConstant.ACTION_PREVIOUS :
        this.finalSearchAndFilterPreviousAndByContactClientActions(contactId, search);
        break;
      case ActionConstant.ACTION_UPCOMING :
        this.finalSearchAndFilterUpcomingAndByContactClientActions(contactId, search);
        break;
      case ActionConstant.ACTIONS_NOT_STARTED :
      case ActionConstant.ACTION_IN_PROGRESS :
      case ActionConstant.ACTIONS_COMPLETED :
        this.finalSearchAndFilterByStateAndByContactClientActions(contactId, search);
        break;
    }
  }

  finalSearchRelatedAndFilterByContactClientAndPriority(contactId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByPriorityAndByContactClientAndConnectedUser(search, contactId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByPriorityAndByContactClient(search, contactId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchRelatedAndFilterByContactClientActions(contactId) {
    const search = this.searchValue ? this.searchValue : '';
    switch (this.filterAndSearchObject.filterType) {
      case ActionConstant.BY_STATE :
        this.finalSearchRelatedAndFilterByContactClientAndStatus(contactId, search);
        break;
      case ActionConstant.ACTION_BY_PRIORITY :
        this.finalSearchRelatedAndFilterByContactClientAndPriority(contactId, search);
        break;
      case ActionConstant.BY_TYPE :
        this.finalSearchAndFilterByTypeAndByContactClientActions(contactId, search);
        break;
      case ActionConstant.ACTION_BY_ORGANIZATION :
        this.finalSearchAndFilterByContactAndByContactClientActions(contactId, this.filterAndSearchObject.filterValue, search);
        break;
      case ActionConstant.BY_OPPORTUNITY_ID :
        this.finalSearchAndFilterByOpportunityAndByContactClientActions(contactId, this.filterAndSearchObject.filterValue, search);
        break;
      default :
        this.finalSearchAndFilterByContactClientActions(contactId);
    }
  }

  finalSearchAndFilterPreviousAndByContactClientActions(contactId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getPreviousActionsByContactClientAndConnectedUser(search, contactId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getPreviousActionsByContactClient(search, contactId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterUpcomingAndByContactClientActions(contactId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getUpcomingActionsByContactClientAndConnectedUser(search, contactId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getUpcomingActionsByContactClient(search, contactId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByStateAndByContactClientActions(contactId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByStateAndByContactClientAndConnectedUser(search, contactId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByStateAndByContactClient(search, contactId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByTypeAndByContactClientActions(contactId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByTypeAndByContactClientActionsAndConnectedUser(search, contactId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByTypeAndByContactClientActions(search, contactId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        this.filterAndSearchObject.filterValue, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByOpportunityAndByContactClientActions(contactId, opportunityId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByOpportunityAndByContactClientAndConnectedUser(search, contactId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, opportunityId, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByOpportunityAndByContactClient(search, contactId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        opportunityId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByContactAndByContactClientActions(contactId, organizationId, search) {
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionsByContactAndByContactClientAndConnectedUser(search, contactId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, organizationId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionsByContactAndByContactClient(search, contactId, this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize,
        organizationId, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  finalSearchAndFilterByContactClientActions(contactId) {
    const search = this.searchValue ? this.searchValue : '';
    if (this.isByUserConnectedShowMode) {
      this.actionsService.getActionByContactClientAndConnectedUser(search, contactId, this.connectedUserId,
        this.filterAndSearchObject.pageNumber, this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived).subscribe(_data => this.fillAndSendDataInPageAction(_data));
    } else {
      this.actionsService.getActionByContactClient(search, contactId, this.filterAndSearchObject.pageNumber
        , this.filterAndSearchObject.pageSize, this.filterAndSearchObject.isArchived)
        .subscribe(_data => this.fillAndSendDataInPageAction(_data));
    }
  }

  private getIdsClientOrganizationRelatedToClientOpportunity() {
    this.actionsService.callService(Operation.GET, 'organizationClient').subscribe(data => {
      data.forEach(id => {
        this.tiersService.getTiersById(id).subscribe((tiers) => {
          this.organizationsList.push(this.convertClientToOrganisation(tiers));
        });
      });
    });
  }

  convertClientToOrganisation(client) {
    const organizationClient = new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter,
      null, null, this.translate.instant(AddNewOpportunityComponent.TRANSLATE_CUSTOMER), client.Id);
    organizationClient.isClient = true;
    return organizationClient;
  }

  private getIdsClientContactRelatedToClientOpportunity() {
    this.actionsService.callService(Operation.GET, 'contactClient').subscribe(data => {
      data.forEach(id => {
        this.contactClientService.getById(id).subscribe((contact) => {
          contact.name = `${contact.FirstName}  ${contact.LastName}`;
          contact.id = contact.Id;
          contact.isClient = true;
          this.contactsList.push(contact);
        });
      });
    });
  }

  getUserByEmail() {
    this.userService.getByEmail(this.connectedUser.Email).subscribe(
      (user) => {
        const us = user;
        this.connectedUserId = user.Id;
      }
    );
  }

}
