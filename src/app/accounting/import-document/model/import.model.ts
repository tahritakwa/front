import { FiltreDocument } from "./filtreDocument.model";

export class ImportModel {

  StartDate: Date;
  EndDate: Date;
  DocumentType: string;
  AccoutingStatus: number;
  skip: number;
  take: number;
  FiltreDocument: FiltreDocument;
 
  constructor(startDate?: Date, endDate?: Date,isSales?:string , AccoutingStatus?: number,skip?: number,take? : number, 
    FiltreDocument?: FiltreDocument) {
    this.StartDate = startDate;
    this.EndDate = endDate;
    this.DocumentType = isSales;
    this.AccoutingStatus = AccoutingStatus;
    this.skip = skip;
    this.take = take;
    this.FiltreDocument = FiltreDocument;
  }
}
