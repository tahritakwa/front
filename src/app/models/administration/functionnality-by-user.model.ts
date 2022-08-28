import { Resource } from '../shared/ressource.model';
import { Functionnality } from './functionnality.model';

export class FunctionnalityByUser extends Resource {
    IdFunctionality: number;
    IsActive?: boolean;
    IsVisible: boolean;
    IdFunctionalityNavigation: Functionnality;

}
