import { Resource } from '../shared/ressource.model';
import { Employee } from '../payroll/employee.model';
import { TrainingSession } from './training-session.model';

export class EmployeeTrainingSession extends Resource {
    IdEmployee: number;
    IdTrainingSession: number;
    IdEmployeeNavigation: Employee;
    IdTrainingSessionNavigation: TrainingSession;
}
