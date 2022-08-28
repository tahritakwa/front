import { Resource } from '../shared/ressource.model';
import { Employee } from '../payroll/employee.model';
import { Training } from './training.model';
import { TrainingSession } from './training-session.model';

export class TrainingRequest extends Resource {
    ExpectedDate: Date;
    Status: number;
    CreationDate: Date;
    TreatmentDate: Date;
    IdTraining: number;
    IdEmployeeAuthor: number;
    IdEmployeeCollaborator: number;
    DeletedToken: string;
    Description: string;
    IdTrainingSession?: number;

    IdEmployeeAuthorNavigation: Employee;
    IdEmployeeCollaboratorNavigation: Employee;
    IdTrainingNavigation: Training;
    IdTrainingSessionNavigation: TrainingSession;
}
