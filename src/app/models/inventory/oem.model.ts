import { Resource } from '../shared/ressource.model';

export class Oem extends Resource {
  OemCode: string;
  IdTecDoc: string;

  constructor(Id, OemCode, IdTecDoc) {
    super();
    this.Id = Id;
    this.OemCode = OemCode;
    this.IdTecDoc = IdTecDoc;
  }
}
