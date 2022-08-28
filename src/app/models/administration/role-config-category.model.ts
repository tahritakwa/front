import { Resource } from '../shared/ressource.model';

export class RoleConfigCategory extends Resource {
    Code: string;
    Label: string;
    IsDeleted: boolean;
    DeletedToken: boolean;
    RoleConfig: any;
    IsActive: boolean;
    IsVisible: boolean;
    IsIndeterminate: boolean;
    IsToCheckModule: boolean;
    IsToDisable: boolean;
}
