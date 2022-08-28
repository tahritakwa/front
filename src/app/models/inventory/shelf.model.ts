import {Resource} from '../shared/ressource.model';
import {Storage} from './storage.model';

export class Shelf extends Resource {
  Label: string;
  IdWarehouse: Number;
  IdWarehouseNavigation: any;
  IdResponsable: Number;
  IdResponsableNavigation: any;
  IsDefault: boolean;
  Storage: Storage[];
  OldShelfLabel: string;
}
