import {Component, ComponentRef, OnInit} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {CnssConstant} from '../../../constant/payroll/cnss.constant';
import {Cnss} from '../../../models/payroll/cnss.model';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {isEqualLength, ValidationService} from '../../../shared/services/validation/validation.service';
import {CnssService} from '../../services/cnss/cnss.service';

@Component({
  selector: 'app-add-cnss',
  templateUrl: './add-cnss.component.html',
  styleUrls: ['./add-cnss.component.scss']
})
export class AddCnssComponent implements OnInit {

  dialogOptions: Partial<IModalDialogOptions<any>>;
  cnssFormGroup: FormGroup;

  constructor(private fb: FormBuilder, private modalService: ModalDialogInstanceService, private validationService: ValidationService,
              private cnssService: CnssService) {
  }

  get Label(): FormControl {
    return this.cnssFormGroup.get(SharedConstant.LABEL) as FormControl;
  }

  get EmployerRate(): FormControl {
    return this.cnssFormGroup.get(CnssConstant.EMPLOYER_RATE) as FormControl;
  }

  get SalaryRate(): FormControl {
    return this.cnssFormGroup.get(CnssConstant.SALARY_RATE) as FormControl;
  }

  get WorkAccidentQuota(): FormControl {
    return this.cnssFormGroup.get(CnssConstant.WORK_ACCIDENT_QUOTA) as FormControl;
  }

  get OperatingCode(): FormControl {
    return this.cnssFormGroup.get(CnssConstant.OPERATING_CODE) as FormControl;
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
  }

  ngOnInit() {
    this.createAddCnssForm();
  }

  // Create social contribution form group
  createAddCnssForm() {
    this.cnssFormGroup = this.fb.group({
      Id: [NumberConstant.ZERO],
      Label: ['', [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      EmployerRate: ['', [Validators.required, Validators.min(NumberConstant.ZERO)]],
      SalaryRate: ['', [Validators.required, Validators.min(NumberConstant.ZERO)]],
      WorkAccidentQuota: ['', [Validators.required, Validators.min(NumberConstant.ZERO)]],
      OperatingCode: ['', [Validators.required, isEqualLength(NumberConstant.FOUR)]]
    });
  }

  // Save new social contribution
  save() {
    if (this.cnssFormGroup.valid) {
      const cnss: Cnss = Object.assign({}, new Cnss(), this.cnssFormGroup.value);
      this.cnssService.save(cnss, true).subscribe(() => {
        this.dialogOptions.onClose();
        this.modalService.closeAnyExistingModalDialog();
      });
    } else {
      this.validationService.validateAllFormFields(this.cnssFormGroup);
    }
  }
}
