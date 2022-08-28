import { Resource } from '../shared/ressource.model';
import { Review } from './Review.model';
import { Formation } from './formation.model';
import { Employee } from '../payroll/employee.model';

export class ReviewFormation extends Resource {
  Date: Date;
  FormationCollaboratorStatus: number;
  FormationManagerStatus: number;
  ManagerComment: string;
  CollaboratorComment: string;
  IdReview: number;
  IdFormation: number;
  IdEmployee: number;
  IdFormationNavigation: Formation;
  IdEmployeeNavigation: Employee;
  IdReviewNavigation: Review;
}
