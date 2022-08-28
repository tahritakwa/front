import { Resource } from '../shared/ressource.model';
import { FileInfo } from '../shared/objectToSend';

export class ModelOfItem extends Resource {
  Code: string;
  Label: string;
  IdVehicleBrand: number;
  IdVehicleBrandNavigation;
  PictureFileInfo?: FileInfo;
  Picture?: string;
  UrlPicture : string;
  image: any;
  CreationDate: Date;
}
