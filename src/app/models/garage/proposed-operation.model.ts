import { Resource } from '../shared/ressource.model';
import { MileageProposedOperation } from './mileage-proposed-operation.model';

export class ProposedOperation extends Resource {
   Designation: string;
   Code: string;
   MileageProposedOperation: Array<MileageProposedOperation>;
}
