import { Resource } from "../shared/ressource.model";

export class WithholdingTax extends Resource {
    Code: string;
    Designation: string;
    Percentage: number;
    IdAccountingAccountWithHoldingTax: number;
    Type: number;
}

