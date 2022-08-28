import { Resource } from '../shared/ressource.model';
import { Item } from './item.model';
import { Warehouse } from './warehouse.model';

export class ItemWarehouse extends Resource {
  IdItem?: number;
  IdWarehouse?: number;
  WarehouseName: string;
  MinQuantity?: number;
  MaxQuantity?: number;
  AvailableQuantity?: number;
  ReservedQuantity?: number;
  OnOrderQuantity?: number;
  ToOrderQuantity?: number;
  SumOnOrderedReservedQuantity: number;
  SumOfAvailableQuantity?: number;
  IdItemNavigation: Item;
  Skip: number;
  Take: number;
  Shelf: string;
  Storage: string;
  NewStorage: string;
  IdWarehouseNavigation: Warehouse;
  Item: string;
  CMD: number;
  IdStorage: number;
  constructor(IdWarehouse?: number, IdItem?: number, Storage?: string, Shelf?: string, NewStorage?: string) {
    super();
    if (IdWarehouse) {
      this.IdWarehouse = IdWarehouse;
      this.Storage = Storage;
      this.Shelf = Shelf;
    }
    if (NewStorage) {
      this.NewStorage = NewStorage;
    }
    if (IdItem) {
      this.IdItem = IdItem;
    }
  }
}
