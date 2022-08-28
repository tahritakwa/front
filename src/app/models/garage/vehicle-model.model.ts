import { Resource } from '../shared/ressource.model'; 
import { VehicleBrand } from './vehicle-brand.model';

export class VehicleModel extends Resource {
    Code: string;
    Designation: string;
    IdVehicleBrand: number;
    IdVehicleBrandNavigation: VehicleBrand;
}
