import { Resource } from '../shared/ressource.model';

export class PurchaseSettings extends Resource {
  PurchaseOtherTaxes?: number;
  DeletedToken: string;
  IdPurchasingManager: number;
  IdDefaultTax: number;
  PurchaseAllowItemRelatedToSupplier: boolean;
  PurchaseAllowItemManagedInStock: boolean;
}
