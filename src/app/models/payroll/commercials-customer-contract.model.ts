import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';
import { Prices } from '../sales/prices.model';

export class CommercialsCustomerContract extends Resource {
    IdEmployee: number;
    IdPrices: number;
    EngagementPercentage?: number;
    ProductivityBonus?: number;
    DeletedToken: string;
    CommercialStartDate?: Date;
    CommercialEndDate?: Date;
    IdPricesNavigation: Prices;
    IdEmployeeNavigation: Employee;
}
