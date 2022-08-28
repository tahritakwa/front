import {Component, OnDestroy, OnInit} from '@angular/core';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IModalDialogOptions} from 'ngx-modal-dialog';
import {State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {QualificationConstant} from '../../../constant/payroll/qualification.constant';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {QualificationTypeService} from '../../../shared/services/qualification-type/qualification-type.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {QualificationType} from '../../../models/payroll/qualification-type.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {PermissionConstant} from '../../../Structure/permission-constant';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-qualification-type',
  templateUrl: './list-qualification-type.component.html',
  styleUrls: ['./list-qualification-type.component.scss']
})
export class ListQualificationTypeComponent implements OnInit, OnDestroy {
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public formGroup: FormGroup;
  public isModal = false;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: QualificationConstant.LABEL,
      title: QualificationConstant.LABEL_TITLE,
      filterable: true
    },
    {
      field: QualificationConstant.DESCRIPTION,
      title: QualificationConstant.DESCRIPTION_TITLE,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasDeletePermission: boolean;
  private editedRowIndex: number;
  private subscriptions: Subscription[] = [];

  constructor(public qualificationTypeService: QualificationTypeService,
              private swalWarrings: SwalWarring, private validationService: ValidationService,
              private authService: AuthService) {
  }

  dialogInit(options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_QUALIFICATIONTYPE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_QUALIFICATIONTYPE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_QUALIFICATIONTYPE);
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.subscriptions.push(this.qualificationTypeService.reloadServerSideData(this.gridSettings.state)
      .subscribe(data => {
          this.gridSettings.gridData = data;
        }
      ));
  }

  public addHandler({sender}) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Label: new FormControl('', Validators.required),
      Description: new FormControl('')
    });
    sender.addRow(this.formGroup);
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.qualificationTypeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      const qualificationType: QualificationType = formGroup.value;
      this.subscriptions.push(this.qualificationTypeService.save(qualificationType, isNew).subscribe(() => {
        this.initGridDataSource();
      }));
      sender.closeRow(rowIndex);
      this.formGroup = undefined;
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Id: new FormControl(dataItem.Id),
      Label: new FormControl(dataItem.Label, Validators.required),
      Description: new FormControl(dataItem.Description)
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  isFormChanged(): boolean {
    return this.formGroup && this.formGroup.touched;
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
}
