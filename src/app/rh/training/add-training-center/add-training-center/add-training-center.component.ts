import {Component, ComponentRef, OnDestroy, OnInit} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {TranslateService} from '@ngx-translate/core';
import {SettlementConstant} from '../../../../constant/payment/settlement.constant';
import {TrainingCenterRoom} from '../../../../models/rh/training-center-room.model';
import {TrainingConstant} from '../../../../constant/rh/training.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {TrainingCenter} from '../../../../models/rh/training-center.model';
import {TrainingCenterService} from '../../../services/training-center/training-center.service';
import {TrainingCenterManager} from '../../../../models/rh/training-center-manager.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-add-training-center',
  templateUrl: './add-training-center.component.html',
  styleUrls: ['./add-training-center.component.scss']
})
export class AddTrainingCenterComponent implements OnInit, OnDestroy {

  isModal = false;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  trainingCenterFormGroup: FormGroup;
  paymentMethodConstants = [SettlementConstant.CASH, SettlementConstant.BANK_CHECK, SettlementConstant.BANK_TRANSFER];
  paymentMethodList: any[] = [];
  trainingCenter: TrainingCenter;
  trainingCenterManager: TrainingCenterManager;
  private subscriptions: Subscription[] = [];

  constructor(private modalService: ModalDialogInstanceService, private fb: FormBuilder, private validationService: ValidationService,
              private translate: TranslateService, private trainingCenterService: TrainingCenterService) {
  }

  get TrainingCenterRoom(): FormArray {
    return this.trainingCenterFormGroup.get(TrainingConstant.TRAINING_CENTER_ROOM) as FormArray;
  }

  ngOnInit() {
    this.createForm();
    this.addTrainingCenterRoom();
    this.paymentMethod();
    this.trainingCenterManager = new TrainingCenterManager();
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
  }

  paymentMethod() {
    this.paymentMethodConstants.forEach(elem => {
      this.subscriptions.push(this.translate.get(elem.toUpperCase()).subscribe(trans => elem = trans));
      this.paymentMethodList.push(elem);
    });
  }

  createForm() {
    this.trainingCenterFormGroup = this.fb.group({
      Name: ['', [Validators.required]],
      Place: ['', [Validators.required]],
      OpeningTime: [null, Validators.required],
      ClosingTime: [null, Validators.required],
      ModeOfPayment: [''],
      CenterPhoneNumber: ['', [Validators.required]],
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required]],
      TrainingCenterRoom: this.fb.array([])
    });
  }

  addTrainingCenterRoom(trainingCenterRoom?: TrainingCenterRoom) {
    this.TrainingCenterRoom.push(this.buildTrainingCenterRoomForm(trainingCenterRoom));
  }

  /**
   * Build training seance form array
   * @param trainingSeance
   */
  buildTrainingCenterRoomForm(trainingCenterRoom?: TrainingCenterRoom): FormGroup {
    return this.fb.group({
      Id: [trainingCenterRoom ? trainingCenterRoom.Id : NumberConstant.ZERO],
      Name: [trainingCenterRoom ? trainingCenterRoom.Name : '', Validators.required],
      Capacity: [trainingCenterRoom ? trainingCenterRoom.Capacity : null, Validators.required],
      RentPerHour: [trainingCenterRoom ? trainingCenterRoom.RentPerHour : null, Validators.required],
      IsDeleted: [false]
    });
  }

  /**
   * Check if the training seance array is visible
   * @param index
   */
  isTrainingCenterRoomRowVisible(index: number): boolean {
    return !this.TrainingCenterRoom.at(index).get(SharedConstant.IS_DELETED).value;
  }

  /**
   * Delete a training seance array
   * @param index
   */
  deleteTrainingCenterRoom(index: number) {
    if (this.TrainingCenterRoom.at(index).get(SharedConstant.ID).value === NumberConstant.ZERO) {
      this.TrainingCenterRoom.removeAt(index);
    } else {
      this.TrainingCenterRoom.at(index).get(SharedConstant.IS_DELETED).setValue(true);
    }
  }


  save() {
    if (this.trainingCenterFormGroup.valid) {
      this.trainingCenter = this.trainingCenterFormGroup.getRawValue();
      let modeOfPayment = this.paymentMethodList.indexOf(this.trainingCenterFormGroup.get(TrainingConstant.MODE_OF_PAYMENT).value);
      if (modeOfPayment === NumberConstant.MINUS_ONE) {
        modeOfPayment = null;
      }
      this.trainingCenter.ModeOfPayment = modeOfPayment;
      this.trainingCenterManager.FirstName = this.trainingCenterFormGroup.get(TrainingConstant.EMPLOYEE_FIRST_NAME).value;
      this.trainingCenterManager.LastName = this.trainingCenterFormGroup.get(TrainingConstant.EMPLOYEE_LAST_NAME).value;
      this.trainingCenterManager.PhoneNumber = this.trainingCenterFormGroup.get(TrainingConstant.PHONE_NUMBER).value;
      this.trainingCenter.IdTrainingCenterManagerNavigation = this.trainingCenterManager;

      this.subscriptions.push(this.trainingCenterService.save(this.trainingCenter, true).subscribe((result) => {
        this.dialogOptions.onClose();
        this.modalService.closeAnyExistingModalDialog();
      }));
    } else {
      this.validationService.validateAllFormFields(this.trainingCenterFormGroup);
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
