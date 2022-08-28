import { Resource } from '../shared/ressource.model';
import { RoleConfig } from '../administration/role-config.model';

export class RoleToAdd extends Resource {
    Code: string;
    RoleName: string;
    RoleConfigByRole: RoleConfig [];
}
