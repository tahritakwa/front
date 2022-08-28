import { Component, ComponentRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AttendanceConstant } from '../../../constant/payroll/attendance.constant';
import { ContractConstant } from '../../../constant/payroll/Contract.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Contract } from '../../../models/payroll/contract.model';
import { PayslipReportInformations } from '../../../models/payroll/payslip-report-informations.model';
import { PayslipReportLines } from '../../../models/payroll/payslip-report-lines.model';
import { Payslip } from '../../../models/payroll/payslip.model';
import { dateValueGT, dateValueLT, ValidationService } from '../../../shared/services/validation/validation.service';
import { PayslipService } from '../../services/payslip/payslip.service';

@Component({
  selector: 'app-payslip-preview',
  templateUrl: './payslip-preview.component.html',
  styleUrls: ['./payslip-preview.component.scss']
})
export class PayslipPreviewComponent implements OnInit {
  /*
   * If modal=true
   */
  public isModal: boolean;
  /*
   * Preview payslip data
   */
  public previewData: PayslipReportInformations;
  public payslipReportLines: PayslipReportLines[];
  /*
   * Data input of the modal
  */
  public contracts: Contract[];
  public currentContractStartDate: Date;
  public currentContractEndDate: Date;
  public currentContractHasEndate = false;
  // private idEmployee: number;
  public previewFormGroup: FormGroup;
  private payslip: Payslip;
  public dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  /*
  * dialog subject
  */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;

  /**
   * Constructor
    * @param payDataService
   * @param employeeService
   * @param fb
   * @param validationService
   */
  constructor(private payslipService: PayslipService,
    private fb: FormBuilder,
    private validationService: ValidationService,
    private translate: TranslateService) { }


  /**
  * Inialise Modal
  * @param reference
  * @param options
  */
 dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
  this.isModal = true;
  this.dialogOptions = options;
  this.contracts  = options.data.contracts;
  this.setPreviewData(options.data.payslip);
  this.closeDialogSubject = options.closeDialogSubject;
}

  /**
   * Ng on Init
   */
  ngOnInit() {
    this.getEmployeeWithContracts();
  }

  /**
   * Get employee with its contract and salary structure navigation
   */
  private getEmployeeWithContracts(): void {
      this.payslip = new Payslip();
      const currentContract = this.contracts.filter(x => x.Id === this.previewData.IdContract)[NumberConstant.ZERO];
      this.payslip.IdContract = currentContract.Id;
      this.payslip.IdEmployee = currentContract.IdEmployee;
      this.payslip.NumberDaysWorked = this.previewData.NumberOfDaysWorked;
      this.currentContractStartDate = new Date(currentContract.StartDate);
      this.payslip.Month = new Date(this.previewData.Month);
      this.createPreviewForm();
      const date = new Date();
      this.currentContractHasEndate = currentContract.EndDate ? true : false;
      this.currentContractEndDate = currentContract.EndDate ? new Date(currentContract.EndDate)
        : new Date(date.getFullYear() + NumberConstant.THIRTY, date.getMonth(), date.getDate());
  }

  private setPreviewData(data: PayslipReportInformations): void {
    this.previewData = data;
    this.payslipReportLines = this.previewData.PayslipReportLinesViewModels;
  }

  /**
   * Create resignation form
  */
  private createPreviewForm(): void {
    this.previewFormGroup = this.fb.group({
      IdContract: [this.payslip.IdContract, Validators.required],
      Month: [this.payslip.Month, Validators.required],
      NumberDaysWorked: [this.payslip.NumberDaysWorked,
        [Validators.required, Validators.max(this.previewData.NumberOfDaysWorkedByCompanyInMonth)]]
    });
  }

  /**
   * Get payslip information for simulate employee payslip for current month
   */
  private getPayslipPreviewInformation(): void {
    this.payslipService.getPayslipPreviewInformation(this.payslip).subscribe(data => {
      this.setPreviewData(data);
      this.NumberDaysWorked.clearValidators();
      this.NumberDaysWorked.markAsTouched();
      this.NumberDaysWorked.setValue(this.previewData.NumberOfDaysWorked);
      this.NumberDaysWorked.setValidators([Validators.required, Validators.max(this.previewData.NumberOfDaysWorkedByCompanyInMonth)]);
      this.previewFormGroup.updateValueAndValidity();
    });
  }

  /**
   * Calculate preview parameter according to user inputs
   */
  public reload() {
    if (this.previewFormGroup.valid ) {
      this.payslip = Object.assign({}, this.payslip, this.previewFormGroup.getRawValue());
      this.getPayslipPreviewInformation();
    } else {
      this.validationService.validateAllFormFields(this.previewFormGroup);
    }
  }

  /**
   * When user change date
   */
  public changeDate() {
    if (this.Month.valid) {
      this.payslip.NumberDaysWorked = NumberConstant.ZERO;
      this.payslip.Month = new Date(this.Month.value);
      this.getPayslipPreviewInformation();
    }
  }

  /**
   * Change contract in dropdown
   */
  changeContract() {
    const currentContract = this.contracts.filter(m => m.Id === this.IdContract.value)[NumberConstant.ZERO];
    this.currentContractStartDate = new Date(currentContract.StartDate);
    const date = new Date();
    this.currentContractHasEndate = currentContract.EndDate ? true : false;
    this.currentContractEndDate = currentContract.EndDate ? new Date(currentContract.EndDate)
      : new Date(date.getFullYear() + NumberConstant.THIRTY, date.getMonth(), date.getDate());
    this.Month.clearValidators();
    this.Month.setValue(new Date(this.currentContractStartDate));
    this.setFormGroupValidators();
    this.reload();
  }

  /**
   * Set form group validators
   */
  private setFormGroupValidators() {
    this.Month.setValidators([Validators.required, dateValueGT(new Observable(o => o.next(this.currentContractStartDate)))]);
    if (this.currentContractEndDate) {
      this.Month.setValidators([Validators.required, dateValueLT(new Observable(o => o.next(this.currentContractEndDate)))]);
    }
  }

  /**
   * IdContract gettter
   */
  get IdContract(): FormControl {
    return this.previewFormGroup.get(ContractConstant.ID_CONTRACT) as FormControl;
  }

  /**
   * Month getter
   */
  get Month(): FormControl {
    return this.previewFormGroup.get(SharedConstant.MONTH) as FormControl;
  }

  /**
   * NumberDaysWorked getter
   */
  get NumberDaysWorked(): FormControl {
    return this.previewFormGroup.get(AttendanceConstant.NUMBER_DAYS_WORKED) as FormControl;
  }
}
