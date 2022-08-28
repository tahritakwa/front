import { Resource } from './ressource.model';
export class Comment extends Resource {
  IdEntityReference: number;
  IdEntityCreated: number;
  IdCreator: number;
  EmailCreator: string;
  Message: string;
  CreationDate: Date;
  IdCreatorNavigation;
  IdEntityReferenceNavigation;
  Employee;
  SrcPictureEmployee: string;
  EntityName: string;
  Mails: Array<string>;
}
