import { Resource } from '../shared/ressource.model';
import { FunctionnalityConfig } from './functionnality-config.model';
import { ModuleConfig } from './module-config.model';

export class RoleConfig extends Resource {
    Code: string;
    RoleName: string;
    Label: string;
    IsDeleted: boolean;
    IdRoleConfigCategory: boolean;
    FunctionalityConfig: FunctionnalityConfig [];
    ModuleConfig: ModuleConfig [];
    IsActive: boolean;
    IsVisible: boolean;
    IsIndeterminate: boolean;
    IsToCheckModule: boolean;
    IsToDisable: boolean;
}
