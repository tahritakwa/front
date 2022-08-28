import { Injectable } from '@angular/core';
import { CostPrice } from '../../../models/purchase/cost-price.model';

export const InvoiceLinesToAdd = [];
export const CostData = [];
export const priceRequest = [];
@Injectable()
export class DocumentLineService {
  public purchaseOrderToImport: number[] = [];
  public data: any[] = InvoiceLinesToAdd;
  public quotaionData: any[] = InvoiceLinesToAdd;
  public ObjectToSend: any[] = [];
  public ObjectToSendPrice: any[] = [];
  public importedData: any[] = [];
  public costData: CostPrice[] = [];
  public counterCost: number = CostData.length;
  public counter: number = InvoiceLinesToAdd.length;
  public counterPriceRequest: number = priceRequest.length;
  public priceRequest: any[] = priceRequest;
  public InvoiceLinesToAdd(): any[] {
    return this.data;
  }
  public ObjectToSendToAdd(): any[] {
    return this.ObjectToSend;
  }
  public costDataToAdd(): any[] {
    return this.costData;
  }

  public priceRequestToAdd(): any[] {
    return this.priceRequest;
  }
  public remove(rowIndex: any, id?: number): void {
    if (!id) {
      this.ObjectToSend.splice(rowIndex, 1);
    }
    this.data.splice(rowIndex, 1);
    this.costData.splice(rowIndex, 1);
  }

  public removePriceRequest(rowIndex: any, id?: number): void {
    if (!id) {
      this.ObjectToSendPrice.splice(rowIndex, 1);
    }
    this.priceRequest.splice(rowIndex, 1);
  }
  public save(documentLine: any, isNew: boolean, saveInImportData?: boolean): void {
    if (isNew) {
      documentLine.IdLine = this.counter++;
      this.ObjectToSend.splice(0, 0, documentLine);
      if (!saveInImportData) {
        this.data.splice(0, 0, documentLine);
      } else {
        this.quotaionData.splice(0, 0, documentLine);
      }
    } else {
      if (this.data.length > 0) {
        Object.assign(
          this.data.find(({ IdLine }) => IdLine === documentLine.IdLine),
          documentLine
        );
      }
    }
  }

  public savePriceRequest(documentLine: any, isNew: boolean): void {
    if (isNew) {
      documentLine.IdLine = ++this.counterPriceRequest;
      this.priceRequest.push(documentLine);
    } else {
      if (this.priceRequest.length > 0) {
        Object.assign(this.priceRequest.find(x => x.IdLine === documentLine.IdLine), documentLine)
      }
    }
  }
  /**save dost data for cost grid */
  //public saveCostData(documentLine: any, isNew: boolean): void {
  //    if (isNew) {
  //        documentLine.IdLine = this.counterCost++;
  //        this.costData.splice(0, 0, documentLine);
  //    } else {
  //        if (this.data.length > 0) {
  //            Object.assign(
  //                this.costData.find(({ IdLine }) => IdLine === documentLine.IdLine),
  //                documentLine
  //            );
  //        }
  //    }
  //}

}
