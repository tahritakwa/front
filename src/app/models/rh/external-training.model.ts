import { Resource } from '../shared/ressource.model';
import { ExternalTrainer } from './external-trainer.model';
import { TrainingCenterRoom } from './training-center-room.model';
import { TrainingSession } from './training-session.model';

export class ExternalTraining extends Resource {
    IdExternalTrainer: number;
    IdTrainingCenterRoom: number;
    IdExternalTrainerNavigation: ExternalTrainer;
    IdTrainingCenterRoomNavigation: TrainingCenterRoom;
    IdTrainingSession?: number;
    IdTrainingSessionNavigation: TrainingSession;
}
