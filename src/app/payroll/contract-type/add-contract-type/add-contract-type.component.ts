import { Component, OnInit, ComponentRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ContractType } from '../../../models/payroll/contract-type.model';
import { ContractTypeService } from '../../services/contract-type/contract-type.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ValidationService,
  unique,
  greaterOrEqualThan,
  lowerOrEqualThan,
  isAlphabetical } from '../../../shared/services/validation/validation.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ContractTypeConstant } from '../../../constant/payroll/contract-type.constant';
import { Observable } from 'rxjs/Observable';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subscription } from 'rxjs/Subscription';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';


const SEPARATOR = '/';

@Component({
  selector: 'app-add-contract-type',
  templateUrl: './add-contract-type.component.html',
  styleUrls: ['./add-contract-type.component.scss']
})
export class AddContractTypeComponent implements OnInit, OnDestroy {
  ContractTypeFormGroup: FormGroup;
  public isUpdateMode: boolean;
  public contractType: ContractType;
  public Min = 0;
  public Max: number;
  public hasAddContractTypePermission = false;
  public hasUpdateContractTypePermission = false;
  public checkboxTouched = false;
  /*
   * If modal=true
   */
  public isModal: boolean;
  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  private id: number;
  private isSaveOperation = false;
  private subscriptions: Subscription[] = [];
  
  constructor(private router: Router,
    private contractTypeService: ContractTypeService, private fb: FormBuilder, private authService: AuthService,
    private validationService: ValidationService, private activatedRoute: ActivatedRoute, private styleConfigService: StyleConfigService) {
      this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || NumberConstant.ZERO;
    }));
  }

  get Id(): FormControl {
    return this.ContractTypeFormGroup.get(SharedConstant.ID) as FormControl;
  }

  get Code(): FormControl {
    return this.ContractTypeFormGroup.get(ContractTypeConstant.CODE) as FormControl;
  }

  get Label(): FormControl {
    return this.ContractTypeFormGroup.get(ContractTypeConstant.LABEL) as FormControl;
  }

  get MinNoticePeriod(): FormControl {
    return this.ContractTypeFormGroup.get(ContractTypeConstant.MIN_NOTICE_PERIOD) as FormControl;
  }

  get MaxNoticePeriod(): FormControl {
    return this.ContractTypeFormGroup.get(ContractTypeConstant.MAX_NOTICE_PERIOD) as FormControl;
  }

  get Description(): FormControl {
    return this.ContractTypeFormGroup.get(ContractTypeConstant.DESCRIPTION) as FormControl;
  }

  get CalendarNoticeDays(): FormControl {
    return this.ContractTypeFormGroup.get(ContractTypeConstant.CALENDER_NOTICE_DAY) as FormControl;
  }

  get HasEndDate(): FormControl {
    return this.ContractTypeFormGroup.get(ContractTypeConstant.HAS_END_DATE) as FormControl;
  }

  ngOnInit() {
    this.hasAddContractTypePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_CONTRACTTYPE);
    this.hasUpdateContractTypePermission =
    this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_CONTRACTTYPE);
    this.createContractTypeForm();
    this.isUpdateMode = !this.isModal && this.id > NumberConstant.ZERO ? true : false;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
    if (this.contractType) {
      this.isUpdateMode = true;
    } else {
      this.isUpdateMode = false;
    }
  }

  /**
   * save form method
   */
  save() {
    if (this.ContractTypeFormGroup.valid) {
      this.isSaveOperation = true;
      const contractTypeAssign: ContractType = Object.assign({}, this.contractType, this.ContractTypeFormGroup.value);
      this.subscriptions.push(this.contractTypeService.save(contractTypeAssign, (!this.isUpdateMode || this.isModal)).subscribe(() => {
        if (!this.isModal) {
          this.router.navigateByUrl(ContractTypeConstant.LIST_URL);
        } else {
          this.dialogOptions.onClose();
          this.dialogOptions.closeDialogSubject.next();
        }
      }));
    } else {
      this.validationService.validateAllFormFields(this.ContractTypeFormGroup);
    }


  }

  public getDataToUpdate() {
    this.subscriptions.push(this.contractTypeService.getById(this.id).subscribe((data) => {
      this.contractType = data;
      if (this.contractType) {
        this.ContractTypeFormGroup.patchValue(data);
      }
      if (!this.hasUpdateContractTypePermission) {
        this.ContractTypeFormGroup.disable();
      }
    }));
  }

  backToList() {
    this.router.navigateByUrl(ContractTypeConstant.LIST_URL);
  }

  onMinNoticePeriodChange(max: number) {
    this.Max = max;
  }

  onMaxNoticePeriodChange(min: number) {
    this.Min = min;
  }

  /***
   * Check if checkbox touched
   */
  toggleEditable() {
    this.checkboxTouched = true;
  }

  isFormChanged(): boolean {
    return this.ContractTypeFormGroup.touched || this.checkboxTouched;
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
  /**
   *
   * @param contractType
   */
  private createContractTypeForm(contractType?: ContractType): void {
    this.ContractTypeFormGroup = this.fb.group({
      Id: [contractType ? contractType.Id : 0],
      Code: [contractType ? contractType.Code : undefined,
        { validators: [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED), isAlphabetical()], asyncValidators:
          unique(SharedConstant.CODE, this.contractTypeService, String(this.id)),
        updateOn: 'blur'
      }],
      Label: [contractType ? contractType.Label : undefined,
        [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)],
        unique(SharedConstant.LABEL, this.contractTypeService, String(this.id))],
      MinNoticePeriod: [contractType ? contractType.MinNoticePeriod : '',
        [Validators.required, Validators.min(NumberConstant.ZERO)]],
      MaxNoticePeriod: [contractType ? contractType.MaxNoticePeriod : ''],
      Description: [contractType ? contractType.Description : undefined],
      CalendarNoticeDays: [contractType ? contractType.CalendarNoticeDays : false],
      HasEndDate: [contractType ? contractType.HasEndDate : false],
    });
    this.MaxNoticePeriod.setValidators([
      Validators.required,
      greaterOrEqualThan(new Observable(o => o.next(this.MinNoticePeriod.value))), Validators.pattern('([1-9]?[0-9]?)+(\,[0-9][0-9]?)?')]);
    this.MinNoticePeriod.setValidators([
      Validators.required,
      lowerOrEqualThan(new Observable(o => o.next(this.MaxNoticePeriod.value))), Validators.pattern('([1-9]?[0-9]?)+(\,[0-9][0-9]?)?')]);
  }
}
