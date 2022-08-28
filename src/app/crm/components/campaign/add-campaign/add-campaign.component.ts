import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {uniquePropCrmJavaServices, ValidationService} from '../../../../shared/services/validation/validation.service';
import {GenericCrmService} from '../../../generic-crm.service';
import {Employee} from '../../../../models/payroll/employee.model';
import {ActionConstant} from '../../../../constant/crm/action.constant';
import {PipelineService} from '../../../services/pipeline/pipeline.service';
import {EnumValues} from 'enum-values';
import {campaignStateEnum} from '../../../../models/crm/enums/campaignState.enum';
import {Campaign} from '../../../../models/crm/campaign.model';
import {CampaignService} from '../../../services/campaign/campaign.service';
import {CampaignConstant} from '../../../../constant/crm/campaign.constant';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {StatusCrm} from '../../../../models/crm/statusCrm.model';
import {PipelineStep} from '../../../../models/crm/PipelineStep';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {PermissionService} from '../../../services/permission/permission.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {UserService} from '../../../../administration/services/user/user.service';

const NAME_REFERENCE = 'name';

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.scss']
})
export class AddCampaignComponent implements OnInit {
  public isUpdateMode: boolean;
  public campaignFormGroup: FormGroup;
  public listRespUser: Array<Employee> = [];
  public listRespUserFiltred: Array<Employee> = [];
  public listConcernedEmployees: Array<Employee> = [];
  public listConcernedEmployeesFiltred: Array<Employee> = [];
  public formatDate: string = this.localStorageService.getFormatDate();
  public allPipelines = [];

  public campaignState = [];
  public campaignStateFilter = [];
  public listTeams = [];
  public teamsIds = [];
  public listStatus: StatusCrm[] = [];
  public listStatusFiltre: Array<PipelineStep> = [];
  public parentPermission = 'ADD_CAMPAIGN';
  public uuid = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND);
  public relatedActionsPermissions: any;
  private actionEntityName = CampaignConstant.CAMPAIGN;
  @ViewChild(NAME_REFERENCE) public nameInput: ElementRef;

  idCampaign: number;
  campaign = new Campaign();
  public startDate: Date;
  public openFirstCollapse = true;

  public listUsers = [];
  public Users = [];
  public listUsersFilter = [];
  private connectedUser: any;
  public predicate: PredicateFormat;
  public fromRh = false ;

  constructor(private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private translate: TranslateService,
              public validationService: ValidationService,
              private genericCrmService: GenericCrmService,
              private pipelineService: PipelineService,
              private campaignService: CampaignService,
              private router: Router,
              private growlService: GrowlService,
              private permissionService: PermissionService,
              private localStorageService: LocalStorageService,
              private userService: UserService
  ) {
  }

  ngOnInit() {
    this.getConnectedUser();
    this.loadIndividualUsersList();
    this.selectedPermission();
    this.createAddForm();
    this.getAllPipelines();
    this.initStateDropDown();
    this.loadTeamsList();
    this.getDataFromUrl();
    this.isUpdateMode = this.idCampaign > 0;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }

  }

  getDataFromUrl() {
    this.activatedRoute.params.subscribe(params => {
      this.idCampaign = +params['id'] || 0;
    });
  }

  initDropdownStep(data) {
    this.listStatus = [];
    this.pipelineService.getJavaGenericService().getEntityById(data.pipelineId).subscribe(
      (p) => {
        this.listStatusFiltre = p.pipelineSteps;
        p.pipelineSteps.forEach((pipelineSteps) => {
          const data = {
            Id: pipelineSteps.relatedStatus.id,
            id: pipelineSteps.id,
            title: pipelineSteps.relatedStatus.title,
            color: pipelineSteps.relatedStatus.color,
            positionInPipe: pipelineSteps.order,
            state: pipelineSteps.state
          };
          this.listStatus.push(data);

        });
        this.onValueChangeTeam(data.teams);
        this.campaignFormGroup.patchValue({
          name: data.name,
          pipelineId: data.pipelineId,
          state: data.state,
          responsablesUsersId: data.responsablesUsersId,
          teams: this.getRelatedTeams(data.teams),
          startDate: this.startDate,
          description: data.description,
          currentPositionPipe: data.currentPositionPipe

        });
      }
    );
  }

  getDataToUpdate() {
    if (this.idCampaign) {
      this.campaignService.getJavaGenericService().getEntityById(this.idCampaign).subscribe((data) => {
        this.campaign = data;
        this.initDates();
        this.initDropdownStep(data);


      });
    }
  }

  private getRelatedTeams(value) {
    return value.split(',').map(Number);
  }

  initDates() {

    if (this.campaign.startDate) {
      this.startDate = new Date(this.campaign.startDate);
    }
  }

  loadTeamsList() {
  }

  private getAllPipelines() {
    this.pipelineService.getJavaGenericService().getEntityList().subscribe((data) => {
      this.allPipelines = data;
    });
  }

  getStatusByPipeline(id) {
    this.listStatus = [];
    this.pipelineService.getJavaGenericService().getEntityById(id).subscribe(
      (p) => {
        this.listStatusFiltre = p.pipelineSteps;
        p.pipelineSteps.forEach((pipelineSteps) => {
          const data = {
            Id: pipelineSteps.relatedStatus.id,
            id: pipelineSteps.id,
            title: pipelineSteps.relatedStatus.title,
            color: pipelineSteps.relatedStatus.color,
            positionInPipe: pipelineSteps.order,
            state: pipelineSteps.state
          };
          this.listStatus.push(data);


        });
      }
    );
  }

  /*
 * Prepare Add form component
 */
  private createAddForm(): void {
    this.campaignFormGroup = this.formBuilder.group({
      name: ['', {
        validators: [Validators.required],
        asyncValidators: uniquePropCrmJavaServices(CampaignConstant.NAME_TITLE, this.campaignService, CrmConstant.INSERTED_ELEMENT),
        updateOn: 'blur'
      }],
      state: ['', Validators.required],
      responsablesUsersId: ['', Validators.required],
      pipelineId: [undefined, Validators.required],
      startDate: ['', Validators.required],
      teams: [''],
      description: [''],
      currentPositionPipe: [undefined, Validators.required],
    });
  }

  onMouseOut() {
    this.nameInput.nativeElement.blur();
  }


  handleResponsablesFilter(userSearched) {
    this.listUsers = this.listUsersFilter.filter(responsable => responsable.FullName.toLowerCase()
      .includes(userSearched.toLowerCase()));
  }

  get startTime(): FormControl {
    return this.campaignFormGroup.get(ActionConstant.START_TIME_FORM_CONTROL) as FormControl;
  }

  save() {
    if (this.campaignFormGroup.valid) {
      if (!this.isUpdateMode) {
        this.campaignService.getJavaGenericService().saveEntity(this.convertCampaignFormToCampaign(this.campaignFormGroup))
          .subscribe((_data) => {
            this.permissionService.savePermission(this.relatedActionsPermissions, this.actionEntityName, _data.id)
              .subscribe(() => {
                this.growlService.successNotification(this.translate.instant(ActionConstant.SUCCESS_OPERATION));
                this.onBackToListOrCancel();
              });

          });
      } else {

        this.update();
      }


    } else {
      this.validationService.validateAllFormFields(this.campaignFormGroup);
      this.checkCollapsesOpening();
    }
  }

  getElementCollapseNumber(control): number {
    if (control === 'responsablesUsersId' || control === 'teams' || control === 'startDate'
      || control === 'state' || control === 'pipelineId') {
      return 1;
    }
  }

  checkCollapsesOpening() {
    for (const control in this.campaignFormGroup.controls) {
      const collapseNumber = this.getElementCollapseNumber(control);
      if (collapseNumber === 1 && this.openFirstCollapse === false && this.campaignFormGroup.controls[control].invalid) {
        this.openFirstCollapse = true;
      }
    }
  }

  update() {
    this.campaignService.getJavaGenericService().updateEntity(this.convertCampaignFormToCampaign(this.campaignFormGroup), this.idCampaign)
      .subscribe((data) => {
        this.growlService.successNotification(this.translate.instant(ActionConstant.SUCCESS_OPERATION));
        this.onBackToListOrCancel();
      });
  }

  convertCampaignFormToCampaign(form: FormGroup) {
    let campaign: Campaign;
    campaign = form.value;
    campaign.teams = this.teamsIds.toString();
    return campaign;
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

  get teams(): FormControl {
    return this.campaignFormGroup.get('teams') as FormControl;
  }

  onValueChangeTeam(value) {
    this.teamsIds = [];
    this.teamsIds.push(value);

  }

  onBackToListOrCancel() {

    this.router.navigateByUrl(CampaignConstant.CAMPAIGN_LIST_URL);
  }


  updateState($event) {
    this.campaignFormGroup.controls['currentPositionPipe'].setValue($event);
    let stat = this.listStatusFiltre.filter((s) => s.id == $event);
    this.listStatusFiltre.forEach((status) => {
        if (status.relatedStatus.id == stat[0].relatedStatus.id) {
          if (status.state === 'INITIAL_STATE') {
            this.campaignFormGroup.patchValue({
              state: 0
            });
          }
          if (status.state === 'INTERMEDIATE_STATE') {
            this.campaignFormGroup.patchValue({
              state: 1
            });
          }
          if (status.state === 'FAILURE_FINAL_STATE') {

            this.campaignFormGroup.patchValue({
              state: 3
            });
          }
          if (status.state === 'SUCCESS_FINAL_STATE') {
            this.campaignFormGroup.patchValue({
              state: 2
            });
          }
        }
      }
    );

  }

  selectedPermission() {
    this.permissionService.getResult().subscribe(data => {
      if (data && data.permission && (data.parent === this.parentPermission)) {
        this.relatedActionsPermissions = data.permission;
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
    }, () => {
      this.growlService.ErrorNotification(this.translate.instant(SharedCrmConstant.FAILURE_OPERATION));
    }, () => {
    });
  }

  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
  }
}
