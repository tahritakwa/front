import { Component, OnInit, OnDestroy, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Interview } from '../../../models/rh/interview.model';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { InterviewService } from '../../services/interview/interview.service';
import { InterviewConstant } from '../../../constant/rh/interview.constant';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { Subscription } from 'rxjs/Subscription';
import { InterviewEnumerator } from '../../../models/enumerators/interview.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-postpone-interview',
  templateUrl: './postpone-interview.component.html',
  styleUrls: ['./postpone-interview.component.scss']
})
export class PostponeInterviewComponent implements OnInit, OnDestroy, IModalDialog {

  public options: Partial<IModalDialogOptions<any>>;
  public cancelInterviewFormGroup: FormGroup;
  public currentInterview: Interview;
  public isReview: boolean;
  public idSubscription: Subscription;
  public inteviewSubscription: Subscription;
  public isCancelMode: boolean;
  public isDelayMode: boolean;
  public isEmployeeExit: boolean;

  public formatDate =this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private fb: FormBuilder,
    private validationService: ValidationService,
    private modalService: ModalDialogInstanceService,
    private interviewService: InterviewService,
    private swalWarrings: SwalWarring, private translate: TranslateService) {
    this.isReview = false;
    this.isEmployeeExit = false;
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.options = options;
    this.isCancelMode = true;
    if (this.options.data[InterviewConstant.IS_CANCEL_MODE]) {
      this.isCancelMode = true;
      this.isDelayMode = false;
    } else if (this.options.data[InterviewConstant.IS_CANCEL_MODE_MEETING]) {
      this.isCancelMode = true;
      this.isDelayMode = false;
    } else {
      this.isCancelMode = false;
      this.isDelayMode = true;
    }
    if (this.options.data[InterviewConstant.INTERVIEW]) {
      this.currentInterview = this.options.data[InterviewConstant.INTERVIEW];
      this.options.data = undefined;
    }
    if (this.currentInterview.IdReview) {
      this.isReview = true;
    } else if (this.currentInterview.IdExitEmployee) {
      this.isEmployeeExit = true;
    }
  }

  ngOnInit() {
    if (this.isCancelMode) {
      this.createFormGroup();
    } else if (this.isDelayMode) {
      this.createFormGroup();
      this.cancelInterviewFormGroup.addControl(InterviewConstant.INTERVIEW_DATE,
        new FormControl(this.currentInterview ? new Date(this.currentInterview.InterviewDate) : undefined,
          Validators.required));
      this.cancelInterviewFormGroup.addControl(InterviewConstant.START_TIME,
        new FormControl(this.currentInterview ? this.currentInterview.StartTime : undefined,
          Validators.required));
    }
  }

  ngOnDestroy(): void {
    if (this.idSubscription !== undefined) {
      this.idSubscription.unsubscribe();
    }
    if (this.inteviewSubscription !== undefined) {
      this.inteviewSubscription.unsubscribe();
    }
  }

  public createFormGroup() {
    this.cancelInterviewFormGroup = this.fb.group({
      Id: [this.currentInterview.Id],
      Remarks: [this.currentInterview.Remarks ? this.currentInterview.Remarks : undefined,
        [Validators.required, Validators.min(NumberConstant.FIVE)]],
    });
  }

  public confirmPostpone() {
    if (this.isCancelMode) {
      this.cancelInterview();
    } else if (this.isDelayMode) {
      this.delayInterview();
    }
  }

  private cancelInterview() {
    if (this.cancelInterviewFormGroup.valid) {
      this.currentInterview.Remarks = this.cancelInterviewFormGroup.controls[InterviewConstant.REMARKS].value;
      this.swalWarrings.CreateSwal(InterviewConstant.CANCEL_INTERVIEW_WARNING, InterviewConstant.CANCEL_INTERVIEW,
        SharedConstant.VALIDATION_CONFIRM).then((result) => {
        if (result.value) {
          this.interviewService.cancelInterview(this.currentInterview).subscribe(res => {
            this.options.data = res;
            this.options.onClose();
            this.modalService.closeAnyExistingModalDialog();
          });
        }
      });
    } else {
      this.validationService.validateAllFormFields(this.cancelInterviewFormGroup);
    }
  }

  private delayInterview() {
    if (this.cancelInterviewFormGroup.valid) {
      const interview: Interview = Object.assign({}, this.currentInterview, this.cancelInterviewFormGroup.getRawValue());
      interview.Status = InterviewEnumerator.InterviewReported;

      this.swalWarrings.CreateSwal(InterviewConstant.DELAY_INTERVIEW_WARNING, InterviewConstant.DELAY_INTERVIEW,
        SharedConstant.VALIDATION_CONFIRM).then((result) => {
        if (result.value) {
          this.interviewService.save(interview, !this.isDelayMode).subscribe(res => {
            this.options.data = res;
            this.options.onClose();
            this.modalService.closeAnyExistingModalDialog();
          });
        }
      });

    } else {
      this.validationService.validateAllFormFields(this.cancelInterviewFormGroup);
    }
  }
}
