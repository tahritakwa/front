import { Resource } from '../shared/ressource.model';
import { Training } from './training.model';
import { Skills } from '../payroll/skills.model';

export class TrainingRequiredSkills extends Resource {
    IdTraining: number;
    IdSkills: number;
    DeletedToken: string;
    IdSkillsNavigation: Skills;
    IdTrainingNavigation: Training;
}
