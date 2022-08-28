import { Resource } from '../shared/ressource.model';
import { ExitEmployee } from './exit-employee.model';
import { LeaveType } from './leave-type.model';

export class ExitEmployeeLeaveLine extends Resource {
    Details: string;
    Month: Date;
    IdExitEmployee: number;
    DayTakenPerMonth: string;
    TotalTakenPerMonth: number;
    AcquiredParMonth: number;
    IdLeaveType: number;
    IdExitEmployeeNavigation: ExitEmployee;
    IdLeaveTypeNavigation: LeaveType;
}
