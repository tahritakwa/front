import { Resource } from '../shared/ressource.model';
import { DetailsSettlementMode } from './details-settlement-mode.model';

export class SettlementType extends Resource {
  Code: string;
  Label: string;
  DetailsSettlementMode: Array<DetailsSettlementMode>;
}
