import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';
import { ExpenseReportDetails } from './expense-report-details.model';
import { AdministrativeDocumentStatusEnumerator } from '../enumerators/administrative-document-status.enum';
import { Comment } from '../shared/comment.model';

export class ExpenseReport extends Resource {
    Purpose: string;
    SubmissionDate: Date;
    TreatmentDate?: Date;
    TreatedBy?: number;
    TreatedByNavigation?: Employee;
    Status: AdministrativeDocumentStatusEnumerator;
    IdEmployee: number;
    TotalAmount: number;
    IdEmployeeNavigation: Employee;
    ExpenseReportDetails: Array<ExpenseReportDetails>;
    Comments: Array<Comment>;
    Code: string;
}
