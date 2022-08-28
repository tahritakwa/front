export class TecdocDetails {
     Id: number;
     Reference: string;
     PackUnit: number;
     QtyPerUnit: number;
     SupplierBrand: string;
     SupplierLogo: string;
     ProductName: string;
     Information: any;
     Criteria: [{
          criteria: string,
          value: string
     }];
     OemNumbers: any;
     EanNumbers: string;
     SupplierId: number;


}
