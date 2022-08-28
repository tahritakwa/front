import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListEmployeeComponent } from "./employee/list-employee/list-employee.component";
import { AddEmployeeComponent } from "./employee/add-employee/add-employee.component";
import { ListSessionComponent } from "./session/list-session/list-session.component";
import { AddSessionComponent } from "./session/add-session/add-session.component";
import { AttendanceComponent } from "./session/attendance/attendance.component";
import { ListPayslipComponent } from "./session/list-payslip/list-payslip.component";
import { VariableBonusesComponent } from "./session/variable-bonuses/variable-bonuses.component";
import { AddContractComponent } from "./contract/add-contract/add-contract.component";
import { SessionResumeComponent } from "./session/session-resume/session-resume.component";
import { ListBonusComponent } from "./bonus/list-bonus/list-bonus.component";
import { AddBonusComponent } from "./bonus/add-bonus/add-bonus.component";
import { ListCnssComponent } from "./cnss-type/list-cnss/list-cnss.component";
import { AddEmployeeDocumentComponent } from "./employee-document/add-employee-document/add-employee-document.component";
import { ListGradeComponent } from "./grade/list-grade/list-grade.component";
import { ListJobComponent } from "./job/list-job/list-job.component";
import { LeaveRequestAddComponent } from "./leave/leave-request-add/leave-request-add.component";
import { ExpenseReportRequestAddComponent } from "./expense-report/expense-report-request-add/expense-report-request-add.component";
import { DocumentRequestAddComponent } from "./document-request/document-request-add/document-request-add.component";
import { DocumentRequestListComponent } from "./document-request/document-request-list/document-request-list.component";
import { ListCnssDeclarationComponent } from "./cnss-declaration/list-cnss-declaration/list-cnss-declaration.component";
import { AddCnssDeclarationComponent } from "./cnss-declaration/add-cnss-declaration/add-cnss-declaration.component";
import { ReportingInUrlComponent } from "../shared/components/reports/reporting-in-url/reporting-in-url.component";
import { OrganizationChartEmployeeComponent } from "./employee/organization-chart-employee/organization-chart-employee.component";
import { ListTransferOrderComponent } from "./transfer-order/list-transfer-order/list-transfer-order.component";
import { AddTransferOrderComponent } from "./transfer-order/add-transfer-order/add-transfer-order.component";
import { CompanySkillsComponent } from "../administration/company/company-skills/company-skills.component";
import { SkillsMatrixComponent } from "./skills-matrix/skills-matrix.component";
import { ExpenseReportRequestListComponent } from "./expense-report/expense-report-request-list/expense-report-request-list.component";
import { LeaveRequestListComponent } from "./leave/leave-request-list/leave-request-list.component";
import { ListLeaveTypeComponent } from "./leave-type/list-leave-type/list-leave-type.component";
import { AddLeaveTypeComponent } from "./leave-type/add-leave-type/add-leave-type.component";
import { AddQualificationComponent } from "../shared/components/qualification/add-qualification/add-qualification.component";
import { RoleConfigConstant } from "../Structure/_roleConfigConstant";
// tslint:disable-next-line:max-line-length
import { ExpenseReportDetailTypeComponent } from "./expense-report-detail-type/expense-report-detail-type/expense-report-detail-type.component";
import { ListSalaryRuleComponent } from "./salary-rule/list-salary-rule/list-salary-rule.component";
import { AddSalaryRuleComponent } from "./salary-rule/add-salary-rule/add-salary-rule.component";
import { ListQualificationTypeComponent } from "./qualification-type/list-qualification-type/list-qualification-type.component";
import { SharedConstant } from "../constant/shared/shared.constant";
import { StarkPermissionsGuard } from "../stark-permissions/stark-permissions.module";
import { ListVariableComponent } from "./variable/list-variable/list-variable.component";
import { AddVariableComponent } from "./variable/add-variable/add-variable.component";
import { ListSalaryStructureComponent } from "./salary-structure/list-salary-structure/list-salary-structure.component";
import { AddSalaryStructureComponent } from "./salary-structure/add-salary-structure/add-salary-structure.component";
import { ListContractTypeComponent } from "./contract-type/list-contract-type/list-contract-type.component";
import { AddContractTypeComponent } from "./contract-type/add-contract-type/add-contract-type.component";
import { ListExitEmployeeComponent } from "./exit-employee/list-exit-employee/list-exit-employee.component";
import { AddExitEmployeeComponent } from "./exit-employee/add-exit-employee/add-exit-employee.component";
import { ListExitReasonComponent } from "./exit-reason/list-exit-reason.component";
import { ListTeamComponent } from "./team/list-team/list-team.component";
import { AddTeamComponent } from "./team/add-team/add-team.component";
import { ListBenefitInKindComponent } from "./benefit-in-kind/list-benefit-in-kind/list-benefit-in-kind.component";
import { PayslipHistoryComponent } from "./payslip-history/payslip-history.component";
import { ListSourceDeductionSessionComponent } from "./source-deduction/list-source-deduction-session/list-source-deduction-session.component";
import { AddSourceDeductionSessionComponent } from "./source-deduction/add-source-deduction-session/add-source-deduction-session.component";
import { ListSourceDeductionComponent } from "./source-deduction/list-source-deduction/list-source-deduction.component";
import { StepsExitEmployeeComponent } from "./exit-employee/steps-exit-employee/steps-exit-employee.component";
import { EmployerDeclarationComponent } from "./employer-declaration/employer-declaration.component";
import { ListLoanComponent } from "./loan/list-loan/list-loan.component";
import { AddLoanRequestComponent } from "./loan/add-loan-request/add-loan-request.component";
import { ListContractComponent } from "./contract/list-contract/list-contract.component";
import { ValidateLeaveUsersDetailsComponent } from "./leave/validate-leave-users-details/validate-leave-users-details.component";
import { ValidateExpenseDetailsComponent } from "./expense-report/validate-expense-details/validate-expense-details.component";
import { ValidateDocumentDetailsComponent } from "./document-request/validate-document-details/validate-document-details.component";
import { DetailsPayExitEmployeeComponent } from "./components/details-pay-exit-employee/details-pay-exit-employee.component";
import { LeaveBalanceRemainingComponent } from "./leave/leave-balance-remaining/leave-balance-remaining.component";
import { SessionLoanListComponent } from "./session/session-loan-list/session-loan-list.component";
import { DetailsLeaveExitEmployeeComponent } from "./components/details-leave-exit-employee/details-leave-exit-employee.component";
import { ListAdditionalHourComponent } from "./additional-hour/list-additional-hour/list-additional-hour.component";
import { AddAdditionalHourComponent } from "./additional-hour/add-additional-hour/add-additional-hour.component";
import { TransferOrderGenerationComponent } from "./transfer-order/transfer-order-generation/transfer-order-generation.component";
import { CanDeactivateGuard } from "./services/can-deactivate-guard.service";
import { PermissionConstant } from "../Structure/permission-constant";
import { ProfilEmployeeComponent } from "./employee/profil-employee/profil-employee.component";
import { EmployeeResolverServiceService } from "./resolvers/employee-resolver-service.service";
import { ListLanguageComponent } from "../administration/language/list-language/list-language.component";

const routes: Routes = [
  {
    path: "",
    canActivateChild: [StarkPermissionsGuard],
    data: {
      permissions: {
        only: [
          PermissionConstant.RHAndPaiePermissions.LIST_EMPLOYEE,
          PermissionConstant.RHAndPaiePermissions.LIST_CONTRACT,
          PermissionConstant.RHAndPaiePermissions.LIST_TEAM,
          PermissionConstant.RHAndPaiePermissions.VIEW_ORGANIZATIONCHART,
        ],
        redirectTo: SharedConstant.DASHBOARD_URL,
      },
    },
    children: [
      {
        path: "employee",
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_EMPLOYEE, PermissionConstant.RHAndPaiePermissions.SHOW_EMPLOYEE,
              PermissionConstant.RHAndPaiePermissions.UPDATE_EMPLOYEE],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListEmployeeComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_EMPLOYEE],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddEmployeeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.ADD_EMPLOYEE],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddEmployeeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.SHOW_EMPLOYEE, PermissionConstant.RHAndPaiePermissions.UPDATE_EMPLOYEE],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "organizationChart",
            component: OrganizationChartEmployeeComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions
                    .VIEW_ORGANIZATIONCHART,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "profil/:id",
            component: ProfilEmployeeComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: { employeeToUpdate: EmployeeResolverServiceService },
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_EMPLOYEE],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "paysliphistory",
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_PAYSLIPHISTORY],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: PayslipHistoryComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.LIST_PAYSLIPHISTORY,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "session",
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_SESSION],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListSessionComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_SESSION],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddSessionComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.OPEN_PAYROLL_SESSION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add/:id",
            component: AddSessionComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.SHOW_PAYROLL_SESSION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "attendance/:id",
            component: AttendanceComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.SHOW_PAYROLL_SESSION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "loan/:id",
            component: SessionLoanListComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.SHOW_PAYROLL_SESSION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "bonus/:id",
            component: VariableBonusesComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.SHOW_PAYROLL_SESSION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "payslip/:id",
            component: ListPayslipComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.SHOW_PAYROLL_SESSION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "resume/:id",
            component: SessionResumeComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.SHOW_PAYROLL_SESSION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "report/:id/:reportname",
            component: ReportingInUrlComponent,
            data: {
              title: "",
            },
          },
        ],
      },
      {
        path: "sourcedeductionsession",
        data: {
          permissions: {
            only: [
              PermissionConstant.RHAndPaiePermissions
                .LIST_SOURCEDEDUCTIONSESSION,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListSourceDeductionSessionComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions
                    .LIST_SOURCEDEDUCTIONSESSION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddSourceDeductionSessionComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions
                    .ADD_SOURCEDEDUCTIONSESSION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddSourceDeductionSessionComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions
                    .SHOW_SOURCEDEDUCTIONSESSION,
                    PermissionConstant.RHAndPaiePermissions
                    .UPDATE_SOURCEDEDUCTIONSESSION
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "sourcededuction/:id",
            component: ListSourceDeductionComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions
                    .SHOW_SOURCEDEDUCTIONSESSION,
                    PermissionConstant.RHAndPaiePermissions
                    .UPDATE_SOURCEDEDUCTIONSESSION
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "employerdeclaration",
        data: {
          permissions: {
            only: [
              PermissionConstant.RHAndPaiePermissions.DECLARATION_EMPLOYEE,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: EmployerDeclarationComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.DECLARATION_EMPLOYEE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "contract",
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_CONTRACT],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListContractComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_CONTRACT],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddContractComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.ADD_CONTRACT],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddContractComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.SHOW_CONTRACT, PermissionConstant.RHAndPaiePermissions.UPDATE_CONTRACT],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "employeeDocument",
        children: [
          {
            path: "add",
            component: AddEmployeeDocumentComponent,
            data: {
              permissions: {
                only: [
                  RoleConfigConstant.Resp_PayConfig,
                  RoleConfigConstant.ManagerConfig,
                  RoleConfigConstant.Resp_RhConfig,
                  RoleConfigConstant.AdminConfig,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddEmployeeDocumentComponent,
            data: {
              permissions: {
                only: [
                  RoleConfigConstant.Resp_PayConfig,
                  RoleConfigConstant.ManagerConfig,
                  RoleConfigConstant.Resp_RhConfig,
                  RoleConfigConstant.AdminConfig,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "bonus",
        data: {
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_BONUS],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListBonusComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.LIST_BONUS,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddBonusComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.ADD_BONUS,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddBonusComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_BONUS,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "cnss",
        data: {
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_CNSS],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListCnssComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.LIST_CNSS,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "benefitInKind",
        data: {
          permissions: {
            only: [
              PermissionConstant.SettingsRHAndPaiePermissions
                .LIST_BENEFITINKIND,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListBenefitInKindComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .LIST_BENEFITINKIND,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "grade",
        data: {
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_GRADE],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListGradeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.LIST_GRADE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "exit-reason",
        data: {
          permissions: {
            only: [
              PermissionConstant.SettingsRHAndPaiePermissions.LIST_EXITREASON,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListExitReasonComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .LIST_EXITREASON,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "job",
        data: {
          permissions: {
            only: [
              PermissionConstant.SettingsRHAndPaiePermissions.LIST_JOB,
              PermissionConstant.SettingsRHAndPaiePermissions.SHOW_JOB,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListJobComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.LIST_JOB,
                  PermissionConstant.SettingsRHAndPaiePermissions.SHOW_JOB,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "team",
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_TEAM],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListTeamComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_TEAM],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddTeamComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.ADD_TEAM],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddTeamComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.SHOW_TEAM, PermissionConstant.RHAndPaiePermissions.UPDATE_TEAM],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "qualification",
        children: [
          {
            path: "add",
            component: AddQualificationComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.LIST_QUALIFICATION,
                  PermissionConstant.RHAndPaiePermissions.ADD_QUALIFICATION,
                  PermissionConstant.RHAndPaiePermissions.DELETE_QUALIFICATION,
                  PermissionConstant.RHAndPaiePermissions.UPDATE_QUALIFICATION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddQualificationComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.LIST_QUALIFICATION,
                  PermissionConstant.RHAndPaiePermissions.ADD_QUALIFICATION,
                  PermissionConstant.RHAndPaiePermissions.DELETE_QUALIFICATION,
                  PermissionConstant.RHAndPaiePermissions.UPDATE_QUALIFICATION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "qualification-type",
        data: {
          permissions: {
            only: [
              PermissionConstant.SettingsRHAndPaiePermissions
                .LIST_QUALIFICATIONTYPE,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListQualificationTypeComponent,
            canDeactivate: [CanDeactivateGuard],
          },
        ],
      },
      {
        path: "leave",
        data: {
          permissions: {
            only: [
              PermissionConstant.RHAndPaiePermissions.LIST_LEAVE,
              PermissionConstant.RHAndPaiePermissions.ADD_LEAVE,
              PermissionConstant.RHAndPaiePermissions
                .LIST_LEAVEREMAININGBALANCE,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: LeaveRequestListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_LEAVE],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: LeaveRequestAddComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.ADD_LEAVE],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "leave-remaining",
            component: LeaveBalanceRemainingComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions
                    .LIST_LEAVEREMAININGBALANCE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: LeaveRequestAddComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.SHOW_LEAVE, PermissionConstant.RHAndPaiePermissions.UPDATE_LEAVE],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "validateLeave",
            children: [
              {
                path: "list",
                component: ValidateLeaveUsersDetailsComponent,
                data: {
                  title: "Desactivate users",
                  permissions: {
                    only: [
                      PermissionConstant.RHAndPaiePermissions
                        .MASSIVE_VALIDATE_LEAVE,
                    ],
                    redirectTo: SharedConstant.DASHBOARD_URL,
                  },
                },
              },
            ],
          },
        ],
      },
      {
        path: "leave-type",
        data: {
          permissions: {
            only: [
              PermissionConstant.SettingsRHAndPaiePermissions.LIST_LEAVETYPE,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListLeaveTypeComponent,
            canActivate: [StarkPermissionsGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .LIST_LEAVETYPE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddLeaveTypeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.ADD_LEAVETYPE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddLeaveTypeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.SHOW_LEAVETYPE,
                  PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_LEAVETYPE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "language",
        component: ListLanguageComponent,
        data: {
          permissions: {
            only: [
              PermissionConstant.SettingsRHAndPaiePermissions.LIST_LANGUAGE,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        }
      },
      {
        path: "contract-type",
        data: {
          permissions: {
            only: [
              PermissionConstant.SettingsRHAndPaiePermissions.LIST_CONTRACTTYPE,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListContractTypeComponent,
            canActivate: [StarkPermissionsGuard],
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .LIST_CONTRACTTYPE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddContractTypeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .ADD_CONTRACTTYPE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddContractTypeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.SHOW_CONTRACTTYPE,
                  PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_CONTRACTTYPE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "expense-report-type",
        data: {
          permissions: {
            only: [
              PermissionConstant.SettingsRHAndPaiePermissions
                .LIST_EXPENSEREPORTDETAILSTYPE,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ExpenseReportDetailTypeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .LIST_EXPENSEREPORTDETAILSTYPE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "expenseReport",
        data: {
          permissions: {
            only: [
              PermissionConstant.RHAndPaiePermissions.LIST_EXPENSEREPORT,
              PermissionConstant.RHAndPaiePermissions.ADD_EXPENSEREPORT,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ExpenseReportRequestListComponent,
            canActivate: [StarkPermissionsGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.LIST_EXPENSEREPORT,
                  PermissionConstant.RHAndPaiePermissions.ADD_EXPENSEREPORT,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: ExpenseReportRequestAddComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.ADD_EXPENSEREPORT,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: ExpenseReportRequestAddComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.UPDATE_EXPENSEREPORT,
                  PermissionConstant.RHAndPaiePermissions.SHOW_EXPENSEREPORT
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "validateExpense",
            children: [
              {
                path: "list",
                component: ValidateExpenseDetailsComponent,
                data: {
                  title: "Validate expenses",
                  permissions: {
                    only: [
                      RoleConfigConstant.AdminConfig,
                      RoleConfigConstant.SettingsConfig,
                    ],
                    redirectTo: SharedConstant.DASHBOARD_URL,
                  },
                },
              },
            ],
          },
        ],
      },
      {
        path: "document",
        data: {
          permissions: {
            only: [
              PermissionConstant.RHAndPaiePermissions.LIST_DOCUMENTREQUEST,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: DocumentRequestListComponent,
            canActivate: [StarkPermissionsGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.LIST_DOCUMENTREQUEST,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: DocumentRequestAddComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.ADD_DOCUMENTREQUEST,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: DocumentRequestAddComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions
                    .UPDATE_DOCUMENTREQUEST, PermissionConstant.RHAndPaiePermissions
                    .SHOW_DOCUMENTREQUEST
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "validatedocument",
            children: [
              {
                path: "list",
                component: ValidateDocumentDetailsComponent,
                data: {
                  title: "Validate documents",
                  permissions: {
                    only: [
                      PermissionConstant.RHAndPaiePermissions
                        .LIST_DOCUMENTREQUEST,
                    ],
                    redirectTo: SharedConstant.DASHBOARD_URL,
                  },
                },
              },
            ],
          },
        ],
      },
      {
        path: "cnssdeclaration",
        data: {
          permissions: {
            only: [
              PermissionConstant.RHAndPaiePermissions.LIST_CNSSDECLARATION,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListCnssDeclarationComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.LIST_CNSSDECLARATION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddCnssDeclarationComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.ADD_CNSSDECLARATION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddCnssDeclarationComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.SHOW_CNSSDECLARATION,
                  PermissionConstant.RHAndPaiePermissions.UPDATE_CNSSDECLARATION
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "report/:id/:reportname",
            component: ReportingInUrlComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.ADD_CNSSDECLARATION,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "skills",
        data: {
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_SKILLS],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: CompanySkillsComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.LIST_SKILLS,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "skillsMatrix",
        data: {
          permissions: {
            only: [
              PermissionConstant.SettingsRHAndPaiePermissions
                .VIEW_SKILLS_MATRIX,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: SkillsMatrixComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .VIEW_SKILLS_MATRIX,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "transferorder",
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_TRANSFERORDER],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListTransferOrderComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.LIST_TRANSFERORDER,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddTransferOrderComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.ADD_TRANSFERORDER,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add/:id",
            component: AddTransferOrderComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.SHOW_TRANSFER_ORDER,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "transferOrdergeneration/:id",
            component: TransferOrderGenerationComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.SHOW_TRANSFER_ORDER,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "report/:id/:reportname",
            component: ReportingInUrlComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions
                    .GENERATE_TRANSFER_ORDER,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "salaryRule",
        data: {
          permissions: {
            only: [
              PermissionConstant.SettingsRHAndPaiePermissions.LIST_SALARYRULE,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListSalaryRuleComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .LIST_SALARYRULE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddSalaryRuleComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .ADD_SALARYRULE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddSalaryRuleComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.SHOW_SALARYRULE,
                  PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_SALARYRULE
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "variable",
        data: {
          permissions: {
            only: [
              PermissionConstant.SettingsRHAndPaiePermissions.LIST_VARIABLE,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListVariableComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.LIST_VARIABLE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddVariableComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.ADD_VARIABLE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddVariableComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.SHOW_VARIABLE,
                  PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_VARIABLE
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "exit-employee",
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_EXITEMPLOYEE],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListExitEmployeeComponent,
            canActivate: [StarkPermissionsGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.LIST_EXITEMPLOYEE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: StepsExitEmployeeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.ADD_EXITEMPLOYEE, PermissionConstant.RHAndPaiePermissions.UPDATE_EXITEMPLOYEE,
                  PermissionConstant.RHAndPaiePermissions.SHOW_EXITEMPLOYEE
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddExitEmployeeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.ADD_EXITEMPLOYEE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "show",
            component: ListExitEmployeeComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions.ADD_EXITEMPLOYEE
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "salaryStructure",
        data: {
          permissions: {
            only: [
              PermissionConstant.SettingsRHAndPaiePermissions
                .LIST_SALARYSTRUCTURE,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListSalaryStructureComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .LIST_SALARYSTRUCTURE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddSalaryStructureComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .ADD_SALARYSTRUCTURE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "duplicateItem/:cloneId",
            component: AddSalaryStructureComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .ADD_SALARYSTRUCTURE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddSalaryStructureComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions.SHOW_SALARYSTRUCTURE,
                  PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_SALARYSTRUCTURE
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "loan",
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_LOAN],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListLoanComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_LOAN],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddLoanRequestComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.ADD_LOAN],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddLoanRequestComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.SHOW_LOAN, PermissionConstant.RHAndPaiePermissions.UPDATE_LOAN],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "details-exit-employee-pay",
        data: {
          permissions: {
            only: [
              PermissionConstant.RHAndPaiePermissions.LIST_EXITEMPLOYEEPAYLINE,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "edit/:id",
            component: DetailsPayExitEmployeeComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions
                    .LIST_EXITEMPLOYEEPAYLINE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "details-exit-employee-leave",
        data: {
          permissions: {
            only: [
              PermissionConstant.RHAndPaiePermissions
                .LIST_EXITEMPLOYEELEAVELINE,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "edit/:id",
            component: DetailsLeaveExitEmployeeComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.RHAndPaiePermissions
                    .LIST_EXITEMPLOYEELEAVELINE,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
      {
        path: "additionalHour",
        data: {
          permissions: {
            only: [
              PermissionConstant.SettingsRHAndPaiePermissions
                .LIST_ADDITIONAL_HOUR,
            ],
            redirectTo: SharedConstant.DASHBOARD_URL,
          },
        },
        children: [
          {
            path: "",
            component: ListAdditionalHourComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .LIST_ADDITIONAL_HOUR,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "add",
            component: AddAdditionalHourComponent,
            data: {
              permissions: {
                only: [// to do
                  //PermissionConstant.SettingsRHAndPaiePermissions.ADD_ADDITIONAL_HOUR,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
          {
            path: "edit/:id",
            component: AddAdditionalHourComponent,
            data: {
              permissions: {
                only: [
                  PermissionConstant.SettingsRHAndPaiePermissions
                    .UPDATE_ADDITIONAL_HOUR,
                ],
                redirectTo: SharedConstant.DASHBOARD_URL,
              },
            },
          },
        ],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {}
