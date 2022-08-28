import {Address} from './address.model';

export class CustomContactCrm {
  Id: number;
  IdTiers: number;
  IdCompany: number;
  FirstName: string;
  LastName: string;
  Tel1: string;
  Fax1: string;
  Email: string;
  Adress: Address;
  Fonction: string;
  IsDeleted: boolean;
  FullName: string;
  HomePhone: string;
  OtherPhone: string;
  AssistantName: string;
  AssistantPhone: string;
  Facebook: string;
  Twitter: string;
  Linkedin: string;
  DateOfBirth: Date;
  Description: string;
  organisationName: string;
}
