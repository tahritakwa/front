import { Resource } from '../shared/ressource.model';
import { FunctionnalityByRole } from './functionnality-by-role.model';
import { ModuleByRole } from './module-by-role.model';

export class ReducedRole extends Resource {
    Code: string;
    RoleName: string;
    Label: string;
    FunctionalityByRole: FunctionnalityByRole [];
    ModuleByRole: ModuleByRole [];
    IsActive: boolean;
    IsVisible: boolean;
    IsIndeterminate: boolean;
    IsToCheckModule: boolean;
    IsToDisable: boolean;
}
