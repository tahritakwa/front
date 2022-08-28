import { Resource } from './ressource.model';
export class CreatedData extends Resource {
  public Code: string;
  constructor(_Id: number, _Code: string) {
    super();
    this.Id = _Id;
    this.Code = _Code;
  }
}
