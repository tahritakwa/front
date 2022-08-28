import { Resource } from '../shared/ressource.model';

export class ContractType extends Resource {
    Code: string;
    Description: string;
    MinNoticePeriod: number;
    MaxNoticePeriod: number;
    Label: string;
    CalendarNoticeDays: boolean;
    HasEndDate: boolean;
}
