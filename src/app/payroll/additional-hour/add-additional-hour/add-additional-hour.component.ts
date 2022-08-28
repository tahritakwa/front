import { Component, ComponentRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { AdditionalHourConstant } from '../../../constant/payroll/additional-hour.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { AdditionalHourSlot } from '../../../models/payroll/additional-hour-slot.model';
import { AdditionalHour } from '../../../models/payroll/additional-hour.model';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AdditionalHourService } from '../../services/additional-hour/additional-hour.service';

@Component({
    selector: 'app-add-additional-hour',
    templateUrl: './add-additional-hour.component.html',
    styleUrls: ['./add-additional-hour.component.scss']
  })
  export class AddAdditionalHourComponent implements OnInit {
  /*
   * Form Group
   */
  additionalHourFormGroup: FormGroup;
  /*
   * If modal=true
   */
  public isModal: boolean;
  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  /*
   * Data input of the modal
   */
  public data: any;
  additionalHourToUpdate: AdditionalHour;
  /**
   * number of deleted element in update case
   */
  public DeletedElementsNumber = 0;
  public hasUpdatePermission: boolean;

  constructor(private fb: FormBuilder, private additionalHourService: AdditionalHourService, private router: Router,
     private validationService: ValidationService, private modalService: ModalDialogInstanceService, private authService: AuthService) {}
  ngOnInit() {
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_ADDITIONAL_HOUR);
    this.createAddForm(this.data);
    if (this.data.AdditionalHourSlot) {
      this.data.AdditionalHourSlot.forEach(element => {
        this.AdditionalHourSlot.push(this.buildAdditionalHourSlotFormGroup(element));
      });
    }
    if (!this.hasUpdatePermission) {
      this.additionalHourFormGroup.disable();
      this.AdditionalHourSlot.disable();
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
  }

  public createAddForm(additionalHourToUpdate?: AdditionalHour) {
    this.additionalHourFormGroup = this.fb.group({
      Id: [additionalHourToUpdate ? additionalHourToUpdate.Id : NumberConstant.ZERO],
      Code: [additionalHourToUpdate ? additionalHourToUpdate.Code : '',
        [Validators.required, Validators.maxLength(AdditionalHourConstant.VARCHAR_MAX_LENGTH)]],
      Name: [additionalHourToUpdate ? additionalHourToUpdate.Name : '', [Validators.required,
         Validators.maxLength(AdditionalHourConstant.VARCHAR_MAX_LENGTH)]],
      Description: [additionalHourToUpdate ? additionalHourToUpdate.Description : '',
       Validators.maxLength(AdditionalHourConstant.DESCRIPTION_MAX_LENGTH)],
      Worked: [additionalHourToUpdate ? additionalHourToUpdate.Worked : false],
      IncreasePercentage: [additionalHourToUpdate ? additionalHourToUpdate.IncreasePercentage : '', [Validators.required]],
      AdditionalHourSlot: this.fb.array([]),
    });
  }
  /**
   * Save additional hour
   */
  save() {
    if (this.additionalHourFormGroup.valid) {
      this.additionalHourToUpdate = Object.assign({}, new AdditionalHour(), this.additionalHourFormGroup.value);
      this.actionToSave(this.additionalHourToUpdate);
    } else {
      this.validationService.validateAllFormFields(this.additionalHourFormGroup);
    }
  }

  private actionToSave(additionalHourToSave: AdditionalHour) {
    this.additionalHourService.save(additionalHourToSave, false).subscribe(() => {
      if (this.isModal) {
        this.dialogOptions.onClose();
        this.modalService.closeAnyExistingModalDialog();
      } else {
        this.router.navigate([AdditionalHourConstant.ADDITIONAL_HOUR_LIST_URL]);
      }
    });
  }

  public buildAdditionalHourSlotFormGroup(additionaHourSlot ?: AdditionalHourSlot): FormGroup {
    return this.fb.group({
      Id: [additionaHourSlot ? additionaHourSlot.Id : NumberConstant.ZERO],
      StartTime: [additionaHourSlot ? additionaHourSlot.StartTime : '', [Validators.required]],
      EndTime: [additionaHourSlot ? additionaHourSlot.EndTime : '', [Validators.required]],
      IsDeleted: [false]
    });
  }

  /**
   * onClick on add additional hour slot button a new child will be displayed
   */
  public addAdditionalHourSlot(): void {
    if (this.AdditionalHourSlot.length === NumberConstant.ZERO) {
      this.AdditionalHourSlot.push(this.buildAdditionalHourSlotFormGroup());
    } else if (this.AdditionalHourSlot.controls[this.AdditionalHourSlot.length - NumberConstant.ONE] &&
      this.AdditionalHourSlot.controls[this.AdditionalHourSlot.length - NumberConstant.ONE].valid) {
        this.AdditionalHourSlot.push(this.buildAdditionalHourSlotFormGroup());
    } else if (this.AdditionalHourSlot.controls[this.AdditionalHourSlot.length - NumberConstant.ONE]) {
      this.validationService.validateAllFormFields(this.AdditionalHourSlot.
        controls[this.AdditionalHourSlot.length - NumberConstant.ONE] as FormGroup);
    }
  }

  public deleteAdditionalHourSlot(index): void {
    if (this.AdditionalHourSlot.at(index).get(AdditionalHourConstant.ID).value === NumberConstant.ZERO) {
      this.AdditionalHourSlot.removeAt(index);
    } else {
      this.AdditionalHourSlot.at(index).get(AdditionalHourConstant.IS_DELETED).setValue(true);
      this.DeletedElementsNumber++;
    }
  }

  /**
   * return the visibility of an additional hour slot
   * @param i
   */
  isRowVisible(i): boolean {
    return !this.AdditionalHourSlot.at(i).get(AdditionalHourConstant.IS_DELETED).value;
  }

  get Id(): FormControl {
    return this.additionalHourFormGroup.get(AdditionalHourConstant.ID) as FormControl;
  }
  get Code(): FormControl {
    return this.additionalHourFormGroup.get(AdditionalHourConstant.CODE) as FormControl;
  }
  get Name(): FormControl {
    return this.additionalHourFormGroup.get(AdditionalHourConstant.NAME) as FormControl;
  }
  get Description(): FormControl {
    return this.additionalHourFormGroup.get(AdditionalHourConstant.DESCRIPTION) as FormControl;
  }
  get IncreasePercentage(): FormControl {
    return this.additionalHourFormGroup.get(AdditionalHourConstant.INCREASE_PERCENTAGE) as FormControl;
  }
  get Worked(): FormControl {
    return this.additionalHourFormGroup.get(AdditionalHourConstant.WORKED) as FormControl;
  }
  get AdditionalHourSlot(): FormArray {
    return this.additionalHourFormGroup.get(AdditionalHourConstant.ADDITIONAL_HOUR_SLOT) as FormArray;
  }
  }
