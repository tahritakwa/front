import { Document } from '../../models/sales/document.model';
export class ObjectToSave {
  EntityAxisValues: any[] = new Array<any>();
  Model: Document = new Document();
  constructor(init?: Partial<Document>, entityAxisValues?: any[]) {
    Object.assign(this.Model, init);
    Object.assign(this.EntityAxisValues, entityAxisValues);
  }
}
export class ObjectToValidate {
  EntityAxisValues: any[];
  Model: any;
  constructor(id: any, idDocument?: number) {
    if (idDocument) {
      this.Model = [];
      const idsDocuments: Array<number> = Array<number>();
      idsDocuments.push(id);
      idsDocuments.push(idDocument);
      this.Model = idsDocuments;
    } else {
      this.Model = String(id);
    }
  }
}

export class ObjectToSend {
  EntityAxisValues: any[] = new Array<any>();
  Model: any ;
  constructor(data, entityAxisValues?: any[]) {
    this.Model = data;
    Object.assign(this.EntityAxisValues, entityAxisValues);
  }
}
