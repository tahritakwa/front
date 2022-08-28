import { Resource } from '../shared/ressource.model';
import { FunctionnalityByRole } from './functionnality-by-role.model';
import { ModuleByRole } from './module-by-role.model';

export class Role extends Resource {
    Code: string;
    RoleName: string;
    IsDeleted: boolean;
    FunctionalityByRole: FunctionnalityByRole [];
    ModuleByRole: ModuleByRole [];
}
