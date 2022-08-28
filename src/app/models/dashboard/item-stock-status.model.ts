import { Dashboard, Period } from './dashboard.model';
export class ItemStockStatus extends Dashboard {

    IdItem: number;
    ItemCode: string;
    Name: string;
    Quantity: number;
    Amount: number;
    StockUnit: string;
    AvailableQuantity: number;
}
