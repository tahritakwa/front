import { Resource } from '../shared/ressource.model';
import { Time } from '@angular/common';
import { TrainingSession } from './training-session.model';

export class TrainingSeance extends Resource {
    Date: Date ;
    StartHour: Time;
    EndHour: Time;
    DeletedToken: string;
    IdTrainingSession: number;
    Details: string;
    DayOfWeek: number;

    IdTrainingSessionNavigation: TrainingSession;
}
