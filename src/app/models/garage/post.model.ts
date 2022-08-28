import { Resource } from '../shared/ressource.model';
import { Garage } from './garage.model';
import { Machine } from './machine.model';

export class Post extends Resource {
    Name: string;
    IdGarage: number;
    IdGarageNavigation: Garage;
    Machine: Array<Machine>;
}
