import { Resource } from '../shared/ressource.model';
import { Functionnality } from './functionnality.model';

export class FunctionnalityByRole extends Resource {
    IdFunctionality: number;
    IdRole?: number;
    IdUser?: number;
    Flag?: number;
    IsActive?: boolean;
    IdFunctionalityNavigation: Functionnality;

}
