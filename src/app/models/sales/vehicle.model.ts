import { Tiers } from '../achat/tiers.model';
import { ModelOfItem } from '../inventory/model-of-item.model';
import { VehicleBrand } from '../inventory/vehicleBrand.model';
import { Resource } from '../shared/ressource.model';
import { VehicleEnergy } from './vehicle-energy.model';

export class Vehicle extends Resource {
    RegistrationNumber: string;
    ChassisNumber?: string;
    Power?: string;
    IdVehicleBrand?: number;
    IdVehicleModel?: number;
    IdTiers: number;
    IdVehicleEnergy?: number;
    DeletedToken: string;
    VehicleName: string;

    IdTiersNavigation: Tiers;
    IdVehicleBrandNavigation: VehicleBrand;
    IdVehicleEnergyNavigation?: VehicleEnergy;
    IdVehicleModelNavigation: ModelOfItem;
}
