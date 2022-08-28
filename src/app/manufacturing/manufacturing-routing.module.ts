import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListNomenclatureComponent} from './nomenclature/list-nomenclature/list-nomenclature.component';
import {AddNomenclatureComponent} from './nomenclature/add-nomenclature/add-nomenclature.component';
import {ListMachineComponent} from './machine/list-machine/list-machine.component';
import {AddMachineComponent} from './machine/add-machine/add-machine.component';
import {AddFabicationArrangementComponent} from './fabricationArrangement/add-fabication-arrangement/add-fabication-arrangement.component';
import {ListFabricationArrangementComponent} from './fabricationArrangement/list-fabrication-arrangement/list-fabrication-arrangement.component';
import {ListAreaComponent} from './area/list-area/list-area.component';
import {GammeListComponent} from './gamme/gamme-list/gamme-list.component';
import {AddGammeComponent} from './gamme/add-gamme/add-gamme.component';
import {ListSectionComponent} from './section/list-section/list-section.component';
import {AddSectionComponent} from './section/add-section/add-section.component';
import {FabGanttDiagramComponent} from './timeline/fab-gantt-diagram/fab-gantt-diagram.component';
import {ChartsComponent} from './charts/charts.component';
import {OperationListComponent} from './operation/operation-list/operation-list.component';
import {AddOperationComponent} from './operation/add-operation/add-operation.component';
import {GammeVisualisationComponent} from './gamme-visualisation/gamme-visualisation.component';
import {LaunchFabricationArrangementComponent} from './fabricationArrangement/launch-fabrication-arrangement/launch-fabrication-arrangement.component';
import {CostPriceComponent} from './calculate-cost-price/cost-price.component';
import {NeedsPerOperationComponent} from './needs-per-operation/needs-per-operation.component';
import {StarkPermissionsGuard} from '../stark-permissions/router/permissions-guard.service';
import {PermissionConstant} from '../Structure/permission-constant';
import {SharedConstant} from '../constant/shared/shared.constant';
import {RoleConfigConstant} from '../Structure/_roleConfigConstant';
import {CanDeactivateGuard} from '../crm/services/can-deactivate-guard.service';
const redirectToDashboardRoute = '/main/dashboard';
const routes: Routes = [

  {
    path: '',
    canActivateChild: [StarkPermissionsGuard],
    data: {
      permissions: {
        only: [
          PermissionConstant.MANUFATORINGPermissions.FABRICATION_PERMISSION
        ],
        redirectTo: SharedConstant.DASHBOARD_URL,
      },
    },
    children: [
      {
        path: 'nomenclature',
        children: [
          {
            path: '',
            component: ListNomenclatureComponent,
            data: {
              permissions: {
                only: [PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_DISPLAY_NOMENCLATURE_PERMISSION],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {

            path: 'add',
            component: AddNomenclatureComponent,
            data: {
              permissions: {
                only: [PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_ADD_NOMENCLATURE_PERMISSION],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {
            path: 'edit/:id',
            component: AddNomenclatureComponent,
            data: {
              permissions: {
                only: [PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_UPDATE_NOMENCLATURE_PERMISSION],
                redirectTo: redirectToDashboardRoute
              }
            }
          }
        ]
      },
      {
        path: 'machine',
        children: [
          {
            path: '',
            component: ListMachineComponent
          },
          {

            path: 'add',
            component: AddMachineComponent
          },
          {
            path: 'edit/:id',
            component: AddMachineComponent
          }
        ]
      }, {
        path: 'operation',
        children: [
          {
            path: '',
            component: OperationListComponent
          }, {
            path: 'add',
            component: AddOperationComponent
          }, {
            path: 'edit/:id',
            component: AddOperationComponent
          }
        ]
      },
      {
        path: 'section',
        children: [
          {
            path: '',
            component: ListSectionComponent
          },
          {
            path: 'add',
            component: AddSectionComponent
          },
          {
            path: 'edit/:id',
            component: AddSectionComponent
          }
        ]
      },
      {
        path: 'fabricationArrangement',
        children: [
          {
            path: '',
            component: ListFabricationArrangementComponent,
            data: {
              permissions: {
                only: [PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_DISPLAY_OF_PERMISSION],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {

            path: 'add',
            component: AddFabicationArrangementComponent,
            data: {
              permissions: {
                only: [PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_ADD_OF_PERMISSION],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {
            path: 'edit/:id',
            component: AddFabicationArrangementComponent,
            data: {
              permissions: {
                only: [PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_EDIT_OF_PERMISSION],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {
            path: 'launch',
            component: LaunchFabricationArrangementComponent,
            data: {
              permissions: {
                only: [PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_LAUNCH_OF_PERMISSION],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
        ]
      },
      {
        path: 'area',
        children: [
          {
            path: '',
            component: ListAreaComponent
          }
        ]
      },
      {
        path: 'gamme',
        children: [
          {
            path: '',
            component: GammeListComponent,
            data: {
              permissions: {
                only: [PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_DISPLAY_GAMME_PERMISSION],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {
            path: 'add',
            component: AddGammeComponent,
            data: {
              permissions: {
                only: [PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_ADD_GAMME_PERMISSION],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {
            path: 'edit/:id',
            component: AddGammeComponent,
            data: {
              permissions: {
                only: [PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_EDIT_GAMME_PERMISSION],
                redirectTo: redirectToDashboardRoute
              }
            }
          }
        ]
      },
      {
        path: 'range_visibility',
        children: [
          {
            path: '',
            component: GammeVisualisationComponent,
            data: {
              permissions: {
                only: [PermissionConstant.MANUFATORINGPermissions.MANUFACTURING_GAMME_VISUALISATION_PERMISSION],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
        ]
      },
      {
        path: 'calculate_cost_price',
        children: [
          {
            path: '',
            component: CostPriceComponent
          },
        ]
      },

      {
        path: 'needs-per-operation',
        children: [
          {
            path: 'article/:id',
            component: NeedsPerOperationComponent
          },
        ]
      },
      {
        path: 'timeline',
        children: [
          {
            path: 'fabricationArrangement',
            component: FabGanttDiagramComponent
          }
        ]
      }, {
        path: 'dashbord',
        component: ChartsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManufacturingRoutingModule {
}
