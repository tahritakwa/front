import { Resource } from '../shared/ressource.model';
import { Item } from './item.model';
import { VehicleBrand } from './vehicleBrand.model';

export class OemItem extends Resource {
  IdItem: number;
  IdBrand: number;
  IdBrandNavigation: VehicleBrand;
  Brand: string;
  OemNumber: string;
  DeletedToken: string;
  IdItemNavigation: Item;
  isViewed: boolean;
  isNotifOn: boolean;
  constructor(id: number, oemNumber: string, idBrandNavigation: VehicleBrand, idItem?: number) {
    super();
    this.OemNumber = oemNumber;
    this.IdBrandNavigation = idBrandNavigation;
    this.IdBrand = idBrandNavigation.Id;
    this.Id = id;
    this.IdItem = idItem;
  }
}
