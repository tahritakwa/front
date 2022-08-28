import { Resource } from '../shared/ressource.model';
import { Email } from './email.model';
import { Interview } from './interview.model';

export class InterviewEmail extends Resource {
  IdInterview: number;
  IdEmail: number;
  CreationDate: Date;
  IdNavigationEmail: Email;
  IdNavigationInterview: Interview;
}
