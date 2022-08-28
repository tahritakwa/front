import { Item } from '../inventory/item.model';
import { Resource } from '../shared/ressource.model';
import { RepairOrder } from './repair-order.model';

export class RepairOrderItem extends Resource {
    IdRepairOrder: number;
    IdItem: number;
    UnitHtsalePrice?: number;
    Quantity: number;
    RemainingQuantity?: number;
    Htprice?: number;

    IdItemNavigation: Item;
    IdRepairOrderNavigation: RepairOrder;
}
