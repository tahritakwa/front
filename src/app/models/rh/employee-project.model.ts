import { Resource } from '../shared/ressource.model';
import { Employee } from '../payroll/employee.model';
import { Project } from '../sales/project.model';

export class EmployeeProject extends Resource {
    AssignmentDate: Date;
    UnassignmentDate: Date;
    IdEmployee: number;
    IdProject: number;
    AverageDailyRate: number;
    IsBillable: boolean;
    AssignmentPercentage: number;
    IdEmployeeNavigation: Employee;
    IdProjectNavigation: Project;
    ShowControl: boolean;
    ShowBillableOption: boolean;
    CompanyCode: string;
}
