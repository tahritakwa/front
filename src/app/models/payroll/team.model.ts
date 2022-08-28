import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';
import { EmployeeTeam } from './employee-team.model';
import { HistoryOfTeamAssignments } from './history-of-team-assignments.model';

export class Team extends Resource {
  TeamCode: string;
  Name: string;
  IdManager: number;
  NumberOfAffected: number;
  IdManagerNavigation: Employee;
  CreationDate: Date;
  State: Boolean;
  IdTeamType: number;
  EmployeeTeam: Array<EmployeeTeam>;
  History: HistoryOfTeamAssignments[];
}
