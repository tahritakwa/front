import { Resource } from '../shared/ressource.model';
import { Time } from '@angular/common';
import { AdditionalHour } from './additional-hour.model';
export class AdditionalHourSlot extends Resource{
    StartTime: Time;
    EndTime: Time;
    IdAdditionalHour: number;
    IdAdditionalHourNavigation: AdditionalHour;
}
