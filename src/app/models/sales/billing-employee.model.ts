import { Resource } from '../shared/ressource.model';
import { Employee } from '../payroll/employee.model';
import { TimeSheet } from '../rh/timesheet.model';
import { Document } from '../sales/document.model';
import { EmployeeProjectsDetails } from './employee-projects-details.model';

export class BillingEmployee extends Resource {
    IdBillingSession: number;
    IdEmployee: number;
    IdProject: number;
    IdTimeSheet: number;
    IsChecked: boolean;
    IdEmployeeNavigation: Employee;
    IdTimeSheetNavigation: TimeSheet;
    IdDocumentNavigation: Document;
    EmployeeProjectsDetails: EmployeeProjectsDetails;
}
