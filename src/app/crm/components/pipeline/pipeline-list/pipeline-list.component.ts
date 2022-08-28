import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {State} from '@progress/kendo-data-query';
import {PipelineConstant} from '../../../../constant/crm/pipeline.constant';
import {PipelineService} from '../../../services/pipeline/pipeline.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';
import {Pipeline} from '../../../../models/crm/Pipeline';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {Router} from '@angular/router';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {GrowlService} from '../../../../../COM/Growl/growl.service';

@Component({
  selector: 'app-pipeline-list',
  templateUrl: './pipeline-list.component.html',
  styleUrls: ['./pipeline-list.component.scss'],
})
export class PipelineListComponent implements OnInit {

  @Output() sendDataToDetails = new EventEmitter<any>();
  public eventFromPipelineDetails: Observable<any>;

  public formGroup;
  private pipelineList = [];
  private pageSize = NumberConstant.TEN;
  public CRMPermissions = PermissionConstant.CRMPermissions;
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
      field: PipelineConstant.NAME_FIELD,
      title: PipelineConstant.NAME_TITLE,
      filterable: false,
      _width: 160
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  pagerSettings: PagerSettings = CrmConstant.PAGER_SETTINGS;

  public pipelineNameIsUsed = false;
  public rowIndex;
  public sender: any;

  public mySelection: number[] = [];

  constructor(private pipelineService: PipelineService,
              private formBuilder: FormBuilder,
              private router: Router,
              private swalWarrings: SwalWarring,
              private validationService: ValidationService,
              private translate: TranslateService,
              public authService: AuthService,
              private growlService: GrowlService) {
  }

  getDataFromDetails(): void {
    this.eventFromPipelineDetails = this.pipelineService.readDataFromDetails();
    if (this.eventFromPipelineDetails) {
      this.eventFromPipelineDetails.subscribe((data) => {
        if (data && (data.event === PipelineConstant.REFRESH_LIST || data.event === PipelineConstant.CANCEL)) {
          this.initGridDataSource(this.gridState.skip);
        } else if (data && data.event === PipelineConstant.PIPELINE_NAME_IS_ALREADY_USED) {
          this.pipelineNameIsUsed = true;
        } else if (data && data.event === PipelineConstant.VALIDATE_FORM_GROUP) {
          this.validationService.validateAllFormFields(this.formGroup);
        }
      });
    }
  }

  private isPossibleToUpdateOrDelete(dataItem: Pipeline) {
    return dataItem.possibleToDeleteOrUpdate;
  }

  private isPossibleToDelete(dataItem: Pipeline) {
    return dataItem.possibleToDelete;
  }

  private getFirstElementId() {
    if (this.pipelineList.length !== 0) {
      this.mySelection = [];
      const id = (this.pipelineList[0] as Pipeline).id;
      this.mySelection.push(id);
    }
  }

  public showFirstElementDetails() {
    this.sendDataToDetails.emit({operation: PipelineConstant.DETAILS_OPERATIONS, data: this.pipelineList[0]});
  }

  ngOnInit() {
    this.getDataFromDetails();
    this.initGridDataSource(this.gridState.skip);
  }

  initGridDataSource(page) {
    this.pipelineService.getJavaGenericService().getEntityList(PipelineConstant.PAGINATION_URL, page + NumberConstant.ONE)
      .subscribe(data => {
          this.pipelineList = data.pipelineDtoList;
          this.getFirstElementId();
          this.showFirstElementDetails();
          this.gridSettings.gridData = {
            data: data.pipelineDtoList,
            total: data.totalElements
          };
        }
      );
  }


  public removeHandler(event) {
    let deleted = false;
    this.swalWarrings.CreateSwal(this.translate.instant(PipelineConstant.PUP_UP_DELETE_PIPELINE_TEXT)).then((result) => {
      if (result.value) {
        this.pipelineService.getJavaGenericService().deleteEntity(event.id).subscribe((data) => {
          if (data) {
            deleted = true;
          }
        }, () => {

        }, () => {
          if (deleted) {
            this.growlService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
            this.initGridDataSource(this.gridState.skip);
          }
        });
      }
    });
  }


  private changeName() {
    this.pipelineNameIsUsed = false;
  }

  onPageChange(event) {
    this.pageSize = event.take;
    this.gridState.skip = event.skip / NumberConstant.TEN;
    this.initGridDataSource(this.gridState.skip);
  }

  public dataStateChange(state: any): void {
    this.gridSettings.state = state;
  }

  goToDetails(dataItem) {
    this.router.navigateByUrl(PipelineConstant.DETAILS_URL.concat(dataItem.id));
  }
}
