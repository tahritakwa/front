import { Resource } from '../shared/ressource.model';
import { SubModel } from '../inventory/sub-model.model';
import { Intervention } from './intervention.model';
import { ReducedTiers } from '../achat/reduced-tiers.model';

export class Car extends Resource {
    RegistrationNumber: string;
    ChassiNumber: string ;
    DateOfCommissioning: Date;
    DeletedToken: string;
    IdSubModel: number;
    IdTiers?: number;

    IdSubModelNavigation:  SubModel;
    Intervention:  Array<Intervention>;
    IdTiersNavigation: ReducedTiers;
}
