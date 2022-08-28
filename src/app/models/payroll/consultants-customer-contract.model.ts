import { Resource } from '../shared/ressource.model';
import { Prices } from '../sales/prices.model';
import { Employee } from './employee.model';

export class ConsultantsCustomerContract extends Resource {
    IdEmployee: number;
    IdPrices: number;
    WorkPercentage?: number;
    DeletedToken: string;
    ConsultantStartDate?: Date;
    ConsultantEndDate?: Date;
    IdPricesNavigation: Prices;
    IdEmployeeNavigation: Employee;
}
