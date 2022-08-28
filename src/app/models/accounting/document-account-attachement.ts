export class DocumentAccountAttachement {
  id: number;
  base64File: string;
  name: string;
  documentAccountId: number;
  constructor(id?: number, base64File?: string, name?: string, documentAccountId?: number) {
    this.id = id;
    this.base64File = base64File;
    this.name = name;
    this.documentAccountId = documentAccountId;
  }
}
