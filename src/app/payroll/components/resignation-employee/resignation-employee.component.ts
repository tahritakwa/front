import { Component, ComponentRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Observable } from 'rxjs/Observable';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Employee } from '../../../models/payroll/employee.model';
import { dateValueGT, ValidationService } from '../../../shared/services/validation/validation.service';
import { EmployeeService } from '../../services/employee/employee.service';

@Component({
  selector: 'app-resignation-employee',
  templateUrl: './resignation-employee.component.html',
  styleUrls: ['./resignation-employee.component.scss']
})
export class ResignationEmployeeComponent implements OnInit {

  public isModal: boolean;
  resignationFormGroup: FormGroup;
  public employee: Employee;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  reference: ComponentRef<IModalDialog>;
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private modalService: ModalDialogInstanceService, private router: Router, private translate: TranslateService,
    private fb: FormBuilder, private validationService: ValidationService,  public employeeService: EmployeeService) { }


    get ResignationDate(): FormControl {
      return this.resignationFormGroup.get(EmployeeConstant.RESIGNATION_DATE) as FormControl;
    }
  
    get ResignationDepositDate(): FormControl {
      return this.resignationFormGroup.get(EmployeeConstant.RESIGNATION_DEPOSIT_DATE) as FormControl;
    }
  

  ngOnInit() {
    this.createResignationForm(this.employee);
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
    this.employee = options.data;
    this.dialogOptions.data = null;
  }

  toResignClick() {
    if (this.resignationFormGroup.valid) {
      this.dialogOptions.data = this.resignationFormGroup;
      this.dialogOptions.onClose();
      this.modalService.closeAnyExistingModalDialog();
    } else {
      this.validationService.validateAllFormFields(this.resignationFormGroup);
    }
  }

  private createResignationForm(employee?: Employee): void {
    this.resignationFormGroup = this.fb.group({
      ResignationDate: [employee ? employee.ResignationDate : ''],
      ResignationDepositDate: [employee ? employee.ResignationDepositDate : '', Validators.required]
    });
    this.ResignationDate.setValidators([
      dateValueGT(new Observable(o => o.next(this.ResignationDepositDate.value)))
    ]);
    if (employee && employee.Contract && employee.Contract.length > NumberConstant.ZERO) {
      this.ResignationDepositDate.setValidators([
        Validators.required,
        dateValueGT(new Observable(o => o.next(new Date(Math.min.apply(null, employee.Contract.map(x => x.StartDate))))))
      ]);
    }
  }

}
