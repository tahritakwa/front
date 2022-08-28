import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {SortDescriptor, State} from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { GrowlService } from '../../../../../COM/Growl/growl.service';
import { Operation } from '../../../../../COM/Models/operations';
import { ActionConstant } from '../../../../constant/crm/action.constant';
import { CrmConstant } from '../../../../constant/crm/crm.constant';
import { OrganisationConstant } from '../../../../constant/crm/organisation.constant';
import { SharedCrmConstant } from '../../../../constant/crm/sharedCrm.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { ActionsListParams } from '../../../../models/crm/actionsListParams';
import { CrmConfig } from '../../../../models/crm/CrmConfig.model';
import { ActionStateEnum } from '../../../../models/crm/enums/actionState.enum';
import { Opportunity } from '../../../../models/crm/opportunity.model';
import { TiersService } from '../../../../purchase/services/tiers/tiers.service';
import { SwalWarring } from '../../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { GenericCrmService } from '../../../generic-crm.service';
import { ActionService } from '../../../services/action/action.service';
import { ActionSidNavService } from '../../../services/sid-nav/action-sid-nav.service';
import { AddActionComponent } from '../add-action/add-action.component';
import { AuthService } from 'app/login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {UserService} from '../../../../administration/services/user/user.service';
@Component({
  selector: 'app-actions-list',
  templateUrl: './actions-list.component.html',
  styleUrls: ['./actions-list.component.scss']
})
export class ActionsListComponent implements OnInit {

  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  public filteredActions;
  public selectedFilter = ActionConstant.ALL_ACTIONS;
  public actionsList = [];
  public allActionsCommercialsNames = [];
  public allActions = [];
  public allActionsFilter = ActionConstant.ALL_ACTIONS;
  public showModeMyActions = true;
  public showColCollaborater = true;
  public showColOrganization = true;
  public showDetailAction = false;
  public actionToShowInSideNav;
  public filter = ActionStateEnum;
  public showColState = true;
  public showColPriority = true;
  public showColType = true;
  public filterByType = false;
  public filterByAssignedTo = false;
  public opportunitiesList: Array<Opportunity> = [];
  public actionsListParams;
  public actionsSelected: number [] = [];
  public selectKey = 'id';
  public checkbox_column_width = 60;
  public isFromArchive: boolean;
  @Input() isProspect;
  @Input() source: string;
  @Input() sourceId: number;
  @Input() related = false;
  @Input() sourceType;
  @Input() isArchivingMode = false;
  @Input() fromRelatedArchiving = false;
  private responsabelsIds = [];
  private responsablesDetails = [];
  public crmConfig: CrmConfig = new CrmConfig();
  public sideNavUpdateMode = false;
  updateSearchAction: Subject<any> = new Subject<void>();

  updateReloadDataEventIsPossible = false;

  public COMMAND_COLUMN_WIDTH = NumberConstant.ONE_HUNDRED_FIFTY;

  public pagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  private pageSize = NumberConstant.TEN;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  public sort: SortDescriptor[] = [
    {
      field: ActionConstant.NAME_FIELD,
      dir: 'asc'
    }
  ];
  public gridState: State = {
    skip: 0,
    take: this.pageSize,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: ActionConstant.NAME_FIELD,
      title: ActionConstant.NAME_TITLE,
      filterable: true,
      _width : 150
    },
    {
      field: ActionConstant.ORGANIZATION_FIELD,
      title: ActionConstant.ORGANIZATION_TITLE,
      filterable: true,
      _width : 130
    },
    {
      field: ActionConstant.PROGRESS_FIELD,
      title: ActionConstant.PROGRESS_TITLE,
      filterable: true,
      _width : 120
    },
    {
      field: ActionConstant.RESPONSIBLE_USER_FIELD,
      title: ActionConstant.COLLABORATER,
      filterable: true,
      _width : 130
    },
    {
      field: ActionConstant.DEADLINE_FIELD,
      title: ActionConstant.DEADLINE_TITLE,
      filterable: true,
      _width : 120
    },
    {
      field: ActionConstant.STATE_FIELD,
      title: ActionConstant.STATE_TITLE,
      filterable: true,
      _width : 120
    },
    {
      field: ActionConstant.TYPE_FIELD,
      title: ActionConstant.TYPE_TITLE,
      filterable: true,
      _width : 120
    },
    {
      field: ActionConstant.PRIORITY_field,
      title: ActionConstant.PRIORITY,
      filterable: true,
      _width : 120
    }
  ];


  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public sortParams = SharedCrmConstant.DEFAULT_SORT;
  /**
   *
   * @param actionsService
   * @param swalWarring
   * @param translate
   * @param router
   * @param formModalDialogService
   * @param viewRef
   * @param growlService
   * @param sidNavService
   * @param tiersService
   * @param genericCrmService
   * @param activatedRoute
   */
  constructor(private actionsService: ActionService,
              private swalWarring: SwalWarring,
              private translate: TranslateService,
              private router: Router,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              private growlService: GrowlService,
              private  sidNavService: ActionSidNavService,
              private tiersService: TiersService,
              private genericCrmService: GenericCrmService,
              private activatedRoute: ActivatedRoute,
              public authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.getArchivingModes();
    this.initCrmConfigBtnGrid();
    this.actionsListParams = new ActionsListParams(((this.gridSettings.state.skip / this.pageSize)), this.pageSize,
      '', this.isArchivingMode, this.sortParams);
    if (!this.related) {
      this.getResultFromSideNav();
    }
    this.activatedRoute.params.subscribe(params => {
      const organisationId = params[CrmConstant.ORGANISATION_ID];
      const opportunityId = params[CrmConstant.OPPORTUNITY_ID];
      const contactId = params[CrmConstant.CONTACT_ID];
      const archive = params[CrmConstant.ARCHIVE];
      if (organisationId || opportunityId || contactId) {
        this.isArchivingMode = (archive === 'true');
        this.isFromArchive = true;
        this.initDataGridFromArchivePopup(organisationId, opportunityId, contactId, archive);
      }
    });
  }

  getArchivingModes() {
    this.isArchivingMode = this.actionsService.getIsArchivingMode();
    this.fromRelatedArchiving = this.actionsService.getFromRelatedArchiving();
  }
  initDataGridFromArchivePopup(organisationId, opportunityId, contactId, archive) {
    if (organisationId) {
      this.initActionsGridDataSourceByOrganisation(organisationId, archive);
    } else if (opportunityId) {
      this.initActionsGridDataSourceByOpportunity(opportunityId, archive);
    } else if (contactId) {
      this.initRelatedActionsGridDataSourceFromContact(contactId, archive);
    }
  }

  public initActionsGridDataSourceByOrganisation(organizationId, archive) {
    this.actionsService.getFilteredByOrganizationIdActions(organizationId, this.gridState.skip, this.pageSize, archive)
      .subscribe((data) => this.fillDataInPageAction(data));
  }

  public initActionsGridDataSourceByOpportunity(opportunityId, archive) {
    this.actionsService.getFilteredByOpportunityIdActions(opportunityId, this.gridState.skip, this.pageSize, archive)
      .subscribe((data) => this.fillDataInPageAction(data));
  }

  public initRelatedActionsGridDataSourceFromContact(contactId, archive) {
    this.actionsService.getFilteredByContactIdActions(contactId, this.gridState.skip, this.pageSize, archive)
      .subscribe((data) => this.fillDataInPageAction(data));
  }

  fillDataInPageAction(data) {
    this.gridSettings.gridData = {
      data: data.actionDtoList,
      total: data.totalElements
    };
  }

  getResultFromSideNav() {
    this.sidNavService.getResult().subscribe((_data) => {
      if (_data === false) {
        this.showDetailAction = false;
        this.actionsListParams = {
          pageNumber: this.actionsListParams.pageNumber,
          pageSize: this.pageSize,
          isArchived: this.isArchivingMode
        };
      } else if (_data.data && _data.parent === ActionConstant.NOTIFICATION) {
        this.showDetails(_data.data);
      }
    });
  }

  onPageChange(event) {
    this.pageSize = event.take;
    this.actionsListParams = {
      pageNumber: (this.gridSettings.state.skip / this.pageSize),
      pageSize: event.take,
      isArchived: this.isArchivingMode
    };
  }

  public dataStateChange(state: State): void {
    this.sortParams = (state.sort.length > 0 && state.sort[NumberConstant.ZERO].dir) ? `${state.sort[NumberConstant.ZERO].field},${state.sort[NumberConstant.ZERO].dir}` :
      this.sortParams = SharedCrmConstant.DEFAULT_SORT;
    this.pageSize = state.take;
    this.gridSettings.state = state;
  }

  public openAddPopUp() {
    this.formModalDialogService.openDialog(null, AddActionComponent, this.viewRef,
      this.refreshListAfterOperation.bind(this), {source: this.source, data: this.sourceId, dataType: this.sourceType},
      false, SharedConstant.MODAL_DIALOG_SIZE_ML);
  }

  refreshListAfterOperation() {
    this.updateReloadDataEventIsPossible = true;
    this.updateSearchAction.next({reloadData: true});
  }

  preventReloadDataFromSearch() {
    this.updateReloadDataEventIsPossible = false;
  }

  passToAdvancedAdd() {
    this.router.navigateByUrl(ActionConstant.ACTION_ADD_URL);
  }

  /**
   * remove an action
   * @param $event
   */
  removeHandler(event) {
    this.removeById(event.id);
  }

  removeById(actionId) {
    this.swalWarring.CreateSwal(this.translate.instant(ActionConstant.PUP_UP_DELETE_ACTION_TEXT)).then((result) => {
      if (result.value) {
        this.actionsService.getJavaGenericService().deleteEntity(actionId).subscribe((data) => {

        }, error => {
        }, () => {
          this.growlService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
          this.refreshListAfterOperation();
        });
      }
    });

  }

  /**
   * show the actions details
   * @param event
   */
  showDetails(event) {
    if (event.columnIndex || event.columnIndex === 0) {
      if (event.columnIndex !== event.sender.columns.length - 1) {
        this.showDetailAction = true;
        if (this.source) {
          this.actionToShowInSideNav = {value: true, data: event, parent: this.source};
        } else {
          this.actionToShowInSideNav = {value: true, data: event, parent: ActionConstant.ACTION};
        }
        this.sidNavService.show(event, ActionConstant.ACTION);
      }
    }
  }

  showActionDetails(dataItem) {
    this.router.navigateByUrl(ActionConstant.ACTIONS_DETAILS_URL
      .concat(String(dataItem.id)), {skipLocationChange: true});
  }

  SidNavEvent() {
    this.showDetailAction = false;
  }

  getCommercialsNames() {
    this.allActionsCommercialsNames = [];
    this.fillResponsablesIdsTab();
    if (this.responsabelsIds.length > 0) {
      this.userService.getUsersListByArray(this.responsabelsIds).subscribe(
        (employees) => {
          this.responsablesDetails = employees;
        }, (error => {
        }), () => {
          this.allActions.forEach((action, index) => {
            if (!this.genericCrmService.isNullOrUndefinedOrEmpty(action.commercialAssignedToId)
              && this.responsablesDetails.length > 0) {
              const responsible = this.responsablesDetails.find(resp => resp.Id === action.commercialAssignedToId);
              if (responsible) {
                this.allActionsCommercialsNames[index] = responsible.FullName;
              }
            } else {
              this.allActionsCommercialsNames[index] = '';
            }
          });
        });

    }
  }

  fillResponsablesIdsTab() {
    this.allActions.forEach((action) => {
      if (action.commercialAssignedToId) {
        this.responsabelsIds.push(action.commercialAssignedToId);
      }
    });
  }

  receiveFilterAndSearchData(event) {
    if (event.value) {
      this.showColState = event.showColState;
      this.filterByType = event.filterByType;
      this.showColType = event.showColType;
      this.filterByAssignedTo = event.filterByAssignedTo;
      this.selectedFilter = event.selectedFilter;
      this.showModeMyActions = event.showModeMyActions;
      this.allActions = event.value.data;
      this.showColCollaborater = event.showColCollaborater;
      this.showColOrganization = event.showColOrganization;
      this.gridSettings.gridData = {
        data: event.value.data,
        total: event.value.total
      };
      this.getCommercialsNames();
      this.getOrganisationClientName(this.allActions, event.value.total);
    }
  }

  getOrganisationClientName(allActions: any, total: number) {
    const tiersId = [];
    allActions.forEach((action) => {
      if (action.concernedOrgClientId) {
        tiersId.push(action.concernedOrgClientId);
      }
    });
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(tiersId)) {
      this.tiersService.getTiersListByArray(tiersId).subscribe(organisationClients => {
        organisationClients.forEach(organisation => {
          allActions = allActions.map((action) => {
            if (action.concernedOrgClientId === organisation.Id) {
              action.organizationName = organisation.Name;
            }
            return action;
          });
        });
        this.gridSettings.gridData = {
          data: allActions,
          total: total
        };
      });
    }
  }

  public restoreAction(id) {
    this.swalWarring.CreateSwal(this.translate.instant(ActionConstant.RESTART_ACTION_TEXT),
      this.translate.instant(ActionConstant.RESTART_ACTION_TITLE),
      this.translate.instant(ActionConstant.RESTART_ACTION_CONFIRM_BOUTON)).then((result) => {
      if (result.value) {
        this.actionsService.getJavaGenericService().getEntityById(id, SharedCrmConstant.RESTORE_URL).subscribe(() => {
        }, () => {
        }, () => {
          this.refreshListAfterOperation();
          this.growlService.successNotification(this.translate.instant(SharedCrmConstant.SUCCESS_OPERATION));
        });
      }
    });
  }

  public archiveAction(id) {
    this.swalWarring.CreateSwal(this.translate.instant(ActionConstant.ARCHIVE_ACTION_TEXT),
      this.translate.instant(ActionConstant.ARCHIVE_ACTION_TITLE),
      this.translate.instant(ActionConstant.ARCHIVE_ACTION_CONFIRM_BOUTON)).then((result) => {
      this.sidNavService.hide();
      if (result.value) {
        let value;
        this.actionsService.getJavaGenericService().deleteEntity(id, SharedCrmConstant.ARCHIVE_URL).subscribe(data => {
          value = data;
        }, (error => {
        }), () => {
          if (value === true) {
            this.growlService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
            this.refreshListAfterOperation();
          }
        });
      }
    });
  }

  deleteSelectedActions() {
    if (this.actionsSelected.length !== NumberConstant.ZERO) {
      if (this.actionsSelected.length === NumberConstant.ONE) {
        this.removeById(this.actionsSelected[0]);
      } else {
        this.swalWarring.CreateSwal(this.translate.instant(ActionConstant.POP_UP_DELETE_ACTIONS_TEXT))
          .then(result => {
            if (result.value) {
              this.deleteActions();
            }
          });
      }
    }
  }

  private deleteActions() {
    this.actionsService.getJavaGenericService().callService(Operation.POST, 'deleteSelected', this.actionsSelected)
      .subscribe(data => {
        if (data) {
          this.growlService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
          this.refreshListAfterOperation();
        }
      });
  }

  private initCrmConfigBtnGrid() {
    this.crmConfig.restoreSelected = this.isArchivingModeAndNotFromRelated();
    this.crmConfig.deleteSelected = this.isNotFromRelated();
    this.crmConfig.archiveSelected = this.isNotArchivingModeAndNotFromRelated();
  }

  private isNotArchivingModeAndNotFromRelated() {
    return !this.isArchivingMode && !this.fromRelatedArchiving;
  }

  private isNotFromRelated() {
    return !this.fromRelatedArchiving;
  }

  private isArchivingModeAndNotFromRelated() {
    return this.isArchivingMode && !this.fromRelatedArchiving;
  }

  archiveSelectedActions() {
    if (this.actionsSelected.length !== NumberConstant.ZERO) {
      if (this.actionsSelected.length === NumberConstant.ONE) {
        this.archiveAction(this.actionsSelected[0]);
      } else {
        this.swalWarring.CreateSwal(this.translate.instant(ActionConstant.ARCHIVE_ACTIONS_TEXT),
          this.translate.instant(ActionConstant.ARCHIVE_ACTION_TITLE),
          this.translate.instant(ActionConstant.ARCHIVE_ACTION_CONFIRM_BOUTON))
          .then(result => {
            if (result.value) {
              this.archiveActions();
            }
          });
      }
    }
  }

  archiveActions() {
    this.actionsService.getJavaGenericService().callService(Operation.POST, 'archiveSelected', this.actionsSelected)
      .subscribe(data => {
        if (data) {
          this.growlService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
          this.refreshListAfterOperation();
        }
      });
  }

  restoreSelectedActions() {
    if (this.actionsSelected.length !== NumberConstant.ZERO) {
      if (this.actionsSelected.length === NumberConstant.ONE) {
        this.restoreAction(this.actionsSelected[0]);
      } else {
        this.swalWarring.CreateSwal(this.translate.instant(ActionConstant.RESTART_ACTIONS_TEXT),
          this.translate.instant(ActionConstant.RESTART_ACTION_TITLE),
          this.translate.instant(ActionConstant.RESTART_ACTION_CONFIRM_BOUTON)).then((result) => {
          if (result.value) {
            this.restoreActions();
          }
        });
      }
    }
  }

  restoreActions() {
    this.actionsService.getJavaGenericService().callService(Operation.POST, 'restoreSelected', this.actionsSelected)
      .subscribe(data => {
        if (data) {
          this.growlService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
          this.refreshListAfterOperation();
        }
      });
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericCrmService.handleCanDeactivateToLeaveCurrentComponent(this.isUpdateMode.bind(this));
  }

  isUpdateMode(): boolean {
    return this.showDetailAction && this.sideNavUpdateMode;
  }

  setSideNavUpdateMode(event) {
    this.sideNavUpdateMode = event;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.actionsListParams = new ActionsListParams(((this.gridSettings.state.skip / this.pageSize)), this.pageSize,
      '', this.isArchivingMode, undefined, undefined, undefined, undefined, this.sortParams);
    this.refreshListAfterOperation();
  }
}
