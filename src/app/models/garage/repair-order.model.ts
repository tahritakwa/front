import { Email } from '../rh/email.model';
import { Resource } from '../shared/ressource.model';
import { Garage } from './garage.model';
import { Intervention } from './intervention.model';
import { Mileage } from './mileage.model';
import { RepairOrderItem } from './repair-order-item.model';
import { RepairOrderOperationKit } from './repair-order-operation-kit.model';
import { RepairOrderOperation } from './repair-order-operation.model';
import { Vehicle } from './vehicle.model';

export class RepairOrder extends Resource {
    Code: string;
    Status: number;
    CurrentMileage?: number;
    RepairOrderType?: number;
    IdMileageProgrammed?: number;
    IdGarage: number;
    IdQuotationDocument?: number;
    IdTiers: number;
    IdVehicle?: number;
    IdEmail?: number;

    IdGarageNavigation: Garage;
    IdMileageProgrammedNavigation: Mileage;
    IdVehicleNavigation: Vehicle;
    IdEmailNavigation: Email;
    ListIdOperationKit?: Array<number>;
    RepairOrderItem: Array<RepairOrderItem>;
    RepairOrderOperation: Array<RepairOrderOperation>;
    Intervention: Array<Intervention>;
    RepairOrderOperationKit: Array<RepairOrderOperationKit>;
}
