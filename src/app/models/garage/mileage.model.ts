import { Resource } from '../shared/ressource.model';
import { Intervention } from './intervention.model';
import { MileageProposedOperation } from './mileage-proposed-operation.model';
import { RepairOrder } from './repair-order.model';

export class Mileage extends Resource {
  MileageValue: number;
  Name: string;
  Intervention: Array<Intervention>;
  MileageProposedOperation: Array<MileageProposedOperation>;
  RepairOrder: Array<RepairOrder>;
}
