import { Component, ComponentRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Subscription } from 'rxjs/Subscription';
import { TrainingConstant } from '../../../constant/rh/training.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { TrainingRequestState } from '../../../models/enumerators/training-request-state.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { TrainingRequest } from '../../../models/rh/training-request.model';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TrainingRequestService } from '../../services/training-request/training-request.service';

@Component({
  selector: 'app-training-add-request',
  templateUrl: './training-add-request.component.html',
  styleUrls: ['./training-add-request.component.scss']
})
export class TrainingAddRequestComponent implements OnInit {

  isUpdateMode = false;
  isModal = false;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  data: any;
  trainingRequesToUpdate: TrainingRequest;
  trainingRequestFormGroup: FormGroup;
  selectedEmployee = NumberConstant.ZERO;
  connectedUser;
  connectedEmployee: Employee;
  idTraining: number;
  hasValidityPermission: boolean;
  hasRefusePermission: boolean;
  trainingRequestState = TrainingRequestState;
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  isDisabled = false;
  public hasAddPTrainingRequestPermission: boolean;
  public hasUpdateTrainingRequestPermission: boolean;
  private subscriptions: Subscription[] = [];
  constructor(private fb: FormBuilder, private validationService: ValidationService,
              private employeeService: EmployeeService,
              private trainingRequestService: TrainingRequestService,
              private modalService: ModalDialogInstanceService,
      private authService: AuthService, private translate: TranslateService) {
  }

  get IdEmployeeCollaborator(): FormControl {
    return this.trainingRequestFormGroup.get(TrainingConstant.ID_EMPLOYEE_COLLABORATOR) as FormControl;
  }

  get ExpectedDate(): FormControl {
    return this.trainingRequestFormGroup.get(TrainingConstant.EXPECTED_DATE) as FormControl;
  }

  get Description(): FormControl {
    return this.trainingRequestFormGroup.get(TrainingConstant.DESCRIPTION) as FormControl;
  }

  get IdTraining(): FormControl {
    return this.trainingRequestFormGroup.get(TrainingConstant.ID_TRAINING) as FormControl;
  }

  ngOnInit() {
    this.connectedEmployee = new Employee();
    this.subscriptions.push(this.employeeService.getConnectedEmployee().subscribe(dataResult => {
      this.connectedEmployee = dataResult;
      this.selectedEmployee = this.connectedEmployee.Id;
      this.CreateAddTrainingRequestForm(this.trainingRequesToUpdate);
    }));
    this.isDisabled = this.isUpdateMode && !(this.trainingRequesToUpdate.Status === this.trainingRequestState.Waiting);
    this.hasAddPTrainingRequestPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TRAININGREQUEST);
    this.hasUpdateTrainingRequestPermission =
      this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_TRAININGREQUEST);
    this.CreateAddTrainingRequestForm(this.trainingRequesToUpdate);
    this.hasValidityPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_TRAININGREQUEST);
    this.hasRefusePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.REFUSE_TRAININGREQUEST);
  }

  /**
   * create add trainingRequest formGroup
   * @param trainingRequest
   */
  CreateAddTrainingRequestForm(trainingRequest?: TrainingRequest) {
    this.trainingRequestFormGroup = this.fb.group({
        Id: [trainingRequest ? trainingRequest.Id : NumberConstant.ZERO],
        IdTraining: [{
          value: trainingRequest ? trainingRequest.IdTraining : this.idTraining,
          disabled: this.isDisabled || (!this.hasUpdateTrainingRequestPermission && this.isUpdateMode
            || !this.hasAddPTrainingRequestPermission && !this.isUpdateMode)
        },
          Validators.required],
        IdEmployeeCollaborator: [{
          value: trainingRequest ? trainingRequest.IdEmployeeCollaborator : this.selectedEmployee,
          disabled: this.isDisabled || (!this.hasUpdateTrainingRequestPermission && this.isUpdateMode
            || !this.hasAddPTrainingRequestPermission && !this.isUpdateMode)
        },
          [Validators.required]],
        IdEmployeeAuthor: [trainingRequest ? trainingRequest.IdEmployeeAuthor : this.connectedEmployee.Id, [Validators.required]],
        ExpectedDate: [{
          value: trainingRequest ? new Date(trainingRequest.ExpectedDate) : new Date(),
          disabled: this.isDisabled || (!this.hasUpdateTrainingRequestPermission && this.isUpdateMode
            || !this.hasAddPTrainingRequestPermission && !this.isUpdateMode)
        },
          Validators.required],
        Description: [{
          value: trainingRequest ? trainingRequest.Description : '',
          disabled: this.isDisabled || (!this.hasUpdateTrainingRequestPermission && this.isUpdateMode
            || !this.hasAddPTrainingRequestPermission && !this.isUpdateMode)
        }],
        Status: [trainingRequest ? trainingRequest.Status : TrainingRequestState.Waiting]
      }
    );
  }

  /**
   * save trainingRequest
   */
  save() {
    if (this.trainingRequestFormGroup.valid) {
      const trainingRequestAssign: TrainingRequest = Object.assign({}, this.trainingRequestFormGroup.value);
      this.subscriptions.push(this.trainingRequestService.addOrUpdateTrainingRequest(trainingRequestAssign, !this.isUpdateMode)
      .subscribe((res) => {
        this.dialogOptions.onClose();
        this.modalService.closeAnyExistingModalDialog();
      }));
    } else {
      this.validationService.validateAllFormFields(this.trainingRequestFormGroup);
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
    this.data = this.dialogOptions.data;
    if (this.data && this.data.Id) {
      this.isUpdateMode = true;
      this.trainingRequesToUpdate = this.data;
    } else {
      this.isUpdateMode = false;
      this.idTraining = this.data;
    }
  }

  /**
   * Accept the training request
   */
  validateTrainingRequest() {
    this.trainingRequestFormGroup.controls[TrainingConstant.STATUS].setValue(this.trainingRequestState.Accepted);
    this.save();
  }

  /**
   * Refuse the training request
   */
  refuseTrainingRequest() {
    this.trainingRequestFormGroup.controls[TrainingConstant.STATUS].setValue(this.trainingRequestState.Refused);
    this.save();
  }
}
