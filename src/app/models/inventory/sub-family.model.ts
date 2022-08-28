import { Resource } from '../shared/ressource.model';
import { FileInfo } from '../shared/objectToSend';

export class SubFamily extends Resource {
  Code: string;
  Label: string;
  IdFamily: number;
  PictureFileInfo: FileInfo;
  IdFamilyNavigation;
  IdSubCategoryEcommerce: number;
  UrlPicture : string;
  image: any;
  CreationDate: Date;
}
