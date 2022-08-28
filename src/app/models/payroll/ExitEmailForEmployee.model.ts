import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';

export class ExitEmailForEmployee extends Resource {
    IdEmployee: number;
    IdExitEmployee: number;
    IdEmployeeNavigation: Employee;
    public ExitEmailForEmployee() {
        this.Id = 0;
        this.IdEmployee = 0;
        this.IdExitEmployee = 0;
        this.IsDeleted = false;
    }
}
