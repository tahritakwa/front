import { Item } from '../inventory/item.model';
import { Resource } from '../shared/ressource.model';
import { FileInfo } from '../shared/objectToSend';

export class Nature extends Resource {
  Code: string;
  Label: string;
  IsStockManaged?: boolean;
  PictureFileInfo: FileInfo;
  Item : Item [];
  UrlPicture : string;
  image: any;
}
