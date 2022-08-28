import { Resource } from '../shared/ressource.model';
import { ExitAction } from './exit-action.model';
import { ExitEmployee } from './exit-employee.model';

export class ExitActionEmployee extends Resource {
    IdExitEmployee: number;
    IdExitAction: number;
    VerifyAction: number;
    IdExitActionNavigation: ExitAction;
    IdExitEmployeeNavigation: ExitEmployee;
}
