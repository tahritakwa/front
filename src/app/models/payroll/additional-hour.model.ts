import { Resource } from '../shared/ressource.model';
import { AdditionalHourSlot } from './additional-hour-slot.model';
export class AdditionalHour extends Resource{
    Code: string;
    Name: string;
    Description: string;
    Worked: boolean;
    IncreasePercentage: number;
    AdditionalHourSlot: AdditionalHourSlot[];
}
