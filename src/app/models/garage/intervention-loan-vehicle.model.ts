
import { FileInfo } from '../shared/objectToSend';
import { Resource } from '../shared/ressource.model';
import { Intervention } from './intervention.model';
import { Vehicle } from './vehicle.model';

export class InterventionLoanVehicle extends Resource {
   LoanDate: Date;
   ExpectedReturnDate: Date;
   RealReturnDate: Date;
   IdIntervention: number;
   IdVehicle: number;
   Status?: number;
   VehiclePictureUrl?: string;
   VehiclePrictureInfo: Array<FileInfo>;
   IdInterventionNavigation: Intervention;
   IdVehicleNavigation: Vehicle;
}
