import { Resource } from '../shared/ressource.model';
import { ExitEmployee } from './exit-employee.model';

export class ExitEmployeePayLine extends Resource {
    Month: Date;
    NumberDayWorked: number;
    IdExitEmployee: number;
    IdExitEmployeeNavigation: ExitEmployee;
    Details: string;
    State: number;
}
