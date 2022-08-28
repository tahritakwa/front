import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';
import { Skills } from './skills.model';

export class EmployeeSkills extends Resource {
    Rate: number;
    IdSkills: number;
    IdEmployee: number;
    EmployeeViewModel: Employee;
    IdSkillsNavigation: Skills;
    RatePercent: any;
    ColorRate: any;
}
