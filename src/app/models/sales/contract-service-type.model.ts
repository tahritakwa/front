import { Resource } from '../shared/ressource.model';
import { Prices } from './prices.model';
export class ContractServiceType extends Resource {
    DeletedToken: string;
    Code: string;
    Label: string;
    HasManyConsultants: boolean;
    Prices: Array<Prices>;
}
