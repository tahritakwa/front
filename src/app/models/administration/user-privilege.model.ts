import { Resource } from '../shared/ressource.model';
import { Privilege } from './privilege.model';
import { User } from './user.model';

export class UserPrivilege extends Resource {
    IdUser: number;
    IdPrivilege: number;
    SameLevelWithHierarchy?: boolean;
    SameLevelWithoutHierarchy?: boolean;
    SubLevel?: boolean;
    SuperiorLevelWithHierarchy?: boolean;
    SuperiorLevelWithoutHierarchy?: boolean;
    Management?: boolean;
    IdPrivilegeNavigation: Privilege;
    IdUserNavigation: User;
}
