import { Resource } from '../shared/ressource.model';

export class ReducedActive extends Resource {
  Code: string;
  Label: string;
  Description: string;
  AcquisationDate: Date;
  ServiceDate: Date;
}
