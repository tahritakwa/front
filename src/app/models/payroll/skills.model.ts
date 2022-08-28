import { Resource } from '../shared/ressource.model';
import { SkillsFamily } from './skills-family.model';
import { ExternalTrainerSkills } from '../rh/external-trainer-skills.model';

export class Skills extends Resource {
    Code: string;
    Description: string;
    Label: string;
    IdFamily: number;
    IdFamilyNavigation: SkillsFamily;
    ExternalTrainerSkills: Array<ExternalTrainerSkills>;
}
