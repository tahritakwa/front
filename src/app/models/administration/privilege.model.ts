import { Resource } from '../shared/ressource.model';
import { UserPrivilege } from './user-privilege.model';

export class Privilege extends Resource {
    Label: string;
    Description?: string;
    DeletedToken: string;
    UserPrivilege: Array<UserPrivilege>;
}
