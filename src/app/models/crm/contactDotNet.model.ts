import {Tiers} from '../achat/tiers.model';
import { FileInfo } from '../shared/objectToSend';

export class ContactDOtNet{
  Id: number;

IdTiers: number;
IdCompany: number;
FirstName: string;
LastName: string;
Tel1: string;
Fax1: string;
Email: string;
Adress: string;
Fonction: string;
IsDeleted: boolean;
FullName: string;
HomePhone: string;
OtherPhone: string;
AssistantPhone: string;
AssistantName: string;
Linkedin: string;
Facebook: string;
Twitter: string;
UrlPicture: string;
ContactType: string;
Prefix: string;
Classification: string;
MapLocation: string;
IdTiersNavigation: Tiers;
PictureFileInfo: FileInfo;
DateToRemember: any;
Phone : any;
}
