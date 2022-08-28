import {Machine} from './machine.model';


export class OperationModel {
    id?: number;
    description: string;
    duration: any;
    machineDto: any;
    machineId: number;
    gammeId: number;
    responsibleId: number;
    machineDescription: string;
    responsibleName: string;
    operationBeforeDtos: Array<OperationModel> = [];
    operationBeforeDtosDescription: string;
    sectionId: number;
    sectionDescription: string;
    operation: any;
    equipment: any;
    machines: Machine[];
    equipmentTimeNet: string;
    personTimeNet: string;
    unitOfMeasure: string;
    productNomenclature: any[];
}
