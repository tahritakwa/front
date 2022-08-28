import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';
import { LeaveType } from './leave-type.model';
import { FileInfo } from '../shared/objectToSend';
import { Comment } from '../../models/shared/comment.model';
import { Time } from '@angular/common';
import { DayHour } from '../shared/day-hour.model';

export class Leave extends Resource {
  CreationDate: Date;
  TreatmentDate?: Date;
  TreatedBy?: number;
  TreatedByNavigation?: Employee;
  StartDate: Date;
  EndDate: Date;
  StartTime: Time;
  EndTime: Time;
  Description: string;
  IdLeaveType: number;
  HalfDayStart: boolean;
  HalfEndDate: boolean;
  Status: number;
  LeaveAttachementFile: string;
  LeaveFileInfo: Array<FileInfo>;
  IdEmployee: number;
  IdEmployeeNavigation?: Employee;
  IdLeaveTypeNavigation: LeaveType;
  Comments: Array<Comment>;
  Code: string;
  NumberDaysLeave: DayHour;
  CurrentBalance: DayHour;
  TotalLeaveBalanceAcquired: DayHour;
  PreviousYearLeaveAcquired: DayHour;
  CurrentYearLeaveAcquired: DayHour;
  LeaveBalanceRemaining: DayHour;
  PreviousYearLeaveRemaining: DayHour;
  CurrentYearLeaveRemaining: DayHour;
  IsConnectedUserInHierarchy: boolean;

}
