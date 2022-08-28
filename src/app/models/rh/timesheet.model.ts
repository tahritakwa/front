import { Resource } from '../shared/ressource.model';
import { Employee } from '../payroll/employee.model';
import { TimeSheetDay } from './timesheet-day.model';
import { FileInfo } from '../shared/objectToSend';
import { Document } from '../sales/document.model';
import { Comment } from '../../models/shared/comment.model';
import { NumberOfDaysDayHour } from '../shared/number-of-days-day-hour.model';

export class TimeSheet extends Resource {
    IdEmployee: number;
    Status: number;
    Month: Date;
    NumberOfWeek: number;
    IdEmployeeNavigation: Employee;
    TimeSheetDay: Array<TimeSheetDay>;
    TimeSheetFileInfo: Array<FileInfo>;
    CreationDate: Date;
    TreatmentDate: Date;
    IdEmployeeTreated: number;
    IdEmployeeTreatedNavigation: Employee;
    Document: Document[];
    NumberOfDaysDayHour: NumberOfDaysDayHour;
    Comments: Array<Comment>;
    Code: string;
    ResignationDateEmployee: Date;
    IsConnectedUserInHierarchy: boolean;

}
