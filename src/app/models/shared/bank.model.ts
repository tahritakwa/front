import { ReducedCountry } from '../administration/reduced-country.model';
import {Resource} from '../shared/ressource.model';
import { FileInfo } from './objectToSend';
import {BankAgency} from './bank-agency.model';

export class Bank extends Resource {
Name: string;
Address: string;
Phone: string;
Fax: string;
Email: string;
WebSite: string;
IdCountry?: number;
BankAgency: BankAgency[];
LogoFileInfo: FileInfo;
AttachmentUrl: string;
IdCountryNavigation: ReducedCountry;
image: any;
}
