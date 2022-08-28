import { Resource } from '../shared/ressource.model';
import { Employee } from '../payroll/employee.model';
import { ReviewResume } from './review-resume.model';
import { ReviewFormation } from './review-formation.model';
import { ReviewSkills } from './review-skills.model';
import { Objective } from './objective.model';
import { Interview } from './interview.model';

export class Review extends Resource {
  ReviewDate: Date;
  IdEmployeeCollaborator: number;
  DeletedToken: string;
  State: number;
  IdEmployeeCollaboratorNavigation: Employee;
  Objective: Objective[];
  ReviewFormation: ReviewFormation[];
  ReviewResume: ReviewResume[];
  ReviewSkills: ReviewSkills[];
  Interview: Interview[];
  FormManager?: number;
  FormEmployee?: number;
  IdManager?: number;
  IdManagerNavigation: Employee;
}
