import { Resource } from '../shared/ressource.model';
import { Skills } from '../payroll/skills.model';
import { Training } from './training.model';

export class TrainingExpectedSkills extends Resource {
    IdTraining: number;
    IdSkills: number;
    DeletedToken: string;
    IdSkillsNavigation: Skills;
    IdTrainingNavigation: Training;
}
