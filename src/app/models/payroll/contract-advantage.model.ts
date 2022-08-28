import { Resource } from '../shared/ressource.model';
import { Contract } from './contract.model';

export class ContractAdvantage extends Resource {
    IdContract: number;
    Description: string;
    IdContractNavigation: Contract;
}
