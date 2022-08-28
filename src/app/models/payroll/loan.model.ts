import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';
import { FileInfo } from '../shared/objectToSend';
import { LoanInstallment } from './loan-installment.models';

export class Loan extends Resource {
    State: number;
    Code: string;
    ApprouvementDate: Date;
    DisbursementDate: Date;
    Amount: number;
    ObtainingDate: Date;
    Reason: string;
    IdEmployeeNavigation: Employee;
    IdEmployee: number;
    LoanAttachementFile: string;
    LoanFileInfo: Array<FileInfo>;
    LoanInstallment: Array<LoanInstallment>;
    MonthsNumber: number;
    RefundStartDate: Date;
    CreditType: number;
}
