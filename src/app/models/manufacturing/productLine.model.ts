export class ProductLine {
  productId: number;
  description: string;
  quantity: any;
  unite: any;
  tauxChute = 0;
  quantityChute = 0;
  quantityNet: any;
  unitHtpurchasePrice: any;
  IdItem: number;

  constructor(dataItem?: ProductLine) {
    if (dataItem) {
      Object.assign(this, dataItem);
      this.productId = dataItem.IdItem;
    }
  }
}
