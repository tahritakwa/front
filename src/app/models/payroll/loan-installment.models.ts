import { Resource } from '../shared/ressource.model';
import { Loan } from './loan.model';

export class LoanInstallment extends Resource {
    State: number;
    Month: Date;
    Amount: number;
    IdLoan: number;
    IdLoanNavigation: Loan;
}
