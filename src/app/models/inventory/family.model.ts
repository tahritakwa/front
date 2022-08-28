import {Resource} from '../shared/ressource.model';
import {FileInfo} from '../shared/objectToSend';

export class Family extends Resource {
  Code: string;
  Label: string;
  SubFamily: any;
  PictureFileInfo: FileInfo;
  IdCategoryEcommerce:number;
  UrlPicture: string;
  image: any;
  CreationDate: Date; 
}
