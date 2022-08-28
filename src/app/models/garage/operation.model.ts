import { Resource } from '../shared/ressource.model';
import { InterventionOperation } from './intervention-operation.model';
import { Machine } from './machine.model';
import { MileageProposedOperation } from './mileage-proposed-operation.model';
import { OperationType } from './operation-type.model';
import { RepairOrderOperation } from './repair-order-operation.model';

export class Operation extends Resource {
    Name: string;
    ExpectedDuration: number;
    IdOperationType: number;
    UnitNumber: number;
    IdTaxe: number;
    TaxeValuePercentage: number;
    Htprice: number;
    Ttcprice: number;
    IdItem: number;
    Code: string;

    DurationInDays: number;
    DurationInHours: number;
    DurationInMinutes: number;
    DurationInSecondes: number;

    InterventionOperation: InterventionOperation;
    MileageProposedOperation: MileageProposedOperation;
    IdOperationTypeNavigation: OperationType;
    MachineOperation: Array<Machine>;
    RepairOrderOperation: Array<RepairOrderOperation>;
}
