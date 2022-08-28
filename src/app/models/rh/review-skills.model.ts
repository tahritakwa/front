import { Resource } from '../shared/ressource.model';
import { Skills } from '../payroll/skills.model';
import { Review } from './Review.model';
import { Employee } from '../payroll/employee.model';

export class ReviewSkills extends Resource {
  CollaboratorMark: number;
  ManagerMark: number;
  IsOld: boolean;
  OldRate: number;
  IdReview: number;
  IdSkills: number;
  IdEmployee: number;
  IdEmployeeNavigation: Employee;
  IdReviewNavigation: Review;
  IdSkillsNavigation: Skills;
  constructor(id: number, idSkills: number, oldRate: number) {
    super();
    this.Id = id;
    this.IdSkills = idSkills;
    this.OldRate = oldRate;
  }
}
