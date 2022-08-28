import { Operation } from '../../../COM/Models/operations';
import { Resource } from '../shared/ressource.model';
import { Unit } from './unit.model';

export class OperationType extends Resource {
    Name: string;
    IdUnit: number;
    UnitPrice: number;
    IdCurrency: number;

    IdUnitNavigation: Unit;
    Operation: Array<Operation>;
}
