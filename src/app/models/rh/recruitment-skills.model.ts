import { Resource } from '../shared/ressource.model';
import { Recruitment } from './recruitment.model';
import { Skills } from '../payroll/skills.model';

export class RecruitmentSkills extends Resource {
  IdRecruitment: number;
  IdSkills: number;
  Rate: number;
  IdRecruitmentNavigation: Recruitment;
  IdSkillsNavigation: Skills;

  constructor(IdRecruitment: number, IdSkills: number, Rate: number) {
    super();
    this.IdRecruitment = IdRecruitment;
    this.IdSkills = IdSkills;
    this.Rate = Rate;
  }
}
