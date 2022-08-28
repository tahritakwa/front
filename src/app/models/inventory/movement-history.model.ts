import { Resource } from "../shared/ressource.model";

export class MovementHistory extends Resource {
    SupplierCode: string;
    IdItem: number;
    ItemCode: string;
    ItemDesignation: string;
    DocumentType: string;
    CustomerCode: string;
    CustomerName: string;
    Date: Date;
    OrderNumber: string;
    Quantity: number;
    Puht: number;
    Puht1: number;
    Price: number;
    Discount: number;
    isPurchase: boolean;
    IsSale    : boolean;
    FiscalYear: string;
    pageSize: number;
    page: number;
}
