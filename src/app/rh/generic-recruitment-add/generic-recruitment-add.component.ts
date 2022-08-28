import { EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { RecruitmentConstant } from '../../constant/rh/recruitment.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { NumberConstant } from '../../constant/utility/number.constant';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { AdministrativeDocumentStatusEnumerator } from '../../models/enumerators/administrative-document-status.enum';
import { RecruitmentOfferStatus } from '../../models/enumerators/recruitment-offer-status.enum';
import { RecruitmentState } from '../../models/enumerators/recruitment-state.enum';
import { RecruitmentType } from '../../models/enumerators/recruitment-type.enum';
import { JobSkills } from '../../models/payroll/job-skill.model';
import { RecruitmentLanguage } from '../../models/rh/recruitment-language.model';
import { RecruitmentSkills } from '../../models/rh/recruitment-skills.model';
import { Recruitment } from '../../models/rh/recruitment.model';
import { Comment } from '../../models/shared/comment.model';
import { FileInfo } from '../../models/shared/objectToSend';
import { EmployeeService } from '../../payroll/services/employee/employee.service';
import { JobSkillsService } from '../../payroll/services/job-skills/job-skills.service';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { MessageAdministrativeDocumentsService } from '../../shared/services/signalr/message-administrative-documents/message-administrative-documents.service';
import { dateValueGT, ValidationService } from '../../shared/services/validation/validation.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../shared/utils/predicate';
import { StarkRolesService } from '../../stark-permissions/service/roles.service';
import { StarkPermissionsService } from '../../stark-permissions/stark-permissions.module';
import { PermissionConstant } from '../../Structure/permission-constant';
import { RecruitmentLanguageService } from '../services/recruitment-language/recruitment-language.service';
import { RecruitmentSkillsService } from '../services/recruitment-skills/recruitment-skills.service';
import { RecruitmentService } from '../services/recruitment/recruitment.service';

export class GenericRecruitmentAddComponent implements OnInit, OnDestroy {

  @Input() currentRecruitment: Recruitment;
  @Output() currentRecruitmentChanged = new EventEmitter<any>();
  public hideCardBody = false;
  public jobSkills: any[] = new Array<any>();
  public jobLanguages: any[] = new Array<any>();


  // # begin attribut region
  public recruitmentId = NumberConstant.ZERO;
  public requestOfferToUpdate: Recruitment;
  public recruitmentState = RecruitmentState;
  public recruitmentNeedFormGroup: FormGroup;
  public profilFormGroup: FormGroup;
  public contractFormGroup: FormGroup;

  public isUpdateMode = false;
  public predicate: PredicateFormat;
  public id: number;

  public recruitmentSkills: RecruitmentSkills[];
  public skills: any[] = new Array<any>();
  public languages: any[] = new Array<any>();
  public recruitmentLanguage: RecruitmentLanguage[];

  public recruitmentType = RecruitmentType;
  // Enum  wainting , Accepted , Refused, canceled
  public statusCode = AdministrativeDocumentStatusEnumerator;
  // Enum New, Opened ,Closed
  public offerStatus = RecruitmentOfferStatus;

  public LanguageHasError = false;
  public SkillHasError = false;
  public errorValidationSkill;
  public requestAlreadyValidate;
  public offerAlreadyClosed;

  // connected Empployee
  public connectedUser;
  /**
   * True if connected employee can validate
   */
  public canValidate: any;
  public canUpdate: boolean;
  // List of ids of employees that has the connected user as super hierarchical
  public EmployeeHierarchy: number[] = [];
  public commentsData: Comment[] = [];

  // List of comments
  // public commentsData: Comment[] = [];
  public isRequest = false;
  public isOffer = false;
  public contractSelected = false;
  public profilSelected = false;
  public OfferPicture: any;
  public PictureFileInfo: FileInfo;
  public showValidateButton = false;
  public showRefuseButton = false;
  public showPublishButton = false;
  public showCloseButton = false;
  public showUpdateButton = false;
  public isValidate = true;
  protected isSaveOperation = false;
  protected subscriptions: Subscription[]= [];


  constructor(
    protected fb: FormBuilder,
    protected router: Router,
    protected recruitmentService: RecruitmentService,
    protected validationService: ValidationService,
    protected recruitmentSkillsService: RecruitmentSkillsService,
    protected recruitmentLanguageService: RecruitmentLanguageService,
    protected translate: TranslateService,
    protected swalWarrings: SwalWarring,
    protected messageAdministrativeDocumentsService: MessageAdministrativeDocumentsService,
    protected employeeService: EmployeeService,
    protected permissionsService: StarkPermissionsService,
    protected jobSkillsService: JobSkillsService,
    protected authService: AuthService
  ) {
  }

  /**
   *  recruitmentNeed FormGroup
   */
  get IdJob(): FormControl {
    return this.recruitmentNeedFormGroup.get(RecruitmentConstant.ID) as FormControl;
  }

  get IdOffice(): FormControl {
    return this.recruitmentNeedFormGroup.get(RecruitmentConstant.ID_OFFICE) as FormControl;
  }

  get Priority(): FormControl {
    return this.recruitmentNeedFormGroup.get(RecruitmentConstant.PRIORITY) as FormControl;
  }

  get ExpectedCandidateNumber(): FormControl {
    return this.recruitmentNeedFormGroup.get(RecruitmentConstant.NUMBER_OF_CANDIDATE) as FormControl;
  }

  get RequestReason(): FormControl {
    return this.recruitmentNeedFormGroup.get(RecruitmentConstant.REQUESTREASON) as FormControl;
  }

  get RecruitmentSkills(): FormArray {
    return this.recruitmentNeedFormGroup.get(RecruitmentConstant.RECRUITMENT_SKILLS) as FormArray;
  }

  get RecruitmentLanguage(): FormArray {
    return this.recruitmentNeedFormGroup.get(RecruitmentConstant.RECRUITMENT_LANGUAGE) as FormArray;
  }

  get Description(): FormControl {
    return this.recruitmentNeedFormGroup.get(RecruitmentConstant.DESCRIPTION) as FormControl;
  }

  get Message(): FormControl {
    return this.recruitmentNeedFormGroup.get(SharedConstant.MESSAGE) as FormControl;
  }

  /**
   *   Profil FormGroup
   */
  get IdQualificationType(): FormControl {
    return this.profilFormGroup.get(RecruitmentConstant.ID_QUALIFICATION_TYPE) as FormControl;
  }

  get YearOfExperience(): FormControl {
    return this.profilFormGroup.get(RecruitmentConstant.YEAR_OF_EXPERIENCE) as FormControl;
  }

  get Sex(): FormControl {
    return this.profilFormGroup.get(RecruitmentConstant.SEX) as FormControl;
  }

  /**
   * Contract FormGroup
   */
  get WorkingHoursPerDays(): FormControl {
    return this.contractFormGroup.get(RecruitmentConstant.WORKING_HOURS_PER_DAYS) as FormControl;
  }

  get IdContractType(): FormControl {
    return this.contractFormGroup.get(RecruitmentConstant.ID_CONTRACT_TYPE) as FormControl;
  }

  get StartDate(): FormControl {
    return this.contractFormGroup.get(RecruitmentConstant.START_DATE) as FormControl;
  }

  ngOnInit() {
    this.canValidate = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_RECRUITMENTREQUEST);
    this.showValidateButton = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_RECRUITMENTREQUEST);
    this.showRefuseButton = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.REFUSE_RECRUITMENTREQUEST);
    this.showPublishButton = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.PUBLISH_RECRUITMENTOFFER);
    this.showCloseButton = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CLOSE_RECRUITMENTOFFER);
    this.showUpdateButton = this.authService.hasAuthorities([PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENT,
      PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENTOFFER, PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENTREQUEST]);
  }

  getDataToUpdate() {
    if (this.currentRecruitment && this.currentRecruitment.IdJob) {
      this.isUpdateMode = true;
      this.generateRecruitmentSkillsLanguages(this.currentRecruitment);
      if (this.RecruitmentSkills.length === 0) {
        this.generateRecruitmentSkills(this.currentRecruitment.IdJob);
      }
    } else if (this.id != null) {
      this.isUpdateMode = true;
      this.subscriptions.push(this.recruitmentService.getById(this.id).subscribe(data => {
        this.requestOfferToUpdate = data;
        if (this.requestOfferToUpdate && this.requestOfferToUpdate.PictureFileInfo) {
          this.OfferPicture = 'data:image/png;base64,' + this.requestOfferToUpdate.PictureFileInfo.Data;
        }
        this.canUpdate = (this.connectedUser.Employee && this.connectedUser.Employee.Id) === this.requestOfferToUpdate.IdEmployeeAuthor;
        if (this.requestOfferToUpdate.StartDate === null) {
          this.requestOfferToUpdate.StartDate = new Date();
        }
        this.createAddForm(this.requestOfferToUpdate);
        this.generateRecruitmentSkillsLanguages(this.requestOfferToUpdate);
        if (this.isRequest) {
          this.prepareCommentsList();
          this.checkIfRequestHasBeenAlreadyValidated();
        }
        if (this.isOffer) {
          this.checkIfOfferHasBeenAlreadyClosed();
        }
      }));
    }
  }

  checkIfOfferHasBeenAlreadyClosed() {
    if (this.requestOfferToUpdate.OfferStatus === this.offerStatus.Closed) {
      this.offerAlreadyClosed = true;
      this.disableFormGroups();
    } else {
      this.offerAlreadyClosed = false;
    }
  }

  disableFormGroups() {
    this.recruitmentNeedFormGroup.disable();
  }

  checkIfRequestHasBeenAlreadyValidated() {
    // Disable the input fields if the request state is not: Waiting
    if (this.requestOfferToUpdate.RequestStatus !== AdministrativeDocumentStatusEnumerator.Waiting) {
      this.requestAlreadyValidate = true;
    } else {
      this.requestAlreadyValidate = false;
    }
  }

  prepareCommentsList() {
    // Prepare Comment list
    this.commentsData = this.requestOfferToUpdate ? this.requestOfferToUpdate.Comments : [];
    if (this.commentsData.length !== 0) {
      this.commentsData.forEach(x => {
        this.getSrcPictureEmployee(x);
      });
    }
  }

  getSrcPictureEmployee(comment: Comment): Comment {
    if (comment && comment.Employee.PictureFileInfo && comment.Employee.PictureFileInfo.Data
    ) {
      comment.SrcPictureEmployee = 'data:image/png;base64,'.concat(comment.Employee.PictureFileInfo.Data);
    } else {
      comment.SrcPictureEmployee = '../../../../assets/image/user-new-icon1.jpg';
    }
    return comment;
  }

  generateRecruitmentSkillsLanguages(recruitmentToUpdate: Recruitment) {
    if (recruitmentToUpdate && recruitmentToUpdate.RecruitmentSkills != null) {
      recruitmentToUpdate.RecruitmentSkills.forEach(skill => {
        this.RecruitmentSkills.push(
          this.buildRequestSkillsForm(skill)
        );
        this.skills.push(skill);
      });
    }
    if (recruitmentToUpdate && recruitmentToUpdate.RecruitmentLanguage != null) {
      recruitmentToUpdate.RecruitmentLanguage.forEach(language => {
        this.RecruitmentLanguage.push(
          this.buildRequestLanguageForm(language)
        );
        this.languages.push(language);
      });
    }
  }

  generateRecruitmentSkills($event: number) {
    this.jobSkills = new Array<any>();
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter.push(new Filter(RecruitmentConstant.ID_JOB_SKILLS, Operation.eq, $event));
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RecruitmentConstant.ID_SKILL_NAVIGATION)]);
    this.subscriptions.push(this.jobSkillsService.readPredicateData(this.predicate).subscribe((data: JobSkills[]) => {
      data.forEach(skill => {
        this.jobSkills.push({
          Label: skill.IdSkillNavigation.Label,
          Rate: skill.Rate
        });
      });
    }));
  }

  public createAddForm(requestOfferToUpdate?: Recruitment) {
    const recruitmentNeedFormGroup = {
      Id: [requestOfferToUpdate ? requestOfferToUpdate.Id : NumberConstant.ZERO],
      IdJob: [requestOfferToUpdate ? requestOfferToUpdate.IdJob : '', Validators.required],
      Priority: [requestOfferToUpdate ? requestOfferToUpdate.Priority : '', Validators.required],
      IdOffice: [requestOfferToUpdate ? requestOfferToUpdate.IdOffice : '', Validators.required],
      ExpectedCandidateNumber: [requestOfferToUpdate ? requestOfferToUpdate.ExpectedCandidateNumber : '',
        [Validators.required, Validators.compose([Validators.min(NumberConstant.ONE),
          Validators.max(NumberConstant.ONE_HUNDRED), Validators.pattern('[0-9]+')])]],
      RecruitmentSkills: this.fb.array([]),
      RecruitmentLanguage: this.fb.array([]),
      Message: [''],
      Code: [requestOfferToUpdate ? requestOfferToUpdate.Code : '']
    };

    this.profilFormGroup = this.fb.group({
      IdQualificationType: [requestOfferToUpdate ? requestOfferToUpdate.IdQualificationType : '', Validators.required],
      YearOfExperience: [requestOfferToUpdate ? requestOfferToUpdate.YearOfExperience : '',
        [Validators.required, Validators.compose([Validators.min(NumberConstant.ZERO),
          Validators.max(NumberConstant.ONE_HUNDRED), Validators.pattern('[0-9]+')])]],
      Sex: [requestOfferToUpdate ? requestOfferToUpdate.Sex : '', Validators.required]
    });

    if (this.isRequest) {
      recruitmentNeedFormGroup['Type'] = [requestOfferToUpdate ? requestOfferToUpdate.Type : this.recruitmentType.Request];
      recruitmentNeedFormGroup['RequestReason'] = [requestOfferToUpdate ? requestOfferToUpdate.RequestReason : '',
        [Validators.required, Validators.maxLength(NumberConstant.FIVE_HUNDRED)]];
      recruitmentNeedFormGroup['RequestStatus'] = [requestOfferToUpdate ? requestOfferToUpdate.RequestStatus : NumberConstant.ONE];
    }

    if (this.isOffer) {
      let startDateGTObservable = Observable.of(undefined);
      if (requestOfferToUpdate != null) {
        startDateGTObservable = Observable.of(requestOfferToUpdate.CreationDate);
      }
      this.contractFormGroup = this.fb.group({
        IdContractType: [requestOfferToUpdate ? requestOfferToUpdate.IdContractType : '', Validators.required],
        StartDate: [requestOfferToUpdate && requestOfferToUpdate.StartDate ? new Date(requestOfferToUpdate.StartDate) : '',
          [Validators.required, dateValueGT(startDateGTObservable)]],
        WorkingHoursPerDays: [requestOfferToUpdate ? requestOfferToUpdate.WorkingHoursPerDays : '', [Validators.required,
          Validators.min(NumberConstant.ONE), Validators.max(NumberConstant.TWENTY_FOOR)]]
      });
      recruitmentNeedFormGroup['Type'] = [requestOfferToUpdate ? requestOfferToUpdate.Type : this.recruitmentType.Offer];
      recruitmentNeedFormGroup['OfferStatus'] = [requestOfferToUpdate ? requestOfferToUpdate.OfferStatus : NumberConstant.ONE];
      recruitmentNeedFormGroup['Description'] = [requestOfferToUpdate ? requestOfferToUpdate.Description : '',
        [Validators.required, Validators.maxLength(NumberConstant.FIVE_HUNDRED)]];
    }
    this.recruitmentNeedFormGroup = this.fb.group(recruitmentNeedFormGroup);
  }

  checkValidateFormGroup() {
    this.isValidate = true;
    if (this.profilFormGroup && !this.profilFormGroup.valid && (this.isRequest || this.isOffer)) {
      this.profilSelected = true;
      this.validationService.validateAllFormFields(this.profilFormGroup);
      this.isValidate = false;
    }
    if (this.contractFormGroup && !this.contractFormGroup.valid && this.isOffer) {
      this.contractSelected = true;
      this.validationService.validateAllFormFields(this.contractFormGroup);
      this.isValidate = false;
    }
    return this.isValidate;
  }

  save(isValidateMode?: boolean) {
    let recruitmentNeedAssign: Recruitment;
    const isValidate = this.checkValidateFormGroup();
    if ((this.recruitmentNeedFormGroup.valid || this.recruitmentNeedFormGroup.disabled) && !this.SkillHasError
      && !this.LanguageHasError && isValidate) {
      if (this.requestOfferToUpdate) {
        this.requestOfferToUpdate.IdJobNavigation = null;
        this.requestOfferToUpdate.IdOfficeNavigation = null;
        this.requestOfferToUpdate.IdContractTypeNavigation = null;
        this.requestOfferToUpdate.IdQualificationTypeNavigation = null;
      }
      if (this.currentRecruitment) {
        this.currentRecruitment.IdJobNavigation = null;
        this.currentRecruitment.IdOfficeNavigation = null;
        this.currentRecruitment.IdQualificationTypeNavigation = null;
      }
      if (this.currentRecruitment) {
        recruitmentNeedAssign = Object.assign({}, this.currentRecruitment, this.recruitmentNeedFormGroup.value);
      } else {
        recruitmentNeedAssign = Object.assign({}, this.requestOfferToUpdate, this.recruitmentNeedFormGroup.value);
        if (this.profilFormGroup) {
          recruitmentNeedAssign = Object.assign(recruitmentNeedAssign, this.profilFormGroup.value);
        }
        if (this.contractFormGroup) {
          recruitmentNeedAssign = Object.assign(recruitmentNeedAssign, this.contractFormGroup.value);
        }
      }
      if (isValidateMode) {
        recruitmentNeedAssign.State = this.recruitmentState.Candidacy;
      }
      // Save file
      if (this.PictureFileInfo) {
        recruitmentNeedAssign.PictureFileInfo = this.PictureFileInfo;
      }
      this.isSaveOperation = true;
      this.subscriptions.push(this.recruitmentService.save(recruitmentNeedAssign, !this.isUpdateMode).subscribe(result => {
        if (this.isRequest) {
          this.router.navigateByUrl(RecruitmentConstant.REQUEST_LIST_URL);
        } else if (this.isOffer) {
          this.router.navigateByUrl(RecruitmentConstant.OFFER_LIST_URL);
        } else if (this.isUpdateMode && this.currentRecruitment) {
          this.currentRecruitment = recruitmentNeedAssign;
          this.currentRecruitmentChanged.emit(this.currentRecruitment);
        } else if (!this.isUpdateMode) {
          this.router.navigateByUrl(RecruitmentConstant.RECRUITMENT_EDIT_URL.concat(result.Id.toString()));
        }
      }));
    } else {
      this.validationService.validateAllFormFields(this.recruitmentNeedFormGroup);
    }
  }

  buildRequestSkillsForm(recruitmentSkills?: RecruitmentSkills): FormGroup {
    return this.fb.group({
      IdRecruitment: [recruitmentSkills ? recruitmentSkills.IdRecruitment : NumberConstant.ZERO],
      IdSkills: [recruitmentSkills ? recruitmentSkills.IdSkills : '', Validators.required],
      Id: [recruitmentSkills ? recruitmentSkills.Id : NumberConstant.ZERO],
      Rate: [recruitmentSkills ? recruitmentSkills.Rate : '', Validators.required],
      Label: [recruitmentSkills ? recruitmentSkills.IdSkillsNavigation.Label : ''],

    });
  }

  buildRequestLanguageForm(recruitmentLanguage?: RecruitmentLanguage): FormGroup {
    return this.fb.group({
      IdLanguage: [recruitmentLanguage ? recruitmentLanguage.IdLanguage : ''],
      IdRecruitment: [recruitmentLanguage ? recruitmentLanguage.IdRecruitment : NumberConstant.ZERO],
      Id: [recruitmentLanguage ? recruitmentLanguage.Id : NumberConstant.ZERO],
      Rate: [recruitmentLanguage ? recruitmentLanguage.Rate : '', Validators.required],
      Label: [recruitmentLanguage ? recruitmentLanguage.IdLanguageNavigation.Name : ''],

    });
  }

  onContractTabClose() {
    if (this.contractSelected && !this.isValidate) {
      this.contractSelected = false;
    }
  }

  onProfilTabClose() {
    if (this.profilSelected && !this.isValidate) {
      this.profilSelected = false;
    }
  }

  isFormChanged(): boolean {
    return this.recruitmentNeedFormGroup.touched;
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

}
