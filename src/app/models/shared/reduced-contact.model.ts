import { Resource } from './ressource.model';

export class ReducedContact extends Resource {
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
}
