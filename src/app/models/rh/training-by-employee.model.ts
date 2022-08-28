import { Resource } from '../shared/ressource.model';
import { Training } from './training.model';
import { Employee } from '../payroll/employee.model';

export class TrainingByEmployee extends Resource {
    IdEmployee: number;
    IdTraining: number;
    DeletedToken: string;
    IdEmployeeNavigation: Employee;
    IdTrainingNavigation: Training;
}
