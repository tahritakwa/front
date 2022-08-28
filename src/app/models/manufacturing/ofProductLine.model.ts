export class OfProductLine {
  id: number;
  of: any;
  idItem: number;
  description: string;
  quantitySeized: number;
  quantityToManufacture: number;
  unite: any;
  status: string;

  constructor(dataItem?: OfProductLine) {
    if (dataItem) {
      Object.assign(this, dataItem);
      this.idItem = dataItem.idItem;
    }
  }
}

