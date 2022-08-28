import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {State} from '@progress/kendo-data-query';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {unique, uniquePropCrmJavaServices, ValidationService} from '../../../../shared/services/validation/validation.service';
import {StatusOpportunity} from '../../../../models/crm/status-opportunity.model';
import {StatusOpportunityService} from '../../../services/list-status-opportunity/status-opportunity.service';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {CategoryService} from '../../../services/category/category.service';
import {StatusConstant} from '../../../../constant/crm/status.constant';
import {GenericCrmService} from '../../../generic-crm.service';
import {HttpCrmErrorCodes} from '../../../http-error-crm-codes';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {PeriodConstant} from '../../../../constant/Administration/period.constant';
import {Router} from '@angular/router';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {TiersConstants} from '../../../../constant/purchase/tiers.constant';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {AuthService} from '../../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-status-opportunity',
  templateUrl: './list-status-opportunity.component.html',
  styleUrls: ['./list-status-opportunity.component.scss']
})
export class ListStatusOpportunityComponent implements OnInit {
  public predicate: PredicateFormat;
  public formGroup: FormGroup;
  public isUpdateMode: boolean;
  private editedRowIndex: number;
  private listStatus = [];
  controlColorChange: boolean;
  colorTosend: string;
  color = '#fff';
  public titleAlreadyExists = false;
  public colorAlreadyExists = false;
  public allowOpenRow = true;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  private pageSize = NumberConstant.TEN;

  public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: StatusConstant.ID,
      title: StatusConstant.ID_TITLE,
      filterable: true
    },
    {
      field: StatusConstant.TITLE,
      title: StatusConstant.NAME_TITLE,
      filterable: true,
    },
    {
      field: StatusConstant.COLOR,
      title: StatusConstant.COLOR_TITLE,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  /**
   *
   * @param statusOpportunityService
   * @param objectifService
   * @param swalWarrings
   * @param validationService
   * @param translate
   * @param fb
   * @param growlService
   */
  constructor(public statusOpportunityService: StatusOpportunityService,
              private objectifService: CategoryService,
              private swalWarrings: SwalWarring,
              private validationService: ValidationService,
              private genericCrmService: GenericCrmService,
              private translate: TranslateService,
              private router: Router,
              private fb: FormBuilder,
              private growlService: GrowlService,
              public authService: AuthService
  ) {
    this.controlColorChange = false;
  }

  ngOnInit() {
    this.initGridDataSource(this.gridState.skip);
  }

  getColor(a) {
    this.colorTosend = this.gridSettings.gridData.data[a - this.gridSettings.state.skip].color;
    return this.colorTosend;
  }


  initGridDataSource(page) {
    this.statusOpportunityService.getJavaGenericService().getEntityList('all', page + NumberConstant.ONE)
      .subscribe(data => {
          this.listStatus = data.statusDtoList;
          this.gridSettings.gridData = {
            data: data.statusDtoList,
            total: data.totalItems
          };
        }
      );
  }


  /**
   *
   * Ann new row in grid for add new City type
   * @param param0
   */
  public addHandler({sender}) {
    if (this.editedRowIndex !== undefined) {
      sender.closeRow(this.editedRowIndex);
    }
    this.initVariables();
    this.allowOpenRow = false;
    this.isUpdateMode = false;
    this.formGroup = this.fb.group({
      Id: [0],
      title: ['', {
        validators: [Validators.required]
      }],
      color: ['']
    });
    this.color = '#fff';
    this.formGroup.controls[StatusConstant.COLOR].setValue(this.color);
    sender.addRow(this.formGroup);
  }

  private initVariables() {
    this.colorAlreadyExists = false;
    this.titleAlreadyExists = false;
  }

  /**
   * Cancel the add or update of new City type
   * @param param0
   */
  public cancelHandler({sender, rowIndex}) {
    this.allowOpenRow = true;
    this.closeEditor(sender, rowIndex);
  }

  /**
   * Remove status
   * @param param
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateDeleteSwal(StatusConstant.STATUS_MODEL, SharedConstant.CETTE).then((result) => {
      if (result.value) {
        this.statusOpportunityService.getJavaGenericService().deleteEntity(dataItem.id).subscribe(() => {
          this.growlService.successNotification(this.translate.instant(SharedCrmConstant.SUCCESS_OPERATION));
          this.initGridDataSource(this.gridSettings.state.skip);
          this.objectifService.statusSaved.next();
        });
      }
    });
  }

  /**
   * Close the editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  /**
   * Save the new City type
   * @param param
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid && !(this.titleAlreadyExists && this.colorAlreadyExists)) {
      const statusOpportunity: StatusOpportunity = formGroup.value;
      if (isNew) {
        this.statusOpportunityService.getJavaGenericService().saveEntity(statusOpportunity).subscribe((data) => {
          if (data) {
            if (data.errorCode === HttpCrmErrorCodes.STATUS_COLOR_ALREADY_USED) {
              this.formGroup.controls[StatusConstant.COLOR].setErrors({'incorrect': true});
              this.colorAlreadyExists = true;
            } else if (data.errorCode === HttpCrmErrorCodes.STATUS_TITLE_ALREADY_USED) {
              this.formGroup.controls[StatusConstant.TITLE].setErrors({'incorrect': true});
              this.titleAlreadyExists = true;
            } else if (data.id) {
              this.formGroup.controls[StatusConstant.TITLE].setErrors(null);
              this.growlService.successNotification(this.translate.instant(SharedCrmConstant.SUCCESS_OPERATION));
              this.initGridDataSource(this.gridSettings.state.skip);
              this.titleAlreadyExists = false;
              sender.closeRow(rowIndex);
              this.closeEditor(sender);
              this.allowOpenRow = true;
            }
          }
        });
      } else {
        this.statusOpportunityService.getJavaGenericService()
          .updateEntity(statusOpportunity, statusOpportunity.id).subscribe((data) => {
          if (data) {
            if (data.errorCode === HttpCrmErrorCodes.STATUS_COLOR_ALREADY_USED) {
              this.formGroup.controls[StatusConstant.COLOR].setErrors({'incorrect': true});
              this.colorAlreadyExists = true;
            } else if (data.errorCode === HttpCrmErrorCodes.STATUS_TITLE_ALREADY_USED) {
              this.formGroup.controls[StatusConstant.TITLE].setErrors({'incorrect': true});
              this.titleAlreadyExists = true;
            } else if (data.id) {
              this.formGroup.controls[StatusConstant.TITLE].setErrors(null);
              this.growlService.successNotification(this.translate.instant(SharedCrmConstant.SUCCESS_OPERATION));
              this.initGridDataSource(this.gridSettings.state.skip);
              this.titleAlreadyExists = false;
              sender.closeRow(rowIndex);
              this.closeEditor(sender);
              this.allowOpenRow = true;
            }
          }
        });
      }
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  private checkAttributeUnicity(attribute: string, value: string) {
    const actionToDo = this.isUpdateMode ? CrmConstant.UPDATED_ELEMENT : CrmConstant.INSERTED_ELEMENT;
    this.statusOpportunityService.getUnicity(attribute, value, actionToDo).subscribe((data: any) => {
      if (data && this.formGroup) {
        if (attribute === StatusConstant.COLOR) {
          if (data.errorCode === HttpCrmErrorCodes.STATUS_COLOR_ALREADY_USED) {
            this.formGroup.controls[StatusConstant.COLOR].setErrors({'incorrect': true});
            this.colorAlreadyExists = true;
          } else if (data === true) {
            this.formGroup.controls[StatusConstant.COLOR].setErrors(null);
            this.colorAlreadyExists = false;
          }
        } else if (attribute === StatusConstant.TITLE) {
          if (data.errorCode === HttpCrmErrorCodes.STATUS_TITLE_ALREADY_USED) {
            this.formGroup.controls[StatusConstant.TITLE].setErrors({'incorrect': true});
            this.titleAlreadyExists = true;
          } else if (data === true) {
            this.formGroup.controls[StatusConstant.TITLE].setErrors(null);
            this.titleAlreadyExists = false;
          }
        }
      }

    });
  }

  /**
   * Edit the column on which the user clicked
   * @param param
   *
   */
  public editHandler({sender, rowIndex, dataItem}) {
    if (this.allowOpenRow) {
      this.allowOpenRow = false;
      if (this.editedRowIndex !== undefined) {
        sender.closeRow(this.editedRowIndex);
      }
      this.initVariables();
      this.isUpdateMode = true;

      this.formGroup = new FormGroup({
        id: new FormControl(dataItem.id),
        color: new FormControl(dataItem.color, Validators.required),
        title: new FormControl(dataItem.title,
          [Validators.required]),
      });
      this.editedRowIndex = rowIndex;
      this.color = this.formGroup.value.color;
      sender.editRow(rowIndex, this.formGroup);
    }
  }

  getUpdateColor(index) {
    if (this.isUpdateMode) {
      this.colorTosend = this.color;
    } else if (index > -1) {
      this.colorTosend = this.gridSettings.gridData[index].color;
    } else {
      this.colorTosend = this.color;
    }
    return this.colorTosend;
  }


  colorChange() {
    if (this.formGroup) {
      this.checkAttributeUnicity(StatusConstant.TITLE, this.formGroup.controls[StatusConstant.TITLE].value);
      this.formGroup.controls[StatusConstant.COLOR].setValue(this.color);
      if (!this.allowOpenRow) {
        this.checkAttributeUnicity(StatusConstant.COLOR, this.formGroup.controls[StatusConstant.COLOR].value);
      }
      this.initGridDataSource(this.gridSettings.state.skip);
    }
  }

  private valueIsChanged(event) {
    if (event === true) {
      this.titleAlreadyExists = false;
    }
  }


  colorChangedEventW(event) {
    if (event.valid && !this.allowOpenRow) {
      this.checkAttributeUnicity(StatusConstant.COLOR, event.value);
    }
  }


  onPageChange(event) {
    this.pageSize = event.take;
    this.initGridDataSource(event.skip / NumberConstant.TEN);
  }

  public dataStateChange(state: any): void {
    this.gridSettings.state = state;
  }

  goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(StatusConstant.EDIT_URL.concat(String(dataItem.id)), {skipLocationChange: true});
  }
}
