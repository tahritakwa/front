import { Resource } from '../shared/ressource.model';
import { Module } from './module.model';

export class ModuleConfig extends Resource {
  IdRoleConfig: number;
  IdModule: string;
  IsActive: boolean;
  IsVisible: boolean;
  IdModuleNavigation: Module;
  IsIndeterminate: boolean;
  IsToCheckModule: boolean;
  IsToDisable: boolean;
}
