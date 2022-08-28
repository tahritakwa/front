import { Resource } from '../shared/ressource.model';

export class ReducedLeaveType extends Resource {
    Code: String;
    Label: string;
    Paid: boolean;
    RequiredDocument: boolean;
    MaximumNumberOfDays: number;
    Description: string;
}
