import { Resource } from '../shared/ressource.model';
import { Period } from './period.model';
import { Time } from '@angular/common';

export class Hours extends Resource {
    Label: string;
    StartTime: Time;
    EndTime: Time;
    WorkTimeTable: boolean;
    IdPeriod: number;
    IdPeriodNavigation: Period;
}
