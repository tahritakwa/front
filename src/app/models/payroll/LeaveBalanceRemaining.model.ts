import { DayHour } from '../shared/day-hour.model';
import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';
import { LeaveType } from './leave-type.model';

export class LeaveBalanceRemaining extends Resource {
    IdEmployee: number;
    IdLeaveType: number;
    CumulativeTaken: DayHour;
    RemainingBalance: DayHour;
    CumulativeAcquired: DayHour;
    IdEmployeeNavigation: Employee;
    IdLeaveTypeNavigation: LeaveType;
}
