import { Resource } from '../shared/ressource.model';
import { Skills } from './skills.model';
import { Job } from './job.model';

export class JobSkills extends Resource {
  IdJob: number;
  IdSkill: number;
  Rate: number;
  IdSkillNavigation: Skills;
  IdJobNavigation: Job;

  constructor(IdJob: number, IdSkill: number, Rate: number) {
    super();
    this.IdJob = IdJob;
    this.IdSkill = IdSkill;
    this.Rate = Rate;
  }
}
