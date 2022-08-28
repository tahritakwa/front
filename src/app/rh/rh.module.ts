import {NgModule} from '@angular/core';
import {RhRoutingModule} from './rh-routing.module';
import {CandidateService} from './services/candidate/candidate.service';
import {AddInterviewComponent} from './interview/add-interview/add-interview.component';
import {SharedModule} from '../shared/shared.module';
import {NewEmailComponent} from './components/new-email/new-email.component';
import {AddRecruitmentComponent} from './recruitment/add-recruitment/add-recruitment.component';
import {ListRecruitmentComponent} from './recruitment/list-recruitment/list-recruitment.component';
import {RecruitmentService} from './services/recruitment/recruitment.service';
import {InterviewService} from './services/interview/interview.service';
import {CandidacyService} from './services/candidacy/candidacy.service';
import {InterviewComponent} from './components/interview/interview.component';
import {InterviewMarkService} from './services/interview-mark/interview-mark.service';
import {CandidacySteperComponent} from './components/candidacy-steper/candidacy-steper.component';
import {ListCandidateComponent} from './candidate/list-candidate/list-candidate.component';
import {AddCandidateComponent} from './candidate/add-candidate/add-candidate.component';
import {ListTimesheetComponent} from './timesheet/list-timesheet/list-timesheet.component';
import {AddTimesheetComponent} from './timesheet/add-timesheet/add-timesheet.component';
// tslint:disable-next-line: max-line-length
import {ListInterviewByCandidacyComponent} from './interview/list-interview/list-interview-by-candidacy/list-interview-by-candidacy.component';
// tslint:disable-next-line: max-line-length
import {ListInterviewByRecruitmentComponent} from './interview/list-interview/list-interview-by-recruitment/list-interview-by-recruitment.component';
import {ListCandidacyComponent} from './candidacy/list-candidacy/list-candidacy.component';
import {TimeSheetService} from './services/timesheet/timesheet.service';
import {RecruitmentNeedComponent} from './recruitment/recruitment-need/recruitment-need.component';
import {BarRatingModule} from 'ngx-bar-rating';
import {PreSelectionComponent} from './components/pre-selection/pre-selection.component';
import {CandidacyDropdownlistComponent} from './components/candidacy-dropdownlist/candidacy-dropdownlist.component';
import {AddCvDocumentComponent} from './components/add-cv-document/add-cv-document.component';
import {SelectionComponent} from './components/selection/selection.component';
import {ListEvaluationComponent} from './evaluation/list-evaluation/list-evaluation.component';
import {EvaluationFormComponent} from './evaluation/evaluation-form/evaluation-form.component';
import {OfferService} from './services/offer/offer.service';
import {AddOfferComponent} from './offer/add-offer/add-offer.component';
import {ListOfferByCandidacyComponent} from './offer/list-offer/list-offer-by-candidacy.component';
import {HiringComponent} from './components/hiring/hiring.component';
import {InterviewTypeDropdownlistComponent} from './components/interview-type-dropdownlist/interview-type-dropdownlist.component';
import {InterviewTypeService} from './services/interview-type/interview-type.service';
import {RecruitmentResumeComponent} from './components/recruitment-resume/recruitment-resume.component';
import {CriteriaMarkService} from './services/criteria-mark/criteria-mark.service';
import {ReviewService} from './services/review/review.service';
import {ReviewResumeService} from './services/review-resume/review-resume.service';
import {ReviewFormationService} from './services/review-formation/review-formation.service';
import {ReviewSkillsService} from './services/review-skills/review-skills.service';
import {ObjectiveService} from './services/objective/objective.service';
import {QuestionService} from './services/question/question.service';
import {ListReviewComponent} from './review/list-review/list-review.component';
import {AddReviewComponent} from './review/add-review/add-review.component';
import {AddSharedDocumentComponent} from './shared-document/add-shared-document/add-shared-document.component';
import {ListSharedDocumentComponent} from './shared-document/list-shared-document/list-shared-document.component';
import {SharedDocumentService} from './services/shared-document/shared-document.service';
import {FormationComboboxComponent} from './components/formation-combobox/formation-combobox.component';
import {AddObjectiveComponent} from './review/add-objective/add-objective.component';
import {FormationTypeComboboxComponent} from './components/formation-type-combobox/formation-type-combobox.component';
import {FormationTypeService} from './services/formation-type/formation-type.service';
import {AddReviewSkillsComponent} from './review/add-review-skills/add-review-skills.component';
import {ReviewFormComponent} from './review/review-form/review-form.component';
import {AddReviewFormationComponent} from './review/add-review-formation/add-review-formation.component';
import {ReviewQuestionComponent} from './review/review-question/review-question.component';
import {ListInterviewTypeComponent} from './components/list-interview-type/list-interview-type.component';
import {AddEvaluationCriteriaThemeComponent} from './components/add-evaluation-criteria-theme/add-evaluation-criteria-theme.component';
import {ListEvaluationCriteriaThemeComponent} from './components/list-evaluation-criteria-theme/list-evaluation-criteria-theme.component';
import {EvaluationCriteriaThemeService} from './services/evaluation/evaluation-criteria-theme.service';
import {EvaluationCriteriaService} from './services/evaluation-criteria/evaluation-criteria.service';
import {TrainingCatalogComponent} from '../rh/training/training-catalog/training-catalog.component';
import {TrainingService} from '../rh/services/training/training.service';
import {TrainingSessionService} from '../rh/services/training-session/training-session.service';
import {TrainingRequestService} from '../rh/services/training-request/training-request.service';
import {TrainingAddRequestComponent} from '../rh/training/training-add-request/training-add-request.component';
import {TrainingListRequestComponent} from '../rh/training/training-list-request/training-list-request.component';
import {TrainingSessionAddComponent} from '../rh/training/training-session-add/training-session-add.component';
import {TrainingSessionListComponent} from '../rh/training/training-session-list/training-session-list.component';
import {MobilityRequestService} from './services/mobility-request/mobility-request.service';
import {ListMobilityRequestComponent} from './mobility-request/list-mobility-request/list-mobility-request.component';
import {AddMobilityRequestComponent} from './mobility-request/add-mobility-request/add-mobility-request.component';
import {TrainingAddComponent} from './training/training-add/training-add.component';
import {TrainingRequestShowComponent} from './training/training-request-show/training-request-show.component';
import {TrainingDropdownComponent} from './components/training-dropdown/training-dropdown.component';
import {SearchSectionDocumentComponent} from './search-section-document/search-section-document.component';
import {AddEmployeeToTrainingSessionComponent} from './training/add-employee-to-training-session/add-employee-to-training-session.component';
import {QualificationService} from '../payroll/services/qualification/qualification.service';
import {JobSkillsService} from '../payroll/services/job-skills/job-skills.service';
import {JobService} from '../payroll/services/job/job.service';
import {EmployeeSkillsService} from '../payroll/services/employee-skills/employee-skills.service';
import {SkillsService} from '../payroll/services/skills/skills.service';
import {ReportingInModalComponent} from '../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import {ProjectService} from '../sales/services/project/project.service';
import {CompanySkillsComponent} from '../administration/company/company-skills/company-skills.component';
import {StarkPermissionsGuard} from '../stark-permissions/stark-permissions.module';
import {TooltipModule} from 'ng2-tooltip-directive';
import {PlanningTrainingSessionComponent} from './components/planning-training-session/planning-training-session.component';
import {SelectingEmployeeForTrainingSessionComponent} from './components/selecting-employee-for-training-session/selecting-employee-for-training-session.component';
import {PlanningTrainingSessionSeanceComponent} from './components/planning-training-session-seance/planning-training-session-seance.component';
import {SesssionStepperComponent} from './components/sesssion-stepper/sesssion-stepper.component';
import {TrainingTypeComponent} from './training/training-session-add/training-type/training-type.component';
import {TrainingSeanceService} from './services/training-seance/training-seance.service';
import {TrainingSessionAbstractComponent} from './components/training-session-abstract/training-session-abstract.component';
import {GridTimesheetComponent} from './timesheet/grid-timesheet/grid-timesheet.component';
import {TrainingCenterService} from './services/training-center/training-center.service';
import {TrainingCenterManagerService} from './services/training-center-manager/training-center-manager.service';
import {TrainingCenterRoomService} from './services/training-center-room/training-center-room.service';
import {AddTrainingCenterComponent} from './training/add-training-center/add-training-center/add-training-center.component';
import {ExternalTrainerService} from './services/external-trainer/external-trainer.service';
import {ExternalTrainerSkillsService} from './services/external-trainer-skills/external-trainer-skills.service';
import {AddExternalTrainerComponent} from './components/add-external-trainer/add-external-trainer/add-external-trainer.component';
import {ExternalTrainingService} from './services/external-training/external-training.service';
import {EmployeeTrainingSessionService} from './services/employee-training-session/employee-training-session.service';
import {AddEmployeeComponent} from '../payroll/employee/add-employee/add-employee.component';
import {ContractService} from '../payroll/services/contract/contract.service';
import {ActiveAssignmentService} from '../immobilization/services/active-assignment/active-assignment.service';
import {AddReviewNotificationDaysComponent} from './review/add-review-notification-days/add-review-notification-days/add-review-notification-days.component';
import {JobsParametersService} from './services/jobs-parameters/jobs-parameters.service';
import {TimesheetInformationsComponent} from './components/timesheet-informations/timesheet-informations/timesheet-informations.component';
import {ListLanguageComponent} from '../administration/language/list-language/list-language.component';
import {RecruitmentLanguageService} from './services/recruitment-language/recruitment-language.service';
import {RecruitmentSkillsService} from './services/recruitment-skills/recruitment-skills.service';
import {ListRecruitmentRequestOfferComponent} from './recruitment-request-offer/list-recruitment-request-offer/list-recruitment-request-offer.component';
import {AddRecruitmentRequestOfferComponent} from './recruitment-request-offer/add-recruitment-request-offer/add-recruitment-request-offer.component';
import {SearchCandidateComponent} from './components/search-candidate/search-candidate.component';
import {ContractTypeService} from '../payroll/services/contract-type/contract-type.service';
import {MatDialogModule, MatGridListModule, MatIconModule, MatMenuModule, MatToolbarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {ToolBarModule} from '@progress/kendo-angular-toolbar';
import {StarkdriveFileService} from './services/starkdrive-file/starkdrive-file.service';
import {TreeviewStarkdriveComponent} from './starkdrive/treeview-starkdrive/treeview-starkdrive.component';
import {ToolbarStarkdriveComponent} from './starkdrive/toolbar-starkdrive/toolbar-starkdrive.component';
import {ExplorerStarkdriveComponent} from './starkdrive/explorer-starkdrive/explorer-starkdrive.component';
import {FileExplorerStarkdriveComponent} from './starkdrive/file-explorer-starkdrive/file-explorer-starkdrive.component';
import {PostponeInterviewComponent} from './components/postpone-interview/postpone-interview.component';
import {OfferBenefitInKindService} from '../rh/services/offer-benefit-in-kind/offer-benefit-in-kind.service';
import {ListInterviewAccordionComponent} from './review/list-interview-accordion/list-interview-accordion.component';
import {ListInterviewMarkComponent} from './review/list-interview-mark/list-interview-mark.component';
import {FolderModalStarkdriveComponent} from './starkdrive/folder-modal-starkdrive/folder-modal-starkdrive.component';
import {UploadFiledriveComponent} from './starkdrive/upload-filedrive/upload-filedrive.component';
import {DetailsModalStarkdriveComponent} from './starkdrive/details-modal-starkdrive/details-modal-starkdrive.component';
import {TimesheetValidationService} from './services/timesheet-validation/timesheet-validation.service';
import {ConfigureReviewManagerComponent} from './review/configure-review-manager/configure-review-manager.component';
import {InterviewFormComponent} from './components/interview-form/interview-form.component';
import {SharedModalStarkdriveComponent} from './starkdrive/shared-modal-starkdrive/shared-modal-starkdrive.component';
import {StarkdriveSharedDocumentServiceService} from './services/starkdrive-shared-document/starkdrive-shared-document-service.service';
import {UploadFiledriveModalComponent} from './starkdrive/upload-filedrive-modal/upload-filedrive-modal.component';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {ValidateCraDetailsComponent} from './timesheet/validate-cra-details/validate-cra-details.component';
import {EmailHistoryComponent} from './components/email-history/email-history.component';
import {CanDeactivateGuard} from './services/can-deactivate-guard.service';
import {InterviewEmailService} from './services/interview-email/interview-email.service';
import { AddCnssComponent } from '../payroll/cnss-type/add-cnss/add-cnss.component';
import { RhPayrollSettingsService } from './services/rh-payroll-settings/rh-payroll-settings.service';
import { DocumentRequestService } from '../payroll/services/document-request/document-request.service';

@NgModule({
  imports: [
    SharedModule,
    RhRoutingModule,
    BarRatingModule,
    TooltipModule,
    MatToolbarModule,
    MatCardModule,
    FlexLayoutModule,
    MatIconModule,
    MatGridListModule,
    MatMenuModule,
    MatDialogModule,
    ToolBarModule,
    NgxDropzoneModule
  ],

  declarations: [
    ListTimesheetComponent,
    AddTimesheetComponent,
    NewEmailComponent,
    AddRecruitmentComponent,
    ListRecruitmentComponent,
    AddInterviewComponent,
    ListInterviewByCandidacyComponent,
    AddCandidateComponent,
    ListCandidateComponent,
    InterviewComponent,
    CandidacySteperComponent,
    ListInterviewByRecruitmentComponent,
    ListCandidacyComponent,
    RecruitmentNeedComponent,
    PreSelectionComponent,
    CandidacyDropdownlistComponent,
    AddCvDocumentComponent,
    ListEvaluationComponent,
    EvaluationFormComponent,
    SelectionComponent,
    ListOfferByCandidacyComponent,
    AddOfferComponent,
    HiringComponent,
    InterviewTypeDropdownlistComponent,
    RecruitmentResumeComponent,
    ListReviewComponent,
    AddReviewComponent,
    AddSharedDocumentComponent,
    ListSharedDocumentComponent,
    FormationComboboxComponent,
    AddObjectiveComponent,
    FormationComboboxComponent,
    FormationTypeComboboxComponent,
    AddReviewSkillsComponent,
    ReviewFormComponent,
    AddReviewFormationComponent,
    ReviewQuestionComponent,
    ListInterviewTypeComponent,
    AddEvaluationCriteriaThemeComponent,
    ListEvaluationCriteriaThemeComponent,
    TrainingCatalogComponent,
    TrainingAddRequestComponent,
    TrainingListRequestComponent,
    TrainingSessionAddComponent,
    TrainingSessionListComponent,
    ListEvaluationCriteriaThemeComponent,
    ListMobilityRequestComponent,
    AddMobilityRequestComponent,
    TrainingAddComponent,
    TrainingRequestShowComponent,
    TrainingDropdownComponent,
    SearchSectionDocumentComponent,
    AddEmployeeToTrainingSessionComponent,
    PlanningTrainingSessionComponent,
    SelectingEmployeeForTrainingSessionComponent,
    PlanningTrainingSessionSeanceComponent,
    SesssionStepperComponent,
    TrainingTypeComponent,
    TrainingSessionAbstractComponent,
    GridTimesheetComponent,
    AddTrainingCenterComponent,
    AddExternalTrainerComponent,
    SearchCandidateComponent,
    AddReviewNotificationDaysComponent,
    TimesheetInformationsComponent,
    PostponeInterviewComponent,
    ListRecruitmentRequestOfferComponent,
    AddRecruitmentRequestOfferComponent,
    FolderModalStarkdriveComponent,
    TreeviewStarkdriveComponent,
    ToolbarStarkdriveComponent,
    ExplorerStarkdriveComponent,
    FileExplorerStarkdriveComponent,
    UploadFiledriveComponent,
    DetailsModalStarkdriveComponent,
    ListInterviewAccordionComponent,
    ListInterviewMarkComponent,
    ConfigureReviewManagerComponent,
    InterviewFormComponent,
    SharedModalStarkdriveComponent,
    UploadFiledriveModalComponent,
    ValidateCraDetailsComponent,
    EmailHistoryComponent
  ],

  providers: [
    JobService,
    EmployeeSkillsService,
    SkillsService,
    JobSkillsService,
    CandidateService,
    QualificationService,
    TimeSheetService,
    RecruitmentService,
    RecruitmentService,
    InterviewService,
    CandidacyService,
    InterviewMarkService,
    EvaluationCriteriaThemeService,
    OfferService,
    InterviewTypeService,
    CriteriaMarkService,
    ReviewService,
    ReviewResumeService,
    ReviewFormationService,
    ReviewSkillsService,
    ObjectiveService,
    QuestionService,
    SharedDocumentService,
    FormationTypeService,
    EvaluationCriteriaService,
    TrainingService,
    TrainingSessionService,
    TrainingRequestService,
    MobilityRequestService,
    EvaluationCriteriaService,
    ProjectService,
    StarkPermissionsGuard,
    TrainingSeanceService,
    TrainingCenterService,
    TrainingCenterManagerService,
    TrainingCenterRoomService,
    ExternalTrainerService,
    ExternalTrainerSkillsService,
    ExternalTrainingService,
    ContractService,
    ActiveAssignmentService,
    EmployeeTrainingSessionService,
    JobsParametersService,
    RecruitmentSkillsService,
    RecruitmentLanguageService,
    OfferBenefitInKindService,
    ContractTypeService,
    StarkdriveFileService,
    TimesheetValidationService,
    StarkdriveSharedDocumentServiceService,
    CanDeactivateGuard,
    InterviewEmailService,
    RhPayrollSettingsService,
    DocumentRequestService
  ],
  entryComponents: [
    AddInterviewComponent,
    EvaluationFormComponent,
    NewEmailComponent,
    AddOfferComponent,
    AddSharedDocumentComponent,
    AddEvaluationCriteriaThemeComponent,
    TrainingSessionAddComponent,
    TrainingAddRequestComponent,
    TrainingAddComponent,
    AddEmployeeToTrainingSessionComponent,
    ReportingInModalComponent,
    CompanySkillsComponent,
    AddTrainingCenterComponent,
    AddExternalTrainerComponent,
    AddEmployeeComponent,
    TimesheetInformationsComponent,
    PostponeInterviewComponent,
    ListLanguageComponent,
    FolderModalStarkdriveComponent,
    DetailsModalStarkdriveComponent,
    SharedModalStarkdriveComponent,
    UploadFiledriveModalComponent,
    AddCandidateComponent,
    EmailHistoryComponent,
    AddCnssComponent
  ],
})
export class RhModule {
}
