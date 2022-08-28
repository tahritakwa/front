import {Permission} from './permission.model';
import {Checkable} from './checkable.model';

export class MenuPermission extends Checkable {
  id: number;
  code: string;
  label: string;
  actionPermissions: Permission [];
}
