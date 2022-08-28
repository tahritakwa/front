import { Resource } from '../shared/ressource.model';
import { InterventionOperationKit } from './intervention-operation-kit.model';
import { OperationKitItem } from './operation-kit-item.model';
import { OperationKitOperation } from './operation-kit-operation.model';
import { RepairOrderOperationKit } from './repair-order-operation-kit.model';

export class OperationKit implements Resource {
    Id: number;
    Name: string;
    HtPrice?: number;
    OperationKitItem: Array<OperationKitItem>;
    OperationKitOperation: Array<OperationKitOperation>;
    InterventionOperationKit: Array<InterventionOperationKit>;
    RepairOrderOperationKit: Array<RepairOrderOperationKit>;
}
