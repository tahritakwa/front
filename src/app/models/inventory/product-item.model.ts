import { Resource } from '../shared/ressource.model';
import { FileInfo } from '../shared/objectToSend';

export class ProductItem extends Resource {
  CodeProduct: string;
  LabelProduct: string;
  PictureFileInfo: FileInfo;
  UrlPicture : string;
  image: any;
}
