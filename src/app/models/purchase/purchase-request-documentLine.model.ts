import { Resource } from '../shared/ressource.model';

export class PurchaseRequestDocumentLine extends Resource {
  IdLine: number;
  LabelItem: string;
  IdItem: number;
  IdMeasureUnit: number;
  LabelMeasureUnit: string;
  MovementQty: number;
  IdWarehouse: number;
  WarehouseName: string;
  HtAmountWithCurrency: number;
  HtUnitAmountWithCurrency: number;
  Requirement: string;
  Designation: string;
  CodeDocumentLine: string;
}
