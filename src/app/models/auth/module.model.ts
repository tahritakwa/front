import {Checkable} from './checkable.model';
import {SubModule} from './submodule.model';

export class Module extends Checkable {
  id: number;
  code: string;
  subModules: SubModule [];
  items: SubModule [];
}
