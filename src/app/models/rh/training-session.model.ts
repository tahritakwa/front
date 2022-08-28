import { Resource } from '../shared/ressource.model';
import { TrainingSeance } from './training-seance.model';
import { TrainingRequest } from './training-request.model';
import { Training } from './training.model';
import { FileInfo } from '../shared/objectToSend';
import { ExternalTrainer } from './external-trainer.model';
import { Employee } from '../payroll/employee.model';
import { ExternalTraining } from './external-training.model';
import { EmployeeTrainingSession } from './employee-training-session.model';

export class TrainingSession extends Resource {
    Status: number;
    DeletedToken: number;
    IdTraining: number;
    NumberOfSeance: number;
    NumberOfParticipant: number;
    Name: string;
    Description: string;
    SessionPlan: string;
    Duration: number;
    StartDate: Date;
    EndDate: Date;
    SessionPlanUrl: string;
    SessionPlanFileInfo: Array<FileInfo>;
    IdExternalTrainer?: number;
    IdExternalTrainerNavigation: ExternalTrainer;

    IdTrainingNavigation: Training;
    TrainingRequest: Array<TrainingRequest>;
    TrainingSeance: Array<TrainingSeance>;
    ExternalTraining: Array<ExternalTraining>;
    EmployeeTrainingSession: Array<EmployeeTrainingSession>;

}
