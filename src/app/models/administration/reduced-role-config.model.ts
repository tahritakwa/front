import { Resource } from '../shared/ressource.model';
import { ReducedFunctionnalityConfig } from './reduced-functionnality-config.model';
import { ReducedModuleConfig } from './reduced-module-config.model';

export class ReducedRoleConfig extends Resource {
    Code: string;
    RoleName: string;
    Label: string;
    FunctionalityConfig: ReducedFunctionnalityConfig [];
    ModuleConfig: ReducedModuleConfig [];
    IsActive: boolean;
    IsVisible: boolean;
    IsIndeterminate: boolean;
    IsToCheckModule: boolean;
    IsToDisable: boolean;
}
