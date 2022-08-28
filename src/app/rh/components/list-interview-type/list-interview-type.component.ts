import { Component, ComponentRef, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { InterviewConstant } from '../../../constant/rh/interview.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { InterviewType } from '../../../models/rh/interview-type.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { OrderBy, OrderByDirection, PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { InterviewTypeService } from '../../services/interview-type/interview-type.service';

@Component({
  selector: 'app-list-interview-type',
  templateUrl: './list-interview-type.component.html',
  styleUrls: ['./list-interview-type.component.scss']
})
export class ListInterviewTypeComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  isModal = false;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  closeDialogSubject: Subject<any>;
  data = {};
  // gridSettings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  columnsConfig: ColumnSettings[] = [
    {
      field: InterviewConstant.LABEL,
      title: InterviewConstant.LABEL_TITLE,
      filterable: true
    },
    {
      field: InterviewConstant.DESCRIPTION,
      title: InterviewConstant.DESCRIPTION_TITLE,
      filterable: true
    }
  ];
  gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  // end gridSettings
  public hasDeletePermission: boolean;
  private editedRowIndex: number;
  private subscriptions: Subscription[] = [];

  constructor(private interviewTypeService: InterviewTypeService, private swalWarrings: SwalWarring,
              private validationService: ValidationService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_INTERVIEWTYPE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_INTERVIEWTYPE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_INTERVIEWTYPE);
    this.initGridDataSource();
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
    this.closeDialogSubject = options.closeDialogSubject;
    this.data = this.dialogOptions.data;
  }

  initGridDataSource() {
    this.subscriptions.push(this.interviewTypeService.reloadServerSideData(this.gridSettings.state, this.preparePredicate()).subscribe((data) => {
      this.gridSettings.gridData = data;
    }));
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      const grade: InterviewType = formGroup.value;
      this.subscriptions.push(this.interviewTypeService.save(grade, isNew, this.preparePredicate()).subscribe(() => {
        this.initGridDataSource();
        this.data = {interviewTypeAdded: true};
      }));
      sender.closeRow(rowIndex);
      this.formGroup = undefined;
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  addHandler({sender}) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Label: new FormControl('', { validators: Validators.required,
        asyncValidators: unique(InterviewConstant.LABEL, this.interviewTypeService, String(NumberConstant.ZERO)),
        updateOn: 'blur'}),
      Description: new FormControl('', Validators.required)
    });
    sender.addRow(this.formGroup);
  }

  editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Id: new FormControl(dataItem.Id),
      Label: new FormControl(dataItem.Label, { validators: Validators.required,
        asyncValidators: unique(InterviewConstant.LABEL, this.interviewTypeService, String(dataItem.Id)),
        updateOn: 'blur'}),
      Description: new FormControl(dataItem.Description, Validators.required)
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }

  cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.interviewTypeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
          this.data = {interviewTypeAdded: true};
        }));
      }
    });
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

  private preparePredicate(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy(InterviewConstant.ID, OrderByDirection.desc));
    return predicate;
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
}
