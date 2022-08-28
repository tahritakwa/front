import {OfProductLine} from './ofProductLine.model';

export class FabricationArrangement {
  id: number;
  reference: string;
  dateCreation: string;
  dateDelivery: string;
  idTiers: number;
  status: string;
  ofProductLines: OfProductLine[];
}
