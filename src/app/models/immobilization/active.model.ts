import { Resource } from '../shared/ressource.model';
import { ActiveAssignment } from './active-assignment.model';

export class Active extends Resource {
  Ipaddress: string;
  Macaddress: string;
  HostName: string;
  PhoneNumber: string;
  Code: string;
  Label: string;
  Value: number;
  Status: number;
  StatusName: string;
  AcquisationDate: Date;
  ServiceDate: Date;
  DepreciationPeriod: number;
  NumSerie: string;
  IdCategory: number;
  IdCategoryNavigation;
  Description: string;
  History: Array<ActiveAssignment>;
}
