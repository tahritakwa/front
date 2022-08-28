import {Resource} from '../shared/ressource.model';

export class Warehouse extends Resource {
  WarehouseCode: string;
  WarehouseName: string;
  WarehouseAdresse: string;
  IdResponsable: number;
  IdUserResponsable: number;
  AvailableQuantity?: number;
  ReservedQuantity?: number;
  OnOrderQuantity?: number;
  IdWarehouseParent?: number;
  IsCentral: boolean;
  IsEcommerce: boolean;
  IsWarehouse: boolean;
  IdWarehouseParentNavigation;
  InverseIdWarehouseParentNavigation;
  ForEcommerceModule: boolean;
  Shelf: any;
  Storage: any;
  State: any;
}
