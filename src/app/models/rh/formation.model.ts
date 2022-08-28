import { Resource } from '../shared/ressource.model';
import { ReviewFormation } from './review-formation.model';
import { FormationType } from './formation-type.model';

export class Formation extends Resource {
  Label: string;
  Description: string;
  DeletedToken: string;
  ReviewFormation: ReviewFormation[];
  IdFormationTypeNavigation: FormationType;
}
