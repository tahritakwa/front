export class SearchItemToGenerateDoc {
    IdItem: number;
    IdDocument: number;
    IdTiers: number;
    QuantityForDocumentLine: number;
    IdWarehouse: number;
    DocumentTypeCode: string;
    IsValidReservationFromProvisionalStock: boolean;
    IdVehicle: number;
    constructor(IdItem: number, IdDocument: number,
        QuantityForDocumentLine: number, IdTiers: number, IdWarehouse: number,
        DocumentType: string) {
        if (!(QuantityForDocumentLine > 0)) {
            QuantityForDocumentLine = 1;
        }
        this.IdItem = IdItem;
        this.IdDocument = IdDocument;
        this.QuantityForDocumentLine = QuantityForDocumentLine;
        this.IdTiers = IdTiers;
        this.IdWarehouse = IdWarehouse;
        this.DocumentTypeCode = DocumentType;
        this.IsValidReservationFromProvisionalStock = false;
    }
}
