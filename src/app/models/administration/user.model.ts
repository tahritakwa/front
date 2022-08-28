import { Resource } from '../shared/ressource.model';
import { MasterRoleUser } from './user-role.model';
import { FunctionnalityByUser } from './functionnality-by-user.model';
import { ModuleByUser } from './module-by-user.model';
import { UserCompany } from './user-company.model';
import { Employee } from '../payroll/employee.model';
import { UserPrivilege } from './user-privilege.model';
import { FileInfo } from '../shared/objectToSend';
import { SessionCash } from '../payment/session-cash.model';
/**
 *
 *
 * stark user model
 *
 *
 * */
export class User extends Resource {
  IdUser: number;
  IdTiers?: number;
  IdEmployee: number;
  FullName: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Lang: string;
  Language: string;
  MasterUserCompany: UserCompany[];
  Password: string;
  FunctionnalityByUser: FunctionnalityByUser[];
  ModuleByUser: ModuleByUser[];
  IsUserOnline: Boolean;
  masterUserInCompany: Boolean;
  LastConnectedCompany: string;
  LastConnectedCompanyId: number;
  Employee: Employee;
  UserPrivilege: UserPrivilege[];
  IsActif: Boolean;
  IdEmployeeNavigation: Employee;
  HasLeaveOrTimesheet: Boolean;
  Picture: string;
  IdPhoneNavigation: any;
  IdPhone: number;
  adrIp: any;
  lastCnx: any;
  Fax: string;
  Linkedin: string;
  Facebook: string;
  UrlPicture: string;
  Twitter: string;
  IsWithEmailNotification: boolean;
  PictureFileInfo: FileInfo;
  MasterRoleUser: MasterRoleUser[];
  image: any;
  SessionCashIdResponsibleNavigation: SessionCash[];
  SessionCashIdSellerNavigation: SessionCash[];
}
