import { Resource } from '../shared/ressource.model';
import { DayOff } from './day-off.model';
import { Hours } from './hours.model';

export class Period extends Resource {
    Label: string;
    StartDate: Date;
    EndDate: Date;
    FirstDayOfWork: number;
    LastDayOfWork: number;
    CanExtendInLeft?: boolean;
    CanExtendInRight?: boolean;
    CanEdit?: boolean;
    DayOff: Array<DayOff>;
    Hours: Array<Hours>;
    UpdatePayslipAndTimeSheet: boolean;
}
