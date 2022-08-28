import { Resource } from '../shared/ressource.model';
import { Employee } from '../payroll/employee.model';
import { Team } from '../payroll/team.model';

export class EmployeeTeam extends Resource {
    AssignmentDate: Date;
    UnassignmentDate: Date;
    IdEmployee: number;
    IdTeam: number;
    AssignmentPercentage: number;
    IdEmployeeNavigation: Employee;
    IdTeamNavigation: Team;
    ShowControl: boolean;
    IsAssigned: boolean;
}
