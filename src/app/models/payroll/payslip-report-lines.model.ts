import { Resource } from '../shared/ressource.model';

export class PayslipReportLines extends Resource {
    Label: string;
    NumberOfDays: number;
    Gain: number;
    Deduction: number;
}
