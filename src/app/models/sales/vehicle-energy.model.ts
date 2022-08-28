import { Resource } from '../shared/ressource.model';
import { Vehicle } from './vehicle.model';

export class VehicleEnergy extends Resource {
    Name: string;
    Vehicle: Array<Vehicle>;
}
