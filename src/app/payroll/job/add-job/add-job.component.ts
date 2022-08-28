import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EmployeeDropdownComponent} from '../../../shared/components/employee-dropdown/employee-dropdown.component';
import {EmployeeService} from '../../services/employee/employee.service';
import {Employee} from '../../../models/payroll/employee.model';
import {Job} from '../../../models/payroll/job.model';
import {JobEmployee} from '../../../models/payroll/job-employee.model';
import {JobSkills} from '../../../models/payroll/job-skill.model';
import {JobService} from '../../services/job/job.service';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {JobConstant} from '../../../constant/payroll/job.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';

declare var Quill: any;

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class AddJobComponent implements OnInit, OnDestroy {
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public isModal = false;
  jobFormGroup: FormGroup;
  /*
 * is updateMode
 */
  // Public isUpdateMode: boolean;
  rate: any;
  skills: any[] = new Array<any>();
  employees: any[] = new Array<any>();
  isShowSkill: boolean;
  employeeError: string;
  DesignationJob: string;
  @ViewChild(EmployeeDropdownComponent) childEmployee;
  searchValueEmployee: string;
  @Input() selectedJob: Job;
  @Output() refresh = new EventEmitter<any>();
  @Input() isUpdateMode: boolean;
  selectedSkill: number;
  jobToIgnore: number;
  public hasShowPermission: boolean;
  /*
 * Id Entity
 */
  private id: number;
  /*
 * id Subscription
 */
  private idSubscription: Subscription;
  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private translate: TranslateService,
              private employeeService: EmployeeService, private jobService: JobService, public validationService: ValidationService,
              private changeDetector: ChangeDetectorRef, private modalService: ModalDialogInstanceService) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    });
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
  }

  onkeyup($event) {
    this.changeDetector.detectChanges();
  }

  addNewSkill() {
    this.setClassSkill('vertical-center disabledDiv');
    this.skills.unshift({
      'IdSkill': undefined,
      'Rate': 0,
      'IsNewSkill': true,
      'HasError': false,
      'IsShowSkill': false,
      'errorValidationSkill': this.translate.instant('FORM_VALIDATION_REQUIRED'),
      'errorValidationRate': this.translate.instant('FORM_VALIDATION_REQUIRED')
    });

  }

  onSelectSkill($event, skill) {
    if (!$event) {
      skill.HasError = true;
      skill.errorValidationSkill = this.translate.instant('FORM_VALIDATION_REQUIRED');
      skill.errorValidationRate = this.translate.instant('FORM_VALIDATION_REQUIRED');
      (this.skills.find(x => x.IdSkill === skill.IdSkill)).IdSkill = undefined;
      (this.skills.find(x => x.IdSkill === skill.IdSkill)).Rate = 0;
    } else {
      skill.HasError = false;
      const findSkill = this.skills.find(x => (x.IdSkill === $event));
      if (findSkill) {
        skill.IsNewSkill = false;
        skill.HasError = true;
        skill.errorValidationSkill = this.translate.instant('FORM_VALIDATION_UNIQUE');
      }
      skill.IdSkill = $event;
    }
  }

  rateChange($event, skill) {
    if ((!(skill.HasError && skill.errorValidationSkill === this.translate.instant('FORM_VALIDATION_UNIQUE'))) &&
      $event > 0 && skill.Rate === $event) {
      skill.HasError = false;
    }
  }

  saveSkill(skill) {
    if (skill.IdSkill && skill.Rate && this.skills.filter(x => x.IdSkill === skill.IdSkill && !x.IsNewSkill).length
      === NumberConstant.ZERO) {
      skill.IsNewSkill = false;
      skill.IsShowSkill = true;
      skill.HasError = false;
      this.verifDisableSkill();
    } else if (!skill.IdSkill) {
      skill.errorValidationSkill = this.translate.instant('FORM_VALIDATION_REQUIRED');
      skill.HasError = true;
    }
  }

  deleteSkill(skill) {
    this.skills.splice(this.skills.indexOf(skill), 1);
    if (this.skills.find(x => x.IdSkill === skill.IdSkill)) {
      (this.skills.find(x => x.IdSkill === skill.IdSkill)).HasError = false;
    }
    this.verifDisableSkill();
  }

  editSkill(skill) {
    this.setClassSkill('vertical-center disabledDiv');
    skill.IsNewSkill = true;
    skill.IsShowSkill = false;
  }

  verifDisableSkill() {
    const skill = this.skills.find(x => (x.IsNewSkill));
    if (skill) {
      this.setClassSkill('vertical-center disabledDiv');
    } else {
      this.setClassSkill('vertical-center');
    }
  }

  setClassSkill(className: string) {
    document.getElementById('divButtonAddSkill').setAttribute('class', className);
  }

  onSelectEmployee($event) {
    if (!$event.selectedEmployee) {
      document.getElementById('divButtonAddEmployee').setAttribute('class', 'disabledDiv');
      this.employeeError = undefined;
    } else {
      document.getElementById('divButtonAddEmployee').setAttribute('class', '');
    }
  }

  addNewEmployee(dataView) {
    if (this.childEmployee.selectedEmployee) {
      const findEmployee = this.employees.find(x => (x.Id === this.childEmployee.selectedEmployee));
      if (findEmployee) {
        this.employeeError = this.translate.instant('FORM_VALIDATION_UNIQUE');
      } else {
        this.employeeError = undefined;
        this.subscriptions.push(this.employeeService.getById(this.childEmployee.selectedEmployee).subscribe((data: Employee) => {
          if (data && data.PictureFileInfo && data.PictureFileInfo.Data) {
            data['SrcImg'] = 'data:image/png;base64,' + data.PictureFileInfo.Data;
          } else {
            data['SrcImg'] = '../../../../assets/image/user-new-icon.png';
          }
          this.DesignationJob = this.jobFormGroup.value['Designation'];
          this.searchValueEmployee = '';
          dataView.filter('');
          this.employees.unshift(data);
          this.childEmployee.selectedEmployee = 0;
          document.getElementById('divButtonAddEmployee').setAttribute('class', 'disabledDiv');

        }));
      }
    }
  }

  deleteEmployee(employee, dataView) {
    this.searchValueEmployee = '';
    dataView.filter('');
    this.employees.splice(this.employees.indexOf(employee), 1);
  }

  cancelAddJob() {
    this.refresh.emit(true);
  }

  saveJob() {
    this.validateSkills();
    if (this.jobFormGroup.valid) {
      const jobToSave: Job = this.prepareJobToSave();
      if (jobToSave) {
        this.subscriptions.push(this.jobService.save(jobToSave, !this.isUpdateMode).subscribe(res => {
          this.refresh.emit(true);
          if (this.isModal) {
            this.dialogOptions.onClose();
            this.modalService.closeAnyExistingModalDialog();
          }
        }));
      }
    } else {
      this.validationService.validateAllFormFields(this.jobFormGroup);
    }
  }

  prepareJobToSave(): Job {
    const jobEmployee: Array<JobEmployee> = new Array<JobEmployee>();
    this.employees.forEach((x) => {
      const jobEmpl = new JobEmployee(this.jobFormGroup.controls['Id'].value, x.Id);
      if (jobEmpl) {
        jobEmployee.push(jobEmpl);
      }
    });
    const jobSkills: Array<JobSkills> = new Array<JobSkills>();
    this.skills.forEach((x) => {
      const jobSki = new JobSkills(this.jobFormGroup.controls['Id'].value, x.IdSkill, x.Rate);
      if (jobSki) {
        jobSkills.push(jobSki);
      }
    });
    const jobToSave: Job = new Job(this.jobFormGroup.controls['Designation'].value, this.jobFormGroup.controls['FunctionSheet'].value,
      this.jobFormGroup.controls['IdJob'].value, jobEmployee, jobSkills);
    jobToSave.Id = this.id;
    return jobToSave;
  }

  /**
   * Validate the skills
   */
  validateSkills() {
    // If they are skills dropdown with not selected label
    let emptySkills = this.skills.find(x => !x.IdSkill || x.Rate <= NumberConstant.ZERO);
    if (emptySkills) {
      this.jobFormGroup.addControl(JobConstant.IS_SKILLS_EMPTY, new FormControl('', Validators.required));
      emptySkills.HasError = true;
      emptySkills.errorValidationSkill = this.translate.instant('FORM_VALIDATION_REQUIRED');
    } else if (!emptySkills && this.jobFormGroup.controls[JobConstant.IS_SKILLS_EMPTY]) {
      this.jobFormGroup.removeControl(JobConstant.IS_SKILLS_EMPTY);
    }

    // If they are two skills with the same label
    let skillsOccurrences = [];
    // Get all the skills occurences
    for (let i = 0, j = this.skills.length; i < j; i++) {
      skillsOccurrences[this.skills[i].IdSkill] = (skillsOccurrences[this.skills[i].IdSkill] || 0) + 1;
    }

    // Check if the skills occurences are greater than or equals 2
    let keepGoing = true;
    skillsOccurrences.forEach((x) => {
      if (keepGoing && x >= NumberConstant.TWO) {
        this.jobFormGroup.addControl(JobConstant.IS_SKILLS_DUPLICATE, new FormControl('', Validators.required));
        if (this.skills.find(y => y.IdSkill === skillsOccurrences.indexOf(x))) {
          (this.skills.find(y => y.IdSkill === skillsOccurrences.indexOf(x))).HasError = true;
          (this.skills.find(y => y.IdSkill === skillsOccurrences.indexOf(x))).errorValidationSkill =
            this.translate.instant('FORM_VALIDATION_UNIQUE');
        }
        keepGoing = false;
      }
    });

    // Set the form group
    if (keepGoing && this.jobFormGroup.controls[JobConstant.IS_SKILLS_DUPLICATE]) {
      this.jobFormGroup.removeControl(JobConstant.IS_SKILLS_DUPLICATE);
    }
    this.jobFormGroup.updateValueAndValidity();
  }

  ngOnInit() {
    this.createAddForm();
    this.employees = new Array<any>();
    if (this.isUpdateMode) {
      this.id = this.selectedJob.Id;
      this.getDataToUpdate();
    }

  }

  ngOnDestroy(): void {
    this.idSubscription.unsubscribe();
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * create add form
   * */
  private createAddForm(): void {
    this.jobFormGroup = this.formBuilder.group({
      Id: [0],
      Designation: ['', Validators.required],
      FunctionSheet: [''],
      IdJob: [this.selectedJob ? (!this.isUpdateMode ? this.selectedJob.Id : this.selectedJob.IdUpperJob) : undefined]
    });
  }

  /**
   *  get data to update
   */
  private getDataToUpdate(): void {
    this.subscriptions.push(this.jobService.getById(this.id).subscribe(data => {
      this.jobToIgnore = data.Id;
      this.jobFormGroup.patchValue(data);
      this.skills = new Array<any>();
      this.employees = new Array<any>();
      if (data.JobSkills) {
        data.JobSkills.forEach(jobSk => {
          this.skills.push({
            'IdSkill': jobSk.IdSkill,
            'Name': jobSk.IdSkillNavigation.Code,
            'Rate': jobSk.Rate,
            'IsNewSkill': false,
            'HasError': false,
            'IsShowSkill': true,
            'errorValidationSkill': this.translate.instant('FORM_VALIDATION_REQUIRED'),
            'errorValidationRate': this.translate.instant('FORM_VALIDATION_REQUIRED')
          });
        });
      }
      if (data.JobEmployee) {
        data.JobEmployee.forEach(jobEmpl => {
          if (jobEmpl.IdEmployeeNavigation && jobEmpl.IdEmployeeNavigation.PictureFileInfo
            && jobEmpl.IdEmployeeNavigation.PictureFileInfo.Data) {
            jobEmpl.IdEmployeeNavigation['SrcImg'] = 'data:image/png;base64,' + jobEmpl.IdEmployeeNavigation.PictureFileInfo.Data;
          } else {
            jobEmpl.IdEmployeeNavigation['SrcImg'] = '../../../../assets/image/user-new-icon.png';
          }
          this.employees.push(jobEmpl.IdEmployeeNavigation);
        });
        this.DesignationJob = this.jobFormGroup.value['Designation'];
      }
    }));
  }
}
