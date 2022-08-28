import { Resource } from '../shared/ressource.model';
import { Interview } from './interview.model';

export class InterviewType extends Resource {
  Label: string;
  Description: string;
  Interview: Array<Interview>;
}
