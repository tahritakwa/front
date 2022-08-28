import { Resource } from '../shared/ressource.model';

export class Storage extends Resource {
  Label: string;
  IdShelf: Number;
  IdShelfNavigation: any;
  IsDefault: boolean;
  IdResponsable;
  OldStorageLabel: string;
}
