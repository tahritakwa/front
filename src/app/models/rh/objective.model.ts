import { Resource } from '../shared/ressource.model';
import { Review } from './Review.model';
import { Employee } from '../payroll/employee.model';

export class Objective extends Resource {
  Label: string;
  ObjectiveCollaboratorStatus: number;
  ObjectiveManagerStatus: number;
  ExpectedDate: Date;
  DescriptionCollaborator: string;
  DescriptionManager: string;
  RealisationDate: Date;
  IdReview: number;
  IdEmployee: number;
  DeletedToken: string;
  IdReviewNavigation: Review;
  IdEmployeeNavigation: Employee;
}
