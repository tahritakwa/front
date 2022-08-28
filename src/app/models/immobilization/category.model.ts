import { Resource } from '../shared/ressource.model';

export class Category extends Resource {
  MinPeriod: number;
  MaxPeriod: number;
  ImmobilisationType: number;
  ImmobilisationTypeText: string;
  Label: string;
  Code: string;
}
