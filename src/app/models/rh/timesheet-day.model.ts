import { Resource } from '../shared/ressource.model';
import { TimeSheetLine } from './timesheet-line.model';
import { Project } from '../sales/project.model';

export class TimeSheetDay extends Resource {
    Day: Date;
    Hollidays: boolean;
    WeekNumberInYear: number;
    WaitingLeave?: number;
    DayTotalTime: number;
    TimeSheetLine: Array<TimeSheetLine>;
    Project: Array<Project>;
    Hours: Array<any>;
    WaitingLeaveTypeName: string;
}
