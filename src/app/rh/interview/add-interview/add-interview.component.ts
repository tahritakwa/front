import {Component, ComponentRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {dateValueGT, dateValueLT, ValidationService} from '../../../shared/services/validation/validation.service';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {InterviewService} from '../../services/interview/interview.service';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {Interview} from '../../../models/rh/interview.model';
import {InterviewMark} from '../../../models/rh/interview-mark.model';
import {InterviewMarkEnumerator} from '../../../models/enumerators/interview.enum';
import {InterviewConstant} from '../../../constant/rh/interview.constant';
import {EmployeeMultiselectComponent} from '../../../shared/components/employee-multiselect/employee-multiselect.component';
import {RecruitmentState} from '../../../models/enumerators/recruitment-state.enum';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {Observable} from 'rxjs/Observable';
import {ExitEmployee} from '../../../models/payroll/exit-employee.model';
import {ExitEmployeeConstant} from '../../../constant/payroll/exit-employee.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-add-interview',
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.scss']
})
export class AddInterviewComponent implements OnInit, OnDestroy, IModalDialog {
  @ViewChild('requiredInerviewers') requiredInerviewersMultiselect: EmployeeMultiselectComponent;
  @ViewChild('optionalInerviewers') optionalInerviewersMultiselect: EmployeeMultiselectComponent;

  public interviewFormGroup: FormGroup;
  public isModal: boolean;
  public isUpdateMode: boolean;
  public options: Partial<IModalDialogOptions<any>>;
  public reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;
  public data: any;
  public idSubscription: Subscription;
  public inteviewSubscription: Subscription;
  public interviewToUpdate: Interview;
  public recruitmentId: number;
  public requiredInterviewMarkIds: number[];
  public optionalInterviewMarkIds: number[];
  public recruitmentState = RecruitmentState;
  public isReviewInterview: boolean;
  public associatedReviewId: number;
  public isEmployeeExitInterview: boolean;
  public employeeExitId: number;
  public exitEmployee: ExitEmployee;
  public isDelayMode = false;
  public isChangeMode = false;
  idEmployeeCollaborator: number;
  public recruitmentCreationDate: Date;
  public isCandidacy = false;
  public formatDate = this.translateService.instant(SharedConstant.DATE_FORMAT);

  constructor(public interviewService: InterviewService, private fb: FormBuilder, private router: Router,
              private modalService: ModalDialogInstanceService, private validationService: ValidationService,
              private translateService: TranslateService, private swalWarrings: SwalWarring) {
  }

  get InterviewMark(): FormArray {
    return this.interviewFormGroup.get(InterviewConstant.INTERVIEW_MARK) as FormArray;
  }

  get OptionalInterviewMark(): FormArray {
    return this.interviewFormGroup.get(InterviewConstant.OPTIONAL_INTERVIEW_MARK) as FormArray;
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.options.settings.closeButtonTitle = this.translateService.instant(SharedConstant.CLOSE);
    this.data = options.data;
    if (this.options.data) {
      const idEmployeeToIgnore = this.options.data.IdEmployeeCollaborator ? this.options.data.IdEmployeeCollaborator :
        this.options.data.Employee ? this.options.data.Employee.IdEmployee : null;
      if (idEmployeeToIgnore) {
        this.idEmployeeCollaborator = idEmployeeToIgnore;
      }
    }
    this.checkAddMode();
    this.checkUpdateRight();
    this.checkUpdateMode();


    this.closeDialogSubject = options.closeDialogSubject;
  }

  public checkAddMode() {
    if (this.options.data[InterviewConstant.REVIEW_MODE]) {
      this.isReviewInterview = true;
      this.associatedReviewId = this.options.data[InterviewConstant.REVIEW_ID];
    } else if (this.options.data[ExitEmployeeConstant.EMPLOYEE_EXIT_MODE]) {
      this.isEmployeeExitInterview = true;
      this.employeeExitId = this.options.data[ExitEmployeeConstant.EXIT_EMPLOYEE_ID];
      this.exitEmployee = this.options.data[ExitEmployeeConstant.EMPLOYEE];
    } else if (this.options.data[InterviewConstant.CANDIDACY_MODE]) {
      this.recruitmentId = this.options.data[InterviewConstant.ID_RECRUITMENT];
      this.recruitmentCreationDate = this.options.data[InterviewConstant.RECRUITMENT_CREATION_DATE];
      this.isCandidacy = true;
    }
  }

  /**
   * Build interview date validators
   */
  buildInterviewDateValidators() {
    if (this.isEmployeeExitInterview) {
      this.InterviewDate.setValidators([
        Validators.required,
        this.exitEmployee && this.exitEmployee.IdEmployeeNavigation.HiringDate ?
          dateValueGT(new Observable(o => o.next(new Date(this.exitEmployee.IdEmployeeNavigation.HiringDate)))) :
          dateValueGT(Observable.of(null)),
        this.exitEmployee && new Date(this.exitEmployee.ExitDepositDate) ?
          dateValueGT(new Observable(o => o.next(new Date(this.exitEmployee.ExitDepositDate)))) :
          dateValueGT(Observable.of(null))
      ]);
    } else if (this.isCandidacy) {
      this.InterviewDate.setValidators([
        Validators.required,
        this.recruitmentCreationDate ?
          dateValueGT(new Observable(o => o.next(new Date(this.recruitmentCreationDate)))) :
          dateValueGT(Observable.of(null))
      ]);
    } else {
      this.InterviewDate.setValidators([
        Validators.required,
        this.data.IdEmployeeNavigation && this.data.IdEmployeeNavigation.HiringDate ?
          dateValueGT(new Observable(o => o.next(new Date(this.data.IdEmployeeNavigation.HiringDate)))) :
          dateValueGT(Observable.of(null)),
        this.data.IdEmployeeNavigation && this.data.IdEmployeeNavigation.ResignationDate ?
          dateValueLT(new Observable(o => o.next(new Date(this.data.IdEmployeeNavigation.ResignationDate)))) :
          dateValueLT(Observable.of(null))
      ]);
    }
  }

  public checkUpdateRight() {
    if (this.options.data[InterviewConstant.INTERVIEW] != null) {
      this.interviewToUpdate = this.options.data[InterviewConstant.INTERVIEW];
      this.isDelayMode = this.options.data[InterviewConstant.IS_DELAY_MODE];
      this.isChangeMode = this.options.data[InterviewConstant.IS_CHANGE_MODE];
    }
  }

  public checkUpdateMode() {
    if (this.isChangeMode || this.isDelayMode) {
      if (this.interviewToUpdate.IdReview != null) {
        this.isReviewInterview = true;
      } else if (this.interviewToUpdate.IdExitEmployee != null) {
        this.isEmployeeExitInterview = true;
      }
    }
  }

  ngOnInit() {
    this.createFormGroup();
    if (this.interviewToUpdate) {
      this.prepareRequiredAndOptionalInterviewMarkFormArray();
      this.isUpdateMode = true;
    }
    this.disableInterviewControls();
  }

  disableInterviewControls() {
    if (this.isChangeMode) {
      this.StartTime.disable();
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

  prepareRequiredAndOptionalInterviewMarkFormArray() {
    if (this.interviewToUpdate && this.interviewToUpdate.InterviewMark) {

      this.patchInterviewMarkListInFormArray(this.interviewToUpdate.InterviewMark.filter(x => x.IsRequired), this.InterviewMark);
      this.requiredInterviewMarkIds = this.interviewToUpdate.InterviewMark.filter(x => x.IsRequired).map(({IdEmployee}) => IdEmployee);
      if (this.interviewToUpdate.OptionalInterviewMark) {
        this.patchInterviewMarkListInFormArray(this.interviewToUpdate.OptionalInterviewMark, this.OptionalInterviewMark);
        this.optionalInterviewMarkIds = this.interviewToUpdate.OptionalInterviewMark.map(({IdEmployee}) => IdEmployee);
      }
    }
  }

  patchInterviewMarkListInFormArray(interviewMarkList: InterviewMark[], interviewMarkFormArray: FormArray) {
    for (const currentRequiredInterviewMark of interviewMarkList) {
      interviewMarkFormArray.push(this.newInterviewMarkFormGroup(currentRequiredInterviewMark));
    }
  }

  public createFormGroup() {
    this.interviewFormGroup = this.fb.group({
      Id: [this.interviewToUpdate ? this.interviewToUpdate.Id : 0],
      IdCandidacy: [this.interviewToUpdate ? this.interviewToUpdate.IdCandidacy : undefined],
      IdInterviewType: [this.interviewToUpdate ? this.interviewToUpdate.IdInterviewType : undefined],
      InterviewDate: [this.interviewToUpdate ? new Date(this.interviewToUpdate.InterviewDate) : undefined, Validators.required],
      StartTime: [this.interviewToUpdate ? this.interviewToUpdate.StartTime : undefined, [Validators.required]],
      InterviewMark: this.fb.array([], Validators.required),
      OptionalInterviewMark: this.fb.array([]),
      IdSupervisor: [this.interviewToUpdate ? this.interviewToUpdate.IdSupervisor : undefined, [Validators.required]],
      EndTime: [this.interviewToUpdate ? this.interviewToUpdate.EndTime : undefined, [Validators.required]],
    });
    if (this.isCandidacy) {
      this.interviewFormGroup.controls[InterviewConstant.ID_CANDIDACY].setValidators(Validators.required);
      this.interviewFormGroup.controls[InterviewConstant.ID_INTERVIEW_TYPE].setValidators(Validators.required);
    }
    this.buildInterviewDateValidators();
  }

  newInterviewMarkFormGroup(newInterviewMark: InterviewMark): FormGroup {
    return this.fb.group({
      Id: [newInterviewMark.Id],
      IsRequired: [newInterviewMark.IsRequired],
      Status: [newInterviewMark.Status],
      IdEmployee: [newInterviewMark.IdEmployee],
      IdInterview: [newInterviewMark.IdInterview],
      IsDeleted: [false]
    });
  }

  requiredInterviewerSelected(employeeMultiSelectData) {
    this.requiredInterviewMarkIds = employeeMultiSelectData;
    this.updateInterviewFormArray(this.InterviewMark, this.requiredInterviewMarkIds, true);
    if (this.requiredInterviewMarkIds.length === NumberConstant.ZERO && this.interviewToUpdate === undefined) {
      this.interviewFormGroup.controls[InterviewConstant.INTERVIEW_MARK] = this.fb.array([]);
    }
    this.optionalInerviewersMultiselect.employeesToIgnore = this.requiredInterviewMarkIds;
    this.optionalInerviewersMultiselect.ngOnInit();
  }

  updateInterviewFormArray(interviewMarkFormArray: FormArray, interviewMarkIds: number[], isRequired: boolean) {
    if (interviewMarkIds && interviewMarkIds.length > NumberConstant.ZERO) {
      interviewMarkFormArray.value.filter(x => interviewMarkIds.find(y => y === x.IdEmployee))
        .map((obj) => {
          obj.IsDeleted = false;
          return obj;
        });
      interviewMarkFormArray.value.filter(x =>
        !interviewMarkIds.find(y => y === x.IdEmployee)).map((obj) => {
        obj.IsDeleted = true;
        return obj;
      });
      const index = interviewMarkFormArray.value.findIndex(x => x.Id === NumberConstant.ZERO &&
        !interviewMarkIds.find(y => y === x.IdEmployee) && x.IsDeleted);
      if (index !== NumberConstant.MINUS_ONE) {
        interviewMarkFormArray.removeAt(index);
      }
    } else {
      interviewMarkFormArray.value.map((obj) => {
        obj.IsDeleted = true;
        return obj;
      });
    }
    const element = interviewMarkIds.filter(x => interviewMarkFormArray.value
      .map(y => y.IdEmployee).indexOf(x) === NumberConstant.MINUS_ONE)[NumberConstant.ZERO];
    if (element) {
      interviewMarkFormArray.push(this.newInterviewMarkFormGroup(
        this.newInterviewMarkByParams(element, this.interviewToUpdate ? this.interviewToUpdate.Id : 0, isRequired)));
    }
  }

  optionalInterviewerSelected(employeeMultiSelectData) {
    this.optionalInterviewMarkIds = employeeMultiSelectData;
    this.updateInterviewFormArray(this.OptionalInterviewMark, this.optionalInterviewMarkIds, false);
    if (this.optionalInterviewMarkIds.length === NumberConstant.ZERO && (this.interviewToUpdate === undefined ||
      (this.interviewToUpdate && this.interviewToUpdate.OptionalInterviewMark.length === NumberConstant.ZERO))) {
      this.interviewFormGroup.controls[InterviewConstant.OPTIONAL_INTERVIEW_MARK] = this.fb.array([]);
    }
    this.requiredInerviewersMultiselect.employeesToIgnore = this.optionalInterviewMarkIds;
    this.requiredInerviewersMultiselect.ngOnInit();
  }

  newInterviewMarkByParams(currentEmployeeId: number, interviewId: number, isRequired: boolean): InterviewMark {
    const newInterviewMark = new InterviewMark();
    newInterviewMark.Id = 0;
    newInterviewMark.IsRequired = isRequired;
    newInterviewMark.Status = InterviewMarkEnumerator.InterviewMarkRequestedToInterviewer;
    newInterviewMark.IdEmployee = currentEmployeeId;
    newInterviewMark.IdInterview = interviewId;
    return newInterviewMark;
  }

  existInInterviewMarkList(employeeId, interviewMarkList: FormArray): boolean {
    let exist = false;
    for (const currentInterviewMark of interviewMarkList.controls) {
      if ((currentInterviewMark as FormGroup).controls[InterviewConstant.ID_EMPLOYEE].value === employeeId) {
        exist = true;
      }
    }
    return exist;
  }

  save() {
    if (this.isModal && this.interviewFormGroup.valid) {
      this.saveInterviewAndCloseModal();
    } else {
      this.validationService.validateAllFormFields(this.interviewFormGroup);
    }
  }

  saveInterviewAndCloseModal(): any {
    const interview: Interview = Object.assign({}, this.interviewToUpdate, this.interviewFormGroup.getRawValue());
    interview.InterviewMark = this.InterviewMark.value;
    interview.OptionalInterviewMark = this.OptionalInterviewMark.value;
    if (this.isReviewInterview) {
      interview.IdReview = interview.IdReview == null ? this.associatedReviewId : interview.IdReview;
    } else if (this.isEmployeeExitInterview) {
      interview.IdExitEmployee = interview.IdExitEmployee == null ? this.employeeExitId : interview.IdExitEmployee;
    }
    this.interviewService.checkInterviewHasAnotherInterview(interview).toPromise().then(result => {
      if (result) {
        this.swalWarrings.CreateSwal(InterviewConstant.INTERVIEWER_HAS_ANOTHER_INTERVIEW, undefined,
          SharedConstant.YES, SharedConstant.NO).then((confirmation) => {
          if (confirmation.value) {
            this.interviewToSave(interview);
          }
        });
      } else {
        this.interviewToSave(interview);
      }
    });
  }

  interviewToSave(interview: Interview) {
    this.interviewService.save(interview, !this.isUpdateMode).subscribe(result => {
      this.options.data = result;
      this.options.onClose();
      this.modalService.closeAnyExistingModalDialog();
    });
  }

  get IdSupervisor(): FormControl {
    return this.interviewFormGroup.get(InterviewConstant.ID_SUPERVISOR) as FormControl;
  }
  get InterviewDate(): FormControl {
    return this.interviewFormGroup.get(InterviewConstant.INTERVIEW_DATE) as FormControl;
  }
  get StartTime(): FormControl {
    return this.interviewFormGroup.get(InterviewConstant.START_TIME) as FormControl;
  }
  get EndTime(): FormControl {
    return this.interviewFormGroup.get(InterviewConstant.END_TIME) as FormControl;
  }
}
