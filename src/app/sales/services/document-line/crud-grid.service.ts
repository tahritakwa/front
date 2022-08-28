import { Injectable } from '@angular/core';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { CostPrice } from '../../../models/purchase/cost-price.model';


export const gridData = [];
export const otherData = [];
export const costData = [];
export const expenseData = [];
export const anyData = [];
@Injectable()
export class CrudGridService {
    public DataToImport = [];
    public data: DocumentLine[] = gridData;
    public otherData: DocumentLine[] = otherData;
    public costData: CostPrice[] = costData;
    public expenseData: any[] = expenseData;
    public anyData: any[] = anyData;
    public linesToDisplay(listName: string): any[] {
        return this[listName];
    }
    public saveData(documentLine: any, isNew: boolean, listName: string): void {
        if (isNew) {

            this[listName].splice(0, 0, documentLine);

        } else {

            const dataToSave = this.getDataToSave(documentLine, listName);

            if (this[listName].length > 0 && dataToSave) {

                Object.assign(dataToSave, documentLine);

            }

        }
    }
    private getDataToSave(documentLine: any, listName: string) {

        return listName === 'anyData' ?
            this[listName].find(({ IdItem }) => IdItem === documentLine.IdItem) :
            this[listName].find(({ Id }) => Id === documentLine.Id);
    }

}
