
import { Injectable } from '@angular/core';

export const InvoiceLinesToAdd = [];
@Injectable()
export class DocumentExpenseGridLineService {

    public data: any[] = InvoiceLinesToAdd;
    public ObjectToSend: any[] = [];
    public importedData: any[] = [];
    public counter: number = InvoiceLinesToAdd.length;
    public InvoiceLinesToAdd(): any[] {
        return this.data;
    }

    public remove(rowIndex: any, id?: number): void {
        if (!id) {
            this.ObjectToSend.splice(rowIndex, 1);
        }
        this.data.splice(rowIndex, 1);
    }

    public save(documentLine: any, isNew: boolean, SaveInImportData?: boolean): void {
        if (isNew) {
            documentLine.IdLine = this.counter++;
            this.ObjectToSend.splice(0, 0, documentLine);
            if (!SaveInImportData) {
                this.data.splice(0, 0, documentLine);
            }
        } else {
            if (this.data.length > 0) {
                Object.assign(
                    this.data.find(({ IdLine }) => IdLine === documentLine.IdLine),
                    documentLine
                );
                Object.assign(
                    this.ObjectToSend.find(({ IdLine }) => IdLine === documentLine.IdLine),
                    documentLine
                );
            }
        }
    }

}
