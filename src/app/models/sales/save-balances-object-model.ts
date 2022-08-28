import { DocumentLine } from './document-line.model';

export class SaveBalancesObject {
    importedData: Array<DocumentLine>;
    gridData: Array<DocumentLine>;
    idDocument: number;
    DocumentDate: Date;
    DocumentType: string;
    IdTiers: number;
    constructor(importedData: Array<DocumentLine>, gridData: Array<DocumentLine>, idDocument: number,
        documentDate: Date, documentType: string, idTiers: number) {
        this.importedData = importedData;
        this.gridData = gridData;
        this.idDocument = idDocument;
        this.DocumentDate = documentDate;
        this.DocumentType = documentType;
        this.IdTiers = idTiers;
    }
}
