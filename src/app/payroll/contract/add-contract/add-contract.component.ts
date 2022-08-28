import { DatePipe } from '@angular/common';
import { AfterViewChecked, Component, ComponentRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { CompanyService } from '../../../administration/services/company/company.service';
import { BonusConstant } from '../../../constant/payroll/bonus.constant';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { SalaryStructureConstant } from '../../../constant/payroll/salary-structure.constant';
import { OfferConstant } from '../../../constant/rh/offer.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ContractStateEnumerator } from '../../../models/enumerators/contractStateEnumerator.model';
import { WrongPayslipActionEnumerator } from '../../../models/enumerators/wrong-payslip-action.enum';
import { BaseSalary } from '../../../models/payroll/base-salary.model';
import { ContractAdvantage } from '../../../models/payroll/contract-advantage.model';
import { ContractBenefitInKind } from '../../../models/payroll/contract-benefit-in-kind.model';
import { ContractBonus } from '../../../models/payroll/contract-bonus.model';
import { ContractType } from '../../../models/payroll/contract-type.model';
import { Contract } from '../../../models/payroll/contract.model';
import { Payslip } from '../../../models/payroll/payslip.model';
import { SalaryStructure } from '../../../models/payroll/salary-structure.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { Resource } from '../../../models/shared/ressource.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { WrongPayslipListComponent } from '../../../shared/components/wrong-payslip-list/wrong-payslip-list.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { UtilityService } from '../../../shared/services/utility/utility.service';
import { dateValueGT, dateValueLT, digitsAfterComma, ValidationService } from '../../../shared/services/validation/validation.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { PayslipPreviewComponent } from '../../components/payslip-preview/payslip-preview.component';
import { ContractService } from '../../services/contract/contract.service';
import { PayslipService } from '../../services/payslip/payslip.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
const SEPARATOR = '/';


@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss']
})
export class AddContractComponent implements OnInit, OnDestroy, IModalDialog, AfterViewChecked {
  @Input() employeeContractToUpdate: Contract;
  @Input() service: ResourceService<Resource>;
  @Input() employeeIsDisabled: boolean;
  @Input() uuid = '';
  @Input() viewReference;
  @Output() selectedValue = new EventEmitter<any>();
  contractType: ContractType;
  salaryStructure: SalaryStructure;
  public degitsAfterComma: number;

  private isSaveOperation = false;
  /**
   * Is true if form must be disable
   */
  public isDisabled = false;
  contractFormGroup: FormGroup;
  salaryFormGroup: FormGroup;
  bonusFormGroup: FormGroup;
  benefitInKindFormGroup: FormGroup;
  otherAdvantagesFormGroup: FormGroup;  
  /**
   * formatDate
   * */
   public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  /*
 * form controle
 */
  @Input() control: FormControl;
  /*
   * is updateMode
   */
  public isUpdateMode = false;
  public isEmployeeUpdateMode = false;
  /**
   * If modal=true
   */
  public isModal = false;
  /*
   * Tiers to update
   */
  public contractToUpdate: Contract;
  /**
   * The current date
   */
  private currentDate = new Date();
  public isRequired: boolean;
  private id: number;
  contractStateEnumerator = ContractStateEnumerator;
  public hasPayslipPreviewEmployeePermission = false;
  public check: boolean;
  /*
   * dialog subject
   */
  options: Partial<IModalDialogOptions<Contract>>;
  reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;
  public dataModal: any;

  public contractFileToUpload: Array<FileInfo>;
  public hasUpdateContractPermission = false;
  public hasAddContractPermission = false;
  public hasShowEmployeePermission = false;
  public hasShowBaseSalaryPermission = false;
  public hasShowContractBonusPermission = false;
  public hasShowContractBenefitInKindPermission = false;
  public hasShowOtherAdvantagePermission = false;
  mealVoucherShow = false;
  commissionShow = false;
  commissionTypeValue: number;
  // Id of clicked checkbox
  lastValue = '';
  public actionEnum = WrongPayslipActionEnumerator;
  hasEndDate: boolean;
  public isTouched = true;
  private subscriptions: Subscription[] = [];
  preview = false;

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.dataModal = options.data ? options.data.Date : new Date();
    this.closeDialogSubject = options.closeDialogSubject;
    this.contractFileToUpload = new Array<FileInfo>();
  }

  constructor(public contractService: ContractService,
              private payslipService: PayslipService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder, private router: Router,
              private swalWarrings: SwalWarring,
              private viewRef: ViewContainerRef,
              private formModalDialogService: FormModalDialogService,
              private modalService: ModalDialogInstanceService,
              private validationService: ValidationService,
              private utilityService: UtilityService,
              public authService: AuthService,
              private datePipe: DatePipe, public translate: TranslateService,
      private companyService: CompanyService,
      private localStorageService: LocalStorageService  ) {
    this.contractFileToUpload = new Array<FileInfo>();
    const url = this.router.url.split(SEPARATOR);
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    }));
    this.isEmployeeUpdateMode = url[NumberConstant.THREE] === 'employee';
  }

  ngOnInit() {
    this.isUpdateMode = this.isModal ? false :
      (this.isEmployeeUpdateMode ? this.employeeContractToUpdate.Id !== NumberConstant.ZERO : (this.id > 0 ? true : false));
    this.selectedValue.emit(this.employeeContractToUpdate);
    this.hasAddContractPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_CONTRACT);
    this.hasUpdateContractPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_CONTRACT);
    this.hasShowBaseSalaryPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_BASESALARY);
    this.hasShowContractBonusPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_CONTRACTBONUS);
    this.hasShowContractBenefitInKindPermission =
      this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_CONTRACTBENEFITINKIND);
    this.hasShowOtherAdvantagePermission =
      this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_CONTRACTOTHER_ADVANTAGES);
    this.hasPayslipPreviewEmployeePermission =
      this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.PAYSLIP_PREVIEW_EMPLOYEE);
    this.hasShowEmployeePermission =
    this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_EMPLOYEE);
    this.companyService.getDefaultCurrencyDetails().subscribe(currency => {
      this.degitsAfterComma = currency.Precision;
      this.contractToUpdate = new Contract();
      if (this.isEmployeeUpdateMode) {
        if (this.employeeContractToUpdate) {
          this.contractFileToUpload = this.employeeContractToUpdate.ContractFileInfo;
          this.setMealVoucherAndCommissionInUpdateMode(this.employeeContractToUpdate);
        }
        this.createAddForm(this.employeeContractToUpdate);
        this.setAdvantagesOfTheCurrentContract(this.employeeContractToUpdate);
        this.isDisabled = (this.isUpdateMode && !this.hasUpdateContractPermission) ||
        (this.employeeContractToUpdate && this.employeeContractToUpdate.State === this.contractStateEnumerator.Done) ||
        this.employeeIsDisabled;
        if (this.isDisabled) {
          this.disableFormGroups();
        }
      } else {
        if (this.isUpdateMode) {
        this.getDataToUpdate();
        } else {
          this.createAddForm();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  setMealVoucherAndCommissionInUpdateMode(contract: Contract) {
    if (contract.MealVoucher) {
      this.mealVoucherShow = true;
    }
    if (contract.CommissionType === NumberConstant.ONE) {
      this.commissionShow = true;
      this.commissionTypeValue = NumberConstant.ONE;
    }
    if (contract.CommissionType === NumberConstant.TWO) {
      this.commissionShow = true;
      this.commissionTypeValue = NumberConstant.TWO;
    }
  }

  disableFormGroups() {
    this.contractFormGroup.disable();
    this.salaryFormGroup.disable();
    this.bonusFormGroup.disable();
    this.benefitInKindFormGroup.disable();
    this.otherAdvantagesFormGroup.disable();
  }

  prepareDigitAfteComm(): void {
    this.degitsAfterComma = this.localStorageService.getCurrencyPrecision();
  }

  private getDataToUpdate() {
    this.subscriptions.push(this.contractService.getById(this.id).subscribe((data) => {
      this.contractToUpdate = data;
      if (this.contractToUpdate.ContractFileInfo) {
        this.contractFileToUpload = this.contractToUpdate.ContractFileInfo;
      } else {
        this.contractFileToUpload = new Array<FileInfo>();
      }
      this.isDisabled = !this.hasUpdateContractPermission || this.contractToUpdate.State === this.contractStateEnumerator.Done;
      this.setMealVoucherAndCommissionInUpdateMode(this.contractToUpdate);
      if (this.contractToUpdate != null) {
        this.createAddForm(this.contractToUpdate);
        this.setAdvantagesOfTheCurrentContract(this.contractToUpdate);
        if (this.isDisabled) {
          this.disableFormGroups();
        }
      }
    }));
  }
  /**
   * Function call if the commisionType dropdown change
   * @param $event
   */
  commisionTypeChange($event: number) {
    this.commissionTypeValue = $event;
  }

  private createAddForm(contractToUpdate?: Contract): void {
    let contractBonusStartDateGTObservable = Observable.of(undefined);
    if (contractToUpdate != null && contractToUpdate.IdSalaryStructureNavigation) {
      contractBonusStartDateGTObservable = Observable.of(contractToUpdate.IdSalaryStructureNavigation.StartDate);
    }
    this.contractFormGroup = this.fb.group({
      Id: [contractToUpdate ? contractToUpdate.Id : NumberConstant.ZERO],
      IdEmployee: [{
        value: contractToUpdate ?
          contractToUpdate.IdEmployee : this.isModal ? NumberConstant.ZERO : undefined, disabled: this.isUpdateMode
      }, [Validators.required]],
      ContractReference: [contractToUpdate ? contractToUpdate.ContractReference : ''],
      StartDate: [contractToUpdate ? new Date(contractToUpdate.StartDate)
        : (this.dataModal && this.isModal) ? new Date(this.dataModal) : this.currentDate,
        [Validators.required, dateValueGT(contractBonusStartDateGTObservable)]],
      EndDate: [contractToUpdate && contractToUpdate.EndDate ? new Date(contractToUpdate.EndDate) : ''],
      WorkingTime: [contractToUpdate ? contractToUpdate.WorkingTime : '',
        [Validators.min(NumberConstant.ZERO), Validators.max(NumberConstant.SIXTY)]],
      IdSalaryStructure: [contractToUpdate ? contractToUpdate.IdSalaryStructure : '', [Validators.required]],
      IdCnss: [contractToUpdate ? contractToUpdate.IdCnss : '', [Validators.required]],
      IsDeleted: [false],
      ContractFileInfo: [contractToUpdate ? contractToUpdate.ContractFileInfo : new Array<FileInfo>()],
      IdContractType: [contractToUpdate ? contractToUpdate.IdContractType : '', [Validators.required]],
      State: [contractToUpdate ? contractToUpdate.State : NumberConstant.ONE],
      SalaryStructureMinStartDate: [contractToUpdate && contractToUpdate.IdSalaryStructureNavigation ?
        contractToUpdate.IdSalaryStructureNavigation.StartDate : undefined],
    });
    if (contractToUpdate && contractToUpdate.IdContractTypeNavigation && contractToUpdate.IdContractTypeNavigation.HasEndDate) {
      this.EndDate.setValidators([
        Validators.required,
        dateValueGT(new Observable(o => o.next(this.StartDate.value)))]);
      this.validationService.validateAllFormFields(this.contractFormGroup);
      this.isRequired = true;

    } else {
      this.EndDate.setValidators([
        dateValueGT(new Observable(o => o.next(this.StartDate.value)))]);
      this.isRequired = false;
    }
    this.salaryFormGroup = this.fb.group({
      BaseSalary: this.fb.array([])
    });
    this.bonusFormGroup = this.fb.group({
      ContractBonus: this.fb.array([])
    });
    this.benefitInKindFormGroup = this.fb.group({
      ContractBenefitInKind: this.fb.array([])
    });
    this.buildOtherAdvantagesFormGroup(contractToUpdate);
    this.addDependentDateControls();
    if (contractToUpdate) {
      if (contractToUpdate.BaseSalary) {
        contractToUpdate.BaseSalary.forEach((x) => {
          (this.salaryFormGroup.controls[ContractConstant.BASE_SALARY] as FormArray).push(this.buildBaseSalaryValidityForm(x));
        });
      }
      if (contractToUpdate.ContractBonus) {
        contractToUpdate.ContractBonus.forEach((x) => {
          (this.bonusFormGroup.controls[EmployeeConstant.CONTRACT_BONUS] as FormArray).push(this.buildContractBonusValidityForm(x));
        });
      }
      if (contractToUpdate.ContractBenefitInKind) {
        contractToUpdate.ContractBenefitInKind.forEach((x) => {
          (this.benefitInKindFormGroup.controls[ContractConstant.CONTRACT_BENEFIT_IN_KIND] as FormArray)
            .push(this.buildContractBenefitInKindForm(x));
        });
      }
    }
    if (contractToUpdate == null) {
      this.BaseSalary.push(this.buildBaseSalaryValidityForm());
    }
  }

  public buildOtherAdvantagesFormGroup(contractToUpdate?: Contract) {
    this.otherAdvantagesFormGroup = this.fb.group({
      ThirteenthMonthBonus: [contractToUpdate && contractToUpdate.ThirteenthMonthBonus ? contractToUpdate.ThirteenthMonthBonus : ''],
      AvailableMealVoucher: [contractToUpdate && contractToUpdate.MealVoucher ? true : ''],
      MealVoucher: [contractToUpdate && contractToUpdate.MealVoucher ? contractToUpdate.MealVoucher : '',
        this.validationService.conditionalValidator((() => this.mealVoucherShow),
          Validators.compose([
            Validators.required,
            Validators.min(NumberConstant.ONE)
          ])
        )],
      AvailableCar: [contractToUpdate && contractToUpdate.AvailableCar ? contractToUpdate.AvailableCar : ''],
      AvailableHouse: [contractToUpdate && contractToUpdate.AvailableHouse ? contractToUpdate.AvailableHouse : ''],
      Commission: [contractToUpdate && contractToUpdate.CommissionType ? true : ''],
      CommissionType: [contractToUpdate && contractToUpdate.CommissionType ? contractToUpdate.CommissionType : '',
        this.validationService.conditionalValidator((() => this.commissionShow), Validators.required)],
      CommissionValue: [contractToUpdate && contractToUpdate.CommissionValue ? contractToUpdate.CommissionValue : '',
        this.validationService.conditionalValidator((() => this.commissionShow),
          Validators.compose([
            Validators.required,
            Validators.min(NumberConstant.ONE)
          ])
        )],
      ContractAdvantage: this.fb.array([])
    });
  }

  /**
   * Function call if the mealVoucher checkedbox change
   * @param $event
   */
  mealVoucherSelectedFunction($event) {
    this.mealVoucherShow = $event.target.checked;
    if (!this.mealVoucherShow) {
      this.MealVoucher.patchValue('');
    }
  }

  get AvailableMealVoucher(): FormControl {
    return this.otherAdvantagesFormGroup.get(OfferConstant.AVAILABLE_MEAL_VOUCHER) as FormControl;
  }

  get MealVoucher(): FormControl {
    return this.otherAdvantagesFormGroup.get(OfferConstant.MEAL_VOUCHER_VALUE) as FormControl;
  }

  /**
   * Function call if the commission checkedbox change
   * @param $event
   */
  commissionSelectedFunction($event) {
    this.commissionShow = $event.target.checked;
    if (!this.commissionShow) {
      this.CommissionType.patchValue('');
      this.CommissionValue.patchValue('');
    }
  }

  get Commission(): FormControl {
    return this.otherAdvantagesFormGroup.get(OfferConstant.COMMISSION) as FormControl;
  }
  get CommissionType(): FormControl {
    return this.otherAdvantagesFormGroup.get(OfferConstant.COMMISSION_TYPE) as FormControl;
  }
  get CommissionValue(): FormControl {
    return this.otherAdvantagesFormGroup.get(OfferConstant.COMMISSION_VALUE) as FormControl;
  }

  /**
   * Add the formArray for other advantages
   */
  addOtherAdvantages() {
    this.ContractAdvantage.push(this.buildAdvantagesForm());
  }

  get ContractAdvantage(): FormArray {
    return this.otherAdvantagesFormGroup.get(ContractConstant.CONTRACT_ADVANTAGE) as FormArray;
  }

  /**
   * Build formArray for other addvantages
   * @param advantages
   */
  public buildAdvantagesForm(advantages?: ContractAdvantage): FormGroup {
    return this.fb.group({
      Id: [advantages ? advantages.Id : NumberConstant.ZERO],
      Description: [advantages ? advantages.Description : '', [Validators.required]],
      IdContract: [advantages ? advantages.IdContract : NumberConstant.ZERO],
      IsDeleted: [false]
    });
  }

  /**
   * Show advantages wich is not delected
   * @param index
   */
  isOtherAdvantabesRowVisible(index: number): boolean {
    return !this.ContractAdvantage.at(index).get(SharedConstant.IS_DELETED).value;
  }

  deleteOtherAdvantages(index: number) {
    if (this.ContractAdvantage.at(index).get(SharedConstant.ID).value === NumberConstant.ZERO) {
      this.ContractAdvantage.removeAt(index);
    } else {
      this.ContractAdvantage.at(index).get(SharedConstant.IS_DELETED).setValue(true);
      this.ContractAdvantage.at(index).get(OfferConstant.DESCRIPTION).clearValidators();
      this.ContractAdvantage.at(index).get(OfferConstant.DESCRIPTION).updateValueAndValidity();
    }
  }

  /**
   * Method call in update mode to show other advantages
   * @param offer
   */
  public setAdvantagesOfTheCurrentContract(contract?: Contract) {
    if (contract && contract.ContractAdvantage) {
      contract.ContractAdvantage.forEach(advantage => {
        this.ContractAdvantage.push(this.buildAdvantagesForm(advantage));
      });
    }
  }

  public receiveDataSalaryStructure(event: SalaryStructure) {
    if (event) {
      this.SalaryStructureMinStartDate.patchValue(event.StartDate);
    } else {
      this.SalaryStructureMinStartDate.setValue('');
    }
    this.addDependentDateControls();
    if (this.employeeContractToUpdate) {
      this.employeeContractToUpdate.IdSalaryStructure = this.IdSalaryStructure.value;
      this.employeeContractToUpdate.IdSalaryStructureNavigation = event;
      this.selectedValue.emit(this.employeeContractToUpdate);
    } else {
      this.salaryStructure = event;
    }
  }

  selectedContractType(event: ContractType) {
    if (this.employeeContractToUpdate) {
      this.employeeContractToUpdate.IdContractType = this.IdContractType.value;
      this.employeeContractToUpdate.IdContractTypeNavigation = event;
      this.selectedValue.emit(this.employeeContractToUpdate);
    } else {
      this.contractType = event;
    }
  }
  /**
   * update StartDate Validity
   * @param x
   */
  public updateStartDateValidity(x?: any) {
    this.StartDate.updateValueAndValidity();
    if (this.employeeContractToUpdate) {
      this.employeeContractToUpdate.EndDate = this.EndDate.value;
      this.employeeContractToUpdate.StartDate = this.StartDate.value;
      this.selectedValue.emit(this.employeeContractToUpdate);
    }
  }
  /**
   * update EndDate Validity
   * @param x
   */
  public updateEndDateValidity(x?: any) {
    this.EndDate.updateValueAndValidity();
  }
  /**
   * add Aquisition date & service date
   * */
  private addDependentDateControls(): void {
    const contractBonusStartDateGTObservable = Observable.of(this.utilityService.maxDateBetweendates(
      this.SalaryStructureMinStartDate ?
        [this.dataModal, this.SalaryStructureMinStartDate.value] :
        [this.dataModal]));
    this.StartDate.setValidators([
      Validators.required,
      dateValueLT(new Observable(o => o.next(this.EndDate.value))),
      dateValueGT(contractBonusStartDateGTObservable),
    ]);

    this.updateStartDateValidity();

  }
  buildContractFromContractFormGroup(): Contract {
    if ((this.contractFormGroup.get(ContractConstant.STATE).value === this.contractStateEnumerator.Done)
      || ((this.contractFormGroup.valid || this.contractFormGroup.disabled)
        && (this.salaryFormGroup.valid || this.salaryFormGroup.disabled)
        && (this.bonusFormGroup.valid || this.bonusFormGroup.disabled)
        && (this.benefitInKindFormGroup.valid || this.benefitInKindFormGroup.disabled)
        && this.otherAdvantagesFormGroup.valid || this.otherAdvantagesFormGroup.disabled)) {
      let obj: Contract = Object.assign({}, new Contract(), this.contractFormGroup.getRawValue());
      obj.ContractFileInfo = this.contractFileToUpload;
      obj = Object.assign(obj, this.salaryFormGroup.getRawValue());
      obj = Object.assign(obj, this.bonusFormGroup.getRawValue());
      obj = Object.assign(obj, this.benefitInKindFormGroup.getRawValue());
      obj = Object.assign(obj, this.otherAdvantagesFormGroup.getRawValue());
      return obj;
    } else {
      this.ValidateFormGroup();
    }
  }
  contractFormGroupValidity(): boolean {
    if (this.contractFormGroup.get(ContractConstant.STATE).value === this.contractStateEnumerator.Done) {
      return true;
    }
    return (this.contractFormGroup.valid || this.contractFormGroup.disabled)
      && (this.salaryFormGroup.valid || this.salaryFormGroup.disabled)
      && (this.bonusFormGroup.valid || this.bonusFormGroup.disabled)
      && (this.benefitInKindFormGroup.valid || this.benefitInKindFormGroup.disabled)
      && this.otherAdvantagesFormGroup.valid || this.otherAdvantagesFormGroup.disabled;
  }
  ValidateFormGroup() {
    this.validationService.validateAllFormFields(this.contractFormGroup);
    this.validationService.validateAllFormFields(this.salaryFormGroup);
    this.validationService.validateAllFormFields(this.bonusFormGroup);
    this.validationService.validateAllFormFields(this.benefitInKindFormGroup);
    this.validationService.validateAllFormFields(this.otherAdvantagesFormGroup);
  }
  /**
   * Save contract
   * */
  save(preview?: boolean) {
    this.bonusFormGroup.updateValueAndValidity();
    if (this.isModal && (this.contractFormGroup.valid || this.contractFormGroup.disabled) &&
      (this.salaryFormGroup.valid || this.salaryFormGroup.disabled) && (this.bonusFormGroup.valid || this.bonusFormGroup.disabled)
      && this.benefitInKindFormGroup.valid && this.otherAdvantagesFormGroup.valid) {
      this.sentContractFormToEmployee();
    } else if ((this.contractFormGroup.valid || this.contractFormGroup.disabled)
      && (this.salaryFormGroup.valid || this.salaryFormGroup.disabled)
      && (this.bonusFormGroup.valid || this.bonusFormGroup.disabled)
      && (this.benefitInKindFormGroup.valid || this.benefitInKindFormGroup.disabled)
      && (this.otherAdvantagesFormGroup.valid || this.otherAdvantagesFormGroup.disabled)) {
      if (this.EndDate.value && ((this.bonusFormGroup.value.ContractBonus &&
        this.bonusFormGroup.value.ContractBonus.filter(x => !x.ValidityEndDate).length > NumberConstant.ZERO)
        || (this.benefitInKindFormGroup.value.ContractBenefitInKind &&
          this.benefitInKindFormGroup.value.ContractBenefitInKind.filter(x => !x.ValidityEndDate).length > NumberConstant.ZERO))) {
        this.swalWarrings.CreateSwal(ContractConstant.BONUS_OR_BENEFITS_IN_KIND_WITH_NO_END_DATE, SharedConstant.WARNING_TITLE,
          EmployeeConstant.YES, EmployeeConstant.NO).then((result) => {
          if (result.value) {
            this.saveContract(preview);
          }
        });
      } else {
        this.saveContract(preview);
      }
    } else {
      this.ValidateFormGroup();
    }
  }

  saveContract(preview?: boolean) {
    this.preview = preview;
    this.contractFormGroup.controls[ContractConstant.CONTRACT_FILE_INFO] =
      new FormControl(this.contractFileToUpload);
    this.contractFormGroup.updateValueAndValidity();
    if (preview) {
      this.checkContractDataChangesForPreview(this.buildContractFromContractFormGroup());
    } else {
      this.contractToUpdate = this.buildContractFromContractFormGroup();
      this.subscriptions.push(
        this.contractService.checkBeforeUpdateIfContractsHaveAnyPayslipOrTimesheet([this.contractToUpdate], true).subscribe(res => {
        if (res.model.Payslip.length > NumberConstant.ZERO || res.model.TimeSheet.length > NumberConstant.ZERO) {
          this.formModalDialogService.openDialog(ContractConstant.WRONG_ENTITIES, WrongPayslipListComponent,
            this.viewRef, this.actionToDo.bind(this), res.model, true, SharedConstant.MODAL_DIALOG_SIZE_M);
        } else {
          this.actionToSave(this.contractToUpdate);
        }
      }));
    }
  }
  actionToDo(action) {
    switch (action) {
      case this.actionEnum.MarkPayslipToWrong:
        this.contractToUpdate.UpdatePayslipAndTimeSheets = true;
        this.actionToSave(this.contractToUpdate);
        break;
      case this.actionEnum.DoNotMarkPayslipToWrong:
        this.actionToSave(this.contractToUpdate);
        break;
      case this.actionEnum.Cancel:
        break;
    }
  }
  private actionToSave(contract: Contract) {
    this.subscriptions.push(this.contractService.save(contract, !this.isUpdateMode).subscribe(res => {
      if (this.isModal) {
        this.router.navigate([EmployeeConstant.EMPLOYEE_LIST_URL]);
      } else {
        if (this.preview) {
          this.isUpdateMode = true;
          this.id = res.Id;
          this.contractToUpdate.Id = res.Id;
          this.payslipPreview(this.contractToUpdate);
          this.ngOnInit();
        } else {
          this.router.navigate([ContractConstant.CONTRACT_LIST_URL]);
        }
      }
    }));
  }

  checkContractDataChangesForPreview(contract: Contract) {
    this.contractToUpdate = contract;
    if (this.contractFormGroup.dirty || this.salaryFormGroup.dirty || this.bonusFormGroup.dirty
      || this.benefitInKindFormGroup.dirty || this.otherAdvantagesFormGroup.dirty) {
      this.swalWarrings.CreateSwal(EmployeeConstant.EMPLOYEE_PREVIEW_ALERT,
        SharedConstant.ARE_YOU_SURE_TO_CONTINUE, EmployeeConstant.YES, EmployeeConstant.NO).then((result) => {
        if (result.value) {
          this.subscriptions.push(
            this.contractService.checkBeforeUpdateIfContractsHaveAnyPayslipOrTimesheet([this.contractToUpdate], true).subscribe(res => {
            if (res.model.Payslip.length > NumberConstant.ZERO || res.model.TimeSheet.length > NumberConstant.ZERO) {
              this.formModalDialogService.openDialog(ContractConstant.WRONG_ENTITIES, WrongPayslipListComponent,
                this.viewRef, this.actionToDo.bind(this), res.model, true, SharedConstant.MODAL_DIALOG_SIZE_M);
            } else {
              this.actionToSave(this.contractToUpdate);
            }
          }));
        }
      });
    } else {
      this.payslipPreview(contract);
    }
  }

  payslipPreview(contract: Contract) {
    if (this.contractToUpdate.IdContractTypeNavigation) {
      contract.ContractReference = this.contractToUpdate.IdContractTypeNavigation.Code + SharedConstant.BLANK_SPACE +
        SharedConstant.OPEN_PARENTHESIS +
        this.datePipe.transform(new Date(contract.StartDate), this.translate.instant(SharedConstant.DATE_FORMAT))
        + SharedConstant.DASH + (contract.EndDate ? this.datePipe.transform(new Date(contract.EndDate),
        this.translate.instant(SharedConstant.DATE_FORMAT)) : SharedConstant.EMPTY) + SharedConstant.CLOSE_PARENTHESIS;
    }
    const payslip = new Payslip();
    payslip.IdContract = this.Id.value;
    payslip.IdEmployee = this.IdEmployee.value;
    this.setPayslipMonth(payslip);
    this.subscriptions.push(this.payslipService.getPayslipPreviewInformation(payslip).subscribe(data => {
      const previewData = data;
      previewData.payslipReportLines = data.PayslipReportLinesViewModels;
      previewData.maxDays = data.NumberOfDaysWorkedByCompanyInMonth;
      this.formModalDialogService.openDialog(EmployeeConstant.PAYSLIP_PREVIEW, PayslipPreviewComponent, this.viewRef,
        null, { 'payslip': previewData, 'contracts': [contract] }, true, SharedConstant.MODAL_DIALOG_SIZE_M);
      this.isUpdateMode = true;
      this.ngOnInit();
    }));
  }

  /**
   * If the current contract is a current contract, return the preview of the current month,
   * otherwise return the preview of the month of the start of the contract
   * @param payslip
   */
  public setPayslipMonth(payslip: Payslip) {
    // First day of the current month
    const currentMonth = new Date();
    const currentMonthTime = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), NumberConstant.SHIFT_FIRST_DATE).getTime();
    const startDate = new Date(this.StartDate.value);
    const startTime = new Date(startDate.getFullYear(), startDate.getMonth(), NumberConstant.SHIFT_FIRST_DATE).getTime();
    if (this.EndDate.value) {
      const endDate = new Date(this.EndDate.value);
      const endTime = new Date(endDate.getFullYear(), endDate.getMonth() + NumberConstant.ONE, NumberConstant.SHIFT_LAST_DATE).getTime();
      if (currentMonthTime >= startTime && currentMonthTime <= endTime) {
        payslip.Month = currentMonth;
      } else {
        payslip.Month = this.StartDate.value;
      }
    } else {
      if (currentMonthTime >= startTime) {
        payslip.Month = currentMonth;
      } else {
        payslip.Month = this.StartDate.value;
      }
    }
  }

  /**
   * build Validity Form
   * @param validityPeriod
   */
  public buildBaseSalaryValidityForm(validityPeriod?: BaseSalary): FormGroup {
    const baseSalaryFormGroup = this.fb.group({
      Id: [validityPeriod ? validityPeriod.Id : NumberConstant.ZERO],
      Value: [validityPeriod ? validityPeriod.Value : undefined, [Validators.required, Validators.min(NumberConstant.ONE),
        Validators.max(NumberConstant.ONE_MILLION), digitsAfterComma(this.degitsAfterComma)]],
      StartDate: new FormControl(validityPeriod ?
        new Date(validityPeriod.StartDate) :
        this.StartDate.value && (!this.Id.value || this.currentDate.getTime() < new Date(this.StartDate.value).getTime()) ?
          new Date(this.StartDate.value) : this.currentDate, [Validators.required]),
      IsDeleted: [false],
      IdContract: [validityPeriod && validityPeriod.IdContract ? validityPeriod.IdContract : NumberConstant.ZERO],
      State: [validityPeriod ? validityPeriod.State != null ? validityPeriod.State : NumberConstant.ONE : NumberConstant.ONE],
    });
    baseSalaryFormGroup.controls[ContractConstant.START_DATE].setValidators([
      Validators.required,
      dateValueGT(new Observable(o => o.next(this.StartDate.value))),
      dateValueLT(new Observable(o => o.next(this.EndDate.value)))
    ]);
    return baseSalaryFormGroup;
  }

  /**
   * build Validity Form
   * @param validityPeriod
   */
  public buildContractBonusValidityForm(validityPeriod?: ContractBonus): FormGroup {
    const contractBonusFormGroup = this.fb.group({
      Id: [validityPeriod ? validityPeriod.Id : NumberConstant.ZERO],
      IdBonus: [validityPeriod ? validityPeriod.IdBonus : undefined, [Validators.required]],
      Value: [validityPeriod ? validityPeriod.Value : undefined, [Validators.min(NumberConstant.ZERO),
        Validators.max(NumberConstant.ONE_MILLION), digitsAfterComma(this.degitsAfterComma)]],
      ValidityStartDate: [validityPeriod ?
        new Date(validityPeriod.ValidityStartDate) :
        (!this.Id.value || this.currentDate.getTime() < new Date(this.StartDate.value).getTime()) ?
          new Date(this.StartDate.value) : this.currentDate, [Validators.required]],
      ValidityEndDate: [validityPeriod && validityPeriod.ValidityEndDate ?
        new Date(validityPeriod.ValidityEndDate) : undefined],
      IsDeleted: [false],
      State: [validityPeriod ? validityPeriod.State != null ? validityPeriod.State : NumberConstant.ONE : NumberConstant.ONE],
      IdContract: [validityPeriod && validityPeriod.IdContract ? validityPeriod.IdContract : NumberConstant.ZERO],
      BonusMinStartDate: [validityPeriod && validityPeriod.IdBonusNavigation ? validityPeriod.IdBonusNavigation.StartDate : undefined]
    });
    this.buildContractBonusValidators(contractBonusFormGroup);
    return contractBonusFormGroup;
  }

  /**
   * For buil contract bonus added validators
   * @param contractBonusFormGroup
   */
  private buildContractBonusValidators(contractBonusFormGroup: FormGroup) {
    contractBonusFormGroup.controls[BonusConstant.VALIDITY_START_DATE].setValidators([
      Validators.required,
      dateValueLT(Observable.of(this.utilityService.minDateBetweendates([this.EndDate.value,
      contractBonusFormGroup.controls[BonusConstant.VALIDITY_END_DATE].value]))),
      dateValueGT(Observable.of(new Date(this.StartDate.value))),
    ]);
    contractBonusFormGroup.controls[BonusConstant.VALIDITY_END_DATE].setValidators(
      this.EndDate.value ?
        [dateValueLT(Observable.of(new Date(this.EndDate.value))),
          dateValueGT(Observable.of(this.utilityService.maxDateBetweendates([this.StartDate.value,
            contractBonusFormGroup.controls[BonusConstant.VALIDITY_START_DATE].value])))] :
        [dateValueGT(Observable.of(this.utilityService.maxDateBetweendates([this.StartDate.value,
          contractBonusFormGroup.controls[BonusConstant.VALIDITY_START_DATE].value])))]);
  }

  /**
   * build Validity Form
   * @param validityPeriod
   */
  public buildContractBenefitInKindForm(contractBenefitInKind?: ContractBenefitInKind): FormGroup {
    const contractBenefitInKindFormGroup = this.fb.group({
      Id: [contractBenefitInKind ? contractBenefitInKind.Id : NumberConstant.ZERO],
      IdBenefitInKind: [contractBenefitInKind ? contractBenefitInKind.IdBenefitInKind : '', [Validators.required]],
      Value: [contractBenefitInKind ? contractBenefitInKind.Value : '',
        [Validators.required, Validators.min(NumberConstant.ZERO),
          Validators.max(NumberConstant.ONE_MILLION), digitsAfterComma(this.degitsAfterComma)]],
      ValidityStartDate: [contractBenefitInKind ?
        new Date(contractBenefitInKind.ValidityStartDate) :
        (!this.Id.value || this.currentDate.getTime() < new Date(this.StartDate.value).getTime()) ?
          new Date(this.StartDate.value) : this.currentDate, [Validators.required]],
      ValidityEndDate: [contractBenefitInKind && contractBenefitInKind.ValidityEndDate ?
        new Date(contractBenefitInKind.ValidityEndDate) : undefined],
      IsDeleted: [false],
      State: [contractBenefitInKind ? contractBenefitInKind.State != null ?
        contractBenefitInKind.State : NumberConstant.ONE : NumberConstant.ONE],
      IdContract: [contractBenefitInKind && contractBenefitInKind.IdContract ? contractBenefitInKind.IdContract : NumberConstant.ZERO]
    });
    this.buildBenefitInKindValidators(contractBenefitInKindFormGroup);
    return contractBenefitInKindFormGroup;
  }

  /**
   * For build benefit in kind added validators
   * @param contractBenefitInKindFormGroup
   */
  private buildBenefitInKindValidators(contractBenefitInKindFormGroup: FormGroup) {
    contractBenefitInKindFormGroup.controls[BonusConstant.VALIDITY_START_DATE].setValidators([
      Validators.required,
      dateValueLT(Observable.of(this.utilityService.minDateBetweendates([this.EndDate.value,
      contractBenefitInKindFormGroup.controls[BonusConstant.VALIDITY_END_DATE].value]))),
      dateValueGT(Observable.of(new Date(this.StartDate.value))),
    ]);
    contractBenefitInKindFormGroup.controls[BonusConstant.VALIDITY_END_DATE].setValidators(
      this.EndDate.value ?
        [dateValueLT(Observable.of(new Date(this.EndDate.value))),
          dateValueGT(Observable.of(this.utilityService.maxDateBetweendates([this.StartDate.value,
            contractBenefitInKindFormGroup.controls[BonusConstant.VALIDITY_START_DATE].value])))] :
        [dateValueGT(Observable.of(this.utilityService.maxDateBetweendates([this.StartDate.value,
          contractBenefitInKindFormGroup.controls[BonusConstant.VALIDITY_START_DATE].value])))]);
  }

  //#region controls visibility
  /**
   * return the visibility of a validityPeriod
   * @param i
   */
  isBaseSalaryRowVisible(i): boolean {
    return !this.BaseSalary.at(i).get(ContractConstant.IS_DELETED).value;
  }
  /**
   * return the visibility of a validityPeriod
   * @param i
   */
  isContractBonusRowVisible(i): boolean {
    return !this.ContractBonus.at(i).get(SharedConstant.IS_DELETED).value;
  }
  /**
   * return the visibility of a validityPeriod
   * @param i
   */
  isContractBenefitInKindRowVisible(i): boolean {
    return !this.ContractBenefitInKind.at(i).get(SharedConstant.IS_DELETED).value;
  }

  //#endregion

  //#region  controls getters
  get Id(): FormControl {
    return this.contractFormGroup.get(EmployeeConstant.ID) as FormControl;
  }
  /**
   *  Start Date getter
   */
  get StartDate(): FormControl {
    return this.contractFormGroup.get(EmployeeConstant.START_DATE) as FormControl;
  }
  /**
   *  End Date getter
   */
  get EndDate(): FormControl {
    return this.contractFormGroup.get(EmployeeConstant.END_DATE) as FormControl;
  }
  get IdEmployee(): FormControl {
    return this.contractFormGroup.get(EmployeeConstant.ID_EMPLOYEE) as FormControl;
  }
  get WorkingTime(): FormControl {
    return this.contractFormGroup.get(EmployeeConstant.WORKING_TIME) as FormControl;
  }
  get IdSalaryStructure(): FormControl {
    return this.contractFormGroup.get(EmployeeConstant.ID_SALARY_STRUCTURE) as FormControl;
  }
  get IdCnss(): FormControl {
    return this.contractFormGroup.get(EmployeeConstant.ID_CNSS) as FormControl;
  }
  get IsDeleted(): FormControl {
    return this.contractFormGroup.get(EmployeeConstant.IS_DELETED) as FormControl;
  }
  get ContractFileInfo(): FormControl {
    return this.contractFormGroup.get(EmployeeConstant.CONTRACT_FILE_INFO) as FormControl;
  }
  get IdContractType(): FormControl {
    return this.contractFormGroup.get(ContractConstant.ID_CONTRACT_TYPE) as FormControl;
  }
  get SalaryStructureMinStartDate(): FormControl {
    return this.contractFormGroup.get(SalaryStructureConstant.SALARY_STRUCTURE_MIN_START_DATE) as FormControl;
  }
  /**
   * BaseSalary getter
   */
  get BaseSalary(): FormArray {
    return this.salaryFormGroup.get(ContractConstant.BASE_SALARY) as FormArray;
  }

  /**
   * ContractBonus getter
   */
  get ContractBonus(): FormArray {
    return this.bonusFormGroup.get(ContractConstant.CONTRACT_BONUS) as FormArray;
  }


  /**
   * ContractBenefitInKind getter
   */
  get ContractBenefitInKind(): FormArray {
    return this.benefitInKindFormGroup.get(ContractConstant.CONTRACT_BENEFIT_IN_KIND) as FormArray;
  }
  //#endregion

  //#region delete region
  public deleteContractBonusValidityPeriod(position): void {
    if (this.ContractBonus.at(position).get(SharedConstant.ID).value === NumberConstant.ZERO) {
      this.ContractBonus.removeAt(position);
    } else {
      this.ContractBonus.at(position).get(SharedConstant.IS_DELETED).setValue(true);
      this.ContractBonus.at(position).get(ContractConstant.ID_BONUS).setValidators(null);
      this.ContractBonus.at(position).get(ContractConstant.ID_BONUS).updateValueAndValidity();
      this.ContractBonus.at(position).get(ContractConstant.VALUE).setValidators(null);
      this.ContractBonus.at(position).get(ContractConstant.VALUE).updateValueAndValidity();
      this.ContractBonus.at(position).get(BonusConstant.VALIDITY_START_DATE).setValidators(null);
      this.ContractBonus.at(position).get(BonusConstant.VALIDITY_START_DATE).updateValueAndValidity();
      this.ContractBonus.at(position).get(BonusConstant.VALIDITY_END_DATE).setValidators(null);
      this.ContractBonus.at(position).get(BonusConstant.VALIDITY_END_DATE).updateValueAndValidity();
    }
  }
  public deleteBaseSalaryValidityPeriod(position): void {
    if (this.BaseSalary.at(position).get(SharedConstant.ID).value === NumberConstant.ZERO) {
      this.BaseSalary.removeAt(position);
    } else {
      this.BaseSalary.at(position).get(SharedConstant.IS_DELETED).setValue(true);
    }
  }

  /**
   * add Bonus Validity Period
   */
  public deleteContractBenefitInKind(position): void {
    if (this.ContractBenefitInKind.at(position).get(SharedConstant.ID).value === NumberConstant.ZERO) {
      this.ContractBenefitInKind.removeAt(position);
    } else {
      this.ContractBenefitInKind.at(position).get(SharedConstant.IS_DELETED).setValue(true);
      this.ContractBenefitInKind.at(position).get(ContractConstant.ID_BENEFIT_IN_KIND).clearValidators();
      this.ContractBenefitInKind.at(position).get(ContractConstant.VALUE).clearValidators();
      this.ContractBenefitInKind.at(position).get(BonusConstant.VALIDITY_START_DATE).clearValidators();
      this.ContractBenefitInKind.at(position).get(BonusConstant.VALIDITY_END_DATE).clearValidators();
    }
  }
  //#endregion

  /**
   * add BaseSalary Validity Period
   */
  public addBaseSalaryValidityPeriod(): void {
    if (this.contractFormGroup.valid && this.BaseSalary.valid) {
        this.BaseSalary.push(this.buildBaseSalaryValidityForm());
    } else {
      this.validationService.validateAllFormFields(this.contractFormGroup);
      this.validationService.validateAllFormGroups(this.BaseSalary);
    }
  }
  /**
   * add ContractBenefitInKind
   */
  public addContractBenefitInKind(): void {
    if (this.contractFormGroup.valid && this.ContractBenefitInKind.valid) {
      this.ContractBenefitInKind.push(this.buildContractBenefitInKindForm());
    } else {
      this.validationService.validateAllFormFields(this.contractFormGroup);
      this.validationService.validateAllFormGroups(this.ContractBenefitInKind);
    }
  }
  /**
   * add ContractBonus Validity Period
   */
  public addContractBonusValidityPeriod(): void {
    if (this.contractFormGroup.valid && this.ContractBonus.valid) {
      this.ContractBonus.push(this.buildContractBonusValidityForm());
    } else {
      this.validationService.validateAllFormFields(this.contractFormGroup);
      this.validationService.validateAllFormGroups(this.ContractBonus);
    }
  }


  changeRequired(hasEndDate) {
    if (hasEndDate) {
      this.isRequired = true;
      this.EndDate.setValidators([
        Validators.required,
        dateValueGT(new Observable(o => o.next(this.StartDate.value)))]);
    } else {
      this.isRequired = false;
      this.EndDate.setValidators([
        dateValueGT(new Observable(o => o.next(this.StartDate.value)))]);
    }
    this.updateEndDateValidity();
    this.hasEndDate = hasEndDate;
    this.addDependentDateControls();
  }


  /**
   * Sent the contract formGroup to the employee formGroup
   * */
  sentContractFormToEmployee(): any {
    this.contractFormGroup.controls[ContractConstant.CONTRACT_FILE_INFO] =
      new FormControl(this.contractFileToUpload);
    this.contractFormGroup.updateValueAndValidity();
    this.contractFormGroup.addControl(ContractConstant.BASE_SALARY, this.BaseSalary);
    this.contractFormGroup.addControl(ContractConstant.CONTRACT_BONUS, this.ContractBonus);
    this.contractFormGroup.addControl(ContractConstant.CONTRACT_BENEFIT_IN_KIND, this.ContractBenefitInKind);
    this.contractFormGroup.addControl(ContractConstant.CONTRACT_ADVANTAGE, this.ContractAdvantage);
    let obj: Contract = Object.assign({}, new Contract(), this.contractFormGroup.getRawValue());
    obj = Object.assign(obj, this.salaryFormGroup.getRawValue());
    obj = Object.assign(obj, this.bonusFormGroup.getRawValue());
    obj = Object.assign(obj, this.benefitInKindFormGroup.getRawValue());
    obj = Object.assign(obj, this.otherAdvantagesFormGroup.getRawValue());
    obj.CheckContractToAdd = true;
    obj.IdSalaryStructureNavigation = this.salaryStructure;
    obj.IdContractTypeNavigation = this.contractType;
    this.options.data = obj;
    this.options.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }

  public getId(old: boolean): string {
    if (old) {
      return this.lastValue;
    } else {
      this.lastValue = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND).toString();
      return this.lastValue;
    }
  }

  ngAfterViewChecked(): void {
    if (this.salaryFormGroup && this.salaryFormGroup.touched && this.isTouched) {
      this.salaryFormGroup.markAsUntouched();
      this.isTouched = false;
    }
  }

  isFormChanged(): boolean {
    if (this.contractFormGroup.touched || this.salaryFormGroup.touched || this.bonusFormGroup.touched || this.benefitInKindFormGroup.touched
      || this.otherAdvantagesFormGroup.touched) {
      return true;
    }
    return false;
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
}
