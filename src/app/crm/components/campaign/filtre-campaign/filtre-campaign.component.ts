import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {CampaignConstant} from '../../../../constant/crm/campaign.constant';
import {CampagnFilterTypeEnum} from '../../../../models/crm/enums/campagnFilterType.enum';
import {EnumValues} from 'enum-values';
import {campaignStateEnum} from '../../../../models/crm/enums/campaignState.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {GenericCrmService} from '../../../generic-crm.service';
import {EmployeeService} from '../../../../payroll/services/employee/employee.service';
import {PipelineService} from '../../../services/pipeline/pipeline.service';
import {CampaignService} from '../../../services/campaign/campaign.service';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {CampaignListParams} from '../../../../models/crm/campaignListParams';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {Employee} from '../../../../models/payroll/employee.model';
import {StyleConstant} from '../../../../constant/utility/style.constant';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';

@Component({
  selector: 'app-filtre-campaign',
  templateUrl: './filtre-campaign.component.html',
  styleUrls: ['./filtre-campaign.component.scss']
})
export class FiltreCampaignComponent implements OnInit {

  @Input() paramsFromOrgList;
  @Output() sendData = new EventEmitter<any>();
  @Input() gridSettings: GridSettings;
  public selectedFilter = CampaignConstant.ALL_CAMPAIGN;
  public searchValue = '';
  public showStateCol = true;

  public campagnFilter = CampagnFilterTypeEnum;
  public chosenFilterNumber = this.campagnFilter.ALL_CAMPAIGNS;
  public campaignState = [];
  public campaignStateFilter = [];
  private CampaignFilterParams = new CampaignListParams();
  public finalResult;
  public listTeams = [];
  public listRespUserFiltred: Array<Employee> = [];
  public listRespUser: Array<Employee> = [];
  public connectedUser;
  public listConcernedEmployees: Array<Employee> = [];
  public listConcernedEmployeesFiltred: Array<Employee> = [];
  public isContentVisible = false;
  public fieldsetBorderStyle: string;
  public fieldsetBorderShowed = StyleConstant.BORDER_SOLID;
  public fieldsetBorderHidden = StyleConstant.BORDER_NONE;
  public fromRh = false;
  public sortParams = SharedCrmConstant.DEFAULT_SORT;
  constructor(private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private translate: TranslateService,
              public validationService: ValidationService,
              private genericCrmService: GenericCrmService,
              private employeeService: EmployeeService,
              private pipelineService: PipelineService,
              private campaignService: CampaignService,
              private router: Router,
              private growlService: GrowlService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    this.initStateDropDown();
    this.getConnectedUser();
  }

  getAllCampaigns() {

    this.campaignService.getAllCampaigns(this.CampaignFilterParams.pageNumber, this.CampaignFilterParams.pageSize, false, this.sortParams).subscribe(
      (data) => {
        if (data) {
          this.finalResult = {
            data: data.campaignList,
            total: data.totalItems
          };
        }
        this.sendFilterAndSearchValues(this.finalResult);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.CampaignFilterParams.pageNumber = this.paramsFromOrgList.skip;
    this.CampaignFilterParams.isArchived = false;
    this.CampaignFilterParams.pageSize = this.paramsFromOrgList.take;
    this.CampaignFilterParams.searchValue = this.searchValue;


  }

  initStateDropDown() {
    const campaignStates = EnumValues.getNames(campaignStateEnum);
    let campaignStateMapped: any;
    campaignStateMapped = campaignStates.map((campaignState: any) => {
      return campaignState = {enumValue: campaignState, enumText: this.translate.instant(campaignState)};
    });
    this.campaignState = campaignStateMapped;
    this.campaignStateFilter = campaignStateMapped;
  }

  filterCampaign(chosenFilter) {
    this.chosenFilterNumber = chosenFilter;

    switch (chosenFilter) {

      case this.campagnFilter.ALL_CAMPAIGNS : {

        this.selectedFilter = CampaignConstant.ALL_CAMPAIGN;
        this.allCampaign();

      }
        break;
      case this.campagnFilter.MINE : {

        this.selectedFilter = CampaignConstant.MINE;
        this.filtreMine();
      }
        break;

      case this.campagnFilter.STATE : {

        this.selectedFilter = CampaignConstant.STATE;

      }
        break;
      case this.campagnFilter.TEAMS : {

        this.selectedFilter = CampaignConstant.TEAMS;
        this.filtreMine();
      }
        break;
    }
    this.initGridDataSource();
  }

  filterByState(event) {
    if (event) {
      this.CampaignFilterParams.filterType = CampagnFilterTypeEnum[CampagnFilterTypeEnum.STATE];
      this.CampaignFilterParams.filterValue = event;
      this.CampaignFilterParams.pageNumber = 1;
      this.showStateCol = false;

      this.initGridDataSource();
    }
  }

  filterByTeams(event) {
    if (event) {
      this.CampaignFilterParams.filterType = CampagnFilterTypeEnum[CampagnFilterTypeEnum.TEAMS];
      this.CampaignFilterParams.filterValue = event;
      this.CampaignFilterParams.pageNumber = 1;
      this.showStateCol = true;
    } else {

    }
    this.initGridDataSource();
  }

  filtreMine() {


    this.CampaignFilterParams.filterType = CampagnFilterTypeEnum[CampagnFilterTypeEnum.MINE];
    this.CampaignFilterParams.filterValue = this.connectedUser.IdEmployee;
    this.CampaignFilterParams.pageNumber = 1;
    this.showStateCol = true;
    this.initGridDataSource();
  }

  allCampaign() {

    this.CampaignFilterParams.filterType = CampagnFilterTypeEnum[CampagnFilterTypeEnum.ALL_CAMPAIGNS];
    this.CampaignFilterParams.filterValue = 'all';
    this.CampaignFilterParams.pageNumber = 1;
    this.showStateCol = true;
  }

  sendFilterAndSearchValues(filterAndSearchObject) {
    this.sendData.emit({
      'value': filterAndSearchObject,
      'showState': this.showStateCol,
      'showColActSector': true
    });
  }

  initGridDataSource() {
    this.campaignService.getCampaignByParam(this.CampaignFilterParams).subscribe((data) => {
        if (data) {
          this.finalResult = {
            data: data.campaignList,
            total: data.totalItems
          };
        }
        this.sendFilterAndSearchValues(this.finalResult);
      }
      ,
      error => {
        this.finalResult = {
          data: [],
          total: 0
        };
        this.sendFilterAndSearchValues(this.finalResult);
      }
    );
  }

  search() {
    this.resetPageNumberAndSkip();
    this.CampaignFilterParams.searchValue = this.searchValue ? this.searchValue : '';
    this.initGridDataSource();

  }

  private resetPageNumberAndSkip() {
    if (this.searchValue !== this.CampaignFilterParams.searchValue) {
      this.CampaignFilterParams.pageNumber = 1;
      this.gridSettings.state.skip = 0;
    }
  }


  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
  }

  showContent() {
    this.isContentVisible = true;
    this.fieldsetBorderStyle = this.fieldsetBorderShowed;
  }

  hideContent() {
    this.isContentVisible = false;
    this.fieldsetBorderStyle = this.fieldsetBorderHidden;

  }
}
