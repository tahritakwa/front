import { Resource } from '../shared/ressource.model';
import { FileInfo } from '../shared/objectToSend';

export class VehicleBrand extends Resource {
  Code: string;
  Label: string;
  PictureFileInfo: FileInfo;
  UrlPicture : string;
  image: any;
  CreationDate: Date;
}
