import { FileInfo } from '../shared/objectToSend';
import { Resource } from '../shared/ressource.model';
import { Intervention } from './intervention.model';
import { Vehicle } from './vehicle.model';

export class Reception extends Resource {
    ReceiptDate?: Date;
    ReceiptHours: any;
    CurrentMileage?: number;
    FuelLevel?: number;
    CigaretteLigher?: boolean;
    CrickTools?: boolean;
    SpareWheel?: boolean;
    Radio?: boolean;
    HandTools?: boolean;
    HubCap?: boolean;
    DiagnosticUrlPicture: string;
    VehicleDiagnosticPictureFileInfo: FileInfo;
    Note?: string;
    IdVehicle: number;
    IdReceiverWorker?: number;

    IdReceiverWorkerNavigation: Worker;
    IdVehicleNavigation: Vehicle;
    Intervention: Array<Intervention>;
}
