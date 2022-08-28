import { Resource } from '../shared/ressource.model';

export class SalesPrice extends Resource {
  Code: string;
  Label: string;
  Value: number;
  IsActivated: boolean;
}
