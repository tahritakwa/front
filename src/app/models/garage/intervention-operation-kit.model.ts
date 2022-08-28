import { Resource } from '../shared/ressource.model';
import { Intervention } from './intervention.model';
import { OperationKit } from './operation-kit.model';

export class InterventionOperationKit implements Resource {
    Id: number;
    IdIntervention: number;
    IdOperationKit: number;
    IdInterventionNavigation: Intervention;
    IdOperationKitNavigation: OperationKit;
}
