import { Resource } from '../shared/ressource.model';

export class FileDrive extends Resource {
  randomId?: string;
  Name: string;
  parent: string;
  CreatedBy: number;
  CreationDate: Date;
  Type: string;
  IdParent: number;
  Size: number;
  Path: string;
  FileDriveInfo: Array<FileDrive>;
  FileData: string;
  Data: string[];
}
