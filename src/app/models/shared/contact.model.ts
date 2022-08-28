import { Resource } from '../shared/ressource.model';
import {Tiers} from '../achat/tiers.model';
import { FileInfo } from './objectToSend';

export class Contact extends Resource {
  IdTiers: number;
  IdCompany: number;
  FirstName: string;
  LastName: string;
  Tel1: string;
  Fax1: string;
  Email: string;
  Adress: string;
  Fonction: string;
  FullName: string;
  IdTiersNavigation: Tiers;
  PictureFileInfo: FileInfo;
  PictureToDelete?: boolean;
  CreationDate?: Date;
  WasLead?: boolean;
}
