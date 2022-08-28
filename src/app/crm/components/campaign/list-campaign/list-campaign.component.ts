import {Component, OnInit} from '@angular/core';
import {SortDescriptor, State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {CampaignConstant} from '../../../../constant/crm/campaign.constant';
import {CampaignService} from '../../../services/campaign/campaign.service';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {TranslateService} from '@ngx-translate/core';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {Employee} from '../../../../models/payroll/employee.model';
import {Router} from '@angular/router';
import {PipelineConstant} from '../../../../constant/crm/pipeline.constant';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {UserService} from '../../../../administration/services/user/user.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {ClaimConstants} from '../../../../constant/crm/claim.constant';

@Component({
  selector: 'app-list-campaign',
  templateUrl: './list-campaign.component.html',
  styleUrls: ['./list-campaign.component.scss']
})
export class ListCampaignComponent implements OnInit {
  private pageSize = NumberConstant.TEN;
  public listRespUser: Array<Employee> = [];
  public listRespUserFiltred: Array<Employee> = [];
  public searchValue = '';
  public totalSteps = 0;
  public CurrentStep = 0;
  public formatDate: string = this.localStorageService.getFormatDate();
  public showStateCol = true;
  public getDataFromEmployeDone = false;
  public sort: SortDescriptor[] = [
    {
      field: CampaignConstant.NAME_FIELD,
      dir: 'asc'
    }
  ];
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: CampaignConstant.NAME_FIELD,
      title: CampaignConstant.NAME_TITLE,
      filterable: true,
      _width: 160
    },
    {
      field: CampaignConstant.STATE_FIELD,
      title: CampaignConstant.STATE_TITLE,
      filterable: true,
      _width: 160
    },

    {
      field: CampaignConstant.RESPONSIBLE_FIELD,
      title: CampaignConstant.RESPONSIBLE_TITLE,
      filterable: true,
      _width: 160
    }
    ,

    {
      field: CampaignConstant.DATE_FIELD,
      title: CampaignConstant.DATE_TITLE,
      filterable: true,
      _width: 100
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  pagerSettings: PagerSettings = CrmConstant.PAGER_SETTINGS;
  public listUsers = [];
  public Users = [];
  public listUsersFilter = [];
  private connectedUser: any;
  public predicate: PredicateFormat;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  public sortParams = SharedCrmConstant.DEFAULT_SORT;
  constructor(private campaignService: CampaignService,
              private translate: TranslateService,
              private router: Router,
              private translateService: TranslateService,
              private swallWarning: SwalWarring,
              private localStorageService: LocalStorageService,
              private userService: UserService,
              private growlService: GrowlService,
              public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.getConnectedUser();
    this.loadIndividualUsersList();

  }

  handleResponsablesFilter(id) {
    this.listRespUser = this.listUsersFilter.filter(responsable => responsable.Id == id);
  }
  initGridDataSourceEvent(event) {
    for (const campaign of event.value.data) {
      campaign.state = this.translate.instant(campaign.state);
      this.handleResponsablesFilter(campaign.responsablesUsersId);
      campaign.responsablesUsersId = this.listRespUser[0].FullName;
    }
    this.gridSettings.gridData = {
      data: event.value.data,
      total: event.value.total
    };
    this.showStateCol = event.showState;

  }

  initGridDataSource(page) {
    this.campaignService.getAllCampaigns(this.gridState.skip, this.gridState.take, false, this.sortParams)
      .subscribe(data => {
          for (const campaign of data.campaignList) {

            campaign.state = this.translate.instant(campaign.state);
            this.handleResponsablesFilter(campaign.responsablesUsersId);
            campaign.responsablesUsersId = this.listRespUser[0].FullName;
          }

          this.gridSettings.gridData = {
            data: data.campaignList,
            total: data.totalItems
          };
        }
      );
  }

  onPageChange(event) {
    this.pageSize = event.take;
    this.gridState.skip = event.skip / NumberConstant.TEN;
  }


  private checkSearchValue(page: number) {
    this.searchValue ? this.getProspectPageBySearchValue(page) : this.initGridDataSource(this.gridState.skip / this.gridState.take);
  }

  getProspectPageBySearchValue(page) {
    this.campaignService.getJavaGenericService().getData(ContactConstants.SEARCH + this.searchValue
      + '' + '?page=' + page + '&size=' + this.gridState.take).subscribe((data) => {
      this.gridSettings.state.skip = ((page + 1) * this.gridSettings.state.take) - this.gridSettings.state.take;

      for (const campaign of data.campaignList) {

        campaign.state = this.translate.instant(campaign.state);
        this.handleResponsablesFilter(campaign.responsablesUsersId);
        campaign.responsablesUsersId = this.listRespUser[0].FullName;
      }
      this.gridSettings.gridData = {
        data: data.campaignList,
        total: data.totalItems
      };
    });
  }

  finalSearchAndFilter(page: number) {

    this.searchAndFilterProspectContact(page);

  }

  private searchAndFilterProspectContact(page: number) {

    this.checkSearchValue(page);

  }

  showCampaignDetails(dataItem) {
    this.router.navigateByUrl(CampaignConstant.CAMPAIGN_DETAILS_URL
      .concat(String(dataItem.id)), {skipLocationChange: true});
  }

  public removeHandler(event) {
    let deleted = false;
    this.swallWarning.CreateSwal(this.translate.instant(PipelineConstant.PUP_UP_DELETE_PIPELINE_TEXT)).then((result) => {
      if (result.value) {
        this.campaignService.getJavaGenericService().deleteEntity(event.id).subscribe((data) => {
          if (data) {
            deleted = true;
          }
        }, () => {

        }, () => {
          if (deleted) {
            this.initGridDataSource(this.gridState.skip);
          }
        });
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

  loadIndividualUsersList() {
    this.predicate = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicate).subscribe(data => {
      this.listUsers = data.data.filter(user => user.Email !== this.connectedUser.Email);
      this.listUsersFilter = data.data.filter(user => user.Email !== this.connectedUser.Email);
      this.filterUsers();
      this.initGridDataSource(this.gridState.skip);
    }, () => {
      this.growlService.ErrorNotification(this.translate.instant(SharedCrmConstant.FAILURE_OPERATION));
    }, () => {
    });
  }

  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.initGridDataSource(this.gridState.skip);
  }
  public dataStateChange(state: any): void {
    this.sortParams = (state.sort.length > 0) ? `${state.sort[NumberConstant.ZERO].field},${state.sort[NumberConstant.ZERO].dir}` :
      this.sortParams = SharedCrmConstant.DEFAULT_SORT;
      this.pageSize = state.take;
    this.gridSettings.state = state;
  }

}
