import {Component, ComponentRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReminderEventService} from '../../services/reminder-event/reminder-event.service';
import {ReminderEvent} from '../../../models/crm/ReminderEvent';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {Observable} from 'rxjs/Observable';
import {GenericCrmService} from '../../generic-crm.service';
import {Subscription} from 'rxjs/Subscription';
import {ReminderConstant} from '../../../constant/crm/reminder.constant';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {ExactDate} from '../../../shared/helpers/exactDate';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import {UserService} from '../../../administration/services/user/user.service';

@Component({
  selector: 'app-reminder-event',
  templateUrl: './reminder-event.component.html',
  styleUrls: ['./reminder-event.component.scss']
})
export class ReminderEventComponent implements OnInit, OnDestroy, IModalDialog {
  public addFormGroup: FormGroup;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public reminderDate;
  public reminderToSave: ReminderEvent;
  public connectedUser;
  @Input() selectedDate;
  @Input() reminderToSaveFromCalendar: Observable<any>;
  @Input() reminderToCloseFromCalendar: Observable<any>;
  @Output() saveIsDone = new EventEmitter<boolean>();
  private saveEventSubscription: Subscription;
  private closeEventSubscription: Subscription;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public isModal: boolean;
  public reminderData: ReminderEvent;
  private connectedUserId: any;
  constructor(private fb: FormBuilder,
              private reminderEventService: ReminderEventService,
              private growlService: GrowlService,
              private translate: TranslateService,
              private validationService: ValidationService,
              private exactDate: ExactDate,
              public genericCrmService: GenericCrmService,
              private modalService: ModalDialogInstanceService,
              private swallWarning: SwalWarring,
              private localStorageService: LocalStorageService,
              private userService: UserService) {
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.isModal = true;
    this.reminderData = this.optionDialog.data.reminderData;
  }

  ngOnInit() {
    this.getConnectedUser();
    this.createAddForm();
    if (this.isModal) {
      this.addFormGroup.patchValue(this.reminderData);
      this.initDateFromCalender(new Date(this.reminderData.reminderDate));
      // this.selectedType = this.frequencyTypeList.find(type => this.reminderData.type === type);
    } else {
      this.initDateFromCalender(this.selectedDate._d);
      this.initSaveReminderEvent();
      this.popUpIsClosed();
    }
    this.getUserByEmail();
  }

  private initSaveReminderEvent() {
    if (this.reminderToSaveFromCalendar) {
      this.saveEventSubscription = this.reminderToSaveFromCalendar.subscribe((data) => {
        if (data && data.type === ReminderConstant.REMINDER && data.value === true) {
          this.save();
        }
      });
    }
  }

  private popUpIsClosed() {
    if (this.reminderToCloseFromCalendar) {
      this.closeEventSubscription = this.reminderToCloseFromCalendar.subscribe((data) => {
        if (data && data.type === ReminderConstant.REMINDER && data.value === true) {
          this.addFormGroup.reset();
        }
      });
    }
  }

  private initDateFromCalender(date) {
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(date)) {
      if (this.isModal) {
        this.reminderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
          date.getHours(), date.getMinutes());
      } else {
        this.reminderDate = new Date(date.getUTCFullYear(), date.getUTCMonth(),
          date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes());
      }
    }
  }

  private createAddForm(): void {
    this.addFormGroup = this.fb.group({
      name: ['', [Validators.required]],
      reminderDate: [''],
      description: ['']
    });
  }

  save() {
    if (this.addFormGroup.valid) {
      this.reminderEventService.getJavaGenericService().saveEntity(this.convertFormToReminder(this.addFormGroup))
        .subscribe((data) => {
          if (data) {
            this.growlService.successNotification(this.translate.instant(ReminderConstant.SUCCESS_OPERATION));
            this.saveIsDone.emit(true);
          }
        });
    } else {
      this.validationService.validateAllFormFields(this.addFormGroup);
    }
  }

  update() {
    if (this.addFormGroup.valid) {
      this.reminderEventService.getJavaGenericService().updateEntity(this.convertFormToReminder(this.addFormGroup), this.reminderData.id)
        .subscribe((data) => {
          if (data) {
            this.growlService.successNotification(this.translate.instant(ReminderConstant.SUCCESS_OPERATION));
            this.onCancel();
          }
        });
    } else {
      this.validationService.validateAllFormFields(this.addFormGroup);
    }
  }

  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
  }

  convertFormToReminder(form: FormGroup) {
    this.reminderToSave = form.value;
    this.reminderToSave.commercialAssignedToId = this.connectedUserId;
    // this.reminderToSave.type = this.selectedType;
    this.reminderToSave.reminderDate = this.exactDate.getDateExact(new Date(this.reminderDate.getFullYear(), this.reminderDate.getMonth(),
      this.reminderDate.getDate(), this.reminderDate.getHours(), this.reminderDate.getMinutes()));
    return this.reminderToSave;
  }

  ngOnDestroy(): void {
    if (this.saveEventSubscription) {
      this.saveEventSubscription.unsubscribe();
    }
  }

  onCancel() {
    this.addFormGroup.reset();
    this.optionDialog.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }

  delete() {
    this.swallWarning.CreateSwal(this.translate.instant(ReminderConstant.POP_UP_DELETE_REMINDER_EVENT_TEXT)).then(result => {
      if (result.value) {
        this.reminderEventService.getJavaGenericService().deleteEntity(this.reminderData.id).subscribe(data => {
          this.growlService.successNotification(this.translate.instant(ReminderConstant.SUCCESS_OPERATION));
          this.onCancel();
        });
      }
    });
  }
  getUserByEmail() {
    this.userService.getByEmail(this.connectedUser.Email).subscribe(
      (user) => {
        const us = user;
        this.connectedUserId = user.Id;
      }
    );
  }
}
