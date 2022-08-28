import { Employee } from '../payroll/employee.model';
import { ProjectDetail } from './project-detail.model';
import { DayHour } from '../shared/day-hour.model';

export class EmployeeProjectsDetails {
    Employee: Employee;
    IdTimeSheet: number;
    TimeSheetStatus: number;
    Projects: ProjectDetail[];
    NumberOfLeavesDays: DayHour;
}
