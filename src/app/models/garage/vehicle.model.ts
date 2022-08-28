import { Tiers } from '../achat/tiers.model';
import { Resource } from '../shared/ressource.model';
import { RepairOrder } from './repair-order.model';
import { VehicleBrand } from './vehicle-brand.model';
import { VehicleEnergy } from './vehicle-energy.model';
import { VehicleModel } from './vehicle-model.model';
import { VehicleType } from './vehicle-type.model';
export class Vehicle extends Resource {
    RegistrationNumber: string;
    ChassisNumber?: string;
    Power?: string;
    FirstTraficDate?: Date;
    IdVehicleBrand?: number;
    IdVehicleModel?: number;
    IdTiers: number;
    IdVehicleEnergy?: number;
    IdVehicleType?: number;
    DeletedToken: string;
    LastInterventionDate?: Date;
    LastMileage?: number;
    IsAvailable?: number;

    IdTiersNavigation: Tiers;
    IdVehicleBrandNavigation: VehicleBrand;
    IdVehicleEnergyNavigation?: VehicleEnergy;
    IdVehicleModelNavigation: VehicleModel;
    IdVehicleTypeNavigation: VehicleType;
    RepairOrder: Array<RepairOrder>;
}
