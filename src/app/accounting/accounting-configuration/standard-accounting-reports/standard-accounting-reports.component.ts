import { Component, ComponentRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subscription } from 'rxjs/Subscription';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { AccountingConfigurationService } from '../../services/configuration/accounting-configuration.service';
import { ReportingConstant } from '../../../constant/accounting/reporting.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { DataStateChangeEvent, GridComponent, RowClassArgs } from '@progress/kendo-angular-grid';
import { ReportingService } from '../../services/reporting/reporting.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { Observable } from 'rxjs/Observable';
import { GenericAccountingService } from '../../services/generic-accounting.service';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import {KeyboardConst} from '../../../constant/keyboard/keyboard.constant';
import {ActivatedRoute} from '@angular/router';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-standard-accounting-reports',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './standard-accounting-reports.component.html',
  styleUrls: ['./standard-accounting-reports.component.scss']
})
export class StandardAccountingReportsComponent implements OnInit, OnDestroy, IModalDialog {

  public reportTypeData: any[];
  public reportTypeDataFilter: any[];
  public standardAccountingReportForm: FormGroup;
  public reportConfigFormGroup: FormGroup;

  public editedRowIndex: number;
  public editLineMode = false;

  public signValues;
  public isSave = false;

  options: Partial<IModalDialogOptions<any>>;

  private subscription: Subscription;
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;

  @ViewChild(GridComponent)
  private grid: GridComponent;
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: ReportingConstant.RL_LINE_INDEX_FIELD,
      title: ReportingConstant.RL_LINE_INDEX_TITLE,
      tooltip: ReportingConstant.RL_LINE_INDEX_TITLE,
      filterable: false,
      width: NumberConstant.ONE_HUNDRED_TEN,
    },
    {
      field: ReportingConstant.RL_LABEL_FIELD,
      title: ReportingConstant.RL_LABEL_TITLE,
      tooltip: ReportingConstant.RL_LABEL_TITLE,
      filterable: false,
      width: NumberConstant.TWO_HUNDRED_FIFTY,
    },
    {
      field: ReportingConstant.RL_FORMULA_FIELD,
      title: ReportingConstant.RL_FORMULA_TITLE,
      tooltip: ReportingConstant.RL_FORMULA_TITLE,
      filterable: false,
      editable: true,
      width: NumberConstant.TWO_HUNDRED_FIFTY,
    },
    {
      field: ReportingConstant.RL_SIGN_FIELD,
      title: ReportingConstant.RL_SIGN_TITLE,
      tooltip: ReportingConstant.RL_SIGN_TITLE,
      filterable: false,
      editable: true,
      width: NumberConstant.ONE_HUNDRED_SEVENTY
    },
    {
      field: ReportingConstant.RL_ANNEX_CODE_FIELD,
      title: ReportingConstant.RL_ANNEX_CODE_TITLE,
      tooltip: ReportingConstant.RL_ANNEX_CODE_TITLE,
      filterable: false,
      editable: true,
      width: NumberConstant.ONE_HUNDRED_SEVENTY,
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(private fb: FormBuilder,
    private validationService: ValidationService,
    private translate: TranslateService,
    private authService: AuthService,
    private reportingService: ReportingService,
    private genericAccountingService: GenericAccountingService,
    private growlService: GrowlService) {
  }

  public rowClassCallback = (context: RowClassArgs) => {
    return { grayed: context.dataItem.highlighted };
  }

  initGridDataSource() {
    this.reportingService.getJavaGenericService().getEntityList(`${ReportingConstant.GET_STANDARD_REPORT}/` +
      `${this.standardAccountingReportForm.value.reportType}`)
      .subscribe(reportLines => {
        this.assignDataToGrid(reportLines);
      }, err => {
        this.growlService.ErrorNotification(err);
      });
  }

  assignDataToGrid(data) {
    data.map(reportLine => {
      if (reportLine.negative === true) {
        reportLine.negative = this.signValues[1].status;
      } else if (reportLine.negative === false) {
        reportLine.negative = this.signValues[0].status;
      }
    });
    this.gridSettings.gridData = data;
  }
  public initSignValues() {
    this.signValues = [{ negative: false, status: `${this.translate.instant(ReportingConstant.POSITIVE)}` },
    { negative: true, status: `${this.translate.instant(ReportingConstant.NEGATIVE)}` }];
  }

  private initAddForm() {
    return this.fb.group({
      reportType: ['', [Validators.required]]
    });
  }

  private initConfigForm() {
    return this.fb.group({
      id: [''],
      lineIndex: [''],
      label: [''],
      reportType: [''],
      negative: [''],
      formula: ['', Validators.required],
      annexCode: ['']
    });
  }

  previewReportInGrid() {
    if (this.standardAccountingReportForm.valid) {
      if (!this.isReportConfigFormChanged()) {
        this.initGridDataSource();
      } else {
        this.genericAccountingService.openModalToConfirmSwitchingToAnotherOperationType()
          .then((result) => {
            if (result.value) {
              if (this.editedRowIndex !== undefined) {
                this.grid.closeRow(this.editedRowIndex);
              }
              this.initGridDataSource();
            }
          });
      }
    } else {
      this.validationService.validateAllFormFields(this.standardAccountingReportForm);
    }
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.options = options;
  }

  public lineClickHandler({ rowIndex, dataItem}) {
    if (this.authService.hasAuthority(this.AccountingPermissions.UPDATE_ACCOUNTING_STANDARD_REPORTS_FORMULA)){
      if (!this.isSave) {
        if ( this.editedRowIndex !== undefined && this.editedRowIndex !== rowIndex) {
          this.saveLineBeforeClose(this.editedRowIndex , this.reportConfigFormGroup);
        }
          this.reportConfigFormGroup.patchValue(dataItem);
          this.reportConfigFormGroup.markAsTouched();
          this.grid.editRow(rowIndex, this.reportConfigFormGroup);

        if (this.reportConfigFormGroup) {
          if (dataItem.negative === this.signValues[1].status) {
            this.reportConfigFormGroup.controls['negative'].setValue(true);
          } else {
            this.reportConfigFormGroup.controls['negative'].setValue(false);
          }
          this.editedRowIndex = rowIndex;
          this.editLineMode = true;
        }
      } else {
        this.isSave = false;
      }
    }
  }

  public saveLineBeforeClose(rowIndex, formGroup) {
    if (formGroup.valid && formGroup.value && formGroup.value.id) {
        this.reportingService.getJavaGenericService().updateEntity(formGroup.value, formGroup.value.id, ReportingConstant.GET_STANDARD_REPORT).toPromise().then(async res => {
          if (res) {
            await new Promise(resolve => resolve(
              this.successOperation(rowIndex)
            ));
          }
        });
    }
    this.grid.closeRow(rowIndex);
  }

  public cancelHandler({ rowIndex }) {
    this.grid.closeRow(rowIndex);
  }

  public closeEditor(rowIndex: number) {
    this.grid.closeRow(rowIndex);
    this.reportConfigFormGroup = this.initConfigForm();
    this.editedRowIndex = undefined;
    this.editLineMode = false;
  }

  private async successOperation(rowIndex: number) {
    this.grid.closeRow(rowIndex);
    await this.initGridDataSource();
    this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
  }

  public saveHandler({ rowIndex, formGroup }) {
    if (formGroup.valid) {
      const reportLine = formGroup.value;
      if (reportLine.id) {
        this.reportingService.getJavaGenericService().updateEntity(reportLine, reportLine.id, ReportingConstant.GET_STANDARD_REPORT).toPromise().then(async res => {
          if (res) {
            await new Promise(resolve => resolve(
              this.successOperation(rowIndex)
            ));
          }
        });
      }
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
    this.isSave = true;
    this.grid.closeRow(rowIndex);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
  }

  public keyEnterAction(sender: GridComponent, formGroup: any, e: KeyboardEvent) {
    const rowIndex = this.editedRowIndex;
    if (!formGroup || !formGroup.valid || e.key !== KeyboardConst.ENTER) {
      return;
    }
    this.saveHandler({ rowIndex, formGroup });
  }
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(this.isReportConfigFormChanged.bind(this));
  }

  isReportConfigFormChanged() {
    return this.reportConfigFormGroup.touched;
  }
  handleFilterChange(writtenValue) {
    this.reportTypeData = this.reportTypeDataFilter.filter((s) =>
      s.text.toLowerCase().includes(writtenValue.toLowerCase())
      || s.text.toLocaleLowerCase().includes(writtenValue.toLowerCase())
    );
  }
  ngOnInit() {
    this.initSignValues();
    this.standardAccountingReportForm = this.initAddForm();
    this.reportConfigFormGroup = this.initConfigForm();

    this.reportTypeData = [{
      text: this.translate.instant(ReportingConstant.STATE_OF_INCOME),
      reportType: ReportingConstant.SOI
    }, {
      text: this.translate.instant(ReportingConstant.BALANCE_SHEET),
      reportType: ReportingConstant.BS
    }, {
      text: this.translate.instant(ReportingConstant.COMMERCIAL_INTERMEDIARY_BALANCES),
      reportType: ReportingConstant.CIB
    }, {
      text: this.translate.instant(ReportingConstant.INDUSTRIAL_INTERMEDIARY_BALANCES),
      reportType: ReportingConstant.IIB
    },
    {
      text: this.translate.instant(ReportingConstant.CASH_FLOW_REFERENCE) ,
      reportType: ReportingConstant.CF
    },
    /*{
      text: this.translate.instant(ReportingConstant.CASH_FLOW_AUTHORIZED) ,
      reportType: ReportingConstant.CFA
    }*/
    ];
    this.reportTypeDataFilter = this.reportTypeData;
    this.standardAccountingReportForm.controls['reportType'].setValue(this.reportTypeData[0].reportType);
    this.initGridDataSource();
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

}

