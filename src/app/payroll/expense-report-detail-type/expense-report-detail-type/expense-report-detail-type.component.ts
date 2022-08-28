import { Component, ComponentRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ExpenseReportDetailsConstant } from '../../../constant/payroll/expense-report-details.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { ExpenseReportDetailsType } from '../../../models/payroll/expense-report-details-type.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ExpenseReportDetailsTypeService } from '../../services/expense-report-details-type/expense-report-details-type.service';

@Component({
  selector: 'app-expense-report-detail-type',
  templateUrl: './expense-report-detail-type.component.html',
  styleUrls: ['./expense-report-detail-type.component.scss']
})
export class ExpenseReportDetailTypeComponent implements OnInit, OnDestroy {
  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  /**
   * Form Group
   */
  public expenseReportDetailTypeFormGroup: FormGroup;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  /**
   * Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  public isModal = false;
  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: ExpenseReportDetailsConstant.CODE,
      title: ExpenseReportDetailsConstant.CODE_UPPERCASE,
      filterable: true,
    },
    {
      field: ExpenseReportDetailsConstant.LABEL,
      title: ExpenseReportDetailsConstant.LABEL_UPPERCASE,
      filterable: true
    }
  ];
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowPermission: boolean;

  // Edited Row index
  private editedRowIndex: number;
  private editedRow: ExpenseReportDetailsType;
  private subscriptions: Subscription[] = [];

  constructor(public expenseReportDetailsTypeService: ExpenseReportDetailsTypeService,
              private fb: FormBuilder,
              private validationService: ValidationService,
              private swalWarrings: SwalWarring,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_EXPENSEREPORTDETAILSTYPE);
    this.hasUpdatePermission =
     this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_EXPENSEREPORTDETAILSTYPE);
    this.hasDeletePermission =
     this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_EXPENSEREPORTDETAILSTYPE);
    this.initGridDataSource();
  }

  /**
   * init grid data
   */
  initGridDataSource() {
    this.subscriptions.push(this.expenseReportDetailsTypeService.reloadServerSideData(this.gridSettings.state)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      }));
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.expenseReportDetailsTypeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Quick add
   * @param param0
   */
  public addHandler({sender}) {
    this.closeEditor(sender);
    this.expenseReportDetailTypeFormGroup = new FormGroup({
      Code: new FormControl('', { validators: Validators.required,
          asyncValidators: unique(ExpenseReportDetailsConstant.CODE, this.expenseReportDetailsTypeService, String(NumberConstant.ZERO)),
        updateOn: 'blur'}),
      Label: new FormControl('', { validators: Validators.required,
          asyncValidators: unique(ExpenseReportDetailsConstant.LABEL, this.expenseReportDetailsTypeService, String(NumberConstant.ZERO)),
        updateOn: 'blur'})
    });
    sender.addRow(this.expenseReportDetailTypeFormGroup);
  }

  /**
   * Quick edit
   * @param param0
   */
  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    this.expenseReportDetailTypeFormGroup = this.fb.group({
      Id: [dataItem.Id],
      Code: [dataItem.Code, { validators: Validators.required,
          asyncValidators: unique(ExpenseReportDetailsConstant.CODE, this.expenseReportDetailsTypeService, String(dataItem.Id)),
        updateOn: 'blur'}],
      Label: [dataItem.Label, Validators.required, { validators: Validators.required,
          asyncValidators: unique(ExpenseReportDetailsConstant.LABEL, this.expenseReportDetailsTypeService, String(dataItem.Id)),
        updateOn: 'blur'}],
    });
    this.editedRowIndex = rowIndex;
    this.editedRow = dataItem;
    sender.editRow(rowIndex, this.expenseReportDetailTypeFormGroup);
  }

  /**
   * Save handler
   * @param param0
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      let expenseReportDetailType: ExpenseReportDetailsType;
      if (this.editedRow) {
        Object.assign(this.editedRow, formGroup.getRawValue());
        expenseReportDetailType = this.editedRow;
      } else {
        expenseReportDetailType = formGroup.getRawValue();
      }
      this.subscriptions.push(this.expenseReportDetailsTypeService.save(expenseReportDetailType, isNew).subscribe(() => {
        this.initGridDataSource();
      }));
      sender.closeRow(rowIndex);
      this.expenseReportDetailTypeFormGroup = undefined;
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
   * Cancel
   * @param param0
   */
  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.subscriptions.push(this.expenseReportDetailsTypeService.reloadServerSideData(state).subscribe(data => this.gridSettings.gridData = data));
  }

  isFormChanged(): boolean {
    return this.expenseReportDetailTypeFormGroup && this.expenseReportDetailTypeFormGroup.touched;
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

  /**
   * Close editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.editedRow = undefined;
      this.expenseReportDetailsTypeService = undefined;
      this.expenseReportDetailTypeFormGroup = undefined;
    }
  }
}
