import { Resource } from '../shared/ressource.model';

export class FileInfo extends Resource {
  Name: string;
  Extension: string;
  Data: Array<number>;
  Size: number;
}
