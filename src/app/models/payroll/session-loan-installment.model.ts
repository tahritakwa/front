import { Resource } from '../shared/ressource.model';
import { Contract } from './contract.model';
import { LoanInstallment } from './loan-installment.models';
import { Session } from './session.model';

export class SessionLoanInstallment extends Resource {
    IdSession: number;
    IdContract: number;
    IdLoanInstallment: number;
    Value: number;
    IdContractNavigation: Contract;
    IdLoanInstallmentNavigation: LoanInstallment;
    IdSessionNavigation: Session;
  }
