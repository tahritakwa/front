import { Resource } from '../shared/ressource.model';
import { TrainingCenter } from './training-center.model';
import { ExternalTraining } from './external-training.model';


export class TrainingCenterRoom extends Resource {
    Name: string;
    Capacity: number;
    Availability: number;
    RoomType: number;
    RentPerHour: number;
    IdTrainingCenter: number;
    IdTrainingCenterNavigation: TrainingCenter;
    ExternalTraining: Array<ExternalTraining>;
}
