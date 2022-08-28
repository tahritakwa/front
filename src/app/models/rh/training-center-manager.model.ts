import { Resource } from '../shared/ressource.model';
import { TrainingCenter } from './training-center.model';

export class TrainingCenterManager extends Resource {
    FirstName: string;
    LastName: string;
    PhoneNumber: string;
    TrainingCenter:  Array<TrainingCenter>;
}
