import { Resource } from '../shared/ressource.model';
import { FileInfo } from '../shared/objectToSend';

export class EmployeeDocument extends Resource {
  Label: string;
  ExpirationDate: Date;
  Type: number;
  Value: string;
  AttachedFileInfo: FileInfo;
  AttachedFile: string;
  IdEmployee: number;
  IsPermanent: boolean;
  IdEmployeeNavigation;
}
