import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { DataSourceRequestState, State } from '@progress/kendo-data-query';
import { IModalDialogOptions } from 'ngx-modal-dialog';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ContractTypeConstant } from '../../../constant/payroll/contract-type.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { ContractType } from '../../../models/payroll/contract-type.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import {
  greaterOrEqualThan,
  isAlphabetical,
  lowerOrEqualThan,
  unique,
  ValidationService
} from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ContractTypeService } from '../../services/contract-type/contract-type.service';

@Component({
  selector: 'app-list-contract-type',
  templateUrl: './list-contract-type.component.html',
  styleUrls: ['./list-contract-type.component.scss']
})
export class ListContractTypeComponent implements OnInit, OnDestroy {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public formGroup: FormGroup;
  public predicate: PredicateFormat;
  public isModal = false;
  public contractType: ContractType;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowContractTypePermission: boolean;
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
      field: ContractTypeConstant.CODE,
      title: ContractTypeConstant.CODE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: ContractTypeConstant.LABEL,
      title: ContractTypeConstant.LABEL_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: ContractTypeConstant.MIN_NOTICE_PERIOD,
      title: ContractTypeConstant.MIN_NOTICE_PERIOD_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: ContractTypeConstant.MAX_NOTICE_PERIOD,
      title: ContractTypeConstant.MAX_NOTICE_PERIOD_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  private editedRowIndex: number;
  private editedRow: ContractType;
  private id: number;
  private subscriptions: Subscription[] = [];

  constructor(public contractTypeService: ContractTypeService, private validationService: ValidationService
    , private swalWarrings: SwalWarring, private router: Router,
              private authService: AuthService) {
  }

  get MinNoticePeriod(): FormControl {
    return this.formGroup.get(ContractTypeConstant.MIN_NOTICE_PERIOD) as FormControl;
  }

  get MaxNoticePeriod(): FormControl {
    return this.formGroup.get(ContractTypeConstant.MAX_NOTICE_PERIOD) as FormControl;
  }

  public initializeState(): DataSourceRequestState {
    return {
      skip: NumberConstant.ZERO,
      take: NumberConstant.TEN,
      filter: { // Initial filter descriptor
        logic: 'and',
        filters: []
      },
    };
  }

  dialogInit(options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_CONTRACTTYPE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_CONTRACTTYPE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_CONTRACTTYPE);
    this.hasShowContractTypePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_CONTRACTTYPE);
    this.initGridDataSource();
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.subscriptions.push(this.contractTypeService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
          this.gridSettings.gridData = data;
        }
      ));
  }

  public addHandler({sender}) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Code: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED), isAlphabetical()],
        asyncValidators: unique(SharedConstant.CODE, this.contractTypeService, String(NumberConstant.ZERO)), updateOn: 'change'
      }),
      Label: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)],
        asyncValidators: unique(SharedConstant.LABEL, this.contractTypeService, String(NumberConstant.ZERO)), updateOn: 'change'
      }),
      MinNoticePeriod: new FormControl(NumberConstant.ZERO, {
        validators: [Validators.required, Validators.min(NumberConstant.ZERO)],
        updateOn: 'blur'
      }),
      MaxNoticePeriod: new FormControl(NumberConstant.ZERO, {validators: Validators.required, updateOn: 'blur'})
    });
    this.MaxNoticePeriod.setValidators([
      Validators.required,
      greaterOrEqualThan(new Observable(o => o.next(this.MinNoticePeriod.value)))
    ]);
    this.MinNoticePeriod.setValidators([
      Validators.required,
      lowerOrEqualThan(new Observable(o => o.next(this.MaxNoticePeriod.value)))
    ]);
    sender.addRow(this.formGroup);
  }

  /**
   *
   * @param param0
   */
  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  /**
   *
   * @param param
   */
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.contractTypeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   *
   * @param param
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      let contractType: ContractType;
      if (this.editedRow) {
        Object.assign(this.editedRow, formGroup.getRawValue());
        contractType = this.editedRow;
      } else {
        contractType = formGroup.getRawValue();
      }
      this.subscriptions.push(this.contractTypeService.save(contractType, isNew).subscribe(() => {
        this.gridSettings.state = this.initializeState();
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
      Code: new FormControl(dataItem.Code, {
        validators: [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED),
          isAlphabetical()],
        asyncValidators: unique(SharedConstant.CODE, this.contractTypeService, String(dataItem.Id)), updateOn: 'change'
      }),
      Label: new FormControl(dataItem.Label, {
        validators: [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)],
        asyncValidators: unique(SharedConstant.LABEL, this.contractTypeService, String(dataItem.Id)), updateOn: 'change'
      }),
      MinNoticePeriod: new FormControl(dataItem.MinNoticePeriod, {
        validators: [Validators.required, Validators.min(NumberConstant.ZERO)],
        updateOn: 'blur'
      }),
      MaxNoticePeriod: new FormControl(dataItem.MaxNoticePeriod, {validators: Validators.required, updateOn: 'blur'})
    });
    this.MaxNoticePeriod.setValidators([
      Validators.required,
      greaterOrEqualThan(new Observable(o => o.next(this.MinNoticePeriod.value)))
    ]);
    this.MinNoticePeriod.setValidators([
      Validators.required,
      lowerOrEqualThan(new Observable(o => o.next(this.MaxNoticePeriod.value)))
    ]);
    this.editedRowIndex = rowIndex;
    this.editedRow = dataItem;
    sender.editRow(rowIndex, this.formGroup);
  }

  public goToAddContractType() {
    this.router.navigateByUrl(ContractTypeConstant.ADD_URL);
  }

  public goToAdvancedEdit(id) {
    this.router.navigateByUrl(ContractTypeConstant.URL_CONTRACT_EDIT.concat(id));
  }

  // Update max notice period vaidators when min notice period has changed
  updateMaxNoticePeriodValidity() {
    this.MaxNoticePeriod.updateValueAndValidity();
  }

  // Update min notice period vaidators when max notice period has changed
  updateMinNoticePeriodValidity() {
    this.MinNoticePeriod.updateValueAndValidity();
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

  /**
   * Close the editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.editedRow = undefined;
    this.formGroup = undefined;
  }

}
