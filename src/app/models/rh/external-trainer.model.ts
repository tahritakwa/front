import { Resource } from '../shared/ressource.model';
import { ExternalTrainerSkills } from './external-trainer-skills.model';
import { TrainingSession } from './training-session.model';
import { ExternalTraining } from './external-training.model';

export class ExternalTrainer extends Resource {
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
    YearsOfExperience?: number;
    HourCost?: number;
    FullName: string;
    ExternalTrainerSkills: Array<ExternalTrainerSkills>;
    TrainingSession: Array<TrainingSession>;
    ExternalTraining: Array<ExternalTraining>;
}
