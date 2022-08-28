import { FileInfo } from '../shared/objectToSend';
import { Resource } from '../shared/ressource.model';
import { Garage } from './garage.model';


export class Worker extends Resource {
   FirstName: string;
   LastName: string;
   Address: string ;
   Phone: string;
   Email: string;
   IsResponsable: boolean;
   AttachmentUrl: string;
   PhoneNumber: string;
   ImgFileInfo: FileInfo;
   Cin: string;
   IdGarage: number;
   IdGarageNavigation: Garage;
   IdPhone: number;
   IdPhoneNavigation: any;
}
