import { Resource } from '../shared/ressource.model';

export class MachineOperation extends Resource {
  IdMachine: Number;
  IdOperation: Number;
  constructor(IdMachine: number, IdOperation: number) {
    super();
    IdMachine = IdMachine;
    IdOperation = IdOperation;
  }
}
