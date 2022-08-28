import { Resource } from '../shared/ressource.model';
import { DetailReconciliation } from './detail-reconciliation.model';
import { Settlement } from '../payment/settlement.model';
import { FileInfo } from '../shared/objectToSend';

export class Reconciliation extends Resource {
    Label: string;
    ReconciliationDate: Date;
    IdBankAccount: number;
    IsValidate?: boolean;
    DeletedToken: string;
    AttachmentUrl: string;
    ObservationsFilesInfo: Array<FileInfo>;
    DetailReconciliation: Array<DetailReconciliation>;
    Settlement: Array<Settlement>;
}
