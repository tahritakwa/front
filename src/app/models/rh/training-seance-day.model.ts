import { DayOfWeek } from '../enumerators/day-of-week.enum';
import { TrainingSeance } from './training-seance.model';

export class TrainingSeanceDay {
    DayOfWeek: DayOfWeek;
    TrainingSeanceLine: Array<TrainingSeance>;
    DayName: string;
}
