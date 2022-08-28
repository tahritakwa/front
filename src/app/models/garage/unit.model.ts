import { Operation } from '../../../COM/Models/operations';
import { Resource } from '../shared/ressource.model';
import { Car } from './car.model';

export class Unit extends Resource {
    Name: string;
    Quantity: number;
    Type: number;
    Operation: Array<Operation>;
}
