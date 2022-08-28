import { Resource } from '../shared/ressource.model';
import { ItemWarehouse } from './item-warehouse.model';

export class ReducedItem extends Resource {
  Code: string;
  Description: string;
  UnitHtsalePrice: number;
  BarCode1D: string;
  DocumentLine;
  BarCode2D: string;
  ItemWarehouse: ItemWarehouse[];
  ListOfEquivalenceItem: Array<ReducedItem>;
}
