import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RecruitmentConstant } from '../../../constant/rh/recruitment.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { RecruitmentState } from '../../../models/enumerators/recruitment-state.enum';
import { Recruitment } from '../../../models/rh/recruitment.model';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { JobSkillsService } from '../../../payroll/services/job-skills/job-skills.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { MessageAdministrativeDocumentsService } from '../../../shared/services/signalr/message-administrative-documents/message-administrative-documents.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { StarkPermissionsService } from '../../../stark-permissions/stark-permissions.module';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { GenericRecruitmentAddComponent } from '../../generic-recruitment-add/generic-recruitment-add.component';
import { RecruitmentLanguageService } from '../../services/recruitment-language/recruitment-language.service';
import { RecruitmentSkillsService } from '../../services/recruitment-skills/recruitment-skills.service';
import { RecruitmentService } from '../../services/recruitment/recruitment.service';


@Component({
  selector: 'app-recruitment-need',
  templateUrl: './recruitment-need.component.html',
  styleUrls: ['./recruitment-need.component.scss']
})
export class RecruitmentNeedComponent extends GenericRecruitmentAddComponent implements OnInit {
  /**
   *
   * @param fb
   * @param router
   * @param recruitmentService
   * @param validationService
   */
  recruitmentStateEnum = RecruitmentState;
  public hasUpdateRecruitment: boolean;
  public hasStartRecruitmentPermission: boolean;
  public hasAddPermission: boolean;

  constructor(
    protected router: Router,
    protected recruitmentService: RecruitmentService,
    protected validationService: ValidationService,
    protected jobSkillsService: JobSkillsService,
    protected fb: FormBuilder,
    protected recruitmentSkillsService: RecruitmentSkillsService,
    protected recruitmentLanguageService: RecruitmentLanguageService,
    protected translate: TranslateService,
    protected swalWarrings: SwalWarring,
    protected messageAdministrativeDocumentsService: MessageAdministrativeDocumentsService,
    protected rolesService: StarkRolesService,
    protected employeeService: EmployeeService,
    protected permissionsService: StarkPermissionsService,
    protected authService: AuthService) {
    super(
      fb,
      router,
      recruitmentService,
      validationService,
      recruitmentSkillsService,
      recruitmentLanguageService,
      translate,
      swalWarrings,
      messageAdministrativeDocumentsService,
      employeeService,
      permissionsService,
      jobSkillsService,
      authService
    );
    this.hasUpdateRecruitment = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENT);
    this.hasStartRecruitmentPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.START_RECRUITMENT_PROCESS);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_RECRUITMENT);
  }

  get YearOfExperience(): FormControl {
    return this.recruitmentNeedFormGroup.get(RecruitmentConstant.YEAR_OF_EXPERIENCE) as FormControl;
  }

  get WorkingHoursPerDays(): FormControl {
    return this.recruitmentNeedFormGroup.get(RecruitmentConstant.WORKING_HOURS_PER_DAYS) as FormControl;
  }

  ngOnInit() {
    super.ngOnInit();
    this.createForm(this.currentRecruitment);
    this.getDataToUpdate();
  }

  public createForm(currentRecruitment?: Recruitment) {
    this.recruitmentNeedFormGroup = this.fb.group({
      IdJob: [currentRecruitment ? currentRecruitment.IdJob : '', Validators.required],
      IdQualificationType: [currentRecruitment ? currentRecruitment.IdQualificationType : '', Validators.required],
      Priority: [currentRecruitment ? currentRecruitment.Priority : '', Validators.required],
      YearOfExperience: [currentRecruitment ? currentRecruitment.YearOfExperience : '', [Validators.required,
        Validators.compose([Validators.min(NumberConstant.ZERO), Validators.max(NumberConstant.TWENTY), Validators.pattern('[0-9]+')])]],
      WorkingHoursPerDays: [currentRecruitment ? currentRecruitment.WorkingHoursPerDays : '', [Validators.required,
        Validators.min(NumberConstant.ONE), Validators.max(NumberConstant.TWENTY_FOOR)]],
      Description: [currentRecruitment ? currentRecruitment.Description : '',
        [Validators.required, Validators.maxLength(NumberConstant.FIVE_HUNDRED)]],
      Id: [currentRecruitment ? currentRecruitment.Id : 0],
      Type: [currentRecruitment ? currentRecruitment.Type : this.recruitmentType.RecruitmentSession],
      IdOffice: [currentRecruitment ? currentRecruitment.IdOffice : '', Validators.required],
      ExpectedCandidateNumber: [currentRecruitment ? currentRecruitment.ExpectedCandidateNumber : '',
        [Validators.required, Validators.compose([Validators.min(NumberConstant.ONE),
          Validators.max(NumberConstant.ONE_HUNDRED), Validators.pattern('[0-9]+')])]],
      RecruitmentSkills: this.fb.array([]),
      RecruitmentLanguage: this.fb.array([])
    });
    if (currentRecruitment && currentRecruitment.Id !== NumberConstant.ZERO && !this.hasUpdateRecruitment) {
      this.recruitmentNeedFormGroup.disable();
    }
  }

  validateRecruitment() {
    if (this.currentRecruitment.State === this.recruitmentState.Draft) {
      this.save(true);
    }
  }

  backToList() {
    this.router.navigateByUrl(RecruitmentConstant.RECRUTEMENT_LIST_URL);
  }

}
