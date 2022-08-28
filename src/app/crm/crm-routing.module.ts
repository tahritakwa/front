import {RouterModule, Routes} from '@angular/router';
import {PopupAddStatusOpportunityComponent} from './components/opportunity/add-status-opportunity/popup-add-status-opportunity.component';
import {OpportunityKanbanComponent} from './components/opportunity/opportunity-kanban/opportunity-kanban.component';
import {OpportunityConstant} from '../constant/crm/opportunityConstant';
import {NgModule} from '@angular/core';
import {AddCategoryComponent} from './components/category/add-category/add-category.component';
import {ListCategoryConfigComponent} from './components/category/list-category-config/list-category-config.component';
import {DetailContactCrmComponent} from './components/contact-crm/detail-contact-crm/detail-contact-crm.component';
import {AddProspectComponent} from './components/contact-crm/add-prospect/add-prospect.component';
import {OrganisationAddComponent} from './components/organisation/organisation-add/organisation-add.component';
import {OpportunityListComponent} from './components/opportunity/opportunity-list/opportunity-list.component';
import {OrganisationListComponent} from './components/organisation/organisation-list/organisation-list.component';
import {AddNewOpportunityComponent} from './components/opportunity/add-new-opportunity/add-new-opportunity.component';
import {ContactListComponent} from './components/contact-crm/contact-list.component';
import {CanDeactivateGuard} from './services/can-deactivate-guard.service';
import {ListStatusOpportunityComponent} from './components/status-opportunity/list-status-opportunity/list-status-opportunity.component';
import {ActionsListComponent} from './components/action/actions-list/actions-list.component';
import {AddActionComponent} from './components/action/add-action/add-action.component';
import {AddClaimComponent} from './components/claim/add-claim/add-claim.component';
import {ClaimsListComponent} from './components/claim/claims-list/claims-list.component';
import {CalendarComponent} from './components/calendar/calendar.component';
import {ListNoteComponent} from './components/note/list-note/list-note.component';
import {AddNoteComponent} from './components/note/add-note/add-note.component';
import {StarkPermissionsGuard} from '../stark-permissions/router/permissions-guard.service';
import {RoleConfigConstant} from '../Structure/_roleConfigConstant';
import {ActionArchivingComponent} from './components/archiving/action-archiving/action-archiving.component';
import {OrganisationArchivingComponent} from './components/archiving/organisation-archiving/organisation-archiving.component';
import {ContactArchivingComponent} from './components/archiving/contact-archiving/contact-archiving.component';
import {OpportunityArchivingComponent} from './components/archiving/opportunity-archiving/opportunity-archiving.component';
import {ClaimArchivingComponent} from './components/archiving/claim-archiving/claim-archiving.component';
import {SettingCategoryAndDropdownsComponent} from './components/pipeline/setting-category-and-dropdowns/setting-category-and-dropdowns.component';
import {AddStatusComponent} from './components/status-opportunity/add-status/add-status.component';
import {OrganisationDetailsComponent} from './components/organisation/organisation-details/organisation-details.component';
import {OpportunityDetailsComponent} from './components/opportunity/opportunity-details/opportunity-details.component';
import {DetailClaimComponent} from './components/claim/detail-claim/detail-claim.component';
import {DetailActionComponent} from './components/action/detail-action/detail-action.component';
import {PipelineListComponent} from './components/pipeline/pipeline-list/pipeline-list.component';
import { SharedConstant } from '../constant/shared/shared.constant';
import { PermissionConstant } from '../Structure/permission-constant';
import { ListDropdownsComponent } from './components/dropdowns/list-dropdowns/list-dropdowns.component';
import { AddDropdownsComponent } from './components/dropdowns/add-dropdowns/add-dropdowns.component';
import {ListCampaignComponent} from "./components/campaign/list-campaign/list-campaign.component";
import {AddCampaignComponent} from "./components/campaign/add-campaign/add-campaign.component";
const redirectToDashboardRoute = '/main/dashboard';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [StarkPermissionsGuard],
    data: {
      permissions: {
        only: [
          PermissionConstant.CRMPermissions.CRM
        ],
        redirectTo: SharedConstant.DASHBOARD_URL,
      },
    },
    children: [
      {
        path: 'status-opportunity',
        component: PopupAddStatusOpportunityComponent,
        data: {
          title: 'Listes des status',
          permissions: {
            only: [RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.AdminConfig, RoleConfigConstant.CrmConfig],
            redirectTo: redirectToDashboardRoute
          }
        },
      }
    ]
  },
  {
    path: 'action',
    canActivateChild: [StarkPermissionsGuard],
    data: {
      permissions: {
        only: [PermissionConstant.CRMPermissions.VIEW_ACTION],
        redirectTo: SharedConstant.DASHBOARD_URL
      }
    },
    children: [
      {
        path: '',
        component: ActionsListComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Listes des actions',
          permissions: {
            only: [PermissionConstant.CRMPermissions.VIEW_ACTION],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'add',
        component: AddActionComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Ajout action',
          permissions: {
            only: [PermissionConstant.CRMPermissions.ADD_ACTION],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'edit/:id',
        component: DetailActionComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Détails action',
          permissions: {
            only: [RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.AdminConfig, RoleConfigConstant.CrmConfig],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'related/organisation/:organisationId/:archive',
        component: ActionsListComponent,
        data: {
          title: 'Detail action',
          permissions: {
            only: [PermissionConstant.CRMPermissions.OWN_ACTION, PermissionConstant.CRMPermissions.EDIT_ACTION,
              PermissionConstant.CRMPermissions.OWN_ORGANISATION, PermissionConstant.CRMPermissions.EDIT_ORGANISATION],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'related/contact/:contactId/:archive',
        component: ActionsListComponent,
        data: {
          title: 'Detail action',
          permissions: {
            only: [PermissionConstant.CRMPermissions.OWN_ACTION, PermissionConstant.CRMPermissions.EDIT_ACTION,
              PermissionConstant.CRMPermissions.OWN_CONTACT, PermissionConstant.CRMPermissions.EDIT_CONTACT],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'related/opportunity/:opportunityId/:archive',
        component: ActionsListComponent,
        data: {
          title: 'Detail action',
          permissions: {
            only: [PermissionConstant.CRMPermissions.OWN_ACTION, PermissionConstant.CRMPermissions.EDIT_ACTION,
              PermissionConstant.CRMPermissions.OWN_CONTACT, PermissionConstant.CRMPermissions.EDIT_CONTACT],
            redirectTo: redirectToDashboardRoute
          }
        },
      }
    ]
  },
  {
    path: 'organisation',
    canActivateChild: [StarkPermissionsGuard],
    data: {
      permissions: {
        only: [PermissionConstant.CRMPermissions.VIEW_ORGANISATION_LEAD, PermissionConstant.CRMPermissions.VIEW_ORGANISATION_CLIENT],
        redirectTo: SharedConstant.DASHBOARD_URL
      }
    },
    children: [
      {
        path: '',
        component: OrganisationListComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Listes des organisations',
          permissions: {
            only: [PermissionConstant.CRMPermissions.VIEW_ORGANISATION_CLIENT, PermissionConstant.CRMPermissions.VIEW_ORGANISATION_LEAD],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'add',
        component: OrganisationAddComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Ajout organisation',
          permissions: {
            only: [PermissionConstant.CRMPermissions.ADD_ORGANISATION],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'details/:id/:isProspect',
        component: OrganisationDetailsComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Détails organisation',
          permissions: {
            only: [RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.AdminConfig, RoleConfigConstant.CrmConfig],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'edit/:id',
        component: OrganisationAddComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Edit organisation',
          permissions: {
            only: [PermissionConstant.CRMPermissions.EDIT_ORGANISATION,
              PermissionConstant.CRMPermissions.OWN_CONTACT, PermissionConstant.CRMPermissions.EDIT_CONTACT],
            redirectTo: redirectToDashboardRoute
          }
        },
      }
    ]
  },
  {
    path: 'calendar',
    canActivateChild: [StarkPermissionsGuard],
    data: {
      permissions: {
        only: [PermissionConstant.CRMPermissions.VIEW_LEAVE],
        redirectTo: SharedConstant.DASHBOARD_URL
      }
    },
    children: [
      {
        path: '',
        component: CalendarComponent,
        data: {
          title: 'Calendrier',
          permissions: {
            only: [PermissionConstant.CRMPermissions.ADD_REMINDER, PermissionConstant.CRMPermissions.EDIT_REMINDER],
            redirectTo: redirectToDashboardRoute
          }
        },
      }
    ]
  },
  {
    path: 'category',
    canActivateChild: [StarkPermissionsGuard],
    data: {
      permissions: {
        only: [PermissionConstant.CRMPermissions.VIEW_CATEGORY],
        redirectTo: SharedConstant.DASHBOARD_URL
      }
    },
    children: [
      {
        path: '',
        component: ListCategoryConfigComponent,
        data: {
          title: 'Liste des catégories',
          permissions: {
            only: [PermissionConstant.CRMPermissions.VIEW_CATEGORY],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'AdvancedAdd',
        component: AddCategoryComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Ajout catégorie',
          permissions: {
            only: [PermissionConstant.CRMPermissions.ADD_CATEGORY],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'edit/:id',
        component: AddCategoryComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Edit catégorie',
          permissions: {
            only: [PermissionConstant.CRMPermissions.EDIT_CATEGORY],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
    ]
  },
  {
    path: 'status',
    canActivateChild: [StarkPermissionsGuard],
    data: {
      title: 'Liste des status',
      permissions: {
        only: [PermissionConstant.CRMPermissions.VIEW_STATUS],
        redirectTo: SharedConstant.DASHBOARD_URL
      }
    },
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            component: ListStatusOpportunityComponent,
            canActivateChild: [StarkPermissionsGuard],
                data: {
                    title: 'Liste des status',
                    permissions: {
                        only: [PermissionConstant.CRMPermissions.VIEW_STATUS],
                        redirectTo: redirectToDashboardRoute
                    }
                }
          },
          {
            path: 'AdvancedAdd',
            component: AddStatusComponent,
            canActivateChild: [StarkPermissionsGuard],
            data: {
              title: 'Add a new status',
              permissions: {
                only: [RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.AdminConfig, RoleConfigConstant.CrmConfig,
                  RoleConfigConstant.CRMSettings],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {
            path: 'edit/:id',
            component: AddStatusComponent,
            canActivateChild: [StarkPermissionsGuard],
            data: {
              title: 'Edit new status',
              permissions: {
                only: [RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.AdminConfig, RoleConfigConstant.CrmConfig,
                  RoleConfigConstant.CRMSettings],
                redirectTo: redirectToDashboardRoute
              }
            }
          }
        ]
      }
    ]
  },
  {
    path: 'pipeline',
    children: [
      {
            path: '',
            data: {
                permissions: {
                    only: [PermissionConstant.CRMPermissions.VIEW_PIPELINE],
                    redirectTo: SharedConstant.DASHBOARD_URL
                }
            },
        children : [{
          path: '',
          component: PipelineListComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
                permissions: {
                    only: [PermissionConstant.CRMPermissions.VIEW_PIPELINE],
                    redirectTo: SharedConstant.DASHBOARD_URL
                }
            }
        }, {
          path: 'add',
          component: SettingCategoryAndDropdownsComponent,
          canDeactivate: [CanDeactivateGuard]
        }, {
          path: 'details/:id',
          component: SettingCategoryAndDropdownsComponent,
          canDeactivate: [CanDeactivateGuard]
        }]
      }
    ]
  },
  {
    path: 'campaign',
    canActivateChild: [StarkPermissionsGuard],
    data: {
      permissions: {
        only: [PermissionConstant.CRMPermissions.VIEW_PH_CAMPAIGN],
        redirectTo: SharedConstant.DASHBOARD_URL
      }
    },
    children: [
      {
        path: '',
        children : [{
          path: '',
          component: ListCampaignComponent,
          canDeactivate: [CanDeactivateGuard]
        }, {
          path: 'AdvancedAdd',
          component: AddCampaignComponent,
          canDeactivate: [CanDeactivateGuard],
          data: {
            permissions: {
              only: [PermissionConstant.CRMPermissions.ADD_PH_CAMPAIGN],
              redirectTo: SharedConstant.DASHBOARD_URL
            }
          }
        },
          {
            path: 'details/:id',
            component: AddCampaignComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.CRMPermissions.EDIT_PH_CAMPAIGN],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }

          },
        ]
      }
    ]
  },
  {
    path: OpportunityConstant.CRM_OPPORTUNITY_PATH,
    canActivateChild: [StarkPermissionsGuard],
    data: {
      permissions: {
        only: [PermissionConstant.CRMPermissions.VIEW_OPPORTUNITY],
        redirectTo: SharedConstant.DASHBOARD_URL
      }
    },
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            component: OpportunityListComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Liste des opportunites',
              permissions: {
                only: [PermissionConstant.CRMPermissions.VIEW_OPPORTUNITY],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {
            path: 'details/:id',
            component: OpportunityDetailsComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Détails opportunité',
              permissions: {
                only: [RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.AdminConfig, RoleConfigConstant.CrmConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          },  {
            path: 'addOpportunity',
            component: AddNewOpportunityComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Ajout opportunité',
              permissions: {
                only: [PermissionConstant.CRMPermissions.ADD_TIERS],
                redirectTo: redirectToDashboardRoute
              }
            }
          }
        ]
      }, {
        path: 'related/organisation/:organisationId/:archive',
        component: OpportunityListComponent,
        data: {
          title: 'Detail Opportunity',
          permissions: {
            only: [PermissionConstant.CRMPermissions.OWN_OPPORTUNITY, PermissionConstant.CRMPermissions.EDIT_OPPORTUNITY],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'related/contact/:contactId/:archive',
        component: OpportunityListComponent,
        data: {
          title: 'Detail Opportunity',
          permissions: {
            only: [PermissionConstant.CRMPermissions.OWN_OPPORTUNITY, PermissionConstant.CRMPermissions.EDIT_OPPORTUNITY],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'category/:id',
        component: OpportunityKanbanComponent,
        data: {
          title: 'Opportunité Kanban',
          permissions: {
            only: [PermissionConstant.CRMPermissions.OWN_OPPORTUNITY, PermissionConstant.CRMPermissions.EDIT_OPPORTUNITY],
            redirectTo: redirectToDashboardRoute
          }
        },
      }
    ]
  },
  {
    path: 'contactCrm',
    canActivateChild: [StarkPermissionsGuard],
    data: {
      permissions: {
        only: [PermissionConstant.CRMPermissions.VIEW_CONTACT_LEAD, PermissionConstant.CRMPermissions.VIEW_CONTACT_CLIENT],
        redirectTo: SharedConstant.DASHBOARD_URL
      }
    },
    children: [
      {
        path: '',
        component: ContactListComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Liste des contacts',
          permissions: {
            only: [PermissionConstant.CRMPermissions.VIEW_CONTACT_LEAD, PermissionConstant.CRMPermissions.VIEW_CONTACT_CLIENT],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'details/:id/:isClient',
        component: DetailContactCrmComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Détails contact',
          permissions: {
            only: [PermissionConstant.CRMPermissions.OWN_CONTACT, PermissionConstant.CRMPermissions.EDIT_CONTACT],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'addContact',
        component: AddProspectComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Ajout contact',
          permissions: {
            only: [PermissionConstant.CRMPermissions.ADD_CONTACT],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'addOrganisation',
        component: OrganisationAddComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Ajout organisation',
          permissions: {
            only: [PermissionConstant.CRMPermissions.ADD_ORGANISATION],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'related/:organisationId/:archive',
        component: ContactListComponent,
        data: {
          title: 'Detail contact',
          permissions: {
            only: [PermissionConstant.CRMPermissions.OWN_CONTACT, PermissionConstant.CRMPermissions.EDIT_CONTACT],
            redirectTo: redirectToDashboardRoute
          }
        },
      }
    ]
  },
  {
    path: 'claim',
    canActivateChild: [StarkPermissionsGuard],
    data: {
      permissions: {
        only: [PermissionConstant.CRMPermissions.VIEW_CLAIM_LEAD],
        redirectTo: SharedConstant.DASHBOARD_URL
      }
    },
    children: [
      {
        path: '',
        component: ClaimsListComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Liste des réclamations',
          permissions: {
            only: [PermissionConstant.CRMPermissions.VIEW_CLAIM_LEAD, PermissionConstant.CRMPermissions.VIEW_CLAIM_CLIENT],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'add',
        component: AddClaimComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Ajout réclamation',
          permissions: {
            only: [PermissionConstant.CRMPermissions.ADD_CLAIM],
            redirectTo: redirectToDashboardRoute
          }
        }
      },
      {
        path: 'edit/:id',
        component: DetailClaimComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Détails réclamation',
          permissions: {
            only: [RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.AdminConfig, RoleConfigConstant.CrmConfig],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'related/organisation/:organisationId/:archive',
        component: ClaimsListComponent,
        data: {
          title: 'Detail claim',
          permissions: {
            only: [PermissionConstant.CRMPermissions.OWN_CLAIM, PermissionConstant.CRMPermissions.EDIT_CLAIM],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'related/contact/:contactId/:archive',
        component: ClaimsListComponent,
        data: {
          title: 'Detail claim',
          permissions: {
            only: [PermissionConstant.CRMPermissions.OWN_CLAIM, PermissionConstant.CRMPermissions.EDIT_CLAIM],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'related/opportunity/:opportunityId/:archive',
        component: ClaimsListComponent,
        data: {
          title: 'Detail claim',
          permissions: {
            only: [PermissionConstant.CRMPermissions.OWN_CLAIM, PermissionConstant.CRMPermissions.EDIT_CLAIM],
            redirectTo: redirectToDashboardRoute
          }
        },
      }
    ]
  },
  {
    path: 'note',
    canActivateChild: [StarkPermissionsGuard],
    children: [
      {
        path: '',
        component: ListNoteComponent,
        data: {
          title: 'Liste des notes',
          permissions: {
            only: [RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.AdminConfig, RoleConfigConstant.CrmConfig],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'add',
        component: AddNoteComponent,
        data: {
          title: 'Ajout note',
          permissions: {
            only: [RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.AdminConfig, RoleConfigConstant.CrmConfig],
            redirectTo: redirectToDashboardRoute
          }
        },
      },
      {
        path: 'edit/:id',
        component: AddNoteComponent,
        data: {
          title: 'Edit note',
          permissions: {
            only: [RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.AdminConfig, RoleConfigConstant.CrmConfig],
            redirectTo: redirectToDashboardRoute
          }
        },
      }
    ]
  },
  {
    path: 'dropdowns',
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            component: ListDropdownsComponent,
            data: {
              title: 'Liste des dropdowns',
              permissions: {
                only: [PermissionConstant.CRMPermissions.VIEW_PIPELINE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          },
          {
            path: 'AdvancedAdd',
            component: AddDropdownsComponent,
            canActivateChild: [StarkPermissionsGuard],
            data: {
              title: 'Add a new dropdown',
              permissions: {
                only: [PermissionConstant.CRMPermissions.VIEW_PIPELINE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          }
          , {
            path: 'details/:id',
            component: AddDropdownsComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'details',
              permissions: {
                only: [PermissionConstant.CRMPermissions.VIEW_PIPELINE],
                redirectTo: SharedConstant.DASHBOARD_URL
              }
            }
          }
        ]
      }
    ]
  },
  {
    path: 'archiving',
    children: [
      {
        path: 'action',
        component: ActionArchivingComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          permissions: {
            only: [PermissionConstant.CRMPermissions.VIEW_ARCHIVED_ACTION],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        }
      },
      {
        path: 'organisation',
        component: OrganisationArchivingComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          permissions: {
            only: [PermissionConstant.CRMPermissions.VIEW_ARCHIVED_ORGANISATION],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        }
      },
      {
        path: 'contact',
        component: ContactArchivingComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          permissions: {
            only: [PermissionConstant.CRMPermissions.VIEW_ARCHIVED_CONTACT],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        }
      },
      {
        path: 'opportunity',
        component: OpportunityArchivingComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          permissions: {
            only: [PermissionConstant.CRMPermissions.VIEW_ARCHIVED_OPPORTUNITY],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        }
      },
      {
        path: 'claim',
        component: ClaimArchivingComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          permissions: {
            only: [PermissionConstant.CRMPermissions.VIEW_ARCHIVED_CLAIM],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule {

}
