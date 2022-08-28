import { Resource } from '../shared/ressource.model';
import { Intervention } from './intervention.model';

export class CustomerParts implements Resource {
    Id: number;
    Reference: string;
    Designation: string;
    Quantity?: number;
    IdIntervention: number;

    IdInterventionNavigation?: Intervention;
}
