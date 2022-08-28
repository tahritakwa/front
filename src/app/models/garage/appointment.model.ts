import { Resource } from '../shared/ressource.model';
import { Garage } from './garage.model';
import { Intervention } from './intervention.model';
import { Vehicle } from './vehicle.model';

export class Appointment extends Resource {
    IdVehicle: number;
    IdGarage: number;
    Note: string;
    StartDate: Date;
    EndDate: Date;
    IdIntervention?: number;
    IsAllDay: boolean;
    State: number;
    IdVehicleNavigation: Vehicle;
    IdInterventionNavigation: Intervention;
    IdGarageNavigation: Garage;
}
