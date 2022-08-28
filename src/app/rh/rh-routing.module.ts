import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedConstant } from '../constant/shared/shared.constant';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import { PermissionConstant } from '../Structure/permission-constant';
import { AddCandidateComponent } from './candidate/add-candidate/add-candidate.component';
import { ListCandidateComponent } from './candidate/list-candidate/list-candidate.component';
import { ListEvaluationCriteriaThemeComponent } from './components/list-evaluation-criteria-theme/list-evaluation-criteria-theme.component';
import { ListInterviewTypeComponent } from './components/list-interview-type/list-interview-type.component';
import { ListEvaluationComponent } from './evaluation/list-evaluation/list-evaluation.component';
import { AddMobilityRequestComponent } from './mobility-request/add-mobility-request/add-mobility-request.component';
import { ListMobilityRequestComponent } from './mobility-request/list-mobility-request/list-mobility-request.component';
import { AddRecruitmentRequestOfferComponent } from './recruitment-request-offer/add-recruitment-request-offer/add-recruitment-request-offer.component';
import { AddRecruitmentComponent } from './recruitment/add-recruitment/add-recruitment.component';
import { ListRecruitmentComponent } from './recruitment/list-recruitment/list-recruitment.component';
import { AddReviewNotificationDaysComponent } from './review/add-review-notification-days/add-review-notification-days/add-review-notification-days.component';
import { AddReviewComponent } from './review/add-review/add-review.component';
import { ConfigureReviewManagerComponent } from './review/configure-review-manager/configure-review-manager.component';
import { ListReviewComponent } from './review/list-review/list-review.component';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { ListSharedDocumentComponent } from './shared-document/list-shared-document/list-shared-document.component';
import { ExplorerStarkdriveComponent } from './starkdrive/explorer-starkdrive/explorer-starkdrive.component';
import { AddTimesheetComponent } from './timesheet/add-timesheet/add-timesheet.component';
import { GridTimesheetComponent } from './timesheet/grid-timesheet/grid-timesheet.component';
import { ListTimesheetComponent } from './timesheet/list-timesheet/list-timesheet.component';
import { ValidateCraDetailsComponent } from './timesheet/validate-cra-details/validate-cra-details.component';
import { TrainingAddComponent } from './training/training-add/training-add.component';
import { TrainingCatalogComponent } from './training/training-catalog/training-catalog.component';
import { TrainingListRequestComponent } from './training/training-list-request/training-list-request.component';
import { TrainingSessionAddComponent } from './training/training-session-add/training-session-add.component';
import { TrainingSessionListComponent } from './training/training-session-list/training-session-list.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [StarkPermissionsGuard],
    data: {
      permissions: {
        only: [
          PermissionConstant.RHAndPaiePermissions.LIST_TIMESHEET,
          PermissionConstant.RHAndPaiePermissions.TIMESHEET_MY_TIMESHEET,
          PermissionConstant.RHAndPaiePermissions.LIST_TRAINING,
          PermissionConstant.RHAndPaiePermissions.LIST_REVIEW,
          PermissionConstant.RHAndPaiePermissions.LIST_RECRUITMENT,
          PermissionConstant.RHAndPaiePermissions.LIST_ANNUALINTERVIEW,
          PermissionConstant.RHAndPaiePermissions.UPDATE_ANNUALINTERVIEW
        ],
        redirectTo: SharedConstant.DASHBOARD_URL,
      },
    },
    children: [
      {
        path: 'timesheet',
        children: [
          {
            path: '',
            component: ListTimesheetComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.TIMESHEET_MY_TIMESHEET],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
          {
            path: 'list',
            component: GridTimesheetComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_TIMESHEET],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
          {
            path: 'add',
            component: AddTimesheetComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.ADD_TIMESHEET],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
          {
            path: 'add/:id',
            component: AddTimesheetComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.SHOW_TIMESHEET],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
          {
            path: 'add/:idEmployee/:month/:year',
            component: AddTimesheetComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.ADD_TIMESHEET],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
          {
            path: 'validateCra',
            children: [
              {
                path: 'list',
                component: ValidateCraDetailsComponent,
                data: {
                  title: 'Validate CRA',
                  permissions: {
                    only: [PermissionConstant.RHAndPaiePermissions.MASSIVE_VALIDATE_TIMESHEET],
                    redirectTo: SharedConstant.DASHBOARD_URL
                  }
                },
              }
            ]
          },
        ],
      },
      {
        path: 'sharedDocument',
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_SHAREDDOCUMENT, PermissionConstant.RHAndPaiePermissions.LIST_OWNED_SHARED_DOCUMENT],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_SHAREDDOCUMENT, PermissionConstant.RHAndPaiePermissions.LIST_OWNED_SHARED_DOCUMENT],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
            component: ListSharedDocumentComponent,
          },
        ],
      },
      {
        path: 'training',
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_TRAINING,
              PermissionConstant.RHAndPaiePermissions.LIST_TRAININGREQUEST, PermissionConstant.RHAndPaiePermissions.ALL_TRAINING_REQUEST],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: TrainingCatalogComponent,
          },
          {
            path: 'add',
            component: TrainingAddComponent,
          },
          {
            path: 'add/:id',
            component: TrainingAddComponent,
          },
          {
            path: 'catalog',
            component: TrainingCatalogComponent,
          },
          {
            path: 'session',
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_TRAININGSESSION],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
            children: [
              {
                path: '',
                component: TrainingSessionListComponent,
              },
              {
                path: 'add/:idTraining',
                component: TrainingSessionAddComponent,
                canDeactivate: [CanDeactivateGuard]
              },
              {
                path: 'edit/:id',
                component: TrainingSessionAddComponent,
                canDeactivate: [CanDeactivateGuard]
              },
            ],
          },
          {
            path: 'request',
            component: TrainingListRequestComponent,
          },
        ],
      },
      {
        path: 'recruitment',
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_RECRUITMENT],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: ListRecruitmentComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_RECRUITMENT],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
          {
            path: 'add',
            component: AddRecruitmentComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.ADD_RECRUITMENT],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }

          },
          {
            path: 'edit/:id',
            component: AddRecruitmentComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENT,
                  PermissionConstant.RHAndPaiePermissions.SHOW_RECRUITMENT],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
        ],
      },

      {
        path: 'review',
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_ANNUALINTERVIEW,
              PermissionConstant.RHAndPaiePermissions.UPDATE_ANNUALINTERVIEW,
               PermissionConstant.SettingsRHAndPaiePermissions.SHOW_GENERALSETTINGS,
               PermissionConstant.SettingsRHAndPaiePermissions.SHOW_JOBSPARAMETERS,
               PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_GENERALSETTINGS,
               PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_JOBSPARAMETERS],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: ListReviewComponent,
          },
          {
            path: 'add',
            component: AddReviewComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'edit/:id',
            component: AddReviewComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'notification',
            component: AddReviewNotificationDaysComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'manager',
            component: ConfigureReviewManagerComponent,
            canDeactivate: [CanDeactivateGuard]
          }
        ]
      },
      {
        path: 'candidate',
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_CANDIDATE],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: ListCandidateComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_CANDIDATE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'add',
            component: AddCandidateComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.ADD_CANDIDATE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddCandidateComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.SHOW_CANDIDATE, PermissionConstant.RHAndPaiePermissions.UPDATE_CANDIDATE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            },
          },
        ],
      },
      {
        path: 'recruitment-request',
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_RECRUITMENTREQUEST],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: ListRecruitmentComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_RECRUITMENTREQUEST],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
          {
            path: 'add',
            component: AddRecruitmentRequestOfferComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.ADD_RECRUITMENTREQUEST],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
          {
            path: 'edit/:id',
            component: AddRecruitmentRequestOfferComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENTREQUEST,
                  PermissionConstant.RHAndPaiePermissions.SHOW_RECRUITMENTREQUEST],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
        ],
      },
      {
        path: 'recruitment-offer',
        data: {
          permissions: {
            only: [PermissionConstant.RHAndPaiePermissions.LIST_RECRUITMENTOFFER],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: ListRecruitmentComponent,
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.LIST_RECRUITMENTOFFER],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
          {
            path: 'add',
            component: AddRecruitmentRequestOfferComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.ADD_RECRUITMENTOFFER],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
          {
            path: 'edit/:id',
            component: AddRecruitmentRequestOfferComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.SHOW_RECRUITMENTOFFER,
                  PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENTOFFER],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
        ],
      },

      {
        path: 'mobility-request',
        children: [
          {
            path: '',
            component: ListMobilityRequestComponent,
          },
          {
            path: 'add',
            component: AddMobilityRequestComponent,
          },
          {
            path: 'edit/:id',
            component: AddMobilityRequestComponent,
          },
        ],
      },
      {
        path: 'evaluation',
        children: [
          {
            path: '',
            component: ListEvaluationComponent,
          },
        ],
      },
      {
        path: 'interview-type',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_INTERVIEWTYPE],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: ListInterviewTypeComponent,
            canDeactivate: [CanDeactivateGuard],
          },
        ],
      },
      {
        path: 'evaluation-criteria',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_EVALUATIONCRITERIATHEME],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: ListEvaluationCriteriaThemeComponent,
          },
        ],
      },
      {
        path: 'explorer-starkdrive',
        children: [
          {
            path: '',
            component: ExplorerStarkdriveComponent,
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
export class RhRoutingModule { }
