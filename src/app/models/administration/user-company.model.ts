import { Resource } from '../shared/ressource.model';

export class UserCompany extends Resource {
  CodeCompany: string;
  IdUser: number;
  IsActif: Boolean;
  constructor(CodeCompany: string) {
    super();
    this.CodeCompany = CodeCompany;
  }
}
