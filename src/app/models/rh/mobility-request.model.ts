import { Resource } from '../shared/ressource.model';
import { User } from '../administration/user.model';
import { Office } from '../shared/office.model';
import { Employee } from '../payroll/employee.model';

export class MobilityRequest extends Resource {
  Status: number;
  IdEmployee: number;
  IdCurrentOffice: number;
  IdDestinationOffice: number;
  DesiredMobilityDate: Date;
  EffectifMobilityDate: Date;
  Description: string;
  CreationDate: Date;
  IsCurrentUserTheDepartureOfficeManager: boolean;
  IsCurrentUserTheDestinationOfficeManager: boolean;
  IdCreationUser: number;

  IdCreationUserNavigation: User;
  IdCurrentOfficeNavigation: Office;
  IdDestinationOfficeNavigation: Office;
  IdEmployeeNavigation: Employee;
}

