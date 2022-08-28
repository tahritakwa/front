import { Resource } from '../shared/ressource.model';
import { CnssDeclaration } from './cnss-declaration.model';
import { Session } from './session.model';
import { TransferOrder } from './transfer-order.model';

export class TransferOrderSession extends Resource {
    IdSession: number;
    IdTransferOrder: number;
    DeletedToken: string;
    IdTransferOrderNavigation: TransferOrder;
    IdSessionNavigation: Session;
}
