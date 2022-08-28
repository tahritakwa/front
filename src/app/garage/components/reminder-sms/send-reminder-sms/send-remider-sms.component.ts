import { Component, ComponentRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Subject } from 'rxjs/Subject';
import { GarageConstant } from '../../../../constant/garage/garage.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { TiersTypeEnumerator } from '../../../../models/enumerators/tiers-type.enum';
import { Sms } from '../../../../models/garage/sms.model';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { RepairOrderService } from '../../../services/repair-order/repair-order.service';
import { SmsService } from '../../../services/sms/sms.service';

@Component({
  selector: 'app-send-remider-sms',
  templateUrl: './send-remider-sms.component.html',
  styleUrls: ['./send-remider-sms.component.scss']
})
export class SendReminderSmsComponent implements OnInit {

  smsFormGroup: FormGroup;
  smsToSend: Sms;
  public customerTiers = TiersTypeEnumerator.Customer;
  public tiersIdList: number[] = [];
  isUpdateMode: boolean;
  id: number;
  isImmediateSend = true;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public closeDialogSubject: Subject<any>;
  selectedTiers: any[] = [];
  isModal: boolean;
  constructor(private fb: FormBuilder, private repairOrderService: RepairOrderService,
    private smsService: SmsService, private router: Router,
    private validationService: ValidationService, private activatedRoute: ActivatedRoute, 
    private modalService: ModalDialogInstanceService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[GarageConstant.ID] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.smsToSend = new Sms();
    this.createSmsFormGroup();
    if (this.isModal) {
      this.getTiersSelected();
    }
  }

   /**
   * initialize dialog
   * @param reference
   * @param options
   */
    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
      this.optionDialog = options;
      this.selectedTiers.push(options.data.selectedTiers);
      this.isModal = options.data.isModal;
    }

  getTiersSelected() {
    const listTiersValue = this.selectedTiers.map((value) => { return { 'Id': value.Id, 'Name': value.Name } });
    this.smsFormGroup.controls.ListTiers.setValue(listTiersValue);
    this.tiersIdList = [];
    this.selectedTiers.forEach((tiers) => {
      this.tiersIdList.push(tiers.Id);
    });
  }

  createSmsFormGroup() {
    this.smsFormGroup = this.fb.group({
      ListTiers: [undefined , Validators.required],
      Body: [undefined, Validators.required],
      Immediate:  [NumberConstant.ONE],
      SendDate: [undefined],
      SendHour: [undefined],
    });
  }

  getDataToUpdate() {
    this.smsService.getById(this.id).subscribe((data) => {
     this.ListTiers.setValue('');
     this.Body.setValue(data.Body);
      this.smsFormGroup.disable();
    });
  }

  sendAndSaveSms() {
    if (this.smsFormGroup.valid) {
      this.smsToSend = Object.assign({}, this.smsToSend, this.smsFormGroup.getRawValue());
       // Set send hour
       if (this.smsToSend.SendHour) {
        const sendHour: Date = new Date(this.SendHour.value);
        this.smsToSend.SendHour =
          String(sendHour.getHours()).concat(':').concat(String(sendHour.getMinutes()));
       }
      this.smsToSend.Body = this.Body.value;
      this.repairOrderService.sendReminderSmsMessage(this.smsToSend, this.tiersIdList).subscribe((data) => {
        if (this.isModal) {
          this.onCloseModal();
        } else {
          this.goBackToList();
        }
      });
    } else {
      this.validationService.validateAllFormFields(this.smsFormGroup);
    }
  }

  private onCloseModal(): void {
    this.optionDialog.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }

  selectedValuesCheckboxChange($event: any[]) {
    this.tiersIdList = [];
    if ($event) {
      $event.forEach((tiers) => {
        this.tiersIdList.push(tiers.Id);
      });
    }
  }

  goBackToList() {
    this.router.navigateByUrl(GarageConstant.NAVIGATE_TO_SMS_LIST);
  }

  immediateSendChange($event) {
    this.isImmediateSend = !this.isImmediateSend;
    this.setDateHourValidators();
    if (!this.isImmediateSend) {

    }
  }

  setDateHourValidators() {
    if (!this.isImmediateSend) {
      this.smsFormGroup.controls.SendDate.setValidators([Validators.required]);
      this.smsFormGroup.controls.SendHour.setValidators([Validators.required]);
    } else {
      this.smsFormGroup.controls.SendDate.setValidators([]);
      this.smsFormGroup.controls.SendHour.setValidators([]);
      this.smsFormGroup.controls.SendDate.setValue(undefined);
      this.smsFormGroup.controls.SendHour.setValue(undefined);
    }
  }


  get ListTiers(): FormControl {
    return this.smsFormGroup.get(GarageConstant.LIST_TIERS) as FormControl;
  }

  get Body(): FormControl {
    return this.smsFormGroup.get(GarageConstant.BODY) as FormControl;
  }

  get SendDate(): FormControl {
    return this.smsFormGroup.get(GarageConstant.SEND_DATE) as FormControl;
  }

  get SendHour(): FormControl {
    return this.smsFormGroup.get(GarageConstant.SEND_HOUR) as FormControl;
  }
}
