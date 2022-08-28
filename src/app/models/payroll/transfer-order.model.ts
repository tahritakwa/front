import { BankAccount } from '../shared/bank-account.model';
import { Resource } from '../shared/ressource.model';
import { TransferOrderDetails } from './transfer-order-details.model';
import { TransferOrderSession } from './transfer-order-session.model';

export class TransferOrder extends Resource {
    Title: string;
    Month: Date;
    CreationDate: Date;
    IdBankAccount: number;
    TransferOrderDetails: Array<TransferOrderDetails>;
    IdEmployeeSelected: number[];
    Code: string;
    IdBankAccountNavigation: BankAccount;
    State: number;
    TransferOrderSession: Array<TransferOrderSession>;
}
