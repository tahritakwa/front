import { Resource } from '../shared/ressource.model';


export class ReducedFunctionnalityConfig extends Resource {
    IdFunctionality: number;
    IdRoleConfig?: number;
    IdUser?: number;
    IdFunctionalityNavigationName: any;
    IsActive: boolean;
    IsVisible: boolean;
    IsIndeterminate: boolean;
    IsToCheckModule: boolean;
    IsToDisable: boolean;
}
