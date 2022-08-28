import { Role } from './role.model';
import { User } from './user.model';
import { IResource } from '../shared/IRessource.model';

export class MasterRoleUser implements IResource {
  IdRole: number;
  IdRoleNavigation: Role;
  IdUser: number;
  IdUserNavigation: User;
  Id: number;
  IsDeleted: boolean;
}

