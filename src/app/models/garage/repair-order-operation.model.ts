import { Resource } from '../shared/ressource.model';
import { Operation } from './operation.model';
import { RepairOrder } from './repair-order.model';

export class RepairOrderOperation extends Resource {
    IdRepairOrder: number;
    IdOperation: number;
    Duration: number;
    Htprice: number;
    IdOperationNavigation: Operation;
    IdRepairOrderNavigation: RepairOrder;
}
