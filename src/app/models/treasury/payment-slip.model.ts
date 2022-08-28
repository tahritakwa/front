import { Resource } from '../shared/ressource.model';
import { FileInfo } from '../shared/objectToSend';
import { Settlement } from '../payment/settlement.model';
import { BankAccount } from '../shared/bank-account.model';

export class PaymentSlip extends Resource {
    Reference: string;
    Agency: string;
    Deposer: string;
    Date: Date;
    IdBankAccount: number;
    IdBankAccountNavigation: BankAccount;
    NumberOfSettlement: number;
    TotalAmountWithNumbers: number;
    TotalAmountWithLetters: string;
    State: number;
    Type: string;
    AttachmentUrl: string;
    FileInfo: FileInfo;
    Settlement: Array<Settlement>;
    IsDeleted: boolean;
    DeletedToken: string;
}
