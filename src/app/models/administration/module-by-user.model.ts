import { Resource } from '../shared/ressource.model';
import { Module } from './module.model';
import { User } from './user.model';

export class ModuleByUser extends Resource {
  IdModule: string;
  IdUser: number;
  IsActive: boolean;
  IsVisible: boolean;
  TransactionUserId?: number;
  IdModuleNavigation: Module;
  IdUserNavigation: User;
  IsIndeterminate: boolean;
  IsToCheckModule: boolean;
}
