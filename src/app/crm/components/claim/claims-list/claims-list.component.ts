import {ClaimConstant} from './../../../../constant/helpdesk/claim.constant';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef} from '@angular/core';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {SortDescriptor, State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {ActionConstant} from '../../../../constant/crm/action.constant';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {ClaimCrmService} from '../../../services/claim/claim.service';
import {ClaimConstants} from '../../../../constant/crm/claim.constant';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {ClaimsFilterEnum} from '../../../../models/crm/enums/claimsFilter.enum';
import {OpportunityService} from '../../../services/opportunity.service';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {FileConstant} from '../../../../constant/crm/file.constant';
import {Operation} from '../../../../../COM/Models/operations';
import {OpportunityConstant} from '../../../../constant/crm/opportunityConstant';
import {ClaimSideNavService} from '../../../services/sid-nav/claim-side-nav.service';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {AddClaimComponent} from '../add-claim/add-claim.component';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {CrmConfig} from '../../../../models/crm/CrmConfig.model';
import {Filter} from '../../../../models/crm/Filter';
import {GenericCrmService} from '../../../generic-crm.service';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {Organisation} from '../../../../models/crm/organisation.model';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {Observable} from 'rxjs/Observable';
import {DropdownService} from '../../../services/dropdowns/dropdown.service';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {Employee} from '../../../../models/payroll/employee.model';
import {UserService} from '../../../../administration/services/user/user.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import {ClaimType} from '../../../../models/crm/enums/claimType.enum';

@Component({
  selector: 'app-claims-list',
  templateUrl: './claims-list.component.html',
  styleUrls: ['./claims-list.component.scss']
})
export class ClaimsListComponent implements OnInit, OnChanges {
  @Input() related = false;
  @Input() sourceId: number;
  @Input() source: string;
  @Input() isProspect;
  @Input() isArchivingMode = false;
  @Output() countclaim = new EventEmitter();

  public predicate: PredicateFormat;
  private currentPage = NumberConstant.ZERO;
  private sortParam = SharedCrmConstant.DEFAULT_SORT;

  public formatDate: string = this.translateService.instant(SharedConstant.DATE_FORMAT);
  public showDetailClaim = false;
  public claimToShowInSideNav;
  public zero = 0;
  public chosenFilterNumber: number;
  public claimsList;
  private able_to_delete: boolean;
  private modeAllClaim;
  @Input() fromRelatedArchiving = false;
  public showAdd;
  public dataToSendToPoPUp: any;
  private pageSize = NumberConstant.TEN;
  public claimsSelected: number [] = [];
  public selectKey = 'id';
  public claimsFilter = ClaimsFilterEnum;
  public checkbox_column_width = 60;
  public isFromArchive: boolean;
  public crmConfig: CrmConfig = new CrmConfig();
  public claimSource = ClaimConstants.CLAIMS;
  public pagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public claimTypeToCheck = 'ALL';
  public sideNavUpdateMode = false;
  public sort: SortDescriptor[] = [
    {
      field: ClaimConstants.TOPIC_FIELD,
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
      field: ClaimConstants.TOPIC_FIELD,
      title: ClaimConstants.TOPIC_TITLE,
      filterable: false,
      _width: 100
    },
    {
      field: ClaimConstants.CATEGORY_FIELD,
      title: ClaimConstants.TYPE_TITLE,
      filterable: false,
      _width: 100
    },
    {
      field: ClaimConstants.ORGANIZATION_FIELD,
      title: ClaimConstants.ORGANIZATION_TITLE,
      _width: 160,
      filterable: false

    },
    {
      field: ClaimConstants.ASSIGNED_TO_FIELD,
      title: ClaimConstants.ASSIGNED_TO_TITLE,
      filterable: false,
      _width: 160
    },
    {
      field: ActionConstant.CREATION_DATE_FIELD,
      title: ActionConstant.CREATION_DATE_TITLE,
      filterable: false,
      filter: 'date',
      _width: 200
    },
    {
      field: ActionConstant.DEADLINE_FIELD,
      title: ActionConstant.DEADLINE_TITLE,
      filterable: false,
      filter: 'date',
      _width: 200
    },
    {
      field: ClaimConstants.GRAVITY_FIELD,
      title: ClaimConstants.GRAVITY_TITLE,
      filterable: false,
      _width: 100
    },
    {
      field: ClaimConstants.STATE_FIELD,
      title: ClaimConstants.STATE_TITLE,
      filterable: false,
      _width: 100

    },
    {
      field: ClaimConstants.RESPONSIBLE_FIELD,
      title: ClaimConstants.RESPONSIBLE_TITLE,
      filterable: false,
      _width: 160
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  public filters: Array<Filter> = [];
  public organizationList = [];
  public searchedOrganizationList = [];
  public claimsCategoriesList = [];
  public gravitiesList = [];
  public stateList = [];

  public selectedOrganization;
  public selectedCategory;
  public selectedGravity;
  public selectedState;

  public isThereFilter = false;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  public listRespUserFiltred: Array<Employee> = [];
  public listRespUser: Array<Employee> = [];

  public listUsers = [];
  public Users = [];
  public listUsersFilter = [];
  private connectedUser: any;
  public predicateClaim: PredicateFormat;
  public sortParams = SharedCrmConstant.DEFAULT_SORT;

  /**
   *
   * @param translateService
   * @param swallWarning
   * @param tiersService
   * @param claimService
   * @param organizationsService
   * @param claimSideNavService
   * @param opportunityService
   * @param formModalDialogService
   * @param viewRef
   * @param growlService
   * @param activatedRoute
   * @param genericCrmService
   */
  constructor(
    private translateService: TranslateService,
    private swallWarning: SwalWarring,
    private tiersService: TiersService,
    private claimService: ClaimCrmService,
    private organizationsService: OrganisationService,
    private claimSideNavService: ClaimSideNavService,
    private opportunityService: OpportunityService,
    private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef,
    private growlService: GrowlService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private genericCrmService: GenericCrmService,
    private dropdownService: DropdownService,
    public authService: AuthService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
  ) {
  }

  ngOnInit(): void {
    this.getClaimTypeFromPermission();
    this.initCrmConfigBtnGrid();
    this.getOrganizationList();
    this.initCategoriesDropDown();
    this.initGravitiesDropDowns();
    this.initStateDropDowns();
    this.activatedRoute.params.subscribe(params => {
      const organisationId = params[CrmConstant.ORGANISATION_ID];
      const opportunityId = params[CrmConstant.OPPORTUNITY_ID];
      const contactId = params[CrmConstant.CONTACT_ID];
      const archive = params[CrmConstant.ARCHIVE];
      if (organisationId || opportunityId || contactId) {
        this.isArchivingMode = archive;
        this.isFromArchive = true;
        this.initDataGridFromArchivePopup(organisationId, opportunityId, contactId, archive);
      }
    });
    this.loadIndividualUsersListClaim();
    this.getConnectedUser();

    this.preparePredicate();


  }

  initCategoriesDropDown() {
    this.dropdownService.getAllFiltreByName('Type', 'CLAIM')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.claimsCategoriesList.push(filtreName.name);
            }
          );
        }
      });
  }

  private getClientsList() {
    this.tiersService.processDataServerSide(this.predicate).subscribe(data => {
      data.data.forEach((client) => {
        this.organizationList.push(this.convertClientToOrganisation(client));
      });
      this.searchedOrganizationList = this.organizationList;
    }, () => {

    }, () => {
    });
  }

  private preparePredicate() {
    this.predicate = this.genericCrmService.preparePredicateForClientsList(this.predicate);
  }

  private convertClientToOrganisation(client): Organisation {
    const organisation = new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter);
    organisation.type = OpportunityConstant.CLIENT_TYPE;
    return organisation;
  }

  private getOrganizationList() {
    this.organizationList = [];
    this.searchedOrganizationList = [];
    this.organizationsService.getJavaGenericService().getEntityList(ClaimConstants.RELATED_TO_CLAIM).subscribe((list) => {
      this.organizationList = this.organizationList.concat(list);
      this.getClientsList();
    });
  }

  private checkFilterByOrganization() {
    if (this.selectedOrganization) {
      this.filters.push(new Filter(CrmConstant.FILTER_TYPES.DROP_DOWN_LIST, CrmConstant.FILTER_OPERATORS.EQUAL,
        this.selectedOrganization.type === OpportunityConstant.CLIENT_TYPE ?
          ClaimConstants.CLIENT_ORGANIZATION_ID : ClaimConstants.ORGANISATION,
        this.selectedOrganization.id.toString()));
    }
  }

  private checkFilterByCategory() {
    if (this.selectedCategory) {
      this.filters.push(new Filter(CrmConstant.FILTER_TYPES.STRING, CrmConstant.FILTER_OPERATORS.EQUAL,
        ClaimConstants.CATEGORY_FIELD, this.selectedCategory));
    }
  }

  private checkFilterByGravity() {
    if (this.selectedGravity) {
      this.filters.push(new Filter(CrmConstant.FILTER_TYPES.STRING, CrmConstant.FILTER_OPERATORS.EQUAL,
        ClaimConstants.GRAVITY_FIELD, this.selectedGravity));
    }
  }

  private checkFilterByState() {
    if (this.selectedState) {
      this.filters.push(new Filter(CrmConstant.FILTER_TYPES.STRING, CrmConstant.FILTER_OPERATORS.EQUAL,
        ClaimConstants.STATE_FIELD, this.selectedState));
    }
  }


  initGravitiesDropDowns() {
    this.dropdownService.getAllFiltreByName('GRAVITY', 'CLAIM')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.gravitiesList.push(filtreName.name);
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
            }
          );
        }
      });
  }

  initDataGridFromArchivePopup(organisationId, opportunityId, contactId, archive) {
    if (organisationId) {
      this.initClaimsGridDataSourceByOrganisation(organisationId, archive, this.gridState.skip);
    } else if (opportunityId) {
      this.initClaimsGridDataSourceByOpportunity(opportunityId, archive, this.gridState.skip);
    } else if (contactId) {
      this.initRelatedClaimGridDataSourceFromContact(contactId, archive);
    }
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    this.initCrmConfigBtnGrid();
    if (simpleChange.sourceId !== undefined && this.related) {
      this.initRelatedClaimGridDataSource();
    }
  }

  private initCrmConfigBtnGrid() {
    this.crmConfig.restoreSelected = this.isArchivingModeAndNotFromRelatedArchiving();
    this.crmConfig.deleteSelected = this.isNotFromRelatedArchiving();
    this.crmConfig.archiveSelected = this.isNotArchivingModeAndNotFromRelatedArchiving();
  }

  public filterChange() {
    this.filters = this.genericCrmService.buildFilters(this.gridSettings);
    this.checkFilterByOrganization();
    this.checkFilterByCategory();
    this.checkFilterByGravity();
    this.checkFilterByState();
    if (this.related) {
      this.initRelatedClaimGridDataSource();
    } else {
      this.initGridDataSource();
    }
  }

  private isNotArchivingModeAndNotFromRelatedArchiving() {
    return !this.isArchivingMode && !this.fromRelatedArchiving;
  }

  private isNotFromRelatedArchiving() {
    return !this.fromRelatedArchiving;
  }

  private isArchivingModeAndNotFromRelatedArchiving() {
    return this.isArchivingMode && !this.fromRelatedArchiving;
  }

  private isArchivingModeOrFromRelated() {
    return this.isArchivingMode || this.fromRelatedArchiving;
  }

  initClaimsGridDataSourceByOrganisation(id, archive, page) {
    this.claimService
      .getJavaGenericService()
      .sendData(OpportunityConstant.BY_ORGANISATION +
        `?idOrganisation=${id}&isArchived=${archive}&page=${page}&size=${this.pageSize}`, this.filters)
      .subscribe(_data => {
        this.countclaim.emit(_data.totalElements);
        if (_data) {
          for (const claim of _data.claimDtoList) {
            claim.responsablesUsersId = this.handleResponsablesFilter(claim.responsablesUsersId);
          }
          this.gridSettings.gridData = {
            data: _data.claimDtoList,
            total: _data.totalElements
          };
        }
      });
  }

  getClaimTypeFromPermission() {
    if (this.authService.hasAuthorities([this.CRMPermissions.VIEW_CLAIM_CLIENT]) && !this.authService.hasAuthorities([this.CRMPermissions.VIEW_CLAIM_LEAD])) {
      this.claimTypeToCheck = ClaimType.CLIENT;
    }
    if (!this.authService.hasAuthorities([this.CRMPermissions.VIEW_CLAIM_CLIENT]) && this.authService.hasAuthorities([this.CRMPermissions.VIEW_CLAIM_LEAD])) {

      this.claimTypeToCheck = ClaimType.PROSPECT;
    }
  }

  initClaimsGridDataSourceByIdClientOrganisation(id, page) {
    this.claimService
      .getJavaGenericService()
      .sendData(OpportunityConstant.BY_CLIENT_ORGANISATION + id + ClaimConstant.ARCHIVED + this.isArchivingMode +
        ClaimConstants.PAGE + (page + NumberConstant.ONE), this.filters)
      .subscribe(_data => {
        this.claimService.setAllClaimsOrganizationName(_data);
        this.countclaim.emit(_data.totalElements);
        if (_data) {
          for (const claim of _data.claimDtoList) {
            claim.responsablesUsersId = this.handleResponsablesFilter(claim.responsablesUsersId);
          }
          this.gridSettings.gridData = {
            data: _data.claimDtoList,
            total: _data.totalElements
          };
        }
      });
  }

  initClaimsGridDataSourceByOpportunity(id, isArchive, page) {
    this.claimService
      .getJavaGenericService()
      .sendData(`opportunity/${id}${ClaimConstant.ARCHIVED}${isArchive}/pages/${page}${NumberConstant.ONE}`, this.filters)
      .subscribe(_data => {
        this.countclaim.emit(_data.totalElements);
        if (_data) {
          for (const claim of _data.claimDtoList) {
            claim.responsablesUsersId = this.handleResponsablesFilter(claim.responsablesUsersId);
          }
          this.gridSettings.gridData = {
            data: _data.claimDtoList,
            total: _data.totalElements
          };
        }
      });
  }

  initRelatedClaimGridDataSource() {
    switch (this.source) {
      case FileConstant.CONTACT:
        if (this.isProspect) {
          this.initRelatedClaimGridDataSourceFromContact(this.sourceId, this.isArchivingModeOrFromRelated());
        } else {
          this.initRelatedClaimGridDataSourceFromClientContact(this.sourceId, this.gridState.skip);
        }
        break;
      case FileConstant.ORGANISATION:
        this.showAdd = false;
        if (this.isProspect) {
          this.initClaimsGridDataSourceByOrganisation(this.sourceId, this.isArchivingModeOrFromRelated(), this.gridState.skip);
        } else {
          this.initClaimsGridDataSourceByIdClientOrganisation(this.sourceId, this.gridState.skip);
        }
        break;
      case FileConstant.OPPORTUNITY:
        this.showAdd = false;
        this.initClaimsGridDataSourceByOpportunity(
          this.sourceId,
          this.isArchivingMode,
          this.gridState.skip
        );
        break;

      default:
        return;
    }
  }

  initGridClaims() {
    this.showAdd = true;
    this.initGridDataSource();
  }

  public handleOrganizationFilter(searchedOrganization) {
    this.searchedOrganizationList = this.organizationList.filter(org => {
      return (org.name.toLowerCase()
        .indexOf(searchedOrganization.toLowerCase()) !== -1);
    });
  }

  initRelatedClaimGridDataSourceFromContact(contactId, isArchive) {
    this.claimService
      .getJavaGenericService()
      .sendData(
        ClaimConstant.CONTACT +
        `?contactId=${contactId}&page=${NumberConstant.ZERO}&isArchived=${isArchive}&size=${this.pageSize}`, this.filters
      )
      .subscribe(data => {
        if (data) {
          this.claimsList = {
            value: true,
            data: data.claimDtoList,
            totalElements: data.totalElements
          };
          this.countclaim.emit(data.totalElements);
          this.gridSettings.gridData = {
            data: data.claimDtoList,
            total: data.totalElements
          };
        }
      });
  }

  initRelatedClaimGridDataSourceFromClientContact(id, page) {
    this.claimService.getJavaGenericService()
      .sendData(ClaimConstant.CLIENT_CONTACT + id + ClaimConstant.ARCHIVED + this.isArchivingMode +
        ClaimConstants.PAGE + (page + NumberConstant.ONE), this.filters)
      .subscribe(data => {
        if (data) {
          this.claimService.setAllClaimsOrganizationName(data);
          this.claimsList = {
            value: true,
            data: data.claimDtoList,
            totalElements: data.totalElements
          };
          this.countclaim.emit(data.totalElements);
          this.gridSettings.gridData = {
            data: data.claimDtoList,
            total: data.totalElements
          };
        }
      });
  }

  initGridDataSource() {
    this.claimService.getJavaGenericService()
      .sendData(`isArchived/${this.isArchivingMode}/claimType/${this.claimTypeToCheck}?page=${this.currentPage}&size=${this.pageSize}&sort=${this.sortParams}`, this.filters)
      .subscribe((_data) => {
        this.claimService.setAllClaimsOrganizationName(_data);
        this.claimsList = {
          value: true,
          data: _data.claimDtoList,
          totalElements: _data.totalElements
        };
        for (const claim of _data.claimDtoList) {
          claim.responsablesUsersId = this.handleResponsablesFilter(claim.responsablesUsersId);
        }
        this.gridSettings.gridData = {
          data: _data.claimDtoList,
          total: _data.totalElements
        };
      });
  }

  showDetails(dataItem) {
    this.router.navigateByUrl(ClaimConstants.CLAIMS_DETAILS_URL
      .concat(String(dataItem.id)), {skipLocationChange: true});
  }

  showClaimDetails(event) {
    this.showDetailClaim = true;
    this.claimToShowInSideNav = {
      value: true,
      data: event,
      parent: ClaimConstants.CLAIMS
    };
    this.claimSideNavService.show(event, ClaimConstants.CLAIMS);
  }

  SidNavEvent() {
    this.showDetailClaim = false;
  }

  quickSearch(event) {
    if (event) {
      const claimsAfterFilter: any[] = event.data;
      this.modeAllClaim = event.filter;
      this.isThereFilter = !!event.filter;
      if (!this.modeAllClaim) {
        this.gridState.skip = this.zero;
      }
      this.gridSettings.gridData = {
        data: claimsAfterFilter,
        total: event.totalElements
      };
    }
  }

  onPageChange(event) {
    this.pageSize = event.take;
    this.gridState.skip = event.skip;
    this.currentPage = (this.gridState.skip / this.pageSize);
    if (this.related) {
      this.initRelatedClaimGridDataSource();
    } else if (!this.modeAllClaim) {
      this.initGridDataSource();
    }
  }

  public dataStateChange(state: any): void {
    this.sortParams = (state.sort.length > 0 && state.sort[NumberConstant.ZERO].dir !== undefined ) ? `${state.sort[NumberConstant.ZERO].field},${state.sort[NumberConstant.ZERO].dir}` :
      this.sortParams = SharedCrmConstant.DEFAULT_SORT;
    this.changeSort();
    this.pageSize = state.take;
    this.gridSettings.state = state;
  }

  initPage() {
    this.gridState.skip = 0;
    this.dataStateChange(this.gridState);
  }
changeSort() {
    let array = [];
    array = this.sortParams.split(",") ;
     switch (array [0]){
       case ClaimConstants.ORGANIZATION_FIELD :  this.sortParams = 'organisation,' +  array [1] ;
       break ;
       case ClaimConstants.ASSIGNED_TO_FIELD :  this.sortParams = 'assignedTo,' +  array [1] ;
       break ;
      }

}

  public removeHandler(dataItem) {
    this.deleteClaimById(dataItem.id);
  }

  deleteClaimById(claimId) {
    this.swallWarning
      .CreateSwal(
        this.translateService.instant(ClaimConstants.POP_UP_DELETE_CLAIM_TEXT)
      )
      .then(result => {
        if (result.value) {
          this.claimService
            .getJavaGenericService()
            .deleteEntity(claimId)
            .subscribe(
              data => {
                this.able_to_delete = data;
              },
              error => {
              },
              () => {
                if (this.able_to_delete === true) {
                  this.growlService.successNotification(
                    this.translateService.instant(
                      OrganisationConstant.SUCCESS_OPERATION
                    )
                  );
                  if (this.related) {
                    this.initRelatedClaimGridDataSource();
                  } else {
                    this.initGridClaims();
                  }
                }
              }
            );
        }
      });
  }

  public archiveSelected(dataItemId) {
    this.swallWarning.CreateSwal(this.translateService.instant(ClaimConstants.POP_UP_ARCHIVE_CLAIM_TEXT),
      this.translateService.instant(ClaimConstants.ARCHIVE_TITLE),
      this.translateService.instant(ClaimConstants.ARCHIVE_CONFIRM_BOUTON)).then((result) => {
      if (result.value) {
        let value;
        this.claimService.getJavaGenericService().deleteEntity(dataItemId, 'archive').subscribe(data => {
          value = data;
        }, (error => {
        }), () => {
          if (value === true) {
            if (!this.related) {
              this.initGridClaims();
            } else {
              this.initRelatedClaimGridDataSource();
            }
            this.growlService.successNotification(this.translateService.instant(OrganisationConstant.SUCCESS_OPERATION));
          }
        });
      }
    });
  }

  public restoreSelected(dataItemId) {
    this.swallWarning.CreateSwal(this.translateService.instant(ClaimConstants.RESTART_CLAIM_TEXT),
      this.translateService.instant(ClaimConstants.ARCHIVE_TITLE),
      this.translateService.instant(ClaimConstants.RESTART_CONFIRM_BOUTON)).then((result) => {
      if (result.value) {
        this.claimService.getJavaGenericService().getEntityById(dataItemId, ClaimConstants.RESTORE_URL).subscribe(() => {
        }, () => {
        }, () => {
          this.currentPage = 0;
          this.initGridDataSource();
          this.growlService.successNotification(this.translateService.instant(ClaimConstants.SUCCESS_OPERATION));
        });
      }
    });
  }

  setAddMode(event) {
    if (this.related) {
      this.dataToSendToPoPUp = {
        source: this.source,
        sourceId: this.sourceId,
        isProspect: this.isProspect
      };
      this.showPopUp();
    } else {
      this.router.navigateByUrl(ClaimConstant.CLAIM_ADD_URL);
    }

  }

  refreshList() {
    if (this.related) {
      this.initRelatedClaimGridDataSource();
    } else {
      this.initGridClaims();
    }
  }

  showPopUp() {
    this.formModalDialogService.openDialog(
      undefined, AddClaimComponent, this.viewRef, this.refreshList.bind(this),
      this.dataToSendToPoPUp, false, SharedConstant.MODAL_DIALOG_SIZE_ML);
  }

  deleteSelectedClaims() {
    if (this.claimsSelected.length !== NumberConstant.ZERO) {
      if (this.claimsSelected.length === NumberConstant.ONE) {
        this.deleteClaimById(this.claimsSelected[0]);
      } else {
        this.swallWarning.CreateSwal(this.translateService.instant(ClaimConstants.POP_UP_DELETE_CLAIMS_TEXT))
          .then(result => {
            if (result.value) {
              this.deleteClaims();
            }
          });
      }
    }
  }

  archiveSelectedClaims() {
    if (this.claimsSelected.length !== NumberConstant.ZERO) {
      if (this.claimsSelected.length === NumberConstant.ONE) {
        this.archiveSelected(this.claimsSelected[0]);
      } else {
        this.swallWarning.CreateSwal(this.translateService.instant(ClaimConstants.POP_UP_ARCHIVE_CLAIMS_TEXT),
          this.translateService.instant(ClaimConstants.ARCHIVE_TITLE),
          this.translateService.instant(ClaimConstants.ARCHIVE_CONFIRM_BOUTON))
          .then(result => {
            if (result.value) {
              this.archiveClaims();
            }
          });
      }
    }
  }

  deleteClaims() {
    this.claimService.getJavaGenericService().callService(Operation.POST, 'deleteSelected', this.claimsSelected)
      .subscribe(data => {
        if (data) {
          this.growlService.successNotification(this.translateService.instant(OrganisationConstant.SUCCESS_OPERATION));
          if (this.related) {
            this.initRelatedClaimGridDataSource();
          } else {
            this.initGridClaims();
          }
        }
      });
  }

  archiveClaims() {
    this.claimService.getJavaGenericService().callService(Operation.POST, 'archiveSelected', this.claimsSelected)
      .subscribe(data => {
        if (data) {
          this.growlService.successNotification(this.translateService.instant(OrganisationConstant.SUCCESS_OPERATION));
          if (this.related) {
            this.initRelatedClaimGridDataSource();
          } else {
            this.initGridClaims();
          }
        }
      });
  }

  restoreSelectedClaims() {
    if (this.claimsSelected.length !== NumberConstant.ZERO) {
      if (this.claimsSelected.length === NumberConstant.ONE) {
        this.restoreSelected(this.claimsSelected[0]);
      } else {
        this.swallWarning.CreateSwal(this.translateService.instant(ClaimConstants.RESTART_CLAIMS_TEXT),
          this.translateService.instant(ClaimConstants.ARCHIVE_TITLE),
          this.translateService.instant(ClaimConstants.RESTART_CONFIRM_BOUTON)).then((result) => {
          if (result.value) {
            this.restoreClaims();
          }
        });
      }
    }
  }

  restoreClaims() {
    this.claimService.getJavaGenericService().callService(Operation.POST, 'restoreSelected', this.claimsSelected)
      .subscribe(data => {
        if (data) {
          this.growlService.successNotification(this.translateService.instant(OrganisationConstant.SUCCESS_OPERATION));
          this.initGridClaims();
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
    return this.showDetailClaim && this.sideNavUpdateMode;
  }

  setSideNavUpdateMode(event) {
    this.sideNavUpdateMode = event;
  }

  handleResponsablesFilter(id) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(id)) {
      const responsible = this.listUsersFilter.find(responsableDetail => id === responsableDetail.Id);
      if (responsible) {
        return responsible.FullName;
      }
    }
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

  loadIndividualUsersListClaim() {
    this.predicateClaim = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicateClaim).subscribe(data => {
      this.listUsers = data.data;
      this.listUsersFilter = data.data;
      this.filterUsers();
      if (!this.related && !this.isFromArchive) {
        this.initGridClaims();
        this.claimSideNavService.getResult().subscribe(dataList => {
          if (!dataList) {
            this.initPage();
            this.initGridClaims();
          }
        });
      }
    }, () => {
    }, () => {
    });
  }

  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;

    this.initGridClaims();

  }
}
