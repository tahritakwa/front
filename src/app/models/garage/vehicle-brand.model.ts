import { Resource } from '../shared/ressource.model';
import { FileInfo } from '../shared/objectToSend';
import { VehicleModel } from './vehicle-model.model';
export class VehicleBrand extends Resource {
    Code: string;
    Designation: string;
    PictureFileInfo: FileInfo;
    VehicleModel: Array<VehicleModel>;
}
