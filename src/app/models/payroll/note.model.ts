import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';
import { User } from '../administration/user.model';


export class Note extends Resource {
    Date: Date;
    Mark: string;
    IdCreator: number;
    IdEmployee: number;
    IdEmployeeNavigation: Employee;
    IdCreatorNavigation: User;
    SrcPictureEmployee: string;
}
