import { Resource } from '../shared/ressource.model';
import { Functionnality } from './functionnality.model';

export class FunctionnalityConfig extends Resource {
    IdFunctionality: number;
    IdRoleConfig?: number;
    IdUser?: number;
    Flag?: number;
    IsActive?: boolean;
    IsIndeterminate: boolean;
    IsToCheckModule: boolean;
    IdFunctionalityNavigation: Functionnality;
}
