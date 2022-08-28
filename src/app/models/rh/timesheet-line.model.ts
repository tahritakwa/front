import { Resource } from '../shared/ressource.model';
import { Time } from '@angular/common';
import { DayOff } from '../administration/day-off.model';
import { DayHour } from '../shared/day-hour.model';

export class TimeSheetLine extends Resource {
    StartTime: Time;
    EndTime: Time;
    IdProject: number;
    Details: string;
    Day: Date;
    IdTimeSheet: number;
    DayHour: DayHour;
    Valid: boolean;
    IdLeave: number;
    IdDayOff: number;
    IdDayOffNavigation: DayOff;
    Worked: boolean;
    WaitingLeaveTypeName: string;
}
