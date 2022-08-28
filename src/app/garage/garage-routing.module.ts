import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import { ListOperationComponent } from './operation/list-operation/list-operation.component';
import { ListMachineComponent } from './machine/list-machine/list-machine.component';
import { AddOperationComponent } from './operation/add-operation/add-operation.component';
import { ListGarageComponent } from './garage/list-garage/list-garage.component';
import { AddMachineComponent } from './machine/add-machine/add-machine.component';
import { AddGarageComponent } from './garage/add-garage/add-garage.component';
import { AddInterventionOrderComponent } from './intervention-order/add-intervention-order/add-intervention-order.component';
import { ListInterventionOrderComponent } from './intervention-order/list-intervention-order/list-intervention-order.component';
import { ListUnitComponent } from './unit/list-unit/list-unit.component';
import { AddUnitComponent } from './unit/add-unit/add-unit.component';
import { CanDeactivateGuard } from '../shared/services/can-deactivate-guard.service';
import { ListWorkerComponent } from './worker/list-worker/list-worker.component';
import { AddWorkerComponent } from './worker/add-worker/add-worker.component';
import { ListVehicleBrandComponent } from './vehicle-brand/list-vehicle-brand/list-vehicle-brand.component';
import { AddVehicleBrandComponent } from './vehicle-brand/add-vehicle-brand/add-vehicle-brand.component';
import { ListVehicleModelComponent } from './vehicle-model/list-vehicle-model/list-vehicle-model.component';
import { AddVehicleModelComponent } from './vehicle-model/add-vehicle-model/add-vehicle-model.component';
import { ListOperationTypeComponent } from './operation-type/list-operation-type/list-operation-type.component';
import { AddOperationTypeComponent } from './operation-type/add-operation-type/add-operation-type.component';
import { ListOperationProposedComponent } from './operation-proposed/list-operation-proposed/list-operation-proposed.component';
import { AddOperationProposedComponent } from './operation-proposed/add-operation-proposed/add-operation-proposed.component';
import { ListCustomerVehicleComponent } from './vehicle/customer-vehicle/list-customer-vehicle/list-customer-vehicle.component';
import { AddCustomerVehicleComponent } from './vehicle/customer-vehicle/add-customer-vehicle/add-customer-vehicle.component';
import { AddLoanVehicleComponent } from './vehicle/loan-vehicle/add-loan-vehicle/add-loan-vehicle.component';
import { ListLoanVehicleComponent } from './vehicle/loan-vehicle/list-loan-vehicle/list-loan-vehicle.component';
import { ListOperationKitComponent } from './operation-kit/list-operation-kit/list-operation-kit.component';
import { AddOperationKitComponent } from './operation-kit/add-operation-kit/add-operation-kit.component';
import { AppointmentRequestComponent } from './planning/appointment/appointment-request/appointment-request.component';
import { ResourceAllocationComponent } from './planning/resource-allocation/resource-allocation/resource-allocation.component';
import { PermissionConstant } from '../Structure/permission-constant';
import { WorkerResolverService } from './resolvers/worker-resolver.service';
import { GarageResolverService } from './resolvers/garage-resolver.service';
import { ListRepairOrderComponent } from './repair-order/list-repair-order/list-repair-order.component';
import { AddRepairOrderComponent } from './repair-order/add-repair-order/add-repair-order.component';
import { SendReminderSmsComponent } from './components/reminder-sms/send-reminder-sms/send-remider-sms.component';
import { ReminderSmsListComponent } from './components/reminder-sms/reminder-sms-list/reminder-sms-list.component';

const redirectToDashboardRoute = '/main/dashboard';
const routes: Routes = [
  {
    path: '',
    canActivateChild: [StarkPermissionsGuard],
    children: [
      {
        path: 'vehicle',
        data: {
          permissions: {
            only: [PermissionConstant.GaragePermissions.LIST_CUSTOMER_VEHICLE, PermissionConstant.GaragePermissions.LIST_LOAN_VEHICLE],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: 'customers-vehicles',
            children: [
              {
                path: '',
                component: ListCustomerVehicleComponent,
                data: {
                  permissions: {
                    only: [PermissionConstant.GaragePermissions.LIST_CUSTOMER_VEHICLE],
                    redirectTo: redirectToDashboardRoute
                  }
                },
              },
              {
                path: 'add',
                component: AddCustomerVehicleComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.GaragePermissions.ADD_CUSTOMER_VEHICLE],
                    redirectTo: redirectToDashboardRoute
                  }
                },
              },
              {
                path: 'edit/:id',
                component: AddCustomerVehicleComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.GaragePermissions.UPDATE_CUSTOMER_VEHICLE,
                    PermissionConstant.GaragePermissions.SHOW_CUSTOMER_VEHICLE],
                    redirectTo: redirectToDashboardRoute
                  }
                },
              },
            ]
          },
          {
            path: 'loan-vehicles',
            children: [
              {
                path: '',
                component: ListLoanVehicleComponent,
                data: {
                  permissions: {
                    only: [PermissionConstant.GaragePermissions.LIST_LOAN_VEHICLE],
                    redirectTo: redirectToDashboardRoute
                  }
                },
              },
              {
                path: 'add',
                component: AddLoanVehicleComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.GaragePermissions.ADD_LOAN_VEHICLE],
                    redirectTo: redirectToDashboardRoute
                  }
                },
              },
              {
                path: 'edit/:id',
                component: AddLoanVehicleComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.GaragePermissions.UPDATE_LOAN_VEHICLE,
                    PermissionConstant.GaragePermissions.SHOW_LOAN_VEHICLE],
                    redirectTo: redirectToDashboardRoute
                  }
                },
              },
            ]
          }

        ]
      },
      {
        path: 'operation',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsGaragePermissions.LIST_OPERATION],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListOperationComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.LIST_OPERATION],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddOperationComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.ADD_OPERATION],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddOperationComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.UPDATE_OPERATION,
                PermissionConstant.SettingsGaragePermissions.SHOW_OPERATION],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'operation-type',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsGaragePermissions.LIST_OPERATIONTYPE],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListOperationTypeComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.LIST_OPERATIONTYPE],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddOperationTypeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.ADD_OPERATIONTYPE],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddOperationTypeComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.UPDATE_OPERATIONTYPE,
                PermissionConstant.SettingsGaragePermissions.SHOW_OPERATIONTYPE],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'machine',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsGaragePermissions.LIST_MACHINE],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListMachineComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.LIST_MACHINE],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddMachineComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.ADD_MACHINE],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddMachineComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.UPDATE_MACHINE,
                PermissionConstant.SettingsGaragePermissions.SHOW_MACHINE],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'garage',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsGaragePermissions.LIST_GARAGE],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListGarageComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.LIST_GARAGE],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddGarageComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.ADD_GARAGE],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddGarageComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.UPDATE_GARAGE,
                PermissionConstant.SettingsGaragePermissions.SHOW_GARAGE],
                redirectTo: redirectToDashboardRoute
              }
            },
            resolve: { garagePhone: GarageResolverService },
          }
        ]
      },
      {
        path: 'intervention',
        data: {
          permissions: {
            only: [PermissionConstant.GaragePermissions.LIST_INTERVENTION,
            PermissionConstant.GaragePermissions.UPDATE_INTERVENTION],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListInterventionOrderComponent,
            data: {
              permissions: {
                only: [PermissionConstant.GaragePermissions.LIST_INTERVENTION],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {
            path: 'add',
            component: AddInterventionOrderComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.GaragePermissions.ADD_INTERVENTION],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {
            path: 'edit/:id',
            component: AddInterventionOrderComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.GaragePermissions.UPDATE_INTERVENTION,
                PermissionConstant.GaragePermissions.SHOW_INTERVENTION],
                redirectTo: redirectToDashboardRoute
              }
            }
          }
        ]
      },
      {
        path: 'planning',
        data: {
          permissions: {
            only: [PermissionConstant.GaragePermissions.LIST_APPOINTMENT],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: 'planning-request',
            component: AppointmentRequestComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.GaragePermissions.LIST_APPOINTMENT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'resource-allocation',
            component: ResourceAllocationComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.GaragePermissions.LIST_APPOINTMENT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'sms',
            data: {
              permissions: {
                only: [PermissionConstant.GaragePermissions.SEND_SMS],
                redirectTo: redirectToDashboardRoute
              }
            },
            children: [
              {
                path: '',
                component: ReminderSmsListComponent,
                data: {
                  permissions: {
                    only: [PermissionConstant.GaragePermissions.LIST_SMS],
                    redirectTo: redirectToDashboardRoute
                  }
                }
              },
              {
                path: 'send-sms',
                component: SendReminderSmsComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.GaragePermissions.SEND_SMS],
                    redirectTo: redirectToDashboardRoute
                  }
                }
              },
              {
                path: 'edit/:id',
                component: SendReminderSmsComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                  permissions: {
                    only: [PermissionConstant.GaragePermissions.SEND_SMS],
                    redirectTo: redirectToDashboardRoute
                  }
                }
              },
            ]
          },
        ]
      },
      {
        path: 'workers',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsGaragePermissions.LIST_WORKER],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListWorkerComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.LIST_WORKER],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddWorkerComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.ADD_WORKER],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddWorkerComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.UPDATE_WORKER,
                PermissionConstant.SettingsGaragePermissions.SHOW_WORKER],
                redirectTo: redirectToDashboardRoute
              }
            },
            resolve: { workerPhone: WorkerResolverService },
          },
        ]
      },
      {
        path: 'brands',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsGaragePermissions.LIST_VEHICLE_BRAND],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListVehicleBrandComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.LIST_VEHICLE_BRAND],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddVehicleBrandComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.ADD_VEHICLE_BRAND],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddVehicleBrandComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.UPDATE_VEHICLE_BRAND,
                PermissionConstant.SettingsGaragePermissions.SHOW_VEHICLE_BRAND],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
        ]
      },
      {
        path: 'models',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsGaragePermissions.LIST_VEHICLEMODEL],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListVehicleModelComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.LIST_VEHICLEMODEL],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddVehicleModelComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.ADD_VEHICLEMODEL],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddVehicleModelComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.UPDATE_VEHICLEMODEL,
                PermissionConstant.SettingsGaragePermissions.SHOW_VEHICLEMODEL],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
        ]
      },
      {
        path: 'program',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsGaragePermissions.LIST_OPERATION_PROPOSED],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListOperationProposedComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.LIST_OPERATION_PROPOSED],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddOperationProposedComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.ADD_OPERATION_PROPOSED],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddOperationProposedComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.UPDATE_OPERATION_PROPOSED,
                PermissionConstant.SettingsGaragePermissions.SHOW_OPERATION_PROPOSED],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
        ]
      },
      {
        path: 'unit',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsGaragePermissions.LIST_UNIT],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListUnitComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.LIST_UNIT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddUnitComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.ADD_UNIT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddUnitComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.UPDATE_UNIT,
                PermissionConstant.SettingsGaragePermissions.SHOW_UNIT],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'kit',
        data: {
          permissions: {
            only: [PermissionConstant.SettingsGaragePermissions.LIST_OPERATIONKIT],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListOperationKitComponent,
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.LIST_OPERATIONKIT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'add',
            component: AddOperationKitComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.ADD_OPERATIONKIT],
                redirectTo: redirectToDashboardRoute
              }
            },
          },
          {
            path: 'edit/:id',
            component: AddOperationKitComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.SettingsGaragePermissions.UPDATE_OPERATIONKIT,
                PermissionConstant.SettingsGaragePermissions.SHOW_OPERATIONKIT],
                redirectTo: redirectToDashboardRoute
              }
            },
          }
        ]
      },
      {
        path: 'repair-order',
        data: {
          permissions: {
            only: [PermissionConstant.GaragePermissions.LIST_REPAIR_ORDER],
            redirectTo: redirectToDashboardRoute
          }
        },
        children: [
          {
            path: '',
            component: ListRepairOrderComponent,
            data: {
              permissions: {
                only: [PermissionConstant.GaragePermissions.LIST_REPAIR_ORDER],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {
            path: 'add',
            component: AddRepairOrderComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.GaragePermissions.ADD_REPAIR_ORDER],
                redirectTo: redirectToDashboardRoute
              }
            }
          },
          {
            path: 'edit/:id',
            component: AddRepairOrderComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              permissions: {
                only: [PermissionConstant.GaragePermissions.UPDATE_REPAIR_ORDER,
                PermissionConstant.GaragePermissions.SHOW_REPAIR_ORDER,],
                redirectTo: redirectToDashboardRoute
              }
            }
          }
        ]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GarageRoutingModule { }
