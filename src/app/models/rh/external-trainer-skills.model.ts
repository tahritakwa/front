import { Resource } from '../shared/ressource.model';
import { Skills } from '../payroll/skills.model';
import { ExternalTrainer } from './external-trainer.model';

export class ExternalTrainerSkills extends Resource {
    IdExternalTrainer?: number;
    IdSkills?: number;
    IsRecognized?: boolean;
    IsCertified?: boolean;
    Rate: number;
    IdExternalTrainerNavigation: ExternalTrainer;
    IdSkillsNavigation: Skills;
}
