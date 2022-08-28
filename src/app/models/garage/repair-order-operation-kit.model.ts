import { Resource } from '../shared/ressource.model';
import { OperationKit } from './operation-kit.model';
import { RepairOrder } from './repair-order.model';

export class RepairOrderOperationKit extends Resource {
    IdRepairOrder: number;
    IdOperationKit: number;

    IdOperationKitNavigation: OperationKit;
    IdRepairOrderNavigation: RepairOrder;
}
