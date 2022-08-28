import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';
import { SourceDeductionSession } from './source-deduction-session.model';

export class SourceDeductionSessionEmployee extends Resource {
    Id: number;
    IdSourceDeductionSession: number;
    IdEmployee: number;
    IdEmployeeNavigation: Employee;
    IdSourceDeductionSessionNavigation: SourceDeductionSession;
}
