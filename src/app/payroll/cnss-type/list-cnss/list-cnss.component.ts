import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { CnssConstant } from '../../../constant/payroll/cnss.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Cnss } from '../../../models/payroll/cnss.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { digitsAfterComma, isEqualLength, unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { CnssService } from '../../services/cnss/cnss.service';

@Component({
  selector: 'app-list-cnss',
  templateUrl: './list-cnss.component.html',
  styleUrls: ['./list-cnss.component.scss']
})
export class ListCnssComponent implements OnInit {
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  public formGroup: FormGroup;
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
      field: 'Label',
      title: 'LABEL',
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: 'EmployerRate',
      title: 'EMPLOYER_RATE',
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_SEVENTY
    },
    {
      field: 'SalaryRate',
      title: 'SALARY_RATE',
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_SEVENTY
    },
    {
      field: 'WorkAccidentQuota',
      title: 'WORK_ACCIDENT_QUOTA',
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_SEVENTY
    },
    {
      field: 'OperatingCode',
      title: 'OPERATING_CODE',
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
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

  constructor(public cnssTypeService: CnssService, private swalWarrings: SwalWarring, private validationService: ValidationService,
              private authService: AuthService) {
  }

  get SalaryRate(): FormControl {
    return this.formGroup.get('SalaryRate') as FormControl;
  }

  get EmployerRate(): FormControl {
    return this.formGroup.get('EmployerRate') as FormControl;
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_CNSS);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_CNSS);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_CNSS);
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.subscriptions.push(this.cnssTypeService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
          this.gridSettings.gridData = data;
        }
      ));
  }

  /**
   * this method fis invoked if the page number or filter has changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  /**
   * Ann new row in grid for add new Cnss type
   * @param param0
   */
  public addHandler({sender}) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Label: new FormControl('', {validators: Validators.required, updateOn: 'blur'}),
      EmployerRate: new FormControl(NumberConstant.ZERO, {
        validators: [Validators.required, Validators.min(NumberConstant.ZERO),
          Validators.max(NumberConstant.ONE_HUNDRED), digitsAfterComma(NumberConstant.TWO)], updateOn: 'blur'
      }),
      SalaryRate: new FormControl(NumberConstant.ZERO, {
        validators: [Validators.required, Validators.min(NumberConstant.ZERO),
          Validators.max(NumberConstant.ONE_HUNDRED), digitsAfterComma(NumberConstant.TWO)], updateOn: 'blur'
      }),
      WorkAccidentQuota: new FormControl(NumberConstant.ZERO, {
        validators: [Validators.required, Validators.min(NumberConstant.ZERO),
          Validators.max(NumberConstant.ONE_HUNDRED), digitsAfterComma(NumberConstant.TWO)], updateOn: 'blur'
      }),
      OperatingCode: new FormControl('', {
        validators: [Validators.required, isEqualLength(CnssConstant.OPERATING_CODE_LENGTH)],
        asyncValidators: unique(CnssConstant.OPERATING_CODE, this.cnssTypeService, String(NumberConstant.ZERO)),
        updateOn: 'blur'
      })
    });
    sender.addRow(this.formGroup);
  }

  /**
   * Cancel the add or update of new Cnss type
   * @param param0
   */
  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  /**
   * Remove an item of Cnss type
   * @param param
   */
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.cnssTypeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Save the new Cnss type
   * @param param
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      const cnssType: Cnss = formGroup.value;
      this.subscriptions.push(this.cnssTypeService.save(cnssType, isNew, this.predicate).subscribe(() => {
        this.initGridDataSource();
      }));
      sender.closeRow(rowIndex);
      this.formGroup = undefined;
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
   * Edit the column on which the user clicked
   * @param param
   */
  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Id: new FormControl(dataItem.Id),
      Label: new FormControl(dataItem.Label, {validators: Validators.required, updateOn: 'blur'}),
      EmployerRate: new FormControl(dataItem.EmployerRate, {
        validators: [Validators.required, Validators.min(NumberConstant.ZERO),
          Validators.max(NumberConstant.ONE_HUNDRED), digitsAfterComma(NumberConstant.TWO)], updateOn: 'blur'
      }),
      SalaryRate: new FormControl(dataItem.SalaryRate, {
        validators: [Validators.required, Validators.min(NumberConstant.ZERO),
          Validators.max(NumberConstant.ONE_HUNDRED), digitsAfterComma(NumberConstant.TWO)], updateOn: 'blur'
      }),
      WorkAccidentQuota: new FormControl(dataItem.WorkAccidentQuota, {
        validators: [Validators.required, Validators.min(NumberConstant.ZERO),
          Validators.max(NumberConstant.ONE_HUNDRED), digitsAfterComma(NumberConstant.TWO)], updateOn: 'blur'
      }),
      OperatingCode: new FormControl(dataItem.OperatingCode, {
        asyncValidators: unique(CnssConstant.OPERATING_CODE, this.cnssTypeService, String(dataItem.Id))
      })
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
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
}
