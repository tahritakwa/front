import { Resource } from '../shared/ressource.model';
import { CustomerParts } from './customer-parts.model';
import { Garage } from './garage.model';
import { InterventionItem } from './intervention-item.model';
import { InterventionLoanVehicle } from './intervention-loan-vehicle.model';
import { InterventionOperationKit } from './intervention-operation-kit.model';
import { InterventionOperation } from './intervention-operation.model';
import { Mileage } from './mileage.model';
import { Reception } from './reception.model';
import { RepairOrder } from './repair-order.model';

export class Intervention extends Resource {
    InterventionDate?: Date;
    InterventionHours?: any;
    Ttcprice: number;
    Status: number;
    Code: string;
    InterventionFor?: number;
    InterventionType?: number;
    IdMileageProgrammed?: number;
    IdReception?: number;
    IdGarage: number;
    ExpectedDeliveryDate?: Date;
    ExpectedDeliveryHours?: any;
    IdDeliveryDocument?: number;
    IdInvoiceDocument?: number;
    IdRepairOrder?: number;
    DocumentCode?: string;

    ListIdOperationKit?: Array<number>;
    InterventionItem: Array<InterventionItem>;
    InterventionOperation: Array<InterventionOperation>;
    IdMileageProgrammedNavigation: Mileage;
    IdGarageNavigation: Garage;
    IdReceptionNavigation: Reception;
    InterventionOperationKit: Array<InterventionOperationKit>;
    InterventionLoanVehicle: Array<InterventionLoanVehicle>;
    IdRepairOrderNavigation: RepairOrder;
    CustomerParts: Array<CustomerParts>;
    IdDeliveryDocumentNavigation?: any;
    IdInvoiceDocumentNavigation?: any;
}
