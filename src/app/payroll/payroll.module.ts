import { NgModule } from '@angular/core';
import { AddSessionComponent } from '../payroll/session/add-session/add-session.component';
import { SharedModule } from '../shared/shared.module';
import { PayrollRoutingModule } from './payroll.routing.module';
import { AddEmployeeComponent } from './employee/add-employee/add-employee.component';
import { ListEmployeeComponent } from './employee/list-employee/list-employee.component';
import { AttendanceComponent } from './session/attendance/attendance.component';
import { ListSessionComponent } from './session/list-session/list-session.component';
import { ListPayslipComponent } from './session/list-payslip/list-payslip.component';
import { AddContractComponent } from './contract/add-contract/add-contract.component';
import { VariableBonusesComponent } from './session/variable-bonuses/variable-bonuses.component';
import { VariableBonusesComboboxComponent } from './components/variable-bonuses-combobox/variable-bonuses-combobox.component';
import { VariableBonusesSectionComponent } from './components/variable-bonuses-section/variable-bonuses-section.component';
import { TypeOfTreatmentComboboxComponent } from './components/type-of-treatment-combobox/type-of-treatment-combobox.component';
import { SessionResumeComponent } from './session/session-resume/session-resume.component';
import { FixedBonusesMultiselectComponent } from './components/fixed-bonuses-multiselect/fixed-bonuses-multiselect.component';
import { SessionService } from './services/session/session.service';
import { EmployeeService } from './services/employee/employee.service';
import { GradeService } from './services/grade/grade.service';
import { ContractService } from './services/contract/contract.service';
import { BonusService } from './services/bonus/bonus.service';
import { JobService } from './services/job/job.service';
import { SalaryStructureService } from './services/salary-structure/salary-structure.service';
import { BaseSalaryService } from './services/base-salary/base-salary.service';
import { AttendanceService } from './services/attendance/attendance.service';
import { ContractBonusService } from './services/contract-bonus/contract-bonus.service';
import { ListBonusComponent } from './bonus/list-bonus/list-bonus.component';
import { AddBonusComponent } from './bonus/add-bonus/add-bonus.component';
import { SessionHeaderComponent } from './components/session-header/session-header.component';
import { BonusValidityComponent } from './components/bonus-validity/bonus-validity.component';
import { EmployeeDocumentService } from './services/employee-document/employee-document.service';
import { ManageEmployeeDocumentComponent } from './components/manage-employee-document/manage-employee-document.component';
import {
  EmployeeDocumentTypeDropdownComponent
} from './components/employee-document-type-dropdown/employee-document-type-dropdown.component';
import { CnssService } from './services/cnss/cnss.service';
import { ListCnssComponent } from './cnss-type/list-cnss/list-cnss.component';
import { AddEmployeeDocumentComponent } from './employee-document/add-employee-document/add-employee-document.component';
import { ExchangeBonusDataService } from './services/exchange-bonus-data/exchange-bonus-data.service';
import { ListGradeComponent } from './grade/list-grade/list-grade.component';
import { ListJobComponent } from './job/list-job/list-job.component';
import { TeamService } from './services/team/team.service';
import { QualificationService } from './services/qualification/qualification.service';
import { BaseSalaryValidityComponent } from './components/base-salary-validity/base-salary-validity.component';
import { TransferOrderService } from './services/transfer-order/transfer-order.service';
import { PayslipService } from './services/payslip/payslip.service';
import { ExpenseReportRequestAddComponent } from './expense-report/expense-report-request-add/expense-report-request-add.component';
import { LeaveRequestAddComponent } from './leave/leave-request-add/leave-request-add.component';
import { LeaveService } from './services/leave/leave.service';
import { LeaveTypeDropdownComponent } from './components/leave-type-dropdown/leave-type-dropdown.component';
import { DocumentRequestAddComponent } from './document-request/document-request-add/document-request-add.component';
import { DocumentRequestListComponent } from './document-request/document-request-list/document-request-list.component';
import { SalaryRuleService } from './services/salary-rule/salary-rule.service';
import { SearchEmployeeComponent } from './components/search-employee/search-employee.component';
import { PayslipPreviewComponent } from './components/payslip-preview/payslip-preview.component';
import { DocumentRequestTypeService } from './services/document-request-type/document-request-type.service';
import { DocumentRequestService } from './services/document-request/document-request.service';
import { AddCnssDeclarationComponent } from './cnss-declaration/add-cnss-declaration/add-cnss-declaration.component';
import { ListCnssDeclarationComponent } from './cnss-declaration/list-cnss-declaration/list-cnss-declaration.component';
import { CnssDeclarationService } from './services/cnss-declaration/cnss-declaration.service';
import { ExpenseReportService } from './services/expense-report/expense-report.service';
import {
  ExpenseReportDetailsTypeDropdownComponent
} from './components/expense-report-details-type-dropdown/expense-report-details-type-dropdown.component';
import { ExpenseReportDetailsTypeService } from './services/expense-report-details-type/expense-report-details-type.service';
import { ExpenseReportDetailsService } from './services/expense-report-details/expense-report-details.service';
import { LeaveTypeService } from './services/leave-type/leave-type.service';
import { SharedLeaveData } from './services/leave/shared-leave-data.service';
import { OrganizationChartEmployeeComponent } from './employee/organization-chart-employee/organization-chart-employee.component';
import { ListTransferOrderComponent } from './transfer-order/list-transfer-order/list-transfer-order.component';
import { AddTransferOrderComponent } from './transfer-order/add-transfer-order/add-transfer-order.component';
import { SkillsService } from './services/skills/skills.service';
import { EmployeeSkillsService } from './services/employee-skills/employee-skills.service';
import { BarRatingModule } from 'ngx-bar-rating';
import { SkillsMatrixComponent } from './skills-matrix/skills-matrix.component';
import { ShowJobComponent } from './job/show-job/show-job.component';
import { AddJobComponent } from './job/add-job/add-job.component';
import { SkillsFamilyService } from './services/skills-family/skills-family.service';
import { ExpenseReportRequestListComponent } from './expense-report/expense-report-request-list/expense-report-request-list.component';
import { SkillDropdownComponent } from './components/skill-dropdown/skill-dropdown.component';
import { JobSkillsService } from './services/job-skills/job-skills.service';
import { LeaveRequestListComponent } from './leave/leave-request-list/leave-request-list.component';
import { DocumentRequestShowComponent } from './document-request/document-request-show/document-request-show.component';
import { AddLeaveTypeComponent } from './leave-type/add-leave-type/add-leave-type.component';
import { ListLeaveTypeComponent } from './leave-type/list-leave-type/list-leave-type.component';
import { SearchTeamComponent } from './components/search-team/search-team.component';
import {
  ExpenseReportDetailTypeComponent
} from './expense-report-detail-type/expense-report-detail-type/expense-report-detail-type.component';
import { ListSalaryRuleComponent } from './salary-rule/list-salary-rule/list-salary-rule.component';
import { AddSalaryRuleComponent } from './salary-rule/add-salary-rule/add-salary-rule.component';
import { ActiveAssignmentService } from '../immobilization/services/active-assignment/active-assignment.service';
import { ReportingInModalComponent } from '../shared/components/reports/reporting-in-modal/reporting-in-modal.component';
import { SkillsFamilyComponent } from '../administration/company/skills-family/skills-family.component';
import { ListQualificationTypeComponent } from './qualification-type/list-qualification-type/list-qualification-type.component';
import { AddCurrencyComponent } from '../administration/currency/add-currency/add-currency.component';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import { CurrencyService } from '../administration/services/currency/currency.service';
import { ListVariableComponent } from './variable/list-variable/list-variable.component';
import { AddVariableComponent } from './variable/add-variable/add-variable.component';
import { VariableService } from './services/variable/variable.service';
import { AddNotesComponent } from './components/add-notes/add-notes.component';
import { NotesService } from './services/notes/notes.service';
import { ListSalaryStructureComponent } from './salary-structure/list-salary-structure/list-salary-structure.component';
import { ListTeamComponent } from './team/list-team/list-team.component';
import { AddTeamComponent } from './team/add-team/add-team.component';
import { EmployeeTeamService } from './services/employee-team/employee-team.service';
import { AssignmentModalComponent } from './components/assignment-modal/assignment-modal.component';
import { AddSalaryStructureComponent } from './salary-structure/add-salary-structure/add-salary-structure.component';
import { AddContractTypeComponent } from './contract-type/add-contract-type/add-contract-type.component';
import { ListContractTypeComponent } from './contract-type/list-contract-type/list-contract-type.component';
import { ContractTypeService } from './services/contract-type/contract-type.service';
import { LeaveInformationsComponent } from '../payroll/components/leave-informations/leave-informations/leave-informations.component';
import { AddExitEmployeeComponent } from './exit-employee/add-exit-employee/add-exit-employee.component';
import { ListExitEmployeeComponent } from './exit-employee/list-exit-employee/list-exit-employee.component';
import { ExitEmployeeService } from './services/exit-employee/exit-employee.service';
import { ExitReasonService } from './services/exit-reason/exit-reason.service';
import { ListExitReasonComponent } from './exit-reason/list-exit-reason.component';
import { ListBenefitInKindComponent } from '../payroll/benefit-in-kind/list-benefit-in-kind/list-benefit-in-kind.component';
import { BenefitInKindService } from './services/benefit-in-kind/benefit-in-kind.service';
import { AddBenefitInKindComponent } from '../payroll/benefit-in-kind/add-benefit-in-kind/add-benefit-in-kind.component';
import { ContractBenefitInKindService } from '../payroll/services/contract-benefit-in-kind/contract-benefit-in-kind.service';
import { PayslipHistoryComponent } from '../payroll/payslip-history/payslip-history.component';
import {
  ListSourceDeductionSessionComponent
} from './source-deduction/list-source-deduction-session/list-source-deduction-session.component';
import { AddSourceDeductionSessionComponent } from './source-deduction/add-source-deduction-session/add-source-deduction-session.component';
import { SourceDeductionSessionService } from './services/source-deduction-session/source-deduction-session.service';
import { ListSourceDeductionComponent } from './source-deduction/list-source-deduction/list-source-deduction.component';
import { SourceDeductionService } from './services/source-deduction/source-deduction.service';
import {
  ManageVariableValidityPeriodComponent
} from './variable-validity-period/manage-variable-validity-period/manage-variable-validity-period.component';
import { PayslipReportingService } from './services/payslip/payslip-reporting.service';
import { ExitEmployeeSteperComponent } from './components/exit-employee-steper/exit-employee-steper/exit-employee-steper.component';
import { StepsExitEmployeeComponent } from './exit-employee/steps-exit-employee/steps-exit-employee.component';
import { RhInformationComponent } from './components/rh-information/rh-information.component';
import { ItInformationComponent } from './components/it-information/it-information.component';
import { ListMeetingExitEmployeeComponent } from './meeting-exit-employee/list-meeting-exit-employee/list-meeting-exit-employee.component';
import { AddInterviewComponent } from '../rh/interview/add-interview/add-interview.component';
import { InterviewService } from '../rh/services/interview/interview.service';
import { ListTeamTypeComponent } from './team-type/list-team-type/list-team-type.component';
import { InterviewMarkService } from '../rh/services/interview-mark/interview-mark.service';
import { NewEmailComponent } from '../rh/components/new-email/new-email.component';
import { PostponeInterviewComponent } from '../rh/components/postpone-interview/postpone-interview.component';
import { OvershootLeaveModalComponent } from './components/overshoot-leave-modal/overshoot-leave-modal.component';
import { EmployerDeclarationComponent } from './employer-declaration/employer-declaration.component';
import { TimeSheetService } from '../rh/services/timesheet/timesheet.service';
import { TimesheetValidationService } from '../rh/services/timesheet-validation/timesheet-validation.service';
import { ContractInformationsComponent } from './components/contract-informations/contract-informations.component';
import { ListLoanComponent } from './loan/list-loan/list-loan.component';
import { AddLoanRequestComponent } from './loan/add-loan-request/add-loan-request.component';
import { LoanService } from './services/loan/loan.service';
import { ListContractComponent } from './contract/list-contract/list-contract.component';
import { ValidateLeaveUsersDetailsComponent } from './leave/validate-leave-users-details/validate-leave-users-details.component';
import { ExitEmployeeDesactivateComponent } from './components/exit-employee-desactivate/exit-employee-desactivate.component';
import { ValidateExpenseDetailsComponent } from './expense-report/validate-expense-details/validate-expense-details.component';
import {
  ManageSalaryStructureValidityPeriodComponent
} from './salary-structure-validity-period/manage-salary-structure-validity-period/manage-salary-structure-validity-period.component';
import { SalaryStructureValidityPeriodService } from './services/salary-structure-validity-period/salary-structure-validity-period.service';
import { AttendanceInformationsComponent } from '../payroll/components/attendance-informations/attendance-informations.component';
import { ValidateDocumentDetailsComponent } from './document-request/validate-document-details/validate-document-details.component';
import { LeaveBalanceRemainingComponent } from './leave/leave-balance-remaining/leave-balance-remaining.component';
import { LeaveBalanceRemainingService } from './services/leave-balance-remaining/leave-balance-remaining.service';
import { AddCnssComponent } from '../payroll/cnss-type/add-cnss/add-cnss.component';
import { LoanInstallmentService } from './services/loan-installment/loan-installment.service';
import { ListLoanInstallmentComponent } from './loan-installment/list-loan-installment/list-loan-installment.component';
import { ExitEmployeePayComponent } from './components/exit-employee-pay/exit-employee-pay.component';
import { DetailsPayExitEmployeeComponent } from './components/details-pay-exit-employee/details-pay-exit-employee.component';
import { ExitEmployeePayServiceService } from './services/exit-employee-pay/exit-employee-pay-service.service';
import { RuleUniqueReferenceService } from './services/rule-unique-reference/rule-unique-reference.service';
import { ExitEmployeeLeaveService } from './services/exit-employee-leave/exit-employee-leave.service';
import { TeamTypeService } from './services/team-type/team-type.service';
import { ExitReasonTypeDropdownComponent } from '../payroll/components/exit-reason-type-dropdown/exit-reason-type-dropdown.component';
import { SessionLoanListComponent } from '../payroll/session/session-loan-list/session-loan-list.component';
import { DetailsLeaveExitEmployeeComponent } from './components/details-leave-exit-employee/details-leave-exit-employee.component';
import { ExitActionService } from './services/exit-action/exit-action.service';
import { ExitActionEmployeeService } from './services/exit-action-employee/exit-action-employee.service';
import { CandidacyService } from '../rh/services/candidacy/candidacy.service';
import { InterviewTypeService } from '../rh/services/interview-type/interview-type.service';
import { ListInterviewTypeComponent } from '../rh/components/list-interview-type/list-interview-type.component';
import { ResignationEmployeeComponent } from '../payroll/components/resignation-employee/resignation-employee.component';
import { ListAdditionalHourComponent } from './additional-hour/list-additional-hour/list-additional-hour.component';
import { AddAdditionalHourComponent } from './additional-hour/add-additional-hour/add-additional-hour.component';
import { AdditionalHourService } from './services/additional-hour/additional-hour.service';
import { AdditionalHourSlotComponent } from './components/additional-hour-slot/additional-hour-slot.component';
import { EmailHistoryComponent } from '../rh/components/email-history/email-history.component';
import { TransferOrderGenerationComponent } from '../payroll/transfer-order/transfer-order-generation/transfer-order-generation.component';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { InterviewEmailService } from '../rh/services/interview-email/interview-email.service';
import { SessionBonusService } from './services/session-bonus/session-bonus.service';
import { LeaveBalanceDetailComponent } from './leave/leave-balance-detail/leave-balance-detail.component';
import { ProfilEmployeeComponent } from './employee/profil-employee/profil-employee.component';
import { CardEmployeeComponent } from '../payroll/employee/card-employee/card-employee.component';
import { EmployeeResolverServiceService } from './resolvers/employee-resolver-service.service';
import { AddSharedDocumentComponent } from '../rh/shared-document/add-shared-document/add-shared-document.component';
import { SharedDocumentService } from '../rh/services/shared-document/shared-document.service';
import { WrongPayslipListComponent } from '../shared/components/wrong-payslip-list/wrong-payslip-list.component';



@NgModule({
  imports: [
    PayrollRoutingModule,
    SharedModule,
    BarRatingModule
  ],
  declarations: [
    AddSessionComponent,
    ListEmployeeComponent,
    AddEmployeeComponent,
    ListSessionComponent,
    AttendanceComponent,
    ListPayslipComponent,
    AddContractComponent,
    ListContractComponent,
    TypeOfTreatmentComboboxComponent,
    VariableBonusesComponent,
    VariableBonusesComboboxComponent,
    VariableBonusesSectionComponent,
    SessionResumeComponent,
    FixedBonusesMultiselectComponent,
    ListBonusComponent,
    AddBonusComponent,
    SessionHeaderComponent,
    BonusValidityComponent,
    ManageEmployeeDocumentComponent,
    EmployeeDocumentTypeDropdownComponent,
    BonusValidityComponent,
    ListCnssComponent,
    AddEmployeeDocumentComponent,
    ListGradeComponent,
    ListJobComponent,
    BaseSalaryValidityComponent,
    BaseSalaryValidityComponent,
    AddTransferOrderComponent,
    LeaveRequestAddComponent,
    LeaveTypeDropdownComponent,
    ExpenseReportRequestAddComponent,
    DocumentRequestAddComponent,
    DocumentRequestListComponent,
    SearchEmployeeComponent,
    PayslipPreviewComponent,
    AddCnssDeclarationComponent,
    ListCnssDeclarationComponent,
    ExpenseReportDetailsTypeDropdownComponent,
    OrganizationChartEmployeeComponent,
    ListTransferOrderComponent,
    SkillsMatrixComponent,
    ShowJobComponent,
    AddJobComponent,
    ExpenseReportRequestListComponent,
    SkillDropdownComponent,
    LeaveRequestListComponent,
    DocumentRequestShowComponent,
    AddLeaveTypeComponent,
    ListLeaveTypeComponent,
    SearchTeamComponent,
    ExpenseReportDetailTypeComponent,
    ListSalaryRuleComponent,
    AddSalaryRuleComponent,
    ListQualificationTypeComponent,
    ListVariableComponent,
    AddVariableComponent,
    ListSalaryStructureComponent,
    AddSalaryStructureComponent,
    AddVariableComponent,
    AddNotesComponent,
    ListTeamComponent,
    AddTeamComponent,
    AssignmentModalComponent,
    ListContractTypeComponent,
    AddContractTypeComponent,
    ListExitEmployeeComponent,
    ListExitReasonComponent,
    ListBenefitInKindComponent,
    AddBenefitInKindComponent,
    PayslipHistoryComponent,
    ListSourceDeductionSessionComponent,
    AddSourceDeductionSessionComponent,
    ListSourceDeductionComponent,
    LeaveInformationsComponent,
    ManageVariableValidityPeriodComponent,
    ExitEmployeeSteperComponent,
    StepsExitEmployeeComponent,
    AddExitEmployeeComponent,
    RhInformationComponent,
    ItInformationComponent,
    ListMeetingExitEmployeeComponent,
    ListTeamTypeComponent,
    OvershootLeaveModalComponent,
    EmployerDeclarationComponent,
    ListTeamTypeComponent,
    ContractInformationsComponent,
    ListLoanComponent,
    AddLoanRequestComponent,
    ExitEmployeeDesactivateComponent,
    ValidateLeaveUsersDetailsComponent,
    ValidateExpenseDetailsComponent,
    ManageSalaryStructureValidityPeriodComponent,
    ValidateDocumentDetailsComponent,
    LeaveBalanceRemainingComponent,
    LeaveBalanceDetailComponent,
    AddCnssComponent,
    ListLoanInstallmentComponent,
    AttendanceInformationsComponent,
    ExitEmployeePayComponent,
    DetailsPayExitEmployeeComponent,
    DetailsLeaveExitEmployeeComponent,
    ExitReasonTypeDropdownComponent,
    SessionLoanListComponent,
    ResignationEmployeeComponent,
    ListAdditionalHourComponent,
    AddAdditionalHourComponent,
    AdditionalHourSlotComponent,
    TransferOrderGenerationComponent,
    ProfilEmployeeComponent,
    CardEmployeeComponent
  ],


  providers: [
    TimeSheetService,
    ActiveAssignmentService,
    EmployeeTeamService,
    CurrencyService,
    SessionService,
    EmployeeService,
    NotesService,
    GradeService,
    ContractService,
    BonusService,
    JobService,
    SalaryStructureService,
    BaseSalaryService,
    ExchangeBonusDataService,
    AttendanceService,
    ContractBonusService,
    EmployeeDocumentService,
    CnssService,
    TeamService,
    QualificationService,
    TransferOrderService,
    PayslipService,
    PayslipReportingService,
    TransferOrderService,
    LeaveService,
    DocumentRequestService,
    SalaryRuleService,
    DocumentRequestTypeService,
    CnssDeclarationService,
    ExpenseReportService,
    ExpenseReportDetailsTypeService,
    SharedLeaveData,
    ExpenseReportDetailsService,
    LeaveTypeService,
    SkillsService,
    EmployeeSkillsService,
    SkillsFamilyService,
    JobSkillsService,
    StarkPermissionsGuard,
    VariableService,
    EmployeeTeamService,
    RuleUniqueReferenceService,
    ContractTypeService,
    ExitReasonService,
    BenefitInKindService,
    ContractBenefitInKindService,
    ExitEmployeeService,
    SourceDeductionSessionService,
    SourceDeductionService,
    ContractTypeService,
    InterviewService,
    InterviewMarkService,
    TimesheetValidationService,
    LoanService,
    ExitActionService,
    ExitActionEmployeeService,
    ExitEmployeePayServiceService,
    SalaryStructureValidityPeriodService,
    LeaveBalanceRemainingService,
    LoanInstallmentService,
    ExitEmployeeLeaveService,
    TeamTypeService,
    CandidacyService,
    InterviewTypeService,
    AdditionalHourService,
    CanDeactivateGuard,
    InterviewEmailService,
    SessionBonusService,
    EmployeeResolverServiceService,
    SharedDocumentService,
  ],
  entryComponents: [
    PayslipPreviewComponent,
    AddJobComponent,
    ExpenseReportDetailTypeComponent,
    ReportingInModalComponent,
    SkillsFamilyComponent,
    AddCurrencyComponent,
    AssignmentModalComponent,
    LeaveInformationsComponent,
    AddBenefitInKindComponent,
    AddInterviewComponent,
    NewEmailComponent,
    PostponeInterviewComponent,
    OvershootLeaveModalComponent,
    CardEmployeeComponent,
    PostponeInterviewComponent,
    ContractInformationsComponent,
    AttendanceInformationsComponent,
    AddCnssComponent,
    ListInterviewTypeComponent,
    ResignationEmployeeComponent,
    EmailHistoryComponent,
    AddAdditionalHourComponent,
    AddSharedDocumentComponent,
    WrongPayslipListComponent
  ]
})
export class PayrollModule {
}
