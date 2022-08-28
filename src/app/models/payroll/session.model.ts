import { DayOfWeek } from '../enumerators/day-of-week.enum';
import { Resource } from '../shared/ressource.model';
import { Attendance } from './attendance.model';
import { Payslip } from './payslip.model';
import { SessionBonus } from './session-bonus.model';
import { SessionContract } from './session-contract.model';
import { SessionLoanInstallment } from './session-loan-installment.model';
import { TransferOrderSession } from './transfer-order-session.model';
import { PayrollSessionState } from '../enumerators/session-state.enum';

export class Session extends Resource {
  IdSession: number;
  Title: string;
  CreationDate: Date;
  Month: Date;
  State: PayrollSessionState;
  DependOnTimesheet: boolean;
  DaysOfWork: number;
  Attendance: Array<Attendance>;
  Payslip: Array<Payslip>;
  SessionBonus: Array<SessionBonus>;
  Resume: any;
  SessionContract: Array<SessionContract>;
  Code: string;
  DaysOfWeekWorked: Array<DayOfWeek>;
  SessionLoanInstallment: Array<SessionLoanInstallment>;
  TransferOrderSession: Array<TransferOrderSession>;
}
