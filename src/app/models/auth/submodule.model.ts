import {Permission} from './permission.model';
import {Checkable} from './checkable.model';

export class SubModule extends Checkable {
  id: number;
  code: string;
  permissions: Permission [];
  items: Permission [];
}
