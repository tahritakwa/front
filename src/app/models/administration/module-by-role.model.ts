import { Resource } from '../shared/ressource.model';
import { Module } from './module.model';

export class ModuleByRole extends Resource {
  IdRole: number;
  IdModule: string;
  IsActive: boolean;
  IsVisible: boolean;
  IdModuleNavigation: Module;
  IsIndeterminate: boolean;
  IsToCheckModule: boolean;
}
