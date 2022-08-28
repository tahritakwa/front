import { Resource } from '../shared/ressource.model';
import { Period } from './period.model';

export class DayOff extends Resource {
    Label: string;
    Date: Date;
    IdPeriod: number;
    IdPeriodNavigation: Period;
}
