import {
    Directive, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewContainerRef
} from '@angular/core';
import { StarkPermissionsService } from '../service/permissions.service';
import { Subscription } from 'rxjs/Subscription';
import { StarkRolesService } from '../service/roles.service';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/skip';
import { isBoolean, isFunction, isString, notEmptyValue } from '../utils/utils';
import { StarkPermissionsConfigurationService, StrategyFunction } from '../service/configuration.service';
import { StarkPermissionsPredefinedStrategies } from '../enums/predefined-strategies.enum';

@Directive({
    selector: '[starkPermissionsOnly],[starkPermissionsExcept]'
})
export class StarkPermissionsDirective implements OnInit, OnDestroy {

    @Input() starkPermissionsOnly: string | string[];
    @Input() starkPermissionsOnlyThen: TemplateRef<any>;
    @Input() starkPermissionsOnlyElse: TemplateRef<any>;

    @Input() starkPermissionsExcept: string | string[];
    @Input() starkPermissionsExceptElse: TemplateRef<any>;
    @Input() starkPermissionsExceptThen: TemplateRef<any>;

    @Input() starkPermissionsThen: TemplateRef<any>;
    @Input() starkPermissionsElse: TemplateRef<any>;

    @Input() starkPermissionsOnlyAuthorisedStrategy: string | StrategyFunction;
    @Input() starkPermissionsOnlyUnauthorisedStrategy: string | StrategyFunction;

    @Input() starkPermissionsExceptUnauthorisedStrategy: string | StrategyFunction;
    @Input() starkPermissionsExceptAuthorisedStrategy: string | StrategyFunction;

    @Input() starkPermissionsUnauthorisedStrategy: string | StrategyFunction;
    @Input() starkPermissionsAuthorisedStrategy: string | StrategyFunction;

    @Output() permissionsAuthorized = new EventEmitter();
    @Output() permissionsUnauthorized = new EventEmitter();

    private initPermissionSubscription: Subscription;
    // skip first run cause merge will fire twice
    private firstMergeUnusedRun = 1;
    private currentAuthorizedState: boolean;

    constructor(
        private permissionsService: StarkPermissionsService,
        private configurationService: StarkPermissionsConfigurationService,
        private rolesService: StarkRolesService,
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>
    ) {
    }


    ngOnInit(): void {
        this.viewContainer.clear();
        this.initPermissionSubscription = this.validateExceptOnlyPermissions();
    }

    ngOnDestroy(): void {
        if (this.initPermissionSubscription) {
            this.initPermissionSubscription.unsubscribe();
        }
    }

    private validateExceptOnlyPermissions(): Subscription {
        return this.permissionsService.permissions$
                         .merge(this.rolesService.roles$)
                         .skip(this.firstMergeUnusedRun)
                         .subscribe(() => {
                             if (notEmptyValue(this.starkPermissionsExcept)) {
                                 this.validateExceptAndOnlyPermissions();
                                 return;
                             }

                             if (notEmptyValue(this.starkPermissionsOnly)) {
                                 this.validateOnlyPermissions();
                                 return;
                             }

                             this.handleAuthorisedPermission(this.getAuthorisedTemplates());
                         });
    }

    private validateExceptAndOnlyPermissions(): void {
        Promise.all([ this.permissionsService.hasPermission(this.starkPermissionsExcept),
             this.rolesService.hasOnlyRoles(this.starkPermissionsExcept) ])
               .then(([ hasPermission, hasRole ]) => {
                   if (hasPermission || hasRole) {
                       this.handleUnauthorisedPermission(this.starkPermissionsExceptElse || this.starkPermissionsElse);
                   } else {
                       if (!!this.starkPermissionsOnly) {
                           throw false;
                       } else {
                           this.handleAuthorisedPermission(this.starkPermissionsExceptThen
                            || this.starkPermissionsThen || this.templateRef);
                       }
                   }
               }).catch(() => {
            if (!!this.starkPermissionsOnly) {
                this.validateOnlyPermissions();
            } else {
                this.handleAuthorisedPermission(this.starkPermissionsExceptThen || this.starkPermissionsThen || this.templateRef);
            }
        });
    }

    private validateOnlyPermissions(): void {
        Promise.all([ this.permissionsService.hasPermission(this.starkPermissionsOnly),
             this.rolesService.hasOnlyRoles(this.starkPermissionsOnly) ])
               .then(([ permissionPr, roles ]) => {
                   if (permissionPr || roles) {
                       this.handleAuthorisedPermission(this.starkPermissionsOnlyThen || this.starkPermissionsThen || this.templateRef);
                   } else {
                       this.handleUnauthorisedPermission(this.starkPermissionsOnlyElse || this.starkPermissionsElse);
                   }
               }).catch(() => {
            this.handleUnauthorisedPermission(this.starkPermissionsOnlyElse || this.starkPermissionsElse);
        });
    }

    private handleUnauthorisedPermission(template: TemplateRef<any>): void {

        if (!isBoolean(this.currentAuthorizedState) || this.currentAuthorizedState) {
            this.currentAuthorizedState = false;
            this.permissionsUnauthorized.emit();

            if (this.unauthorisedStrategyDefined()) {
                if (isString(this.unauthorisedStrategyDefined())) {
                    this.applyStrategy(this.unauthorisedStrategyDefined());
                } else if (isFunction(this.unauthorisedStrategyDefined())) {
                    this.showTemplateBlockInView(this.templateRef);
                    (this.unauthorisedStrategyDefined() as Function)(this.templateRef);
                }
                return;
            }

            if (this.configurationService.onUnAuthorisedDefaultStrategy && this.noElseBlockDefined()) {
                this.applyStrategy(this.configurationService.onUnAuthorisedDefaultStrategy);
            } else {
                this.showTemplateBlockInView(template);
            }

        }
    }

    private handleAuthorisedPermission(template: TemplateRef<any>): void {
        if (!isBoolean(this.currentAuthorizedState) || !this.currentAuthorizedState) {
            this.currentAuthorizedState = true;
            this.permissionsAuthorized.emit();

            if (this.onlyAuthorisedStrategyDefined()) {
                if (isString(this.onlyAuthorisedStrategyDefined())) {
                    this.applyStrategy(this.onlyAuthorisedStrategyDefined());
                } else if (isFunction(this.onlyAuthorisedStrategyDefined())) {
                    this.showTemplateBlockInView(this.templateRef);
                    (this.onlyAuthorisedStrategyDefined() as Function)(this.templateRef);
                }
                return;
            }

            if (this.configurationService.onAuthorisedDefaultStrategy && this.noThenBlockDefined()) {
                this.applyStrategy(this.configurationService.onAuthorisedDefaultStrategy);
            } else {
                this.showTemplateBlockInView(template);
            }
        }
    }

    private showTemplateBlockInView(template: TemplateRef<any>): void {
        this.viewContainer.clear();
        if (!template) {
            return;
        }

        this.viewContainer.createEmbeddedView(template);
    }

    private getAuthorisedTemplates(): TemplateRef<any> {
        return this.starkPermissionsOnlyThen
            || this.starkPermissionsExceptThen
            || this.starkPermissionsThen
            || this.templateRef;
    }

    private noElseBlockDefined(): boolean {
        return !this.starkPermissionsExceptElse || !this.starkPermissionsElse;
    }

    private noThenBlockDefined() {
        return !this.starkPermissionsExceptThen || !this.starkPermissionsThen;
    }

    private onlyAuthorisedStrategyDefined() {
        return this.starkPermissionsOnlyAuthorisedStrategy ||
            this.starkPermissionsExceptAuthorisedStrategy ||
            this.starkPermissionsAuthorisedStrategy;
    }

    private unauthorisedStrategyDefined() {
        return this.starkPermissionsOnlyUnauthorisedStrategy ||
            this.starkPermissionsExceptUnauthorisedStrategy ||
            this.starkPermissionsUnauthorisedStrategy;
    }

    private applyStrategy(str: any) {
        if (str === StarkPermissionsPredefinedStrategies.SHOW) {
            this.showTemplateBlockInView(this.templateRef);
            return;
        }

        if (str === StarkPermissionsPredefinedStrategies.REMOVE) {
            this.viewContainer.clear();
            return;
        }
        const strategy = this.configurationService.getStrategy(str);
        this.showTemplateBlockInView(this.templateRef);
        strategy(this.templateRef);
    }
}
