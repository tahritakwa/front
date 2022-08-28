import { Resource } from '../shared/ressource.model';
import { Item } from '../inventory/item.model';
import { Intervention } from './intervention.model';

export class InterventionItem extends Resource {
    Id: number;
    Quantity: number;
    RemainingQuantity?: number;
    IdIntervention: number;
    IdItem: number;
    UnitHtsalePrice?: number;
    Htprice?: number;
    Ttcprice?: number;

    IdItemNavigation: Item;
    IdInterventionNavigation: Intervention;
}
