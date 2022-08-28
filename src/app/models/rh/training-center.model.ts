import { Resource } from '../shared/ressource.model';
import { Time } from '@angular/common';
import { TrainingCenterManager } from './training-center-manager.model';
import { TrainingCenterRoom } from './training-center-room.model';

export class TrainingCenter extends Resource {
    Name: string;
    Place: string;
    OpeningTime: Time;
    ClosingTime: Time;
    ModeOfPayment: number;
    CenterPhoneNumber: string;
    IdTrainingCenterManager: number;
    IdTrainingCenterManagerNavigation: TrainingCenterManager;
    TrainingCenterRoom: Array<TrainingCenterRoom>;
}
