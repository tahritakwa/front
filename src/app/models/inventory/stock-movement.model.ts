import { Resource } from '../shared/ressource.model';

export class StockMovement extends Resource {
    IdDocumentLine?: number;
    IdStockDocumentLine?: number;
    IdItem?: number;
    IdWarehouse: number;
    IdSection: number;
    CreationDate?: Date;
    RealStock?: number;
    MovementQty?: number;
    Cump?: number;
    Operation: string;
    Status: string;
}
