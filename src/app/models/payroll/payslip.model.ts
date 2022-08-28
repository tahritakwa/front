import { Resource } from '../shared/ressource.model';
import { Contract } from './contract.model';
import { Employee } from './employee.model';
import { Session } from './session.model';
export class Payslip extends Resource {
  PayslipNumber: number;
  Month: Date;
  IdContract: number;
  IdEmployee: number;
  ErrorMessage: string;
  IdSession: number;
  Status: number;
  NumberDaysWorked: number;
  NumberDaysPaidLeave: number;
  IdContractNavigation: Contract;
  IdEmployeeNavigation: Employee;
  IdSessionNavigation: Session;
}
