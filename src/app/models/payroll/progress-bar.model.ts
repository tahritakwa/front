import { Resource } from '../shared/ressource.model';
import { ProgressBarState } from '../enumerators/progress-bar-state.enum';
export class ProgressBar extends Resource {
  MaximalValue: number;
  Progression: number;
  State: ProgressBarState;
  SuccesseFullyGeneratedObjects: Array<any>;
  WrongGeneratedObjects: Array<any>;
}
