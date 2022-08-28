import { Resource } from '../shared/ressource.model';
import { City } from '../administration/city.model';
import { Country } from '../administration/country.model';
import { Employee } from '../payroll/employee.model';
import { Contact } from './contact.model';

export class Office extends Resource {
  OfficeName: string;
  AddressLine1: string;
  AddressLine2: string;
  AddressLine3: string;
  AddressLine4: string;
  AddressLine5: string;
  Facebook: string;
  LinkedIn: string;
  IdOfficeManager: number;
  CreationDate: Date;
  IdCreationUser: number;
  PhoneNumber: string ;
  IdCityNavigation: City;
  IdCountryNavigation: Country;
  IdOfficeManagerNavigation: Employee;
  Employee: Employee[];
  Address: any[] = [];
  Contact: Contact[];
  Twitter: string;
  Email: string;
  Fax: string;
  //  MobilityRequestIdCurrentOfficeNavigation: MobilityRequest[];
  //  MobilityRequestIdDestinationOfficeNavigation: MobilityRequest[];
}
