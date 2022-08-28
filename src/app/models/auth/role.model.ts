import {Permission} from './permission.model';

export class Role {
  Id: number;
  Code: string;
  Label: string;
  Permissions: Array<Permission>;
  CompanyId: number;
}

export class RoleDto {
  Id: number;
  Code: string;
  Label: string;
  Permissions: Array<number>;
  CompanyId: number;
  CompanyCode: string;
}
