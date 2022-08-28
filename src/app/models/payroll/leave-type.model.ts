import { Resource } from '../shared/ressource.model';
import { LeaveBalanceRemaining } from './LeaveBalanceRemaining.model';

export class LeaveType extends Resource {
    Code: String;
    Label: string;
    Description: string;
    MaximumNumberOfDays: number;
    Period: number;
    ExpiryDate: string;
    Paid: boolean;
    RequiredDocument: boolean;
    Calendar: boolean;
    Cumulable: boolean;
    AuthorizedOvertaking: boolean;
    LeaveBalanceRemaining: Array<LeaveBalanceRemaining>;
    Worked: boolean;
}
