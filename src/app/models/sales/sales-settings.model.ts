import { Resource } from '../shared/ressource.model';

export class SaleSettings extends Resource {
  SaleOtherTaxes?: number;
  DeletedToken: string;
  IdNavigation: any;
  InvoicingDay: number;
  InvoicingEndMonth: boolean;
  SaleAllowItemManagedInStock: boolean;
  AllowEditionItemDesignation: boolean;
}
