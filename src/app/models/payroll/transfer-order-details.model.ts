import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';

export class TransferOrderDetails extends Resource {
    IdEmployee: number;
    Rib: string;
    Label: string;
    Amount: number;
    IdTransferOrder: number;
    IdEmployeeNavigation: Employee;
}
