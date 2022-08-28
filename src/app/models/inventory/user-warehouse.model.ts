import { Resource } from '../shared/ressource.model';
export class UserWarehouse extends Resource {
    UserMail?: number;
    IdWarehouse?: number;
    WarehouseName: string;
    DeletedToken: string;
}
