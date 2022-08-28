import { Item } from '../inventory/item.model';
import { Resource } from '../shared/ressource.model';
import { OperationKit } from './operation-kit.model';

export class OperationKitItem implements Resource {
    Id: number;
    IdOperationKit: number;
    IdItem: number;
    Quantity: number;
    UnitHtsalePrice?: number;
    HtPrice?: number;
    IdOperationKitNavigation: OperationKit;
    IdItemNavigation: Item;
}
