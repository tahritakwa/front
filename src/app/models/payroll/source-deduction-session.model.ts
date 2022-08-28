import { Resource } from '../shared/ressource.model';
import { SourceDeductionSessionEmployee } from './source-deduction-session-employee.model';
import { SourceDeduction } from './source-deduction.model';
import { PayrollSessionState } from '../enumerators/session-state.enum';

export class SourceDeductionSession extends Resource {
    Id: number;
    Title: string;
    CreationDate: Date;
    Year: number;
    State: PayrollSessionState;
    SourceDeduction: Array<SourceDeduction>;
    SourceDeductionSessionEmployee: Array<SourceDeductionSessionEmployee>;
    Code: string;
}
