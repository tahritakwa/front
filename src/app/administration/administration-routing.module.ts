import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListCountryComponent} from './country/list-country/list-country.component';
import {ListCityComponent} from './city/list-city/list-city.component';
import {ListCurrencyComponent} from './currency/list-currency/list-currency.component';
import {AddCurrencyComponent} from './currency/add-currency/add-currency.component';
import {CompanySetupComponent} from './company/company-setup/company-setup.component';
import {ListRoleComponent} from './role/list-role/list-role.component';
import {AddRoleComponent} from './role/add-role/add-role.component';
import {ListUserComponent} from './user/list-user/list-user.component';
import {AddUserComponent} from './user/add-user/add-user.component';
import {ListNatureComponent} from './nature/list-nature/list-nature.component';
import {ListTaxeComponent} from './taxe/list-taxe/list-taxe.component';
import {AddGroupTaxeComponent} from './group-taxe/add-group-taxe/add-group-taxe.component';
import {ListGroupTaxeComponent} from './group-taxe/list-group-taxe/list-group-taxe.component';
import {AddTaxeComponent} from './taxe/add-taxe/add-taxe.component';
import {ConfigUserComponent} from './user/config-user/config-user.component';
import {ListPeriodComponent} from './period/list-period/list-period.component';
import {AddPeriodComponent} from './period/add-period/add-period.component';
import {ListRoleConfigComponent} from './role-config/list-role-config/list-role-config.component';
import {AddRoleConfigComponent} from './role-config/add-role-config/add-role-config.component';
import {ListRoleAdvancedComponent} from './role-advanced/list-role-advanced/list-role-advanced.component';
import {AddRoleAdvancedComponent} from './role-advanced/add-role-advanced/add-role-advanced.component';
import {RoleConfigConstant} from '../Structure/_roleConfigConstant';
import {OfficeListComponent} from './Office/office-list/office-list.component';
import {OfficeAddComponent} from './Office/office-add/office-add.component';
import {UserB2bSettingsComponent} from './user-b2b/user-b2b-settings/user-b2b-settings.component';
import {StarkPermissionsGuard} from '../stark-permissions/stark-permissions.module';
import {VersionComponent} from './version/version.component';
import {ListLanguageComponent} from './language/list-language/list-language.component';
import {DesactivateUsersDetailsComponent} from './desactivate-users-details/desactivate-users-details.component';
import {AddCityComponent} from './city/add-city/add-city.component';
import {CanDeactivateGuard} from '../shared/services/can-deactivate-guard.service';
import {AddUserB2bComponent} from './user-b2b/add-user-b2b/add-user-b2b.component';
import {AddNatureComponent} from './nature/add-nature/add-nature.component';
import { PermissionConstant } from '../Structure/permission-constant';
import { SharedConstant } from '../constant/shared/shared.constant';
import { UserResolverService } from './resolvers/user-resolver.service';

const redirectToDashboardRoute = '/main/dashboard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [StarkPermissionsGuard],
    children: [
      {
        path: 'company',
        data: {
          title: 'Société',
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_COMPANY,
              PermissionConstant.SettingsRHAndPaiePermissions.SHOW_COMPANY],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: CompanySetupComponent,
            data: {
              title: 'Société',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_COMPANY,
                  PermissionConstant.SettingsRHAndPaiePermissions.SHOW_COMPANY],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'country',
        data: {
          title: 'Liste des pays',
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_COUNTRY],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListCountryComponent,
            data: {
              title: 'Liste des pays',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_COUNTRY],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'city',
        data: {
          title: 'Liste des villes',
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_CITY],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListCityComponent,
            data: {
              title: 'Liste des villes',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_CITY],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddCityComponent,
            canDeactivate: [CanDeactivateGuard],
            canActivate: [StarkPermissionsGuard],
            data: {
              title: 'Ajout ville',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.ADD_CITY],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddCityComponent,
            canDeactivate: [CanDeactivateGuard],
            canActivate: [StarkPermissionsGuard],
            data: {
              title: 'Edit ville',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_CITY,
                  PermissionConstant.SettingsRHAndPaiePermissions.SHOW_CITY],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
        ]
      },
      {
        path: 'taxe',
        data: {
          title: 'Liste des taxes',
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_TAX],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListTaxeComponent,
            data: {
              title: 'Liste des taxes',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_TAX],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddTaxeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Ajout avancé',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_TAX],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddTaxeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Modification avancée',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_TAX,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_TAX],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'group-taxe',
        data: {
          title: 'Liste des groupes de taxes',
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_GROUP_TAX],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListGroupTaxeComponent,
            data: {
              title: 'Liste des groupes de taxes',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_GROUP_TAX],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddGroupTaxeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Ajout avancé',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_GROUP_TAX],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'advancedEdit/:id',
            component: AddGroupTaxeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Modification avancée',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_GROUP_TAX,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_GROUP_TAX],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'currency',
        data: {
          title: 'Liste des devices',
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_CURRENCY],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListCurrencyComponent,
            data: {
              title: 'Liste des devices',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_CURRENCY],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedAdd',
            component: AddCurrencyComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Ajout avancé',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_CURRENCY],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'AdvancedEdit/:id',
            component: AddCurrencyComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Modification avancée',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_CURRENCY,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_CURRENCY],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'office',
        data: {
          title: 'Liste des bureaux',
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_OFFICE],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: OfficeListComponent,
            canActivate: [StarkPermissionsGuard],
            data: {
              title: 'Liste des bureaux',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_OFFICE],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {
            path: 'add',
            component: OfficeAddComponent,
            canActivate: [StarkPermissionsGuard],
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Ajout bureau',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.ADD_OFFICE],
                redirectTo: '/main/dashboard'
              }
            }
          },
          {
            path: 'edit/:id',
            component: OfficeAddComponent,
            canActivate: [StarkPermissionsGuard],
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Edit bureau',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.SHOW_OFFICE,
                  PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_OFFICE],
                redirectTo: '/main/dashboard'
              }
            }
          }
        ]
      },
      {
        path: 'language',
        data: {
          title: 'Liste des langues',
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_LANGUAGE],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListLanguageComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Liste des langues',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_LANGUAGE],
                redirectTo: redirectToDashboardRoute
              }
            },

          }
        ]
      },
      {
        path: 'role',
        data: {
          title: 'Liste des roles',
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_ROLE],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListRoleComponent,
            data: {
              title: 'Liste des roles',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_ROLE],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'Add',
            component: AddRoleComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Ajout role',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.ADD_ROLE],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'Edit/:id',
            component: AddRoleComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Edit role',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.SHOW_ROLE, PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_ROLE],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'roleAdvanced',
        children: [
          {
            path: '',
            component: ListRoleAdvancedComponent,
            data: {
              title: 'Liste des roles',
              permissions: {
                only: [RoleConfigConstant.AdminConfig, RoleConfigConstant.SettingsConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'Add',
            component: AddRoleAdvancedComponent,
            data: {
              title: 'Ajout role',
              permissions: {
                only: [RoleConfigConstant.AdminConfig, RoleConfigConstant.SettingsConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'Edit/:id',
            component: AddRoleAdvancedComponent,
            data: {
              title: 'Edit role',
              permissions: {
                only: [RoleConfigConstant.AdminConfig, RoleConfigConstant.SettingsConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'roleConfig',
        children: [
          {
            path: '',
            component: ListRoleConfigComponent,
            data: {
              title: 'Liste role config',
              permissions: {
                only: [RoleConfigConstant.AdminConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'Add',
            component: AddRoleConfigComponent,
            data: {
              title: 'Ajout role config',
              permissions: {
                only: [RoleConfigConstant.AdminConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'Edit/:id',
            component: AddRoleConfigComponent,
            data: {
              title: 'Edit role config',
              permissions: {
                only: [RoleConfigConstant.AdminConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'user',
        data: {
          title: 'Liste des utilisateurs',
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_USER],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListUserComponent,
            data: {
              title: 'Liste des utilisateurs',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_USER],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'Add',
            component: AddUserComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Ajout user',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.ADD_USER],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'Edit/:id',
            component: AddUserComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: { userPhone: UserResolverService },
            data: {
              title: 'Edit user',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.SHOW_USER, PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_USER],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'EditRoles/:id',
            component: ConfigUserComponent,
            data: {
              title: 'Configurate user',
              permissions: {
                only: [RoleConfigConstant.SuperAdminConfig, RoleConfigConstant.AdminConfig, RoleConfigConstant.SettingsConfig],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'desactivateUser',
            children: [
              {
                path: 'list',
                component: DesactivateUsersDetailsComponent,
                data: {
                  title: 'Desactivate users',
                  permissions: {
                    only: [PermissionConstant.SettingsRHAndPaiePermissions.DESACTIVATE_USER, PermissionConstant.SettingsRHAndPaiePermissions.REACTIVATE_USER],
                    redirectTo: redirectToDashboardRoute
                  }
                },
              }
            ]
          }
        ]
      },
      {
        path: 'masterUsers',
        data: {
          title: 'Liste des utilisateurs',
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_GROUPUSERS],
            redirectTo: '/main/dashboard'
          }
        },
        children: [
          {
            path: '',
            component: ListUserComponent,
            canActivate: [StarkPermissionsGuard],
            data: {
              title: 'Liste des utilisateurs',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_GROUPUSERS],
                redirectTo: '/main/dashboard'
              }
            },
          },
          {
            path: 'Add/masterUsers',
            component: AddUserComponent,
            canActivate: [StarkPermissionsGuard],
            data: {
              title: 'Ajout user',
              permissions: {
                only: [PermissionConstant.RHAndPaiePermissions.ADD_MASTERUSER],
                redirectTo: '/main/dashboard'
              }
            },
          },
          {
            path: 'Edit/masterUsers/:id',
            component: AddUserComponent,
            canActivate: [StarkPermissionsGuard],
            data: {
              title: 'Edit user',
              permissions: {
                only: [RoleConfigConstant.AdminConfig, RoleConfigConstant.SettingsConfig, RoleConfigConstant.ManagerConfig],
                redirectTo: '/main/dashboard'
              }
            },
          }
        ]
      },
      {
        path: 'nature',
        data: {
          title: 'Liste de nature des produits',
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.LIST_NATURE],
            redirectTo: SharedConstant.DASHBOARD_URL
          }
        },
        children: [
          {
            path: '',
            component: ListNatureComponent,
            data: {
              title: 'Liste de nature des produits',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.LIST_NATURE],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddNatureComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Ajout nature des produits',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.ADD_NATURE],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddNatureComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Edit nature des produits',
              permissions: {
                only: [PermissionConstant.SettingsCommercialPermissions.UPDATE_NATURE,
                  PermissionConstant.SettingsCommercialPermissions.SHOW_NATURE],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'period',
        data: {
          title: 'Liste des périodes',
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_PERIOD],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListPeriodComponent,
            data: {
              title: 'Liste des périodes',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.LIST_PERIOD],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddPeriodComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Ajout période',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.ADD_PERIOD],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddPeriodComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              title: 'Edit période',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.SHOW_PERIOD,
                  PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_PERIOD],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'B2bSetting',
        data: {
          title: 'Liste des utilisateurs',
          permissions: {
            only: [PermissionConstant.SettingsCommercialPermissions.B2B_SETTINGS],
            redirectTo: redirectToDashboardRoute
          }
        },
      //   children: [
      //     {
      //       path: '',
      //       component: UserB2bSettingsComponent,
      //       data: {
      //         title: 'Liste des utilisateurs',
      //         permissions: {
      //           only: [PermissionConstant.SettingsCommercialPermissions.B2B_SETTINGS],
      //           redirectTo: redirectToDashboardRoute
      //         }
      //       },
      //     }, {
      //       path: 'add',
      //       component: AddUserB2bComponent,
      //       canDeactivate: [CanDeactivateGuard],
      //       data: {
      //         title: 'Add User B2B'
      //       },
      //     }, {
      //       path: 'edit/:id',
      //       component: AddUserB2bComponent,
      //       canDeactivate: [CanDeactivateGuard],
      //       data: {
      //         title: 'Edit User B2B'
      //       },
      //     }
      //   ]
      },
      {
        path: 'version',
        data: {
          title: 'Liste des versions',
          permissions: {
            only: [PermissionConstant.SettingsRHAndPaiePermissions.SHOW_ABOUT],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: VersionComponent,
            data: {
              title: 'Liste des versions',
              permissions: {
                only: [PermissionConstant.SettingsRHAndPaiePermissions.SHOW_ABOUT],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule {
}
