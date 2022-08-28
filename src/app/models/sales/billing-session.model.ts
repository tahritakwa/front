import { Resource } from '../shared/ressource.model';
import { BillingEmployee } from './billing-employee.model';
import { Document } from './document.model';
import { BillingSessionState } from '../enumerators/BillingSessionState.enum';

export class BillingSession extends Resource {
    Title: string;
    CreationDate: Date;
    Month: Date;
    State: BillingSessionState;
    BillingEmployee: Array<BillingEmployee>;
    EmployeesIds: Array<number>;
    GeneratedDocuments: Array<Document>;
    Code: string;
    NumberOfNotGeneratedDocuments: number;
}
