import { NgModule, ModuleWithProviders } from '@angular/core';
import { StarkPermissionsDirective } from './directive/permissions.directive';
import { StarkPermissionsService, USE_PERMISSIONS_STORE } from './service/permissions.service';
import { StarkPermissionsGuard } from './router/permissions-guard.service';
import { StarkRolesService, USE_ROLES_STORE } from './service/roles.service';
import { StarkPermissionsStore } from './store/permissions.store';
import { StarkRolesStore } from './store/roles.store';
import { StarkPermissionsConfigurationService, USE_CONFIGURATION_STORE } from './service/configuration.service';
import { StarkPermissionsConfigurationStore } from './store/configuration.store';

export * from './store/roles.store';
export * from './store/permissions.store';
export * from './store/configuration.store';

export * from './directive/permissions.directive';

export * from './service/permissions.service';
export * from './service/roles.service';
export * from './service/configuration.service';

export * from './router/permissions-guard.service';

export * from './model/permissions-router-data.model';
export * from './model/role.model';

export * from './enums/predefined-strategies.enum';

export interface StarkPermissionsModuleConfig {
    // isolate the service instance, only works for lazy loaded modules or components with the "providers" property
    rolesIsolate?: boolean;
    permissionsIsolate?: boolean;
    configurationIsolate?: boolean;
}


@NgModule({
    imports: [],
    declarations: [
        StarkPermissionsDirective
    ],
    exports: [
        StarkPermissionsDirective
    ]
})
export class StarkPermissionsModule {
    static forRoot(config: StarkPermissionsModuleConfig = {}): ModuleWithProviders {
        return {
            ngModule: StarkPermissionsModule,
            providers: [
                StarkPermissionsStore,
                StarkRolesStore,
                StarkPermissionsConfigurationStore,
                StarkPermissionsService,
                StarkPermissionsGuard,
                StarkRolesService,
                StarkPermissionsConfigurationService,
                {provide: USE_PERMISSIONS_STORE, useValue: config.permissionsIsolate},
                {provide: USE_ROLES_STORE, useValue: config.rolesIsolate},
                {provide: USE_CONFIGURATION_STORE, useValue: config.configurationIsolate},
            ]
        };
    }

    static forChild(config: StarkPermissionsModuleConfig = {}): ModuleWithProviders {
        return {
            ngModule: StarkPermissionsModule,
            providers: [
                {provide: USE_PERMISSIONS_STORE, useValue: config.permissionsIsolate},
                {provide: USE_ROLES_STORE, useValue: config.rolesIsolate},
                {provide: USE_CONFIGURATION_STORE, useValue: config.configurationIsolate},
                StarkPermissionsConfigurationService,
                StarkPermissionsService,
                StarkRolesService,
                StarkPermissionsGuard
            ]
        };
    }
}
