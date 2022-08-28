import { Resource } from './ressource.model';
import { User } from '../administration/user.model';

export class Message extends Resource {
  TypeMessage: number;
  IdCreator: number;
  IdInformation: number;
  EntityReference: number;
  CodeEntity: string;
  Users: Array<User>;
  constructor(_IdCreator: number, _IdInformation: number, _EntityReference: number, _CodeEntity: string, _users: Array<any>) {
    super();
    this.IdCreator = _IdCreator;
    this.IdInformation = _IdInformation;
    this.EntityReference = _EntityReference;
    this.CodeEntity = _CodeEntity;
    this.Users = _users;
  }
}
