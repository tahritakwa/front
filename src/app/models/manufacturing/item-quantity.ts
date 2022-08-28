export class ItemQuantity {
  IdItem: number;
  Quantity: number;
  IdWarehouse?: number;

  constructor(IdItem: number, Quantity: number, IdWarehouse?: number) {
    this.IdItem = IdItem;
    Quantity !== undefined ? this.Quantity = Quantity : 0;
    this.IdWarehouse = IdWarehouse;
  }
}
