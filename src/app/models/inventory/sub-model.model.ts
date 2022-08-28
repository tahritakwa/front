import { Resource } from '../shared/ressource.model';
import { FileInfo } from '../shared/objectToSend';

export class SubModel extends Resource {
  Code: string;
  Label: string;
  IdModel: number;
  IdModelNavigation;
  PictureFileInfo: FileInfo;
  UrlPicture : string;
  image: any;
  CreationDate: Date; 
}
