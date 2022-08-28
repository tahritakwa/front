import { Resource } from '../shared/ressource.model';
import { TaxeGroupConfig } from './taxe-group-config';

export class TaxeGroup extends Resource {
  Code: string;
  Label: string;
  TaxeGroupTiersConfig: TaxeGroupConfig[] ;
}
