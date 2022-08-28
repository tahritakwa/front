import {OperationModel} from './operation.model';
import {FabricationArrangement} from './fabricationArrangement.model';

export class DetailOperation {

  operation: OperationModel;
  fabrication: FabricationArrangement;
  statusOperation: string;
  reelDuration: any;
  responsibleId: number;
  responsableFullName: string;
  machineDescription: string;
  machineId: number;

  constructor(operation: any, fabrication: any , statusOperation: string) {
    this.operation = operation;
    this.fabrication = fabrication;
    this.statusOperation = statusOperation;
  }

}
