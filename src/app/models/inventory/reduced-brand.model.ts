import { Resource } from '../shared/ressource.model';

export class ReducedBrand extends Resource {
  Code: string;
  Label: string;
  UrlPicture?: string;
  Picture?: string;
}
