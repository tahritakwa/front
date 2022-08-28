import { Component, ComponentRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Subject } from 'rxjs/Subject';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { VehicleCategoryEnumerator } from '../../../models/enumerators/vehicle-category.enum';
import { InterventionLoanVehicle } from '../../../models/garage/intervention-loan-vehicle.model';
import { ValidationService } from '../../../shared/services/validation/validation.service';

@Component({
  selector: 'app-add-intervention-loan-vehicle',
  templateUrl: './add-intervention-loan-vehicle.component.html',
  styleUrls: ['./add-intervention-loan-vehicle.component.scss']
})
export class AddInterventionLoanVehicleComponent implements OnInit {

  // Modal Settings
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public closeDialogSubject: Subject<any>;

  interventionLoanVehicle: InterventionLoanVehicle;
  public idVehicle: number;

  // Form Group
  form: FormGroup;

  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public vehicleCategoryEnum = VehicleCategoryEnumerator;

  constructor(private modalService: ModalDialogInstanceService,
    private formBuilder: FormBuilder, public validationService: ValidationService, private translate: TranslateService) { }

  ngOnInit() {
    this.CreateFormGroup();
    if (this.interventionLoanVehicle) {
      this.interventionLoanVehicle.LoanDate = this.interventionLoanVehicle.LoanDate ? new Date(this.interventionLoanVehicle.LoanDate) :
       new Date();
      this.interventionLoanVehicle.ExpectedReturnDate = this.interventionLoanVehicle.ExpectedReturnDate ?
      new Date(this.interventionLoanVehicle.ExpectedReturnDate) : new Date();
      this.form.patchValue(this.interventionLoanVehicle);
    }
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.closeDialogSubject = options.closeDialogSubject;
    this.interventionLoanVehicle = options.data;
    this.idVehicle = this.interventionLoanVehicle ? this.interventionLoanVehicle.IdVehicle : undefined;
  }

  CreateFormGroup() {
    this.form = this.formBuilder.group({
      Id: [0, Validators.required],
      IdVehicle: [0, Validators.required],
      IdIntervention: [0, Validators.required],
      LoanDate: [new Date(), Validators.required],
      ExpectedReturnDate: [new Date(), Validators.required],
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogOptions.data = Object.assign({}, this.interventionLoanVehicle, this.form.getRawValue());
      this.dialogOptions.onClose();
      this.modalService.closeAnyExistingModalDialog();
    } else {
      this.validationService.validateAllFormFields(this.form);
    }
  }
}
